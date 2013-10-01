var     lazy    = require("lazy"),
        fs  = require("fs");

 new lazy(fs.createReadStream(__dirname+'/demo.csv'))
     .lines
     .forEach(function(line){
         console.log(line.toString());
     }
 );