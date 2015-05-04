'use strict';

var myApp = angular.module('akeelnazircomApp');

myApp.controller('MainCtrl', function ($scope) {
  $scope.state = {};
  $scope.state.fixed = true;
  $scope.state.slide = 0;

  $scope.incSlide = function() {
    var num = $scope.state.slide;
    if (num >= 3)
      num = 0;
    else
      num ++;
    $scope.state.slide = num;
  };

  $scope.decSlide = function() {
    var num = $scope.state.slide;
    if (num > 0)
      num --;
    else
      num = 3;
    $scope.state.slide = num;
  };

});

