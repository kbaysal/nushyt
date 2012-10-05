//Holds the index to be drawn at the next interval; way to make non-global?
var imPos = 0;
//Number of images to display in the banner
var NIMS = 8;
// TODO: Other globals: I don't want to get these in each call to fadeDraw, but I can't
// think of a better way than globals for them to persist
var canvas = $("#myCanvas")[0];
var cWidth = canvas.width;
var cHeight = canvas.height;
var ctx = canvas.getContext('2d');

/*
 * drawBanner - Takes the images from the current page and draws them on the canvas.
 * TODO - Randomize more, remove deadcode before submission
 */

 function drawBanner(){
    var delay = 60;
    var fadeTime = 3000;
    setIntervalN(fadeDraw, delay, fadeTime/delay);
};

/*
 * setInterval - Wrapper function to set an interval for fading the image in over 
 * delay*repetitions milliseconds
 * adapted from: http://stackoverflow.com/questions/2956966/javascript-telling-setinterval-to-only-fire-x-amount-of-times
 */
 function setIntervalN(callback, delay, repetitions){
    var currentReps = 0;
    var alpha = 0;
    var intervalID;

    var imgs = $(".liked");
    var totalImgs = imgs.length;
    //Randomly select image to draw
    var imgIndex = Math.floor(Math.random()*(totalImgs));
    var img = imgs[imgIndex];

    if(totalImgs === 0){
        return;
    }

    intervalID = setInterval(function(){
        callback(alpha, img);
        alpha = alpha + 1/(repetitions);
        if(++currentReps >= repetitions){
            clearInterval(intervalID);
            imPos = (imPos+1)%NIMS;
        }}, delay);
}

/*
 * fadeDraw - Function to draw the image at the given opacity
 */
 function fadeDraw(alpha, img){

    ctx.globalAlpha = alpha;
    ctx.drawImage(img, imPos*cWidth/NIMS, 0, cWidth/NIMS, cHeight);

}