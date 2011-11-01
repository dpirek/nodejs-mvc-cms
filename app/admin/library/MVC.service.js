/// <reference path="MVC.util.js" />

/** 
* @fileoverview core utility class.  
*  
* @author dpirek@gmail.com (David Pirek)
*/

(function($) {

  //creates namespace
  if (typeof MVC == "undefined" || !MVC) {
    window.MVC = {};
  };

  MVC.service = {
  	_log: function(d){
  		// Service logging...
  		
  	},
    get: function (settings) {
		
			var defauls = {
			
			};
			
			$.ajax({
        dataType: MVC.config.service.dataType,
        type: 'get',
        data: settings.data,
        url: MVC.config.service.getUrl + settings.url + MVC.config.service.extension,
        success: function (d) {
					settings.success(d);
        },
        error: function(d){
        
        	// Error call back.
        	settings.error(d);
        	
        	// Service error log.
        	MVC.service._log(d);
        }
      });
    },
    send: function(settings) {
    	
    	// 
			var defauls = {};
			
			$.ajax({
        dataType: MVC.config.service.dataType,
        type: 'post',
        data: settings.data,
        url: MVC.config.service.postUrl + settings.url + MVC.config.service.extension,
        success: function (d) {
					settings.success(d);
        },
        error: function(d){
        
        	// Error call back.
        	settings.error(d);
        	
        	// Service error log.
        	MVC.service._log(d);
        }
      });
    }
  };

}(jQuery));