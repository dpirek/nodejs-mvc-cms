(function ($, tmpl, html, service) {
	
	var helpers = {
		date: MVC.util.string.formatDate
	};
		
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {
			
			//    
	    service.get({
				url: 'zone/list',
		    success: function (d) {
		    
		    	// Paging.
          helpers.paging = function () {
            return html.paging({
              currentPage: 1,
              itemsPerPage: 10,
              numberofItems: 100,
              pageNumberPrefix: "#/Zone/Index/",
              pageNumberSuffix: "/" + 10 + '/',
              showPerPage: false
            });
          };
		    	
	    		var content = tmpl(view, {
	    			zones: d.data
	    		}, helpers);
		    	callBack(content);
	    	}
	    });
    },
    Edit: function (params, view, callBack, onError) {
    	
    	service.get({
				url: 'zone/view/' + params.p1,
		    success: function (d) {
					
	    		var content = tmpl(view, {
	    			zone: d.data
	    		}, helpers);
	    		
	    			    		// Bind From.
					var form = $('form', content),
							saveBtn = $('#save', content),
							deleteBtn = $('#delete', content);
					
					// Bind save click.
					saveBtn.click(function(){
						
						var fromData = form.serialize();
		
							service.send({
								data: fromData,
								url: 'zone/update',
				        success: function (d) {
	
				        	// Show message.
				        	MVC.message.show({text: 'Zone was saved!', hideDealy: 2000});
				        }
				      });
				      
						return false;
					});
					
					// Bind save click.
					deleteBtn.click(function(){
						
						var fromData = form.serialize();
		
							service.send({
								data: {
									key: params.p1
								},
								url: 'zone/delete',
				        success: function (d) {
									
									window.location.hash = 'Zone';
									
				        	// Show message.
				        	MVC.message.show({text: 'Zone was deleted.', hideDealy: 2000});
				        }
				      });
				      
						return false;
					});

		    	callBack(content);
	    	}
	    });
    },
    Create: function (params, view, callBack, onError) {

			var content = tmpl(view, {}, helpers);
			
			// Bind From.
			var form = $('form', content),
					saveBtn = $('#save', content);
			
			// Bind save click.
			saveBtn.click(function(){
				
				var fromData = form.serialize();
	
					service.send({
						data: fromData,
						url: 'zone/create',
		        success: function (d) {
							
							window.location.hash = 'Zone';
							
		        	// Show message.
		        	MVC.message.show({text: 'Zone was created!', hideDealy: 2000});
		        }
		      });
		      
				return false;
			});
			
	  	callBack(content);
    }
  };

})(jQuery, jQuery.tmpl, MVC.html, MVC.service)