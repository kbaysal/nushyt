var likes = [];
var inputs = [];
var entries = [];
var toAdd = [];

var clientId = '696158853178.apps.googleusercontent.com';
var apiKey = 'AIzaSyBaPMTZhvwVYcgvXbB7wIuxnIgmhA2qnYU';
var scopes = 'https://www.googleapis.com/auth/calendar';
var nushytCalId;

function Entry(title, month, day, year, detail, picture, type){
    this.month = month; 
    this.day = day;
    this.year = year;
    this.title = title;
    this.picture = picture;
    this.detail = detail;
    this.type = type;
}

function authorize() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('googleButton');
  if (authResult && !authResult.error) {
    makeApiCall();
  } else {
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, makeApiCall);
  return false;
}

function makeApiCall() {
    gapi.client.load('calendar', 'v3', createNushytCalendar);
}

function createNushytCalendar() {
    if (undefined === nushytCalId) {
        var request = gapi.client.calendar.calendarList.list({
            'minAccessRole': 'writer',
            'showHidden': true
        });
        request.execute(parseList);
    } else {
        populateNushytCalendar();
    }
}

function parseList(jsonResp, rawResp) {
    var list = jsonResp.items;
    var lookingForCal = true;
    list.forEach(function(calendar) {
        if (lookingForCal && calendar.summary === "Nushyt") {
            nushytCalId = calendar.id;
            populateNushytCalendar();
            lookingForCal = false;
        }
    })
    if (lookingForCal) {
        createNewCalendar();
    }
}

function createNewCalendar() {
    var request = gapi.client.calendar.calendars.insert({
        'resource': {
            'summary': "Nushyt",
            'description': "A calendar for new media you are interested in."
        }
    });
    request.execute(function(response) {
        nushytCalId = response.id;
        populateNushytCalendar();
    });
}

function parseEventListResponse(response) {
    if (response.items === undefined)
        return;
    response.items.forEach(function(item) {
        var date = new Date(item.start.date);
        console.log(date + ': ' + date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear());
        var entry = new Entry(item.summary, date.getMonth() + 1, date.getDate(), date.getFullYear(), "", "", "");
        removeEntry(toAdd, entry)
    });
    if (response.nextPageToken !== undefined) {
        var request = gapi.client.events.list({
            'calendarId': nushytCalId,
            'pageToken': response.nextPageToken
        });
        request.execute(function(response) {
            parseEventListResponse(response);
        });
    } else {
        toAdd.forEach(function(entry) {
            var request = gapi.client.calendar.events.insert({
                'calendarId': nushytCalId,
                'resource': {
                    'summary': entry.title,
                    'start': {
                        'date': entry.year + "-" + entry.month + "-" + entry.day
                    },
                    'end': {
                        'date': entry.year + "-" + entry.month + "-" + entry.day
                    },
                    "reminders": {
                        "useDefaults": true
                    }
                }
            });
            request.execute(function() {
            });
        });
        toAdd = [];
    }
}

function populateNushytCalendar() {
    var request = gapi.client.calendar.events.list({
        'calendarId': nushytCalId
    });
    request.execute(function(response) {
        parseEventListResponse(response);
    });
}

function entryCompare(e1, e2){
    if (e1.month === "TBD")
        return 1;
    else if (e2.month === "TBD")
        return -1;
  
  //e1 and e2 need to be Entry objects
    if(e1.year > e2.year)
        return 1;
    else if(e1.year < e2.year)
        return -1;

    if(e1.month > e2.month)
        return 1;
    else if(e1.month < e2.month)
        return -1;

    if(e1.day >= e2.day)
        return 1;
    else return -1;
}

/*
 * add - event handler to add a selection to the user's calendar
*/
function add(e){
    var JQtarget = $(e.target);
    var index = e.target.parentNode.parentNode.getAttribute("id");
    JQtarget.parent().find("img").attr("class", "liked");
    var entry;
    if (index >= entries.length) {
        entry = likes[index - entries.length];
    } else {
        entry = entries[index];
    }
    if (!containsEntry(toAdd, entry)) {
        toAdd.push(entry);
        e.target.parentNode.parentNode.getElementsByTagName("h2")[0].innerHTML = "Remove <br> from <br> calendar";
        console.log("added event " + entry.title);
        e.target.parentNode.className += "show";
    } else {
        removeEntry(toAdd, entry);
        e.target.parentNode.parentNode.getElementsByTagName("h2")[0].innerHTML = "Add <br> to <br> calendar";
        console.log("removed event" + entry.title);
        e.target.parentNode.className = "inner four columns ";
    }
}

function reveal(e){
    var index = e.target.getAttribute("id");
    var JQtarget = $(e.target);
    JQtarget.find("h2").css("visibility", "visible") ;
}

function hide(e){
    var index = e.target.getAttribute("id");
    var JQtarget = $(e.target);
    JQtarget.find("h2").css("visibility", "hidden") ;
}
function createEntry(entry, index){
    
    var date = entry.month + "/" + entry.day + "/" + entry.year;
    if(entry.month == "TBD"){
        var date = "TBD"
    }$("#results").append('<div class=\"result four columns ' + entry.type + '\" id=\"' + index +  '\">'
                          +'<div class=\"inner four columns \">'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2> Add <br> to <br> calendar </h2>'
                          +'<h3>' + entry.detail + date + '</h1>'
                          +'<img src="' + entry.picture + '" />'
                          +'</div>'
                          +'</div>');
    var addButton = document.getElementById(index).addEventListener('click', add, false);
    var addButton = document.getElementById(index).addEventListener('mouseenter', reveal, false);
    var addButton = document.getElementById(index).addEventListener('mouseleave', hide, false);
    
    if(entry.picture !== "" )
        document.getElementById(index).style.backgroundImage = "url("+entry.picture+")";
    
}

function createPersonal(entry, index){
    var date = entry.month + "/" + entry.day + "/" + entry.year;
    if(entry.month == "TBD"){
        var date = "TBD"
    }
    $("#personal").append('<div class=\"result four columns ' + entry.type + '\" id=\"' + index +  '\">'
                          +'<div class=\"inner four columns \">'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2> Add <br> to <br> calendar </h2>'
                          +'<h3>' + entry.detail + date + '</h1>'
                          +'<img src="' + entry.picture + '" />'
                          +'</div>'
                          +'</div>');
    var addButton = document.getElementById(index).addEventListener('click', add, false);
    var addButton = document.getElementById(index).addEventListener('mouseenter', reveal, false);
    var addButton = document.getElementById(index).addEventListener('mouseleave', hide, false);
    document.getElementById(index).style.backgroundImage = "url("+entry.picture+")";

    if(entry.picture !== "" )
        document.getElementById(index).style.backgroundImage = "url("+entry.picture+")";
 
}

function contains(array, title){
    var match = false;
    array.forEach(function(element){
    if(element['Name'] === title)
      match = true;
    });
    return match;
}

function containsEntry(array, entry) {
    var match = false;
    array.forEach(function(element) {
        if (entry.title === element.title &&
            entry.year === element.year &&
            entry.month === element.month &&
            entry.date === element.date)
            match = true;
    });
    return match;
}

function removeEntry(array, entry) {
    for (var i = array.length - 1; i >= 0; i--) {
        var element = array[i];
        if (entry.title === element.title &&
            entry.year === element.year &&
            entry.month === element.month &&
            entry.date === element.date) {
            array.splice(i, 1);
        }
    }
}

var baseUrl = "http://www.tastekid.com/ask/ws?q=";

function onSubmit(){
    var likesUrl = baseUrl+document.getElementById('likes').value+"&f=nushyt4577&k=nznkmjqxm2e0&verbose=1&format=JSON&jsonp=likesCallback";
    $.ajax({
        url: likesUrl,
        dataType: "jsonp",
        success: likesCallback
    });
    document.getElementById('likes').value = "";
}

function likesCallback(data){
    //get likes
    var name = data['Similar']['Info']['0']['Name'];
    var type = data['Similar']['Info']['0']['Type'];
    if(type !== "unknown"){
        if(!contains(inputs, name)){
            inputs.push({'Name':name, 'Type':type});
            $('#inputs').append('<h3>' + inputs[inputs.length-1]['Name'] + '</h3>');
        }

        if(!contains(likes, name))
            likes.push({'Name':name, 'Type':type});

        data['Similar']['Results'].forEach(function(obj){
            if(!contains(likes, obj['Name']))
                likes.push({'Name':obj['Name'], 'Type':obj['Type']});
        });

        $("#personal").empty();
        var count = entries.length;
        entries.forEach(function(entry){
            likes.forEach(function(like){
                if(entry['title'].toLowerCase() === like['Name'].toLowerCase()){
                    createPersonal(entry, count);
                    count++
                }
            });
        });
    }
}



function callback(){
    entries = entries.sort(entryCompare);
    all();
}

function all(){
    $("#results"). empty();
    var count = 0;
    entries.forEach(function(entry) {
        createEntry(entry, count);
        count++;
    });
}

function movies(){
    $("#results"). empty();
    var count = 0;
    entries.forEach(function(entry) {
        if(entry.type === "movie")
            createEntry(entry, count);
        count++;
    });
}

function tv(){
    $("#results"). empty();
    var count = 0;
    entries.forEach(function(entry) {
        if(entry.type === "tv")
            createEntry(entry, count);
        count++;
    });
}

function music(){
    $("#results"). empty();
    var count = 0;
    entries.forEach(function(entry) {
        if(entry.type === "music")
            createEntry(entry, count);
        count++;
    });
}

function games(){
    $("#results"). empty();
    var count = 0;
    entries.forEach(function(entry) {
        if(entry.type === "game")
            createEntry(entry, count);
        count++;
    });
}
$(document).ready(function() {
    var tab = document.getElementById("all").addEventListener('click', all, false);
    var tab = document.getElementById("movies").addEventListener('click', movies, false);
    var tab = document.getElementById("tv").addEventListener('click', tv, false);
    var tab = document.getElementById("music").addEventListener('click', music, false);
    var tab = document.getElementById("games").addEventListener('click', games, false);
    setInterval(function(){drawBanner()}, 3000);
});


//below taken from: http://webcheatsheet.com/javascript/disable_enter_key.php
function stopRKey(evt) { 
    var evt = (evt) ? evt : ((event) ? event : null); 
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
    if ((evt.keyCode == 13) && (node.type=="text"))  { onSubmit(); return false;} 
} 

document.onkeypress = stopRKey;