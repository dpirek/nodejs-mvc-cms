/// <reference path="MVC.util.js" />

/** 
* @fileoverview core session	 class.  
*  
* @author dpirek@gmail.com (David Pirek)
*/

(function($) {

  //creates namespace
  if (typeof MVC == "undefined" || !MVC) {
    window.MVC = {};
  };
	
	var session = {};
	
  MVC.session = {
    get: function (key) {
    
    	if(session[key]){
    		return session[key];
    	} else {
    		return {
    			message: 'no data'
    		};
    	}
    },
    set: function(key, data) {
    	session[key] = data;
			return true;
    }
  };

}(jQuery));