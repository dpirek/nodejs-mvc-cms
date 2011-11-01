/// <reference path="MVC.message.js" />

/** 
* @fileoverview html helpers.  
*  
* @author dpirek@gmail.com (David Pirek)
*/

(function ($, String, Util) {
		
		// 
		var messageBox = $('#message_box');
		
    //creates namespace
    Util.createNs("MVC.message");
    
    MVC.message = {
    	show: function(settings){

    		messageBox.text(settings.text).show();
    		
    		// Hide message if delay is specified.
    		if(settings.hideDealy){
    			var t = setTimeout(function(){
    				MVC.message.hide();
    			}, settings.hideDealy);
    		}
    	},
    	hide: function(settings){
    		messageBox.fadeOut(500, function(){
    			messageBox.text('');
    		});
    	},
    	showLoader: function(){
    		messageBox.text('loading...').show();
    	},
    	hideLoader: function(){
    		messageBox.text('').hide();
    	}
    };
})(jQuery, MVC.util.string, MVC.util);