/*
 *   App.js
 *   ToDo:(description here)
 */

var plugin = {

  /*
   * onUpdate
   * Each request pass here on load stage
   */
  onLoad: function(context) {
    log('onLoad event is fired : ' + context.tab.url, 'warn');
  },

  /*
   * beforeEnter
   * Each request pass here on complated stage
   */
  onComplated: function(context) {
    log('onComplated event is fired : ' + context.tab.url, 'warn');
  }

};
