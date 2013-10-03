/*
 * jQuery File Upload Plugin JS Example 8.8.2
 * https://github.com/blueimp/jQuery-File-Upload
 *
 * Copyright 2010, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */

/*jslint nomen: true, regexp: true */
/*global $, window, blueimp */

$(function () {
    'use strict';

    $('#fileupload').fileupload({
  	  dataType:"json",	  
  	  
  	  done:function(e,data){
  		  alert('done');
  		  
  	  },
  	  
  	  progressall: function (e, data) {
  	        var progress = parseInt(data.loaded / data.total * 100, 10);
  	        $('body').append('<p>'+progress+'% '+ parseInt(data.bitrate/1024,10) +'Kb</p>');
  	    },
  	    
  	  add: function(e,data){
  		  $('body').append('<p id="up">Uploading ... </p>');
  		  data.submit();
  		  
  	  }

});
