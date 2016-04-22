
var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
        twitter_id : {type : String, unique : true, required : true, index :true},
        name : String,
        time_stamp: { type: Date, default: Date.now }
    },
    { collection: 'user' }
    );

UserSchema.methods.get_absolute_url = function(){
	return "/user/home/" + this.twitter_id + "/";
};
    
var User = module.exports = mongoose.model('User', UserSchema);

var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: "Fl3skzKigb91AEEXTZryudEeR",
    consumerSecret: "u6OIObdlUHBPJaTSiaa3QByiAEZH6l1Pu6VKqP4KbVWxj9N8t1",
    callbackURL: "http://127.0.0.1:3000/users/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
     //check user table for anyone with a facebook ID of profile.id
        User.findOne({ 'twitter_id': profile.id }, function(err, user) {
            if (err) return done(err);
            //No user was found... so create a new user with values from Facebook (all the profile. stuff)
            if (!user) {
                user = new User({
                    name: profile.displayName,
                    twitter_id : profile.id
                });
                user.save(function(err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                //found user. Return
                return done(err, user);
            }
        });
    }
 ));

passport.serializeUser(function(user, done) {
  done(null, user.twitter_id);
});

passport.deserializeUser(function(twitter_id, done) {
  User.findOne({twitter_id : twitter_id}, function(err, user) {
    done(err, user);
  });
});