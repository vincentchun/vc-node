// VC SQLite NodeJS module, ver 20201019 by Vincent Chun, VC Learning
const sqlite3 = require('sqlite3').verbose();
const string = require('vc/string');
const config = require('vc/config');

// Function Exports
// SQL creators
exports.escape = escape;
exports.sqlCreateTable = sqlCreateTable;
exports.sqlRenameTable = sqlRenameTable;
exports.sqlDropTable = sqlDropTable;
exports.sqlSelOne = sqlSelOne;
exports.sqlSelAll = sqlSelAll;
exports.sqlInsertOne = sqlInsertOne;
exports.sqlUpdateOne = sqlUpdateOne;
exports.sqlUpdateMany = sqlUpdateMany;
exports.sqlDeleteOne = sqlDeleteOne;
exports.sqlDeleteMany = sqlDeleteMany;
exports.sqlAddTableColumn = sqlAddTableColumn;
exports.sqlRenameColumn = sqlRenameColumn;
exports.sqlChangeColumns = sqlChangeColumns;
/*/ Callbacks
exports.doNothing = doNothing;
exports.pass = pass;
exports.consolog = consolog;
exports.logresult = logresult;
exports.restovar = restovar;*/
// Database Handlers
exports.dbcreate = dbcreate;
exports.dbopen = dbopen;
exports.dbclose = dbclose;
exports.dbrun = dbrun;
exports.dbget = dbget; // Used in selectOnep
exports.dball = dball; // Used in selectAllp
exports.dbeach = dbeach; // Used in selectEachp
//exports.prepare = db.prepare;
/*/ Wtih promise
exports.dbgetp = dbgetp; //
exports.dballp = dballp;
exports.dbeachp = dbeachp;*/
// Select functions
exports.selectOne = selectOne;
exports.selectAll = selectAll;
exports.selectEach = selectEach;
// Qeury functions
exports.createTable = createTable;
exports.renameTable = renameTable;
exports.dropTable = dropTable;
/*/ Select with promise
exports.selectOnep = selectOnep; // *display.js, edit.js
exports.selectAllp = selectAllp;
exports.selectEachp = selectEachp;*/
// Insert
exports.insertOne = insertOne; // *addnew
// Update
exports.uodateOne = updateOne;
exports.updateMany = updateMany; // *edit.js
// Delete
exports.deleteOne = deleteOne;
exports.deleteMany = deleteMany;
// Add, rename, delete table columns
exports.addTableColumn = addTableColumn;
exports.renameColumn = renameColumn;
exports.changeColumns = changeColumns;
exports.keepColumns = keepColumns;
exports.changeColumns = changeColumns; // Same function will work if changing constraints of a column, eg, 'unique'
// Helper functions
// limitone
exports.cskeyval = cskeyval;
exports.cskeys = cskeys;
exports.csvalsq = csvalsq;
exports.csvaldq = csvaldq;
exports.cskeyeqval = cskeyeqval;
exports.condkeyeqval = condkeyeqval;
exports.where = where;
exports.valsfromkeys = valsfromkeys;
exports.valsfromkeysdq = valsfromkeysdq;
// Testing
exports.lg = lg;

var db; // Database object
var dbpath = config.dbpath; //lg(dbpath); // Database file
exports.ref = 'sqlite'; // Database reference
const pk = 'rowid'; // Default primary key
exports.pk = pk;
const cols = [pk,'*'];
exports.cols = cols;
//defaultCallback = pass; // Default callback function

var dbcon = config.db.default_sqlite;
// SQL creators
function escape(string){
	if (typeof string == 'string'){
		string = string.replace(/\'/g,"''");
	}
	return string;
}

function sqlCreateTable(tablename, fields, opts={temporary:false, ifnotexists:true}){
	var tmp = opts.temporary == true ? "TEMPORARY " : '';
	var inx = opts.ifnotexists == false ? '': "IF NOT EXISTS ";
	var sql = `CREATE ${tmp}TABLE ${inx}${tablename} (${cskeyval(fields)})`
	return sql;
}

function sqlRenameTable(existing_tablename, new_tablename){
	return `ALTER TABLE ${existing_tablename} RENAME TO ${new_tablename}`;
}

function sqlDropTable(table_name, backup=false){
	return backup ? `ALTER TABLE ${table_name} RENAME TO ${table_name}_old` : `DROP TABLE ${table_name}`;
}

function sqlSelOne(tablename, columns, wherestring=''){
	var col;
	if(columns[0]){col=columns.toString();}
	else{col='*'}
	return `SELECT ${col} FROM ${tablename} ${wherestring}`;
}

function sqlSelAll(tablename, columns, wherestring=''){ // [columns], wherestring=`WHERE fname='Vincent'`
	var col;
	if(columns[0]){col=columns.toString();}
	else{col='*'}
	return `SELECT DISTINCT ${col} FROM ${tablename} ${wherestring}`; // 'DISTINCT' clause only difference from sqlSelOne
}

function sqlInsertOne(tablename, fields){
	return `INSERT INTO ${tablename}(${cskeys(fields)}) VALUES(${csvaldq(fields)})`;
}

function sqlInsertMany(tablename, fieldkeys, items){
	return `INSERT INTO ${tablename}(${csarray(fieldkeys)}) VALUES ${bcsvals(fieldkeys,items)}`;
}
function sqlUpdateOne(tablen, recordid, fieldupdate){ // LIMIT not work
	return `UPDATE ${tablen} SET ${cskeyeqval(fieldupdate)} WHERE ${condkeyeqval(recordid)} LIMIT 1;`;
}

function sqlUpdateMany(tablen, recordid, fieldupdate){
	return `UPDATE ${tablen} SET ${cskeyeqval(fieldupdate)} WHERE ${condkeyeqval(recordid)}`;
}

function sqlDeleteOne(tablen, whereid){
	return `DELETE FROM ${tablen} WHERE ${condkeyeqval(whereid)} LIMIT 1`;
}

function sqlDeleteMany(tablen, whereid){
	return `DELETE FROM ${tablen} WHERE ${condkeyeqval(whereid)}`;
}

function sqlAddTableColumn(table_name, column_def){// column_def: {name: text}
	return `ALTER TABLE ${table_name} ADD COLUMN ${cskeyval(column_def)}`;// eg column_def = 'name text'
}

function sqlRenameColumn(table_name, current_name, new_name){
	return `ALTER TABLE ${table_name} RENAME COLUMN ${current_name} TO ${new_name}`;
}

// Keep columns (array, to run one at a time) - for removing one or more columns from existing table (specify which ones to keep)
function sqlChangeColumns(table_name, columns_change_def, backup=true){ //Not Work - serialize?
	var remove_old = backup ? `ALTER TABLE ${table_name} RENAME TO ${table_name}_old;` : `DROP TABLE ${table_name};`;
	return [`PRAGMA foreign_keys=off;`, 
	`BEGIN TRANSACTION;`, 
	`CREATE TABLE IF NOT EXISTS ${table_name}_tmp (${cskeyval(columns_change_def)});`,
	`INSERT INTO ${table_name}_tmp (${cskeys(columns_change_def)}) SELECT ${cskeys(columns_change_def)}	FROM ${table_name};`,
	`${remove_old}`,
	`ALTER TABLE ${table_name}_tmp RENAME TO ${table_name};`,
	`COMMIT;`,
	`PRAGMA foreign_keys=on;`];
}


//-- Database Handlers
// create database
function dbcreate(dbconnect=dbcon, callback){
	if (typeof dbconnect == 'string'){var dbpath = dbconnect; var dbconnect = {path:dbpath};}
	return new sqlite3.Database(dbconnect.path, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, callback);
}

// open database
function dbopen(dbconnect=dbcon, callback/*=(err,res=`Connected SQLITE database: ${dbpath}`) => defaultCallback(err,res)*/){
	if (typeof dbconnect == 'string'){var path = dbconnect; var dbconnect = {path:path};} //lg(dbconnect.path);
	return new sqlite3.Database(dbconnect.path, sqlite3.OPEN_READWRITE, (err,res)=>{if(err){lg(err.message, 'dbopen:');}});
}

// close the database connection
function dbclose(db, callback/*=(err,res="Closed SQLITE database connection.") => defaultCallback(err,res)*/){
	db.close(callback);
}

function dbrun(dbconnect, sql, params=[], func=(x)=>{}){
		var db = dbopen(dbconnect);
		db.run(sql, params, func);
		dbclose(db);
}

// Used by selectOnep, selectAllp, selectEachp
function dbget(dbconnect, sql, params=[], func=(x)=>{}){ // func(err,res)
	var db = dbopen(dbconnect);
	db.get(sql, params, func);
	dbclose(db);
}

function dball(dbconnect, sql, params=[], func=(x)=>{}){ // func(err,res)
	var db = dbopen(dbconnect);
	db.all(sql, params, func);
	dbclose(db);
}

function dbeach(dbconnect, sql, params=[], func=(x)=>{}){ // func(err,res)
	var db = dbopen(dbconnect);
	db.each(sql, params, func);
	dbclose(db);
}

// Serialize SQL
function runserial(db, sqlarray){
	if (sqlarray[0]){
		let sql = sqlarray.shift(); lg(sql);
		db = db.run(sql);
		return runserial(db, sqlarray);
	} else {
		return db;
	}
}

function dbserialize(path, sqlarray=[]){
	var db = dbopen(path);
	db.serialize(()=>{
		runserial(db, sqlarray);
	})
	dbclose(db);
}


// Select functions
function selectOne(dbconnect, tablename, columns=[], whereobj={}, withResult=(x)=>{}){
	var wherestring = where(whereobj);
	var sql = sqlSelOne(tablename, columns, wherestring);
	return new Promise((resolve,reject)=>{
		dbget(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
} //exports.selectOne = selectOne;

function selectAll(dbconnect, tablename, columns=[], whereobj={}, withResult=(x)=>{}){
	var wherestring = where(whereobj);
	var sql = sqlSelAll(tablename, columns, wherestring);
	return new Promise((resolve,reject)=>{
		dball(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
}

function selectEach(dbconnect, tablename, columns=[], whereobj={}, withResult=(x)=>{}){
	var wherestring = where(whereobj);
	var sql = sqlSelOne(dbconnect, tablename, columns, wherestring);
	return new Promise((resolve,reject)=>{
		dbeach(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
}

// Insert
function insertOne(dbconnect, tablename, fields, withResult=(x)=>{}){
	var sql = sqlInsertOne(tablename, fields);//`INSERT INTO ${tablename}(${cskeys(fields)}) VALUES(${csvaldq(fields)})`
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
		
}

function insertMany(dbconnect, tablename, fields, items, withResult=(x)=>{}){
	var sql = sqlInsertMany(tablename, fields, items);
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
}
 
// Update
function updateOne(dbconnect, tablen, recordid, fieldupdate, withResult=(x)=>{}){ // LIMIT not work
	var sql = sqlUpdateOne(tablen, recordid, fieldupdate);//`UPDATE ${tablen} SET ${cskeyeqval(fieldupdate)} WHERE ${condkeyeqval(recordid)} LIMIT 1;`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
} 

function updateMany(dbconnect, tablen, recordid, fieldupdate, withResult=(x)=>{}){
	var sql = sqlUpdateMany(tablen, recordid, fieldupdate);//`UPDATE ${tablen} SET ${cskeyeqval(fieldupdate)} WHERE ${condkeyeqval(recordid)}`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
} 

// Delete
function deleteOne(dbconnect, tablen, whereid, withResult=(x)=>{}){
	var sql = sqlDeleteOne(tablen, whereid);//`DELETE FROM ${tablen} WHERE ${condkeyeqval(whereid)} LIMIT 1`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
} 

function deleteMany(dbconnect, tablen, whereid, withResult=(x)=>{}){
	var sql = sqlDeleteMany(tablen, whereid);//`DELETE FROM ${tablen} WHERE ${condkeyeqval(whereid)}`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res); resolve(res);});
	});
} 

// Query functions
function createTable(dbconnect, tablename, fields){
	var sql = sqlCreateTable(tablename, fields);//`CREATE TABLE IF NOT EXISTS ${tablename} (${cskeyval(fields)});`
	dbrun(dbconnect, sql);
} //exports.createTable = createTable;

function renameTable(dbconnect, existing_tablename, new_tablename){
	var sql = sqlRenameTable(existing_tablename, new_tablename);
	dbrun(dbconnect, sql);
}

function dropTable(dbconnect, table_name, backup=false){
	var sql = sqlDropTable(table_name, backup);
	dbrun(dbconnect, sql);
}

// Add, rename, delete table columns*/
function addTableColumn(table_name, column_def){
	var sql = sqlAddTableColumn(table_name, column_def);//return `ALTER TABLE ${table_name} ADD COLUMN ${column_def}`;// eg column_def = 'name text'
	dbrun(dbpath, sql);
}

function renameColumn(table_name, current_name, new_name){
	var sql = sqlRenameColumn(table_name, current_name, new_name);//return `ALTER TABLE ${table_name} RENAME COLUMN ${current_name} TO ${new_name}`;
	dbrun(dbpath, sql);
}

function changeColumns(table_name, columns_change_def, backup=true){
	sqla = sqlChangeColumns(table_name, columns_change_def, backup);
	dbserialize(dbpath, sqla);
}

function keepColumns(table_name, columns_keep_def, backup=true){
	sqla = sqlChangeColumns(table_name, columns_keep_def, backup);
	dbserialize(dbpath, sqla);
}

/*/ Select with promise
function selectOnep(tablename, columns=[], whereobj={}){
	var wherestring = where(whereobj);
	var sql = sqlSelOne(tablename, columns, wherestring);
	let promise = new Promise((resolve,reject)=>{
		dbget(dbpath, sql, [], (err,res)=>{resolve(res);});
		});
	return promise;	
}

function selectAllp(tablename, columns=[], whereobj={}){
	var wherestring = where(whereobj);
	var sql = sqlSelAll(tablename, columns, wherestring);
	let promise = new Promise((resolve,reject)=>{
		dball(dbpath, sql, [], (err,res)=>{resolve(res);});
		})
	return promise;
}

function selectEachp(tablename, columns=[], whereobj={}){
	var wherestring = where(whereobj);
	var sql = sqlSelOne(tablename, columns, wherestring);
	let promise = new Promise((resolve,reject)=>{
		dbeach(dbpath, sql, [], (err,res)=>{resolve(res);});
		})
	return promise; 
}

/* Insert -- Legacy, test new before removing
function insertOne(tablename, fields){
	var sql = sqlInsertOne(tablename, fields);//`INSERT INTO ${tablename}(${cskeys(fields)}) VALUES(${csvaldq(fields)})`
	dbrun(dbpath, sql);
}

// Insert with promise*
function insertOnep(tablename, fields){
	var sql = sqlInsertOne(tablename, fields);
	let promise = new Promise((resolve, reject)=>{
		dbrun(dbpath, sql, [], (err,res)=>{resolve(res);});
		})
	return promise;
}

/* Update -- Legacy, test new before removing
function updateOne(tablen, recordid, fieldupdate){ // LIMIT not work
	var sql = sqlUpdateOne(tablen, recordid, fieldupdate);//`UPDATE ${tablen} SET ${cskeyeqval(fieldupdate)} WHERE ${condkeyeqval(recordid)} LIMIT 1;`;
	dbrun(dbpath, sql);
} 

function updateMany(tablen, recordid, fieldupdate){
	var sql = sqlUpdateMany(tablen, recordid, fieldupdate);//`UPDATE ${tablen} SET ${cskeyeqval(fieldupdate)} WHERE ${condkeyeqval(recordid)}`;
	dbrun(dbpath, sql);
} 

// Update with promise
function updateOnep(tablen, recordid, fieldupdate){ // LIMIT not work
	var sql = sqlUpdateOne(tablen, recordid, fieldupdate);
	let promise = new Promise((resolve, reject)=>{
		dbrun(dbpath, sql, [], (err,res)=>{resolve(res)});
		})
	return promise;
} 

function updateManyp(tablen, recordid, fieldupdate){
	var sql = sqlUpdateMany(tablen, recordid, fieldupdate);
	let promise = new Promise((resolve, reject)=>{
		dbrun(dbpath, sql, [], (err,res)=>{resolve(res)});
		})
	return promise;
} 

// Delete -- Legacy, test new before removing
function deleteOne(tablen, whereid){
	var sql = sqlDeleteOne(tablen, whereid);//`DELETE FROM ${tablen} WHERE ${condkeyeqval(whereid)} LIMIT 1`;
	dbrun(dbpath, sql);
} 

function deleteMany(tablen, whereid){
	var sql = sqlDeleteMany(tablen, whereid);//`DELETE FROM ${tablen} WHERE ${condkeyeqval(whereid)}`;
	dbrun(dbpath, sql);
} 
*/
//Helper functions
function limitone(tablen, fields){
	
}

// Comma separated array items
function csarray(array){
	if (typeof array == 'string'){
		return array;
		}
	var l=array.length;
	var str = array[0];
	for (i=1; i<l; i++){
		str = str.concat(', ' + array[i]);
	}
	return str;
}

// Key Value pairs: key1 val1, key2 val2...
function cskeyval(fields){
	var keya = Object.keys(fields);
	var l=keya.length;
	var str = `${keya[0]} ${fields[keya[0]]}`;
	for (i=1;i<l;i++){
		str = str.concat(`, ${keya[i]} ${fields[keya[i]]}`);
	}
	return str;
}

// Keys: key1, key2...
function cskeys(fields){
	var keya = Object.keys(fields);
	var l= keya.length;
	var str = keya[0];
	for (i=1;i<l;i++){
		str = str.concat(', ' + keya[i]);
	}
	return str;
}
//exports.cskeys = cskeys;

// Values (enclosed in single quotes): 'val1', 'val2'
function csvalsq(fields){
	var vala = Object.values(fields);
	var l= vala.length;
	var str = `'${string.sq2x(vala[0])}'`;
	for (i=1;i<l;i++){
		str = str.concat(', ' + `'${string.sq2x(vala[i])}'`);
	}
	return str;
}
//exports.csvaldq = csvaldq;

// Values (enclosed in double quotes): "val1", "val2"
function csvaldq(fields){
	var vala = Object.values(fields);
	var l= vala.length;
	var str = `"${string.dq2x(vala[0])}"`;
	for (i=1;i<l;i++){
		str = str.concat(', ' + `"${string.dq2x(vala[i])}"`);
	}
	return str;
}
//exports.csvaldq = csvaldq;

function csfieldvaldq(fieldkeys, obj){
	var str = `"${string.dq2x(obj[fieldkeys[0]])}"`;
	for(let i=1; i<fieldkeys.length; i++){
		str = str.concat(`, "${string.dq2x( obj[fieldkeys[i]] == undefined ? '' : obj[fieldkeys[i]] )}"`);
	}
	return str;
}

// From field keys and array of items: (item1.val1, item1.val2...) (item2.val1, item2.val2...)
function bcsvals(fieldkeys, items){
	var str = `(${csfieldvaldq(fieldkeys,items[0])})`;
	for(let i=1; i<items.length; i++){
		str = str.concat(`, (${csfieldvaldq(fieldkeys,items[i])})`);
	}
	return str;
}

// Key = Value (no quotes), key1 = val1, key2 = val2 - used in SET
function cskeyeqval(fields){
	var keya = Object.keys(fields);
	var l=keya.length;
	var str = `${keya[0]}='${escape(fields[keya[0]])}'`;
	for (i=1;i<l;i++){
		str = str.concat(`, ${keya[i]}='${escape(fields[keya[i]])}'`);
	}
	return str;
}
// Conditional Key = Value: key1 = val1 AND key2 = val2 - used in WHERE
function condkeyeqval(fields){
	var keya = Object.keys(fields);
	var l=keya.length;
	var str = `${keya[0]}='${escape(fields[keya[0]])}'`;
	for (i=1;i<l;i++){
		str = str.concat(` AND ${keya[i]}='${escape(fields[keya[i]])}'`);
	}
	return str;
}

function where(fields){
	var filtstr='';
	var keyr = Object.keys(fields);
	if (keyr[0]){
		filtstr = "WHERE ".concat(cskeyeqval(fields));
	}
	return filtstr;
}

function valsfromkeys(keyr, fields){
	var valr=[], l=keyr.length;
	for (i=0; i<l; i++){
		valr.push(fields[keyr[i]]);
	}
	return valr;
}

function valsfromkeysdq(keyr, fields){
	var valr=[], l=keyr.length;
	for (i=0; i<l; i++){
		valr.push(`"${fields[keyr[i]]}"`);
	}
	return valr;
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/sqlite.js > `+ ref); console.log(tolog); }
lg(sqlInsertMany('table',['name','email','phone'],[{name:'Vinc', email:'vc@g.c', phone:'040388'},{name:'buj', email:'bc@g.c'}]));
