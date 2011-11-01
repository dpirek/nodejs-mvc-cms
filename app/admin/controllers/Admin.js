(function ($, tmpl, html, service) {
	
	var helpers = {};
	
  return {

    // Index action.
    Index: function (params, view, callBack, onError) {
			var content = tmpl(view, {}, helpers);
			
			var btn = $('#croll', content),
					btn2 = $('#list', content);
			
			btn.click(function(){
				
				service.send({
					url: 'spider/hyps',
					success: function(d){
						console.log(d);
					},
					error: function(){
					
					}
				});
	
				return false;
			});
			
			btn2.click(function(){
				
				service.get({
					url: 'hypoteka/list',
					success: function(d){
						//console.log(d);
					},
					error: function(){
					
					}
				});

				return false;
			});
			
			callBack(content);		
    }
  };
})(jQuery, jQuery.tmpl, MVC.html, MVC.service)