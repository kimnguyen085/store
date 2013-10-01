var express = require('express'),
fs=require('fs');

var app = express();

app.get('/hello.txt', function(req, res){
  var body = 'Hello World';

  fs.readFile('index.html', function(err, page) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(page);
        res.end();
    }); 

  
});

app.listen(8080)