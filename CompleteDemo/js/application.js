
var started=0;
var startpos=0;

$("#nxt").click(function(){		
	var ss={};
	startpos+=5;
	ss['start']=startpos;				
	$.ajax({			
	    url: "http://localhost:8888/view",	
	    dataType: 'json',	   
	    data: ss,
	    method:"POST",
	    cache: false,
	    timeout: 3000,	
	    success: function(data) {		    	
	    	var tmphtml="";
	    	for(var i=0;i<data.length;i++){
	    		tmp=jQuery.parseJSON(data[i]);	    
	    		tmphtml+='<tr class=\"row bg-blue\">';
	    		$.each(tmp, function(index, value) { 	    	
	  			  $.each(value,function(ix,val){
	  				tmphtml+='<td>'+val+'</td>';
	  			  });
	    		});
	    		tmphtml+='</tr>';
				
	    		if(i+1==data.length){
	    			$("#content #tb-content tbody").html(tmphtml);
	    		}
	    	}									
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        alert('view error ' + textStatus + " " + errorThrown);
	    
	    }
	});
});

$("#view").click(function(){		
	var ss={};
	startpos=0;
	ss['start']=startpos;				
	$.ajax({			
	    url: "http://localhost:8888/view",	
	    dataType: 'json',	   
	    data: ss,
	    method:"POST",
	    cache: false,
	    timeout: 3000,	
	    success: function(data) {		    	
	    	var tmphtml="";
	    	for(var i=0;i<data.length;i++){
	    		tmp=jQuery.parseJSON(data[i]);	    
	    		tmphtml+='<tr class=\"row bg-blue\">';
	    		$.each(tmp, function(index, value) { 	    	
	  			  $.each(value,function(ix,val){
	  				tmphtml+='<td>'+val+'</td>';
	  			  });
	    		});
	    		tmphtml+='</tr>';
				
	    		if(i+1==data.length){
	    			$("#content #tb-content tbody").html(tmphtml);
	    		}
	    	}									
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        alert('view error ' + textStatus + " " + errorThrown);
	    
	    }
	});
});

$("#but").click(function(){		

	//TEST AJAX
// 	$.ajax({			
// 	    url: "http://localhost:8888/reset",		
// 	    method:"POST",
	   
// 	    cache: false,
// 	    timeout: 3000,	
// 	    success: function(data) {
// 			alert(data);
// 			$.each(data, function(index, value) { 
// 			  $.each(value,function(ix,val){
// 				  alert(ix+' '+val);
// 			  });
			  		
// 		});
		
// 	    },
// 	    error: function(jqXHR, textStatus, errorThrown) {
// 	        alert('error ' + textStatus + " " + errorThrown);
// 	    }
// 	});
	
	if($("#filename").text()!=='filename'){		
		if(started===0){
			started=1;
			getresponse();			
			$("#progress").html('<img src=\"css/loader.gif\" />');
		}
	}
	
	
});

function getHeader(){
	$.ajax({			
	    url: "http://localhost:8888/header",		
	    method:"POST",
	    cache: false,
	    timeout: 3000,	
	    success: function(data) {	
	    	
			var array = data.toString().split(",");
			var tmphtml="";
			tmphtml+='<thead><tr class=\"row bg-title\">';
			$.each(array,function(i){				   
				   tmphtml+='<td>'+array[i]+'</td>';
					if(i+1===array.length){
						tmphtml+='</tr></thead><tbody></tbody>';
						$("#content #tb-content").html(tmphtml);
					}
				});							
			
			
			
			
// 			for(var i=0;i<n.length;i++){
// 		        $('#myDiv').append("<div>arr["+i+"] =>"+n[i]+"</div>");
// 		    }
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
	        alert('header error ' + textStatus + " " + errorThrown);
	        started=0;
	    }
	});
};

function checkStatus(){
	$.ajax({			
	    url: "http://localhost:8888/status",		
	    method:"POST",
	    cache: false,
	    timeout: 3000,	
	    success: function(data) {
			if(data.success==="true")
			{
				$("#progress").html('<img src=\"css/ok.png\" />');
				started=0;
				getHeader();
			}else if(data.success==="false"){
				startRetrieve();
			}else{
				$("#progress").html('<p id="up">Error </p>');
				started=0;
				
			}
	    },
	    error: function(jqXHR, textStatus, errorThrown) {	        
	    	if(textStatus==='timeout'){
	    		setTimeout(function(){
	    			checkStatus();
	    	    }, 10000);
	    	}else{
	    		alert('status error ' + textStatus + " " + errorThrown);
		        started=0;
	    	}
	    }
	});
};

function getresponse(){

$.ajax({			
    url: "http://localhost:8888/import",		
    method:"POST",

    cache: false,
    timeout: 3000,	
	beforeSend: function(){
//			$("#progress").html('<p id="up">Loading ... </p>');
		SendDirectory($("#filename").text());	
	},

    error: function(jqXHR, textStatus, errorThrown) {
        alert('get response error ' + textStatus + " " + errorThrown);
        started=0;
    }
}).done(function(msg){
	startRetrieve();	
});
};

function startRetrieve(){
if(started===1)
{
	setTimeout(function(){
		checkStatus();
    }, 5000);

	
}
};

function SendDirectory(txt){
var ss={};
ss['directory']=txt;	
$.ajax({	
	dataType: 'json',
    url: "http://localhost:8888/setDirectory",		
    method:"POST",
    data: ss,	        
});
};

$("#fileupload").fileupload({
	  dataType:"json",	  
	  
	  done:function(e,data){

		var tmp=data.originalFiles;		
		  $.each(tmp, function(index, value) { 
			  $("#filename").text(value.name);
			  		
		});

	  },
	  
	  progressall: function (e, data) {
	        var progress = parseInt(data.loaded / data.total * 100, 10);
	        //$('#progress .bar').append('<p>'+progress+'% '+ parseInt(data.bitrate/1024,10) +'Kb</p>');
// 	        $('#progress').html('<p>'+progress+'% '+ parseInt(data.bitrate/1024,10) +'Kb</p>');

	        $("#progress_bar #pbvalue").attr( "style", function() {
				  return "width: "+progress+"%";
				});
			$("#progress_bar #txtvalue").text(progress+'%');
	    },
	    
	  add: function(e,data){		  
		  data.submit();					  
	  }

});
