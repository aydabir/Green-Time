/*
 // more or less what is taken from https://developer.chrome.com/extensions/optionsV2 :)
 var urlList = [];
var daytimeList = [];

 // Saves options to chrome.storage.sync
 function save_options() {
 var strUrls = document.getElementById('urlList').value;
  var strDaytime = document.getElementById('daytime').value;

 // create an array of urls from the str
 urlList = parseUrls(strUrls);
  daytimeList = parseDaytime(strDaytime);

 // option items
 items = {
    urlList: urlList,
    daytimeList: daytimeList
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
    urlList: urlList,
    daytimeList: daytimeList
 }, function(items) {
 // control the undefined case
 if(!items) return;

 var strUrls = updateUrls(items.urlList);
    var strDaytime = updateDaytime(items.daytimeList);

 document.getElementById('urlList').value = strUrls;
    document.getElementById('daytime').value = strDaytime;

 // update the bg options
 chrome.runtime.sendMessage({topic: "update options",options:items});

 });
 // log the bg console
 chrome.runtime.sendMessage({topic: "console log",log:"options loaded"});
 }

// parses the str into array of urls
// returns list of urls
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

function parseDaytime(strDaytime) {
  // TODO: Make it safer
  var intervalList = strDaytime.split(",");

  for(var i=0; i<intervalList.length; i++){
    strInterval = intervalList[i];
    timeList = strInterval.split("-");

    begin = parseHour(timeList[0]);
    end = parseHour(timeList[1]);

    if(!begin || !end){
      // clear assign
      begin = {hour: 0, minute: 0};
      end = {hour: 0, minute: 0};
    }

    // create an interval object
    var interval = {
      begin: begin,
      end: end
    };

    intervalList[i] = interval;
  }

  return intervalList;
}

function parseHour(strTime) {

  // strip the string
  strTime = strTime.replace(/^\s+|\s+$/g, '');

  if(strTime.length < 3 || strTime.length > 4) {
    // log the bg console
    chrome.runtime.sendMessage({topic: "console log",log:"Inappropriate time: "+strTime});
    return false;
  }

  var strHour;
  var strMinute;

  if(strTime.length == 3){
    strHour = strTime.substr(0, 1);
    strMinute = strTime.substr(1, 2);
  }else {
    strHour = strTime.substr(0, 2);
    strMinute = strTime.substr(2, 2);
  }

  var time = {
    hour: parseInt(strHour),
    minute: parseInt(strMinute)
  };

  chrome.runtime.sendMessage({topic: "console log", log:"time: "+time.hour+"."+time.minute});

  return time;
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

// update the daytimeList, inform background script
// Returns the list of daytime intervals as str
function updateDaytime(newDaytimeList){
  if(!newDaytimeList) return "";

  daytimeList = newDaytimeList;

  // add to str one by one
  var strDaytime = "";
  for (var i=0; i<daytimeList.length; i++){
    strBegin = "" + daytimeList[i].begin.hour + daytimeList[i].begin.minute;
    strEnd = "" + daytimeList[i].end.hour + daytimeList[i].end.minute;
    strDaytime = strDaytime + strBegin + "-" + strEnd + ", ";
  }
  return strDaytime;
 }

 document.addEventListener('DOMContentLoaded', handleDomLoaded);
 */

/*
 BlockList : blueprint for the BlockList
 @return void
 */
var BlockList = function () {
	"use strict";

	// Private Variables [1]
	var _list = [];

	// Private Methods [3]
	/*
	 * loadStorage : load stored data from chrome api and set to the _list
	 * @return filled or empty array
	 */
	var loadStorage = function () {
		chrome.storage.sync.get("blockList", function (data) {
			if (Util.isEmpty(data)) {
				console.warn("Null blocked domain list");
				return [];
			} else {
				_list = data.blockList;
				return {
					"list": data.blockList
				};
			}
		});
	};
	var constructor = (function () {
		loadStorage();
	})();
	/*
	 * find : it's return index of the founded domain if it's fail will be return false
	 * @param domain : it must be instance of Domain
	 */
	var find = function (domain) {
		"use strict";
		if (!(domain instanceof Domain)) {
			console.error("Domain is not valid");
			return false;
		}
		var _index = _.findIndex(_list, {url: domain.url});
		var result = {index: _index, status: parseInt(_index) !== parseInt(-1) ? true : false};
		return result;
	};

	//Public Variables

	// Public Methods [4]
	/*
	 * getList : it's return the _list
	 * @return empty array or the _list
	 */
	this.getList = function () {
		if (Util.isEmpty(_list)) {
			console.warn("Null blocked domain list");
			return [];
		} else {
			return _list;
		}
	};
	/*
	 addaddDomain : it's add a new domain to the _list
	 @param domain : must be instance of the Domain object
	 @return boolean
	 */
	this.addDomain = function (domain) {
		if (!(domain instanceof Domain)) {
			console.error("Domain is not valid");
			return false;
		}
		if (find(domain).status) {
			console.error("this domain already added if you want update a domain, call the .update(domain) function");
			return false;
		}
		var tempList;
		if (_list.length > 0) {
			tempList = this.getList();
		} else {
			tempList = [];
		}
		tempList.push(domain);
		chrome.storage.sync.set({"blockList": tempList}, function () {
			_list.push(domain);
			loadStorage();
			console.info("Added");
		});
		return true;
	};
	/*
	 updateDomain : it's update given domain from the _list
	 @param domain : must be instance of the Domain object
	 @return boolean
	 */
	this.updateDomain = function (domain) {
		if (!(domain instanceof Domain)) {
			console.error("Domain is not valid");
			return false;
		}

		var indexOfDomain = find(domain);
		if (!indexOfDomain.status) {
			console.error("given domain doesn't exist on the _list");
			return false;
		}
		_list[indexOfDomain.index] = domain;

		chrome.storage.sync.set({"blockList": _list}, function () {
			console.info("Updated");
		});
		return true;
	};
	/*
	 view : it's print a fancy table of the _list on the console
	 @return void
	 */
	this.view = function () {
		console.table(blockList.getList());
	};
	/*
	 clear : clear all domains in _list
	 @param areYouDrunk : you must provide you're not drunk
	 @return boolean
	 */
	this.clear = function (areYouDrunk) {
		if (!Util.isEmpty(areYouDrunk) && areYouDrunk.toString() == "Nope") {
			_list = [];
			chrome.storage.sync.set({"blockList": _list}, function () {
				console.info("Cleaned");
			});
			return true;
		} else {
			console.error("System.Exception.TooMuchBeer");
			console.warn("Please shut the PC and go to the bed.");
			return false;
		}
	}

};

var Util = {
	/*
	 isEmpty : check the given object is empty,null or undefined
	 @return boolean
	 */
	isEmpty: function (value) {
		if (typeof value == "string") value = value.trim();
		return value == null ||
			value === '' ||
			value === undefined ||
			value === null ||
			Object.keys(value).length === 0;
	}
};

/*
 Domain : blueprint of domains
 @param paramUrl : the web url of the website
 @return boolean only if false
 */
var Domain = function (_url, _waitTime, _category) {
	"use strict";
	if (typeof _url === "string") {

		if (Util.isEmpty(_url)) {
			throw Error("Domain url must be entered");
		}

		this.url = _url;
		this.waitTime = _waitTime || 5;
		this.category = _category || 'General';

	} else if (typeof _url === "object") {

		if (Util.isEmpty(_url.url)) {
			throw Error("Domain url must be entered");
		}

		var obj = _url;
		this.url = obj.url;
		this.waitTime = obj.waitTime || 5;
		this.category = obj.category || 'General';
	}

	this.statistics = {
		totalVisitCount: 0,
		totalVisitTime: 0
	}
};

var blockList = new BlockList();
