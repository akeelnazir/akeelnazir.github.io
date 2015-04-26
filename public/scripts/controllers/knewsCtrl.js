(function() {
  'use strict';

  function knewsCtrl (gkImages, gkStories) {
    var vm = this;

    /* Variables */
    vm.imageNumber = 0;

    /* Functions */
    vm.prevImage = prevImage;
    vm.nextImage = nextImage;

    main();
    
    function main() {
      vm.images = gkImages.get()
        .then (function(data) {
          vm.images = data;
        },
        function(errors) {
          errors = null;
        });

      vm.stories = gkStories.get()
        .then (function(data) {
          vm.stories = data;
          console.log (data);
        },
        function(errors) {
          console.log (errors);
        });
    }

    function prevImage() {
      vm.imageNumber = (vm.imageNumber === 0) ? 0 : vm.imageNumber - 1;
    }

    function nextImage() {
      vm.imageNumber = (vm.imageNumber === vm.images.length - 1) ? 0 : vm.imageNumber + 1;
    }

  }
  
  knewsCtrl.$inject = ['gkImages', 'gkStories'];
  
  angular.module('akeelnazircomApp')
    .controller('knewsCtrl', knewsCtrl);

})();