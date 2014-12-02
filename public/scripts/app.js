'use strict';

var myApp = angular.module('akeelnazircomApp', [
  'ngRoute'
]);

myApp.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html'
    })
    .when('/blog', {
      templateUrl: 'views/posts.html'
    })
    .when('/works', {
      templateUrl: 'views/works.html'
    })
    .otherwise({
      redirectTo: '/'
    });
});
