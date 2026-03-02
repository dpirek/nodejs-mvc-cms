/*!
* jQuery JavaScript MVC routing plugin
* http://www.davidpirek.com/javascript-mvc-jquery-plugin-framework
*
* Copyright 2010, David Pirek
* Licensed: not sure yet send me an email: dpirek@gmail.com
*
*/

(function ($) {

  // Get hash function.
  var getHashValue = function () {

    var hasValue = window.location.hash.substring(1);

    // Sets default.
    if (typeof hasValue == "undefined") {
      return false;
    }
    var hashLen = hasValue.indexOf("?");
    if (hashLen > 0) {
      hasValue = hasValue.substring(0, hashLen);
    }
    return hasValue;
  };

  var onHashChange = function (event, stopTime) {

    // Last hash.
    var lastHash = getHashValue();

    var i = setInterval(function () {
      var hash = getHashValue();
      if (hash !== lastHash) {
        event(hash);
        lastHash = hash;
      }
    }, 100);

    // Allows for "expiring" has listerner (needed for testing purposes).
    if (stopTime > 0) {
      setTimeout(function () {
        clearInterval(i);
      }, stopTime);
    }
  };

  // Gets random parameter.
  var getRandomParam = function () {
    return "?_r=" + Math.random() * 5;
  };

  var removeFristDash = function (path) {

    // Remove '/' as first char.
    if (path.charAt(0) === '/') {
      path = path.substr(1);
    }

    return path;

  };

  var parsePlaceHolders = function (path) {

    //path = removeFristDash(path);

    //    // Remove '/' as first char.
    //    if (path.charAt(0) === '/') {
    //      path = path.substr(1);
    //    }

    var ar = path.split('/'),
        re = [];

    // Array to Object.
    $.each(ar, function (i, d) {

      var x = d.match(/[{}]/g);

      if (x == null) {
        re[i] = false;
      } else {
        re[i] = true;
      }
    });
    return re;
  };

  // Create.
  var createRoutingTable = function (routes) {

    // routing.
    var routingTable = {};

    var mapRoute = function (name, path, params) {

      // Gets position of different placeholders.
      var getPositions = function (path) {

        var arr = [],
            o = {};

        // String to array.
        path.replace(/\{[^\}]*\}/g, function (key, index) {
          arr.push({ key: key, index: index });
        });

        // Array to Object.
        $.each(arr, function (i, d) {

          // Each character within [ ... ].
          o[d.key.replace(/[{}]/g, '')] = d.index;
        });
        return o;
      };

      // Add slash if {controller} is first in the string, 
      // so that array would have the "prefix" placeholder.
      if (path.substr(0, 12) === "{controller}") {
        path = "/" + path;
      }

      // Parse path into array.
      var items = path.split('/');

      // Create routing table object.
      routingTable[name] = {
        controller: "",
        path: path,
        pre: path.substr(0, getPositions(path).controller),
        items: items,
        placeHolders: parsePlaceHolders(path),
        params: params
      };
    };

    $.each(routes, function (i, d) {
      mapRoute(d.name, d.path, d.params);
    });

    return routingTable;
  };

  var rounte = function (table, hash) {

    var matchCount = 0;
    var params,
        actionObject = {};

    // Loop table.
    $.each(table, function (i, d) {

      var items = hash.split('/');

      // Add start '/' if not presnet
      if (hash.charAt(0) !== '/' && d.pre != items[0] + "/") {
        hash = '/' + hash;
        // Split again.
        items = hash.split('/');
      }

      var tableItems = d.items,
          o = {};

      params = d.params;

      if (matchCount < 1) {

        // Loop folders.
        $.each(d.placeHolders, function (i, d) {

          if (items[i] === tableItems[i]) {
            matchCount++;
          }

          if (d) {
            //build action object
            actionObject[tableItems[i].replace(/[{}]/g, '')] = items[i];
          }

        });
      }

      // If there is a match don't search any more.
      if (matchCount < 2) {

        // Merge with defaults, if there are some params missing.
        $.each(actionObject, function (i, d) {
          if (typeof d == "undefined" || d == "") {
            actionObject[i] = params[i];
          }
        });
        return;
      }
    });

    return actionObject;
  };

  var multiAjax = function (requests, success, error) {

    var sucessIndex = 1,
        numberOfRequests = requests.length - 1,
        data = {};

    $.each(requests, function (i, d) {

      $.ajax({
        type: d.type,
        url: d.url,
        dataType: d.dataType,
        error: function () {
          if (typeof error == 'function') {
            error('could not load: ' + d.url);
          }
        },
        success: function (d2) {
          data[d.id] = d2;
          if (sucessIndex > numberOfRequests) {
            success(data);
          }
          else {
            sucessIndex++;
          }
        }
      });

    });
  };

  // MVC plugin function.
  $.fn.MVC = function (op) {

    // Defaults.
    var defaults = {
      rootPath: "",
      viewsPath: "Views/",
      controllersPath: "Controllers/",
      start: function (o) { },
      success: function (o) { },
      error: function (o) { },
      stopListenToHash: 0,
      errorMessage: "<p>error...</p>"
    };

    // Build main options before element iteration.
    $.extend(defaults, op);

    // Iterate and reformat each matched element.
    return this.each(function () {

      // Target content wrapper.
      var contentDiv = $(this);

      var routingTable = createRoutingTable(defaults.routes);

      var loadPage = function (hash) {

        // On load method.
        defaults.start();

        var actionObject = rounte(routingTable, hash);

        // Run.
        var run = function (controller, action, params) {

          //Check if routs were found, if not return an error message.
          if (typeof controller == "undefined" || typeof controller == "action") {

            // Put action HTML to the DOM.
            contentDiv.html(defaults.errorMessage);

            // Run external callback
            defaults.success({
              actionObject: actionObject,
              viewTemplate: viewTemplate,
              content: defaults.errorMessage
            });

          } else {

            var exec = function (isSuccessful, viewTemplate, controllerObject) {

              if (isSuccessful) {

                // Check if action is defined inside of the controller.
                if (typeof controllerObject[action] === "undefined") {

                  // Put action HTML to the DOM.
                  contentDiv.html(defaults.errorMessage);

                  // Run external callback
                  defaults.success({
                    actionObject: actionObject,
                    viewTemplate: viewTemplate,
                    content: content
                  });

                  // Run error callback.
                  defaults.error(defaults.errorMessage);

                } else {

                  // Run action method.
                  controllerObject[action](actionObject, viewTemplate, function (content) {

                    // Put action HTML to the DOM.
                    contentDiv.html(content);

                    // Run external callback
                    defaults.success({
                      actionObject: actionObject,
                      viewTemplate: viewTemplate,
                      content: content
                    });
                  }, defaults.error);
                }
              } else {

                // Put action HTML to the DOM.
                contentDiv.html(defaults.errorMessage);

                // Run external callback
                defaults.success({
                  actionObject: actionObject,
                  viewTemplate: viewTemplate,
                  content: content
                });
              }
            };

            multiAjax([
              {
                id: "view",
                type: "Get",
                url: defaults.rootPath + defaults.viewsPath + controller + "/" + action + ".html" + getRandomParam(),
                dataType: "html"
              },
              {
                id: "controller",
                type: "Get",
                url: defaults.rootPath + defaults.controllersPath + controller + ".js" + getRandomParam(),
                dataType: "script"
              }],
            // Sucess.
              function (d) {
                exec(true, d.view, eval('(' + d.controller + ')'));
              },
            // Error.
              function (d) {
                exec(false);
                defaults.error("controller did not load");
              });
          }
        };

        //run
        run(actionObject.controller, actionObject.action, actionObject);
      };

      // Init 
      (function () {
        var currentHash = getHashValue();

        // Init hash listener.
        onHashChange(loadPage, defaults.stopListenToHash);

        // Make the first load.
        loadPage(currentHash);
      })();
    });
  };
})(jQuery);
