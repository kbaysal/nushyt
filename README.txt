TODO:
* Style
* Animation/transitions -> WE NEED IDEAS!
	- Can we animate out all the divs as they appear? We can make the <h2> tag move down when clicked? Animate between tabs?
    - Added help box: hover on it, and it displays help text; however, need to make it so the text only appears after the box has transitioned to the new size.  Tried playing around with delays, but it wasn't working.

If we had more time:
* have a pool of keywords for each entry so that if the person says they like animations for example, we will give a list of animations
* have a page for each entry that can give more information

README:
Darren Lane dslane
Ted Smongeski esmonges
Kiraz Baysa kbaysal

Because of API limitations if you refresh a lot of times, the page won't load all of the information

In order to test our personal result feature you can do a search for 'snow white and the huntsman' this should pull up Dark Shadows and snow white and the huntsman to the personal results area. Right now the way we do personal results is by giving your query to TasteKid, and comparing all the similar results it gives back to us to the entries we alrady have in the list. If there is a much it displays that on top.
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
8)EchoNest

Webpages scraped using YQL:
1)metacritic.com
2)gamefly.com


Things we're using that we learned in class: 
Canvas: We made a banner out of canvas that adds an image of the things you added to your calendar.


