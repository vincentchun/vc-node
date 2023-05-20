/* VC Web Apps: database.js
 * Copyright: Vincent Chun, VC Learning; Used under individual license.
 */
const sqlite = require('vc/sqlite'); exports.sqlite = sqlite;
const mysql = require('vc/mysql'); exports.mysql = mysql;

// Export functions
exports.select = select;
exports.insert = insert;
exports.update = update;
exports.remove = remove;//delete

// dbinfo -> get, insert, update, delete
function select(database, query={where:{}, columns:[], all:false, each:false}, callback=(x)=>{}){
	var selectFuncs = {
		sqlite: ()=>{return sqlite.select(database, database.table, query.where, query.columns, query, callback);},
		
	}
	return selectFuncs[database.dbms]();
}

function insert(database, query={fieldkeys:[], items:[]}, callback=(x)=>{}){
	var insertFuncs = {
		sqlite: ()=>{return sqlite.insert(database, database.table, query.fieldkeys, query.items, callback);}
	}
	return insertFuncs[database.dbms]();
}

function update(database, query={where:{}, updateFields:{}}, callback=(x)=>{}){
	var updateFuncs = {
		sqlite: ()=>{return sqlite.update(database, database.table, query.where, query.updateFields, query, callback);}
	}
	return updateFuncs[database.dbms]();
}

function remove(database, query={where:{fieldkey:value}}, callback){
	var removeFuncs = {
		sqlite: ()=>{return sqlite.remove(database, database.table, query.where, callback)}
	}
	return removeFuncs[database.dbms]();
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/database.js > `+ ref); console.log(tolog); }
/*/lg(select(require('vc/models').article.banana, {where:{rowid:1}}));
let models = require('vc/models');
let config = require('vc/config');
let a = new models.Article([{title:'My New Article', body:"Blah. Blak", date:'01/01/31'},{title:'Great Big Farticle', body:"PHHRRRAAT"}]);
let b = new models.Article({title:'My New Article', body:"Blah. Blak", date:'01/01/31'});

lg(a,'a');
lg(select(a.modelDatabase,{where:{[sqlite.pk]:3}},(x)=>{lg(x,'pk:3 (2)')}),'pk:3 (1)');
lg(a.field('title'),"a.field('title')");
lg(a.fieldSchema('input'),"a.fieldSchema('input')");
lg(a.render(),"a.render");
lg(a.field('title_date'),"a.field('title_date')");
lg(b.render(),"b.render");
*/
