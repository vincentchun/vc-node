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

/*
async function getObjects(table,filter={}){
	var obs = db.selectAll(dbcon, table, filter, db.cols);
	var result = await Promise.resolve(obs);
	return result;
}
*/
async function getQueryResults(table, filter={}){
	var model = models[table];
	if (!model){return;}
	let modelInstance = new model();
	var qresult = await modelInstance.select({where:filter, all:true, any:true}); //lg(qresult, 'qresult');
	return qresult;
}
/*
async function listp(table, objectsp){
	var records = await objectsp;
	var listarray = [];
	records.forEach((rec)=>{
		listarray.push(renderListEntry(table, rec)); //lg(rec);
	});
	return listarray;//[htelement]
}

function renderListEntry(table, rec){
	entryarray = [];
	for (let [key,val] of Object.entries(rec)){
		var fielddiv = [];
		try{fielddiv.push(ht.create(ht.span, {'class':`fieldlabel ${key}`}, `${models[table][key].label}: `))}
		catch{fielddiv.push(ht.create(ht.span, {'class':`fieldlabel ${key}`}, `${key}: `))}//label
		if(val){
				fielddiv.push(field.render(table,key,val)); // Render val
			}
		entryarray.push(field.list(table,key,val));
		entryarray.push('<br>');
	}
	return ht.create(ht.a, {'class':`${table} list-entry tn`, style:'display:block;', href:`/display/${table}/${db.pk}/${rec[db.pk]}`}, entryarray);//htelement
}
*/
function entryHTML(record, listDisplay, labels, modelDB){
	var entryArray=[], label='';
	for (let [key,val] of Object.entries(listDisplay)){
		var fielddiv=[];
		let label = key;
		if (labels){
			label = labels[key] || '';
		}
		fielddiv.push(ht.create(ht.div, {class: `label ${key}`}, `${label} `));
		fielddiv.push(field.render(listDisplay[key], key, record[key]));
		entryArray.push(ht.create(ht.div,{class:`fielddiv ${key}`},fielddiv));
	}
	return ht.create(ht.a, {'class':`${modelDB.table} list-entry tn`, style:'display:block;', href:`/display/${modelDB.table}/${modelDB.pk}/${record[modelDB.pk]}`}, entryArray);
}

async function renderModList(qresult){
	var modelInstance = await qresult;
	var htmlArray = [];
	var modelDB = modelInstance.modelDB;
	var listArray = modelInstance.render();
	var listDisplay = modelInstance.fieldSchema.list;
	let listFields = modelInstance.frontEnd('list');
	if (Array.isArray(listFields)){// Is it an array of fields to include?
		listDisplay = objects.matchKeys(listFields, listDisplay);
	} else if (Array.isArray(listFields.fields)){// 
		listDisplay = objects.matchKeys(listFields.fields, listDisplay);
	}
	var labels =  modelInstance.fieldSchema.label;
	try{
		listArray.forEach((rec)=>{
			htmlArray.push(entryHTML(rec,listDisplay,labels,modelDB));
		});
	} catch{}
	return htmlArray;
}

async function html(table, qresult, user){
	var modelInstance = await qresult;
	var backButton = `<button onclick="window.history.back()" class='back-button'>Go Back</button>`;
	var body = []; //list = [];
	try {addHead = tmpl.pages(table).list.head;} catch(err){addHead='';}
	try {beforeContent = tmpl.pages(table).list.beforeContent({modelInstance:modelInstance});} catch(err){beforeContent='';}
	try {afterContent = tmpl.pages(table).list.afterContent({modelInstance:modelInstance});} catch(err){afterContent='';}
//	try {addFoot = tmpl.pages(table).list.foot;} catch(err){addFoot='';}
//	body.push(tmpl.logohead());
	body.push(beforeContent);
	body.push(ht.create(ht.div,{class:'listhead'},`${string.capitalize(table)} list`));
	if (modelInstance){
		if (modelInstance.frontEnd('list')){
			var recordList = await renderModList(modelInstance);
			if (recordList[0]){
				body.push(ht.create(ht.div,{class:'list'},recordList));
			} else {body.push(ht.create(ht.p,{},`No results found<br>${backButton}`))}
		} else {body.push(ht.create(ht.p,{},`No list display for ${table}<br>${backButton}`));}
		
	} else {body.push(ht.create(ht.p,{},`No results found for ${table}<br>${backButton}`))}
	body.push(afterContent);
	var page = ht.create(ht.div, {'class':'list'}, body);
	var pagehtml = tmpl.page({title:'Smartups', meta:{}, htmlhead:addHead, user:user, header:true, main:page});
	return pagehtml;
}

async function main(req,res){
	var user = req.userAuth; // Check user auth
	let params = req.params; // Get URL params from req
	var table = params.table;
	var filter = objects.getKeyVals(req.params); // Construct query filter from params
	var qresult = await getQueryResults(table,filter);
	res.send(await html(table, qresult, user));
}
exports.main = main;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/list.js > `+ ref); console.log(tolog); }
