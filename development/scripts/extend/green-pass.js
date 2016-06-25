
function leaveTab(){
  chrome.tabs.query({'active': true}, function(tabs) {
    // Close current active tab
    chrome.tabs.remove(tabs[0].id);
  });
}
