var cronjob;
cronJob = require('cron').CronJob;
new cronJob('* * * * * *', function(){
	
	liveListRequests = request('http://localhost:7379/SMEMBERS/desires', function (error, response, body) {
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

