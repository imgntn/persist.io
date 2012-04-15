var redis   = require("redis");

var msg = {
  "channels": ["channel1"],
  "data": "200"

};

var client = redis.createClient();
client.publish("juggernaut", JSON.stringify(msg));
