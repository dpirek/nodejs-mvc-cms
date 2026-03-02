/// <reference path="MVC.util.js" />

/** 
* @fileoverview core utility class.  
*  
* @author dpirek@gmail.com (David Pirek)
*/

(function($) {

  //creates namespace
  if (typeof MVC == "undefined" || !MVC) {
    window.MVC = {};
  };

  MVC.util = {
    truncate: function (string, length) {
      if (typeof string === "undefined" || string == null || string === '') {
        return "";
      }
      if (string.length < length) {
        return string;
      }
      return '<abbr title="' + string + '">' + string.substring(0, length) + ' &hellip;</abbr>';
    },
    createNs: function() {
      var o, d;
      $.each(arguments, function(v) {
        d = arguments[1].split(".");
        o = window[d[0]] = window[d[0]] || {};
        $.each(d.slice(1), function(v2) {
          o = o[arguments[1]] = o[arguments[1]] || {};
        });
      });
      return o;
    }
  };

}(jQuery));