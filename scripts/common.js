var likes = [];
var inputs = [];



function Entry(title, month, day, year, detail, picture){
  this.month = month; 
  this.day = day;
  this.year = year;
  this.title = title;
  this.picture = picture;
  this.detail = detail;
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

function createEntry(entry){
  $("#results").append('<div class=\"result\">'
                          +'<img src="' + entry.picture + '" />'
                          +'<h1>' + entry.title + '</h1>'
                          +'<h2> Add to calendar </h2>'
                          +'<h3>' + entry.detail + entry.month + "/" + entry.day + "/" + entry.year + '</h1>'
                          +'</div>');
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
  console.log(data);
  var name = data['Similar']['Info']['0']['Name'];
  var type = data['Similar']['Info']['0']['Type'];
  if(type !== "unknown"){
    inputs.push({'Name':name, 'Type':type});
    $('#inputs').append('<h3>' + inputs[inputs.length-1]['Name'] + '</h3>');

    data['Similar']['Results'].forEach(function(obj){
      likes.push({'Name':obj['Name'], 'Type':obj['Type']});
    });
  }
  else{

  }
  console.log(inputs);
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