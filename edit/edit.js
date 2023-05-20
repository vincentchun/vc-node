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

async function getQueryResult(table, filter={}){
	var model = models[table];
	if (!model){return;}
	let modelInstance = new model();
	var qresult = await modelInstance.select({where:filter, any:false}); //lg(qresult, 'qresult');
	return qresult;
}

async function record(table, qresult){
	var modelInstance = await qresult;
	var dataObject = modelInstance.render();
	var pk = modelInstance.modelDB.pk;
	
	var editblock=[];
	var editMenu = tmpl.dropdown(ht.create(ht.a, {href:`${root}/delete/${table}/${pk}/${dataObject[pk]}`, title:'Delete'}, 'Delete'), '...');
	
	var edithead = ht.create(ht.div,{class:'rechead flexrnw jb'},'');
	edithead.addEnd(ht.create(ht.span, {'class':"tablename"}, string.capitalize(table)));
	edithead.addEnd(editMenu);
	editblock.push(edithead);

	if (dataObject){
		let displaySchema = modelInstance.fieldSchema.display;
		let frontendEdit = modelInstance.frontEnd('edit');
		if (Array.isArray(frontendEdit)){// Is it an array of fields to include?
			dataObject = objects.matchKeys(frontendEdit, dataObject);
		} else if (Array.isArray(frontendEdit.fields)){// Is it an object with a fields property, an array?
			dataObject = objects.matchKeys(frontendEdit.fields, dataObject);
		}
		let labels = modelInstance.fieldSchema.label;
		for (let [key,val] of Object.entries(dataObject)){ // For each key/val of object
			//editblock.push("<br>");
			var fielddiv = [];
			// Add Label
			let label = key;
			if (labels[key]){label = labels[key] || ''}
			fielddiv.push(ht.create(ht.div, {'class':`label ${key}`}, `${label} `))
			// If val exists, render it
			if(val){
				fielddiv.push(field.render(displaySchema[key],key,val)); // Render val
			}
			if (modelInstance.fieldSchema.input[key]){
				fielddiv.push(form.dbfieldhidden(modelInstance, key, {method:'POST', /*enctype:"multipart/form-data", action:"/"*/}));
			}
			editblock.push(ht.create(ht.div, {'class': `fielddiv fieldedit ${key}`},fielddiv));
		}
	}
	var html = ht.create(ht.div, {'class':"display record"}, editblock);
	return html;
} exports.record = record;

async function html(table, qresult, user){
	var htmlr = [], body = [];
	var modelInstance = await qresult;
	try {addHead = tmpl.pages(table).edit.head;} catch(err){addHead='';}
	try {beforeContent = tmpl.pages(table).edit.beforeContent({modelInstance:modelInstance});} catch(err){beforeContent='';}
	try {afterContent = tmpl.pages(table).edit.afterContent({modelInstance:modelInstance});} catch(err){afterContent='';}
//	body.push(tmpl.logohead().render());
	body.push(beforeContent);
	if (modelInstance){
		if (modelInstance.frontEnd('edit')){
			var rec = await record(table, modelInstance);
			body.push(rec);
		} else { body.push(ht.p({}, `No edit interface for ${table}`));}
	} else {
		body.push(ht.create(ht.p,{},`No result for ${table}`));
	}
	body.push(afterContent);
	var pagehtml = tmpl.page({title:'Smartups', meta:{}, htmlhead:addHead, user:user, header:true, main:body});
	return pagehtml;
}

async function main(req,res){
	var user = req.userAuth;
	var backButton = `<button onclick="window.history.back()" class='back-button'>Go Back</button>`;
	if (!user){return res.send('Authorisation required to edit')}
	let param = req.params; // Get url params from req
	var table = param.table;
	var filter = objects.getKeyVals(req.params);
	var qresult = await getQueryResult(table,filter);
	if (!qresult){return res.send(`We could not find what you were looking for.<br>${backButton}`);}
	// Check if user is authorised to edit
	if (user.id == qresult.data.auth || config.sysAdmin.includes(user.id)){
		res.send(await html(table, qresult, user))// Send HTTP response
	} else {return res.send(`It seems that you are not authorised to edit this.<br>${backButton}`)}
} exports.main = main;

function log(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype){
//		console.log(`${fieldname}: ${val}`);
}


async function post(req, res){
	var user = req.userAuth; // Get user
	if (!user){return res.send('Authorisation required to edit')}
	let param = req.params, body=req.body; // Get data from req
	var table = param.table;
	var filter = objects.getKeyVals(req.params); // Create where filter from params
	var modelInstance = await getQueryResult(table,filter); // Get record from database
	if (user.id == modelInstance.data.auth || config.sysAdmin.includes(user.id)){ // Check if user is authorised to edit
		var toedit = {rowid:modelInstance.data.rowid};// Uniquely determine record to edit by primary key
		var redirUrl = req.protocol+'://'+req.get('host')+req.originalUrl; // Redirect to same page
		// Update record in database
		modelInstance.update({/*where:toedit,*/ updateFields:objects.dbtext(body)},()=>{
			res.redirect(redirUrl);
		});
		
	}else {return res.send('Problem: you are not authorised to edit this')}
} exports.post = post;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/edit.js > `+ ref); console.log(tolog); }
