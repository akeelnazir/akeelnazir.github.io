(function() {
  'use strict';

  angular.module('akeelnazircomApp')
    .controller('knewsCtrl', knewsCtrl);

  knewsCtrl.$inject = ['gkImages'];

  function knewsCtrl (gkImages) {
    var vm = this;

    vm.images = gkImages.get()
      .then (function(data) {
        vm.images = data;
      }, function(errors) {
        console.log (errors);
      });

  }

})();