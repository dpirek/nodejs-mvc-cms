(function ($, tmpl, util, html, service) {
	
  var helpers = {
  	truncate: util.truncate,
  	formatDate: util.string.formatDate,
  	helpers: html.select
  };
	
	// Get user decision.	
	var userSession = MVC.session.get('user');

	// Creating menu entitelment.
  if (userSession.userType === 'root') {
    helpers.getOrgControl = function (name, list, selected) {
    	
    	var selectList = [];

    	// Need to remap.
    	$.each(list, function(i, d){
    		selectList.push({
    			value: d.guid,
    			text: d.name
    		});
    	});
    	
    	return html.select(name, selectList, selected);
    }
  } else {
    helpers.getOrgControl = function (name, list, selected) {
      return '<span>' + userSession.organizationName + '</span><input name="organizationGuid" value="' + userSession.organizationGuid + '" type="hidden" />';
    };
  }
	
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {
			
			var url = 'user/list';
			
	    service.get({
				url: url,
		    success: function (d) {

		    	var pageSize = parseInt(params.p2),
          	index = parseInt(params.p1);
		    	
		    	// Paging.
          helpers.paging = function () {
            return html.paging({
              currentPage: index,
              itemsPerPage: pageSize,
              numberofItems: 100,
              pageNumberPrefix: "#/User/Index/",
              pageNumberSuffix: "/" + 10 + '/',
              showPerPage: true
            });
          };
		    	
	    		var content = tmpl(view, {
	    			users: d.data.users
	    		}, helpers);
		    	callBack(content);
	    	}
	    });
    },
    View: function (params, view, callBack, onError) {
    	
    	service.get({
				url: 'user/view/' + params.p1,
		    success: function (d) {
				
	    		var content = tmpl(view, {
	    			user: d.data.user
	    		}, helpers);
	    		
	    		var deleteBtn = $('#deleteBtn', content);
	    		
					// Bind save click.
					deleteBtn.click(function(){
	
						// Add guid.
						service.send({
							data: {guid: params.p1},
							url: 'user/delete',
				      success: function (d) {
								
								window.location.hash = 'User';
								
				      	// Show message.
				      	MVC.message.show({text: 'User was updated!', hideDealy: 2000});
				      }
				    });
				    
	    			return false;
					});
	    		
		    	callBack(content);
	    	}
	    });
    },
    Edit: function (params, view, callBack, onError) {
    	
    	var userGuid = params.p1;
    	
    	service.get({
				url: 'user/view/' + userGuid,
		    success: function (d) {
		    
	    		var content = tmpl(view, {
	    			user: d.data.user,
	    			session: userSession
	    		}, helpers);
	    		
	    		// Bind From.
					var form = $('form', content),
							saveBtn = $('#saveBtn', content);
					
					// Bind save click.
					saveBtn.click(function(){
						
						var fromData = form.serialize();
							
							// Add guid.
							service.send({
								data: fromData,
								url: 'user/update',
					      success: function (d) {
									
									//window.location.hash = 'User';
									
					      	// Show message.
					      	MVC.message.show({text: 'User was updated!', hideDealy: 2000});
					      }
					    });
	    			return false;
					});
		    	callBack(content);
	    	}
	    });
    },
    Create: function (params, view, callBack, onError) {

    	var content = tmpl(view, {
    		session: userSession
    		}, helpers);
	    
	    // Bind From.
			var form = $('form', content),
					saveBtn = $('#saveBtn', content);
			
			// Bind save click.
			saveBtn.click(function(){
				
				var fromData = form.serialize();
	
					service.send({
						data: fromData,
						url: 'user/create',
		        success: function (d) {
							
							window.location.hash = 'User';
							
		        	// Show message.
		        	MVC.message.show({text: 'User was created!', hideDealy: 2000});
		        }
		      });
		      
				return false;
			});

		  callBack(content);
    }
  };

})(jQuery, jQuery.tmpl, MVC.util, MVC.html, MVC.service)