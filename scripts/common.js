var likes = [];
var inputs = [];
var entries = [];
var toAdd = [];
var preferred = [];

var clientId = '696158853178.apps.googleusercontent.com';
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

Entry.prototype.compare = function(e2) {
    if (this.month === "TBD") {
        if (this.month === e2.month)
            return 0;
        else
            return 1;
    }
    else if (e2.month === "TBD")
        return -1;
  
  //this and e2 need to be Entry objects
    if(this.year > e2.year)
        return 1;
    else if(this.year < e2.year)
        return -1;

    if(this.month > e2.month)
        return 1;
    else if(this.month < e2.month)
        return -1;

    if(this.day > e2.day)
        return 1;
    else if (this.day < e2.day)
        return -1;

    return 0;
}

function authorize() {
    var apiKey = 'AIzaSyBaPMTZhvwVYcgvXbB7wIuxnIgmhA2qnYU';
    gapi.client.setApiKey(apiKey);
    window.setTimeout(_checkAuth,1);
}

function _checkAuth() {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, _handleAuthResult);
}

function _handleAuthResult(authResult) {
    var authorizeButton = document.getElementById('googleButton');
    if (authResult && !authResult.error) {
        _makeApiCall();
    } else {
        authorizeButton.onclick = _handleAuthClick;
    }
}

function _handleAuthClick(event) {
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, _makeApiCall);
    return false;
}

function _makeApiCall() {
    gapi.client.load('calendar', 'v3', _createNushytCalendar);
}

function _createNushytCalendar() {
    if (undefined === window.nushytCalId) {
        var request = gapi.client.calendar.calendarList.list({
            'minAccessRole': 'writer',
            'showHidden': true
        });
        request.execute(_parseList);
    } else {
        _populateNushytCalendar();
    }
}

function _parseList(jsonResp, rawResp) {
    var list = jsonResp.items;
    var lookingForCal = true;
    list.forEach(function(calendar) {
        if (lookingForCal && calendar.summary === "Nushyt") {
            nushytCalId = calendar.id;
            _populateNushytCalendar();
            lookingForCal = false;
        }
    })
    if (lookingForCal) {
        _createNewCalendar();
    }
}

function _createNewCalendar() {
    var request = gapi.client.calendar.calendars.insert({
        'resource': {
            'summary': "Nushyt",
            'description': "A calendar for new media you are interested in."
        }
    });
    request.execute(function(response) {
        window.nushytCalId = response.id;
        _populateNushytCalendar();
    });
}

function _parseEventListResponse(response) {
    if (response.items !== undefined) {
        response.items.forEach(function(item) {
            var date = new Date(item.start.date);
            var entry = new Entry(item.summary, date.getMonth() + 1, date.getDate(), date.getFullYear(), "", "", "");
            removeEntry(toAdd, entry)
        });
        if (response.nextPageToken !== undefined) {
            var request = gapi.client.events.list({
                'calendarId': nushytCalId,
                'pageToken': response.nextPageToken
            });
            request.execute(function(response) {
                _parseEventListResponse(response);
            });
            return;
        }
    }
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

function _populateNushytCalendar() {
    var request = gapi.client.calendar.events.list({
        'calendarId': nushytCalId
    });
    request.execute(function(response) {
        _parseEventListResponse(response);
    });
}

/*
 * add - event handler to add a selection to the user's calendar
*/
function _add(e) {
    var index = e.getAttribute("id");
    e.getElementsByTagName("img")[0].setAttribute("class", "liked");
    
    var entry;
    if (index >= entries.length) {
        entry = preferred[index - entries.length];
    } else {
        entry = entries[index];
    }

    if (!containsEntry(toAdd, entry)) {
        toAdd.push(entry);
        e.getElementsByTagName("h2")[0].innerHTML = "Remove <br> from <br> calendar";
        e.getElementsByClassName("inner")[0].className += "show";
    } else {
        removeEntry(toAdd, entry);
        e.getElementsByTagName("h2")[0].innerHTML = "Add <br> to <br> calendar";
        e.getElementsByClassName("inner")[0].className = "inner four columns ";
    }
}

function reveal(e){
    e.getElementsByTagName("h2")[0].style.visibility = "visible";
}

function hide(e){
    e.getElementsByTagName("h2")[0].style.visibility = "hidden";
}

function createEntry(entry, index){
    
    var date = entry.month + "/" + entry.day + "/" + entry.year;
    if(entry.month == "TBD"){
        var date = "TBD"
    }$("#results").append('<div class=\"result four columns ' + entry.type + '\" id=\"' + index +  '\" onclick=\"_add(this)\" onmouseover=\"reveal(this)\" onmouseout=\"hide(this)\">'
                          +'<div class=\"inner four columns \">'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2> Add <br> to <br> calendar </h2>'
                          +'<h3>' + entry.detail + date + '</h1>'
                          +'<img alt="' + entry.title + ' image" src="' + entry.picture + '" />'
                          +'</div>'
                          +'</div>');
    
    if(entry.picture !== "" )
        document.getElementById(index).style.backgroundImage = "url("+entry.picture+")";
    
}

function createPersonal(entry, index){
    var date = entry.month + "/" + entry.day + "/" + entry.year;
    if(entry.month == "TBD"){
        var date = "TBD"
    }
    $("#personal").append('<div class=\"result four columns ' + entry.type + '\" id=\"' + index +  '\" onclick=\"_add(this)\" onmouseover=\"reveal(this)\" onmouseout=\"hide(this)\">'
                          +'<div class=\"inner four columns \">'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2> Add <br> to <br> calendar </h2>'
                          +'<h3>' + entry.detail + date + '</h1>'
                          +'<img alt="' + entry.title + ' image" src="' + entry.picture + '" />'
                          +'</div>'
                          +'</div>');
    
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

function onSubmit() {
    document.getElementById("personal").style.display = "block";
    var baseUrl = "http://www.tastekid.com/ask/ws?q=";
    var likesUrl = baseUrl+document.getElementById('likes').value+"&f=nushyt4577&k=nznkmjqxm2e0&verbose=1&format=JSON&jsonp=likesCallback";
    $.ajax({
        url: likesUrl,
        dataType: "jsonp",
        success: likesCallback
    });
    document.getElementById('likes').value = "";
}

function likesCallback(data) {
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
                    if(containsEntry(preferred, entry) === false)
                        preferred.push(entry);
                    createPersonal(entry, count);
                    count++
                }
            });
        });
        preferred = preferred.sort(function(e1, e2) {
            return e1.compare(e2);
        });
    }
}



function callback() {
    entries = entries.sort(function(e1, e2) {
        return e1.compare(e2);
    });
    $("#results"). empty();
    var count = 0;
    entries.forEach(function(entry) {
        createEntry(entry, count);
        count++;
    });
}

var color;

function all() {
    var items = document.getElementsByClassName("result");
    $.each(items, function(index, item) {
        items[index].style.display = "block";
    });
    for(var i = 0; i<preferred.length; i++){
        document.getElementById(i+entries.length).style.display = "block";
    }
    var tabs = document.getElementsByClassName("tab");
    for(var i = 0; i<tabs.length; i++){
        tabs[i].style.backgroundColor = "#043731";
    }
    document.getElementById("all").style.backgroundColor = "#34C6CD";
    window.color = "#34C6CD";
}

function movies() {
    var items = document.getElementById("results").getElementsByClassName("result");
    for(var i = 0; i<items.length; i++){
        if(entries[i].type !== "movie")
            items[i].style.display = "none";
        else{
            items[i].style.display = "block";
        }
    }
    for(var i = 0; i<preferred.length; i++){
        if(preferred[i].type !== "movie"){
            document.getElementById(i+entries.length).style.display = "none";
        }
        else{
            document.getElementById(i+entries.length).style.display = "block";
        }
    }
    var tabs = document.getElementsByClassName("tab");
    for(var i = 0; i<tabs.length; i++){
        tabs[i].style.backgroundColor = "#043731";
    }
    document.getElementById("movies").style.backgroundColor = "#34C6CD";
    window.color = "#34C6CD";
}

function tv() {
    var items = document.getElementById("results").getElementsByClassName("result");
    for(var i = 0; i<items.length; i++){
        if(entries[i].type !== "tv")
            items[i].style.display = "none";
        else{
            items[i].style.display = "block";
        }
    }
    for(var i = 0; i<preferred.length; i++){
        if(preferred[i].type !== "tv"){
            document.getElementById(i+entries.length).style.display = "none";
        }
        else{
            document.getElementById(i+entries.length).style.display = "block";
        }
    }
    var tabs = document.getElementsByClassName("tab");
    for(var i = 0; i<tabs.length; i++){
        tabs[i].style.backgroundColor = "#043731";
    }
    document.getElementById("tv").style.backgroundColor = "#34C6CD";
    window.color = "#34C6CD";
}

function music() { 
    var items = document.getElementById("results").getElementsByClassName("result");
    for(var i = 0; i<items.length; i++){
        if(entries[i].type !== "music")
            items[i].style.display = "none";
        else{
            items[i].style.display = "block";
        }
    }
    for(var i = 0; i<preferred.length; i++){
        if(preferred[i].type !== "music"){
            document.getElementById(i+entries.length).style.display = "none";
        }
        else{
            document.getElementById(i+entries.length).style.display = "block";
        }
    }
    var tabs = document.getElementsByClassName("tab");
    for(var i = 0; i<tabs.length; i++){
        tabs[i].style.backgroundColor = "#043731";
    }
    document.getElementById("music").style.backgroundColor = "#34C6CD";
    window.color = "#34C6CD";
}

function games() {
    var items = document.getElementById("results").getElementsByClassName("result");
    for(var i = 0; i<items.length; i++){
        if(entries[i].type !== "game"){
            items[i].style.display = "none";
        }
        else{
            items[i].style.display = "block";
        }
    }
    for(var i = 0; i<preferred.length; i++){
        if(preferred[i].type !== "game"){
            document.getElementById(i+entries.length).style.display = "none";
        }
        else{
            document.getElementById(i+entries.length).style.display = "block";
        }
    }
    var tabs = document.getElementsByClassName("tab");
    for(var i = 0; i<tabs.length; i++){
        tabs[i].style.backgroundColor = "#043731";
    }
    document.getElementById("games").style.backgroundColor = "#34C6CD";
    window.color = "#34C6CD";
}


function tabHover(e) {
    window.color = e.style.backgroundColor;
    e.style.backgroundColor = "#339999";
}

function tabUnhover(e) {
    e.style.backgroundColor = window.color;
}

$(document).ready(function() {
    var tab = document.getElementById("all").addEventListener('click', all, false);
    var tab = document.getElementById("movies").addEventListener('click', movies, false);
    var tab = document.getElementById("tv").addEventListener('click', tv, false);
    var tab = document.getElementById("music").addEventListener('click', music, false);
    var tab = document.getElementById("games").addEventListener('click', games, false);
    setInterval(function() {
        drawBanner();
    }, 3000);
});


//below taken from: http://webcheatsheet.com/javascript/disable_enter_key.php
function stopRKey(evt) { 
    var evt = (evt) ? evt : ((event) ? event : null); 
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
    if ((evt.keyCode == 13) && (node.type=="text"))  { onSubmit(); return false;} 
} 

document.onkeypress = stopRKey;