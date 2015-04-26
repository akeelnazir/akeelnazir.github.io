(function() {
  'use strict';


  function gkStory ($http, $q) {

    function post(data) {

      var deferred = $q.defer();

      $http.post('/api/story', data, { cache: true })
        .success (function (data) {
          deferred.resolve (data);
        })
        .error (function (errors) {
          deferred.reject (errors);
        });

      return deferred.promise;
    }

    return {
      post: post
    };

  }

  gkStory.$inject = ['$http', '$q'];

  angular.module('akeelnazircomApp')
    .factory('gkStory', gkStory);

})();