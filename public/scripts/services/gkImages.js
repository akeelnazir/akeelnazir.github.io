(function() {
  'use strict';

  angular.module('akeelnazircomApp')
    .factory('gkImages', gkImages);

  gkImages.$inject = ['$http', '$q'];

  function gkImages ($http, $q) {
    var service = {
      get: get
    }

    return service;

    function get() {

      var deferred = $q.defer();

      $http.get('/api/images')
        .success (function (data) {
          deferred.resolve (data);
        })
        .error (function (errors) {
          deferred.reject (errors);
        });

      return deferred.promise;
    }
  }

})();