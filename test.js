var redis   = require("redis");
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
  "data": ["whatever i want"]

};


var client = redis.createClient();
client.publish("juggernaut", JSON.stringify(msg));
client.publish("juggernaut", JSON.stringify(msg2));
client.publish("juggernaut", JSON.stringify(msg3));


