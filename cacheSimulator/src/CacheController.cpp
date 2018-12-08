/*
	Cache Simulator Implementation by Justin Goins and Chase Denecke
	Oregon State University
	Fall Term 2018
*/

#include "CacheController.h"
#include <iostream>
#include <fstream>
#include <regex>
#include <cmath>
#include <random>

using namespace std;

CacheController::CacheController(int id, ConfigInfo ci, string tracefile, mutex *mainBus, vector<list<unsigned long>>* invalidationQueues, mutex *localBusses, mutex *numActiveThreadsAccess, condition_variable *cv, atomic<int> *numActiveThreads) {
	// store the configuration infol
	this->ci = ci;
	this->inputFile = tracefile;
	cout << "this->inputFile = " << this->inputFile << endl;
	this->outputFile = this->inputFile + ".out";
	// compute the other cache parameters
	this->numByteOffsetBits = log2(ci.blockSize);
	this->numSetIndexBits = log2(ci.numberSets);
	// initialize the counters
	this->globalCycles = 0;
	this->globalHits = 0;
	this->globalMisses = 0;
	this->globalEvictions = 0;
	this->id = (unsigned int)id;
	this->mainBus = mainBus;
	this->localBusses = localBusses;
	this->invalidationQueues = invalidationQueues;
	this->numActiveThreadsAccess = numActiveThreadsAccess;
	this->cv = cv;
	this->numActiveThreads = numActiveThreads;

	// create your cache structure
	// ...
	this->cache.resize(this->ci.numberSets);
	for(unsigned int i = 0; i < this->ci.numberSets; ++i){
		for(unsigned int j = 0; j < this->ci.associativity; ++j){
			this->cache[i].emplace_back();
			this->cache[i].back().cacheState.simpleState.valid = false;
			this->cache[i].back().cacheState.simpleState.dirty = false;
			this->cache[i].back().cacheState.mesiState = MesiState::Invalid;
			this->cache[i].back().tag = 0;

			// list<CacheBlock>::iterator it = cache[i].end();
			// --it;
			// cout << "cache[" << i << "]" << "[" << j << "]" << ".cacheState.simpleState.valid = " << static_cast<int>(it->cacheState.simpleState.valid) << endl;
		}
	}
}

/*
	Starts reading the tracefile and processing memory operations.
*/
void CacheController::runTracefile() {
	cout << "Input tracefile: " << inputFile << endl;
	cout << "Output file name: " << outputFile << endl;

	// process each input line
	string line;
	// define regular expressions that are used to locate commands
	regex commentPattern("==.*");
	regex instructionPattern("I .*");
	regex loadPattern(" (L )(.*)(,[[:digit:]]+)$");
	regex storePattern(" (S )(.*)(,[[:digit:]]+)$");
	regex modifyPattern(" (M )(.*)(,[[:digit:]]+)$");
	// open the output file
	ofstream outfile(outputFile);
	// open the output file
	ifstream infile(inputFile);
	// parse each line of the file and look for commands
	while (getline(infile, line)) {
		// these strings will be used in the file output
		string opString, activityString;
		smatch match; // will eventually hold the hexadecimal address string
		unsigned long int address;
		// create a struct to track cache responses
		CacheResponse response;
		response.hit = false;
		response.mesiHit = false;
		response.eviction = false;
		response.dirtyEviction = false;
		response.cycles = 0;

		// ignore comments
		if (std::regex_match(line, commentPattern) || std::regex_match(line, instructionPattern)) {
			// skip over comments and CPU instructions
			continue;
		} else if (std::regex_match(line, match, loadPattern)) {
			// cout << "Found a load op!" << endl;
			istringstream hexStream(match.str(2));
			hexStream >> std::hex >> address;
			outfile << match.str(1) << match.str(2) << match.str(3);
			cacheAccess(&response, false, address);
			outfile << " " << response.cycles << (response.hit ? " hit" : " miss") << (response.eviction ? " eviction" : "");
		} else if (std::regex_match(line, match, storePattern)) {
			// cout << "Found a store op!" << endl;
			istringstream hexStream(match.str(2));
			hexStream >> std::hex >> address;
			outfile << match.str(1) << match.str(2) << match.str(3);
			cacheAccess(&response, true, address);
			outfile << " " << response.cycles << (response.hit ? " hit" : " miss") << (response.eviction ? " eviction" : "");
		} else if (std::regex_match(line, match, modifyPattern)) {
			// cout << "Found a modify op!" << endl;
			istringstream hexStream(match.str(2));
			hexStream >> std::hex >> address;
			outfile << match.str(1) << match.str(2) << match.str(3);
			// first process the read operation
			cacheAccess(&response, false, address);
			string tmpString; // will be used during the file output
			tmpString.append(response.hit ? " hit" : " miss");
			tmpString.append(response.eviction ? " eviction" : "");
			unsigned long int totalCycles = response.cycles; // track the number of cycles used for both stages of the modify operation
			// now process the write operation
			cacheAccess(&response, true, address);
			tmpString.append(response.hit ? " hit" : " miss");
			tmpString.append(response.eviction ? " eviction" : "");
			totalCycles += response.cycles;
			outfile << " " << totalCycles << tmpString;
		} else {
			throw runtime_error("Encountered unknown line format in tracefile.");
		}
		outfile << endl;
	}
	// add the final cache statistics
	outfile << "Hits: " << globalHits << " Misses: " << globalMisses << " Evictions: " << globalEvictions << endl;
	outfile << "Cycles: " << globalCycles << endl;

	infile.close();
	outfile.close();

	// This thread is about to exit. To let the parent thread know this, we lock the mutex
	// to access the shared variable that contains the number of active threads, decrement it
	// and notify main with cv->notify_all(). notify_all() causes main to check the value of numActiveThreads
	lock_guard<mutex> lk(*(this->numActiveThreadsAccess));
	(*(this->numActiveThreads))--;
	this->cv->notify_all();
}

/*
	This function allows us to read or write to the cache.
	The read or write is indicated by isWrite.
*/
void CacheController::cacheAccess(CacheResponse* response, bool isWrite, unsigned long int address) {
	
	// determine the index and tag
	AddressInfo ai = getAddressInfo(address);
	
	

	// Process and clear any pending invalidations of cache blocks generated by other threads
	invalidateCacheEntry(response); 

	// Read from and write to the actual cache
	modifyCache(response, ai, isWrite);

	
	// The for loop below is used for troubleshooting issues with the cache. 
	// It prints contents of entire cache after every read or write.
	
	// for(unsigned int i = 0; i < this->ci.numberSets; i++){
	// 	for(list<CacheBlock>::iterator it = cache[i].begin(); it != this->cache[i].end(); ++it){
	// 		cout << it->cacheState.simpleState.valid << " " << it->cacheState.simpleState.dirty << " " << it->tag << "\t";
	// 	}
	// 	cout << endl;
	// }

	if(isWrite)
		broadcastInvalidations(address);
	

	updateCycles(response, isWrite);
	
	// for(int i = 0; i < 4; i++){ // I know I should pass the number of threads in by reference and use it for this loop, but I am lazy.
	// 	this->localBusses[i].lock();
	// 	for(auto j = this->invalidationQueues[i].begin(); j != this->invalidationQueues[i].end(); ++j){
	// 		cout << i << " = " << (*j) << endl;
	// 	}
	// 	this->localBusses[i].unlock();
	// }
}

/*
	Calculate the block index and tag for a specified address.
*/
CacheController::AddressInfo CacheController::getAddressInfo(unsigned long int address) {
	AddressInfo ai;
	unsigned long blockAddress = address/this->ci.blockSize;
	ai.setIndex = blockAddress % this->ci.numberSets;
	ai.tag      = blockAddress / this->ci.numberSets;
	return ai;
}

/* 	
	Reads the first entry from invalidationQueue[id of the cache], checks to see if there is a corresponding entry
	in the cache. If there is a matching entry, this function invalidates that CacheBlock and moves it to the tail
	of the list. Since the queue of invalidations is a shared memory location, this function must lock the
	mutex to access it before doing any operations.
*/
void CacheController::invalidateCacheEntry(CacheResponse *response){


	this->localBusses[this->id].lock();

	for(auto iqIterator = (*this->invalidationQueues)[this->id].begin(); iqIterator != (*this->invalidationQueues)[this->id].end(); ++iqIterator){
		AddressInfo ai = getAddressInfo(*((*this->invalidationQueues)[this->id].begin())); // Get the index and tag for the address
		for(list<CacheBlock>::iterator it = cache[ai.setIndex].begin(); it != this->cache[ai.setIndex].end(); ++it){ // Search the line in the cache for a matching entry
			if(it->tag == ai.tag){
				it->cacheState.simpleState.valid = false;
				cache[ai.setIndex].splice(cache[ai.setIndex].end(), cache[ai.setIndex], it);
				response->cycles += this->ci.cacheAccessCycles;
			}
		}
	}
	(*this->invalidationQueues)[this->id].clear();

	this->localBusses[this->id].unlock();
}

/*
	This function is called once for every read or write command and twice for every modify command
	in the tracefile. It modifies the cache based on the address of the read or modify operation.
*/
void CacheController::modifyCache(CacheResponse *response, AddressInfo ai, bool isWrite){
	// Iterate through the cache line checking valid bit and tag.
	response->eviction = true;
	for(list<CacheBlock>::iterator it = cache[ai.setIndex].begin(); it != this->cache[ai.setIndex].end(); ++it){
		if(it->cacheState.simpleState.valid == true){
			if(it->tag == ai.tag){
				response->hit = true;
				cache[ai.setIndex].splice(cache[ai.setIndex].begin(), cache[ai.setIndex], it); // Move the read block to the head of the list
				response->eviction = false;
				if(isWrite)
					if(this->ci.wp == WritePolicy::WriteBack)
						it->cacheState.simpleState.dirty = true;
				break;
			}
		}
		else{ 	// If we find a block with valid set to false, we know there are no more valid blocks beyond it.
				// Thus we know this operation will be a miss and we put the newly read block at the back of 
				// the cache line list. Lastly, since this block is freshly read, we put it at the front 
				// of the cache line list to signify that it was most recently accessed.
			response->hit = false;
			response->eviction = false;
			it->tag = ai.tag;
			it->cacheState.simpleState.valid = true;
			cache[ai.setIndex].splice(cache[ai.setIndex].begin(), cache[ai.setIndex], it); // Move the read block to the head of the list
			if(isWrite)
				if(this->ci.wp == WritePolicy::WriteBack)
					it->cacheState.simpleState.dirty = true;
			return;
		}
	}
	if(response->eviction){ // If cache line is full and a block with a matching tag was not found
		// cout << "eviction" << endl;
		list<CacheBlock>::iterator it = cache[ai.setIndex].begin();

		// If the replacement policy is random, we pick a random block from the cache line in question,
		// evict it from the cache, and replace it with the block we want to read/write to the cache.
		// We then place the new block at the front of the cache line to indicate its recent access.
		if(this->ci.rp == ReplacementPolicy::Random){
			mt19937 rng;
			rng.seed(random_device()());
			std::uniform_int_distribution<mt19937::result_type> randomBlock(0,this->ci.associativity - 1);
			for(long unsigned int i = 0; i < randomBlock(rng); ++i){ ++it;} // Iterate through the cache line until we arrive at a randomly chosen block
		}
		else{ 										// If replacement scheme is least recently used
			it = this->cache[ai.setIndex].end(); // Set the iterator to point to the last block in the cache line, since that's the least recently used block in the line
			--it;
		}
		// Check whether the evicted block was dirty
		if(it->cacheState.simpleState.dirty == true)
			response->dirtyEviction = true;

		// A read from or a write to main memory will synchronize cache and main memory, 
		// guaranteeing that the current block is not dirty.
		if(!isWrite || this->ci.wp == WritePolicy::WriteThrough)
			it->cacheState.simpleState.dirty = false;

		it->tag = ai.tag; //Set the tag of the block
		if(isWrite)
			if(this->ci.wp == WritePolicy::WriteBack)
				it->cacheState.simpleState.dirty = true;
		cache[ai.setIndex].splice(cache[ai.setIndex].begin(), cache[ai.setIndex], it); // Since we just referenced this cache entry, move it to the head of the list
	}
}

/*
	To keep the caches in synch, we need each cache to broadcast to the others when it makes a write.
	The other caches will respond by checking themselves to see if they hold a block with an address
	that matches the one provided by this cache. If they do, they will invalidate that block.
*/
void CacheController::broadcastInvalidations(unsigned long address){
	this->mainBus->lock(); // Prevent two caches from using the main bus at the same time. Necessary to simulate operation with a single bus
	
	for(int i = 0; i < 4; i++){ // I know I should pass the number of threads in by reference and use it for this loop, but I am lazy.
		if(i != (int)this->id){ // Since we don't want to invalidate our own cache, don't add the address to our own queue
			this->localBusses[i].lock();
			(*this->invalidationQueues)[i].push_back(address);
			// cout << "this->invalidationQueues[" << this->id << "].back() = " << this->invalidationQueues[i].back() << endl;
			this->localBusses[i].unlock();
		}
	}
	
	this->mainBus->unlock();
}

/*
	Compute the number of cycles used by a particular memory operation.
	This will depend on the cache write policy. Time calculations are
	pretty optimistic becauase they don't take into account the time
	each cache spends waiting for the main bus. I guess for we are assuming
	for the purposes of school that the bus has constant latency regardless
	of core count. It's a magic school bus.
*/
void CacheController::updateCycles(CacheResponse* response, bool isWrite) {

	response->cycles = this->ci.cacheAccessCycles; // Every operation takes at least cacheAccessCycles

	if(isWrite){
		if(this->ci.wp == WritePolicy::WriteThrough)
			response->cycles += this->ci.memoryAccessCycles; // WriteThrough adds memoryAccessCycles if operation is a write
	}
	if(!isWrite){
		if(!response->hit)
			response->cycles += this->ci.memoryAccessCycles; // Miss adds memoryAccessCycles if operation is a read
	}
	if(response->dirtyEviction) 	
		response->cycles += this->ci.memoryAccessCycles; // dirty eviction always adds memoryAccessCycles
	
	this->globalCycles += response->cycles;

	if(response->hit)
		this->globalHits++;
	else
		this->globalMisses++;
	if(response->eviction)
		this->globalEvictions++;
	// Cycles added by the time it takes a cache to process invalidations is handled by invalidateCacheEntry
}