var excelParser = require('./excelParser.js')
excelParser.worksheets({
  inFile: './myfilebig.xlsx'
}, function(err, worksheets){
  if(err) console.error(err);
  console.log(worksheets);
});

excelParser.parse({
  inFile: './myfilebig.xlsx',
  worksheet: 1,
  skipEmpty: true
},function(err, records){
  if(err) console.error(err);
  console.log(records);
});