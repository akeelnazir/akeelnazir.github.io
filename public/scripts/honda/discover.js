$(function() { /*document ready */

  /* Workaround for undesired 4px div in IE */
  window.setInterval(removeTopDiv, 2000);

  function removeTopDiv() {
    $('object').parent().parent().hide();
  }
  /* End of workaround */

  /* Click handler for tab panel */
  $('div.tabs ul li a').on('click', function(e) {
    e.preventDefault();

    $('div.tabs ul li.current').removeClass('current');
    $(this).parent().addClass('current');

    var indexOfClickedTab = $(this).parent().data('num');

    var currentTabBody = $('div.tabs div.tab-body > div.current');
    currentTabBody.removeClass('current');

    var newTabBody = $('div.tabs div.tab-body > div')[indexOfClickedTab];
    $(newTabBody).addClass('current');

    return false;
  });

  /* Click handler for text carousel */
  $('div.textCarousel div.panelControl a').on("click", function(e) {

    e.preventDefault();

    // Find currently displayed DIV; set FIRST and LAST divs so that the DIVs can be rotated
    var currentDiv = $('div.textCarousel div.carouselBody .current');
    var firstDiv = $('div.textCarousel div.carouselBody > div').first();
    var lastDiv = $('div.textCarousel div.carouselBody > div').last();

    // Similar to above section for panel index
    var currentIndex = $('div.textCarousel div.panelIndex .current');
    var firstIndex = $('div.textCarousel div.panelIndex > ul li').first();
    var lastIndex = $('div.textCarousel div.panelIndex > ul li').last();


    if ($(this).data("dir") === "right") {
      if (currentDiv.next().length === 1) {
        currentDiv.removeClass("current");
        currentIndex.removeClass("current");
        currentDiv.next().addClass("current");
        currentIndex.next().addClass("current");
      } else {
        currentDiv.removeClass("current");
        currentIndex.removeClass("current");
        firstDiv.addClass("current");
        firstIndex.addClass("current");
      }
    }

    if ($(this).data("dir") === "left") {
      if (currentDiv.prev().length === 1) {
        currentDiv.removeClass("current");
        currentIndex.removeClass("current");
        currentDiv.prev().addClass("current");
        currentIndex.prev().addClass("current");
      } else {
        currentDiv.removeClass("current");
        lastDiv.addClass("current");
        currentIndex.removeClass("current");
        lastIndex.addClass("current");
      }
    }

    return false;
  });

  /* Click handler for awards panel */
  $('div.awardsCarouselNav > ul li a').on("click", function(e) {
    e.preventDefault();
    $('div.awardsCarouselNav > ul li.current').removeClass('current');
    $(this).parent().addClass('current');

    var thumbNumber = $(this).data("num");
    var currentDiv = $('div.awardsCarousel div.awardsCarouselViewPort > div.current');
    currentDiv.removeClass("current");
    var newDiv = $('div.awardsCarousel div.awardsCarouselViewPort > div')[thumbNumber]
    $(newDiv).addClass("current");

    return false;
  });

  // gallery thumbnails click handler
  var $gallery = $('.gallery'),
    $thumbs = $('.thumbs li', $gallery),
    $mainImg = $('figure img', $gallery),
    selectedImage = 0,
    galleryImages = [];

  $gallery.on('click', '.thumbs li', function(e) {
    var $this = $(this);
    $thumbs.removeClass('selected');
    $this.addClass('selected');
    $mainImg.fadeOut(200, function() {
      $(this).attr('src', $this.find('img').attr('src').replace('-thumb.jpg', '.jpg')).fadeIn(800);
    });
    selectedImage = $thumbs.index($this);
  });

  // gallery prv/next click handler
  $gallery.on('click', '.prev .clicker', function(e) {
    if (selectedImage > 0) {
      $thumbs.eq(selectedImage - 1).click();
    } else {
      $thumbs.last().click();
    }
    e.stopPropagation();
  });

  $gallery.on('click', '.next .clicker', function(e) {
    if (selectedImage < $thumbs.length - 1) {
      $thumbs.eq(selectedImage + 1).click();
    } else {
      $thumbs.first().click();
    }
    e.stopPropagation();
  });

  // preload gallery images
  $thumbs.find('img').each(function(i){
    galleryImages[i] = new Image();
    galleryImages[i].src = $(this).attr('src').replace('-thumb', '');
  });

  // Fix for issue SG:218
  // var updateLayout = function() {
  //   if ( window.innerWidth != currentWidth) {
  //     currentWidth = window.innerWidth;
  //     var orient = (currentWidth == 320) ? "profile" : "landscape";
  //     document.body.setAttribute("orient", orient);
  //     window.scrollTo(0, 1);
  //   }
  // };

  // if (navigator.platform == "iPad") { // Check for platform before executing iPhone/iPad specific code
  //   iPhone.DomLoad(updateLayout);
  //   setInterval(updateLayout, 400);
  // }

});