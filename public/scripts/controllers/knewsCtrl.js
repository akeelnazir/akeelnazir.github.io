(function() {
  'use strict';

  function knewsCtrl (gkImages) {
    var vm = this;

    /* Variables */
    vm.imageNumber = 0;

    /* Functions */
    vm.prevImage = prevImage;
    vm.nextImage = nextImage;
    
    function main() {
      vm.images = gkImages.get()
        .then (function(data) {
        vm.images = data;
      }, function(errors) {
        errors = null;
      });
    }

    function prevImage() {
      vm.imageNumber = (vm.imageNumber === 0) ? 0 : vm.imageNumber - 1;
    }

    function nextImage() {
      vm.imageNumber = (vm.imageNumber === vm.images.length - 1) ? 0 : vm.imageNumber + 1;
    }
    
    main();

  }
  
  knewsCtrl.$inject = ['gkImages'];
  
  angular.module('akeelnazircomApp')
    .controller('knewsCtrl', knewsCtrl);

})();