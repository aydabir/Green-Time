/*
 // more or less what is taken from https://developer.chrome.com/extensions/optionsV2 :)
 var urlList = [];
var daytimeList = [];

 // Saves options to chrome.storage.sync
 function save_options() {
 var strUrls = document.getElementById('urlList').value;
  var strDaytime = document.getElementById('daytime').value;

 // create an array of urls from the str
 urlList = parseUrls(strUrls);
  daytimeList = parseDaytime(strDaytime);

 // option items
 items = {
    urlList: urlList,
    daytimeList: daytimeList
 };

 chrome.storage.sync.set(items, function() {
 // Update status to let user know options were saved.
 var status = document.getElementById('status');
 status.textContent = 'Options saved.';
 setTimeout(function() {status.textContent = '';}, 1000);
 });

 // update bg options via message
 chrome.runtime.sendMessage({topic: "update options",options:items});
 // log the bg console
 chrome.runtime.sendMessage({topic: "console log",log:"options saved"});
 }

 // Restores select box and checkbox state using the preferences
 // stored in chrome.storage.sync
 function handleDomLoaded(){
 // start listening the save button
 document.getElementById('save').addEventListener('click', save_options);

 chrome.storage.sync.get({
    urlList: urlList,
    daytimeList: daytimeList
 }, function(items) {
 // control the undefined case
 if(!items) return;

 var strUrls = updateUrls(items.urlList);
    var strDaytime = updateDaytime(items.daytimeList);

 document.getElementById('urlList').value = strUrls;
    document.getElementById('daytime').value = strDaytime;

 // update the bg options
 chrome.runtime.sendMessage({topic: "update options",options:items});

 });
 // log the bg console
 chrome.runtime.sendMessage({topic: "console log",log:"options loaded"});
 }

// parses the str into array of urls
// returns list of urls
 function parseUrls(strUrls) {
 newUrlList = strUrls.split("\n");

 for(var i=0; i<newUrlList.length; i++){
 // strip the string
 newUrlList[i] = newUrlList[i].replace(/^\s+|\s+$/g, '');
 // if empty then remove
 if(newUrlList[i].length <= 0){
 // removes it from the list
 newUrlList.splice(i, 1);
 }
 }
 return newUrlList;
 }

function parseDaytime(strDaytime) {
  // TODO: Make it safer
  var intervalList = strDaytime.split(",");

  for(var i=0; i<intervalList.length; i++){
    strInterval = intervalList[i];
    timeList = strInterval.split("-");

    begin = parseHour(timeList[0]);
    end = parseHour(timeList[1]);

    if(!begin || !end){
      // clear assign
      begin = {hour: 0, minute: 0};
      end = {hour: 0, minute: 0};
    }

    // create an interval object
    var interval = {
      begin: begin,
      end: end
    };

    intervalList[i] = interval;
  }

  return intervalList;
}

function parseHour(strTime) {

  // strip the string
  strTime = strTime.replace(/^\s+|\s+$/g, '');

  if(strTime.length < 3 || strTime.length > 4) {
    // log the bg console
    chrome.runtime.sendMessage({topic: "console log",log:"Inappropriate time: "+strTime});
    return false;
  }

  var strHour;
  var strMinute;

  if(strTime.length == 3){
    strHour = strTime.substr(0, 1);
    strMinute = strTime.substr(1, 2);
  }else {
    strHour = strTime.substr(0, 2);
    strMinute = strTime.substr(2, 2);
  }

  var time = {
    hour: parseInt(strHour),
    minute: parseInt(strMinute)
  };

  chrome.runtime.sendMessage({topic: "console log", log:"time: "+time.hour+"."+time.minute});

  return time;
}

 // update the urlList, inform background script
 // Returns the list of urls as str: strUrls
 function updateUrls(newUrlList){
 if(!newUrlList) return "";

 urlList = newUrlList;

 // add to str one by one
 var strUrls = "";
 for (var i=0; i<urlList.length; i++){
 strUrls = strUrls + urlList[i] + "\n";
 }

 return strUrls;
}

// update the daytimeList, inform background script
// Returns the list of daytime intervals as str
function updateDaytime(newDaytimeList){
  if(!newDaytimeList) return "";

  daytimeList = newDaytimeList;

  // add to str one by one
  var strDaytime = "";
  for (var i=0; i<daytimeList.length; i++){
    strBegin = "" + daytimeList[i].begin.hour + daytimeList[i].begin.minute;
    strEnd = "" + daytimeList[i].end.hour + daytimeList[i].end.minute;
    strDaytime = strDaytime + strBegin + "-" + strEnd + ", ";
  }
  return strDaytime;
 }

 document.addEventListener('DOMContentLoaded', handleDomLoaded);
 */


var blockList = new BlockList();
