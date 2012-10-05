/*
 * drawBanner - Takes the images from the current page and draws them on the canvas.
 * TODO - Randomize more, remove deadcode before submission
 */
    var imPos = 0;
    var imInd = 0;

 function drawBanner(){
    var delay = 60;
    var fadeTime = 3000;
    setFadeDrawIntervalN(delay, fadeTime/delay);
    console.log(imPos +", " + imInd);
};

    

/*
 * setInterval - Wrapper function to set an interval for fading the image in over 
 * delay*repetitions milliseconds
 * adapted from: http://stackoverflow.com/questions/2956966/javascript-telling-setinterval-to-only-fire-x-amount-of-times
 */
 function setFadeDrawIntervalN(delay, repetitions){

    var NIMS = Math.ceil(800/67);

    var canvas = $("#myCanvas")[0];
    var cWidth = canvas.width;
    var cHeight = canvas.height;
    var ctx = canvas.getContext('2d');
    var currentReps = 0;
    var alpha = 0;
    var intervalID;

    var imgs = $(".liked");
    var totalImgs = imgs.length;

    //Randomly select image to draw
    var img = imgs[imInd];

    if(totalImgs === 0){
        return;
    }

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
