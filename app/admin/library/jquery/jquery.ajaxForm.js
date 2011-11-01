/*  AJAX FORM Plugin
--------------------------------------

Init method:
$('#myForm').ajaxForm();

*/

(function ($) {

  // plugin definition
  $.fn.ajaxForm = function (op) {

    // Defaults.
    var defaults = {
      start: function () { },
      sucess: function () { },
      error: function () { },
      buttonSelector: '.submit'
    };

    $.extend(defaults, op);

    // iterate and reformat each matched element
    return this.each(function () {

      //
      var context = $(this),
          submitButton = $(defaults.buttonSelector, context),
          url = context.attr('action'),
          method = context.attr('method');

      //button click
      submitButton.click(function () {

        // On start.
        defaults.start(submitButton);

        // Ajax
        $.ajax({
          type: method,
          url: url,
          data: context.serializeArray(),
          dataType: "json",
          success: defaults.sucess,
          error: defaults.error
        });

        return false;
      });

    });
  };

})(jQuery);



