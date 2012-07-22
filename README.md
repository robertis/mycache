mycache
=======

LRU cache implementation in javascript

Examples :


var theCache = new MYCACHE.modules.cache.lru();

var newCache = new MYCACHE.modules.cache.lru( { TTL:4605, SIZE:65 } );

theCache.set('def','123');


var val = newCache.get('def');

console.log('val  = '+val);

LRU algorithm :

2 maps are maintained : 
    1) entries : Key-> (Value, ts)
    2) timeStampMap : ts -> key
Everytime a key is accessed, both maps are updated with the new timestamp.
During eviction, the we find the first entry in the timeStampMap and remove it.
We also remove the entry from entries map


This kind of works , but if more than 1 elements are added around the same time,
 then multiple entries map to 1 entry in the timeStampMap, which causes the eviction to funciton incorrectly.

