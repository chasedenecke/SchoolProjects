/*
	Cache Simulator Implementation by Justin Goins
	Oregon State University
	Fall Term 2018
*/

#ifndef _CACHECONTROLLER_H_
#define _CACHECONTROLLER_H_

#include "CacheStuff.h"
#include <string>
#include <vector>
#include <mutex>
#include <list>
#include <condition_variable>
#include <atomic>


class CacheController {
	private:
		struct AddressInfo {
			unsigned long int tag;
			unsigned int setIndex;
		};
		unsigned int numByteOffsetBits;
		unsigned int numSetIndexBits;
		unsigned int globalCycles;
		unsigned int globalHits;
		unsigned int globalMisses;
		unsigned int globalEvictions;
		unsigned int id; // thread id. Thread X controls cache X.
		std::string inputFile, outputFile;
		std::vector<std::list<CacheBlock>> cache;
		std::mutex *mainBus;
		std::mutex *localBusses;
		std::mutex *numActiveThreadsAccess;
		std::condition_variable *cv;
		std::atomic<int> *numActiveThreads;
		std::vector<std::list<unsigned long>> *invalidationQueues;
		ConfigInfo ci;

		// function to allow read or write access to the cache
		void cacheAccess(CacheResponse*, bool, unsigned long);

		// function that can compute the index and tag matching a specific address
		AddressInfo getAddressInfo(unsigned long);

		// compute the number of clock cycles used to complete a memory access
		void updateCycles(CacheResponse*, bool);

		// processes a read operation from the tracefile
		void modifyCache(CacheResponse*, AddressInfo, bool isWrite);

		// pushes addresses to invalidate each cache's invalidation queue for them to read and process
		void broadcastInvalidations(unsigned long);

		// Reads the invalidation queue belonging to this cache and invalidates any cache blocks with matching addresses
		void invalidateCacheEntry(CacheResponse*);

	public:
		CacheController(int, ConfigInfo, std::string, std::mutex*, std::vector<std::list<unsigned long>>*, std::mutex*, std::mutex*, std::condition_variable*, std::atomic<int>*);
		void runTracefile();
};

#endif //CACHECONTROLLER
