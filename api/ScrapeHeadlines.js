(function() {
  'use strict';
  
  var Promise     = require('promise'),
      env         = require('jsdom').env;
  
  module.exports = function ScrapeHeadlines (url) {
    
    return new Promise (resolver); 

    function resolver (resolve, reject) {

      /* first argument can be html string, 
        filename, or url -> 'http://www.greaterkashmir.com'
      **/
      env(url, function (errors, window) {

        if (errors) {
          
          reject(errors);

        } else {

          var $ = require ('jquery')(window);
          var stories = [];
          
          $('#top-left-col .col-bg h1, #top-left-col .col-bg h2')
            .each (function(index, value) {
              var $value = $(value);
              stories.push (
                {
                  'headline': $value.find('a').text(),
                  'link': $value.find('a').attr('href')
                }
              );
            });

          if (stories.length === 0) {
            reject('No stories found');
          } else {
            resolve (stories);  
          }
          
        }

      });
    }
    
  };
  
})();