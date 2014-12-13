(function() {
  'use strict';

  angular.module('akeelnazircomApp')
    .controller('knewsCtrl', knewsCtrl);

  knewsCtrl.$inject = ['gkImages'];

  function knewsCtrl (gkImages) {
    var vm = this;

    main();

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
      vm.imageNumber = (vm.imageNumber == 0) ? vm.imageNumber : vm.imageNumber - 1;
    }

    function nextImage() {
      vm.imageNumber = (vm.imageNumber == vm.images.length - 1) ? 0 : vm.imageNumber + 1;
    }


  }

})();