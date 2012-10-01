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