/*
	Cache Simulator Implementation by Justin Goins
	Oregon State University
	Fall Term 2018
*/

#ifndef _CACHESTUFF_H_
#define _CACHESTUFF_H_
#include <vector>

enum class ReplacementPolicy {
	Random,
	LRU
};

enum class WritePolicy {
	WriteThrough,
	WriteBack
};

// UNIONS ARE BAD. USE INHERITANCE INSTEAD
enum class CoherenceProtocol {
	Simple,
	MESI
};

enum class MesiState {
	Modified,
	Exclusive,
	Shared,
	Invalid
};

enum class Valid{
	False,
	True
};

enum class Dirty{
	False,
	True
};

struct SimpleState{
	bool valid;
	bool dirty;
};

struct CacheState{
	SimpleState simpleState;
	MesiState mesiState;
};

struct CacheBlock{
	CacheState cacheState;
	unsigned long int tag;
};

// structure to hold information from the configuration file
struct ConfigInfo {
	unsigned int numberSets;    // how many sets are in the cache
	unsigned int blockSize;     // size of each block in bytes
	unsigned int associativity; // the level of associativity (N)
	ReplacementPolicy rp;
	WritePolicy wp;
	unsigned int cacheAccessCycles;
	unsigned int memoryAccessCycles;
	CoherenceProtocol cp;
};

// this structure is filled with information about each memory access
struct CacheResponse {
	bool hit;            // did this memory operation encounter a hit?
	bool mesiHit;        // block was in another cache
	bool eviction;       // did this memory operation involve an eviction?
	bool dirtyEviction;  // was the evicted block marked as dirty?
	unsigned int cycles; // how many clock cycles did this operation take?
};
#endif //CACHESTUFF
