$(document).ready(function(){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');

	var img = new Image();
	img.onload = function(){
		ctx.drawImage(img,0,0);
		alert(img.width);
	}
	img.src = "jiggs1.jpg";

});