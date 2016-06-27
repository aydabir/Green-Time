// more or less what is taken from https://developer.chrome.com/extensions/optionsV2 :)

// Saves options to chrome.storage.sync.
function save_options() {
  chrome.runtime.sendMessage({topic: "console log",log:"options will be saved"});

  var strUrls = document.getElementById('urlList').value;

  var urlList = strUrls.split("\n");

  chrome.runtime.sendMessage({topic: "console log",log:"saved urlList: " + urlList});

  for(var i=0; i<urlList.length; i++){
    // strip the string
    urlList[i] = urlList[i].replace(/^\s+|\s+$/g, '');
  }
  chrome.storage.sync.set({
    urlList: urlList
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {status.textContent = '';}, 750);
  });
  // log the bg console
  chrome.runtime.sendMessage({topic: "console log",log:"options saved"});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.runtime.sendMessage({topic: "console log",log:"options will be restored"});
  document.getElementById('save').addEventListener('click', save_options);
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    urlList: urlList
  }, function(items) {
    // control the undefined case
    if(!items.urlList){
      return;
    }

    var strUrls = "";
    for (var i=0; i<items.urlList.length; i++){
      chrome.runtime.sendMessage({topic: "console log",log:"restored url: " + items.urlList[i]});
      strUrls = strUrls + items.urlList[i] + "\n";
    }

    document.getElementById('urlList').value = strUrls;
  });
  // log the bg console
  chrome.runtime.sendMessage({topic: "console log",log:"options restored"});
}

document.addEventListener('DOMContentLoaded', restore_options);
