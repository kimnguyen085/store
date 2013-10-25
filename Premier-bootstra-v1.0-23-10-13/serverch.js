#!/usr/bin/env node
/*
 * jQuery File Upload Plugin Node.js Example 2.1.0
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2012, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, regexp: true, unparam: true, stupid: true */
/*global require, __dirname, unescape, console */

(function (port) {
    'use strict';
    var path = require('path'),
        fs = require('fs'),
        // Since Node 0.8, .existsSync() moved from path to fs:
        _existsSync = fs.existsSync || path.existsSync,
        formidable = require('formidable'),
        nodeStatic = require('node-static'),
        imageMagick = require('imagemagick'),
        options = {
            tmpDir: __dirname + '/root',
            publicDir: __dirname + '/root',
            uploadDir: __dirname + '/root',
            uploadUrl: '/files/',
            maxPostSize: 11000000000, // 11 GB
            minFileSize: 1,
            maxFileSize: 10000000000, // 10 GB
            acceptFileTypes: /.+/i,
            // Files not matched by this regular expression force a download dialog,
            // to prevent executing any scripts in the context of the service domain:
            inlineFileTypes: /\.(gif|jpe?g|png)$/i,
            imageTypes: /\.(gif|jpe?g|png)$/i,
            imageVersions: {
                'thumbnail': {
                    width: 80,
                    height: 80
                }
            },
            accessControl: {
                allowOrigin: '*',
                allowMethods: 'OPTIONS, HEAD, GET, POST, PUT, DELETE',
                allowHeaders: 'Content-Type, Content-Range, Content-Disposition'
            },
            /* Uncomment and edit this section to provide the service via HTTPS:
            ssl: {
                key: fs.readFileSync('/Applications/XAMPP/etc/ssl.key/server.key'),
                cert: fs.readFileSync('/Applications/XAMPP/etc/ssl.crt/server.crt')
            },
            */
            nodeStatic: {
                cache: 3600 // seconds to cache served files
            }
        },
        utf8encode = function (str) {
            return unescape(encodeURIComponent(str));
        },
        fileServer = new nodeStatic.Server(options.publicDir, options.nodeStatic),
        nameCountRegexp = /(?:(?: \(([\d]+)\))?(\.[^.]+))?$/,
        nameCountFunc = function (s, index, ext) {
            return ' (' + ((parseInt(index, 10) || 0) + 1) + ')' + (ext || '');
        },
        FileInfo = function (file) {
            this.name = file.name;
            this.size = file.size;
            this.type = file.type;
            this.deleteType = 'DELETE';
        },
        UploadHandler = function (req, res, callback) {
            this.req = req;
            this.res = res;
            this.callback = callback;
        },
        
        serve = function (req, res) {
        	

            res.setHeader(
            		
                'Access-Control-Allow-Origin',
                options.accessControl.allowOrigin
            );
            res.setHeader(

                'Access-Control-Allow-Methods',
                options.accessControl.allowMethods
            );
            res.setHeader(
            		
                'Access-Control-Allow-Headers',
                options.accessControl.allowHeaders
            );                         
            
            var handleResult = function (result, redirect,err) {			
                    if (redirect) {
                        res.writeHead(302, {
                            'Location': redirect.replace(
                                /%s/,
                                encodeURIComponent(JSON.stringify(result))
                            )
                        });
                        res.end();
                    } else if(err){						
						res.status(500).send(err);
					}else if(err===null){						
                        res.writeHead(200, {
                            'Content-Type': req.headers.accept
                                .indexOf('application/json') !== -1 ?
                                        'application/json' : 'text/plain'
                        });
                        res.end(JSON.stringify(result));
                    }
                },
                setNoCacheHeaders = function () {
                    res.setHeader('Pragma', 'no-cache');
                    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
                    res.setHeader('Content-Disposition', 'inline; filename="files.json"');
                },                
                	
                handler = new UploadHandler(req, res, handleResult);
            switch (req.method) {
            case 'OPTIONS':
            	
                res.end();
                break;
            case 'HEAD':
            case 'GET':
            	console.log('get' + req.url);
                if (req.url === '/') {
                	
                    setNoCacheHeaders();
                    if (req.method === 'GET') {
                    	
                        handler.get();
                    } else {
                    	
                        res.end();
                    }
                } else{
                	
                    fileServer.serve(req, res);
                	
                }
                break;
            case 'POST':
            	
                setNoCacheHeaders();
                handler.post();
                break;
            case 'DELETE':
            	
                handler.destroy();
                break;
            default:
            	
                res.statusCode = 405;
                res.end();
            }
        };
    fileServer.respond = function (pathname, status, _headers, files, stat, req, res, finish) {
        // Prevent browsers from MIME-sniffing the content-type:
        _headers['X-Content-Type-Options'] = 'nosniff';
        if (!options.inlineFileTypes.test(files[0])) {
            // Force a download dialog for unsafe file extensions:
            _headers['Content-Type'] = 'application/octet-stream';
            _headers['Content-Disposition'] = 'attachment; filename="' +
                utf8encode(path.basename(files[0])) + '"';
        }
        nodeStatic.Server.prototype.respond
            .call(this, pathname, status, _headers, files, stat, req, res, finish);
    };
    FileInfo.prototype.validate = function () {			
        if (options.minFileSize && options.minFileSize > this.size) {			
            this.error = 'File is too small';
        } else if (options.maxFileSize && options.maxFileSize < this.size) {
            this.error = 'File is too big';
        } else if (!options.acceptFileTypes.test(this.name)) {
            this.error = 'Filetype not allowed';
        }
        return !this.error;
    };
    FileInfo.prototype.safeName = function (callback) {				
        // Prevent directory traversal and creating hidden system files:
        this.name = path.basename(this.name).replace(/^\.+/, '');
        // Prevent overwriting existing files:		
        // while (_existsSync(options.uploadDir + '/' + this.name)) {			
            // this.name = this.name.replace(nameCountRegexp, nameCountFunc);
        // }
		
		//Throw error if file is existed
		var fileInfo=this;
		fs.exists(options.uploadDir + '/' + this.name,function(err){
			
			fileInfo.error='File is existed';
			callback(fileInfo.error);
		}); 
			
		
    };
    FileInfo.prototype.initUrls = function (req) {
        if (!this.error) {
            var that = this,
                baseUrl = (options.ssl ? 'https:' : 'http:') +
                    '//' + req.headers.host + options.uploadUrl;
            this.url = this.deleteUrl = baseUrl + encodeURIComponent(this.name);
            Object.keys(options.imageVersions).forEach(function (version) {
                if (_existsSync(
                        options.uploadDir + '/' + version + '/' + that.name
                    )) {
                    that[version + 'Url'] = baseUrl + version + '/' +
                        encodeURIComponent(that.name);
                }
            });
        }
    };
    UploadHandler.prototype.get = function () {
        var handler = this,
            files = [];
        fs.readdir(options.uploadDir, function (err, list) {
            list.forEach(function (name) {
                var stats = fs.statSync(options.uploadDir + '/' + name),
                    fileInfo;
                if (stats.isFile() && name[0] !== '.') {
                    fileInfo = new FileInfo({
                        name: name,
                        size: stats.size
                    });
                    fileInfo.initUrls(handler.req);
                    files.push(fileInfo);
                }
            });
            handler.callback({files: files});
        });
    };
    UploadHandler.prototype.post = function () {
        var handler = this,
			error=null,
            form = new formidable.IncomingForm(),
            tmpFiles = [],
            files = [],
            map = {},
            counter = 1,
            redirect,
            finish = function () {
                counter -= 1;
                if (!counter) {
                    files.forEach(function (fileInfo) {
                        fileInfo.initUrls(handler.req);
                    });										
                    handler.callback({files: files}, redirect,error);					
                }
            };
            
        form.uploadDir = options.tmpDir;
        form.on('fileBegin', function (name, file) {			
            tmpFiles.push(file.path);
            var fileInfo = new FileInfo(file, handler.req, true);							
			
			fs.readdir(options.uploadDir, function(err, list) {		
			if(err) throw err;  
			 
			// list.forEach(function(file) {			 
				// fs.stat(options.uploadDir+'/'+file, function(err, stat) {
					// if(!stat.isDirectory()){
						// if(fileInfo.name===file){
							// console.log('existed'+'      '+fileInfo.name+'      '+file);
						// }
						
					// }	
				// });
			// });
			
			});
			
            fileInfo.safeName(function(err){
				if(err){
					error=err;					
					//fs.unlink(file.path);
				}
			});
            map[path.basename(file.path)] = fileInfo;
			files.push(fileInfo);

        }).on('field', function (name, value) {
        	console.log('Start of field '+name+':'+value);
            if (name === 'redirect') {
                redirect = value;
            }            
        }).on('file', function (name, file) {					
            var fileInfo = map[path.basename(file.path)];
            fileInfo.size = file.size;
            if (!fileInfo.validate()) {
            	console.log('Invalid file');
				console.log(fileInfo.error);
                fs.unlink(file.path);	
				error=fileInfo.error;
                return;
            }            
            //console.log(file.path+' '+options.uploadDir+' '+fileInfo.name);
            fs.renameSync(file.path, options.uploadDir + '/' + fileInfo.name);
            if (options.imageTypes.test(fileInfo.name)) {
            	console.log('Inside image Type');
                Object.keys(options.imageVersions).forEach(function (version) {
                    counter += 1;
                    var opts = options.imageVersions[version];
                    imageMagick.resize({
                        width: opts.width,
                        height: opts.height,
                        srcPath: options.uploadDir + '/' + fileInfo.name,
                        dstPath: options.uploadDir + '/' + version + '/' +
                            fileInfo.name
                    }, finish);
                });
            }            
        }).on('aborted', function () {
            tmpFiles.forEach(function (file) {
                fs.unlink(file);
            });
        }).on('error', function (e) {
            console.log(e);
        }).on('progress', function (bytesReceived, bytesExpected) {
            if (bytesReceived > options.maxPostSize) {
                handler.req.connection.destroy();
            }
        }).on('end', finish).parse(handler.req);
    };
    UploadHandler.prototype.destroy = function () {
        var handler = this,
            fileName;
        if (handler.req.url.slice(0, options.uploadUrl.length) === options.uploadUrl) {
            fileName = path.basename(decodeURIComponent(handler.req.url));
            if (fileName[0] !== '.') {
                fs.unlink(options.uploadDir + '/' + fileName, function (ex) {
                    Object.keys(options.imageVersions).forEach(function (version) {
                        fs.unlink(options.uploadDir + '/' + version + '/' + fileName);
                    });
                    
                    handler.callback({success: !ex});
                });
                return;
            }
        }
        handler.callback({success: false});
    };
    
    var express = require('express'),
    async=require('async'),
    app=express();
    
    app.get('/', serve);
    
    app.get('/index', function(req, res){    	 

    	  fs.readFile('indexBackup.html', function(err, page) {
    	        res.writeHead(200, {'Content-Type': 'text/html'});
    	        res.write(page);
    	        res.end();
    	    }); 

    	  
    	});
    var url=require('url');
	app.get('/download', function(req, res){
		var url_parts = url.parse(req.url,true);
		var path=url_parts.query.path;
		console.log(path);
		if(path!==''){		
		var file = __dirname + '/'+path;
		res.download(file,function(err){
			if(err)
			res.status(404).send("File Not Found");
		}); // Set disposition and send it.
		}else{
			res.status(404).send("File Not Found");
		}
	});

	var moment= require('moment');	
	var walk = function(dir, done) {
	var results = [];
	fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
		var a=file.substring(__dirname.length+1,file.length-path.basename(file).length);
			
		  //var temp='\"[{\"filename\":\"'+path.basename(file)+'\",\"directory\":\"'+a+'\",\"size\":\"'+stat.size+'\"}]\"';
          //results.push(file);
		  //console.log(stat.mtime);
		  var timetmp=moment(stat.mtime).format("YYYY-MM-DD, hh:mm:ss a");
		  var temp='[{"filename":"'+path.basename(file)+'","directory":"'+a+'","size":"'+stat.size+'","mtime":"'+timetmp+'"}]';
		  results.push(temp);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

	app.post('/getInfo', function(req, res){
	var path=options.uploadDir;   
		walk(path, function(err, results) {
			if (err) throw err;
			//console.log(results);
			res.writeHead(200, {'Content-Type': 'application/json'});			
			// console.log(results);
    		res.end(JSON.stringify(results));
		});
	});
	
	var directorywalk=function(dir,callback){
	
	var results = [];
	fs.readdir(dir, function(err, list) {	
	
	if(err) return callback(err);  
	var pending = list.length;
    if(pending===0) {
		return callback(null,results);
	}    
    list.forEach(function(file) {
      file = dir + '/' + file;
		fs.stat(file, function(err, stat) {			
			if(stat.isDirectory()){							
				results.push(file.substring(__dirname.length+1,file.length));
				directorywalk(file,function(er,rs){
					results = results.concat(rs);
					if (!--pending) callback(null, results);
				});

			}else{
				if (!--pending) callback(null, results);
			}
		});
	});
	})
};

	app.post('/getDir', function(req, res){
	var path=options.uploadDir;   
		directorywalk(path, function(err, results) {
			if (err) throw err;			
			res.writeHead(200, {'Content-Type': 'application/json'});			
			// console.log(results);
    		res.end(JSON.stringify(results));
		});
	});
	
	app.post('/adddir', function(req, res){
	var form=require('formidable');
	form = new formidable.IncomingForm();
	form.on('field', function (name, value) {
        if(name==='dir') 
		{
			fs.mkdir(__dirname+'/'+value,function(e){
			if(!e){
				//do something with contents
				res.writeHead(200, {'Content-Type': 'application/json'});						
				res.end('{\"success\":\"true\"}');
			}else if(e.code === 'EEXIST'){
				res.status(500).send('Dir name: \"'+value+'\" has already existed !');
			
			} else {
				//debug
			res.status(500).send('Cannot create dir name: \"'+value+'\"');
			console.log('error   '+e);
			}
			});
		}
    }).parse(req);
	
	});
	
	app.post('/deldir', function(req, res){
	var form=require('formidable');
	form = new formidable.IncomingForm();
	form.on('field', function (name, value) {
        if(name==='dir') 
		{
			fs.rmdir(__dirname+'/'+value,function(e){
			if(!e){
				//do something with contents
				res.writeHead(200, {'Content-Type': 'application/json'});						
				res.end('{\"success\":\"true\"}');
			}else if(e.code === 'ENOTEMPTY'){
				res.status(500).send('Dir name:\"'+value+'\" is not empty !');				
			} else {
				//debug
			res.status(500).send('Cannot delete dir name:\"'+value+'\"');
			console.log('error   '+e);
			}
			});
		}
    }).parse(req);
	
	});
	
	app.post('/delfile', function(req, res){
	var form=require('formidable');
	form = new formidable.IncomingForm();
	form.on('field', function (name, value) {
        if(name==='file') 
		{
			fs.unlink(value, function (err) {
			  if(!err){
			    res.writeHead(200, {'Content-Type': 'application/json'});						
				res.end('{\"success\":\"true\"}');
			  }else if(e.code === 'ENOTEMPTY'){
				res.status(500).send('File name:\"'+value+'\" is not empty !');				
			  }else {
				//debug
			    res.status(500).send('Cannot delete file name:\"'+value+'\"');
				console.log('error   '+e);
			  }
			});
			
	
		}
    }).parse(req);
	
	});
	
	app.post('/copyfile', function(req, res){
	var form=require('formidable');
	form = new formidable.IncomingForm();
	var srcpath=null,despath=null;
	form.on('field', function (name, value) {		
        if(name==='srcpath') 
		{
			srcpath=value;	
			
		}
		
		if(name==='despath')
		{
			despath=value;			
			
		}
			
		if(srcpath!==null && despath!==null){						
			if(fs.existsSync(__dirname+'/'+despath)){
				res.status(500).send('"'+despath+'\" is already existed !');					
			}
			else{
				//fs.createReadStream(srcpath).pipe(fs.createWriteStream(despath));
				fs.readFile(srcpath,function(err,data){
					if(!err){
						fs.writeFile(despath, data,function(err){
							if(!err){
								res.writeHead(200, {'Content-Type': 'application/json'});						
								res.end('{\"success\":\"true\"}');
							}else if(err.code==='ENOENT'){
								res.status(500).send("No such file or directory :\""+despath+"\"");
							}
						});												
					}else{
						res.status(500).send(err);
					}
				});
				
			}
		}
    }).parse(req);
	
	});
	
	app.post('/movefile', function(req, res){
	var form=require('formidable');
	form = new formidable.IncomingForm();
	var srcpath=null,despath=null;
	form.on('field', function (name, value) {		
        if(name==='srcpath') 
		{
			srcpath=value;	
			
		}
		
		if(name==='despath')
		{
			despath=value;			
			
		}
			
		if(srcpath!==null && despath!==null){						
			if(fs.existsSync(__dirname+'/'+despath)){
				res.status(500).send('"'+despath+'\" is already existed !');					
			}
			else{
			fs.rename(srcpath, despath, function(err) {
				if (!err){				
					if(srcpath!==despath){
						fs.unlink(srcpath, function() {
							if (err) console.log(err);
							console.log("removed ");						
						});
					}
					console.log(srcpath+'  --------------> '+despath);
					res.writeHead(200, {'Content-Type': 'application/json'});						
					res.end('{\"success\":\"true\"}');
				}else{
					res.status(500).send('Cannot move file from:\"'+srcpath+'\" to \"'+despath+'\"');					
				}
			});
			}
		}
    }).parse(req);
	
	});
	
    app.post('/check', function(req, res){
    	var path=options.uploadDir;    
		
		
		
//    	 var i, totalSizeBytes=0;
//    	fs.readdir(path, function(err, files) {
//    	 
//    	  if (err) console.log(err+'---------------');    	  
//    	  for (i=0; i<files.length; i++) {    		  
//    	    fs.stat(path+files[i], function(err, stats) {
//    	      if (err) console.log(err+'+++++++++++++++');
//    	      if (stats.isFile()) {
//    	    	  totalSizeBytes += stats.size;
//    	    	  
//    	    	  if(files[i]===files[files.length-1]){    	    		  
//    	    	    	console.log(i+'  '+files.length);
//    	    	    	res.writeHead(200, {'Content-Type': 'text/html'});    	        
//    	    	        res.end('Total '+totalSizeBytes);
//    	    	 }
//    	      }
//    	    });
//    	    
//    	    
//    	    
//    	  }
//    	});
    	
    	readSizeRecursive(path,function(err,totals){
    		if(err) console.log(err);
//    		var response="[{\"success\":\"true\"},{\"Datasize\":"+totals+"}]";
    		res.writeHead(200, {'Content-Type': 'text/html'});
			var available=10000000;
    		res.end(available-totals+'');			
    	});
  	});
    
    var async=require('async');
    function readSizeRecursive(item, cb) {
    	  fs.lstat(item, function(err, stats) {
			
    	    var total = stats.size;

    	    if (!err && stats.isDirectory()) {
    	      fs.readdir(item, function(err, list) {
    	        async.forEach(
    	          list,
    	          function(diritem, callback) {
    	            readSizeRecursive(path.join(item, diritem), function(err, size) {
    	              total += size;
    	              callback(err);
    	            }); 
    	          },  
    	          function(err) {
    	            cb(err, total);
    	          }   
    	        );  
    	      }); 
    	    }   
    	    else {
    	      cb(err, total);
    	    }   
    	  }); 
    	}  
    
    app.post('/test', function(req, res){    	 

  	  		
//  	        res.writeHead(404, {'Content-Type': 'application/json'});
//  	        var js="[{\"error\":\"No need\"}]";      	      	
//  	      	res.end(js);
    	
  	   res.status(404).send('CANNOT BE FOUND');
    		
  	});
    
    app.post('/',serve);
    
    app.use("/css", express.static(__dirname + '/css'));
    app.use("/images", express.static(__dirname + '/images'));
    app.use("/fonts", express.static(__dirname + '/fonts'));
    app.use("/js", express.static(__dirname + '/js'));
    app.use("/image", express.static(__dirname + '/image'));

    	app.listen(port);
    	
//    if (options.ssl) {
//        require('https').createServer(options.ssl, serve).listen(port);
//    } else {
//        require('http').createServer(serve).listen(port);
  
console.log('Server running at http://127.0.0.1:'+ port);  
//}
}(8888));