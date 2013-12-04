var redis   = require("redis");

var request = require('request');

var client = redis.createClient();


var liveList;

var liveListRequests;
	
	liveListRequests = request('http://localhost:7379/SMEMBERS/desires', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // Print the google web page.
		liveList = {
		  "channels": ["liveList"],
		  "data": [body]
		};
	client.publish("juggernaut", JSON.stringify(liveList));  
	};
});



