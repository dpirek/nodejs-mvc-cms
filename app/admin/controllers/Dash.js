(function ($, tmpl, html, service) {
	
	var helpers = {};
	
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {
			var content = tmpl(view, {}, helpers);
			
			callBack(content);		
    }
  };
})(jQuery, jQuery.tmpl, MVC.html, MVC.service)