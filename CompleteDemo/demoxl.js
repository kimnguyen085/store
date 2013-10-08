var async = require('async'),	
	xlrd = require(__dirname+'/lib/xlrd'),
	sampleFiles = [
		// OO XML workbook (Excel 2003 and later)
		'myfile.xlsx'
		
	];
var db=require('riak-js').getClient({host: "192.168.103.224", port: "8098"});
var sys=require('sys');
var index=0;
var headerpp=[];
var datapp={Employee: []};
function handleRow(rows,callback){
	rows.forEach(function(cell){
		
		if(cell.row===0){				
			headerpp.push(cell.value+'');
		}
	});
	callback(rows);
};

function replace(key, value) {
    return value.toString();
};
	
exports.importdata = function(files,callback){
	headerpp=[];

	xlrd.parse(files, function (err, workbook) {

		if (err) {console.log(err); callback(err,"false",headerpp); };
			workbook.sheets.forEach(function (sheet) {
			console.log('sheet: ' + sheet.name);
			// Iterate on rows
			sheet.rows.forEach(function (row) {
				
				handleRow(row,function(rows){
					var datarow=[];	
					rows.forEach(function(cell){
						if(cell.row!==0){					
								var i=rows.indexOf(cell);
								
								if(i<headerpp.length){
								var head=headerpp[i]+"";
												
								var bb={};
								bb[head]=cell.value;						
								datarow.push(bb);
							}
						}
					});
					console.log(datarow);
					if(datarow.length!==0){				
						
						var indexByID = datarow[headerpp.indexOf("ID")].ID;
						
						db.save('data', indexByID, JSON.stringify(datarow)+'',{index: {inx: indexByID}},function(err){
							if (err) {
								console.log(err);
								callback(err,"error",headerpp);
							}else{
							console.log('Added '+indexByID+' : '+JSON.stringify(datarow));
							
							if(sheet.rows.indexOf(row)+1===sheet.rows.length){
								console.log('  -----------------------FINAL ');
								callback(null,"true",headerpp);
							}
							}
						});
					}
					
				});
				
	        });
			});
		});
}
	


//exports.importdata = function(files,callback){
//	headerpp=[];
//xlrd.stream(files).on('open', function (workbook) {
//	console.log('successfully opened ' + workbook.file);
//}).on('data', function (data) {
//	var crrrows=data.rows;
//	crrrows.forEach(function(row){	
//		row.forEach(function (cell) {
//			console.log(cell.address + ': ' + cell.value);
//	});
//		
//		handleRow(row,function(rows){
//			var datarow=[];	
//			rows.forEach(function(cell){
//				if(cell.row!==0){					
//						var i=rows.indexOf(cell);
//						
//						if(i<headerpp.length){
//						var head=headerpp[i]+"";
//										
//						var bb={};
//						bb[head]=cell.value;						
//						datarow.push(bb);
//					}
//				}
//			});
//			
//			if(datarow.length!==0){				
//				
//				var indexByID = datarow[headerpp.indexOf("ID")].ID;
//				
//				db.save('data', indexByID, JSON.stringify(datarow)+'',{index: {inx: indexByID}},function(err){
//					if (err) {
//						console.log(err);
//						callback(err,"error",headerpp);
//					}else{
//					console.log('Added '+indexByID+' : '+JSON.stringify(datarow));
//					
//					if(data.rows.indexOf(row)+1===data.rows.length){
//						console.log('  -----------------------FINAL ');
//						callback(null,"true",headerpp);
//					}
//					}
//				});
//			}
//			
//		});
//		
//		
//	});
//
//
//
//}).on('error', function (err) {
////	 TODO: handle error here
//	callback(err,"false",headerpp);
//}).on('close', function () {
////	 TODO: finishing logic here
//	console.log('------------END IMPORT----------');	
//	
//});
//};

