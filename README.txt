Darren Lane dslane
Ted Smongeski esmonges
Kiraz Baysa kbaysal

Because of API limitations if you refresh a lot of times, the page won't load all of the information

In order to test our personal result feature you can do a search for 'snow white and the huntsman' this should pull up Dark Shadows and snow white and the huntsman to the personal results area. Right now the way we do personal results is by giving your query to TasteKid, and comparing all the similar results it gives back to us to the entries we alrady have in the list. If there is a much it displays that on top.
Some more examples: "halo 4" for games, "red" for albums, "arrow" for tv shows... however, these don't return related results as there is nothing related in our list using the "related" definition of TasteKid.
If we had more time, we would create a list of words for each movie/game.... from the genre, cast/crew... and compare those as well. 

In order to have calendar stuff working follow these steps: 
1. navigate to the project folder in the terminal/cmd
2. run this command:
	python -m SimpleHTTPServer 8000
3. keep the terminal window open throughout using the application
4. access the website by going to http://localhost:8000

APIs used:
1)Taste kid
2)Rotten Tomatoes
3)Rovi
4)LastFM
5)Yahoo YQL
6)Google Calendar
7)Songkick

Webpages scraped using YQL:
1)metacritic.com
2)gamefly.com

Things we're using that we learned in class: 
Canvas: We made a banner out of canvas that adds an image of the things you added to your calendar.
Skeleton: We made our site responsive by using skeleton and adding more to it.
Ajax calls: We make Ajax calls to 9 different API/websites.
Transitions: We used transitions to animate our help button.
CSS: lots of fun things like pseudo elements for hover.
DOM manipulation: one example is that each time you click on a tab we don't make a second request we just change what's being shown.
Forms: search bar
Location: we use navigator (HTML5) to get the location of the user and use it to find music events close by.


