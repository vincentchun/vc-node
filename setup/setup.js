/* VC Web Apps: setup.js
 * Copyright Vincent Chun, VC Learning
 */
_ROOTURL = `http://localhost:3000`;
//_APPDIR = __dirname;
const config = require('vc/config.js');
const models = require('vc/models.js');
const db = require('vc/sqlite.js');
const dbhandler = require('vc/sqlite/sqlitehandler.js');
const objects = require('vc/object');
const array = require('vc/array');
const fs = require('fs');

// Function exports
exports.main = main;

let timestamp = '_'+ new Date().toISOString().split('T')[0]; lg(timestamp);
var updatestr = '';

main();

async function main(){
	//db.dbcreate();// ! Create Database
	//dbhandler.createTables(models);// ! Create Tables
	dbtablesa = await dbhandler.getTablesp(); lg(dbtablesa,'Tables from database master table');
	sqlcreatetablesa = dbhandler.sqlcreateTable(models, 0);
	dbtablesafilt = array.doEach(dbtablesa, a=>{return {name: a.name, tbl_name: a.tbl_name, sql: a.sql}});
	var dbtableso = objects.obArraytoObj(dbtablesafilt, 'name'); 
	var modelsqlo = objects.obArraytoObj(sqlcreatetablesa, 'name');
	lg(dbtableso, "Existing database tables");
	lg(modelsqlo, "SQL from Models.js");
//	var compareDBTables = objects.compare(dbtableso, modelsqlo);
//	lg(compareDBTables, "DB tables compared to models.js");
	compareTablesModels(dbtableso, modelsqlo);
	if (updatestr){
		var reqs = `/* DATABASE UPDATE SCRIPT, GENERATED: ${Date.now().toString()} - DELETE AFTER USE */\n
		/*Dependencies: */\n
		_APPDIR = __dirname; const vc = require('vc'); const models = vc.models; const db = vc.sqlite; const dbhandler = vc.sqlitehandler; \n\n 
		/* Review, edit suggestions, and uncomment changes you wish to make to database. */\n\n`.replace(/\t+/g, '	');
		var updatestring = reqs + updatestr + `\n//Print confirmation:\nconsole.log("dbupdatescript${timestamp}.js has run - run setup.js again to view resulting table schema.")`;
	}
	if (updatestring){
		lg(updatestring, `dbupdatescript${timestamp}.js`);
		fs.writeFile(`${_APPDIR}/dbupdatescript${timestamp}.js`, updatestring, (err)=>{
			if (err) {
				lg(err.message); 
				throw err;
			}
			lg(`${_APPDIR}/dbupdatescript_${timestamp}.js written - review & edit script, then run with Node.js to update`, '\nSetup Result:')
		});
	} else {
		lg(`No discrepancies detected between database and models.js`, '\nSetup Result:');
	}
//	lg(objects.compare({a:1, b:2, c:3, d:4}, {a:1, b:3, e:5}), 'test');


}

function filterDbtablea(arr){
	return array.doEach(arr, (a)=>{return {name:a.name, tbl_name:a.tbl_name, sql: a.sql}});
}
//Comparing database schema - tables and models
function compareTablesModels(dbtableso, modelsqlo){
	var compareDBTables = objects.compare(dbtableso, modelsqlo);
	lg(compareDBTables, "DB tables ('a') compared to models.js ('b') \n Note: Database tables object may differ in properties, so might not be 'equal'. Match by name, then by SQL.");
//	lg(compareDBTables.notEqual.length, "array");
	for (key of compareDBTables.equal){
		lg(`Database table:`, `Match - ${key}:`);
			lg(dbtableso[key].sql); 
			lg(`Models create table SQL:`);
			lg(modelsqlo[key].sql);
	}
	for (key of compareDBTables.notEqual){
		lg(key); //lg(dbtableso[key]); lg(modelsqlo[key]);
		if (dbtableso[key].sql == modelsqlo[key].sql || sameTableSchema(dbtableso[key], modelsqlo[key])){ // SQL same, match
			lg(`Database table:`, `Match - ${key}:`);
			lg(dbtableso[key].sql,'',''); 
			lg(`Models create table SQL:`,'');
			lg(modelsqlo[key].sql,'','');
		} else { // Not Match
			lg(`Database table:`, `Possible Not Match - ${key}:`);
			lg(dbtableso[key].sql); 
			lg(`Models create table SQL:`);
			lg(modelsqlo[key].sql);
			// Compare CREATE TABLE SQL
			compareTableSchema(dbtableso[key], modelsqlo[key]);
		}
	}
	for (key of compareDBTables.anotb){
		lg(`In database, but not in models.js (delete or rename?)- ${key}`)
		console.log(dbtableso[key].sql); 
		console.log(`Models create table SQL:`);
		try{let modelsql = modelsqlo[key].sql}catch{modelsql = "No Model for ${key}"}
		console.log(modelsql);
		// Delete or rename (compare with bnota)
		var sameSchema = compareDBTables.bnota.filter((tbl)=>{return sameTableSchema(dbtableso[key], tbl)});
		if (sameSchema[0]){
			updatestr = updatestr.concat(`\n/* RENAME table ${dbtableso[key].name} to ${sameSchema}? */ \n\n 
			/*== UNCOMMENT LINE to rename table => */\n//	db.renameTable('${dbtableso[key].name}' '<renamed table name>');
			/* <= <renamed table name> from models.js: [ ${sameSchema} ] */\n\n 
			/*	Note:	{SQL}>> ${db.sqlRenameTable('${dbtableso[key].name}', '<renamed table name>')} */\n
			/* **OR** */`.replace(/\t+/g, '	'));
		}
		updatestr = updatestr.concat(`\n/* Delete (DROP) table ${dbtableso[key].name}
		WARNING: Make sure you really want to do this! */\n\n 
		/*== UNCOMMENT LINE to drop table ${dbtableso[key].name} => */
		\n//	db.dropTable('${dbtableso[key].name}'); \n\n
		/*	Note:	{SQL}>> ${db.sqlDropTable(dbtableso[key].name)} */\n\n`.replace(/\t+/g, '	'))
		
	}
	for (key of compareDBTables.bnota){
		lg(`Not in database, but in models.js (add to database?) - ${key}`)
		try{let tablesql = dbtableso[key].sql} catch{ tablesql = `no table SQL for ${key}`}
		console.log(tablesql); 
		console.log(`Models create table SQL:`);
		console.log(modelsqlo[key].sql);
		// Add to database?
		updatestr = updatestr.concat(`\n/* CREATE TABLE ${key} */\n\n/* UNCOMMENT LINE to create table ${key} =>*/\n// db.dbrun("${config.dbpath}","${modelsqlo[key].sql}");`.replace(/\t+/g, '	'))
	}
	if (compareDBTables.anotb[0] && compareDBTables.bnota[0]){
		updatestr = updatestr.concat(`\n\n/* Rename table regardless of inequality in schema? */\n\n
		/* SPECIFY TABLES TO RENAME AND UNCOMMENT LINE to rename tables => */
		\n//	db.renameTable('<database_table>', '<model_name>')\n
		/* <= select <database_table> from [${compareDBTables.anotb}], select <model_name> from [${compareDBTables.bnota}] */`.replace(/\t+/g, '	'))
	}
}

function sameTableSchema(dbtableo, modelsqlo){
	dbtable = dbhandler.tableSchemafromSQL(dbtableo.sql); model = dbhandler.tableSchemafromSQL(modelsqlo.sql);
	var comparison = objects.compare(dbtable.columns, model.columns);
	if (comparison.equal[0] && !comparison.notEqual[0] && !comparison.anotb[0] && !comparison.bnota[0]){
		return true;
	} else {
		return false;
	}
}	

// Comparing table schema - fields
function compareTableSchema(dbtableo, modelsqlo){
	if (! dbtableo.type && modelsqlo.type =='table'){ // Make sure we've got it the right way around.
		Object.assign(subs, modelsqlo);
		Object.assign(modelsql, dbtableo);
	}
	if (dbtableo.name != modelsqlo.name){
		lg(`Error - names don't match:\nDatabase: ${dbtableo.name}, Models.js: ${modelsqlo.name}`);
		return;
	}
	var dbTableSQLobj = dbhandler.tableSchemafromSQL(dbtableo.sql);
	var modelSQLobj = dbhandler.tableSchemafromSQL(modelsqlo.sql);
	var compareTableSQL = objects.compare(dbTableSQLobj.columns, modelSQLobj.columns);
	var columnsToDelete = [], columnsToChange=[];
	lg(compareTableSQL,`Field comparison for table: ${dbtableo.name}`);
	// Comparison
	for (key of compareTableSQL.equal){
		lg(`Matching fields between database & models.js (don't change) - ${dbtableo.name}:`);
		lg(dbTableSQLobj.columns[key], `DB: ${key}`, '');
		lg(modelSQLobj.columns[key], `models.js: ${key}`, '');
	}
	for (key of compareTableSQL.notEqual){
		lg(`WARNING: Inconsistent field types between database & models.js - ${dbtableo.name}:`);
		lg(dbTableSQLobj.columns[key], `DB: ${key}`, '');
		lg(modelSQLobj.columns[key], `models.js: ${key}`, '');
		updatestr = updatestr.concat(`\n/*WARNING: Inconsistent field types between database & models.js - ${dbtableo.name}: ${key} \nDatabase: ${dbTableSQLobj.columns[key]} \nmodels.js: ${modelSQLobj.columns[key]} \n Attempt to change/update column definitions?*/` 
		);
		columnsToChange.push(key);
	}
	for (key of compareTableSQL.anotb){
		lg(`In database but not in models.js, (may include rowid/pk, compare below for possible name changes) - ${dbtableo.name}:`);
		lg(dbTableSQLobj.columns[key], `DB: ${key}`, '');
		lg(modelSQLobj.columns[key], `models.js: ${key}`, '');
		updatestr = updatestr.concat(`\n/*======== In database but not in models.js: '${key}' */\n`);
		if (compareTableSQL.bnota[0]){
			// Check if renaming might be desired
			var maybeRename = compareTableSQL.bnota.filter((dbkey)=>{return dbTableSQLobj.columns[key] == modelSQLobj.columns[dbkey]});
			updatestr = updatestr.concat(`/* RENAME COLUMN '${key}' to one of [ ${maybeRename} ]? (Specify one)*/\n\n
			/*== UNCOMMENT LINE to rename column =>*/
			\n//	db.renameColumn('${dbtableo.name}', '${key}', '<rename to>'); /* <= Select <rename to> from: [ ${maybeRename} ] */\n\n
			/* Note:	{SQL}>> ${db.sqlRenameColumn(dbtableo.name, key, maybeRename)} */\n\n
			/* **OR** Create new columns for [ ${maybeRename} ] below.*/\n`.replace(/\t+/g, '	'))
		} else {
			columnsToDelete.push(key);			
		}
	}
	for (key of compareTableSQL.bnota){
		lg(`Not in database but in models.js, compare above (anotb) for name changes, or add to database? - ${dbtableo.name}:`);
		lg(dbTableSQLobj.columns[key], `DB: ${key}`, '');
		lg(modelSQLobj.columns[key], `models.js: ${key}`, '');
		updatestr = updatestr.concat(`\n/*======== Not in database but in models.js: '${key}' */\n//ADD NEW COLUMN '${key}' \n\n/*== UNCOMMENT LINE to add column to table => */\n//dbhandler.addTableColumn('${dbtableo.name}', '${key}'); \n\n/*	Note:	{SQL}>> ${dbhandler.addTableColumn(dbtableo.name, key)}*/ \n`.replace(/\t+/g, '	')); 
	}
	if (columnsToDelete[0]){
		var newColumnsDef = {}; 
		Object.assign(newColumnsDef, dbTableSQLobj.columns);
		for (i=0; i<columnsToDelete.length; i++){
			delete newColumnsDef[columnsToDelete[i]];
		}
		updatestr = updatestr.concat(`/*======== In database, no suitable replacement in models.js with same type.\n
		Delete (drop) columns ${columnsToDelete}? WARNING: Be sure you want to do this! \n
		--Create table to match models.js, copy desired table rows to keep over, drop old table, rename new table
		*/\n
		/*== UNCOMMENT LINE to delete columns ${JSON.stringify(columnsToDelete)}=>*/\n//db.keepColumns('${dbtableo.name}', ${JSON.stringify(modelSQLobj.columns)}, true);
		/* Note: setting last argument to true backs up entire table as '${dbtableo.name}_old'*/\n\n`.replace(/\t+/g, '	'));
		updatestr = updatestr.concat(`/*	Note:	{SQL)>> ${db.sqlKeepColumns(dbtableo.name, modelSQLobj.columns, false)}\n */`);
	}
	if(columnsToChange[0]){
		updatestr = updatestr.concat(`/*== UNCOMMENT LINE to change column definitions ${JSON.stringify(columnsToDelete)}=>*/\n //WARNING: May result in errors or loss of data, proceed with caution!\n//db.changeColumns('${dbtableo.name}', ${JSON.stringify(modelSQLobj.columns)}, true);
		/* Note: setting last argument to true backs up entire table as '${dbtableo.name}_old'*/\n\n`.replace(/\t+/g, '	'));
	}
	
}		

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/setup.js > `+ ref); console.log(tolog); }
