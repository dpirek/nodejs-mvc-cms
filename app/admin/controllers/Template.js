(function ($, tmpl, html, service) {
	
	var helpers = {};
		
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {

			// Get template
	    service.get({
				url: 'template/get/' + params.p1,
		    success: function (d) {

	    		var content = tmpl(view, {
	    			template: d.data
	    		});
	    		
	    		var form = $('form', content),
							saveBtn = $('#save', content);

	    		saveBtn.click(function(){
						
						var fromData = form.serialize();
						
						// Add page param.
						fromData = fromData + '&page=' + params.p1;
						
						// Save to server.
						service.send({
							data: fromData,
							url: 'template/update',
			        success: function (d) {

			        	// Show message.
			        	MVC.message.show({text: 'Saved!', hideDealy: 2000});
			        }
			      });
				      
						return false;
					});
	    		
		    	callBack(content);
	    	}
	    });
    }
	};

})(jQuery, jQuery.tmpl, MVC.html, MVC.service)