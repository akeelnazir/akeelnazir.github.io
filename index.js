var 
  express = require('express'),
  http = require('http'),
  scrapeImages = require('./api/ScrapeImages');

var app = express()
  .use(express.bodyParser())
  .use(express.static('public'));

app.get('/api/images', function(req, res) {
  scrapeImages ('http://www.greaterkashmir.com')
    .then(function(data) {
      res.send (data);
    }, function(error) {
      res.send (error);
    });
});

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function () {
  console.log("Server ready at http://localhost:" + port);
});