var redis   = require("redis");

var msg = {
  "channels": ["channel1"],
  "data": "200"

};

var msg2 = {
  "channels": ["channel1"],
  "data": "400"
};

var client = redis.createClient();
client.publish("juggernaut", JSON.stringify(msg));
client.publish("juggernaut", JSON.(msg2));

