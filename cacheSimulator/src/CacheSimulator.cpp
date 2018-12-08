/*
	Cache Simulator Implementation by Justin Goins and Chase Denecke
	Oregon State University
	Fall Term 2018
*/

#include "CacheSimulator.h"
#include "CacheStuff.h"
#include "CacheController.h"

#include <iostream>
#include <fstream>
#include <thread>

using namespace std;

mutex mainBus;
mutex localBusses[4]; // array of mutexes used to control access to the invalidation queues.

vector<list<unsigned long>> invalidationQueues(4); // Each thread checks this vector before reading or writing.
								// If the index corresponding to its thread number contains a "true" value,
								// it reads the value from "address to invalidate" field and if that entry is
								// present in its cache, it invalidates it. Afterwards, it sets its value
								// in the vector to false and continues with its read/write/load.

/*
	This function creates the cache and starts the simulator.
	Accepts core ID number, configuration info, and the name of the tracefile to read.
*/
void initializeCache(int id, ConfigInfo config, string tracefile, mutex *mainBus, vector<list<unsigned long>> *invalidationQueues, mutex *localBusses, mutex *numActiveThreadsAccess, condition_variable *cv, atomic<int> *numActiveThreads) {
	CacheController singlecore = CacheController(id, config, tracefile, mainBus, invalidationQueues, localBusses, numActiveThreadsAccess, cv, numActiveThreads);
	singlecore.runTracefile();
}

/*
	This function accepts a configuration file and a trace file on the command line.
	The code then initializes a cache simulator and reads the requested trace file(s).
*/
int main(int argc, char* argv[]) {
	mutex numActiveThreadsAccess;
	condition_variable cv;
	atomic<int> numActiveThreads;
	numActiveThreads = 0; // Apparently declaration and binding of atomics in the same line isn't allowed. Go figure.
	
	ConfigInfo config;
	if (argc < 3) {
		cerr << "You need at least two command line arguments. You should provide a configuration file and at least one trace file." << endl;
		return 1;
	}

	

	// read the configuration file
	ifstream infile(argv[1]);
	unsigned int tmp;
	infile >> config.numberSets;
	infile >> config.blockSize;
	infile >> config.associativity;
	infile >> tmp;
	config.rp = static_cast<ReplacementPolicy>(tmp);
	infile >> tmp;
	config.wp = static_cast<WritePolicy>(tmp);
	infile >> config.cacheAccessCycles;
	infile >> config.memoryAccessCycles;
	infile >> tmp;
	config.cp = static_cast<CoherenceProtocol>(tmp);
	infile.close();
	
	// Examples of how you can access the configuration file information
	cout << config.numberSets << " sets with " << config.blockSize << " bytes in each block. N = " << config.associativity << endl;

	if (config.rp == ReplacementPolicy::Random)
		cout << "Using random replacement protocol" << endl;
	else
		cout << "Using LRU protocol" << endl;
	
	if (config.wp == WritePolicy::WriteThrough)
		cout << "Using write-through policy" << endl;
	else
		cout << "Using write-back policy" << endl;

	// For multithreaded operation you can do something like the following...
	// Note that this just shows you how to launch a thread and doesn't address
	// the cache coherence problem.

	unsigned int numThreads = argc - 2;
	vector<thread> threads;
	for(unsigned int  i = 0; i < numThreads; i++){
		threads.push_back(thread(initializeCache, i, config, string(argv[i+2]), &mainBus, &invalidationQueues, localBusses, &numActiveThreadsAccess, &cv, &numActiveThreads));
		threads[i].detach();
		numActiveThreads++;
	}
	
	// Several of the variables created in this thread and passed to child threads with thread(initializeCache ...)
	// must not go out of scope until all child threads have finished executing. Since the child threads
	// take longer to execute than this (parent) thread, we must block the main thread from terminating
	// until all child threads have finished execution. We do this with the counting semaphore numActiveThreads,
	// which is initially set to the number of child threads, then decremented by each child thread 
	// when exiting. The main thread will only exit when numActiveThreads reaches 0.
	// Concurrent access of the counting semaphore is prevented by the mutex numActiveThreadsAccess.
	unique_lock<mutex> lock(numActiveThreadsAccess);
	cv.wait(lock, [&numActiveThreads](){ return numActiveThreads == 0;});

	return 0;
}

// https://austingwalters.com/multithreading-semaphores/