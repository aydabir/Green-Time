"use strict";

// Helpers

var log = function(message, type) {
  if (debug) {
    switch (type) {
      case 'info':
        console.info(message);
        break;
      case 'log':
        console.log(message);
        break;
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
      default:
        console.log(message);
    }
  }
};

// Variables
var debug = true;

log('backround.js is loaded', 'info');

// Functions

/* example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });
*/


/*
 * onUpdate.listener : it's fired by chrome when a tab's url changed
 * @tabId : int // it is fired tab's id
 * @changeInfo : object // it's have tab's update progress info
 * @tab : Tab object // it's fired tab object
 */
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // this event 3 times fired 1st: loading , 2st : complated, 3st : when redirect of a new tab(new created tabs too include redirecting)
  if (changeInfo.status === 'complete') {
    blackList.isHave(tab.url, function(result) {
      tabManager.sendMessage(tab.id, result.item, function(result) {
        if(result.received){
          log('Message received from tab','info')
        }
      });
    });
  }
});

/*
 * parseURL : convert string url to <a> link element.
 * return :
 *  parser.href      // => "http://example.com:3000/pathname/?search=test#hash"
 *  parser.protocol; // => "http:"
 *  parser.hostname; // => "example.com"
 *  parser.port;     // => "3000"
 *  parser.pathname; // => "/pathname/"
 *  parser.search;   // => "?search=test"
 *  parser.hash;     // => "#hash"
 *  parser.host;     // => "example.com:3000"
 */
var parseUrl = function(url) {
  var parser = document.createElement('a');
  if (url.slice(0, 4) !== 'http') {
    url = 'http://' + url;
  }
  parser.href = url;
  return parser;
};

/*
 * BlackListItemClass : it's a black list item for banned URLs
 * @url : string // banned site's URL
 * @justification : string // why user blocked this URL
 * return : object
 */
var BlackListItem = function(urlParameter, justificationParameter) {
  return {
    url: urlParameter,
    justification: justificationParameter
  };
};

/*
 * BlackListClass : list for banned URL's
 * @blackListItem : BlackListItemClass // banned url's object with some properties
 * list : array // it's stored all BlackListItem
 * load : function // it's load from storage all saved BlackListItems
 * getAll : function // it's return all blackListItems in a array;
 * get : function(url) // it's return blackListItem if list have it is another case is list don't have blackListItem then it's return null.
 ** get@url : <a> link object // it's a link object
 * add : function(blackListItemParameter) // it's add a new blackListItemParameter to the blackList;
 ** add@blackListItemParameter : blackListItemParameter // what if you want added to blackList
 *isHave : function(url) // it's return true/false situation of existing @url parameter in blackList
 ** isHave@url : <a> link object // it's a link object
 ** isHave@done : it's a callback function when isHave return true work if developer setted a callback function.
 *
 */
var BlackList = function() {
  // Private variables
  var _list = JSON.parse(localStorage.getItem("mysetting")) || [];

  // Private functions
  var _isHave = function(url, callback) {
    // ToDo : add @url type check
    var _blackListItem = _get(url);
    var _isExist = _blackListItem !== null;
    if (callback !== null && _blackListItem !== null) {
      callback({
        item: _blackListItem,
        isExist: _isExist
      });
    }
  };


  var _add = function(blackListItemParameter) {
    // ToDo:(Check list is it have same url if it's true just update not add)
    _list.push(blackListItemParameter);
    return true;
  };

  var _getAll = function() {
    return _list;
  };

  var _load = function() {
    var obj = JSON && JSON.parse(json);
    log(obj);
  };

  var _get = function(url) {
    if (typeof(url) !== "object") {
      url = parseUrl(url);
    }
    if (url.host.length <= 0) {
      log('url must be parsed by parseUrl', 'error');
      return false;
    }

    var blackListItemIndex = _indexOfList(_list, url.host);
    if (blackListItemIndex !== -1) {
      return _list[blackListItemIndex];
    } else {
      log(url.host + ' is not blocked', 'info');
      return null;
    }
  };


  var _indexOfList = function(dataList, urlParam) {
    for (var i = 0; i <= dataList.length - 1; i++) {
      if (dataList[i].url == urlParam) {
        return i;
      }
    }
    return -1;
  };

  // Public functions & variables
  return {

    load: function() {
      return _load();
    },

    getAll: function() {
      return _getAll();
    },

    get: function(url) {
      return _get(url);
    },

    add: function(blackListItemParameter) {
      return _add(blackListItemParameter);
    },

    isHave: function(url, callback) {
      _isHave(url, callback);
    }

  };


};

var blackList = new BlackList();

var TabManager = function() {

  var _sendMessage = function(tabId, content, callback) {
    chrome.tabs.sendMessage(
      tabId,
      content,
      function(response) {
        callback(response);
      });
  };

  return {
    sendMessage: function(tabId, content, callback) {
      _sendMessage(tabId, content, callback)
    }
  }

};

var tabManager = new TabManager();
