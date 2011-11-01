(function ($, service) {
	
	// Local HTML helper.
	var html = {
			menu: function(d){
		
			// Define string builder.
			var sb = MVC.util.string.stringBuilder();
		
			$.each(d, function(i, d){
				
				if(d.items){
					
					// Bild child tags.
					var childItems = MVC.util.string.stringBuilder();
					
					$.each(d.items, function(i, d){
						childItems.append(d.url + ' ');
					});
					
					sb.append('<li><a href="#' + d.url + '" childUrls="' + childItems.toString() + '">' + d.text + '</a></li>');
				} else {
					sb.append('<li><a href="#' + d.url + '">' + d.text + '</a></li>');
				}
			});
		
			return sb.toString();
		},
		sideMenu: function(d){
			
			var sb = MVC.util.string.stringBuilder();
		
			$.each(d, function(i, d){
				sb.append('<li><a href="#' + d.url + '">' + d.text + '</a></li>');
			});
			
			return '';
		}
	};
	
  var messageElm = $("#message_content"),
      content = $("#content");

  // Bind logout
  $('#user_logout').click(function () {

    service.send({
      url: 'user/logout',
      success: function (d) {
        window.location = 'admin/login.html';
      }
    });

    return false;
  });

  // Authentizate:
	service.get({
		url: 'user/getsession',
    success: function (d) {
			//d.isSucessful = true;
      if (d.isSucessful) {
      	
      	// Set user session.
      	MVC.session.set('user', d.data);
      
      	// Menu.
      	var menuObj = d.data.menuItems,
      			menuHtml = $(html.menu(menuObj)),
      			nav = $('#nav'),
      			sideNav = $('.left_nav');
      	
      	var sideMenuObj = {};
      	/**/
      	$.each(menuObj, function(i, d){
      		
      		var firstLevelChildren = d.items;
      		
      		if(firstLevelChildren){
      			sideMenuObj[d.url] = firstLevelChildren;
      			
      			// Add child mapping.
      			$.each(firstLevelChildren, function(i, d){
      				sideMenuObj[d.url] = firstLevelChildren;
      			});
      		}
      	});
      	
      	// Add top nav items.
				nav.append(menuHtml);
				
        // Put user name in the top bar.
        $('#user_profile_email').text(d.data.userName);

        content.html('<div class="padding"><p>Loading...</p></div>');

        // Plugin init.
        content.MVC({
        	rootPath: 'admin/',
        	viewsPath: "views/",
      		controllersPath: "controllers/",
          routes: [
          {
            name: "Default2", // Name
            path: "{controller}/{action}/{p1}/{p2}/{p3}", // Path.
            params: { controller: "Dash", action: "Index", p1: "1", p2: "10", p3: ""} // Defaults.
          }
        ],
          errorMessage: "<div class='padding'><h1>503 <span>Page</span></h1><p><strong>Ups, something went wrong...</strong></p></div>",
          start: function () {
            messageElm.text("loading...").show();
            
            // Show loader.
            MVC.message.showLoader();
          },
          success: function (d) {
						
						MVC.message.hideLoader();
						
						var controllerName = d.actionObject.controller,
								allMenuItems = $('a', menuHtml),
								currentMenuItem = $('a:[href^="#' + controllerName + '"]', menuHtml),
								childMenuItemParent = $('a:[childUrls*="' + controllerName + '"]', menuHtml);
												
						// Remove highliting.
						allMenuItems.removeClass('selected');
						
						// Add highlighting.
						currentMenuItem.addClass('selected');
						childMenuItemParent.addClass('selected')
						
						// Build side nav.
						if(sideMenuObj[controllerName]){
						
							var sideNavHtml = $(html.menu(sideMenuObj[controllerName]));
						
							sideNav.html(sideNavHtml);
							
							var allSideMenuItems = $('a', sideNavHtml),
									currentSideMenuItem = $('a:[href^="#' + controllerName + '"]', sideNavHtml);

							// Remove highliting.
							allSideMenuItems.removeClass('selected');
							
							// Add highlighting.
							currentSideMenuItem.addClass('selected');
							// Side nav highlighting.
							
						} else {
							sideNav.html('');
						}

						$('#header').fadeIn();
						$('#main').fadeIn();
						
						// Build side Menu.
						//menuHtml = $(html.menu(menuObj));
						//sideMenu
						
            messageElm.hide().text("");
          },
          error: function (ex) {
          	
          	MVC.message.hideLoader();
          
            messageElm.text(ex).show();
          }
        });

      } else {
        //content.html('<div class="padding"><p>You are not logged in!</p></div>');
        window.location = 'admin/login.html';
      }
    }
  });
} (jQuery, MVC.service));