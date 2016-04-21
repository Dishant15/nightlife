var express = require('express');
var router = express.Router();

var User = require('../models/user');

var passport = require('passport');



// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
router.get('/twitter/login', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/user/login' }));



router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
