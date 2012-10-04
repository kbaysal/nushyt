$(document).ready(function(){
	var gameUrl = 'http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22http%3A%2F%2Fwww.gamefly.com%2Fbuy-games%2FBrowse%2F%3Fcat%3DComingSoon%26page%3D1%26pageSize%3D48%22&format=xml&diagnostics=true&callback=gameCallback';

    console.log(gameUrl);

    $.ajax({
        url: gameUrl,
        dataType: "jsonp",
        success: gameCallback
    });
});

function gameCallback(data) {
    var html = data.results[0];
    var title, date, day, month, year, img, platform;
	//img:<img alt="Buy Dishonored for PS3" src="http://gamefly2.gameflycdn.com/images/games/t2/148810t.jpg" class=" thumbNailImage PS3-thumbNailImage align-vbottom unit"/>
	//title: <a class="title a detailsUrl text" href="http://www.gamefly.com/Buy-Dishonored/148810/" rel="nofollow">Dishonored</a></div>
	//date: <div class="release-date text-small space-top-1a">Release: 10/9/12</div>
	//console: <span class="icon-platform-hold block pos-relative fontc-d0">PS3<em class="icon-platform
    var index = 0;
    var counter = 0;
    

    while(counter<31){
        //get title
        var identifier = '<img alt="Buy >';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        identifier = 'src="';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '"';
        index = html.indexOf(identifier);
        img = html.substring(0, index);
        console.log(img);

        //get date:
        var identifier = '<a class="title a detailsUrl text" href=';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = '>';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</a>';
        index = html.indexOf(identifier);
        title = html.substring(0, index);
        console.log(title);

        //get image: 
        var identifier = 'div class="release-date text-small space-top-1a">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        var identifier = 'Release: ';   
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length); 
        identifier = '</div>';
        index = html.indexOf(identifier);
        date = html.substring(0, index);
        var dateArray = ["", "", ""];
        var c = 0;
        for(var i = 0; i<date.length; i++){
        	if(date[i] !== "/" && date[i] !=="<" && c<3)
        		dateArray[c] += date[i];
        	else
        		c++;
        }
        month = dateArray[0];
        day = dateArray[1];
        year = dateArray[2];
        if(month.length < 2) month = "0" + month;
        if(day.length<2) day = "0" + day;
        year = "20"+year;

        var identifier = '<span class="icon-platform-hold block pos-relative fontc-d0">';
        index = html.indexOf(identifier) + identifier.length;
        html = html.substring(index, html.length);
        identifier = '<em class';
        index = html.indexOf(identifier);
        platform = html.substring(0, index);


        entry = new Entry(title, month, day, year,  "release date for " + platform + ": ", img, "game");
        entries.push(entry);
        counter++;
    }
    callback();
}