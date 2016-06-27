// Properties of background script
var isWaiting = false; // waiting now? control variable
var minuteMultiplier = 60*1000; // bekleme süresi: 5 dakika
// TODO: Waiting time options
var urlList = ["facebook.com"];
var passUrlList = [];


// Funcitons of background script
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("onUpdated "+tab.url);
  // check if the page should be filtered
  doFilter = filterTab(tab);
  // show green-pass if it does
  if(doFilter){
    bringGreenPass(tab);
  }
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
  // check if the page should be filtered
  doFilter = filterTab(tab);
  // show green-pass if it does
  if(doFilter){
    bringGreenPass(tab);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received: " + request.topic);
    if (request.topic == "start waiting"){
      startWaiting(request.time);
    }else if (request.topic == "console log") {
      printLog(request.log);
    }else if (request.topic == "update options") {
      updateOptions(request.options);
    }else if (request.topic == "green-pass url") {
      sendGreenPassUrl(sender.tab.id);
    }

});


function filterTab(tab){
  // check undefined (new tab situation)
  if(!tab || !tab.url){
    return false;
  }
  // check waiting time
  if(isWaiting){
    return false;
  }

  // iterate all urls in list
  len = urlList.length;
  for(var i=0; i<len; i++){
    // if empty then skip
    if(urlList[i].length <= 0) continue;

    var n = tab.url.search(urlList[i]);
    // does it match to the url?
    if (n >= 0) return true;
  }

  return false;
}

function bringGreenPass(tab){
  // Show the green-pass view
  chrome.tabs.update(tab.id, {url: "./views/green-pass.html"});
  // record passUrl to inform green-pass later
  passUrlList[tab.id] = tab.url;
}

// starts waiting the given time*minutes
function startWaiting(time){
  isWaiting = true;
  var totalWait = time*minuteMultiplier;
  // start timer for waiting
  setTimeout(endWaiting, totalWait);
  console.log(totalWait + " Waiting has started");
}

function endWaiting(){
  console.log("Waiting has ended");
  isWaiting = false;
}

// sends green-pass page the url to direct, if user choses to 'visit'
function sendGreenPassUrl(tabId){
  // undefined?
  if (!tabId) {
    console.log("Green-pass tab id is undefined!");
    return;
  }
  // inform Green-pass
  chrome.tabs.sendMessage(tabId, {passUrl: passUrlList[tabId]});
}

// updates the options with the option values coming with message
function updateOptions(options){
  // undefined?
  if (!options) {
    console.log("Options are undefined!");
    return;
  }
  // assign bg variables
  urlList = options.urlList;

  console.log("Options are updated.");
}

// prints the logs coming from other scripts
// to background console for easier debug
function printLog(strLog){
  if (!strLog) {
    console.log("Please assign the request.log field \
    in \"console log\" messages");
  }else {
    console.log(strLog);
  }
}
