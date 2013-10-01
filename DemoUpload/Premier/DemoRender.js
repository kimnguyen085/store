var express = require('express'),
fs=require('fs');

var app = express();

app.get('/', function(req, res){
  var body = 'Hello World';

  fs.readFile('index.html', function(err, page) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(page);
        res.end();
    }); 

  
});
app.use("/css", express.static(__dirname + '/css'));
app.use("/images", express.static(__dirname + '/images'));
app.use("/fonts", express.static(__dirname + '/fonts'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/html", express.static(__dirname + '/html'));
app.listen(8080)