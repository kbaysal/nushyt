var count = 0;
var totalCalls = 2;

$(document).ready(function() {
    var apikey = "2n2jcb9yw5a9qat694epm3qf";
    var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

    // api.rottentomatoes.com/api/public/v1.0/lists/dvds/upcoming.json?page_limit=16&page=1&country=us&apikey=2n2jcb9yw5a9qat694epm3qf
    var theaterUrl = baseUrl + '/lists/movies/upcoming.json?apikey=' + apikey;
    var dvdUrl = baseUrl + '/lists/dvds/upcoming.json?&country=us&apikey=' + apikey;

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
});
 
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
        entries.push(entry); 
    });
   
    count++;
    if(count==totalCalls){  
        callback();
    }
}