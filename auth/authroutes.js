/* VC Web Apps Node.JS Modules
 * Copyright Vincent Chun, VC Learning, used under license
 */
const config = require('vc/config');
const ht = require('vc/html');
const tmpl = require('vc/templates');
const form = require('vc/form');
const auth = require('vc/auth');
const db = require('vc/sqlite');
const objects = require('vc/object');
const models = require('vc/models');
const rooturl = config.rooturl;
const dbcon = config.databases.default_sqlite;

// Function Exports
exports.loginPage = loginPage;
exports.signupPage = signupPage;
exports.login = login;
exports.logout = logout;
exports.signup = signup;
exports.authDetails = authDetails;
exports.changeAuthDetails = changeAuthDetails;

// Login Page
function loginPage(req,res){
	// Check if a redirect path is requested
	if(req.header.loginRedirect){
		var redirmsg = `To access '${req.header.loginRedirect}' :`
	}
	var user = req.userAuth;
	var head = tmpl.head(); // HTML head
	var pgArray = []; // Page array
	pgArray.push(tmpl.logohead()); // Logo header
	// If redirect path requested, add redirect message
	if(redirmsg){
		pgArray.push( ht.create(ht.p, {'class':'tcenter b'}, redirmsg));
	}
	pgArray.push( ht.create(ht.h2, {'class':'login tcenter'}, "Login with your email and password"));
	if (user){
		pgArray.push(ht.create(ht.p, {class:'tcenter'}, `You are currently logged in.<br>UserID: ${user.id}`));
	}
	// Create login form
	var forma = [];
	// Email field
	forma.push(form.fieldobj({field:'email', type:'email', label:'Email', formid:'login', inputattr:{id:'email', placeholder:'email'}}))
	// Password field
	forma.push(form.fieldobj({field:'password', type:'password', label:'Password', formid:'login', inputattr:{id:'password', placeholder:'password'}}))
	// Submit button
	forma.push(form.fieldobj({field:'submit', type:'submit', formid:'login', inputattr:{id:'submit', onclick:"window.location.href='${redirectUrl}'", 'class': 'ibutton'}}))
	// Cosntruct HTML page
	pgArray.push(ht.create(ht.form, {id:'login', action:`${config.rooturl}/login`, method:'POST', 'class':'tcenter'}, forma));
	var page = ht.create(ht.div, {'class':'article w600 center'}, pgArray);
	var body = ht.create(ht.body, {}, page);
	var html = ht.create(ht.html, {}, [head,body]);

	var pagehtml = tmpl.page({title:'Smartups - Log In', meta:{}, user:user, main:page});
	//return pagehtml;
	// Send http reesponse
	//res.send(html.render());
	res.send(pagehtml);
}

async function login(req,res){
	// Check for loginRedirect
	var redirectUrl = req.header.loginRedirect ? req.header.loginRedirect : '/'; //lg(req.header.loginRedirect,'post');
	//-- Validate and send token
	let login = req.body;
	var authModel = new models.auth();
	var userAuth = await authModel.select({where:{email:login.email}})
	// Retrieve auth record from database
//	var promise = db.selectOne(dbcon, 'auth', {email:login.email}, db.cols);
//	var result = await Promise.resolve(promise);
	// Construct auth object from result
	try{ 
//		let userAuth = auth.makeAuth(result); //lg(userAuth); //lg(userAuth.validatePassword(login.password));
		// Validate password
		if (userAuth.data.validatePassword(login.password)){
			var token = userAuth.data.validatedJWT(login.password); //lg(token); // Generate auth token
			res.cookie('AuthToken', token, {httpOnly:true}); // Set token on cookie
			res.redirect(redirectUrl); // Redirect to requested URL
		} else { // Auth failed
			return res.status(401).send(
				"Login failed"		
			);
		}
	}
	catch{ lg("User doesn't exist"); 
		return res.status(401).send("Login failed");
	}

}

function logout(req,res){
	res.clearCookie('AuthToken');
	res.send('Logged Out');
}

// Sign Up Page
function signupPage(req,res){
	var user = req.userAuth;
	var head = tmpl.head(); // HTML head
	var pgArray = []; // Page array
	pgArray.push(tmpl.logohead()); // Logo header
	pgArray.push( ht.create(ht.h2, {'class':'signup tcenter'}, "Signup with your email and create a password")); // Heading
	// Create signup form
	var forma = [];
	// Email field
	forma.push(form.fieldobj({field:'email',type:'email',label:'Email',formid:'signup',inputattr:{placeholder:'email', required:true}}));
	// Password field
	forma.push(form.fieldobj({field:'password', type:'password_conf', label:""}));
/*	forma.push(form.fieldobj({field:'password',type:'password',label:'Password',formid:'signup',inputattr:{placeholder:'password', required:true, onkeyup:'checkpass();'}}));
	// Password confirmation message - match with confirm field
	forma.push(ht.create(ht.div, {id:'passconfmsg'}, ''))
	// Confirm password field
	forma.push(form.fieldobj({field:'confirm_password',type:'password',label:'Confirm Password',formid:'signup',inputattr:{placeholder:'confirm password', required:true, onkeyup:'checkpass();'}}));*/
	// Submit button
	forma.push(form.fieldobj({field:'submit', type:'submit', label:'', formid:'signup', inputattr:{id:'submit', 'class': 'ibutton'}}));
	// Construct HTML page
	pgArray.push(ht.create(ht.form, {id:'signup', method:'POST', 'class':'tcenter'}, forma));
	pgArray.push(tmpl.scriptDOMLoad(`document.querySelector('input#submit').disabled=true; console.log('load');`));
	var page = ht.create(ht.div, {'class':'article w600 center'}, pgArray);
	var body = ht.create(ht.body, {}, page);
	var html = ht.create(ht.html, {}, [head,body]);
	// Render page
	var pagehtml = tmpl.page({title:'Smartups - Log In', meta:{}, user:user, main:page});
	// Send http response
	//res.send(html.render());
	res.send(pagehtml);
}

function signup(req,res){
	let body = req.body; lg(req.body);
	if (body.email && body.pwconfpassword == body.confirm_pwconfpassword){
		var newauth = auth.signupAuth({email:body.email, password:body.pwconfpassword});
		var authModel = new models.auth();
		authModels.insert({fieldkeys:newauth.keys(),items:[newauth]});
		//var toInsert = objects.fitproto(objects.modelSchema(auth.auth, 'sqlite'), objects.deMethod(newauth)); 
		//lg(objects.dbtext(toInsert));
		//db.insertOne(dbcon,'auth', objects.dbtext(toInsert));
		res.redirect('/');
	} else {
		res.send("Error: password and confirm password don't match");
	}
}

// Auth Details and Change Page
async function authDetails(req,res){
	// Check for user auth
	var user = req.userAuth;
	var verifiedToken = auth.getToken(req);//alt
	if (!verifiedToken){return res.send('Authorisation required')}
	// HTML head & page header
	var head = tmpl.head(); // HTML head
	var pgArray = []; // Page array
	//pgArray.push(validatejs); // Password validate.js
	pgArray.push(tmpl.logohead());
	pgArray.push( ht.create(ht.h2, {'class':'signup tcenter'}, "Your authentication/login details"))
	//pgArray.push(validatejs);
	// Get user's auth object
	var authModel = new models.auth();
	var userAuth = await authModel.select({where:{[authModel.modelDB.pk]:verifiedToken.id}});
	//Promise.resolve(auth.getAuthdb({[db.pk]: verifiedToken.id}));
	if (userAuth){
		pgArray.push(ht.create(ht.p, {}, `Tap <img src="${rooturl}/app/img/edit.png" style="width:14px; display:inline;"> to change login credential. You will need to enter your password to verify any change.`));
		// Id
		pgArray.push(ht.create(ht.div, {style:'margin:10px;'}, 
		[ ht.create(ht.span, {'class':'fieldlabel id'}, `Id: `),
		ht.create(ht.span, {'class':'field id'}, `${userAuth.data[userAuth.modelDB.pk]}`)
		]));
		// Email
		pgArray.push(ht.create(ht.div, {style:'margin:10px;'}, 
		[ ht.create(ht.div, {'class':'fieldlabel email'}, `Email: `),
		ht.create(ht.div, {'class':'field email'}, `${userAuth.data.email}`),		
		form.dbfieldhiddenpw(userAuth, 'email')
		]));
		// Username
		pgArray.push(ht.create(ht.div, {style:'margin:10px;'},
		[ ht.create(ht.div, {'class':'fieldlabel username'}, `Username: `),
		ht.create(ht.div, {'class':'field username'}, `${userAuth.data.username}`),
		form.dbfieldhiddenpw(userAuth, 'username')
		]));
		//Password
		pgArray.push(ht.create(ht.div, {style:'margin:10px;'},
		[ ht.create(ht.div, {'class':'fieldlabel password'}, `Password: `),
		form.dbfieldhiddenpw(userAuth, 'password')
		]));
		
	}
	var page = ht.create(ht.div, {'class':'article w600 center'}, pgArray);
	var body = ht.create(ht.body, {}, page);
	var html = ht.create(ht.html, {}, [head,body]);
	// Render page
	var pagehtml = tmpl.page({title:'Smartups - Log In', meta:{}, user:user, main:page});
	res.send(pagehtml);
}

async function changeAuthDetails(req,res){
	// Check for user auth
	var verifiedToken = auth.getToken(req);
	if (!verifiedToken){return res.send('Authorisation required')}
	// Read request body
	let body=req.body; lg(body);
	//var record = {[db.pk]:verifiedToken.id}; lg(record);
	// Get user's auth object
	var authModel = new models.auth();
	var userAuth = await authModel.getByPK(verifiedToken.id);
	//var user = await Promise.resolve(auth.getAuthdb(record));
	// Check password
	if (userAuth.auth.validatePassword(body.password)){
		delete(body.password);
		try {
			authUpdate(userAuth,body);//to write
			res.send('Ok');
		} catch (err) {
			res.send("Error: we could not process that.\n" + err.message);
		}
	} else {
		res.send("Password didn't work");
	}
}

// Specify how to update each auth record
function authUpdate(userAuth,body){
	// Process body to match database record, so we can use db.updateMany() to insert directly
	var toInsert = {}; //lg(record); lg(body);
	for (key in body){
		// Add required key:val pairs to toInsert
		if (key == 'pwconfpassword'){
			if (body.pwconfpassword != body.confirm_pwconfpassword){return res.send('Update password error: Password confirmation failed');} // Redundancy, double-check - should be verified on front end
			let temp = auth.makeAuth({});
			temp.setPassword(body[key]);
			toInsert.hash = temp.hash;
			toInsert.salt = temp.salt;
		} else 
		if (key == 'email' || key == 'username'){
			toInsert[key] = body[key];
		}
	}
	lg(toInsert, 'toInsert');
	//db.updateMany(dbcon,'auth', record, toInsert);
	userAuth.update({where:userAuth.data, updateFields:toInsert});
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/authroutes.js > `+ ref); console.log(tolog); }

