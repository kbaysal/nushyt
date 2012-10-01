var apikey = "2n2jcb9yw5a9qat694epm3qf";
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
 
// construct the uri with our apikey
var theaterUrl = baseUrl + '/lists/movies/upcoming.json?apikey=' + apikey;
var dvdUrl = baseUrl + '/lists/dvds/new_releases.json?apikey=' + apikey;
 
$(document).ready(function() {
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
 $.each(movies, function(index, movie) {
   $("#results").append('<div class=\"result\">'
                          +'<img src="' + movie.posters.thumbnail + '" />'
                          +'<h1>' + movie.title + '</h1>'
                          +'<h2> Add to calendar </h2>'
                          +'<h3>' + "In Theaters: " + movie.release_dates.theater + '</h1>'
                          +'</div>');
 });
}

function dvdCallback(data) {
 var movies = data.movies;
 $.each(movies, function(index, movie) {
   $("#results").append('<div class=\"result\">'
                          +'<img src="' + movie.posters.thumbnail + '" />'
                          +'<h1>' + movie.title + '</h1>'
                          +'<h2> Add to calendar </h2>'
                          +'<h3>' + "On DVD: " + movie.release_dates.dvd + '</h1>'
                          +'</div>');
 });
}