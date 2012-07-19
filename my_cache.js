

var MYCACHE = MYCACHE || {};

//namespacing function 
//(borrowed from the book Javascript Patterns by Stoyan Stefanov)
MYCACHE.namespace = function (path) {
    var parts = path.split('.'),
	container = MYCACHE,
	len = parts.length,
	i;

    if (parts[0] === "MYCACHE") {
	parts = parts.slice(1);
    }

    for (i = 0; i < len; i += 1) {
	if (typeof container[parts[i]] === "undefined") {
	    container[parts[i]] = {};
	}
	container = container[parts[i]];
    }
    return container;
};

MYCACHE.namespace('MYCACHE.modules.common.logger');
MYCACHE.namespace('MYCACHE.modules.cache.lru');

MYCACHE.modules.common.logger = (function(){
    var logLevel = 0,
        logPrefix = 'MYCACHE::LOGGER::';
    var _getLevel= function(){
        return logLevel;
    }
    var _log = function(msg){
        console.log(logPrefix+msg);
    }
    return { 
	getLogLvel : _getLevel,
	log : _log
    };
}());

//LRU cache impl
MYCACHE.modules.cache.lru = (function(myCache, global){

    var logger = myCache.modules.common.logger;
    var size = 20,
        count = 0,
	ttl = 3600,
	entries = [];
    
    var _get = function(key){
       logger.log('inside _get key = '+key);
       return entries[key];
    }

    var _set = function(key,val){
        //TODO : add LRU and timout logic
       var msg = 'inside _set key = '+key+' val = '+val;
       logger.log(msg);
       entries[key]=val;
       count++;
    }

    var _setSize = function(val){
        size = val;
    }
    var _getSize = function(){
       return size;
    }

    var _setTtl = function(val){
        ttl = val;
    }
    var _getTtl = function(){
       return ttl;
    }

    var _remove = function(key){
	delete entries[key];
	count++;
    }

    //the only reason for using function to export is to able to set TTL 
    //and SIZE(maximum capacity of the cache) of the cache during construction
    var _=function(arg){
	if(arg && arg.TTL){
	    ttl = arg.TTL;
	}
	if(arg && arg.SIZE){
	    size = arg.SIZE;
	}
    
    };
    _.prototype = {
        constructor : MYCACHE.modules.cache.lru,
	version : "0.1.0",
        get : _get,
	set : _set,
	remove : _remove,
	getTtl : _getTtl,
	setTtl : _setTtl,
	getSize : _getSize,
	setSize : _setSize
    }
    return _;

}(MYCACHE, this));


//usage..

var theCache = new MYCACHE.modules.cache.lru();
var otherCache = new MYCACHE.modules.cache.lru();
var newCache = new MYCACHE.modules.cache.lru( { TTL:4605, SIZE:65 } );

theCache.get('abc');
theCache.set('def','123');


var newTtl = theCache.getTtl();
console.log('ttl 1 = '+newTtl);

//theCache.setTtl(3611);
newTtl = theCache.getTtl();
console.log('ttl 2 = '+newTtl);
newTtl = otherCache.getTtl();
console.log('ttl 3 = '+newTtl);
var newSize = otherCache.getSize();
console.log('size 3 = '+newSize);


newTtl = newCache.getTtl();
newSize = newCache.getSize();
console.log('ttl 4 = '+newTtl);
console.log('size 4 = '+newSize);
//newCache.setTtl(5600);
newCache.setSize(38);
newTtl = newCache.getTtl();
newSize = newCache.getSize();
console.log('ttl 5 = '+newTtl);
console.log('size 5 = '+newSize);
var vall = newCache.get('def');
console.log('vall  = '+vall);
vall = newCache.get('def');
console.log('vall  2 = '+vall);
newCache.remove('def');
vall = newCache.get('def');
console.log('vall  3 = '+vall);


