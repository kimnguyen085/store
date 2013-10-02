var async = require('async'),	
	xlrd = require(__dirname+'/lib/xlrd'),
	sampleFiles = [
		// OO XML workbook (Excel 2003 and later)
		'myfile.xlsx'
		
	];
var db=require('riak-js').getClient({host: "192.168.103.222", port: "8098"});
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
//async.eachSeries(sampleFiles, function (file, next) {
//		xlrd.parse(file,{ sheet: 0, maxRows: 10 }, function (err, workbook) {
//
//		if (err) throw err;
//			workbook.sheets.forEach(function (sheet) {
//			console.log('sheet: ' + sheet.name);
//			// Iterate on rows
//	
//			});
//		});
//});		

xlrd.stream(sampleFiles).on('open', function (workbook) {
	console.log('successfully opened ' + workbook.file);
}).on('data', function (data) {

//	var crrWb = data.workbook,
//		crrSh = data.sheet,
//		crrrows = data.rows;
	

//	console.log(crrSh.name);
	data.rows.forEach(function(row){
//		console.log(row);
//		row.forEach(function (cell) {
//				console.log(cell.address + ': ' + cell.value);
//			if(cell.value!==null){
//				index++;
//				db.save('flights', index, cell.value+'',{index: {inx: index}},function(err){
//					if (err) console.log(err);
//					console.log('Added '+index+' : '+cell.value);
//				});
//			}
//			
//		});
					
			
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
			if(datarow.length!==0)				
			console.log(datarow);
			
				
			
			
//			datapp.push(datarow);
//			datapp["Employee"]=datarow;
			
//			if(datarow.length!==0)
//			datapp["Employee"].push(datarow);
		});
		
		
	});
//	console.log(datapp["Employee"]);


}).on('error', function (err) {
//	 TODO: handle error here
}).on('close', function () {
//	 TODO: finishing logic here
	console.log('END----------');
});


