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
exports.sqlSelect = sqlSelect;
exports.sqlInsertOne = sqlInsertOne;
exports.sqlInsert = sqlInsert;
exports.sqlUpdate = sqlUpdate;
exports.sqlDelete = sqlDelete;
//exports.sqlSelOne = sqlSelOne;
//exports.sqlSelAll = sqlSelAll;
//exports.sqlUpdateOne = sqlUpdateOne;
//exports.sqlUpdateMany = sqlUpdateMany;
//exports.sqlDeleteOne = sqlDeleteOne;
//exports.sqlDeleteMany = sqlDeleteMany;
exports.sqlAddTableColumn = sqlAddTableColumn;
exports.sqlRenameColumn = sqlRenameColumn;
exports.sqlChangeColumns = sqlChangeColumns;
// Database Handlers
exports.dbcreate = dbcreate;
exports.dbopen = dbopen;
exports.dbclose = dbclose;
exports.dbrun = dbrun;
exports.dbget = dbget; // Used in selectOne
exports.dball = dball; // Used in selectAll
exports.dbeach = dbeach; // Used in selectEach
// Select functions
exports.selectOne = selectOne;
exports.selectAll = selectAll;
exports.selectEach = selectEach;
exports.select = select;
// Qeury functions
exports.createTable = createTable;
exports.renameTable = renameTable;
exports.dropTable = dropTable;
// Insert
exports.insertOne = insertOne; // *addnew.ja
exports.insertMany = insertMany;
exports.insert = insertMany;
// Update
exports.uodateOne = updateOne;
exports.updateMany = updateMany; // *edit.js
exports.update = updateMany;
// Delete
exports.deleteOne = deleteOne;
exports.deleteMany = deleteMany;
exports.remove = deleteMany;
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
exports.andkeyeqval = andkeyeqval;
exports.where = where;
exports.valsfromkeys = valsfromkeys;
exports.valsfromkeysdq = valsfromkeysdq;
// Testing
exports.lg = lg;

// Variables and constants
var db; // Database object
var dbpath = config.dbpath; //lg(dbpath); // Database file
exports.ref = 'sqlite'; // Database reference
const pk = 'rowid'; // Default primary key
exports.pk = pk;
const allFields = [pk,'*'];
exports.allFields = allFields;
exports.cols = allFields;

var dbcon = config.databases.default_sqlite;

//========
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

function sqlSelect(tablename, whereid, columns=[], args={}){ // [columns], wherestring=`WHERE fname='Vincent'`
	var wherestring = where(whereid, args.any); // args.any if true: will return any (empty string) if whereid is empty
	var col=allFields, distinct='', argstring='', order='', limit='', offset='';
	if(columns[0]){col=columns.toString();}
	if(args.distinct){distinct=` DISTINCT`}
	if(args.orderby){order=` ${orderby(args.orderby)}`;}
	if(args.limit){limit=` ${limit(args.limit)}`;}
	if(args.offset){offset=` ${offset(args.offset)}`;}
	argstring = order+limit+offset;
	return `SELECT${distinct} ${col} FROM ${tablename} ${wherestring}${argstring}`; // 'DISTINCT' clause only difference from sqlSelOne
}

function sqlInsertOne(tablename, fields){
	return `INSERT INTO ${tablename}(${cskeys(fields)}) VALUES(${csvaldq(fields)})`;
}

function sqlInsert(tablename, fieldkeys, items){
	return `INSERT INTO ${tablename}(${csarray(fieldkeys)}) VALUES ${bcsvals(fieldkeys,items)}`;
}

function sqlUpdate(tablen, whereid, updateFields, args={}){
	var wherestring = where(whereid, false);
	var argstring='', order='', limit='', offset='';
	if(args.orderby){order=` ${orderby(args.orderby)}`;}
	if(args.limit){limit=` ${limit(args.limit)}`;}
	if(args.offset){offset=` ${offset(args.offset)}`;}
	argstring = order+limit+offset;
	return `UPDATE ${tablen} SET ${cskeyeqval(updateFields)} ${wherestring}${argstring}`;
}

function sqlDelete(tablen, whereid, args={}){
	var wherestring = where(whereid, false);
	var argstring='', order='', limit='', offset='';
	if(args.orderby){order=` ${orderby(args.orderby)}`;}
	if(args.limit){limit=` ${limit(args.limit)}`;}
	if(args.offset){offset=` ${offset(args.offset)}`;}
	argstring = order+limit+offset;
	return `DELETE FROM ${tablen} ${wherestring}${argstring}`;
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

//========
//Helper functions
function where(fields, anyIfEmpty=false){
	var filtstr=''; 
	var keys = Object.keys(fields);
	if (keys[0]){ //keys exist
		filtstr = "WHERE ".concat(andkeyeqval(fields));
	} else {
		filtstr = anyIfEmpty ? '' : where({[pk]:null});
	}
	return filtstr;
}

function orderby(colarray){
	return `ORDER BY ${csarray(collarray)}`;
}

function limit(n){
	return `LIMIT ${n}`;
}

function offest(n){
	return `OFFSET ${n}`;
}

// Comma separated array items // Just realised that array.tostring will produce the same result...
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

function csfieldvaldq(fieldkeys, obj){ // Handles undefined values
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
function andkeyeqval(fields){
	var keya = Object.keys(fields);
	var l=keya.length;
	if (l=0){return '';}
	var str = `${keya[0]}='${escape(fields[keya[0]])}'`;
	for (i=1;i<l;i++){
		str = str.concat(` AND ${keya[i]}='${escape(fields[keya[i]])}'`);
	}
	return str;
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
function selectOne(dbconnect, tablename, whereid, columns=[], args={}, withResult=(x)=>{}){
	var sql = sqlSelect(tablename, whereid, columns, args);
	return new Promise((resolve,reject)=>{
		dbget(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
}

function selectAll(dbconnect, tablename, whereid, columns=[], args={}, withResult=(x)=>{}){
	var sql = sqlSelect(tablename, whereid, columns, args);
	return new Promise((resolve,reject)=>{
		dball(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
}

function selectEach(dbconnect, tablename, whereid, columns=[], args={}, withResult=(x)=>{}){
	var sql = sqlSelect(tablename, whereid, columns, args);
	return new Promise((resolve,reject)=>{
		dbeach(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
}

// Select - combine
function select(database, table, whereid, columns, query, withResult=(x)=>{}){
	if (query.all){
		return selectAll(database, table, whereid, columns, query, withResult);
	} else 
	if (query.each){
		return selectEach(database, table, whereid, columns, query, withResult);
	} else {
		return selectOne(database, table, whereid, columns, query, withResult);
	}
}

// Insert
function insertOne(dbconnect, tablename, item, withResult=(x)=>{}){
	var sql = sqlInsertOne(tablename, item);//`INSERT INTO ${tablename}(${cskeys(fields)}) VALUES(${csvaldq(fields)})`
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});	
}

// insertMany - also exported as insert()
function insertMany(dbconnect, tablename, fieldkeys, items, withResult=(x)=>{}){
	var sql = sqlInsert(tablename, fieldkeys, items);
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
}
 
// Update
function updateOne(dbconnect, tablename, whereid, fields, args={limit:1}, withResult=(x)=>{}){ // LIMIT not work
	var sql = sqlUpdate(tablename, whereid, fields, args);//`UPDATE ${tablen} SET ${cskeyeqval(updateFields)} WHERE ${andkeyeqval(whereid)} LIMIT 1;`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
} 

function updateMany(dbconnect, tablename, whereid, updateFields, args={}, withResult=(x)=>{}){
	var sql = sqlUpdate(tablename, whereid, updateFields, args); //`UPDATE ${tablen} SET ${cskeyeqval(updateFields)} WHERE ${andkeyeqval(whereid)}`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
} 

// Delete
function deleteOne(dbconnect, tablename, whereid, args={limit:1}, withResult=(x)=>{}){
	var sql = sqlDelete(tablename, whereid);//`DELETE FROM ${tablen} WHERE ${andkeyeqval(whereid)} LIMIT 1`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
} 

function deleteMany(dbconnect, tablename, whereid, args={}, withResult=(x)=>{}){
	var sql = sqlDelete(tablename, whereid);//`DELETE FROM ${tablen} WHERE ${andkeyeqval(whereid)}`;
	return new Promise((resolve,reject)=>{
		dbrun(dbconnect, sql, [], (err,res)=>{withResult(res,err); resolve(res);});
	});
} 

// Table Alteration functions
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


//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/sqlite.js > `+ ref); console.log(tolog); }
//lg(sqlInsertMany('table',['name','email','phone'],[{name:'Vinc', email:'vc@g.c', phone:'040388'},{name:'buj', email:'bc@g.c'}]));
