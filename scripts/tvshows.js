$(document).ready(function() {
    // send off the query
    var apikey = "8gn2qubry7hg4xj4meb8hpuv";
    var secret = "WCZpfUvnrX";
    var baseUrl = "http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1";

    //http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1%2Famgvideo%2Ffilterbrowse%3Fapikey%3D8gn2qubry7hg4xj4meb8hpuv%26sig%3D16c6f3969f8a57d688dc44f1907a737a%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson
    // construct the uri with our apikey
    var tvUrl = 'http://jsonp.jit.su/?callback=tvCallback&url='+ baseUrl + '%2Famgvideo%2Ffilterbrowse%3Fapikey%3D' + apikey + '%26sig%3D' + genSig(apikey, secret)+ "%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson";

    console.log(tvUrl);

    $.ajax({
        url: tvUrl,
        dataType: "jsonp",
        success: tvCallback
      });
});

var albumNum = 0;
 
// callback for when we get back the results
function tvCallback(data) {
    var shows = data.searchResponse.results;
    var entry, day, month, year, date, title;
    albumNum = shows.length();
    shows.forEach(function(show) {
        month = 0;
        day = 0;
        year = show.movie.releaseYear;
        title = show.movie.title.replace(" [TV Series]", "");
        entry = new Entry(title, month, day, year, "On TV: ", show.movie.imagesUri);
        entries.push(entry);
        imageUrl = 'http://jsonp.jit.su/?callback=imageCallback&url=' + album.album.imagesUri + '%26sig%3D' + genSig(apikey, secret);
        $.ajax({
            url: imageUrl,
            dataType: "jsonp",
            success: imageCallback
        });
    });
    entries = entries.sort(entryCompare);
    entries.forEach(createEntry);
}

function imageCallback(data){

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