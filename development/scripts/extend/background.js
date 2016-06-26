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


function filterTab(tab){
  if(!tab || !tab.url){
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
