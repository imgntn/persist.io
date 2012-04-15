var redis   = require("redis");

var msg = {
  "channels": ["channel1"],
  "data": "are you listening?"
  "data2": [400,400,400]

};



var client = redis.createClient();
client.publish("juggernaut", JSON.stringify(msg));


