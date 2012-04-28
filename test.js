var redis   = require("redis");

var request = require('request');

var client = redis.createClient();


var msg = {
  "channels": ["channel1"],
  "data": "200"

};

var msg2 = {
  "channels": ["channel2"],
  "data": [400,400,400]

};

var msg3 = {
  "channels": ["scene2trees"],
  "data": [-1500,-10,0]

};
var liveList;
 

var liveListRequests;
var cronjob;
cronJob = require('cron').CronJob;
new cronJob('* * * * * *', function(){
	
	liveListRequests = request('http://localhost:7379/SMEMBERS/sessionIDs', function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // Print the google web page.
		liveList = {
		  "channels": ["liveList"],
		  "data": [body]
		};
	  };

		client.publish("juggernaut", JSON.stringify(liveList));

	});
	

	
    console.log('You will see this message every second');
}, null, true, "America/Los_Angeles");



var requests = [];
var url;
url = 'http://localhost:7379/GET/nonuniquevisitors';
requests.push(url);
url='http://localhost:7379/SMEMBERS/sessionIDs';
requests.push(url);
url = 'http://localhost:7379/GET/mytest';
requests.push(url);

for (var i=0; i < requests.length; i++){
	
	request[i] = request(requests[i], function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // Print the google web page.
	  }
	});
	
	
};


client.publish("juggernaut", JSON.stringify(msg));
client.publish("juggernaut", JSON.stringify(msg2));
client.publish("juggernaut", JSON.stringify(msg3));

var jbp = $.get("http://bethere.io:7379/SMEMBERS/sessionIDs", function(data){
	
	jbp2 = data.responseText;
	jbp3 = JSON.parse(jbp2);
	for (var i=0; i = jbp3.SMEMBERS.length){
		
		jbp4 = $.get("http://bethere.io:7379/GET/"jbp3.SMEMBERS[i], function(data){
			 jbp5 = data.responseText;
			 jbp6 = JSON.parse(jbp5);
			checkTransform = jbp6.GET
			if (checkTransform = 1){
				client.publish("juggernaut", JSON.stringify(msg3));
			}
		});
		
	}
	
});
