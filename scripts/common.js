var likes = [];
var inputs = [];
var entries = [];
var images = [];
var added = [];

var clientId = '696158853178.apps.googleusercontent.com';
var apiKey = 'AIzaSyBaPMTZhvwVYcgvXbB7wIuxnIgmhA2qnYU';
var scopes = 'https://www.googleapis.com/auth/calendar';

function Entry(title, month, day, year, detail, picture, type){
    this.month = month; 
    this.day = day;
    this.year = year;
    this.title = title;
    this.picture = picture;
    this.detail = detail;
    this.type = type;
}

function handleClientLoad() {
  gapi.client.setApiKey(apiKey);
  window.setTimeout(checkAuth,1);
}

function checkAuth() {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = handleAuthClick;
  }
}

function handleAuthClick(event) {
  gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

function envokeGoogle() {
   gapi.client.setApiKey(apiKey);
    gapi.auth.authorize({client_id: clientId, scope: scopes, immediate: false}, function() {
        gapi.client.load('calendar', 'v3', function() {
            var request = gapi.client.calendar.calendars.insert({
                'resource': {
                    'summary': "Nushyt",
                    'description': "A calendar for new media you are interested in."
                }
            });
            request.execute(function(resp) {
                var id = resp.id;
                added.forEach(function(entry) {
                    var req = gapi.client.calendar.events.insert({
                        'calendarId': id,
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
                    req.execute(function() {
                    });
                });
            });
        });
    });
}

function entryCompare(e1, e2){
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

function add(e){
    var index = e.target.getAttribute("id");
    var entry = entries[index];
    if (!containsEntry(added, entry)) {
        added.push(entry);
        console.log("added event " + entry.title);
    } else {
        console.log(entry.title + " has already been added.");
    }
}

function createEntry(entry, index){
    if(entry.picture === "" )
            entry.picture = "images/poster_default.gif";
    $("#results").append('<div class=\"result " + entry.type + "\">'
                          +'<img src="' + entry.picture + '" />'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2 id=' + index + '> Add to calendar </h2>'
                          +'<h3>' + entry.detail + entry.month + "/" + entry.day + "/" + entry.year + '</h1>'
                          +'</div>');
    var addButton = document.getElementById(index).addEventListener('click', add, false);
}

function createPersonal(entry){
    if(entry.picture === "" )
            entry.picture = "images/poster_default.gif";
    $("#personal").append('<div class=\"result " + entry.type + "\">'
                          +'<img src="' + entry.picture + '" />'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2> Add to calendar </h2>'
                          +'<h3>' + entry.detail + entry.month + "/" + entry.day + "/" + entry.year + '</h1>'
                          +'</div>');
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
        if (entry.title === element.title)
            match = true;
    });
    return match;
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
        entries.forEach(function(entry){
            likes.forEach(function(like){
                if(entry['title'].toLowerCase() === like['Name'].toLowerCase()){
                    createPersonal(entry);
                }
            });
        });
    }
    else{

    }
    console.log(inputs);
}



function callback(){
    entries = entries.sort(entryCompare);
    var count = 0;
    entries.forEach(function(entry) {
        createEntry(entry, count);
        count++;
    });
}

$(document).ready(function() {
    inputs.forEach(function(input){
        $('#inputs').append('<h3>' + input['Name'] + '</h3>')
    });
});


//below taken from: http://webcheatsheet.com/javascript/disable_enter_key.php
function stopRKey(evt) { 
    var evt = (evt) ? evt : ((event) ? event : null); 
    var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null); 
    if ((evt.keyCode == 13) && (node.type=="text"))  { onSubmit(); return false;} 
} 

document.onkeypress = stopRKey;