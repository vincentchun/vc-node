/* VC Web Apps: auth.js - authentication module
 * Copyright Vincent Chun, VC learning, used under license.
 */
const config = require('vc/config');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('vc/sqlite');
const string = require('vc/string');
//const xjwt = require('express-jwt');//Express middleware for validating jwt

const dbcon = config.databases.default_sqlite; //Database

// Auth model
class Auth {
	constructor(authobj){ //constructor(email, username, hash, salt){
		if(authobj){
			if (authobj.id || authobj[db.pk]){
				this.id = authobj.id ? authobj.id : authobj[db.pk];
			}
/*			this.email = authobj.email;
			this.username = authobj.username ? authobj.username : '';
			this.password = authobj.password ? authobj.password :'';
			this.hash = authobj.hash;
			this.salt = authobj.salt;
*/			Object.assign(this,authobj);
		}
	}
}

const auth_fields = {
	email: {label:'Email', input:'text', display:'text', list:null, sqlite:'TEXT UNIQUE'}, //unique
	username: {label:'Username', input:'text', display:'text', list:null, sqlite:'TEXT UNIQUE'},
	password: {label:'New Password', input:'password_conf', display:null, list:null}, // Not stored
	hash: {display:'null', list:null, sqlite:'TEXT'},
	salt: {display:'null', list:null, sqlite:'TEXT'}
}// !: Export for use in models
/*/ Auth fields
const email = {label:'Email', input:'text', display:'text', list:null, sqlite:'TEXT UNIQUE'}; //unique
const username = {label:'Username', input:'text', display:'text', list:null, sqlite:'TEXT UNIQUE'};
const password = {label:'New Password', input:'password_conf', display:null, list:null}; // Not stored
const hash = {display:'null', list:null, sqlite:'TEXT'};
const salt = {display:'null', list:null, sqlite:'TEXT'};

let auth = new Auth({
	email:email, 
	username:username, //Optional
	password:password, //Not stored
	hash:hash, 
	salt:salt
	});
*/

Auth.prototype.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('base64');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('base64');
};

Auth.prototype.validatePassword = function(password){
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('base64');
	return this.hash === hash;
};

// JSON Web Token
const jwtsecret = require('vc/config').appName + ' - Vincent Chun';
const privateKey = config.privateKey, publicKey = config.publicKey;

// Signing options

const signOpts = {
	issuer: config.appName,
	audience: config.rooturl,
	expiresIn: '1h',
	algorithm: 'RS256',
	}
// verifying options
const verifyOpts = {
	issuer: config.appName,
	audience: config.rooturl,
	expiresIn: '1h',
	algorithms: ['RS256'],
	}

Auth.prototype.generateJWT = function(){
	const today = new Date();
	const expirationDate = new Date(today);
	expirationDate.setDate(today.getDate() + 60);
	return jwt.sign({
		id: this.id,
		//salt: this.salt, //If additional identifying verification is desired - suggest this over email or username
		//email: this.email,
		//username: this.username,
		//exp: parseInt(expirationDate.getTime() / 1000, 10),
	}, privateKey, signOpts);
}

Auth.prototype.validatedJWT = function(password){
	const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('base64');
	if (this.hash === hash){
		return this.generateJWT();
	} else {
		return null;
	}
};

/*/ Not used:
Auth.prototype.toAuthJSON = function(){
	return {
		id: this.id,
		email: this.email,
		token: this.generateJWT(),
	};
};
*/

function signupAuth(signupDetails){
	var auth = new Auth({email:signupDetails.email/*, username:signupDetails.username*/});
	auth.setPassword(signupDetails.password);
	return auth;
}

function makeAuth(authobj){
	var auth = new Auth(authobj);
	return auth;
}

async function getAuthdb(query){
	var modelAuth = new require('vc/models').Auth();
	var authobj = await modelAuth.select({where:query});
	var authData = authobj.data;
	authData.id = authobj.data[authobj.modelDB.pk];
	// Get user's auth object
	//var promise = db.selectOne(dbcon, 'auth', query, db.cols);
	//var authobj = await Promise.resolve(promise);
	//authobj.id = authobj[db.pk]; lg(authobj,'authDetails');
	let user = new Auth(authobj); //lg(user);
	return user;
}

function verify(token){
	return jwt.verify(token, publicKey, verifyOpts);
}

// Get verified auth token from req
function getToken(req){
	try{
		let cookie = req.headers.cookie; 
		var cookieobj = string.cookieParse(cookie);
		var authToken = cookieobj.AuthToken;
		var verified = verify(authToken);
		return verified;
	}
	catch (error) {
		//lg(error);
		return null;
	}
}

// Refresh auth token
function refreshToken(req,res){
	try{
		let cookie = req.headers.cookie; 
		var cookieobj = string.cookieParse(cookie);
		var authToken = cookieobj.AuthToken;
		var verified = verify(authToken);
		let auth = makeAuth(verified);
		var token = auth.generateJWT();
		res.cookie('AuthToken', token, {httpOnly:true}); // Set token on cookie
		//return verified;
	}
	catch (error) {
		//lg(error);
		return null;
	}
}

// Callback functions - check & require auth
function checkAuth(req, res, next){
	try{
		let cookie = req.headers.cookie;
		var cookieobj = string.cookieParse(cookie);
		var authToken = cookieobj.AuthToken;
		var verified = verify(authToken);
		req.userAuth = verified;
		next();
		} 
	catch (error) {
		req.userAuth = null;
		next()
		};
}

function requireAuth(req, res, next){
	try{
		let cookie = req.headers.cookie; //lg(cookie)
		var cookieobj = string.cookieParse(cookie);
		var authToken = cookieobj.AuthToken;
		var verified = verify(authToken);
		req.userAuth = verified;
		if (verified){
			next();
		} else {
			//res.setHeader({redirectURL: req.originalUrl});
			req.header.loginRedirect = req.url;
			res.redirect('/login');
			//require('vc/authroutes').loginPage(req,res);
		}
	} 
	catch (error) {
		req.userAuth = null;
		//next()
			//res.setHeader({redirectURL: req.originalUrl});
			req.header.loginRedirect = req.url;
			res.redirect('/login');
			//require('vc/authroutes').loginPage(req,res);
			/*res.status(401).json({
				message: 'Auth failed'
			});*/
		};
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/auth.js > `+ ref); console.log(tolog); }

// Exports
// Function exports
exports.signupAuth = signupAuth;
exports.makeAuth = makeAuth;
//exports.getAuth = makeAuth; // Legacy
exports.getAuthdb = getAuthdb;
exports.verify = verify;
exports.getToken = getToken;
//exports.authFromReq = getToken; // Legacy
exports.checkAuth = checkAuth;
exports.requireAuth = requireAuth;

// Classes, Variables, Constants
exports.auth_fields = auth_fields;
exports.Auth = Auth;
//exports.authModels = {Auth:Auth, auth:auth};

//exports.createAuth = createAuth;
/* Routes and authentication options

const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;

  if(authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

module.exports = auth;
*/

/* References
 * Based on: https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/
 */ 
