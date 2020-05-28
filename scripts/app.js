'use strict';

var myApp = angular.module('akeelnazircomApp', [
  'ngRoute', 'ngSanitize',

  'mgcrea.ngStrap.collapse'

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

myApp.run(function() {
  var s = Snap('#logo'),
      g = s.g(),
      door = s.g(),
      bigCircle = s.circle(60, 60, 50);

  g.add(bigCircle, door);

  bigCircle.attr({
    fill: "#bada55"
  });

  var line1 = s.line(45, 61, 52, 61);
  line1.attr({
    stroke: 'black'
  });

  var line2 = s.line(45, 65, 50, 40);
  line2.attr({
    stroke: 'black'
  });

  var line31 = s.line(50, 40, 60, 60);
  line31.attr({
    stroke: 'black'
  });

  var line32 = s.line(60, 60, 70, 80);
  line32.attr({
    stroke: 'black'
  });

  var line4 = s.line(70, 80, 75, 60);
  line4.attr({
    stroke: 'black'
  });

  var line5 = s.line(75, 61, 82, 61);
  line5.attr({
    stroke: 'black'
  });

  g.add(line1, line2, line31, line32, line4, line5);

  g.hover(onHoverIn, onHoverOut);

  function onHoverIn () {

    //s.line(45, 61, 52, 61);
    line1.animate({
      x1: '46',
      y1: '74',
      x2: '55',
      y2: '74'
    }, 1000, mina.elastic);

    //s.line(45, 65, 50, 40);
    line2.animate({
      x2: '45',
      y1: '75',
      y2: '50'
    }, 1000, mina.elastic);

    //s.line(50, 40, 60, 60);
    line31.animate({
      x1: '42',
      y1: '51',
      y2: '40'
    }, 1000, mina.elastic);

    //s.line(60, 60, 70, 80);
    line32.animate({
      y1: '40',
      y2: '51',
      x2: '78'
    }, 1000, mina.elastic);

    //s.line(70, 80, 75, 60)
    line4.animate({
      x1: '75',
      y1: '75',
      y2: '50'
    }, 1000, mina.elastic);

    //s.line(74, 61, 81, 61);
    line5.animate({
      x1: '65',
      x2: '74',
      y1: '74',
      y2: '74'
    }, 1000, mina.elastic);

    door.add(
        s.line(64, 62, 64, 75).attr({
          stroke: 'black'
        }),
        s.line(56, 62, 56, 75).attr({
          stroke: 'black'
        }),
        s.line(56, 62, 64, 62).attr({
          stroke: 'black'
        })
    );

  }

  function onHoverOut() {

    line1.animate({
      x1: '52',
      y1: '61',
      x2: '45',
      y2: '61',
    }, 1000, mina.elastic);

    //s.line(45, 65, 50, 40);
    line2.animate({
      x2: '50',
      y1: '65',
      y2: '40'
    }, 1000, mina.elastic);

    //s.line(50, 40, 60, 60);
    line31.animate({
      x1: '50',
      y1: '40',
      x2: '60',
      y2: '60'
    }, 1000, mina.elastic);

    //s.line(60, 60, 70, 80);
    line32.animate({
      x1: '60',
      y1: '60',
      x2: '70',
      y2: '80'
    }, 1000, mina.elastic);

    //s.line(70, 80, 75, 60)
    line4.animate({
      x1: '70',
      y1: '80',
      y2: '60'
    }, 1000, mina.elastic);

    //s.line(74, 61, 81, 61);
    line5.animate({
      x1: '74',
      x2: '81',
      y1: '61',
      y2: '61'
    }, 1000, mina.elastic);

    door.clear();

  }

});
