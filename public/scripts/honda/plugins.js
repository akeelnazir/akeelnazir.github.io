// ==ClosureCompiler==
// @output_file_name plugins.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/* Global plugins
/* Any associated css should go into javascript-only.css

/* Includes code from the following files:

/_assets/behaviour/actions.js
/_assets/behaviour/jquery.mapreduce.js
/_assets/behaviour/jquery.glossary.js
/_assets/behaviour/jquery.thickbox.js
/cars/_assets/behaviour/hondaToolbox.js
/power/_assets/plugins/jquery.SWFObject
/cars/_assets/behaviour/jquery.ba-hashchange.min.js 
/_assets/behaviour/static/json2.js


/*
* Honda Randomize brand story Plugin v1.1
* Aarron Painter, James Westgate
*
* @requires jQuery v1.4.2 or later
*/

(function ($) {

    //Plug-in definition
    $.fn.extend({

        //Replace each value in array provided with result of the function
        randomiseBrandStory: function(option) {

            // generates a random brand story for inclusion on either the cars footer or portal page
            // extend with customClass to apply custom class
            var defaults = {storyType: 'car'};

            var options = $.extend(defaults, options);
			if (!options.storyType) return;
			
			var storyType = options.storyType.toLowerCase();
			
			var imageFolders = ['dinner-for-3-million/', 'fancy-a-cuppa/', 'meet-asimo/', 'sun-lover/'];
			var imageAlts = ['Dinner for 3 billion', 'Fancy a cuppa?', 'Meet Asimo', 'Sun Lover'];
			
            return this.each(function() {

				if ($(this).length) {

					var random = Math.floor(Math.random() * imageFolders.length);
					var html = ['<img src="'];
					
					//html.push(constants.CDN);
					
					html.push('/_assets/images/brand-stories/');
					html.push(imageFolders[random]);
					
					if (storyType == 'car') {
	                  	
						//If ie6 then use png8 versions of graphics
						html.push( $.browser.msie && $.browser.version == 6 ? 'car-ie6.png"' :  'car.png"');
					} 
					else {              
                        html.push(storyType);
						html.push('.jpg');
					}
                
                    if (options.customClass) html.push(['" class="', options.customClass, '"'].join(''));

					html.push([' alt="', imageAlts[random], '">'].join(''));

					$(this).append(html.join(''));
				}

                return false;
            });
        }
    });

})(jQuery);


//Preload images
//Replace each value in array provided with result of the function

(function ($) {

    //Definition
    $.extend({

        //Replace each value in array provided with result of the function
        preloadImages: function () {

            var a = (typeof arguments[0] == 'object') ? arguments[0] : arguments;
            for (var i = a.length - 1; i > 0; i--) {
                $('<img>').attr('src', a[i]);
            }
        }
    });

})(jQuery);


/*
* Map Reduce Plugin v1.0.1
*
* Copyright (c) James Westgate
* @requires jQuery v1.4.2 or later
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/

//Create closure
(function($) {

    var stack = [[]]; //Contain an array of functions for each dimension
    var pointer = -1; //Dimension of stack to use
    var result = null; //Reduce result

    var defaults = { //Default settings for execute
        async: true,
        race: 10,
        interval: 15
    };

    //Plugin definition
    $.extend({

        //Replace each value in array provided with result of the function
        maparray: function(a, fn) {

            pointer++;

            //Define stack array for this level and add function to stack
            if (stack.length <= pointer) stack[pointer] = [];
            stack[pointer].push({ fn: function(i) { a[i] = fn(i, a[i]); }, i: 0, a: a });

            pointer--;
        },

        //Update a single result by applying a function to each value in the array
        reduce: function(a, init, fn) {

            pointer++;

            //Make sure reduce higher than map cannot be called
            if (pointer <= stack.length) {

                //Initialise and place function on stack
                result = init;
                stack[pointer].push({ fn: function(i) { result = fn(i, a[i], result); }, i: 0, a: a });
            }

            pointer--;
        },

        //Execute the functions added to the stack
        execute: function(options, callback) {

            options = $.extend({}, defaults, options);
            if (!$.isFunction(callback)) callback = function() { };

            var executeStack = function() {

                //Check if there are functions in a higher stack
                if (pointer < stack.length - 1 && stack[pointer + 1].length) pointer++;

                //Execute the function in the current stack dimension and increment array index
                var obj = stack[pointer][0];
                obj.fn(obj.i);
                obj.i++;

                //Remove function from stack if completed
                if (obj.i == obj.a.length) {
                    stack[pointer].shift();
                    if (!stack[pointer].length) pointer--;
                }
            };

            //Execute the functions asynchronously on a timer, or synchronously
            if (options.async) {
                var timer = setTimeout(function() {
                    for (var i = 0; i < options.race; i++) {
                        if (!stack[0].length) {
                            callback(result);
                            clearInterval(timer);
                            return;
                        }
                        executeStack();
                    }

                    //Recall this anonymous function in x ms
                    timer = setTimeout(arguments.callee, options.interval);
                }, options.interval);
            }
            else {

                while (stack[0].length) executeStack();
                callback(result);
            }
        }
    });

    // end of closure
})(jQuery);

/*
* Thickbox 3.1 - One Box To Rule Them All.
* By Cody Lindley (http://www.codylindley.com)
* Copyright (c) 2007 cody lindley
* Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php
*/

var tb_pathToImage = "/_assets/images/hondatv-loading.gif";

//on page load call tb_init
$(document).ready(function() {
    tb_init('a.thickbox, area.thickbox, input.thickbox'); //pass where to apply thickbox
    imgLoader = new Image(); // preload image
    imgLoader.src = tb_pathToImage;
});

//add thickbox to href & area elements that have a class of .thickbox
function tb_init(domChunk) {
    $(domChunk).click(function() {
        var t = this.title || this.name || null;
        var a = this.href || this.alt;
        var g = this.rel || false;
        tb_show(t, a, g);
        this.blur();
        return false;
    });
}

function tb_show(caption, url, imageGroup) {//function called when the user clicks on a thickbox link

    try {
        if (typeof document.body.style.maxHeight === "undefined") {//if IE 6
            $("body", "html").css({ height: "100%", width: "100%" });
            $("html").css("overflow", "hidden");
            if (document.getElementById("TB_HideSelect") === null) {//iframe to hide select elements in ie6
                $("body").append("<iframe id='TB_HideSelect'></iframe><div id='TB_overlay'></div><div id='TB_window'></div>");
                $("#TB_overlay").click(tb_remove);
            }
        } else {//all others
            if (document.getElementById("TB_overlay") === null) {
                $("body").append("<div id='TB_overlay'></div><div id='TB_window'></div>");
                $("#TB_overlay").click(tb_remove);
            }
        }

        if (tb_detectMacXFF()) {
            $("#TB_overlay").addClass("TB_overlayMacFFBGHack"); //use png overlay so hide flash
        } else {
            $("#TB_overlay").addClass("TB_overlayBG"); //use background and opacity
        }

        if (caption === null) { caption = ""; }
        $("body").append("<div id='TB_load'><img src='" + imgLoader.src + "' /></div>"); //add loader to the page
        $('#TB_load').show(); //show loader

        var baseURL;
        if (url.indexOf("?") !== -1) { //ff there is a query string involved
            baseURL = url.substr(0, url.indexOf("?"));
        } else {
            baseURL = url;
        }

        var urlString = /\.jpg$|\.jpeg$|\.png$|\.gif$|\.bmp$/;
        var urlType = baseURL.toLowerCase().match(urlString);

        if (urlType == '.jpg' || urlType == '.jpeg' || urlType == '.png' || urlType == '.gif' || urlType == '.bmp') {//code to show images

            TB_PrevCaption = "";
            TB_PrevURL = "";
            TB_PrevHTML = "";
            TB_NextCaption = "";
            TB_NextURL = "";
            TB_NextHTML = "";
            TB_imageCount = "";
            TB_FoundURL = false;
            if (imageGroup) {
                TB_TempArray = $("a[@rel=" + imageGroup + "]").get();
                for (TB_Counter = 0; ((TB_Counter < TB_TempArray.length) && (TB_NextHTML === "")); TB_Counter++) {
                    var urlTypeTemp = TB_TempArray[TB_Counter].href.toLowerCase().match(urlString);
                    if (!(TB_TempArray[TB_Counter].href == url)) {
                        if (TB_FoundURL) {
                            TB_NextCaption = TB_TempArray[TB_Counter].title;
                            TB_NextURL = TB_TempArray[TB_Counter].href;
                            TB_NextHTML = "<span id='TB_next'>&nbsp;&nbsp;<a href='#'>Next &gt;</a></span>";
                        } else {
                            TB_PrevCaption = TB_TempArray[TB_Counter].title;
                            TB_PrevURL = TB_TempArray[TB_Counter].href;
                            TB_PrevHTML = "<span id='TB_prev'>&nbsp;&nbsp;<a href='#'>&lt; Prev</a></span>";
                        }
                    } else {
                        TB_FoundURL = true;
                        TB_imageCount = "Image " + (TB_Counter + 1) + " of " + (TB_TempArray.length);
                    }
                }
            }

            imgPreloader = new Image();
            imgPreloader.onload = function() {
                imgPreloader.onload = null;

                // Resizing large images - orginal by Christian Montoya edited by me.
                var pagesize = tb_getPageSize();
                var x = pagesize[0] - 150;
                var y = pagesize[1] - 150;
                var imageWidth = imgPreloader.width;
                var imageHeight = imgPreloader.height;
                if (imageWidth > x) {
                    imageHeight = imageHeight * (x / imageWidth);
                    imageWidth = x;
                    if (imageHeight > y) {
                        imageWidth = imageWidth * (y / imageHeight);
                        imageHeight = y;
                    }
                } else if (imageHeight > y) {
                    imageWidth = imageWidth * (y / imageHeight);
                    imageHeight = y;
                    if (imageWidth > x) {
                        imageHeight = imageHeight * (x / imageWidth);
                        imageWidth = x;
                    }
                }
                // End Resizing

                TB_WIDTH = imageWidth + 30;
                TB_HEIGHT = imageHeight + 60;
                $("#TB_window").append("<a href='' id='TB_ImageOff' title='Close'><img id='TB_Image' src='" + url + "' width='" + imageWidth + "' height='" + imageHeight + "' alt='" + caption + "'/></a>" + "<div id='TB_caption'>" + caption + "<div id='TB_secondLine'>" + TB_imageCount + TB_PrevHTML + TB_NextHTML + "</div></div><div id='TB_closeWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div>");

                $("#TB_closeWindowButton").click(tb_remove);

                if (!(TB_PrevHTML === "")) {
                    function goPrev() {
                        if ($(document).unbind("click", goPrev)) { $(document).unbind("click", goPrev); }
                        $("#TB_window").remove();
                        $("body").append("<div id='TB_window'></div>");
                        tb_show(TB_PrevCaption, TB_PrevURL, imageGroup);
                        return false;
                    }
                    $("#TB_prev").click(goPrev);
                }

                if (!(TB_NextHTML === "")) {
                    function goNext() {
                        $("#TB_window").remove();
                        $("body").append("<div id='TB_window'></div>");
                        tb_show(TB_NextCaption, TB_NextURL, imageGroup);
                        return false;
                    }
                    $("#TB_next").click(goNext);

                }

                document.onkeydown = function(e) {
                    if (e == null) { // ie
                        keycode = event.keyCode;
                    } else { // mozilla
                        keycode = e.which;
                    }
                    if (keycode == 27) { // close
                        tb_remove();
                    } else if (keycode == 190) { // display previous image
                        if (!(TB_NextHTML == "")) {
                            document.onkeydown = "";
                            goNext();
                        }
                    } else if (keycode == 188) { // display next image
                        if (!(TB_PrevHTML == "")) {
                            document.onkeydown = "";
                            goPrev();
                        }
                    }
                };

                tb_position();
                $("#TB_load").remove();
                $("#TB_ImageOff").click(tb_remove);
                $("#TB_window").css({ display: "block" }); //for safari using css instead of show
            };

            imgPreloader.src = url;
        } else {//code to show html

            var queryString = url.replace(/^[^\?]+\??/, '');
            var params = tb_parseQuery(queryString);

            TB_WIDTH = (params['width'] * 1) + 30 || 630; //defaults to 630 if no paramaters were added to URL
            TB_HEIGHT = (params['height'] * 1) + 40 || 440; //defaults to 440 if no paramaters were added to URL
            ajaxContentW = TB_WIDTH - 30;
            ajaxContentH = TB_HEIGHT - 45;

            if (url.indexOf('TB_iframe') != -1) {// either iframe or ajax window		
                urlNoQuery = url.split('TB_');
                $("#TB_iframeContent").remove();
                if (params['modal'] != "true") {//iframe no modal
                    $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>" + caption + "</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton' title='Close'>close</a> or Esc Key</div></div><iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='TB_iframeContent' name='TB_iframeContent" + Math.round(Math.random() * 1000) + "' onload='tb_showIframe()' style='width:" + (ajaxContentW + 29) + "px;height:" + (ajaxContentH + 17) + "px;' > </iframe>");
                } else {//iframe modal
                    $("#TB_overlay").unbind();
                    $("#TB_window").append("<iframe frameborder='0' hspace='0' src='" + urlNoQuery[0] + "' id='TB_iframeContent' name='TB_iframeContent" + Math.round(Math.random() * 1000) + "' onload='tb_showIframe()' style='width:" + (ajaxContentW + 29) + "px;height:" + (ajaxContentH + 17) + "px;'> </iframe>");
                }
            } else {// not an iframe, ajax
                if ($("#TB_window").css("display") != "block") {
                    if (params['modal'] != "true") {//ajax no modal
                        $("#TB_window").append("<div id='TB_title'><div id='TB_ajaxWindowTitle'>" + caption + "</div><div id='TB_closeAjaxWindow'><a href='#' id='TB_closeWindowButton'>close</a> or Esc Key</div></div><div id='TB_ajaxContent' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px'></div>");
                    } else {//ajax modal
                        $("#TB_overlay").unbind();
                        $("#TB_window").append("<div id='TB_ajaxContent' class='TB_modal' style='width:" + ajaxContentW + "px;height:" + ajaxContentH + "px;'></div>");
                    }
                } else {//this means the window is already up, we are just loading new content via ajax
                    $("#TB_ajaxContent")[0].style.width = ajaxContentW + "px";
                    $("#TB_ajaxContent")[0].style.height = ajaxContentH + "px";
                    $("#TB_ajaxContent")[0].scrollTop = 0;
                    $("#TB_ajaxWindowTitle").html(caption);
                }
            }

            $("#TB_closeWindowButton").click(tb_remove);

            if (url.indexOf('TB_inline') != -1) {
                $("#TB_ajaxContent").append($('#' + params['inlineId']).children());
                $("#TB_window").unload(function() {
                    $('#' + params['inlineId']).append($("#TB_ajaxContent").children()); // move elements back when you're finished
                });
                tb_position();
                $("#TB_load").remove();
                $("#TB_window").css({ display: "block" });
            } else if (url.indexOf('TB_iframe') != -1) {
                tb_position();
                if ($.browser.safari) {//safari needs help because it will not fire iframe onload
                    $("#TB_load").remove();
                    $("#TB_window").css({ display: "block" });
                }
            } else {
                $("#TB_ajaxContent").load(url += "&random=" + (new Date().getTime()), function() {//to do a post change this load method
                    tb_position();
                    $("#TB_load").remove();
                    tb_init("#TB_ajaxContent a.thickbox");
                    $("#TB_window").css({ display: "block" });
                });
            }

        }

        if (!params['modal']) {
            document.onkeyup = function(e) {
                if (e == null) { // ie
                    keycode = event.keyCode;
                } else { // mozilla
                    keycode = e.which;
                }
                if (keycode == 27) { // close
                    tb_remove();
                }
            };
        }

    } catch (e) {
        //nothing here
    }
}

//helper functions below
function tb_showIframe() {
    $("#TB_load").remove();
    $("#TB_window").css({ display: "block" });
}

function tb_remove() {
    $("#TB_imageOff").unbind("click");
    $("#TB_closeWindowButton").unbind("click");
    $("#TB_window").fadeOut("fast", function() { $('#TB_window,#TB_overlay,#TB_HideSelect').trigger("unload").unbind().remove(); });
    $("#TB_load").remove();
    if (typeof document.body.style.maxHeight == "undefined") {//if IE 6
        $("body", "html").css({ height: "auto", width: "auto" });
        $("html").css("overflow", "");
    }
    document.onkeydown = "";
    document.onkeyup = "";
    return false;
}

function tb_position() {
    $("#TB_window").css({ marginLeft: '-' + parseInt((TB_WIDTH / 2), 10) + 'px', width: TB_WIDTH + 'px' });
    if (!(jQuery.browser.msie && jQuery.browser.version < 7)) { // take away IE6
        $("#TB_window").css({ marginTop: '-' + parseInt((TB_HEIGHT / 2), 10) + 'px' });
    }
}

function tb_parseQuery(query) {
    var Params = {};
    if (!query) { return Params; } // return empty object
    var Pairs = query.split(/[;&]/);
    for (var i = 0; i < Pairs.length; i++) {
        var KeyVal = Pairs[i].split('=');
        if (!KeyVal || KeyVal.length != 2) { continue; }
        var key = unescape(KeyVal[0]);
        var val = unescape(KeyVal[1]);
        val = val.replace(/\+/g, ' ');
        Params[key] = val;
    }
    return Params;
}

function tb_getPageSize() {
    var de = document.documentElement;
    var w = window.innerWidth || self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var h = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    arrayPageSize = [w, h];
    return arrayPageSize;
}

function tb_detectMacXFF() {
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('mac') != -1 && userAgent.indexOf('firefox') != -1) {
        return true;
    }
}

/*
* Bitly Plugin v0.9
*
* Copyright (c) James Westgate
* @requires jQuery v1.4.2 or later
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
*/

//Create closure
(function($) {

    // Set up default options
    var defaults = {
        header: 'http://api.bit.ly/v3/',
        shortUrl: '',
        longUrl: '',
        hash: '',
        domain: 'bit.ly',
        apiKey: '',
        login: ''
    };

    var callBitly = function(url, success, error) {

        $.getJSON(url, function(response) {

            if (response.status_code == 200) {
                success(response.data);
            }
            else {
                error(response);
            }
        });
    };

    //Plugin definition
    $.extend({

        //Replace each value in array provided with result of the function
        shorten: function(options, success, error) {

            options = $.extend({}, defaults, options);

            // Build the URL to query
            var url = [options.header, 'shorten?longUrl=', encodeURIComponent(options.longUrl), '&login=', options.login.toLowerCase(),
                '&apiKey=', options.apiKey, '&domain=', options.domain, '&format=json'].join('');

            callBitly(url, success, error);
        },

        //Replace each value in array provided with result of the function
        expand: function(options, success, error) {

            options = $.extend({}, defaults, options);

            // Build the URL to query
            var url = [options.header, 'expand?shortUrl=', options.shortUrl, '&hash=', options.hash, '&login=', options.login.toLowerCase(),
                '&apiKey=', options.apiKey, '&format=json'].join('');

            callBitly(url, success, error);
        },

        //Replace each value in array provided with result of the function
        validate: function(options, success, error) {

            options = $.extend({}, defaults, options);

            // Build the URL to query
            var url = [options.header, 'validate?x_login=', options.x_login, '&x_apiKey=', options.x_apiKey, '&login=', options.login.toLowerCase(),
                '&apiKey=', options.apiKey, '&format=json'].join('');

            callBitly(url, success, error);
        },

        //Replace each value in array provided with result of the function
        clicks: function(options, success, error) {

            options = $.extend({}, defaults, options);

            // Build the URL to query
            var url = [options.header, 'clicks?shortUrl=', options.shortUrl, '&hash=', options.hash, '&login=', options.login.toLowerCase(),
                '&apiKey=', options.apiKey, '&format=json'].join('');

            callBitly(url, success, error);
        }

    });

    // end of closure
})(jQuery);


/*
* Glossary Plugin v1.1
*
* Copyright (c) 2010 Honda Motors Europe
* @author James Westgate
* @requires jQuery v1.4.2 or later
* @requires the Map Reduce Plugin 1.0
*   http://plugins.jquery.com/project/MapReduce
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*
* Includes portions of Highlight plug-in
* Copyright (c) 2009 Bartek Szopka, Johann Burkard
* Licensed under MIT license.
*
* Includes portions of Tipsy plug-in 0.1.7
*
* TODO Override glossary highlighting for children of containers with glossary-ignore class name
*/

//Create closure for glossary functions
(function ($) {

    var defaults = { //Default settings for glossary
        data: [],
        duplicates: false,

        async: true,
        race: 10,
        interval: 20,

        fade: false,
        fallback: '',
        html: false
    };

    var exists = {};

    //Plugin definition
    $.fn.extend({


        //Replace each value in array provided with result of the function
        glossary: function (options) {

            options = $.extend({}, defaults, options);

            //Check for the map reduce plugin
            if ($.maparray == null || $.execute == null) return;

            //Hide any tips when user clicks outside of a tooltip
            //Also handles the close icon inside the tooltip
            $(document).click(function (e) {
                var $target = $(e.target);
                if (!$target.hasClass('gypsy-title') && !$target.hasClass('gypsy-content')) hideTips(options.fade);
            });

            //Cancel event if clicking close
            $('.gypsy-close').live('click', function (e) {
                e.preventDefault();
            });

            //Clear previous duplicate matches
            exists = {};

            $(this).each(function (i) {

                var node = this;

                //Loop through each term and map a lookup to get a set of selectors
                $.maparray(options.data, function (index, value) {

                    var regex = ['\\b', value.key, '\\b'].join('');
                    value.found = ($.fn.highlight(node, new RegExp(regex, 'i'), value, options));

                    return value;
                });
            });

            //Execute the mapped functions asynchronously
            $.execute(options);

            return this;
        },

        highlight: function (node, re, value, options) {

            if (node.nodeType === 3) {

                var match = node.data.match(re);

                if (match) {

                    //Kick out duplicates
                    if (!options.duplicates) {
                        if (exists[value.key]) return;
                        exists[value.key] = true;
                    }

                    var builder = ['<a href="', value.url, '" class="glossary-link" title="', value.title, '"><dfn class="glossary"/></a>'].join('');
                    var highlight = $(builder).get(0);

                    var wordNode = node.splitText(match.index);
                    wordNode.splitText(match[0].length);
                    highlight.appendChild(wordNode.cloneNode(true));
                    wordNode.parentNode.replaceChild(highlight, wordNode);

                    //Add tip
                    addtip(highlight, options, value);

                    return 1; //skip added node in parent
                }
            } else if ((node.nodeType === 1 && node.childNodes) && // only element nodes that have children
              !/(script|style)/i.test(node.tagName) && // ignore script and style nodes
              !(node.tagName === 'DFN' && node.className === 'glossary') && // skip if already highlighted
              !(node.className === 'glossary-ignore')) { // Skip if override)

                for (var i = 0; i < node.childNodes.length; i++) {
                    i += $.fn.highlight(node.childNodes[i], re, value, options);
                }
            }
            return 0;
        },

        gypsy: function (options) {

            options = $.extend({}, defaults, options);

            return this.each(function (i) {
                addtip(this, options, options);
            });
        }
    });

    //Replace each value in array provided with result of the function
    function addtip(node, opts, value) {

        $(node).click(function (e) {

            //Stop the default link action, and stop the event bubbling up the DOM
            e.preventDefault();
            e.stopPropagation()

            //Hide all other tips
            hideTips(opts.fade);

            //Add the tip to the dom if it hasnt been added
            var $tip = $.data(this, 'active.gypsy');
            if (!$tip) {

                var html = '';

                //Get the html from the function, or html literal, or as text
                if (value.html != null) html = (typeof value.html == 'function') ? value.html(value) : value.html;
                if (value.text != null && value.text.length) html = ['<span>', value.text, '</span>'].join('');

                //Create tip
                var nocss3 = ($.browser.msie && $.browser.version <= 8);
                var markup = [];

                markup.push('<div class="gypsy fixPng">');
                if (nocss3) markup.push('<div id="box-ne" class="fixPng">');
                markup.push('<div class="gypsy-title">');
                markup.push((value.title != null && value.title.length) ? value.title : $(this).attr('title'));
                markup.push('<a class="gypsy-close" href="#"></a>');
                markup.push('</div>');
                if (nocss3) markup.push('</div><div id="box-se" class="fixPng">');
                markup.push('<div class="gypsy-content fixPng">');
                markup.push(html);
                if (nocss3) markup.push('</div>');
                markup.push('</div><div class="gypsy-arrow"></div></div>');

                $tip = $(markup.join(''));

                $tip.css({ position: 'absolute', zIndex: 100000 });
                if (nocss3) $tip.css({ visibility: 'visible', display: 'block' });

                $.data(this, 'active.gypsy', $tip);

                $tip.appendTo(document.body)
            }

            //This is a reset that is required
            $tip.css({ visibility: 'hidden', display: 'block' });

            //Setup the positioning from the current element
            var pos = $.extend({}, $(this).offset(), { width: this.offsetWidth, height: this.offsetHeight });

            //Set tip position
            //Place the tip to the left or right of the screen, depending on which half it is in
            var css = { top: pos.top - $tip[0].offsetHeight - 6 };

            if ($(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2)) {
                css.left = pos.left - $tip[0].offsetWidth + 40 + (pos.width / 2);
                cls = 'gypsy-arrow-left';
            }
            else {
                css.left = pos.left - 40 + (pos.width / 2);
                cls = 'gypsy-arrow-right';
            }

            //Apply css and class
            $tip.css(css);
            $('div.gypsy-arrow', $tip).addClass(cls);

            //Fade in or just show
            if (opts.fade) {
                $tip.css({ opacity: 0, display: 'block', visibility: 'visible' }).animate({ opacity: 0.8 });
            } else {
                $tip.css({ visibility: 'visible' });
            }
        });
    }

    function hideTips(fade) {
        var $tips = $('div.gypsy');

        if (fade) {
            $tips.stop().fadeOut();
        } else {
            $tips.hide();
        }
    }

    // end of closure
})(jQuery);



/*
* Honda Toolbox Plugin v1.0.30
*
* Mat Harden, James Westgate
*
* @requires jQuery v1.4.2 or later
* @requires dp.toolbox.js
*
*/

//Create closure
(function($) {

    //Plugin definition
    $.fn.extend({

        //Replace each value in array provided with result of the function
        hondaToolbox: function(options) {
			
			var settings = {
				'indicator' : false
			};

            var pseudoQuerystring = "";

            dp.toolbox.create();

            return this.each(function () {
				
				if (options){
					$.extend(settings, options);
				}

                if (this.tagName == "FORM") {
                    $(this).unbind("submit").submit(function () {
                        //alert("form binding");
                        dp.toolbox.start($(this), "form"); this.blur(); return false;
                    })
                } else {
                    $(this).unbind("click").click(function () {
                        dp.toolbox.start($(this), "link"); this.blur(); return false;
                    });

                    if (settings.indicator){
						// Add a hidden image to the triggers as a way of pre-loading.
	                    var elWidth = $(this).width() - 3;
	                    $(this).parent("li")
						    .css({ position: "relative" })
						    .append('<img src="/_assets/presentation/toolbox/invis.gif" class="toolboxIndicator" style="background:#fff url(/_assets/presentation/toolbox/loading.gif) no-repeat 0 0;position:absolute;top:-9px;left:3px;height:35px;width:' + elWidth + 'px;display:none;" />');
					}
                }

            });
        }
    });

})(jQuery);

// jQuery SWFObject v1.1.1 MIT/GPL @jon_neal
// http://jquery.thewikies.com/swfobject

(function($, flash, Plugin) {
	var OBJECT = 'object',
		ENCODE = true;

	function _compareArrayIntegers(a, b) {
		var x = (a[0] || 0) - (b[0] || 0);

		return x > 0 || (
			!x &&
			a.length > 0 &&
			_compareArrayIntegers(a.slice(1), b.slice(1))
		);
	}

	function _objectToArguments(obj) {
		if (typeof obj != OBJECT) {
			return obj;
		}

		var arr = [],
			str = '';

		for (var i in obj) {
			if (typeof obj[i] == OBJECT) {
				str = _objectToArguments(obj[i]);
			}
			else {
				str = [i, (ENCODE) ? encodeURI(obj[i]) : obj[i]].join('=');
			}

			arr.push(str);
		}

		return arr.join('&');
	}

	function _objectFromObject(obj) {
		var arr = [];

		for (var i in obj) {
			if (obj[i]) {
				arr.push([i, '="', obj[i], '"'].join(''));
			}
		}

		return arr.join(' ');
	}

	function _paramsFromObject(obj) {
		var arr = [];

		for (var i in obj) {
			arr.push([
				'<param name="', i,
				'" value="', _objectToArguments(obj[i]), '" />'
			].join(''));
		}

		return arr.join('');
	}

	try {
		var flashVersion = Plugin.description || (function () {
			return (
				new Plugin('ShockwaveFlash.ShockwaveFlash')
			).GetVariable('$version');
		}())
	}
	catch (e) {
		flashVersion = 'Unavailable';
	}

	var flashVersionMatchVersionNumbers = flashVersion.match(/\d+/g) || [0];

	$[flash] = {
		available: flashVersionMatchVersionNumbers[0] > 0,

		activeX: Plugin && !Plugin.name,

		version: {
			original: flashVersion,
			array: flashVersionMatchVersionNumbers,
			string: flashVersionMatchVersionNumbers.join('.'),
			major: parseInt(flashVersionMatchVersionNumbers[0], 10) || 0,
			minor: parseInt(flashVersionMatchVersionNumbers[1], 10) || 0,
			release: parseInt(flashVersionMatchVersionNumbers[2], 10) || 0
		},

		hasVersion: function (version) {
			var versionArray = (/string|number/.test(typeof version))
				? version.toString().split('.')
				: (/object/.test(typeof version))
					? [version.major, version.minor]
					: version || [0, 0];

			return _compareArrayIntegers(
				flashVersionMatchVersionNumbers,
				versionArray
			);
		},

		encodeParams: true,

		expressInstall: 'expressInstall.swf',
		expressInstallIsActive: false,

		create: function (obj) {
			var instance = this;

			if (
				!obj.swf ||
				instance.expressInstallIsActive ||
				(!instance.available && !obj.hasVersionFail)
			) {
				return false;
			}

			if (!instance.hasVersion(obj.hasVersion || 1)) {
				instance.expressInstallIsActive = true;

				if (typeof obj.hasVersionFail == 'function') {
					if (!obj.hasVersionFail.apply(obj)) {
						return false;
					}
				}

				obj = {
					swf: obj.expressInstall || instance.expressInstall,
					height: 137,
					width: 214,
					flashvars: {
						MMredirectURL: location.href,
						MMplayerType: (instance.activeX)
							? 'ActiveX' : 'PlugIn',
						MMdoctitle: document.title.slice(0, 47) +
							' - Flash Player Installation'
					}
				};
			}

			attrs = {
				data: obj.swf,
				type: 'application/x-shockwave-flash',
				id: obj.id || 'flash_' + Math.floor(Math.random() * 999999999),
				width: obj.width || 320,
				height: obj.height || 180,
				style: obj.style || ''
			};

			ENCODE = typeof obj.useEncode !== 'undefined' ? obj.useEncode : instance.encodeParams;

			obj.movie = obj.swf;
			obj.wmode = obj.wmode || 'opaque';

			delete obj.fallback;
			delete obj.hasVersion;
			delete obj.hasVersionFail;
			delete obj.height;
			delete obj.id;
			delete obj.swf;
			delete obj.useEncode;
			delete obj.width;

			var flashContainer = document.createElement('div');

			flashContainer.innerHTML = [
				'<object ', _objectFromObject(attrs), '>',
				_paramsFromObject(obj),
				'</object>'
			].join('');

			return flashContainer.firstChild;
		}
	};

	$.fn[flash] = function (options) {
		var $this = this.find(OBJECT).andSelf().filter(OBJECT);

		if (/string|object/.test(typeof options)) {
			this.each(
				function () {
					var $this = $(this),
						flashObject;

					options = (typeof options == OBJECT) ? options : {
						swf: options
					};

					options.fallback = this;

					flashObject = $[flash].create(options);

					if (flashObject) {
						$this.children().remove();

						$this.html(flashObject);
					}
				}
			);
		}

		if (typeof options == 'function') {
			$this.each(
				function () {
					var instance = this,
					jsInteractionTimeoutMs = 'jsInteractionTimeoutMs';

					instance[jsInteractionTimeoutMs] =
						instance[jsInteractionTimeoutMs] || 0;

					if (instance[jsInteractionTimeoutMs] < 660) {
						if (instance.clientWidth || instance.clientHeight) {
							options.call(instance);
						}
						else {
							setTimeout(
								function () {
									$(instance)[flash](options);
								},
								instance[jsInteractionTimeoutMs] + 66
							);
						}
					}
				}
			);
		}

		return $this;
	};
}(
	jQuery,
	'flash',
	navigator.plugins['Shockwave Flash'] || window.ActiveXObject
));


/*!
 * jQuery hashchange event - v1.2 - 2/11/2010
 * http://benalman.com/projects/jquery-hashchange-plugin/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($,i,b){var j,k=$.event.special,c="location",d="hashchange",l="href",f=$.browser,g=document.documentMode,h=f.msie&&(g===b||g<8),e="on"+d in i&&!h;function a(m){m=m||i[c][l];return m.replace(/^[^#]*#?(.*)$/,"$1")}$[d+"Delay"]=100;k[d]=$.extend(k[d],{setup:function(){if(e){return false}$(j.start)},teardown:function(){if(e){return false}$(j.stop)}});j=(function(){var m={},r,n,o,q;function p(){o=q=function(s){return s};if(h){n=$('<iframe src="javascript:0"/>').hide().insertAfter("body")[0].contentWindow;q=function(){return a(n.document[c][l])};o=function(u,s){if(u!==s){var t=n.document;t.open().close();t[c].hash="#"+u}};o(a())}}m.start=function(){if(r){return}var t=a();o||p();(function s(){var v=a(),u=q(t);if(v!==t){o(t=v,u);$(i).trigger(d)}else{if(u!==t){i[c][l]=i[c][l].replace(/#.*/,"")+"#"+u}}r=setTimeout(s,$[d+"Delay"])})()};m.stop=function(){if(!n){r&&clearTimeout(r);r=0}};return m})()})(jQuery,this);



/*
    http://www.JSON.org/json2.js
    2010-08-25

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };
		
		String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
           try{
            return this.valueOf();
           } catch(e){}
       };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());



/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (key, value, options) {

    // key and value given, set cookie...
    if (arguments.length > 1 && (value === null || typeof value !== "object")) {
        options = jQuery.extend({}, options);

        if (value === null) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? String(value) : encodeURIComponent(String(value)),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
