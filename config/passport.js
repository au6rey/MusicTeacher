const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
// Match user
      let user = await User.findOne({
        email: email
      });
      
        if (!user) {
          //EMAIL NOT REGISTERED
          return done(null, false, { message: 'Invalid e-mail or password. Please try again.' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            //INVALID PASSWORD
            return done(null, false, { message: 'Invalid e-mail or password. Please try again.' });
          }
        });
      
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (id, done) {
    await User.findById(id, function (err, user) {
      done(err, user);
      if(err) throw err;
    });
  });
};
