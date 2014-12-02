// ==ClosureCompiler==
// @output_file_name dp.tracking.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*!
Collection of external logging/tracking scripts

Google Analytics = Honda
Touch Clarity = Sophus
Eyeblaster = Starcom

*/

//polyfil for the Object.create function
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

(function() {

  var trackOptions = {
    loggingHREF:  "",
    loggingURL:   "",

    google:     false,
    touchclarity: false,
    touchclarityHM: false,
    eyeblaster:   false
  };

  // Google tracking code for www.honda.co.uk
  var HUKGoogleCode = "UA-7971192-2";
  var sophusLoaded = false;
  var starcomLoaded = false;
  var googleLoaded = false;

  // Touch Clarity heat mapping lookup array, only log heat maps for these pages.
  var tcHMlookup = [];
  tcHMlookup['/'] = 'Home';
  tcHMlookup['/cars/'] =  'Home-Cars';
  tcHMlookup['/garden/']  = 'Home-Garden';
  tcHMlookup['/marine/']  = 'Home-Marine';
  tcHMlookup['/atv/'] = 'Home-ATV';
  tcHMlookup['/energy/']  = 'Home-Energy';

  // -- Namespace

  dp.tracking = {

    init: init,
    bindDownloadPDF: bindDownloadPDF,
    doLogging: doLogging
  };

  // Cookie function to retrive user optin option
  function getOptinCookie(name) {
    var start = document.cookie.indexOf(name + "="),
      len = start + name.length + 1,
      end;
    if ((!start) && (name !== document.cookie.substring(0, name.length))) {
      return null;
    }
    if (start === -1) {
      return null;
    }
    end = document.cookie.indexOf(';', len);
    if (end === -1) {
      end = document.cookie.length;
    }
    return unescape(document.cookie.substring(len, end));
  }
  var _optin_cookie = getOptinCookie('HUK_OPTIN');

  // -- Public functions

  function init() {


    // If on a showroom (dealer) site/domain there will be a 'showroom' object
    var onShowroom = (typeof showroom !== 'undefined');

    $('a[href*=".pdf"]:not(.downloadpdf)').addClass('downloadpdf');

    bindDownloadPDF();

    // Calculate the global logging variables
    updateLoggingVariables();

    if(getOptinCookie('showLogging')){
      $("body").append("<style> #trackingDebug { position:absolute; top: 0px; left: 0px; background-color:white; overflow: visible; padding:5px; z-index:10000; text-align:left; } .debugLinkTitle { padding-top: 10px; font-weight: bold; } .debugLinkSuccess { color:green; } .debugLinkFailure { color:red; }</style>");
      $("body").append("<div id='trackingDebug'></div>");
    }
    if(getOptinCookie('showLogging')){ $("#trackingDebug").append("<div class='debugLink debugLinkTitle debugLinkLoad'>URL: " + trackOptions.loggingURL + "</div>"); }



    /* Google Analytics, for Honda */
    $.ajax({
      url: "/_assets/behaviour/google/google.js",
      type: "GET",
      dataType: "script",
      cache: true,
      success: function(){
        // Google ready
        trackOptions.google = true;

        // Log Google now
        ga_log();
        googleLoaded = true;
        if(getOptinCookie('showLogging')) { $("#trackingDebug .debugLinkLoad").last().after("<div class='debugLink'>[LOADED] Google tracked</div>"); }
      }
    });

    /* Sophus tracking */
    var tcUrl = "logging.min.js";
    // Check if Dealer Website and use specific js file if so
    if (onShowroom) {
      tcUrl = "dwLogging.min.js";
    }
    // Check if site is motorcycles and use MC specific js file if so
    else if(window.location.href.indexOf('/motorcycles/') > -1){
      tcUrl = "mcLogging.min.js";
    }
    $.ajax({
      url: "/_assets/behaviour/touchclarity/" + tcUrl,
      type: "GET",
      dataType: "script",
      cache: true,
      success: function(){
        // tc_log will trigger automatically at this point as a call is made from logging-code.js. We cannot prevent this.

        trackOptions.touchclarity = true;

            // Test whether URL exists in the lookup
            var clickHeatGroupValue = tcHMlookup[trackOptions.loggingURL];

            // Only get the heatmap code if this page is in the lookup
            if( clickHeatGroupValue ) {

              $.ajax({
                url: "/_assets/behaviour/touchclarity/hms3.js",
                type: "GET",
                dataType: "script",
                cache: true,
                async: false
              });

                  // TRACKING: Touch Clarity heat map ready
                  trackOptions.touchclarityHM = true;

                  // Log heatmapping now
                  tc_heatmapping_log(trackOptions.loggingURL);
            }

          if (window.location.href.indexOf('/motorcycles/') < 0 && !onShowroom) {
            if (_optin_cookie === null || Number(_optin_cookie) >=3 ){
              $.ajax({
                url: "http://honda-uk.active-e.sophus3.com/server.php?request=track&output=jcrpt&nse="+Math.random(),
                type: "GET",
                dataType: "script",
                cache: true
              });
            }
          }
          sophusLoaded = true;
          if(getOptinCookie('showLogging')) { $("#trackingDebug .debugLinkLoad").last().after("<div class='debugLink'>[LOADED] Sophus tracked</div>"); }
      }
    });

    // Do not do the following when on a showroom (dealer) site
    if (!onShowroom) {
      /* Eyeblaster, for Starcom */

      if (_optin_cookie === null || Number(_optin_cookie) >=3 ){
        $.ajax({
          url: "/_assets/behaviour/eyeblaster/logging.js",
          type: "GET",
          dataType: "script",
          cache: true,
          success: function(ebScript){
            // EyeBlaster ready
            trackOptions.eyeblaster = true;

            // Safety catch for running XHR code if it fails and causes an error because it's being called before loaded into the browsers.
            // Possibly place this into an external function for others to use if more problems like this are found.
            // See http://stackoverflow.com/questions/1130921/is-the-callback-on-jquerys-getscript-unreliable-or-am-i-doing-something-wrong
            try {
              // Log EyeBlaster

              eb_log(trackOptions.loggingHREF);
              starcomLoaded = true;
              if(getOptinCookie('showLogging')) {
                if(eb_log_check(trackOptions.loggingHREF)===undefined) {
                  $("#trackingDebug .debugLinkLoad").last().after("<div class='debugLink debugLinkFailure'>[LOADED] Starcom tracked - "+eb_log_print(trackOptions.loggingHREF)+"</div>");
                } else {
                  $("#trackingDebug .debugLinkLoad").last().after("<div class='debugLink debugLinkSuccess'>[LOADED] Starcom tracked - "+eb_log_check(trackOptions.loggingHREF)+"</div>");
                }
              }
            }
            catch (err) {
              // Evaluate the Ajax loaded JavaScript
              eval(ebScript);
              // Log Eyeblaster from evaluated code
              eb_log(trackOptions.loggingHREF);
            }

          }
        });
        // eyeblaster end
      }
    } else{
      // This is not my fault!
      // #promise #deferred #whynot
      trackOptions.eyeblaster = true;
    }
    // End non-showroom code
  }

  function bindDownloadPDF() {
    $("#productNav .downloadpdf, #downloadBrochurePageLink .downloadpdf").unbind("click");

    $(".downloadpdf:not([class~='bubble']), .downloadBrochures a, a.pdf-logging").live('click', function() {
      window.open($(this).attr("href"));
      doLogging($(this).attr("href"));

      return false;
    });
  }
  this.bindDownloadPDF = bindDownloadPDF;

  //Log ajax requests
  //This is called automatically by all pages that include this file and can be called manually for Ajax loads (panels).
  //Can only be used once each of the logging scripts (below) have been loaded.
  // doreturn: Added this to protect the values contained in trackingOptions
  //        When a page loads and there is a doLogging call at the same time then these values run the risk to be over written.
  function doLogging() {


    var defaults = {
      google: true,
      eyeblaster: true,
      touchclarity: true,
      touchclarityHM: true
    }, updatedValues,doreturn;
    newURL = arguments[0];

    var secondArgument = "{";

    if (typeof arguments[1] === 'object') {
      for(prop in arguments[1]){
        secondArgument = secondArgument + prop + ":" + arguments[1][prop] + ",";
      }
      secondArgument = secondArgument + "}";
      $.extend(defaults, arguments[1] || {});
    } else if(typeof arguments[1] === 'boolean') {
      doreturn = arguments[1] || false;
      secondArgument = arguments[1];
    }

    if (typeof arguments[2] === 'boolean') {
      doreturn = arguments[2] || false;
    }


    if(!trackOptions.google || !trackOptions.touchclarity || !trackOptions.eyeblaster) {
      if(arguments.length == 1){
        setTimeout("doLogging('"+arguments[0]+"')",2000);
      }else{
        setTimeout("doLogging('"+arguments[0]+"',"+secondArgument+",'"+arguments[2]+"')",2000);
      }
      return;
    }

    updatedValues = updateLoggingVariables(newURL, doreturn);

    // doLogging will fire all the tracking options by default provided that the criteria are met:
    // 1. The trackOptions for it is true.
    // 2. The tracking function is available.
    // 3. The default setting has not be set to false.
    //
    // Useage Examples:
    // doLogging('/cars/newcivic/');
    // doLogging('/cars/newcivic/', true);
    // doLogging('/cars/newcivic/',{google:false,eyeblaster:false});
    //

    // Touch clarity page
    if(doreturn) {

      if(getOptinCookie('showLogging')) { $("#trackingDebug").append("<div class='debugLink debugLinkTitle debugLinkDoLogging'>(doLogging) URL: " + updatedValues.loggingHREF + "</div>"); }

      if (trackOptions.touchclarity && typeof(tc_log) === "function" && defaults.touchclarity) {
        tc_log(updatedValues.loggingURL);
        if(getOptinCookie('showLogging')) { $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink'>Sophus tracked</div>"); }
      }

      // Touch Clarity heat map
      if (trackOptions.touchclarityHM && typeof(tc_heatmapping_log) === "function" && defaults.touchclarityHM)  tc_heatmapping_log(updatedValues.loggingURL);

      // Eyeblaster page
      if (trackOptions.eyeblaster && typeof(eb_log) === "function" && defaults.eyeblaster) {
        eb_log(updatedValues.loggingHREF);
        if(getOptinCookie('showLogging')) {
          if(eb_log_check(updatedValues.loggingHREF)===undefined) {
            $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink debugLinkFailure'>Starcom tracked - "+eb_log_print(updatedValues.loggingHREF)+"</div>");
          } else {
            $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink debugLinkSuccess'>Starcom tracked - "+eb_log_check(updatedValues.loggingHREF)+"</div>");
          }
        }
      }

      // Google page
      if (trackOptions.google && typeof(ga_log) === "function" && defaults.google) {
        ga_log(updatedValues.loggingHREF);  if(getOptinCookie('showLogging')) { $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink'>Google tracked</div>"); }
      }
    } else {
      if(getOptinCookie('showLogging')) { $("#trackingDebug").append("<div class='debugLink debugLinkTitle debugLinkDoLogging'>(doLogging) URL: " + trackOptions.loggingHREF + "</div>"); }

      if (trackOptions.touchclarity && typeof(tc_log) === "function" && defaults.touchclarity) {
        tc_log(trackOptions.loggingURL);
        if(getOptinCookie('showLogging')) { $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink'>Sophus tracked</div>"); }
      }

      // Touch Clarity heat map
      if (trackOptions.touchclarityHM && typeof(tc_heatmapping_log) === "function" && defaults.touchclarityHM)  tc_heatmapping_log(trackOptions.loggingURL);

      // Eyeblaster page
      if (trackOptions.eyeblaster && typeof(eb_log) === "function" && defaults.eyeblaster) {
        eb_log(trackOptions.loggingHREF);
        if(getOptinCookie('showLogging')) {
          if(eb_log_check(trackOptions.loggingHREF)===undefined) {
            $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink debugLinkFailure'>Starcom tracked - "+eb_log_print(trackOptions.loggingHREF)+"</div>");
          } else {
            $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink debugLinkSuccess'>Starcom tracked - "+eb_log_check(trackOptions.loggingHREF)+"</div>");
          }
        }
      }

      // Google page
      if (trackOptions.google && typeof(ga_log) === "function" && defaults.google) {  ga_log(trackOptions.loggingHREF);  if(getOptinCookie('showLogging')) { $("#trackingDebug .debugLinkDoLogging").last().after("<div class='debugLink'>Google tracked</div>"); } }
    }

  }
  this.doLogging = doLogging;


  //-- Private functions
  // doreturn: Added this to protect the values contained in trackingOptions
  //           When a page loads and there is a doLogging call at the same time then these values run the risk to be over written
  function updateLoggingVariables(newURL, doreturn) {
    var _trackOptions = Object.create(trackOptions);

    doreturn = doreturn || false;


    if (!newURL) newURL = document.location;
    newURL = newURL.toString().toLowerCase();

    if(!doreturn) {
      if (newURL.indexOf("http://")!=-1)  // If contains HTTP://
        trackOptions.loggingURL = "/" +newURL.split("/").slice(3).join("/"); // Remove HTTP://
      else
        trackOptions.loggingURL = newURL;

      trackOptions.loggingHREF = newURL;
    } else {
      if (newURL.indexOf("http://")!=-1)  // If contains HTTP://
        _trackOptions.loggingURL = "/" +newURL.split("/").slice(3).join("/"); // Remove HTTP://
      else
        _trackOptions.loggingURL = newURL;

      _trackOptions.loggingHREF = newURL;

      return _trackOptions;
    }

    //console.info("trackOptions.loggingHREF = "+ trackOptions.loggingHREF);
    //console.info("trackOptions.loggingURL = "+ trackOptions.loggingURL);


  }

  function ga_log(url) {
    // Use the showroom (dealer) Google tracking code if it exists
    // otherwise assume we're on HUK and use the HUKGoogleCode.
    var googleCode = (typeof showroom !== 'undefined') ? showroom.googleCode : HUKGoogleCode;

    // Only attempt to make the tracking server call if the code is a string
    if (googleCode) {
      try {
        var pageTracker = _gat._getTracker(googleCode);
        pageTracker._trackPageview(url);

				if(document.URL.indexOf('/cars/cr-v/') != -1){
					var pageTrackerHME = _gat._getTracker("UA-29384214-1");
					pageTrackerHME._trackPageview(url);
				}
			}
			catch (err) {}
		}
	}

  /* Touch Clarity, for Sophus */

  /* Touch Clarity logging request - http://www.touchclarity.com - Copyright (c) Touch Clarity Ltd 2001-2002. All rights reserved. Patent Pending.
  * For Honda - Honda UK. Change the value of tc_logging_active to switch off logging on the site. */
  if (typeof tc_logging_active == 'undefined') tc_logging_active = true;

  tc_site_id = 146;
  tc_server_url = "honda.touchclarity.com";
  tc_log_path = '/_assets/behaviour/touchclarity';

  function tc_heatmapping_log(URL){

    var clickHeatGroupValue = tcHMlookup[URL];

    if( clickHeatGroupValue && trackOptions.touchclarityHM) {
      clickHeatSite = "Honda-UK";
      clickHeatGroup = clickHeatGroupValue;
      clickHeatServer = 'http://www.sophus3.co.uk/honda/hm/click.php';

      initClickHeat();
    }
  }

})();
// The Shampoo way to do doLogging:
// Step 1:
// Add a class to the link you want to track:
// like this -> class="doLogging"
// Step 2:
// Add a data-log="" attribute to the link that contains the URL you want to fire:
// like this -> data-log="/cars/newcivic/homebanner/offer"
// Step 3:
// In the jQuery doc ready add class this on your selector:
// like this -> $('.doLogging').doLogging();
(function ($) {
  $.doLogging = function (el, options) {
    var base = this;
    base.$el = $(el);
    base.el = el;

    $.doLogging.defaultOptions = {
      loggingattr: "data-log"
    };

    base.init = function () {
      base.options = $.extend({}, $.doLogging.defaultOptions, options);
      base.addLoggingEvents();
    };

    base.addLoggingEvents = function () {
      if (base.$el.attr('logged') !== "true") {
        base.$el.click(base.triggerLog);
        base.$el.attr('logged', 'true');
      }
    };

    base.triggerLog = function (e) {
      var loggingURL = base.$el.attr(base.options.loggingattr);
      if (typeof doLogging === "function" && loggingURL !== "") {
        doLogging(loggingURL);
      }
    };
    base.init();
  };

  $.fn.doLogging = function (options) {
    return this.each(function () {
      (new $.doLogging(this, options));
    });
  };
  $('[data-log]').doLogging();
})(jQuery);