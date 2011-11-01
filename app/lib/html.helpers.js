var util = require('./util.string')

// Paging
exports.paging = function (settings) {

	//gets number of pages
	var numberOfPages = (settings.numberofItems / settings.itemsPerPage).toFixed();
	
	//add one if .toFixed() rounds down
	if (settings.numberofItems > (numberOfPages * settings.itemsPerPage)) {
		numberOfPages ++;
	}
	
	var sb = util.string.stringBuilder();
	
	//showes paging if needed
	if (numberOfPages >= 1) {
		
	  if (!(settings.currentPage == 1)) {
	      sb.append(" <a href='" + 
	      	settings.pageNumberPrefix + (settings.currentPage - 1) + settings.pageNumberSuffix + 
	      	"' class=\"previous\"><span>" + settings.previousText + "</span></a>");
	  }
		  if (!(settings.currentPage == numberOfPages)) {
	
	      sb.append(" <a href='" + settings.pageNumberPrefix + (settings.currentPage + 1) + settings.pageNumberSuffix + 
	      	"' class=\"next\"><span>" + settings.nextText + "</span></a>");
	  }

	}
	return sb.toString();
};