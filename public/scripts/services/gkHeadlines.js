(function () {
  'use strict';

  function gkHeadlines ($http, $q) {

    function get () {

      var deferred = $q.defer ();

      $http.get ( '/api/headlines', {cache : true} )
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

  gkHeadlines.$inject = ['$http', '$q'];

  angular.module ( 'akeelnazircomApp' )
    .factory ( 'gkHeadlines', gkHeadlines );

}) ();