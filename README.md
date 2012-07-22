mycache
=======

LRU cache implementation in javascript

Examples :


var theCache = new MYCACHE.modules.cache.lru();

var newCache = new MYCACHE.modules.cache.lru( { TTL:4605, SIZE:65 } );

theCache.set('def','123');


var val = newCache.get('def');

console.log('val  = '+val);

TTL is time to live in milliseconds and SIZE is cache size in bytes(approx).

LRU algorithm :

2 maps are maintained : 
    1) entries : Key-> Value
    2) timeStampMap : Key -> ts
Everytime a key is accessed, timeStampMap is updted to store new timeStamp.
During eviction, the we find the entry in timeStampMap with the smallest value.
We then remove the entries from both maps with the key.

The two maps could have been combined into 1 like Key -> (Value,ts), but keeping them separate 
might optimize a bit by avoiding another object lookup.
