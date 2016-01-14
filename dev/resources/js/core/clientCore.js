"use strict"

console.log('main.js');
window.addEventListener('load', function() {
  // When the document is ready start the main js func
  app();
}, false);

/*
 * App : the main js func started with page's load event trigged
 */
var app = function() {};

/*

chrome.extension.sendMessage({text:"getStuff"},function(reponse){
  //This is where the stuff you want from the background page will be
  if(reponse.type == "test")
    alert("Test received");
});

*/


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (!sender.tab) {
      onMessage(
        {
          request : request,
          sender : sender
        }
      );
      sendResponse({
        received: true
      });
    }
});
