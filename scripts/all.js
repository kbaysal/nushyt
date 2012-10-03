var count = 0;
var totalCalls = 3;

$(document).ready(function() {
    var apikey = "2n2jcb9yw5a9qat694epm3qf";
    var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

    // construct the uri with our apikey
    var theaterUrl = baseUrl + '/lists/movies/upcoming.json?apikey=' + apikey;
    var dvdUrl = baseUrl + '/lists/dvds/new_releases.json?apikey=' + apikey;

    apikey = "8gn2qubry7hg4xj4meb8hpuv";
    var secret = "WCZpfUvnrX";
    baseUrl = "http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1";

    //http%3A%2F%2Fapi.rovicorp.com%2Fsearch%2Fv2.1%2Famgvideo%2Ffilterbrowse%3Fapikey%3D8gn2qubry7hg4xj4meb8hpuv%26sig%3D16c6f3969f8a57d688dc44f1907a737a%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson
    // construct the uri with our apikey
    var tvUrl = 'http://jsonp.jit.su/?callback=tvCallback&url='+ baseUrl + '%2Famgvideo%2Ffilterbrowse%3Fapikey%3D' + apikey + '%26sig%3D' + genSig(apikey, secret)+ "%26entitytype%3Dtvseries%26filter%3DreleaseYear%253E2011%26format%3Djson";

    console.log(dvdUrl);
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

    $.ajax({
        url: tvUrl,
        dataType: "jsonp",
        success: tvCallback
    });
});

 
// callback for when we get back the results
function tvCallback(data) {
    var shows = data.searchResponse.results;
    var entry, day, month, year, date, title;
    shows.forEach(function(show) {
        month = 0;
        day = 0;
        year = show.movie.releaseYear;
        title = show.movie.title.replace(" [TV Series]", "");
        entry = new Entry(title, month, day, year, "On TV: ", show.movie.imagesUri);
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
        entry = new Entry(movie.title, month, day, year, "In Theaters: ", movie.posters.thumbnail);
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
        entry = new Entry(movie.title, month, day, year, "On DVD: ", movie.posters.thumbnail);
        entries.push(entry)
    });
    count++;
    if(count==totalCalls){
        callback();
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