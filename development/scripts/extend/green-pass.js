debugger;
console.log("Green-pass is up and running");

var fcnLeaveTab = function leaveTab(){
  console.log("green-pass leaveTab");
  chrome.tabs.query({'active': true}, function(tabs) {
    // Close current active tab
    chrome.tabs.remove(tabs[0].id);
  });
}

document.getElementById("btnLeave").addEventListener("click", fcnLeaveTab);
