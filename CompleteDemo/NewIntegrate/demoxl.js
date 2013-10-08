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
		
exports.importdata = function(files,callback){
	headerpp=[];
xlrd.stream(files).on('open', function (workbook) {
	console.log('successfully opened ' + workbook.file);
}).on('data', function (data) {

	data.rows.forEach(function(row){	
			
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
			
			if(datarow.length!==0){				
				console.log(datarow);
				var indexByID = datarow[headerpp.indexOf("ID")].ID;
				
//				db.save('flights', indexByID, JSON.stringify(datarow)+'',{index: {inx: indexByID}},function(err){
//					if (err) console.log(err);
//					console.log('Added '+indexByID+' : '+JSON.stringify(datarow));
//				});
			}
			
		});
		
		
	});



}).on('error', function (err) {
//	 TODO: handle error here
	callback(err,"false");
}).on('close', function () {
//	 TODO: finishing logic here
	console.log('------------END IMPORT----------');	
	callback(null,"true");
});
};

