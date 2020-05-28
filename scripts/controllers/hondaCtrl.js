'use strict';

var myApp = angular.module('akeelnazircomApp');

myApp.controller('HondaCtrl', function($scope) {
  
  $scope.show_menu = true;

});

myApp.controller('TabsCtrl', function($scope) {
  $scope.tab = 0;

  $scope.setTab = function(num) {
    $scope.tab = num;
  };

  $scope.incTab = function() {
    var num = $scope.tab;
    if (num >= 4)
      num = 0;
    else
      num ++;
    $scope.tab = num;
  };

  $scope.decTab = function() {
    var num = $scope.tab;
    if (num > 0)
      num --;
    else
      num = 4;
    $scope.tab = num;
  };

});

myApp.controller('GalleryCtrl', function($scope) {
  $scope.image = 1;

  $scope.setImage = function(num) {
    $scope.image = num;
  };

  $scope.nextImage = function() {
    var num = $scope.image;
    if (num >= 13)
      num = 1;
    else
      num ++;
    $scope.image = num;
  };

  $scope.prevImage = function() {
    var num = $scope.image;
    if (num > 1)
      num --;
    else
      num = 13;
    $scope.image = num;
  };

});