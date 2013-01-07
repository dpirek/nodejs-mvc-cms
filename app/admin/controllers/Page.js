(function ($, tmpl, html, service) {
	
  var calcPercentage = function(count, wordCount){
    return Math.round((count/wordCount) * 100);
  }
	
	// Helper definitions.
	var helpers = {
		date: MVC.util.string.formatDate,
		calcPercentage: calcPercentage
	};
  
  var win = $(window);

  var editorSettings = {
    script_url : '/admin/library/tinymce/jscripts/tiny_mce/tiny_mce.js',
    theme : 'advanced',
    height : win.height() - 300,
    theme_advanced_buttons1 : 'bold,italic,underline,|,formatselect,bullist,numlist,|,link,unlink,image,code'
  };
  
  // Parses to array.
  var parseToArray = function(text){
						
		var textArray = text.split(' '),
				cleanArr = [];
		
		$.each(textArray, function(i, d){
		
			var keyword = MVC.util.string.createUrl(d);
		
			if(keyword.length > 3) {
				cleanArr.push(keyword);
			}	
		});		
		
		return cleanArr;
	};
  
  // Creates keyword stats.
  var createKeywordStats = function(content){
		
		// Remove HTML from text.
		var text = $.trim(content.replace(/<.*?>/g, ''));
		
  	var list = parseToArray(text),
  			hash = {},
  			groupCount = [];
  	
  	// Count.
  	$.each(list, function(i, d){
  		if(hash[d]){
  			hash[d]++;
  		} else {
  			hash[d] = 1;
  		}
  	});
  	
  	// To array.
  	var cutOff = 2;
  	$.each(hash, function(i, d){
  	
  		if(d >= cutOff) {
  			groupCount.push({
  				key: i,
  				size: d,
  				percentage: calcPercentage(d, list.length)
  			});
  		}
  	});
  	
  	// Sort by count.
  	var sortBy = 'size';
  	groupCount.sort(function(a, b) {
  	  if (a[sortBy] < b[sortBy])
  	     return 1;
  	  if (a[sortBy] > b[sortBy])
  	    return -1;
  	  return 0;
  	});
  
  	return {
  		groupCount: groupCount,
  		wordCount: list.length
  	};
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
          
          var stats = createKeywordStats(d.data.body);
          
	    		var content = tmpl(view, {
	    			page: d.data,
	    			stats: stats
	    		}, helpers);
	    		
          // Bind From.
					var form = $('form', content),
							saveBtn = $('#save', content),
							keywordDensityContainer = $('#keywordDensityTemplate', content),
							keywordDensityTemplate = $('#keywordDensityTemplate', view).html(),
							deleteBtn = $('#delete', content);

					var t = setTimeout(function(){
            
            // On 'type' event.
            editorSettings.setup = function(ed) {
            
              ed.addShortcut('ctrl+s', 'foo', function(){
                updatePage();
              });
            
              ed.onKeyUp.add(function(ed) {
                
                stats = createKeywordStats(ed.getContent());
                
                var updatedKeyword = tmpl('<div>' + keywordDensityTemplate + '</div>', {
                  stats: stats
                }, helpers);

                keywordDensityContainer.html(updatedKeyword);
              });
            };
            
      		  $('[name="body"]', content).tinymce(editorSettings);
    		  }, 100);
					
					var updatePage = function(){
						
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
					};

					// Bind key events
    			MVC.key.clearRegister();
    			MVC.key.registerKeyEvent(function(){
            if(MVC.util.string.getHashValue() === 'Page/Edit/' + params.p1) {
              updatePage();
            }
    			}, 115);
					
					// Bind save click.
					saveBtn.click(updatePage);
					
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

			var content = tmpl(view, {
        stats: {}
			}, helpers);
			
			// Bind From.
			var form = $('form', content),
					saveBtn = $('#save', content),
					titleInput = $('input[name="title"]', content),
					urlInput = $('input[name="url"]', content),
          keywordDensityContainer = $('#keywordDensityTemplate', content),
          keywordDensityTemplate = $('#keywordDensityTemplate', view).html(),
          isPageCreated = false,
					createUrl = $('#createUrl', content);
		  
		  var t = setTimeout(function(){
		  
		    // On 'type' event.
        editorSettings.setup = function(ed) {
          
          ed.addShortcut('ctrl+s', 'foo', function(){
            updatePage();
          });
          
          ed.onKeyUp.add(function(ed) {
            
            stats = createKeywordStats(ed.getContent());
            
            var updatedKeyword = tmpl('<div>' + keywordDensityTemplate + '</div>', {
              stats: stats
            }, helpers);

            keywordDensityContainer.html(updatedKeyword);
          });
        };
		  
  		  $('[name="body"]', content).tinymce(editorSettings);
		  }, 100);
		  
			// Bind create url click.
			createUrl.click(function(){
				urlInput.val(MVC.util.string.createUrl(titleInput.val()));
				return false;
			});
			
			var savePage = function(){
				
				var fromData = form.serialize();
        
        if(isPageCreated) {
          
          service.send({
          	data: fromData,
          	url: 'page/update',
            success: function (d) {
              MVC.message.show({text: 'Page was updated!', hideDealy: 2000});
            }
          });
        
        } else {
        
          service.send({
          	data: fromData,
          	url: 'page/create',
            success: function (d) {
          		
              if(d.isSucessful) {
                MVC.message.show({text: 'Page was created!', hideDealy: 2000});
                isPageCreated = true;
              } else {
                MVC.message.show({text: 'This URL already exists', hideDealy: 2000});
              }
            }
          });
		    }
				return false;
			};
			
			// Bind key events
			MVC.key.clearRegister();
			MVC.key.registerKeyEvent(function(){
        if(MVC.util.string.getHashValue() === 'Page/Create') {
          savePage();
        }
			}, 115);
						
			// Bind save click.
			saveBtn.click(savePage);
			
	  	callBack(content);
    }
  };

})(jQuery, jQuery.tmpl, MVC.html, MVC.service)