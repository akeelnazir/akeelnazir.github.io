(function () {
  'use strict';

  function gkStories ($http, $q) {

    function get () {

      var deferred = $q.defer ();

      $http.get ( '/api/stories', {cache : true} )
        .success ( function (data) {
          deferred.resolve ( data );
        } )
        .error ( function (errors) {
          deferred.reject ( errors );
        } );

      return deferred.promise;
    }

    return {
      get : get
    };
  }

  gkStories.$inject = ['$http', '$q'];

  angular.module ( 'akeelnazircomApp' )
    .factory ( 'gkStories', gkStories );

}) ();