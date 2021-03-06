var songKickApiKey;
var songKickBaseUrl;

$(document).ready(function() {
    // send off the query
    var apikey = "8gn2qubry7hg4xj4meb8hpuv";
    var secret = "WCZpfUvnrX";
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

    songKickApiKey = "AVNqr7bkPoxHFdu3";
    songKickBaseUrl = "http://api.songkick.com/api/3.0";

    var locationSearchUrl = songKickBaseUrl + "/search/locations.json?location=clientip&apikey=" + songKickApiKey + "&jsoncallback=areaSearchCallback";
    console.log(locationSearchUrl);
    $.ajax ({
        url: locationSearchUrl,
        dataType: "jsonp",
        success: areaSearchCallback
    });
});

var imageCount = 0;
var albumNum;
 
// callback for when we get back the results
function albumCallback(data) {
    var entry, day, month, year, date, title, band;
    var api_key = "69de64d9645edd7e1f9bb2e1edfef4f1";
    var albums = data.searchResponse.results;
    albumNum = albums.length;
    albums.forEach(function(album) {
        date = album.album.originalReleaseDate.split("-");
        day = date[2];
        month = date[1];
        year = date[0];
        title = album.album.title;
        band = album.album.primaryArtists[0].name;
        entry = new Entry(title, month, day, year,  " by " + band+ " - Album Out: ", "", "music");
        entries.push(entry);
        //http%3A%2F%2Fws.audioscrobbler.com%2F2.0%2F%3Fmethod%3Dalbum.getinfo%26api_key%3D69de64d9645edd7e1f9bb2e1edfef4f1%26artist%3DBrandy%26album%3DTwo%2520Eleven%26format%3Djson
        imageUrl = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&format=json&callback=imageCallback&api_key=' + api_key + '&artist=' + band + "&album=" + title;
        $.ajax({
            url: imageUrl,
            dataType: "jsonp",
            success: imageCallback
        });
    });
}

function imageCallback(data){
    var found = false;
    imageCount++;
    if(imageCount === albumNum){
        callback();
    }
    else if(data.album !== undefined){
        data.album.image.forEach(function(image){
            if(found === false && image.size === "large"){ 
                entries.forEach(function(entry){
                    if(entry.title === data.album.name || entry.detail.indexOf(data.album.artist)>-1){
                        entry["picture"] = image["#text"];
                        found = true;
                    }
                });
            }
        });
    }
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


function areaSearchCallback(data) {
    var locations = data.resultsPage.results.location;
    var numLocations = Math.min(3, locations.length);
    var entry;
    for (var i = numLocations - 1; i >= 0; i--) {
        var location = locations[i];
        var metroAreaId = location.metroArea.id;
        var upcomingEventsUrl = songKickBaseUrl + "/metro_areas/" + metroAreaId + "/calendar.json?apikey=" + songKickApiKey + "&jsoncallback=concertCallback";
        console.log(upcomingEventsUrl);
        $.ajax({
            url: upcomingEventsUrl,
            dataType: "jsonp",
            success: concertCallback
        });

    }
}

function concertCallback(data) {
    var events = data.resultsPage.results.event;
    var title, venue, date, month, day, year, detail, entry;
    var type = "music";
    if (events != undefined) {
        events.forEach(function(event) {
            var dateString;
            if (undefined === event.start.datetime) {
                dateString = event.start.datetime
            }
            else {
                dateString = event.start.date + "T00:00:00-0500"
            }
            date = new Date(dateString);
            title = event.displayName;
            venue = event.venue.displayName;
            month = date.getMonth(); 
            day = date.getDate();
            year = date.getFullYear();
            detail = "performing at " + venue + ": ";
            console.log(day + "/" + month + "/" + year);
            console.log(event);
            entry = new Entry(title, month + 1, day, year, detail, "", type);
            entries.push(entry);
        });
    }
}
    // var albums = data.searchResponse.results;
    // albumNum = albums.length;
    // albums.forEach(function(album) {
    //     date = album.album.originalReleaseDate.split("-");
    //     day = date[2];
    //     month = date[1];
    //     year = date[0];
    //     title = album.album.title;
    //     band = album.album.primaryArtists[0].name;
    //     entry = new Entry(title, month, day, year,  " by " + band+ " - Album Out: ", "", "music");
    //     entries.push(entry);
    //     //http%3A%2F%2Fws.audioscrobbler.com%2F2.0%2F%3Fmethod%3Dalbum.getinfo%26api_key%3D69de64d9645edd7e1f9bb2e1edfef4f1%26artist%3DBrandy%26album%3DTwo%2520Eleven%26format%3Djson
    //     imageUrl = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&format=json&callback=imageCallback&api_key=' + api_key + '&artist=' + band + "&album=" + title;
    //     $.ajax({
    //         url: imageUrl,
    //         dataType: "jsonp",
    //         success: imageCallback
    //     });
    // });