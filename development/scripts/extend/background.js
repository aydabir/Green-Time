// Properties of background script
var isWaiting = false; // waiting now? control variable
var minuteMultiplier = 60*1000; // bekleme süresi: 5 dakika
// TODO: Customizable waiting time

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

  var tabURL = tab.url;
  var n = tabURL.search("facebook.com");

  if (n >= 0){
    return true;
  }

  return false;
}

var fcnHandleGreenPass = function handleGreenPass(tab){
  // call green-pass javascript
  // chrome.tabs.executeScript(null, {file: "./scripts/extend/green-pass.js"});
}

function bringGreenPass(tab){
  // Show the green-pass view
  chrome.tabs.update(tab.tabId, {url: "./views/green-pass.html"}, fcnHandleGreenPass);
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
