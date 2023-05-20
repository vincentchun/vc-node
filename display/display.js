/* VC Web Apps: display.js - display database record.
 * Copyright Vincent Chun, VC Learning
 */
// Dependencies
const config = require('vc/config')
const ht = require('vc/html')
const db = require('vc/sqlite')
const tmpl = require('vc/templates')
const field = require('vc/fields/fielddisplay')
const models = require('vc/models')
const objects = require('vc/object')
const string = require('vc/string')
const url = require('vc/url')
const auth = require('vc/auth')
// Global constants & variables
var rooturl = config.rooturl;
const dbcon = config.databases.default_sqlite;

async function getQueryResult(table, filter={}){
	var model = models[table];
	if (!model){return;}
	let modelInstance = new model();
	var qresult = await modelInstance.select({where:filter, any:false}); //lg(qresult, 'qresult');
	return qresult;
}

async function record(table, qresult, user){
	var modelInstance = await qresult;
	
	if (!modelInstance){return ht.create(ht.p({}, `We couldn't find anything matching your query`));;}
	var dataObject = modelInstance.render();
	var display=[], displayhead=[], recdisplay=[];
	// Create displayhead, add to display
	displayhead.push(ht.div({'class':"tablename"}, string.capitalize(table)));
	try{// If authorised to edit, add edit link
		if (user.id == dataObject.auth || config.sysAdmin.includes(user.id)){
			displayhead.push(ht.create(ht.div, {class:'options'}, tmpl.editico({href:`/edit/${table}/${db.pk}/${dataObject[db.pk]}`, title:'Edit'})));
		}
	} catch(err){/*lg(err.message);*/}
	display.push(ht.create(ht.div, {class:'displayhead flexrnw jb'},displayhead));
	// Create recdisplay, add to display
	if (dataObject){
		let displaySchema = modelInstance.fieldSchema.display;
		let frontendDisplay = modelInstance.frontEnd('display');
		if (Array.isArray(frontendDisplay)){// Is it an array of fields to include?
			displaySchema = objects.matchKeys(frontendDisplay, displaySchema);
		} else if (Array.isArray(frontendDisplay.fields)){// Is it an object with a fields property, an array?
			displaySchema = objects.matchKeys(frontendDisplay.fields, displaySchema);
		}
		let labels = modelInstance.fieldSchema.label;
		for (let [key,val] of Object.entries(displaySchema)){ // For each key/val of object
			//recdisplay.push("<br>");
			var fielddiv = [];
			let fieldDisp = displaySchema[key];
			let value = dataObject[key];
			// Add Label
			let label = key;
			if (labels){
				label = labels[key] || '';
			}
			fielddiv.push(ht.create(ht.div, {'class':`label ${key}`}, `${label} `))
			// If Field Value exists, render it
			if(val){
				fielddiv.push(field.render(fieldDisp,key,value));
			}
			recdisplay.push(ht.create(ht.div, {'class': `fielddiv ${key}`},fielddiv));
		}
		display.push(ht.create(ht.div,{class:`record ${table}`}, recdisplay));
	}
	var html = ht.create(ht.div, {'class':"display"}, display);
	return html;
}

async function html(table, qresult, user){
	var modelInstance = await qresult;
	var body = [];
	try {addHead = tmpl.pages(table).display.head;} catch(err){addHead='';}
	try {beforeContent = tmpl.pages(table).display.beforeContent({modelInstance:modelInstance});} catch(err){beforeContent='';}
	try {afterContent = tmpl.pages(table).display.afterContent({modelInstance:modelInstance});} catch(err){afterContent='';}
//	try {addFoot = tmpl.pages(table).display.foot;} catch(err){addFoot='';}
//	body.push(tmpl.logohead());
	body.push(beforeContent);
	if (modelInstance){
		if (modelInstance.frontEnd('display')){
			var rec = await record(table, modelInstance, user);
			body.push(rec);
		} else {body.push(ht.create(ht.p,{},`No display for ${table}`));}
	} else {
		body.push(ht.create(ht.p,{},`No results for ${table}`));
	}
	body.push(afterContent);
	var pagehtml = tmpl.page({title:'Smartups', meta:{}, htmlhead:addHead, user:user, header:true, main:body});
	return pagehtml;
}

async function main(req,res){
	var user = req.userAuth;
	let param = req.params;
	var table = param.table;
	var filter = objects.getKeyVals(req.params);
	var qresult = await getQueryResult(table,filter); //lg(qresult);
	res.send(await html(table, qresult, user))
}
exports.main = main;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/display.js > `+ ref); console.log(tolog); }
