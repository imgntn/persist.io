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

var liveList = {
  "channels": ["liveList"],
  "data": [liveListRequests]

};
var liveListRequests;
var cronjob;
cronJob = require('cron').CronJob;
new cronJob('* * * * * *', function(){
	
	liveListRequests = request("http://localhost:7379/SMEMBERS/sessionIDs", function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    console.log(body) // Print the google web page.

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
