/*
 * drawBanner - Takes the images from the current page and draws them on the canvas at the top of the screen.
 * 
 */
 var imPos = 0;
 var imInd = 0;

 function drawBanner(){
    var delay = 60;
    var fadeTime = 3000;
    setFadeDrawIntervalN(delay, fadeTime/delay);
};



/*
 * setInterval - Wrapper function to set an interval for fading the image in over 
 * delay*repetitions milliseconds
 * adapted from: http://stackoverflow.com/questions/2956966/javascript-telling-setinterval-to-only-fire-x-amount-of-times
 */
 function setFadeDrawIntervalN(delay, repetitions){

    var canvas = $("#myCanvas");
    var cWidth = parseInt(canvas.attr("width"));
    var cHeight = parseInt(canvas.attr("height"));
    var POSTER_HEIGHT = 67;
    var ctx = canvas[0].getContext('2d');
    var currentReps = 0;
    var alpha = 0;
    var intervalID;
    var NIMS = Math.ceil(cWidth/POSTER_HEIGHT);

    var imgs = $(".liked");
    var totalImgs = imgs.length;
    var img = imgs[imInd];

    if(totalImgs === 0 || $(img).attr("src") === ""){
        return;
    }

    /*
     * Anonymous function to fade in the given image on the canvas
     */

    intervalID = setInterval(function(){

        ctx.globalAlpha = alpha;
        ctx.drawImage(img, imPos*cWidth/NIMS, 0, cWidth/NIMS, cHeight);

        alpha = alpha + 1/(repetitions);
        if(++currentReps > repetitions){
            clearInterval(intervalID);
            imInd = (imInd + 1)%totalImgs;
            if(imPos < totalImgs-1)
                imPos = (imPos+1)%NIMS;
            else
                imPos = 0;
    }}, delay);
 }
