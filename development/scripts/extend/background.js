// Properties of background script
var isWaiting = false; // waiting now? control variable
var waitTime = 5*60*1000; // bekleme süresi: 5 dakika
// TODO: Customizable waiting time

// Funcitons of background script
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("onUpdated "+tab.url);
  // check if the page should be filtered
  doFilter = filterTab(tab);
  // show green-pass if it does
  if(doFilter){
    bringGreenPass(tab)
  }
});

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
  // check if the page should be filtered
  doFilter = filterTab(tab);
  // show green-pass if it does
  if(doFilter){
    bringGreenPass(tab)
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Message received: " + request.topic);
    if (request.topic == "start waiting"){
      startWaiting();
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

function startWaiting(){
  console.log("Waiting has started");
  isWaiting = true;
  // start timer for waiting
  setTimeout(endWaiting, waitTime);
}

function endWaiting(){
  console.log("Waiting has ended");
  isWaiting = false;
}
