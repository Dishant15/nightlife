var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');
var Bars = require('../models/bars');

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
router.get('/twitter/login', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/users/login' }), function(req, res){
	if(req.session.path){
		var red = req.session.path;
		req.session.path = null;
		res.redirect(red);
	} else {
		res.redirect('/');
	}
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// pre twitter login view, to save a search path to session
router.get('/pre/:path', function(req, res){
	req.session.path = req.params.path.split("^").join("/");
	res.redirect('/users/twitter/login');
});

router.get('/login', function(req, res){
	res.render("error", {message:"Twitter Login failed!!"});
});

router.get('/going/:bar/:user', function(req, res){
	Bars.findOne({bar_id:req.params.bar}, function(err, dbbar){
		if(err)throw err;
		if(!dbbar) res.json({error:"not found"});
		// bar found
		if(dbbar.users.indexOf(req.params.user) == -1){
			// user going to this bar increment count
			dbbar.count = dbbar.count + 1;
			dbbar.users.push(req.user.twitter_id);
			dbbar.save(function(err){
				if(err)throw err;
				console.log("Increment success");
				res.json({
					count:dbbar.count
				});
			})
		} else {
			// user not going to the bar decrement the count
			dbbar.count = dbbar.count - 1;
			var index = dbbar.users.indexOf(req.params.user);
			if (index > -1) dbbar.users.splice(index, 1);
			dbbar.save(function(err){
				if(err)throw err;
				console.log("Decrement success");
				res.json({
					count:dbbar.count
				});
			})
		}
		
	})
});
	

module.exports = router;
