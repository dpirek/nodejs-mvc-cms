/// <reference path="MVC.key.js" />

/** 
* @fileoverview key events helpers.  
*  
* @author dpirek@gmail.com (David Pirek)
*/

(function ($, String, Util) {
  
  var win = $(window);
  
  Util.createNs("MVC.key");
  
  var registeredEvents = [],
      trigerKyes = [];
 
  MVC.key = {
    _triger: function(){
      console.log('did not get');
    },
    clearRegister: function(){
      registeredEvents = [];
      trigerKyes = [];
    },
    registerKeyEvent: function(callBack, keyCode){
    
      trigerKyes.push(keyCode);
      registeredEvents.push(callBack);
    
      MVC.key._triger = function(keyData){
        $.each(registeredEvents, function(i, d){
          d(keyData);
        });
      };
    }
  };
  
  var isCmdPressed = false;
  /*
  // TODO FIX:
  win.keydown(function(event){
    if(event.keyCode === 91) {
      isCmdPressed = true;
    }
  });
  
  win.keyup(function(event){
    if(event.keyCode === 91) {
      isCmdPressed = false;
    }
  });
  */
  win.keypress(function(event) {

    var isMetaPressed = false;
    
    if(event.metaKey || event.ctrlKey || isCmdPressed) {
      isMetaPressed = true;
    }
    
    if ($.inArray(event.which, trigerKyes) === 0 && isMetaPressed) {
      MVC.key._triger({
        keyCode: event.which,
        isMetaPressed: isMetaPressed
      });
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  });
})(jQuery, MVC.util.string, MVC.util);