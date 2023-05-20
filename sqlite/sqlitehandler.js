/* VC Web Apps: DB Handler (SQLite)
 * Copyright: VC Web Apps by Vincent Chun, VC Learning. Used under license.
 */
const db = require('vc/sqlite')
const rx = require('vc/regex')
const models = require('vc/models')
// Function Exports
exports.modelSchema = modelSchema;
exports.createTables = createTables;
exports.insertOne = insertOne;
exports.getTablesp = getTablesp;
exports.logTables = logTables;
exports.sqlcreateTable = sqlcreateTable;
exports.tableSchemafromSQL = tableSchemafromSQL;
exports.addTableColumn = addTableColumn;
//exports.readSQL = readSQL;


function modelSchema(model, schema){ //get schema (eg, 'sqlite') for model fields: {fieldname: {sqlite: param, input:param...}...}
	var params = {};
	for (let [key,val] of Object.entries(model)){
		try{params[key] = val[schema];} catch{lg(`${model.constructor.name} - ${key} ${val}`,'modelSchema: warning')/*val may be undefined*/}
	}
	return params;
} exports.modelSchema = modelSchema;

// Ignore constructors
var ignoreConstr = [Function, Array];

// Create database tables -- Deprecated
function createTables(models){
//	var i, l = models.length;
	for (let [key,val] of Object.entries(models)){
		if (val.constructor !== Function){
			var tableName = val.constructor.name.toLowerCase();
			var columns = modelSchema(val,'sqlite');
//			console.log(tableName); console.log(columns); // testing only
			if (tableName && columns){
				db.createTable(tableName, columns);
			} else { console.log(`dbhandler.js > Error creating database table: ${tableName}`);
			}
		}
	}
}

//*/
// For comparision
function sqlcreateTable(models=models, ifnotexists=1){
	var array=[];
	for (let [key,val] of Object.entries(models)){
		if (! ignoreConstr.includes(val.constructor)){
			var tableName = val.constructor.name.toLowerCase();
			var columns = modelSchema(val,'sqlite');
			//console.log(tableName); console.log(columns); // testing only
			if (tableName && columns){
				array.push(
					{name: tableName, 
						tbl_name: tableName, 
						sql: db.sqlCreateTable(tableName, columns, ifnotexists)
					});
			} else { lg(tableName, 'sqlcreateTable');
			}
		}
	}
	return array;
}

// Insert one from object only (needs constructor)
function insertOne(object){
	var tableName = object.constructor.name.toLowerCase();
	db.insertOne(tableName,object);
}

async function getTablesp(fields=['rowid', '*']){
	var sql = `SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';`//Not used
	var tables = db.selectAllp('sqlite_master', fields, {type: 'table'});
	var result = await Promise.resolve(tables);
//	lg(result);
	return result;
}

async function logTables(){
	tables = await getTablesp();
	lg(tables,'logTables');
}

function lgt3(str){
	return str.length > 3;
}

// Get tableSchema from SQL
function tableSchemafromSQL(sql){
	var splts = sql.split(rx.charinc('()','g'));
	splts[0] = splts[0].split(rx.rx('(\\s)')); // /(\s)/g
	splts[2] = splts[2].split(rx.rx('(,\\s)'));
	splts[2] = splts[2].filter(lgt3);
	for (let i=0; i<splts[2].length; i++){
		splts[2][i] = splts[2][i].split(' ');
	}
//	lg(splts);

	var colobj = {};
	for (let i=0; i<splts[2].length; i++){
		colobj[splts[2][i][0]] = splts[2][i][1];
	}
//	lg(colobj);
	return {name: splts[0][4], columns: colobj}
}

function addTableColumn(table_name, column, testOnly=false){
	if (models[table_name]){
		if (models[table_name][column]){
			if (models[table_name][column].sqlite){
				var coldef = {[column]: models[table_name][column].sqlite};
				var sql = db.sqlAddTableColumn(table_name, coldef);
				if (testOnly){
					lg(sql, 'Test - addTableColumn SQL:');//Test
					return sql;
				} else {
					db.addTableColumn(table_name, coldef);
					return sql;
				}
			} else {
				lg(`Error: No SQLITE definition for ${column}, column not added.`);
				}
		} else {
			lg(`Error: ${column} not defined in models.js for ${table_name}, column not added.`);
		}
	} else {
		lg(`Table ${table_name} not defined in models.js`);
	}
}
		
		
//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/sqlitehandler.js > `+ ref); console.log(tolog); }
