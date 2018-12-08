This project is a multithreaded cache simulator I made in Fall of 2018. It can simulate up to 4 cores. Because of the rather inefficient bus snooping protocol, there is a noticable increase in the miss rate when simulating a higher core count.

Due to the inability of C++ to handle asynchronous thread communication, each cache uses a polling-based method to check for invalidations coming in from other caches. Before the next read or write, the cache will check a shared memory location for addresses that have been recently written to by other caches. It will check to see if it has a block in memory with a matching address, and if it does it will invalidate that block.

Here is a list of the configuration options available:
- Number of indices (each index corresponds to a modular equivalence class)
- Block Size
- Level of associativity
- Replacement policy (Random or Least Recently used)
- Write Policy (Write Through or Write Back)
- Cache Access Cycles (how long it takes for a read or write to get from the core to the cache and back)
- Memory Access Cycles (how long it takes for a read or write to get from cache to main memory)

If this were a higher quality simulator, it would assume differing amounts of time for reads than it would for writes. But alas, that was beyond the scope of this project.
