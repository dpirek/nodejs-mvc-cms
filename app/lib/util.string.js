// String Util.
exports.string = {
	guid: function() {
  	var S4 = function() {
    	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  	};
  	return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	},
	truncate: function (string, length) {
     
	  // Zero value calenup.
	  if (typeof string === "undefined" || string == null || string === '') {
	    return "";
	  }
	  
	  // Return the same if short enough
	  if (string.length < length) {
	    return string;
	  }
	  
	  // Return truncated.
	  return string.substring(0, length);
  },
	removeDoubleSpace: function(str){
		return str.replace(/\s{2,}/g, ' ');
	},
	trim: function(str){
		str = str.replace(/^\s+/,'');
		return str.replace(/\s+$/,'');
	},
	createUrl: function(str) {
		
		// Cleanup string.
		str = str.replace(/^\s+|\s+$/g, "");
		
		var sF = "ěščřžýáíéĚŠČŘŽÝÁÍÉŮůÚúň",
				sT = "escrzyaieescrzyaieuuuun",
				from = sF.split(""),
				to = sT.split(""),
				length = from.length;
				
		for (var i = 0, l = length; i < l; i++) {
			str = str.replace(new RegExp(from[i], "g"), to[i]);
		}
		
		str = str.replace(/[^a-zA-Z0-9 -]/g, "");
		
		str = str.replace(/^\s+|\s+$/g, "");
		
		str = this.removeDoubleSpace(str);
		
		return str.replace(/\s+/g, "-").toLowerCase();
	},
	stringBuilder: function () {

    var s = [];
    return {
      // appends
      append: function (v) {
        if (v) {
          s.push(v);
        }
      },
      // clears
      clear: function () {
        s.length = 1;
      },
      // converts to string
      toString: function () {
        return s.join("");
      }
    }
  }
};


