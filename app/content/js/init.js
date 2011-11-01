(function($){

	var fader = $('.fader'),
			mapWrap = $('#mapWrap'),
			win = $(window);
	
	// On load fader.
	fader.fadeIn('slow');
	
	var mapOkresy = $('path', mapWrap),
			hoverOkres = $('#hoverOkres');
	
	var closeAllPops = function(){
		$('.pop:visible').hide();
		
		return false;
	};
	
	// Escape click
	$(document).keyup(function(e) {
  	if (e.keyCode === 27) { 
  		closeAllPops();
  	} 	
  });
  
  $('.closePop').click(closeAllPops);

	var bindListings = function(){
		var listing = $('.listing');
		
		listing.click(function(){
			var that = $(this),
					guid = that.attr('guid'),
					div = $('#' + guid);
			
			div.show().height(win.height() - 80);			
			/*
			div.dialog({
				draggable: false,
				modal: true,
				resizable: false,
				width: win.width() - 20,
				height: win.height() - 20
			});
			*/
			// TODO: tracking.
			
			//return false;
		});
				
		// Highlight current listing.
		listing.hover(function(){
			$(this).addClass('highlight');
		}, function(){
			$(this).removeClass('highlight');
		});
				
	};
	
	// Bind page set.
	bindListings($('.page_set'));
	
	// Map hovers.
	mapOkresy.hover(function(){
		
		var that = $(this),
				name = that.attr('title');
		
		that.attr('fill', '#000');
		hoverOkres.text('Byty v okrese ' + name);
		hoverOkres.fadeIn();
	}, function(){
		
		var that = $(this);
		that.attr('fill', '#7DA7D8');
	});
	
	// Map click.
	mapOkresy.click(function(){
	
		var that = $(this);
		
		that.attr('fill', '#f00');
		
		var title = that.attr('title'),
				url = MVC.util.string.createUrl(title);
		
		window.location.href = 'na-prodej/' + url;
		
		return false;
	});
	
	// Infinite scrolling.
	win.scroll(function(){
		
		var top = win.scrollTop(),
				doc = $(document);
		
		if(top === (doc.height() - win.height())){
			//console.log('end');
		}
	});
}(jQuery));