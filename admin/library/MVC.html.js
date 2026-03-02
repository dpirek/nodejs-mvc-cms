/// <reference path="MVC.html.js" />

/** 
* @fileoverview html helpers.  
*  
* @author dpirek@gmail.com (David Pirek)
*/

(function ($, String, Util) {

    //creates namespace
    Util.createNs("MVC.html");

    MVC.html = {

        /* HTML helper (MVC style)
        ------------------------------
            
        //notes
        works similar like HTML helpers in the MVC design pattern
            
        //example
        var b = FNG.Html.Button({text : "click here", id : "my_id", class : "myclass"});
        console.log(b);
        */
				
				
				select: function (name, d, selected) {

					var sb = String.stringBuilder(); //string builder is fast!

          sb.append('<select name="' + name + '">');
          	$.each(d, function(i, d){
          		
          		if(d.value === selected){
          			sb.append('<option value="' + d.value + '" selected="selected">' + d.text + '</option>');
          		} else {
          			sb.append('<option value="' + d.value + '">' + d.text + '</option>');
          		}
          	});
          sb.append('</select>');
          
          return sb.toString();
        },
        link: function (d) { //create:  create window
          var m = "<a id=\"{id}\" href=\"{href}\" title=\"{title}\" class=\"{class}\">{text}</a>",
              v = String.template(d, m);
          return v;
        },
        element: function (d, e) { //create:  create window

          /*
          note: creates any alement
              
          d : object with element properties
          e : element name (tag name
          */

          var sb = String.stringBuilder(); //string builder is fast!

          sb.append("<" + e + " ");

          $.each(d, function (i, val) {
              //leavs out 'text' which is for the text value :)
              if (i != "text") {
                  sb.append(i + "=\"{" + i + "}\" ");
              }
          });

          sb.append(">{text}</" + e + ">");

          return String.template(d, sb.toString());
        },
        messageBox: function () {

            /*
            note: example of a more complex HTML helper
            */

            var sb = String.stringBuilder(); //string builder is fast!

            sb.append("<div id='alert_call' class='clearfix margin_bottom'>");
            sb.append("<strong>{message}</strong>");
            sb.append("</div>");
            //<a href='#close' onclick='return(FNG.AjaxUtil.MessageClose())' class='close_message'></a>
            return String.template(d, sb.toString());
        },
        divPopup: function (o) {

            //static model
            var model = "<div id='pop_login_wrp' class='hide modal_popup_wrp'><div class='modal_popup_wrp_header'><a href='#close' id='close_popup_id' class='close_popup'></a><p id='div_popup_title'><strong>{title}</strong></p></div><div id='popup_content_div' class='modal_popup_wrp_body'>{content}</div></div>";

            //object merge
            $.extend({ title: "Title", content: "<p>content</p>" }, o);

            //merges object to string
            return String.template(o, model);
        },
        paging: function (options) {

            var settings = {
                currentPage: 1,
                itemsPerPage: 10,
                numberofItems: 100,
                pageNumberPrefix: "",
                pageNumberSuffix: "",
                separator: "of",
                perPageText: "Show rows:",
                showPerPage: false
            };

            $.extend(settings, options);

            var o = settings;

            //gets number of pages
            var numberOfPages = (o.numberofItems / o.itemsPerPage).toFixed();

            //add one if .toFixed() rounds down
            if (o.numberofItems > (numberOfPages * o.itemsPerPage)) {
                numberOfPages++;
            }

            var sb = String.stringBuilder();

            //showes paging if needed
            if (numberOfPages >= 1) {

                sb.append("<span class=\"top_paging_wrp right clearfix\"> ");

                sb.append("<span class=\"right top_paging\"> ");

                if (!(o.currentPage == 1)) {
                    sb.append(" <a href='" + o.pageNumberPrefix + (o.currentPage - 1) + o.pageNumberSuffix + "' class=\"previous\"><span></span></a>");
                }
                else {
                    sb.append("<span class=\"previous alpha\"><span></span></span> ");
                }

                if (!(o.currentPage == numberOfPages)) {

                    sb.append(" <a href='" + o.pageNumberPrefix + (o.currentPage + 1) + o.pageNumberSuffix + "' class=\"next\"><span></span></a>");
                }
                else {
                    sb.append("<span class=\"next alpha\"><span></span></span>");
                }

                sb.append("</span>");

                //status text
                sb.append("<span class=\"right\">");
                sb.append("<span class=\"top_paging_status_text\"><span>" + o.currentPage + "</span> ");
                sb.append(o.separator);
                sb.append(" <span id=\"span2\">" + numberOfPages + "</span> </span>");
                sb.append("</span>");

                var currentOption = function (a, current) {

                    var sb = String.stringBuilder();

                    $.each(a, function (i, d) {

                        if (d == current) {
                            sb.append("<option value=\"" + d + "\" selected=\"selected\">" + d + "</option>");
                        }
                        else {
                            sb.append("<option value=\"" + d + "\">" + d + "</option>");
                        }

                    });

                    return sb.toString();

                }

                if (o.showPerPage) {

                    //show rows
                    sb.append("<span class=\"right top_paging_per_page_wrp\">");
                    sb.append("<span class=\"top_paging_status_text\">" + o.perPageText + "</span> ");
                    sb.append("<select class=\"paging_per_page_select\">");

                    sb.append(currentOption([5, 10, 35, 50, 100], o.itemsPerPage));

                    sb.append("</select>");
                    sb.append("</span>");
                }

                sb.append("</span>"); //end tag

            }

            return sb.toString();

        }
    };


})(jQuery, MVC.util.string, MVC.util);