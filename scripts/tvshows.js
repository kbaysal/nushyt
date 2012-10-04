$(document).ready(function() {
    var tvUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%20%3D%20%22http://www.metacritic.com/browse/tv/release-date/new-series/date?view=detailed%22%20and%20xpath%3D%22*%22&format=xml&callback=tvCallback';

    console.log(tvUrl);

    $.ajax({
        url: tvUrl,
        dataType: "jsonp",
        success: tvCallback
    });
});
 
// callback for when we get back the results
function tvCallback(data) {
    var html = data.results[0];
    var title, date, day, month, year, img;
    //title:<h3 class="product_title"><a   href="/tv/call-the-midwife/season-1">Call The Midwife: Season 1</a>
    //date:<li class="stat release_date"><span class="label">Start date:</span><span class="data">Sep 30, 2012</span>
    //img: <img class="product_image small_image" src="http://img1.gamespotcdn.net/metacritic/public/www/images/products/tv/0/15418a00f4a1e64ae83a55d3183be8e0-53.jpg" alt="Call The Midwife: Season 1 Image" />
    var index = 0;
    var counter = 0;
    

    while(counter<20){
        //get title
        var identifier = '<h3 class="product_title">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        identifier = '">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</a>';
        index = html.indexOf(identifier);
        title = html.substring(0, index);
        console.log(title);

        //get date:
        var identifier = 'Start date:';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = '<span class="data">';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</span>';
        index = html.indexOf(identifier);
        date = html.substring(0, index);
        console.log(date);
        month = "09";
        day = date.substring(4, 6);
        year = "2012";

        //get image: 
        var identifier = '<img class="product_image small_image"';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = 'src="';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '"';
        index = html.indexOf(identifier);
        img = html.substring(0, index).replace("-53.jpg", "-98.jpg");

        entry = new Entry(title, month, day, year,  " premiered on: ", img, "tv");
        entries.push(entry);
        counter++;
    }
    callback();
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