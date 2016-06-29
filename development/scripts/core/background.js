"use strict";

// This script should not be modified
// unless some core operations are needed.
// It basically is a substructure
// to call functions of extend/background.js script

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.onCreated.addListener(tabCreate);

  chrome.tabs.onUpdated.addListener(tabUpdate);

  chrome.runtime.onMessage.addListener(handleMessage);

  initialize();

});
