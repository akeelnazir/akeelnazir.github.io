(function() {
  'use strict';

  var   Promise   = require('promise'), 
        env       = require('jsdom').env;

  module.exports = function ScrapeImages (url) {

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
          var images = [];

          $('#featured div.ui-tabs-panel')
            .each (function(index, value) {
              var $value = $(value);
              images.push (
                {
                  'caption': $value.find('.info h2 a').text(),
                  'description': $value.find('.info p').text(),
                  'imgSrc': url + $value.find('img').attr('src')
                }
              );
            });

          if (images.length === 0) {
            reject('No images found');
          } else {
            resolve (images);  
          }
          
        }

      });
    }

  };
})();
