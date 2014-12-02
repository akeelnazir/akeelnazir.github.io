var memory = new Memory();

function Memory() {
  this.gradeID = null;
  this.engineID = null;
  this.transmissionID = null;
}

Memory.prototype.reset = function () {
  this.gradeID = null;
  this.engineID = null;
  this.transmissionID = null;
};

var carHomePage;

//-- dp.cars --
(function () {

  //Namespace
  dp.cars = function () {};

  //Public functions
  dp.cars.init = function () {
    //iAds pinch fix
    var reg = /iadctest.qwapi.com/;
    if (reg.test(document.referrer)) {
      var viewport = $('meta[name="viewport"]');
      if (viewport.length !== 0) {
        viewport.attr('content', 'width=device-width, initial-scale=0.7, minimum-scale=0.7, maximum-scale=10.0, user-scalable=1');
      } else {
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=0.7, minimum-scale=0.7, maximum-scale=10.0, user-scalable=1" />');
      }
    }

    //Best to do this as soon as possible to avoid pngfix problems
    $('#promo').randomiseBrandStory({
      customClass: 'fixPng'
    });

    $(".bookatestdrive ul.testDriveProductChooser li").live("click", function () {

      $(this).find("input").attr("checked", true);

      $(this).siblings("li").each(function () {
        var currentClass = $(this).find("a").attr("class");
        if (currentClass.substring(0, 6) == "chosen") {
          $(this).find("a").removeClass(currentClass) // Remove class
          .addClass(currentClass.substring(6, currentClass.length));
        }
      });
      var currentClass2 = $(this).find("a").attr("class");
      if (currentClass2.substring(0, 6) != "chosen") {
        $(this).find("a").attr("class", "chosen" + currentClass2);
      }
    });

    // swap car colour out when swatch is clicked
    $(".carColours a").live("click", function () {

      var carPath = $(this).attr("href");
      var carAlt = $(this).attr("title");
      var swatchClicked = $(this).parent("li").attr("id");
      var swatchNumclicked = swatchClicked.replace("swatch", "");

      dp.removeClassFromSelector("ul.carColours", "sw");
      $("#colourChooser ul").addClass("sw" + swatchNumclicked);

      if ($("#mainCar").attr("src") != carPath) {
        $("#mainCar").fadeOut("fast", function () {
          $("#mainCar").attr({
            src: carPath,
            alt: carAlt,
            title: carAlt
          });
          $("#overviewColours p").html(carAlt);
          $("#mainCar").fadeIn("fast");
        });
      }
      return false;
    });

    // Toolbox binding
    // If on a showroom (dealer) site/domain there will be a 'showroom' object
    // When this is true, do not allow the toolbox to bind, instead we leave it to
    // .htaccess to redirect to the showroom contact us page.
    if (typeof showroom === 'undefined') {
      // Only add indicators to the shared features in the header
      $("body #tools .hijaxTool").hondaToolbox({
        'indicator': true
      });
      // No indicators added to other toolbox triggers
      $("body .hijaxTool").hondaToolbox();
    }


    //Code for Postcode Checker in the product pages
    $("#testDriveForm button").click(

    function (e) {
      var validPostCodeTest = isValidPostcode($("#testDriveForm #location").val());
      if (!validPostCodeTest) {
        e.preventDefault();
        alert("Please enter a valid UK postcode");
      }
    });

    // Expire mobile site cookie - allows mobile site to be shown where available (see .htaccess)
    var loc = window.location.toString();
    loc += (loc.indexOf('?') > -1) ? '&' : '?';
    $('.mobileSite').attr('href', loc + 'mobile_site=1').click(function () {
      $.cookie('hukmcars', null, {
        path: '/'
      });
    });


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
	//Live chat removed
    //These two functions may now need to be called after ajax operations
    dp.cars.hideCarButtons();
    dp.cars.replaceLabels();
  }

  dp.cars.hideCarButtons = function () {
    $('.bookatestdrive ul.testDriveProductChooser li .carButton').each(function () {
      $(this).addClass('hideCarButton');
    });
  }
  this.hideCarButtons = dp.cars.hideCarButtons;

  dp.cars.replaceLabels = function () {
    $('.placeSearch').each(function () {

      //Get the label and the placeholder
      var text = '';
      var $label = $(this).find("label.place");
      var $place = $('input.place', this);

      //Try get the text
      if ($label.length) {
        text = $label.text();
        $label.remove();
      } else {
        text = $place.attr('title');
        $place.attr('title', '');
      }

      //Add a class and set the textbox value to label text
      $place.addClass('placeholder').data('label', text).val(text);

      //Swap text in and out on focus and blur
      $place.live('focus', function () {
        if (this.value == $(this).data('label')) $(this).removeClass('placeholder').val('');
      });

      $place.live('blur', function () {
        if (this.value == '') $(this).addClass('placeholder').val($(this).data('label'));
      });
    });
  }
  this.replaceLabels = dp.cars.replaceLabels;

  dp.cars.loadGlossary = function () {

    //Glossary
    $.getJSON('/cars/glossary/_assets/data/glossary-data.js', function (data, textStatus) {

      //Set up the options for the glossary plugin
      var options = {
        data: []
      };

      //Map the terms from the glossary download to options
      $.maparray(data.terms, function (index, value) {
        options.data.push({
          key: value,
          title: value,
          html: callback,
          index: index
        });
        return value;
      });

      //Execute the mapped function, when done call the glossary plug-in
      $.execute({
        async: true,
        race: 10,
        interval: 20
      }, function () {
        $('#mainContentArea').glossary(options);
      });

      function callback(dataItem) {
        return data.definitions[dataItem.index];
      }
    });
  }

  // Click handlers for new car nav

  var $body = $('body'), $headerHeight = $('#carsHeader').height(), $menuNewLi = $('#menu li.new > a'), $overlay = $('<div id="carsHeaderOverlay"></div>');

  $body.append($overlay);

  $menuNewLi.click(function(e) {
    e.preventDefault();
    $menuNewLi.toggleClass('menu-selected');
    $('#new-dropdown').toggle();
    $overlay.height($body.height() - $headerHeight).css('min-height', $(window).height() - $headerHeight).toggle();
  });

  $overlay.click(function() {
    $menuNewLi.click();
  });

  // END of click handlers for new car nav

  // SIF to fix the 4px DIV on top
  ;(function() {
    var t;
    t = window.setTimeout(function(){
      $('object').filter('[classid="clsid:CAFEEFAC-DEC7-0000-0000-ABCDEFFEDCBA"]').parent().parent().remove();
    }, 50);
  }).call(this);

})();


//-- dp.cars.menu --
(function () {

  //Embed flash
  var flashvars = {};
  flashvars.xmlSrc = (carHomePage) ? '/cars/_assets/data/navigation/navigationCarHome.xml' : '/cars/_assets/data/navigation/navigation.xml';

  var flashParams = {
    wmode: 'transparent',
    menu: 'false',
    allowscriptaccess: 'always',
    align: 'T',
    salign: 'T',
    quality: 'best',
    scale: 'noscale'
  };
  var attributes = {
    id: 'newCarsMenuFlash',
    name: 'newCarsMenuFlash'
  };

  if (typeof swfobject !== 'undefined') swfobject.embedSWF('/cars/_assets/flash/verticalnav.swf', 'newCarsMenu', '200', '500', '9.0.0', '/_assets/flash/expressInstall.swf', flashvars, flashParams, attributes);

  //Public functions
  dp.cars.menu = function () {};

  dp.cars.menu.init = function () {

    //Create a hover layer and bind collapse to pages other than home
    var $flashMenuWrapper = $('#flashMenuWrapper');

    $('#flashMenuWrapper object').live('mouseleave', function () {

      if (carHomePage === undefined) {
        dp.cars.menu.closeMenu();
      }
    });


    $('#flashMenuWrapper object').live('mouseenter', function () {

      if (carHomePage === undefined) {
        dp.cars.menu.openMenu();
      }
    });


    // Apply CSS to initially collapsed menu pages other than home
    if (carHomePage === undefined) {
      $flashMenuWrapper.css({
        background: 'none',
        width: '350px',
        height: '23px',
        marginLeft: '-525px',
        overflow: 'hidden'
      });
    }
  };

  dp.cars.menu.closeMenu = function () {

    $('#flashMenuWrapper').css({
      height: '23px',
      zIndex: '40'
    });
    if (FL('inspireFlash')) {
      try {
        FL('inspireFlash').startProcessing();
      } catch (e) {}
    };


  };

  dp.cars.menu.openMenu = function () {
    $('#flashMenuWrapper').css({
      height: '460px',
      zIndex: '80'
    });
    if (FL('inspireFlash')) {
      try {
        FL('inspireFlash').stopProcessing();
      } catch (e) {}
    };

  };

})();