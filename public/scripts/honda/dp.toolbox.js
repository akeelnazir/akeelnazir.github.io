// ==ClosureCompiler==
// @output_file_name dp.toolbox.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

var hondaToolboxReady = null;

//-- dp.toolbox --
(function () {

    var currentPage = 1;
    var maxPage = 1;
    var model, group, iconBlock, reviewWidth, currentHolder, numArticles;

    dp.toolbox = function () { };

    //-- Public functions --

    dp.toolbox.create = function () {

        if (!$("#toolbox").length) { // Only add this once
            $("body").append('<div id="toolboxWrap"><div id="toolbox"><div id="toolboxCanvas" class="fixPng"><div id="toolboxContent"></div></div></div></div>');
            $("#toolbox").prepend('<div id="toolboxClose"><a href="#" class="fixPng">Close</a></div>');

            $("#toolboxWrap").css({ top: $("#header").height() });
            $("#toolboxClose").click(dp.toolbox.closeBox);
        }
    };

    dp.toolbox.start = function (el, elType) {

        if (FL("inspireFlash")) FL("inspireFlash").stopProcessing(); // Freeze any Flash animation

        var url = getURL(el, elType);

        // Open a new toolbox
        if (!$("#toolboxContent").html()) {

            toggleIndicator(el, "trigger");
            dp.toolbox.getContent(url, function (content) {
                dp.toolbox.showBox(content, el);
            });

        }
        // Resize an open toolbox
        else {

            toggleIndicator(el, "closeButton");
            if (elType == "form") {
                try {
                    $(el).ajaxSubmit({ success: showFormResponse, beforeSubmit: beforeSubmit });
                } catch (err) {
                    dp.toolbox.resizeBox('<div class="toolboxError"><h1>Whooops!</h1><p>Sorry, the <a href="http://malsup.com/jquery/form/">jQuery Form Plugin</a> is required to use hondaToolbox with forms.</p>');
                }
            } else {
                dp.toolbox.getContent(url, function (content) {
                    dp.toolbox.resizeBox(content);
                });
            }
        }
    };

    dp.toolbox.getContent = function (href, callback) {
        // alert(".getContent");
        var ajaxURL = convertToAjaxPath(href); // Get the Ajax URL from the real URL
        $.ajax({
            url: ajaxURL,
			cache: false,
            success: function (data) {
                hideElements();
                doLogging(href);
                callback(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                callback('<div class="toolboxError"><h1>Whooops!</h1><p>Sorry, that page does not exist <br>' + ajaxURL + ' (or ' + href + ')</p></div>');
            }
        });
        /*$.get(url+"?rand=" + Math.floor(Math.random() * 999999999), function(data){
        callback(data);
        });*/
    };


    dp.toolbox.showBox = function (content, el) {

        overlay();

        scroller(function () {

            var toolbox = $("#toolbox");
            var canvas = $("#toolboxCanvas");
            var contentDIV = $("#toolboxContent");

            contentDIV.html(content); // Insert content
			
            if (hondaToolboxReady != null && $.isFunction(hondaToolboxReady)) {
				try { hondaToolboxReady(); } catch (err) { };
				hondaToolboxReady = null;
			}

            // Secretely render
            canvas.css({ visibility: "hidden", display: "block" });
            contentDIV.css({ visibility: "hidden", display: "block" });

            // Get dimensions
            contentHeight = contentDIV.height(); // Measure the DIV
            toolboxWidth = toolbox.width();
            leftOffset = Math.ceil(($(window).width() / 2) - (toolboxWidth / 2)); // The left offset for the canvas, to center it
            
            // Position everything
            //toolbox.css({left:leftOffset, marginLeft:"0"});
            canvas.css({ visibility: "visible", height: contentHeight + "px", display: "none" });
            //contentDIV.css({visibility:"visible"});
            contentDIV.css({ visibility: "visible", position: "absolute", bottom: 0, width: "100%" });
	
            // Show stuff
            $("#toolboxShadow").show();
            //canvas.show("slide", {direction:"up"}, 700, function(){ // This does not work with jQuery 1.3+
            canvas.slideDown(700, function () {
                $("#toolboxClose a").fadeIn("slow");

                //toolbox.css({left:"50%", marginLeft:"-"+Math.ceil(toolboxWidth/2)+"px"}); // Make the overlay center dynamically on browser resize.
                // ... can't do this to begin with because if effects the animation of the slide.

                // Hide the indicator
                toggleIndicator(el, "trigger");
            });
			
        });
    };

    dp.toolbox.closeBox = function () {

        $("#toolboxLoading").hide();

        $("#toolboxClose a").fadeOut("fast", function () {
            //$("#toolboxCanvas").hide("slide", {direction:"up"}, 300, function(){
            $("#toolboxCanvas").slideUp(300, function () {
                $("#toolboxCanvas").hide();
                $("#toolboxContent").hide().empty();
                $("#toolboxCanvas2").hide();
                $("#toolboxContent2").hide().empty();
                $("#toolboxShadow").hide().remove();
                $("#toolboxClose a").hide();
                $("#toolboxOverlay").fadeOut("slow").remove();

                showElements(); //reshow any elements hidden earlier
                if (FL("inspireFlash")) FL("inspireFlash").startProcessing(); // Play the Flash shimmers

            });
        });

        return false;
    };

    dp.toolbox.resizeBox = function (content) {

        if (!$("#toolboxCanvas2").length) {
            $("#toolbox").append('<div id="toolboxCanvas2"><div id="toolboxContent2"></div></div>');
        } else {
            $("#toolboxContent2").empty();
        }

        var canvas2 = $("#toolboxCanvas2");
        var contentDIV2 = $("#toolboxContent2");
        var contentHeight = 0;

        contentDIV2.html(content); // Insert content

        canvas2.css({ visibility: "hidden", display: "block" });
        contentDIV2.css({ visibility: "hidden", display: "block" });

        // Get dimensions
        contentHeight = contentDIV2.height(); // Measure the DIV

        // Position everything
        canvas2.css({ visibility: "visible", height: contentHeight + "px", display: "none" });
        contentDIV2.css({ visibility: "visible" });

        $("#toolboxContent").fadeOut("fast", function () {

            $("#toolboxContent *").unbind();
            $("#toolboxContent").empty();

            $("#toolboxCanvas").show(function () {

                $("#toolboxContent").html(contentDIV2.html());

                if (hondaToolboxReady != null && $.isFunction(hondaToolboxReady)) {
					try { hondaToolboxReady(); } catch (err) { };
					hondaToolboxReady = null;
				}
				
                $("#toolboxContent").fadeIn("slow", function () {
                    canvas2.css({ height: "0", display: "none" });
                    contentDIV2.hide().empty();

                    toggleIndicator("", "closeButton");
                });
            });

        });
    };
	

    dp.toolbox.fromID = function (id) {
        id = id == "testdrive" ? "testDrive" : id;
        dp.toolbox.start($('#tools .' + id + ' .hijaxTool'), 'link');
    };
    this.hondaToolboxFromID = dp.toolbox.fromID;


    dp.toolbox.fromFlash = function(url) {
        var id;

        var features = new Array();
        features["/cars/findashowroom"] = "showroom";
        features["/cars/bookatestdrive"] = "testdrive";
        features["/cars/getabrochure"] = "brochure";

        for (x in features) {
            if (url == x)
                id = features[x];
        }

        dp.toolbox.fromID(id);
    };
    this.hondaToolboxFromFlash = dp.toolbox.fromFlash;


    //-- Private functions --

    function hideElements () {
        if ($.browser.msie) $("select").css("visibility", "hidden");
        $(".MMPanZoomWidget").css("visibility", "hidden");
        $(".MMPanZoomWidget").next("img").css("visibility", "hidden");
    };

    function showElements () {
        if ($.browser.msie) $("select").css("visibility", "visible");
        $(".MMPanZoomWidget").css("visibility", "visible");
        $(".MMPanZoomWidget").next("img").css("visibility", "visible");
    };

    function beforeSubmit (formData, jqForm, options) {

        var returnValue = (window.submitForm) ? submitForm(formData) : "";
        dp.toolbox.pseudoQuerystring = $.param(formData); // Remember data
        return returnValue;
    };

    function getURL (el, elType) {

        return (elType == "form") ? $(el).attr("action") : $(el).attr("href");
    };

    function showFormResponse (responseText, statusText) {
        dp.toolbox.resizeBox(responseText);
    };

    //Private
	function convertToAjaxPath (url) {
		
		var path = url.split('?')[0], // Gets the URL minus the query string.
			folders = path.split("/"), // Turn each path segment into an array.
			qsID = dp.getHttpGetParameters('id', url); // Attempt to get the ID from the query string.

		// Get content ID from query string or use default.
		var contentID = (qsID.length) ? qsID : 'index';

		// Append a default file extension.
		contentID+= '.html';

		// If the original link is a filename, then use that as the content ID (added for owners servicecentre).
		if (folders[folders.length - 1].indexOf('.') > -1) {
			contentID = folders.pop();
		}

		// Clean-up the folders.
		if (folders[0].toLowerCase() == "http:") { folders.shift(); folders.shift(); folders.shift(); } // remove domain (found in i.e.) - this seems a little risky.
		if (folders[folders.length - 1] == "") { folders.pop(); } // Remove the last folder if blank.
		if (folders[0] == "") { folders.shift(); } // Remove the first folder if blank.

		 // Create the URL from the folders array, contentID and append the original query string.
		url = "/" + folders.join("/") + "/content/" + contentID + '?' + url.split('?')[1];

		return url;
	};

    function scroller (callback) {

        var h = $("#header").height();

        // Detect Y-axis from top.
        var iebody = (document.compatMode && document.compatMode != "BackCompat") ? document.documentElement : document.body;
        var yTop = document.all ? iebody.scrollTop : pageYOffset;

        // Scroll to top if not already there and the Inspire panel is not minimised, 
        // or the, not at top and switching between panels.
        if (yTop > h) {
            $("html").animate({ scrollTop: 0 }, 750, function () {
                callback();
            });
        } else {
            callback();
        }

    };

    function overlay () {
        $("body").append('<div id="toolboxOverlay"></div>'); // Add the overlay DIV
        $("#toolbox").prepend('<div id="toolboxShadow" class="fixPng"></div>'); // Add the shadow DIV
        $("#toolboxOverlay").css({ 'height': $(document).height(), 'opacity': 0.4, "background-image": "url(/cars/_assets/presentation/toolbox/invis.gif)" }); // Set CSS rules

        $("#toolboxOverlay").click(dp.toolbox.closeBox); // Bind the close function to the overlay
    };

    function toggleIndicator (el, indicator) {

        if (indicator == "trigger") {
            if ($(el).hasClass("indicatorOn")) {
                $(el).removeClass("indicatorOn");

				$(el).parent("li").find("img").hide();
                
				//Workaround
				//$('li.brochure, li.showroom, li.testDrive').find('img').hide();
            }
            else {
                $(el).addClass("indicatorOn");
                $(el).parent("li").find("img").show();
            }
        } else {
            if ($("#toolboxClose a").hasClass("indicatorOn")) {
                $("#toolboxClose a").css({ "background-image": "url(/_assets/presentation/toolbox/close.png)" });
                $("#toolboxClose a").removeClass("indicatorOn");
            } else {
                $("#toolboxClose a").addClass("indicatorOn");
                $("#toolboxClose a").css({ "background-image": "url(/_assets/presentation/toolbox/loading-small.gif)" });
            }
        }
    };

})();


