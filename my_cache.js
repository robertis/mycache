

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
    var size = 20,
        count = 0,
	ttl = 3600,
	entries = {};
    

    var _get = function(key){
	return entries[key];
    }

    var _set = function(key,val){
        //TODO : add LRU and timout logic
        if(entries[key] === undefined){
	    count++;
	}
	entries[key]=val;
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
	delete entries[key];
	count--;
    }

    var _getCacheSize = function(){
	return util.getObjectSize(entries);
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


//Usage
var theCache = new MYCACHE.modules.cache.lru();

theCache.set('def','123aa');
theCache.set('def1','123bb');
theCache.set('def2','123cc');

console.log('def ='+theCache.get('def'));
console.log('def1 ='+theCache.get('def1'));
console.log('def2 ='+theCache.get('def2'));

