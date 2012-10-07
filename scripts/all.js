var count = 0;
var totalCalls = 6;

function callbackIfLoaded() {
    window.count++;
    if(window.count == window.totalCalls) {
        callback();
    }
}

$(document).ready(function() {

    //////////////////////////////
    // Movies AJAX calls
    //////////////////////////////
    var moviesApiKey = "2n2jcb9yw5a9qat694epm3qf";
    var moviesBaseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

    // construct the uri with our apikey
    var theaterUrl = moviesBaseUrl + '/lists/movies/upcoming.json?apikey=' + moviesApiKey;
    var dvdUrl = moviesBaseUrl + '/lists/dvds/new_releases.json?apikey=' + moviesApiKey;

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

    //////////////////////////////
    // TV Shows AJAX call
    //////////////////////////////
    var tvUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20%22http://www.metacritic.com/browse/tv/release-date/new-series/date?view=detailed%22%20and%20xpath%3D%22*%22&format=xml&callback=tvCallback';


    $.ajax({
        url: tvUrl,
        dataType: "jsonp",
        success: tvCallback
    });

    //////////////////////////////
    // Albums AJAX call
    //////////////////////////////
    var albumApiKey = "8gn2qubry7hg4xj4meb8hpuv";
    var albumSecret = "WCZpfUvnrX";
    var albumBaseUrl = "http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1";

    // construct the uri with our apikey
    var musicUrl = 'http://jsonp.jit.su/?callback=albumCallback&url='+ albumBaseUrl + '%2Fmusic%2Ffilterbrowse%3Fapikey%3D' + albumApiKey + '%26sig%3D' + genSig(albumApiKey, albumSecret)+ "%26entitytype%3Dalbum%26filter%3DreleaseDate%253E20121003%26format%3Djson";


    $.ajax({
        url: musicUrl,
        dataType: "jsonp",
        success: albumCallback
    });

    //////////////////////////////
    // Games AJAX call
    //////////////////////////////
    var gameUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.gamefly.com%2Fbuy-games%2FBrowse%2F%3Fcat%3DComingSoon%26page%3D1%26pageSize%3D48%22&format=xml&diagnostics=true&callback=gameCallback';

    $.ajax({
        url: gameUrl,
        dataType: "jsonp",
        success: gameCallback
    });

    //////////////////////////////
    // Concert AJAX call
    //////////////////////////////
    _getLocation();
});

function _getLocation() {
    var timeout = 1000;
    var timeoutHandler = setTimeout(_showError, timeout);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            clearTimeout(timeoutHandler);
            if (window.count == window.totalCalls)
                window.totalCalls += 1;
            _showPosition(position);
        }, function(error) {
            clearTimeout(timeoutHandler);
            _showError(error);
        }, {timeout:5000});
    }
    else{
        callbackIfLoaded();
    }
}

function _showPosition(position) {
    var areaSearchApiKey = "AVNqr7bkPoxHFdu3";
    var areaSearchBaseUrl = "http://api.songkick.com/api/3.0";

    var areaSearchUrl = areaSearchBaseUrl + "/search/locations.json?apikey=" + areaSearchApiKey + "&jsoncallback=areaSearchCallback&location=";
    var city, lng, lat;
    if(position){
        areaSearchUrl += "geo:" + position.coords.latitude + "," + position.coords.longitude;
    } else {
        areaSearchUrl += "clientip";
    }

    $.ajax ({
        url: areaSearchUrl,
        dataType: "jsonp",
        success: areaSearchCallback
    });
}

function _showError(error) {
    callbackIfLoaded();
}

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

    callbackIfLoaded();
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

    callbackIfLoaded();
}


// callback for when we get back the results
function tvCallback(data) {
    var html = data.results[0];
    var title, date, day, month, year, img;
    var index = 0;
    var counter = 0;
    

    while(counter < 20) {
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
        title = title.replace(": Season 1", "");

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

    callbackIfLoaded();
}

function gameCallback(data) {
    var html = data.results[0];
    var title, date, day, month, year, img, platform;
    var index = 0;
    var counter = 0;
    

    while(counter < 29) {
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

    callbackIfLoaded();
}

var imageCount = 0;
var albumNum;

// callback for when we get back the results
function albumCallback(data) {
    var entry, day, month, year, date, title, band;
    var api_key = "69de64d9645edd7e1f9bb2e1edfef4f1";
    var albums = data.searchResponse.results;
    window.albumNum = albums.length;
    albums.forEach(function(album) {
        date = album.album.originalReleaseDate.split("-");
        day = date[2];
        month = date[1];
        year = date[0];
        title = album.album.title;
        band = album.album.primaryArtists[0].name;
        entry = new Entry(title, month, day, year,  " by " + band+ " - Album Out: ", "", "music");
        entries.push(entry);
        var imageUrl = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&format=json&callback=imageCallback&api_key=' + api_key + '&artist=' + band + "&album=" + title;
        $.ajax({
            url: imageUrl,
            dataType: "jsonp",
            success: imageCallback
        });
    });
}

function imageCallback(data){
    var found = false;
    window.imageCount++;
    if(window.imageCount === window.albumNum){ 
        callbackIfLoaded();
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
    var concertApiKey = "AVNqr7bkPoxHFdu3";
    var concertBaseUrl = "http://api.songkick.com/api/3.0"; 
    var locations = data.resultsPage.results.location;
    var numLocations = Math.min(3, locations.length);

    window.locationCount = numLocations;
    for (var i = numLocations - 1; i >= 0; i--) {
        var location = locations[i];
        var metroAreaId = location.metroArea.id;
        var upcomingEventsUrl = concertBaseUrl + "/metro_areas/" + metroAreaId + "/calendar.json?apikey=" + concertApiKey + "&jsoncallback=concertCallback";
        $.ajax({
            url: upcomingEventsUrl,
            dataType: "jsonp",
            success: concertCallback
        });

    }
}

function concertCallback(data) {
    var events = data.resultsPage.results.event;
    var type = "music";
    var imageSearchBaseUrl = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&api_key=b25b959554ed76058ac220b7b2e0a026&format=json&artist=";
    var title, venue, date, month, day, year, detail, entry, dateString, url;
    if (events != undefined) {
        window.concertCount += events.length;
        events.forEach(function(event) {
            if (null !== event.start.datetime) {
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
            url = imageSearchBaseUrl + event.performance[0].artist.displayName;
            var callback = createImageCallback(entries.length);
            
            entries.push(entry);
            $.ajax({
                url: url,
                dataType: "jsonp",
                jsonpCallback: callback,
                error: function() {
                },
                complete: function() {
                    processedConcert(callback);
                }
            });
        });
    }
    
    window.locationCount--;
    if (window.locationCount == 0 && window.concertCount == 0) {
        callbackIfLoaded();
    }
}

function createImageCallback(id) {
    var functionName = "imageCallback_" + id;
    window[functionName] = function(data) {
        if (data.artist !== undefined && data.artist.image[2] !== undefined) {
            var imgUrl = data.artist.image[2]["#text"];
            entries[id].picture = imgUrl;
        }
    }
    return functionName;
}

function processedConcert(functionName) {
    delete window[functionName];
    window.concertCount--;
    if (window.locationCount == 0 && window.concertCount == 0) {
        callbackIfLoaded();
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