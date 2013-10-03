
function mySandwich(param1, param2, callback) {  
    console.log('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);  
    callback(param1,param2);  
}  
  
mySandwich('ham', 'cheese', function(param11,param22) {  
    console.log('Finished eating my sandwich include: '+param11+' and '+param22);  
}); 