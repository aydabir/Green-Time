// more or less what is taken from https://developer.chrome.com/extensions/optionsV2 :)
var urlList = [];

// Saves options to chrome.storage.sync
function save_options() {
  var strUrls = document.getElementById('urlList').value;

  // create an array of urls from the str
  urlList = parseUrls(strUrls);

  // option items
  items = {
    urlList: urlList
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
    urlList: urlList
  }, function(items) {
    // control the undefined case
    if(!items) return;

    var strUrls = updateUrls(items.urlList);
    document.getElementById('urlList').value = strUrls;

    // update the bg options
    chrome.runtime.sendMessage({topic: "update options",options:items});

  });
  // log the bg console
  chrome.runtime.sendMessage({topic: "console log",log:"options loaded"});
}


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

document.addEventListener('DOMContentLoaded', handleDomLoaded);
