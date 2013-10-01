var db=require('riak-js').getClient({host: "192.168.103.222", port: "8098"});
var sys=require('sys');
var log=require('./Log.js');
//db.save('flights','112',{date:"2013-03-15",title:"Riak with //nodejs",presenters:["Sean","Mathias"]});

//db.save('flights', 1, 'nhkim', {index: {inx: 1}},function(err){if (err) console.log(err);});
//db.save('flights', 1, 'nhkim',function(err){if (err) console.log(err);});


//db.save('airlines', 'KLM', {country: 'NLT', established: 1991}, {index: {country: 'NLT', established: 1991}},function(err){if (err) console.log(err);});

//db.query('airlines', {established: [1900, 1920]},function(err,data){if(err) console.log(err); console.log(sys.inspect(data));});

//db.get('flights','1',function(err, data){console.log('Found flights '+sys.inspect(data));});

//db.save('flights', 'KLM-5034','123',function(err){console.log('Found flights '+err);});

//db.count('flights',function(err,data){console.log('Count '+data);});

//db.get('test','two',function(err,data){console.log(sys.inspect(data));});

//db.getAll('test',function(err,data){console.log(sys.inspect(data));});

//db.mapreduce.add(
//		  {bucket: 'airlines', index: 'established_int', start: 1900, end: 1991}).
//		    map('Riak.mapValuesJson').run(function(err,airlines){if(err) console.log(err); 
//		    console.log(airlines);
//		    airlines.forEach(function(air){
//		    	console.log(air);		    	
//		    	})
//		    })

//db.mapreduce.add(
//		  {bucket: 'flights', index: 'inx_int', start: 30, end: 31}).
//		    map('Riak.mapValues').run(function(err,flights){if(err) console.log(err); 
//		    console.log(flights);
//		    flights.forEach(function(flight){console.log(flight);});
//		    })

//db.mapreduce.add('flights').
//		    map('Riak.mapValues')
//		    .reduce('Riak.reduceSort','function(a,b){return a.key-b.key; }')
//		    .reduce('Riak.reduceSlice', [10, 24])
//		    .run(function(err,flights){
//		    if(err) console.log(err); 
//		    console.log(flights);		    
//		    flights.forEach(function(flight){console.log(flight);});
//		    })


//db.keys('airlines').on('keys', console.dir).start();

//db.getAll('airlines',function(err,data){
//		if(err) console.log(err);
//		data.forEach(function(air){
//			console.log(air.country);
//			db.search.remove('airlines',{country:air.country});
//		});
//	});

//db.saveBucket('airlines', {search: true},function(err){if (err) console.log(err);})		    

//db.search.remove('airlines',{id:'KLM'},function(err){if(err) console.log(err);});

//db.remove('flights','25');

//db.count('flights',function(err,data){
//	console.log('Count '+data);
//	for (var i=0;i<data;i++)
//	{ 
//		deleterow(i);
//	}
//	});
//function deleterow(j){
//	console.log('Removed a record');
//	db.remove('flights',j+1,function(err){if(err) console.log(err);});
//};

