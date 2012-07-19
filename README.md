mycache
=======

LRU cache implementation in javascript

Examples :


var theCache = new MYCACHE.modules.cache.lru();

var newCache = new MYCACHE.modules.cache.lru( { TTL:4605, SIZE:65 } );

theCache.set('def','123');


var vall = newCache.get('def');

console.log('vall  = '+vall);


