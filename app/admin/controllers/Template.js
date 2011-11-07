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
							saveBtn = $('#save', content),
							editor,
							editorElm = $('#editor', content);

	    		saveBtn.click(function(){
	
						// Save to server.
						service.send({
							data: {
								content: editor.getSession().getValue(),
								page: params.p1
							},
							url: 'template/update',
			        success: function (d) {

			        	// Show message.
			        	MVC.message.show({text: 'Saved!', hideDealy: 2000});
			        }
			      });
				    
						return false;
					});
	    		
		    	callBack(content);
		    	
		    	// Little timeout to make sure elements are covered.
					var tt = setTimeout(function(){
						
						// Height/width of editor.
						var w = editorElm.width() - 30,
								h = $(document).width() - 900;

						// Set.
						editorElm.width(w);
						editorElm.height(h);
					
	    			editor = ace.edit("editor");
	    		}, 10);
	    	}
	    });
    }
	};

})(jQuery, jQuery.tmpl, MVC.html, MVC.service)