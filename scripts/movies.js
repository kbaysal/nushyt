var apikey = "2n2jcb9yw5a9qat694epm3qf";
var baseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
 
// construct the uri with our apikey
var theaterUrl = baseUrl + '/lists/movies/upcoming.json?apikey=' + apikey;
var dvdUrl = baseUrl + '/lists/dvds/new_releases.json?apikey=' + apikey;

var entries = [];
 
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
   var entry, day, month, year, date;
   $.each(movies, function(index, movie) {
      date = movie.release_dates.theater.split("-");
      day = date[2];
      month = date[1];
      year = date[0];
      entry = new Entry(movie.title, month, day, year, "In Theaters: ", movie.posters.thumbnail);
      entries.push(entry);
   });
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
   entries = entries.sort(entryCompare);
   entries.forEach(createEntry);
}