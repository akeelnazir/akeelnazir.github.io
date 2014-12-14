(function() {
  'use strict';

  
  function gkImages ($http, $q) {
    
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
    
    return {
      get: get
    };

  }
  
  gkImages.$inject = ['$http', '$q'];
  
  angular.module('akeelnazircomApp')
    .factory('gkImages', gkImages);

})();