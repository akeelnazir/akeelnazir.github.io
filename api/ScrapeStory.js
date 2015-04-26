(function() {
  'use strict';

  var Promise     = require('promise' ),
      env         = require('jsdom' ).env;

  module.exports = function ScrapeStory (url) {

    return new Promise (resolver);

    function resolver (resolve, reject) {

      env(url, function (errors, window) {

        if (errors) {
          reject (errors);
        } else {
          var $ = require ('jquery')(window);
          var story = '';

          $('#textcontent p')
            .each(function(index, value) {
              var $value = $(value);
              story = $value.text();
            });

          if (story.length === 0) {
            reject ('No text returned for ', url);
          } else {
            resolve (story);
          }
        }
      });
    }

  };

})();