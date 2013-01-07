(function ($, tmpl, html, service) {
	
	var helpers = {
		date: MVC.util.string.formatDate
	};
		
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {
			
			var pageSize = parseInt(params.p2),
          index = parseInt(params.p1);
			
			//    
	    service.get({
				url: 'blog/list/' + index + '/' + pageSize,
		    success: function (d) {
		    	
		    	// Paging.
          helpers.paging = function () {
            return html.paging({
              currentPage: index,
              itemsPerPage: pageSize,
              numberofItems: d.data.blogCount,
              pageNumberPrefix: "#Blog/Index/",
              pageNumberSuffix: "/" + pageSize + '/',
              showPerPage: false
            });
          };
		    	
	    		var content = tmpl(view, {
	    			blogs: d.data.blogs
	    		}, helpers);
		    	callBack(content);
	    	}
	    });
    },
    Edit: function (params, view, callBack, onError) {
    	
    	service.get({
				url: 'blog/view/' + params.p1,
		    success: function (d) {

	    		var content = tmpl(view, {
	    			blog: d.data
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
								url: 'blog/update',
				        success: function (d) {
	
				        	// Show message.
				        	MVC.message.show({text: 'Saved!', hideDealy: 2000});
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
								url: 'blog/delete',
				        success: function (d) {
									
									window.location.hash = 'Blog';
									
				        	// Show message.
				        	MVC.message.show({text: 'Deleted!', hideDealy: 2000});
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
					saveBtn = $('#save', content),
					titleInput = $('input[name="title"]', content),
					urlInput = $('input[name="url"]', content),
					createUrl = $('#createUrl', content);
					
			// Bind create url click.
			createUrl.click(function(){
				urlInput.val(MVC.util.string.createUrl(titleInput.val()));
				return false;
			});
			// Bind save click.
			saveBtn.click(function(){
				
				var fromData = form.serialize();
	
					service.send({
						data: fromData,
						url: 'blog/create',
		        success: function (d) {
							
							window.location.hash = 'Blog';
							
		        	// Show message.
		        	MVC.message.show({text: d.message, hideDealy: 2000});
		        }
		      });
		      
				return false;
			});
			
	  	callBack(content);
    }
  };

})(jQuery, jQuery.tmpl, MVC.html, MVC.service)