/* VC Web Apps: passport.js
 * Copyright Vincent Chun, VC learning, used under license.
 */
const db = require('vc/sqlite.js');
const models = require('vc/models.js');
const passport = require('passport');;

const auth = models.auth;

function local(){
	const LocalStrategy = require('passport-local');
	params = {usernameField: 'user[email]',	passwordField: 'user[password]'};// auth[]...?
	passport.use(new LocalStrategy(params,
		(email, password, done) => {
			db.selectOnep('auth', ['rowid','*'], {'email': email})
				.then((auth)=>{
					if (!auth || !auth.validatePassword(password)){
						return done(null, false, {errors: {'email/username or password': 'invalid'} });
					}
					return done(null, auth);
				})
				.catch(done);
		})
	)
}

/* References
 * * Based on 'Configure Passport' https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/
 */ 

// Passport-jwt
function jwt(){
	var JwtStrategy = require('passport-jwt').Strategy,
		ExtractJwt = require('passport-jwt').ExtractJwt;
	var opts = {}
			opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//extract from cookie
			opts.secretOrKey = 'secret';
			opts.issuer = 'accounts.examplesoft.com';
			opts.audience = 'yoursite.net';
	passport.use(new JwtStrategy(opts, 
		(jwt_payload, done) => {
			User.findOne({id: jwt_payload.sub}, 
				function(err, user) {
					if (err) {
						return done(err, false);
					}
					if (user) {
						return done(null, user);
					} else {
						return done(null, false);
					// or you could create a new account
					}
				});
		})
	);
}
