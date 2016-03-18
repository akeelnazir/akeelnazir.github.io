var 
  express = require('express'),
  http = require('http');


var app = express()
  .use(express.bodyParser())
  .use(express.static('public'));

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function () {
  console.log("Server ready at http://localhost:" + port);
});