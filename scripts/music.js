
    var apikey = "8gn2qubry7hg4xj4meb8hpuv";
    var secret = "WCZpfUvnrX";

$(document).ready(function() {
    // send off the query
    var baseUrl = "http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1";

    //http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1%2Famgvideo%2Ffilterbrowse%3Fapikey%3D8gn2qubry7hg4xj4meb8hpuv%26sig%3D16c6f3969f8a57d688dc44f1907a737a%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson
    // construct the uri with our apikey
    var musicUrl = 'http://jsonp.jit.su/?callback=albumCallback&url='+ baseUrl + '%2Fmusic%2Ffilterbrowse%3Fapikey%3D' + apikey + '%26sig%3D' + genSig(apikey, secret)+ "%26entitytype%3Dalbum%26filter%3DreleaseDate%253E20121003%26format%3Djson";

    console.log(musicUrl);

    $.ajax({
        url: musicUrl,
        dataType: "jsonp",
        success: albumCallback
    });
});


var entry, day, month, year, date, title;

 
// callback for when we get back the results
function albumCallback(data) {
    var albums = data.searchResponse.results;
    albums.forEach(function(album) {
        date = album.album.originalReleaseDate.split("-");
        day = date[2];
        month = date[1];
        year = date[0];
        title = album.album.title;
        imageUrl = 'http://jsonp.jit.su/?callback=imageCallback&url=' + album.album.imagesUri + '%26sig%3D' + genSig(apikey, secret);
        $.ajax({
            url: imageUrl,
            dataType: "jsonp",
            success: imageCallback
        });
        console.log(imageUrl);
        entry = new Entry(title, month, day, year,  " by " + album.album.primaryArtists[0].name + " - Album Out: ", album.album.imagesUri);
        entries.push(entry);
    });
    entries = entries.sort(entryCompare);
    entries.forEach(createEntry);
}

function imageCallback(data){
    var found = false;
    imageCount++;
    if(imageCount === albumNum){
        callback();
    }
    data.images.forEach(function(image){
        if(found === false && image.height >= 100){
            var poster = image.url;
        }
    });
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