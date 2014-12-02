$(document).ready(function(){
	var $window = $(window),
	windowHeight = $window.height(),
	$nav = $('#navwrapper'),
	$canvas = $('#canvas'),
	headerHeight = $('#carsHeader').height(),
	$subnav = $nav.find('ul#subnav'),
	navHeight = $nav.height(),
	navTop = $nav.offset().top,
	firstSection = $('#main > section:first').attr('id'),
	sectionInView = firstSection,
	oldSectionInView = firstSection,
	scrollPage = $('body.scrollPage').length > 0;

	if( scrollPage ) {

		$subnav.find('[href=#' + sectionInView + ']').parent().addClass('selected');

		$subnav.find('a').on('click', function(e){
			e.preventDefault();

			var sectionId 	= $(this).attr('href'),
				scrollPos 		= (sectionId == ('#' + firstSection)) ? navTop + 1  : $(sectionId).offset().top - navTop + 1;
				// scrollPos = $(sectionId).offset().top - navHeight + 1;

			var scrollTop 		= $window.scrollTop(),
				scrollDuration 	= Math.max(400, 0.5 * Math.abs( scrollPos - scrollTop ));

			$('html, body').animate({ scrollTop: parseInt(scrollPos) }, scrollDuration, 'swing');

		});
	}

	$.extend($.expr[':'], {
		'inViewport': function(e){
			var windowScrollTop = $window.scrollTop(),
				$e = $(e),
				eOffsetTop = $e.offset().top;
			return (windowHeight + windowScrollTop > eOffsetTop) && (windowScrollTop < eOffsetTop + $e.height() - (windowHeight / 3));
		}
	});

	function checkScroll() {
		if ($window.scrollTop() < navTop) {
			sectionInView = firstSection;
			$nav.removeClass('fixed');
			$nav.next().css('margin-top', '0');
			$canvas.css('background-position', 'center ' + navHeight + 'px');
		} else {
			sectionInView = $('#main section:inViewport:first').attr('id');
			$nav.addClass('fixed');
			$nav.next().css('margin-top', navHeight);
			$canvas.css('background-position', 'center 0px');
		}

		if (scrollPage && sectionInView !== oldSectionInView) {
			$subnav.find('li').removeClass('selected').find('[href=#' + sectionInView + ']').parent().addClass('selected');
			oldSectionInView = sectionInView;
		}
	}

	checkScroll();
	$window.on('scroll', checkScroll);
});