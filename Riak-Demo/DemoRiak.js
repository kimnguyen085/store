var db=require('riak-js').getClient({host: "192.168.103.222", port: "8098"});
var sys=require('sys');
var log=require('./Log.js');
//db.save('flights','112',{date:"2013-03-15",title:"Riak with //nodejs",presenters:["Sean","Mathias"]});

//db.save('flights', 1, 'nhkim', {index: {inx: 1}},function(err){if (err) console.log(err);});
//db.save('flights', 1, 'nhkim',function(err){if (err) console.log(err);});

//db.save('airlines', 'KLM', {country: 'NLT', established: 1991}, {index: {country: 'NLT', established: 1991}},function(err){if (err) console.log(err);});

//db.query('airlines', {established: [1900, 1920]},function(err,data){if(err) console.log(err); console.log(sys.inspect(data));});

//db.get('flights','112',function(err, data){console.log('Found flights '+sys.inspect(data));});

//db.save('flights', 'KLM-5034','123',function(err){console.log('Found flights '+err);});

//db.count('test',function(err,data){console.log('Count '+data);});

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
//		  {bucket: 'flights', index: 'inx_int', start: 0, end: 5}).
//		    map('Riak.mapValues').run(function(err,flights){if(err) console.log(err); 
//		    console.log(flights);
//		    flights.forEach(function(flight){console.log(flight);});
//		    })

//db.mapreduce.add('flights').
//		    map('Riak.mapValues').reduce('Riak.reduceSlice', [0, 5]).run(function(err,flights){if(err) console.log(err); 
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

//db.remove('airlines','KLM');
