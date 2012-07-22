

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
MYCACHE.namespace('MYCACHE.modules.util');

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


//utilities module
MYCACHE.modules.util = (function(){

    var _getObjectSize = function(obj){
	var jsonText = JSON.stringify(obj);
	return jsonText.length;
    }

    return {
        getObjectSize : _getObjectSize
    }
	
}());

//LRU cache impl
MYCACHE.modules.cache.lru = (function(myCache, global){

    var logger = myCache.modules.common.logger;
    var util = myCache.modules.util;
    var size = 65000,
        count = 0,
	ttl = 3600000,
	timeStampMap = {} //key -> ts
	entries = {}; //key -> value
    

    var _get = function(key){
        var entry = entries[key];
	if(entry === undefined) return null;
	if(entry != null){
	    var currTime = new Date().getTime();
	    var oldTimeStamp = timeStampMap[key];
	    if(currTime - oldTimeStamp > ttl){
	        //too old, remove it...
	        _remove(key);
	        return null;
	    }
	    //update the timeStamp
	    timeStampMap[key] = currTime;
	}
	return entry;
    }

    var _set = function(key,val){
        //TODO : add LRU and timout logic
        if(entries[key] === undefined){
	    count++;
	}
	entries[key]=val;
	//add in entry in timeStampMap
	var currentTime = new Date().getTime();
	timeStampMap[key] = currentTime;

	var currCacheSize = _getCacheSize();
	if(currCacheSize > size){
	    _evict();
	}
    }

    var _getCount = function(){
	return count;
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
        if(entries[key] === undefined){
	    return;
	}
	delete timeStampMap[key];
	delete entries[key];
	count--;
    }

    var _getCacheSize = function(){
	return util.getObjectSize(entries);
    }

    var _evict = function(){
	//find the element with the minimum key from timeStamp map and remove it from both maps
	var minKey = _findElemWithMinTs();
	if(minKey !== undefined){
	    delete entries[minKey];
	    delete timeStampMap[minKey];
	    count--;
	}
    }

    //this is kinda lame, but it works,
    //takes O(n) time, but happens only in eviction
    var _findElemWithMinTs = function(){
	var minTs=Number.MAX_VALUE, 
	    itsKey;
	for(var i in timeStampMap){
	    var ts = timeStampMap[i];
	    if(ts < minTs) {
		minTs = ts;
		itsKey = i;
	    }
	}
	return itsKey;
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
	getCount : _getCount,
	getTtl : _getTtl,
	setTtl : _setTtl,
	getSize : _getSize,
	setSize : _setSize
    }
    return _;

}(MYCACHE, this));


//Usage & Tests
//var theCache = new MYCACHE.modules.cache.lru();
/*
var theCache= new MYCACHE.modules.cache.lru( { TTL:4605, SIZE:284 } );

theCache.set('def','123aa');
theCache.set('def1','123bb');
theCache.set('def2','123cc');
theCache.set('def3','123cc1');
theCache.set('def4','123cc2');
theCache.set('def5','123cc3');
theCache.set('def6','123cc4');
theCache.set('def7','123cc5');
theCache.set('def8','123cc6');
theCache.set('def9','123cc7');
theCache.set('def16','123cc8');
theCache.set('def26','123cc9');
theCache.set('def36','123cc10');

console.log('def ='+theCache.get('def'));
console.log('def1 ='+theCache.get('def1'));
console.log('def2 ='+theCache.get('def2'));
console.log('def3 ='+theCache.get('def3'));
console.log('def4 ='+theCache.get('def4'));
console.log('def5 ='+theCache.get('def5'));
console.log('def6 ='+theCache.get('def6'));
console.log('def7 ='+theCache.get('def7'));
console.log('def8 ='+theCache.get('def8'));
console.log('def9 ='+theCache.get('def9'));
console.log('def16 ='+theCache.get('def16'));
console.log('def26 ='+theCache.get('def26'));

setTimeout(
    function() { 
	//generateOutput(true);  
	console.log('def36 ='+theCache.get('def36'));
    },  
    4599  
); 
*/


