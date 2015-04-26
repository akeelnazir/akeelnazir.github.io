(function() {
  'use strict';

  function knewsCtrl (gkImages, gkHeadlines, gkStory) {
    var vm = this;

    /* Variables */
    vm.imageNumber = 0;

    /* Functions */
    vm.prevImage = prevImage;
    vm.nextImage = nextImage;

    main();
    
    function main() {
      gkImages.get()
        .then (function(data) {
          vm.images = data;
        },
        function(errors) {
          errors = null;
        });

      gkHeadlines.get()
        .then (function(data) {
          vm.headlines = [];

          angular.forEach(data, function(headline) {
            headline.storyLink = 'http://www.greaterkashmir.com'+ headline.link;

            gkStory.post({ 'storyLink' : headline.storyLink })
              .then(function(data) {
                headline.story = data;
                vm.headlines.push(headline);
              });

          });

        },
        function(errors) {
          errors = null;
        });
    }

    function prevImage() {
      vm.imageNumber = (vm.imageNumber === 0) ? 0 : vm.imageNumber - 1;
    }

    function nextImage() {
      vm.imageNumber = (vm.imageNumber === vm.images.length - 1) ? 0 : vm.imageNumber + 1;
    }

  }
  
  knewsCtrl.$inject = ['gkImages', 'gkHeadlines', 'gkStory'];
  
  angular.module('akeelnazircomApp')
    .controller('knewsCtrl', knewsCtrl);

})();