// more or less what is taken from https://developer.chrome.com/extensions/optionsV2 :)
var urlList = [];

// Saves options to chrome.storage.sync.
function save_options() {
  var strUrls = document.getElementById('urlList').value;

  urlList = strUrls.split("\n");

  for(var i=0; i<urlList.length; i++){
    // strip the string
    urlList[i] = urlList[i].replace(/^\s+|\s+$/g, '');
    // if empty then remove
    if(urlList[i].length <= 0){
      urlList.splice(i, 1);
    }
  }

  items = {
    urlList: urlList
  };

  chrome.storage.sync.set(items, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {status.textContent = '';}, 1000);
  });
  // update bg options
  chrome.runtime.sendMessage({topic: "update options",options:items});

  // log the bg console
  chrome.runtime.sendMessage({topic: "console log",log:"options saved"});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function handleDomLoaded(){

  document.getElementById('save').addEventListener('click', save_options);

  chrome.storage.sync.get({
    urlList: urlList
  }, function(items) {
    // control the undefined case
    if(!items || !items.urlList){
      return;
    }

    urlList = items.urlList;
    // update the bg options
    chrome.runtime.sendMessage({topic: "update options",options:items});

    var strUrls = "";
    for (var i=0; i<urlList.length; i++){
      strUrls = strUrls + urlList[i] + "\n";
    }

    document.getElementById('urlList').value = strUrls;

  });
  // log the bg console
  chrome.runtime.sendMessage({topic: "console log",log:"options loaded"});
}

document.addEventListener('DOMContentLoaded', handleDomLoaded);
