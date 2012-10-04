$(document).ready(function(){

	var apiKey = 'a89ef9e46dc12344bc03693998d9edadf773a514';
	//{resource} used in JQUERY REST implementation
	var baseUrl = "http://api.giantbomb.com/releases/?format=jsonp&sort=release_date&json_callback=gameCallBack&api_key=a89ef9e46dc12344bc03693998d9edadf773a514";

	$.ajax({
		url: baseUrl,
		dataType: "jsonp",
		success: gameCallBack
	});

});

function gameCallBack(data){
	var games = data.results;
	alert(games.error)
	for(var i = 0; i < 10; i++){
		alert(games[i].release_date);

	}
}