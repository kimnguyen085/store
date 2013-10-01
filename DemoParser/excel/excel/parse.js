var parseXlsx = require('./excelParser.js');
//Only support xlsx for now
parseXlsx('./template.xlsx', function(err, data) {
	if(err) throw err;
	console.log(data);
});