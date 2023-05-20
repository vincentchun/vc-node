/* VC Web Apps: edit.js - edit database record.
 * Copyright Vincent Chun, VC Learning
 */
// Dependencies
const config = require('vc/config')
const auth = require('vc/auth')
const ht = require('vc/html')// vc.html //
const db = require('vc/sqlite')//vc.sqlite //
const tmpl = require('vc/templates')//vc.templates //
const field = require('vc/fields/fielddisplay')//vc.fielddisplay //
const url = require('vc/url')//vc.url //
const objects = require('vc/object')//vc.objects //
const string = require('vc/string')//vc.string //
const form = require('vc/form')//vc.form //
const models = require('vc/models')
//const Busboy = require('busboy')
//const bodyParser = require('body-parser');
// Global constants & variables
const root = require('vc/config').rooturl;
const dbcon = config.databases.default_sqlite;


async function getObject(table,filter={}){
	var obj = db.selectOne(dbcon, table, filter, db.cols);
	var result = await Promise.resolve(obj);
	return result;
} exports.getObject = getObject;

async function getQueryModel(table, filter={}){
	var Obmodel = models[table];
	let modelInstance = new Obmodel();
	var qresult = await modelInstance.select({where:filter}); //lg(qresult, 'qresult');
	return qresult;
}

async function record(table, qresult){
	var modelInstance = await qresult;
	var dataObject = modelInstance.render();
//	console.log(object);
	
	var display=[];
	
	// == Delete Bar
	var delArray=[];
	delArray.push(ht.create(ht.div, {'class':"delete-conf tcenter"}, `Please confirm:<br>Are you sure you want to delete this ${table}?`));
		// Delete Form
	var delForm=[];
	for (let [key,val] of Object.entries(modelInstance.data)){
		delForm.push(ht.create(ht.input, {type:'hidden', id:key, name:key, value:val}));
	}
	delForm.push(ht.create(ht.input, {type:'submit', value: `Delete this ${table}`}));
	delArray.push(ht.create(ht.form, {method:'POST', 'class': "delete form"}, delForm));
	var deleteBar = ht.create(ht.div, {'class':"delete-bar bgwh tcenter"}, delArray);
	display.push(deleteBar);
	// == Record header
	var rechead=[];
	rechead.push(ht.div({'class':"tablename"}, string.capitalize(table)));
	rechead.push(ht.create(ht.div, {class:'options'}, tmpl.editico({href:`/edit/${table}/${db.pk}/${dataObject[db.pk]}`, title:'Edit'})));
	display.push(ht.create(ht.div,{class:'rechead flexrnw jb'},rechead));
	
	if (dataObject){
		let displaySchema = modelInstance.fieldSchema.display;
		let labels = modelInstance.fieldSchema.label;
		for (let [key,val] of Object.entries(dataObject)){ // For each key/val of object
			display.push("<br>");
			var fielddiv = [];
			// Add Label
			let label = key;
			if (labels[key]){label=labels[key]}
			fielddiv.push(ht.create(ht.span, {'class':`fieldlabel ${key}`}, `${label}: `))
			// If val exists, render it
			if(val){
				fielddiv.push(field.render(displaySchema[key],key,val)); // Render val
			}
			/*if (modelInstance.fieldSchema.input[key]){
				fielddiv.push(form.dbfieldhidden(modelInstance, key, {method:'POST', /*enctype:"multipart/form-data", action:"/" *}));
			}*/
			display.push(ht.create(ht.div, {'class': `fielddisplay fieldedit ${key}`},fielddiv));
		}
	}
	var html = ht.create(ht.div, {'class':"display record"}, display);
	return html;
} exports.record = record;

async function html(table, objectp, user){
	var htmlr = [], body = [];
	htmlr.push(tmpl.head());
//	body.push(tmpl.logohead().render());
	var rec = await record(table, objectp);
	if (! models.includeFrontEnd.includes(table)){ // In models.js: included/excluded from default views
		rec = ht.p({}, `We couldn't find anything matching your query`);
	}
	body.push(rec);
	htmlr.push(ht.create(ht.body, {}, body));
//	htmlr.push(tmpl.footscripts());
	htstr = tmpl.html(htmlr);
//	return htstr;
	var pagehtml = tmpl.page({title:'Smartups', meta:{}, user:user, header:true, main:body});
	return pagehtml;
}

async function main(req,res){
	// Check for user auth
	var user = req.userAuth; //lg(user); // Get user auth from middleware or
	//var user = auth.getToken(req); //lg(user); // directly
	if (!user){return res.send('Authorisation required to edit')}
	// Get url params from req
	let param = req.params;
	var table = param.table;
	// Construct query filter from params
	var filter = objects.getKeyVals(req.params);
	// Get object
	var object = await getQueryModel(table,filter);
	// Check if user is authorised to edit
	if (user.id == object.data.auth || config.sysAdmin.includes(user.id)){
		// Send HTTP response
		res.send(await html(table, Promise.resolve(object), user))
	} else {return res.send('It seems that you are not authorised to edit this')}
} exports.main = main;

function log(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype){
//		console.log(`${fieldname}: ${val}`);
}


async function post(req, res){
	// Check for user auth
	var user = req.userAuth; // Get user auth from middleware or
	//var user = auth.getToken(req); // directly
	if (!user){return res.send('Authorisation required to edit')}
	// Get url params from req
	let param = req.params, body=req.body;
	var table = param.table;
	// Construct query filter from params
	var filter = objects.getKeyVals(req.params);
	// Get record from database
	var modelInstance = await getQueryModel(table,filter);
	// Check if user is authorised to edit
	if (user.id == modelInstance.data.auth || config.sysAdmin.includes(user.id)){
		lg(filter); lg(body);
		// Delete record from database
		modelInstance.delete({where:body});
		// Redirect to list page
		var redirUrl = req.protocol+'://'+req.get('host')+'/list/'+table;
		res.redirect(redirUrl);
	}else {return res.send('Problem: you are not authorised to edit this')}
} exports.post = post;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/edit.js > `+ ref); console.log(tolog); }
