var count = 0;
var totalCalls = 6;

var songKickApiKey;
var songKickBaseUrl;

$(document).ready(function() {
    var apikey = "2n2jcb9yw5a9qat694epm3qf";
    var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

    // construct the uri with our apikey
    var theaterUrl = baseUrl + '/lists/movies/upcoming.json?apikey=' + apikey;
    var dvdUrl = baseUrl + '/lists/dvds/new_releases.json?apikey=' + apikey;

    //http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1%2Famgvideo%2Ffilterbrowse%3Fapikey%3D8gn2qubry7hg4xj4meb8hpuv%26sig%3D16c6f3969f8a57d688dc44f1907a737a%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson
    // construct the uri with our apikey
    var tvUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20%22http://www.metacritic.com/browse/tv/release-date/new-series/date?view=detailed%22%20and%20xpath%3D%22*%22&format=xml&callback=tvCallback';


    $.ajax({
        url: tvUrl,
        dataType: "jsonp",
        success: tvCallback
    });

    // send off the query
    $.ajax({
        url: theaterUrl,
        dataType: "jsonp",
        success: theaterCallback
    });

    $.ajax({
        url: dvdUrl,
        dataType: "jsonp",
        success: dvdCallback
    });

    apikey = "8gn2qubry7hg4xj4meb8hpuv";
    var secret = "WCZpfUvnrX";
    baseUrl = "http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1";

    //http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1%2Famgvideo%2Ffilterbrowse%3Fapikey%3D8gn2qubry7hg4xj4meb8hpuv%26sig%3D16c6f3969f8a57d688dc44f1907a737a%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson
    // construct the uri with our apikey
    var musicUrl = 'http://jsonp.jit.su/?callback=albumCallback&url='+ baseUrl + '%2Fmusic%2Ffilterbrowse%3Fapikey%3D' + apikey + '%26sig%3D' + genSig(apikey, secret)+ "%26entitytype%3Dalbum%26filter%3DreleaseDate%253E20121003%26format%3Djson";


    $.ajax({
        url: musicUrl,
        dataType: "jsonp",
        success: albumCallback
    });

    var gameUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.gamefly.com%2Fbuy-games%2FBrowse%2F%3Fcat%3DComingSoon%26page%3D1%26pageSize%3D48%22&format=xml&diagnostics=true&callback=gameCallback';

    console.log(gameUrl);

    $.ajax({
        url: gameUrl,
        dataType: "jsonp",
        success: gameCallback
    });

    songKickApiKey = "AVNqr7bkPoxHFdu3";
    songKickBaseUrl = "http://api.songkick.com/api/3.0";

    var locationSearchUrl = songKickBaseUrl + "/search/locations.json?location=clientip&apikey=" + songKickApiKey + "&jsoncallback=areaSearchCallback";

    getLocation();
/*
    $.ajax ({
        url: locationSearchUrl,
        dataType: "jsonp",
        success: areaSearchCallback
    });*/
});

function getLocation()
  {
  if (navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(showPosition);
    }
  else{showPosition();}
  }
function showPosition(position)
{
    var baseUrl = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&callback=conCallback"
    var city, lng, lat;
    if(position){
        baseUrl += "distance=40&long=" + position.longitude + "lat=" + position.latitude;
    }
    else{
        baseUrl += "location=Pittsburgh"
    }
    $.ajax ({
        url: baseUrl,
        dataType: "jsonp",
        success: conCallback
    });
}

function conCallback(data) {
    var events = data.events;
    var entry, day, month, year, date, img, images;
    $.each(events.event, function(index, event){
        img = "";
        date = event.startDate.split(" ");
        day = date[1];
        month = 10;
        year = date[3];
        images = event.image;
        img = images[0]['#text'];
        images.forEach(function(image){
            if(image.size=="large")
                img = image['#text'];
        });
        if(img === ""){
            images = event.venue.image;
            img = images[0]['#text'];
            images.forEach(function(image){
            if(image.size=="large")
                img = image['#text'];
            });
        }
        entry = new Entry(event.title, month, day, year, "performing at - " + event.venue.name+":", img, "music");
        entries.push(entry);
    });  
    count++;
    if(count==totalCalls){
        callback();
    }
}
 
// callback for when we get back the results
function theaterCallback(data) {
    var movies = data.movies;
    var entry, day, month, year, date;
    $.each(movies, function(index, movie) {
        date = movie.release_dates.theater.split("-");
        day = date[2];
        month = date[1];
        year = date[0];
        entry = new Entry(movie.title, month, day, year, "In Theaters: ", movie.posters.thumbnail, "movie");
        entries.push(entry);
    });
    count++;
    if(count==totalCalls){
        callback();
    }
}

function dvdCallback(data) {
    var movies = data.movies;
    var entry, day, month, year;
    $.each(movies, function(index, movie) {
        date = movie.release_dates.dvd.split("-");
        day = date[2];
        month = date[1];
        year = date[0];
        entry = new Entry(movie.title, month, day, year, "On DVD: ", movie.posters.thumbnail, "movie");
        entries.push(entry)
    });
    count++;

    if(count==totalCalls){
        callback();
    }
}


// callback for when we get back the results
function tvCallback(data) {
    var html = data.results[0];
    var title, date, day, month, year, img;
    //title:<h3 class="product_title"><a   href="/tv/call-the-midwife/season-1">Call The Midwife: Season 1</a>
    //date:<li class="stat release_date"><span class="label">Start date:</span><span class="data">Sep 30, 2012</span>
    //img: <img class="product_image small_image" src="http://img1.gamespotcdn.net/metacritic/public/www/images/products/tv/0/15418a00f4a1e64ae83a55d3183be8e0-53.jpg" alt="Call The Midwife: Season 1 Image" />
    var index = 0;
    var counter = 0;
    

    while(counter<20){
        //get title
        var identifier = '<h3 class="product_title">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        identifier = '">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</a>';
        index = html.indexOf(identifier);
        title = html.substring(0, index);

        //get date:
        var identifier = 'Start date:';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = '<span class="data">';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</span>';
        index = html.indexOf(identifier);
        date = html.substring(0, index);
        month = 09;
        day = date.substring(4, 6);
        year = 2012;

        //get image: 
        var identifier = '<img class="product_image small_image"';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = 'src="';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '"';
        index = html.indexOf(identifier);
        img = html.substring(0, index).replace("-53.jpg", "-98.jpg");

        entry = new Entry(title, month, day, year,  " premiered on: ", img, "tv");
        entries.push(entry);
        counter++;
    }
    count++;
    if(count==totalCalls){
        callback();
    }
}

function gameCallback(data) {
    var html = data.results[0];
    var title, date, day, month, year, img, platform;
    //img:<img alt="Buy Dishonored for PS3" src="http://gamefly2.gameflycdn.com/images/games/t2/148810t.jpg" class=" thumbNailImage PS3-thumbNailImage align-vbottom unit"/>
    //title: <a class="title a detailsUrl text" href="http://www.gamefly.com/Buy-Dishonored/148810/" rel="nofollow">Dishonored</a></div>
    //date: <div class="release-date text-small space-top-1a">Release: 10/9/12</div>
    //console: <span class="icon-platform-hold block pos-relative fontc-d0">PS3<em class="icon-platform
    var index = 0;
    var counter = 0;
    

    while(counter<29){
        //get title
        var identifier = '<img alt="Buy >';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        identifier = 'src="';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '"';
        index = html.indexOf(identifier);
        img = html.substring(0, index);

        //get date:
        var identifier = '<a class="title a detailsUrl text" href=';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = '>';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</a>';
        index = html.indexOf(identifier);
        title = html.substring(0, index);

        //get image: 
        var identifier = 'div class="release-date text-small space-top-1a">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = 'Release: ';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</div>';
        index = html.indexOf(identifier);
        date = html.substring(0, index);
        var dateArray = ["", "", ""];
        var c = 0;
        for(var i = 0; i<date.length; i++){
            if(date[i] !== "/" && date[i] !=="<" && c<3)
                dateArray[c] += date[i];
            else
                c++;
        }
        month = dateArray[0];
        day = dateArray[1];
        year = dateArray[2];
        if(month.length < 2) month = "0" + month;
        if(day.length<2) day = "0" + day;
        year = "20"+year;

        var identifier = '<span class="icon-platform-hold block pos-relative fontc-d0">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        identifier = '<em class';
        index = html.indexOf(identifier);
        platform = html.substring(0, index);


        entry = new Entry(title, month, day, year,  "release date for " + platform + ": ", img, "game");
        entries.push(entry);
        counter++;
    }
    count++;
    if(count==totalCalls){
        callback();
    }
}


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
        count++;
        if(count==totalCalls){
            callback();
        }
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

var locationCount;
var concertCount = 0;

function areaSearchCallback(data) {
    var locations = data.resultsPage.results.location;
    var numLocations = Math.min(3, locations.length);
    locationCount = numLocations;
    var entry;
    for (var i = numLocations - 1; i >= 0; i--) {
        var location = locations[i];
        var metroAreaId = location.metroArea.id;
        var upcomingEventsUrl = songKickBaseUrl + "/metro_areas/" + metroAreaId + "/calendar.json?apikey=" + songKickApiKey + "&jsoncallback=concertCallback";
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
    var imageSearchBaseUrl = "http://developer.echonest.com/api/v4/artist/images?format=jsonp&results=1&start=0&api_key=UIZAIQEXG9AJYDRUN&id=songkick:artist:";
    if (events != undefined) {
        concertCount += events.length;
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
            entry = new Entry(title, month + 1, day, year, detail, "", type);
            //http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=Cher&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&callback=hello
            var url = imageSearchBaseUrl + event.performance[0].artist.id;
            var callback = createImageCallback(entries.length);
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonpCallback: callback,
                success: window[callback],
                error: processedConcert(callback)
            });
            entries.push(entry);
        });
    }
    locationCount--;
    if (locationCount == 0 && concertCount == 0) {
        count++;
        if(count==totalCalls){
            callback();
        }
    }
}

function createImageCallback(id) {
    var functionName = "imageCallback_" + id
    window[functionName] = function(data) {
        if (data.response.images !== undefined && data.response.images[0] !== undefined) {
            var imgUrl = data.response.images[0].url;
            entries[id].picture = imgUrl;
        }
        processedConcert(functionName);
    }
    return functionName;
}

function processedConcert(functionName) {
    delete window[functionName];
    concertCount--;
    if (locationCount == 0 && concertCount == 0) {
        count++;
        console.log("concert: " + count);
        if(count == totalCalls){
            callback();
        }
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