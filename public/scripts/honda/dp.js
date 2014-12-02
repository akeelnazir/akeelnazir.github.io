//NOTE: any changes to this file should also be made to actions.js and actions-new.js

// ==ClosureCompiler==
// @output_file_name dp.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

// Defines Digital Platform root name space.
// Please place any Digital Platform utility functions in this closure.
//
(function($) {

  var o = $({});

  $.subscribe = function() {
    o.on.apply(o, arguments);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));

(function () {

    var initializing = false, fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b/ : /.*/;

	//Namespace
	this.dp = function() {};

	dp.init = function() {

		// Remove submit button
		$("#search input[type='submit']").remove();

		// Add search image if doesn't exist
		if (!$("#searchBtn").length) $("#search p").append('<a href="#" id="searchBtn" title="Open search field" accesskey="4">Search</a>');
		$('html').addClass('js');

    // Bind behaviour actions to the search query field
		var t;
		$("#q")
			.keyup(function(e){if (e.keyCode == 27) dp.closeSearchBox(); })
			.blur(function(){
			   t=setTimeout(dp.closeSearchBox, 500);
		});

		// Show/hide search box
		$("#searchBtn").click(function(){
			if ($("#q").is(":hidden")) {
				// Add bindings to the search box
				$("#search p").addClass("open");
        $("#tools").addClass("coverbox");
				$("#q").show().focus().focus(function() {
          clearTimeout(t);
        });
				$(this).attr("title", "Search Honda UK");
			} else {
				$("#search").submit();
			}
			return false;
		});

		// Pop-up and external links.
		$("a.external, a.downloadimage").click(function(){
			var url = this.href;
			window.open(url);
			return false;
		});

		$("a.help").click(function(){
			var url = this.href;
			window.open(url, 'hondaPopup', 'width=400,height=500,scrollbars,resizable');
			return false;
		});

		// Hide Header & Footer for Digital Platform in a Popup
		if(window.name == "dpPopup") {
			$("#header").hide();
			$("#footer").hide();
			$("#diaryTopContent, #formTopContent, #bookedTopContent").css("margin-top","20px");
		}

		// Attach the PDF download logging
		//bindDownloadPDF();

	    //HONDA TV redirect based on broswer
	    var jhref = "http://tv.honda.co.uk?keepThis=true&TB_iframe=true&height=380&width=680";
	    $('#hondaTvURL').attr('href', jhref);

	    $("#siteJump").submit(function() {
	        var theForm = $(this).get(0);
	        if (theForm.menu.selectedIndex > 0) window.open(theForm.menu.options[theForm.menu.selectedIndex].value);
	        return false;
	    });
	}

	//Returns an object containing car details by parsing the querystring from the global.asa
	dp.getGlobalDetails = function(key) {

		var setting = constants[key];
        var hrefArray = setting.split('?');

        //If the split produces only 1 array element then return blank
        querystring = (hrefArray.length > 1) ? hrefArray[1] : hrefArray[0];

        var queryString = querystring.split('#'); // We don't want any hash.

        // split the 2nd part of the array at the & character
        var parameterPairs = queryString[0].split('&');
        var parameterValues = {};

        // iterate over the pairings (param1=a,param2=b)
        for (var i = 0, len = parameterPairs.length; i < len; i++) {

			//Get the param and value into array
            var bits = parameterPairs[i].split('=');

            parameterValues[bits[0]] = bits[1];
        }

        return parameterValues;
	}

    // Global utility functions translated to the namespaced notation from actions-new.js
    // Remove from global (window) namespace once migrated

	//Execute function wrapped in a try catch block
	dp.safe = function(callee) {
		try {
			callee();
		}
		catch(e) {
		};
	};

	//Checks if a function can be called and calls it
	dp.callback = function(fn, args) {

		if (fn == null) return;
		if (!$.isFunction(fn)) return;
		fn.call(this, args);
	}

    // Call a server side transform and return the results
    dp.transform = function (type, template, service, params, callback) {

        var url = "/_assets/behaviour/transform.asp?type=" + type + "&template=" + escape(template) + "&service=" + escape(service) + "&params=" + escape(params);
        $.get(url, callback);
    };
    this.transform = dp.transform;

    dp.transformResource = function (xml, xsl, parameters, contentType, callback) {

		var url =  '/_assets/behaviour/transform.asp?xmlResource=' + escape(xml) + '&xslResource=' + escape(xsl) + '&parameters=' + escape(parameters) + '&contentType=' + contentType;
		$.get(url, callback);
    };

    dp.closeSearchBox = function () {
      $("#q").hide();
    	$("#search p").removeClass("open");
      $("#tools").removeClass("coverbox");
		  $("#searchBtn").attr("title", "Open search field");
    };
    this.closeSearchBox = dp.closeSearchBox;


    dp.URLDecode = function (psEncodeString) {
        var lsRegExp = /\+/g; return unescape(String(psEncodeString).replace(lsRegExp, " "));
    };
    this.URLDecode = dp.URLDecode;


    //Gets the value for a key stored in the global.asa file for the website
    //This function for compat only - use constants.VALUE instead
    dp.getSetting = function (key) {
        var value = "";
        $.ajax({ "url": "/_assets/behaviour/getglobalvar.asp?var=" + key, async: false, success: function (response) {
            value = response.toString();
        }
        });
        return value;
    };
    this.getSetting = dp.getSetting;

    //Tests to see if string is in correct UK style postcode: AL1 1AB, BM1 5YZ etc.
    dp.isValidPostcode = function (p) {
        var postcodeRegEx = /[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}/i;

        /* Regex pre 22/01/09 /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i */

        return postcodeRegEx.test(p);
    };
    this.isValidPostcode = dp.isValidPostcode;

    //Gets the value of a parameter (strParam) from a href (strHref)
    dp.getQSValue = function (strParam, strHref) {
        strParam = strParam.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + strParam + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(strHref);
        if (results == null)
            return "";
        else
            return results[1];
    };
    this.getQSValue = dp.getQSValue;

    //Get a flash object by Id
    dp.getFlash = function (id) {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            if (window[id]) return window[id];
            else return false;
        }
        else {
            if (document[id]) return document[id];
            else return false;
        }
    };
    this.FL = dp.getFlash;

    dp.getHttpGetParameters = function (param, url) {
        if (url == null || url == '') url = document.location.href;
        var hrefArray = url.split('?');

        // if the split produces only 1 array element then return blank
        if (hrefArray.length == 1) return '';

        var queryString = hrefArray[1].split('#'); // We don't want any hash.

        // split the 2nd part of the array at the & character
        var parameterPairs = queryString[0].split('&');
        var parameterValues = [];

        // iterate over the pairings (param1=a,param2=b)
        for (var i = 0; i < parameterPairs.length; i++) {
            // get the param and value into array
            var bits = parameterPairs[i].split('=');

            // if the param equals our chosen param, then add it to the list
            if (bits[0].toLowerCase() == param.toLowerCase()) parameterValues.push(bits[1]);
        }

        return parameterValues;
    };
    this.getHttpGetParameters = dp.getHttpGetParameters;

    dp.removeClassFromSelector = function (selector, classtoremove) {

        // Get all selectors
        var Classes = $(selector).attr("class").split(" ");

        // If classtoremove matches, then remove it.
        for (i = 0; i <= Classes.length - 1; i++) {
            if (Classes[i].substring(0, classtoremove.length) == classtoremove) {
                $(selector).removeClass(Classes[i]); // Remove class
            }
        }
    };
    this.removeClassFromSelector = dp.removeClassFromSelector;


	//Called by top panel flash - do not remove
	dp.doFunctions = function () {

       var funcList      = new Array();
       var func          = new Array();
       var silent        = arguments[0];
       var argsStr       = silent;

       for (var i=1;i<arguments.length;i++) {
              var arg = arguments[i];
              argsStr += ",'" + arg + "'";
              if (arg == "exec") {
                   if (i!=1) funcList.push(func);
                   func = new Array();
              }
              else {
                   func.push(arg);
              }
       }

       funcList.push(func);
       if (!silent) alert("doFunctions(" + argsStr + ")");

       for (var i=0;i<funcList.length;i++) {
             var funcStr = funcList[i][0] + "(";

             if (funcList[i].length > 0) {
                   for (var j=1;j<funcList[i].length;j++) {
                         funcStr += "'" + funcList[i][j] + "',";
                   }
                   if (funcList[i].length>1) funcStr =
 		 		 		 		 		 funcStr.substr(0,funcStr.length-1);
                   funcStr += ")";
                   if (!silent) alert("trying:\n" + funcStr);
                   try {
                         eval(funcStr);
                   }
                   catch(exception) {
                         if (!silent) alert("failed:\n" + exception);
                   }
             }
       }
	}
	this.doFunctions = dp.doFunctions;

})();

(function(){
  var s = document.createElement('link');
  s.setAttribute('href','/_assets/presentation/cookie_style.css');
  s.setAttribute('rel','stylesheet');
  s.setAttribute('type','text/css');
  document.getElementsByTagName('head')[0].appendChild(s);
})();

(function() {
  var tk = document.createElement('script');
  tk.src = '/_assets/behaviour/cookie.debug.min.js';
  tk.type = 'text/javascript';
  tk.async = 'true';
  tk.onload = tk.onreadystatechange = function() {
    var rs = this.readyState;
    if (rs && rs != 'complete' && rs != 'loaded') return;
    try {
      HUK.CookieManager.init({
        cookie_prefix: 'HUK_',
        optin_cookie_name: 'OPTIN',
        idle:0
      });
    } catch (e) {}
  };
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(tk, s);
})();

/**
 * Function to add mobile link on the page footer. The code detects if you are browsing
 * on a mobile device and adds a link. Note the link will be only visible on mobile devices
 */

$(document).ready(function() {
  if (document.cookie.indexOf("hukmcars") != -1) {
    var h = $('#footerCopy div.honda'),
      h_list = h.children('ul'),
      isMobileLink = false;

    if(h.length > 0) {
      $.each(h_list.find('li'), function(i, el){
        if ($(el).children('a').html() === "Mobile site" || $(el).hasClass('mobileSite')) {
          isMobileLink = true;
        }
      });

      if (!isMobileLink) {
		var mobileRedirectUrl = document.location.href;
		mobileRedirectUrl = mobileRedirectUrl.toLowerCase().replace('http://', '');
		var secondSlashPos = mobileRedirectUrl.indexOf('/', mobileRedirectUrl.indexOf('/') + 1);
		if(secondSlashPos > 0){
			mobileRedirectUrl = 'http://' + mobileRedirectUrl.substring(0, secondSlashPos + 1);
		}else{
			mobileRedirectUrl = 'http://' + mobileRedirectUrl + '/';
		}
        h_list.append("<li class='mobileSite'><a href='"+mobileRedirectUrl+"?mobile_site=1'>Mobile site</a></li>");
        $('.mobileSite a').bind('click', function(){
          document.cookie =  'hukmcars=null; expires=Fri, 27 Jul 1970 02:47:11 UTC; path=/';
        });
      }
    }
  }
});