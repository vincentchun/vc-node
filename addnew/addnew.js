/* VC Web Apps: addnew.js - add new database record.
 * Copyright Vincent Chun, VC Learning
 */
// Dependencies
const auth = require('vc/auth');
const config = require('vc/config');
const ht = require('vc/html');
const db = require('vc/sqlite');
const tmpl = require('vc/templates');
//const field = require('vc/fielddisplay')
const url = require('vc/url');
const objects = require('vc/object');
const string = require('vc/string');
const form = require('vc/form');
const models = require('vc/models');
//const Busboy = require('busboy')
//const bodyParser = require('body-parser');
// Global constants & variables
const root = config.rooturl;
const dbcon = config.databases.default_sqlite;

async function getObject(table,filter={}){
	var business = db.selectOne(dbcon,table,['rowid','*'],filter);
	var result = await Promise.resolve(business);
	return result;
} exports.getObject = getObject;

function recordform(table, user){/*, objectp*/
	var model = models[table];
	let modelInstance = new model();
	let inputSchema = modelInstance.fieldSchema.input;
	let frontendAddnew = modelInstance.frontEnd('addnew');
	if (Array.isArray(frontendAddnew)){// Is it an array of fields to include?
			inputSchema = objects.matchKeys(frontendAddnew, inputSchema);
		} else if (Array.isArray(frontendAddnew.fields)){// Is it an object with a fields property, an array?
			inputSchema = objects.matchKeys(frontendAddnew.fields, inputSchema);
		}
	let labels = modelInstance.fieldSchema.label;
	// header
	var formArray=[];
	// head
	formArray.push(ht.create(ht.div, {'class':"tablename"}, `Add New ${string.capitalize(table)}:`));
	for (let key in inputSchema){ // For each key/val of object
		let type = inputSchema[key];//models[table][field].input;
		let flabel = labels[key];//models[table][field].label;
		//var inputattr = models[table][field].inputattr;
		form.addfielda({field:key, type:type, label:flabel/*, inputattr:inputattr*/}, formArray); 
		//form.addfielda(field, type, flabel, undefined, inputattr, formArray); 
	}
	formArray.push(ht.create(ht.input, {type:'hidden', id:'auth', name:'auth', value:user.id}));
	formArray.push(ht.create(ht.input, {type:'submit', value:'Save'}));
	var htmlform = ht.create(ht.form, {method:'POST', 'class':"record form"}, formArray);
	return htmlform;
} exports.recordform = recordform;

async function html(table,/* objectp,*/ user){
	var htmlr = [], body = [];
	try {addHead = tmpl.pages(table).addNew.head;} catch(err){addHead='';}
	try {beforeContent = tmpl.pages(table).addNew.beforeContent();} catch(err){lg(err); beforeContent='';}
	try {afterContent = tmpl.pages(table).addNew.afterContent();} catch(err){afterContent='';}
//	body.push(tmpl.logohead(root).render());
	body.push(beforeContent);
	var rec = recordform(table,user);
	if (! models.includeFrontEnd.includes(table)){ // In models.js: included/excluded from default views
		rec = ht.p({}, `We couldn't find anything matching your query`);
	}
	body.push(ht.create(ht.div, {}, rec));
	body.push(afterContent);
	var pagehtml = tmpl.page({title:`Smartups - add new ${table}`, meta:{}, htmlhead:addHead, user:user, header:true, main:body});
	return pagehtml;
}

async function main(req,res){
	var user = req.userAuth; //lg(user); // Get user auth from middleware or
	//var user = auth.getToken(req); //lg(user); // directly
	if (!user){return res.send('Authorisation required to add new')}
	let param = req.params;
	var table = param.table;
	//var filter = objects.getKeyVals(req.params);
	//var object = await getObject(table,filter);
	res.send(await html(table,/* Promise.resolve(object),*/ user))
} exports.main = main;

function log(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype){
		console.log(`${fieldname}: ${val}`);
}


async function post(req, res){
	// Check for required user auth
	var user = req.userAuth; //lg(user); // Get user auth from middleware or
	//var user = auth.getToken(req);// lg (user); // directly
	if (!user){return res.send('Authorisation required to add new')}
	// Get post request body to save to database
	let param = req.params, body=req.body;
	// Add auth field to body
	body.auth = user.id;// lg(user.id);
	// Get table name from url parameters
	var table = param.table;
	
	// Redirect URL
	var redirUrl = req.protocol+'://'+req.get('host')+'/list/'+table;
	
	// Insert body into database table
	//db.insertOne(dbcon,table, objects.dbtext(body));
	var model = models[table];
	let modelInstance = new model();
	modelInstance.insert({items:[body]}, ()=>{
		res.redirect(redirUrl);
	});
	
} exports.post = post;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/addnew.js > `+ ref); console.log(tolog); }
