"use strict"

/*
* This page is pretty mess it's just test for save and get data list
*/
$(function() {

  var data = localStorage["mysetting"] || '[{"url":"0example.com","justification":"test site","created_at":"12/01/2016"}]';
  var myRecords = JSON.parse(data);
  window.addEventListener('load', function() {

    var render = function() {
      $('#blackList').dynatable({
        dataset: {
          records: myRecords
        }
      });
    };

    document.getElementById("newRuleBtn").addEventListener("click",
      function() {
        var newRule = {
          "url": document.getElementById("newRuleUrl").value,
          "justification": document.getElementById('newRuleJustification').value,
          "created_at": new Date().toISOString()
        };
        if(newRule.url.length===0 || newRule.justification.length===0 ) return false;
        console.log(newRule);
        myRecords.push(newRule);
        var table = document.getElementById('blackList');
        var row = table.insertRow(table.rows.length);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = newRule.url;
        cell2.innerHTML = newRule.justification;
        cell3.innerHTML = newRule.created_at;
          localStorage["mysetting"] = JSON.stringify(myRecords);
          console.log(localStorage["mysetting"]);
          location.reload();
      });


    render();
  });


});
