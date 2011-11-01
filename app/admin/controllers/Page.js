(function ($, tmpl, html, service) {
	
	var helpers = {
		date: MVC.util.string.formatDate
	};
		
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {
			
			var pageSize = parseInt(params.p2),
          index = parseInt(params.p1),
          campaignGuid = params.p3;
			
			//    
	    service.get({
				url: 'page/list/' + index + '/' + pageSize,
		    success: function (d) {
		    	
		    	// Paging.
          helpers.paging = function () {
            return html.paging({
              currentPage: index,
              itemsPerPage: pageSize,
              numberofItems: d.data.pageCount,
              pageNumberPrefix: "#Page/Index/",
              pageNumberSuffix: "/" + pageSize + '/',
              showPerPage: false
            });
          };
		    	
	    		var content = tmpl(view, {
	    			pages: d.data.pages
	    		}, helpers);
		    	callBack(content);
	    	}
	    });
    },
    Edit: function (params, view, callBack, onError) {
    	
    	service.get({
				url: 'page/view/' + params.p1,
		    success: function (d) {

	    		var content = tmpl(view, {
	    			page: d.data
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
								url: 'page/update',
				        success: function (d) {
	
				        	// Show message.
				        	MVC.message.show({text: 'Page was saged.', hideDealy: 2000});
				        }
				      });
				      
						return false;
					});
					
					// Bind save click.
					deleteBtn.click(function(){
						
						var fromData = form.serialize();
		
							service.send({
								data: {
									url: params.p1
								},
								url: 'page/delete',
				        success: function (d) {
									
									window.location.hash = 'Page';
									
				        	// Show message.
				        	MVC.message.show({text: 'Page was deleted!', hideDealy: 2000});
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
						url: 'page/create',
		        success: function (d) {
							
							window.location.hash = 'Page';
							
		        	// Show message.
		        	MVC.message.show({text: 'Page was created!', hideDealy: 2000});
		        }
		      });
		      
				return false;
			});
			
	  	callBack(content);
    }
  };

})(jQuery, jQuery.tmpl, MVC.html, MVC.service)