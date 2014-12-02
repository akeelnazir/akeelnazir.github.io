'use strict';

var myApp = angular.module('akeelnazircomApp');

myApp.directive('nuScrollFix', ['$window', '$document', function($window, $document){
  function link(scope, element, attrs, ctrl) {
    var windowOffsetWhenAffixed;
    
    angular.element($document).bind('scroll', function() {
      if(element[0].getBoundingClientRect().top <= 0 && !windowOffsetWhenAffixed) {
        if(!windowOffsetWhenAffixed)
          windowOffsetWhenAffixed = $window.pageYOffset;
        angular.element(element).addClass('header-fixed');
        angular.element(element).next().css('padding-top', element[0].getBoundingClientRect().bottom + 'px');
      } else if($window.pageYOffset < windowOffsetWhenAffixed) {
        angular.element(element).removeClass('header-fixed');
        angular.element(element).next().css('padding-top', '0');
        windowOffsetWhenAffixed = undefined;
      }

    });
  }

  return {
    restrict: 'A',
    link: link
  };
  
}]);

myApp.directive('nuMouseLeave', function() {
  function link(scope, element, attrs, ctrl) {
    angular.element(element).on('mouseleave', function(event) {
      
    });
  }

  return {
    restrict: 'A',
    link: link
  };
});