var express = require('express');
var app = express();
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var jwt    = require('jsonwebtoken');
dotenv.load();

app.set('superSecret', process.env.SECRET); 

var User =  require('./api/models/User');
var Desire = require('./api/models/Desire');

var router = express.Router();

var useAuthentication=false;

router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

if(useAuthentication===true){

router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});
}


router.get('/test', function(req, res) {
	res.json({
		message: 'hooray! welcome to our api!'
	});
});



router.route('/desires')
	// create a desire (accessed at POST http://localhost:8080/api/desires)
	.post(function(req, res) {

		var desire = new Desire(); // create a new instance of the desire model
	
		desire.txt = req.body.txt; // set the desire name (comes from the request)
		// save the desire and check for errors
		desire.save(function(err) {
			if (err) {
				res.send(err);
			} else {
				res.json({
					message: 'desire created!'
				});
			}



		});

	})
	.get(function(req, res) {
		Desire.find(function(err, desires) {
			if (err) {
				res.send(err);
			} else {
				res.json(desires);
			}

		});
	});

router.route('/desires/:desire_id')
	.get(function(req, res) {
		Desire.findById(req.params.desire_id, function(err, desire) {
			if (err) {
				res.send(err);
			} else {
				res.json(desire);
			}


		});
	})
	.put(function(req, res) {

		// use our desire model to find the desire we want
		Desire.findById(req.params.desire_id, function(err, desire) {

			if (err)
				res.send(err);

			desire.txt = req.body.txt; // update the desires info

			// save the desire
			desire.save(function(err) {
				if (err)
					res.send(err);

				res.json({
					message: 'desire updated!'
				});
			});

		});
	}).delete(function(req, res) {
		Desire.remove({
			_id: req.params.desire_id
		}, function(err, desire) {
			if (err)
				res.send(err);

			res.json({
				message: 'Successfully deleted'
			});
		});
	});

router.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, app.get('superSecret'), {
          expiresInMinutes: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }   

    }

  });
});

// app.get('/setup', function(req, res) {

//   // create a sample user
//   var nick = new User({ 
//     name: 'Nick Cerminara', 
//     password: 'password',
//     admin: true 
//   });

//   // save the sample user
//   nick.save(function(err) {
//     if (err) throw err;

//     console.log('User saved successfully');
//     res.json({ success: true });
//   });
// });




app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
	extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(morgan('dev'));

app.use('/api', router);

app.use(express.static(__dirname + '/public'));

app.listen(process.env.PORT || 3000);

var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL);