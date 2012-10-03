var apikey = "8gn2qubry7hg4xj4meb8hpuv";
var secret = "WCZpfUvnrX";
var baseUrl = "http://api.rovicorp.com/search/v2.1";
 
// construct the uri with our apikey
var tvUrl = 'http://hkr.me:8001/?jsonp=tvCallback&url='+ baseUrl + '/amgvideo/filterbrowse?apikey=' + apikey + '&sig=' + genSig(apikey, secret)+ "&entitytype=tvseries&filter=releaseYear%62;2011&format=json";

var entries = [];
 
$(document).ready(function() {
// send off the query

console.log(tvUrl);

//$.getJSON("http://hkr.me:8001/?url="+ tvUrl + "&entitytype=tvseries&filter=releaseYear>2011&format=json&callback=?", tvCallback);
 if (window.jsonpCallbackId === undefined)
            window.jsonpCallbackId = 0
        window.jsonpCallbackId ++;
    var callbackName = "jsonpcallback_" + window.jsonpCallbackId;
    window[callbackName] = function(json){
        delete window[callbackName];
        callback(json);
    }
document.write(    "<script " +
"src=" + "./local/fullschedule.xml>" +
"</script>");
});

 
// callback for when we get back the results
function tvCallback(data) {
   console.log("hello");
}

function jsonp(data) {
   console.log(data);
}

function genSig(api, s) {
    var apikey = api;
    var secret = s;
    var curdate = new Date();
    var gmtstring = curdate.toGMTString();
    var utc = Date.parse(gmtstring) / 1000;
    var md5hash = hex_md5(apikey + secret + utc);
    return md5hash;
}