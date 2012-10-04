/*
 * drawBanner - Takes the images from the current page and draws them on the canvas.
 * TODO - Randomize more, remove deadcode before submission
*/

function drawBanner(){
	var canvas = $("#myCanvas")[0];
	var cWidth = canvas.width;
	var cHeight = canvas.height;
	//Number of images to display in the banner
	var nIms = 8;
	var pos = 0;
	var ctx = canvas.getContext('2d');
	var imgs = $("img");
	var totalImgs = imgs.length;

	//Randomly select and draw images
	for(var i = 0; i < nIms; i++){
		var imgIndex = Math.floor(Math.random()*(imgs.length));
		ctx.drawImage(imgs[imgIndex], i*cWidth/nIms, 0, cWidth/nIms, cHeight);
	}

	/*$.each(imgs, function(i, img){
		pos = i%(nIms);
		ctx.drawImage(img, pos*cWidth/nIms,0, cWidth/nIms, cHeight);
	});*/

	/*var img = new Image();
	img.src = 'testimages/jiggs2.jpg';
	img.onload = function(){
		alert(img.width);
		ctx.drawImage(img,0,0);
		alert(img.width);
	}*/
};

/*function draw() {
  var img = new Image();
  img.src = './images/backdrop.png';
  img.onload = function(){
    ctx.drawImage(img,0,0, 400,400);
    ctx.beginPath();
    ctx.moveTo(30,96);
    ctx.lineTo(70,66);
    ctx.lineTo(103,76);
    ctx.lineTo(170,15);
    ctx.stroke();
  }
}*/