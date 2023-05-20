/* VC Web Apps: routes.js VC Web Apps specific paths
 * Copyright Vincent Chun, VC Learning, used under license
 */
// Dependencies
const auth = require('vc/auth');
// Tnclude in app entry point, app.js:
// vc.routes(app);
// Or otherwise copy paths over. 
module.exports = function(app){
	
	var authRoutes = require('vc/auth/authroutes')
	app.get('/login', auth.checkAuth, (req,res) =>{
		authRoutes.loginPage(req,res);
	})
	app.post('/login', (req,res) =>{
		authRoutes.login(req,res);
	})
	app.get('/logout', (req,res)=>{
		authRoutes.logout(req,res);
	})
	app.get('/signup', auth.checkAuth, (req,res) =>{
		authRoutes.signupPage(req,res);
	})
	app.post('/signup', (req,res) =>{
		authRoutes.signup(req,res);
	})
	app.get('/myauthdetails', auth.requireAuth, (req,res) =>{
		authRoutes.authDetails(req,res);
	})
	app.post('/myauthdetails', auth.requireAuth, (req,res) =>{
		authRoutes.changeAuthDetails(req,res);
	})
	
	var addnew = require('vc/addnew')//.addnew
	app.get('/addnew/:table', auth.requireAuth, (req,res) =>{
		addnew.main(req,res);
	})
	app.post('/addnew/:table', auth.requireAuth, (req,res) =>{
		addnew.post(req,res);
	})

	var deleteRec = require('vc/delete');
	app.get('/delete/:table/:key0?/:val0?', auth.requireAuth, (req,res) => {
		deleteRec.main(req,res);
	})
	app.post('/delete/:table/:key0?/:val0?', auth.requireAuth, (req,res) => {
		deleteRec.post(req,res);
	})
	
	var display = require('vc/display')
	app.get('/display/:table/:key0?/:val0?', auth.checkAuth, (req,res) =>{
		display.main(req,res);
	})

	var edit = require('vc/edit')
	app.get('/edit/:table/:key0?/:val0?', auth.requireAuth, (req,res) =>{
		edit.main(req,res);
	})
	app.post('/edit/:table/:key0?/:val0?', auth.requireAuth, (req,res) =>{
		edit.post(req,res);
	})
	
	var list = require('vc/list')
	app.get('/list/:table/:key0?/:val0?', auth.checkAuth, (req,res) =>{
		list.main(req,res);
	})
	
	var cssReference = require('vc/css/reference')
	app.get('/reference/css', (req,res) => {
		res.send(cssReference.html);
	})

}
