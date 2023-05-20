/* VC Web Apps: mysql.js - MySQL database handler module
 * Copyright Vincent Chun, VC learning, used under license.
 */
var mysql = require('mysql');
const string = require('vc/string');
const config = require('vc/config');

exports.ref = 'mysql';
const pk = 'id';
exports.pk = pk;

// Function Exports
exports.connect = connect;
//== SQL creators
// SQL Statements
exports.sqlCreateDb = sqlCreateDb;
exports.sqlCreateTable = sqlCreateTable;
exports.sqlCloneTableSchema = sqlCloneTableSchema;
exports.sqlRenameTable = sqlRenameTable;
exports.sqlDropTable = sqlDropTable;
// Alter Table Statement
exports.alterTable = alterTable;
// Alter Table Options
exports.tRenameTable = tRenameTable;
exports.tAddColumn = tAddColumn;
exports.tRenameColumn = tRenameColumn;
exports.tDropColumn = tDropColumn;
exports.tAddIndex = tAddIndex;
exports.tAddPrimaryKey = tAddPrimaryKey;
exports.tAddUnique = tAddUnique;
exports.tAddForeignKey = tAddForeignKey;
exports.tAddCheck = tAddCheck;
exports.tDropConstraint = tDropConstraint;
exports.tAlterConstraint = tAlterConstraint;
exports.tAlgorithm = tAlgorithm;
exports.tAlterColumn = tAlterColumn;
exports.tAlterIndex = tAlterIndex;
exports.tChangeColumn = tChangeColumn;
exports.tCharSet = tCharSet;
exports.tConvertCharset = tConvertCharset;
exports.tDisableKeys = tDisableKeys;
exports.tEnableKeys = tEnableKeys;
exports.tDiscardTablespace = tDiscardTablespace;
exports.tImportTablespace = tImportTablespace;
exports.tDropIndex = tDropIndex;
exports.tDropPrimaryKey = tDropPrimaryKey;
exports.tDropForeignKey = tDropForeignKey;
exports.tForce = tForce;
exports.tLock = tLock;
exports.tModifyColumn = tModifyColumn;
exports.tOrderBy = tOrderBy;
exports.tRenameIndex = tRenameIndex;
exports.tValidation = tValidation;
// Alter table SQL
exports.sqlAddColumn = sqlAddColumn;
exports.sqlRenameColumn = sqlRenameColumn;
exports.sqlDropColumn = sqlDropColumn;
exports.sqlAddIndex = sqlAddIndex;
// Data Manipulation Statements
exports.sqlInsert = sqlInsert;
exports.sqlSelect = sqlSelect;
exports.sqlUpdate = sqlUpdate;
exports.sqlDelete = sqlDelete;
/*
exports.sqlUpdateOne = sqlUpdateOne;
exports.sqlUpdateMany = sqlUpdateMany;
exports.sqlDeleteOne = sqlDeleteOne;
exports.sqlDeleteMany = sqlDeleteMany;
*/
// Query Function
exports.query = query;
// Callbacks
exports.errlog = errlog;
// Helpers
exports.escape = escape;
exports.csarray = csarray;
exports.cskeys = cskeys;
exports.csvaldq = csvaldq;
exports.cskeyval = cskeyval;
exports.cskeyeqval = cskeyeqval;
exports.andkeyeqval = andkeyeqval;
exports.where = where;
// Database User
var dbuser = {
	host: "localhost",
	user: "yourusername",
	password: "yourpassword"
}

var dbcon = {
		host: 'localhost',
		user: 'me',
		password: 'secret',
		database: 'mydb'
}
//var connection = mysql.createConnection(dbcon);

function connect(cdetails){
	return mysql.createConnection(cdetails);
}

// SQL creators
// Create Database
function sqlCreateDb(dbname){
	var sql = `CREATE DATABASE ${dbname}`;
	return sql;
}

// Alter DB // - Character set, collate, encryption, read-only //

//## Create Table
function sqlCreateTable(tablename, fields, opts={autopk:true, ifnotexists:true, temporary:false}){
	const AUTOPK = {[pk]: "INT AUTO_INCREMENT PRIMARY KEY"};
	if (opts.autopk==true){
		fields = Object.assign(AUTOPK, fields);
	}
	var tmp = opts.temporary==true ? "TEMPORARY " : '';
	var inx = opts.ifnotexists==false ? '' : "IF NOT EXISTS ";
	var sql = `CREATE ${tmp}TABLE ${inx}${tablename} (${cskeyval(fields)})`
	return sql;
}

// - Clone Table
function sqlCloneTableSchema(tablename, tableToClone, opts={ifnotexists:true, temporary:false}){
	var tmp = opts.temporary==true ? "TEMPORARY " : '';
	var inx = opts.ifnotexists==false ? '' : "IF NOT EXISTS ";
	var sql = `CREATE ${tmp}TABLE ${inx}${tablename} LIKE ${tableToClone}`
	return sql;
}

// Rename Table
function sqlRenameTable(table_name, new_tablename){
	return alterTable(table_name, tRenameTable(new_tablename));
}

// Drop Table
function sqlDropTable(table_name, opts={temporary:false, ifexists:false, backup:false}){
	var tmp = opts.temporary==true ? 'TEMPORARY ' : '';
	var ixs = opts.ifexists==true ? 'IF EXISTS ' : '';
	var sql = `DROP ${tmp}${ixs}${table_name}`;
	return sql;
}

//== Alter Table
function alterTable(table_name, alter_options, partition_options){
	var part_opts = partition_options ? partition_options : ''; 
	if (typeof alter_options == 'string'){
		alter_options = [alter_options];
	}
	return `ALTER TABLE ${table_name} ${csarray(alter_options)}${part_opts}`;
}

function tRenameTable(new_tablename){
	return `RENAME TO ${new_tablename}`;
}

function tAddColumn(column_defs, args={location:''}){
	var location = args.location ? ' ' + args.location : '';
	let n = numprops(column_defs);
	if (n >1){location='';}
	return `ADD COLUMN (${cskeyval(column_defs)})${location}`;
}

function tRenameColumn(column, new_name){
	return `RENAME COLUMN ${column} TO ${new_name}`;
}

function tDropColumn(column){
	return `DROP COLUMN ${column}`;
}

function tAddIndex(key_parts, args={name:null, type:null, option:null, FULLTEXT:false, SPATIAL:false}){// incl FULLTEXT | SPATIAL
	var name = args.name ? args.name : '', ftsp='';
	type = args.type ? args.type : '', 
	option = args.option ? args.option : '';
	if (isString(key_parts)){key_parts=[key_parts];}
	if (args.SPATIAL){ftsp='SPATIAL '} else if (args.FULLTEXT){ftsp='FULLTEXT '} 
	return `ADD ${ftsp}INDEX ${name} ${type} (${csarray(key_parts)}) ${option}`;
}

// Add primary key
function tAddPrimaryKey(key_parts, args={symbol:null, index_type:null, index_option:null}){
	var symbol=ifexists(args.symbol), index_type=ifexists(args.index_type), index_option=ifexists(args.index_option);
	if (typeof key_parts == 'string'){key_parts = [key_parts];}
	return `ADD CONSTRAINT ${symbol} PRIMARY KEY ${index_type} (${csarray(key_parts)}) ${index_option}`;
}

function tAddUnique(key_parts, args={symbol:null, index_name:null, index_type:null, index_options:null}){
	var symbol=ifexists(args.symbol), index_name=ifexists(args.index_name), index_type=ifexists(args.index_type), index_options=ifexists(args.index_options);
	if (typeof key_parts == 'string'){keyparts = [key_parts];}
	return `ADD CONSTRAINT ${symbol} UNIQUE ${index_name} ${index_type} (${csarray(key_parts)}) ${index_options})`;
}

function tAddForeignKey(col_names, reference_def, args={symbol:null, index_name:null}){
	var symbol=ifexists(args.symbol), index_name=ifexists(args.index_name);
	return `ADD CONSTRAINT ${symbol} FOREIGN KEY ${index_name} (${csarray(col_names)}) ${reference_def}`;
}

function tAddCheck(expression, args={symbol:null, enforced:true}){
	var symbol=ifexists(args.symbol), enforced='';
	if (args.enforced){enforced='ENFORCED';}
	else {enforced='NOT ENFORCED';}
	return `ADD CONSTRAINT ${symbol} CHECK (${expression} ${enforced})`
}

function tDropConstraint(symbol){
	if(!symbol){symbol='';}
	return `DROP CONSTRAINT ${symbol}`;
}

function tAlterConstraint(symbol, args={enforce:false}){
	var enforced='';
	if(!symbol){symbol='';}
	if(args.enforce){enforced='ENFORCED';}
	else{enforced='NOT ENFORCED';}
	return `ALTER CONSTRAINT ${symbol} ${enforced}`;
}

function tAlgorithm(algorithm){
	if (!['DEFAULT','INSTANT','INPLACE','COPY'].includes(algorithm)){return}
	return `ALGORITHM ${algorithm}`;
}

function tAlterColumn(col_name, alteration){// alteration: SET DEFAULT {literal | (expr)} | SET {VISIBLE | INVISIBLE} | DROP DEFAULT
	return `ALTER COLUMN ${col_name} ${alteration}`;
}

function tAlterIndex(index_name, visible=true){
	var visibility='';
	if (visible){visibility='VISIBLE';} else {visibility='INVISIBLE';}
	return `ALTER INDEX ${index_name} ${visibility}`;
}

function tChangeColumn(old_column_name, new_column_name, column_definition, args={location:null}){
	var location=ifexists(args.location);
	return `CHANGE COLUMN ${old_column_name} ${new_column_name} ${column_definition} ${location}`;
}
// CHARACTER SET
function tCharSet(charset_name, collation_name){
	var collation='';
	if (collation_name){ collation= ` COLLATE ${collation_name}`;}
	return `CHARACTER SET ${charset_name}${collation}`
}
function tConvertCharset(charset_name, collation_name){
	return `CONVERT TO ` + tCharSet(charset_name, collation_name);
}
// DISABLE ENABLE KEYS
function tDisableKeys(){return "DISABLE KEYS";}
function tEnableKeys(){return "ENABLE KEYS";}
// DISCARD IMPORT TABLESPACE
function tDiscardTablespace(){return "DISCARD TABLESPACE";} 
function tImportTablespace(){return "IMPORT TABLESPACE";}
// DROP KEYS
function tDropIndex(index_name){
	return `DROP INDEX ${index_name}`;
}

function tDropPrimaryKey(){return "DROP PRIMARY KEY";}

function tDropForeignKey(fk_symbol){
	return `DROP FOREIGN KEY ${fk_symbol}`;
}

function tForce(){return "FORCE";}

function tLock(lockOption){
	if (['DEFAULT', 'NONE', 'SHARED', 'EXCLUSIVE'].includes(lockOption)){
		return lockOption;
	} else { return;}
}

function tModifyColumn(column_name, column_definition, args={location:null}){
	var location=ifexists(args.location);
	return `MODIFY COLUMN ${column_name} ${column_definition} ${location}`;
}

function tOrderBy(columns){
	if (typeof columns == 'string'){columns = [columns];}
	return `ORDER BY ${csarray(columns)}`;
}

function tRenameIndex(old_index_name, new_index_name){
	return `RENAME INDEX ${old_index_name} TO ${new_index_name}`;
}

// WITH VALIDATION
function tValidation(withValidation=true){
	if (withValidation){return "WITH VALIDATION";}
	else {return "WITHOUT VALIDATION";}
}

//function 
// Add Column
function sqlAddColumn(table_name, column_defs, args={location:''}){
	return alterTable(table_name, [tAddColumn(column_defs, args)]);
}

// Rename Column
function sqlRenameColumn(table_name, column, new_name){
	return alterTable(table_name, [tRenameColumn(column, new_name)]);
}

// Drop Column
function sqlDropColumn(table_name, column){
	return alterTable(table_name, [tDropColumn(column)]);
}

// Add Index (Key)
function sqlAddIndex(table_name, key_parts, args={name:'', type:'', option:''}){
	return alterTable(table_name, [tAddIndex(key_parts, {name:args.name, type:args.type, option:args.option})]);
	//`ALTER TABLE table_name ADD INDEX ${index_name} ${index_type} (${key_parts}) ${index_option}`;
}

//== Data Manipulation
// Insert
function sqlInsert(table_name, fields, opts={priority:null, ignore:null}){
	var priority ='', ig='';
	if (['LOW_PRIORITY','DELAYED','HIGH_PRIORITY'].includes(opts.priority)){
		priority = opts.priority + ' ';
	}
	if (opts.ignore){
		ig = 'IGNORE ';
	}
	return `TNSERT ${priority}${ig}INTO ${table_name} (${cskeys(fields)}) VALUES (${csvaldq(fields)})`;//Can have (value_list), (value_list)...
}

// Insert Many

// Select
function sqlSelect(table_name, args={columns:null, where:null, distinct:null, orderby:null, limit:null}){
	var where_expr = '', select_expr = '*', distinct = '', orderby='', limit='';
	if (args.columns){
		select_expr = `${csarray(args.columns)}`;
	}
	if (args.where){
		where_expr = ' ' + where(args.where);
	}
	if (args.distinct){
		distinct = ' DISTINCT';
	}
	if (args.orderby){
		orderby = ' ORDER BY ' + csarray(args.orderby);
		}
	if (args.limit){
		limit = ' LIMIT ' + args.limit;
		}

	return `SELECT${distinct} ${select_expr} FROM ${table_name}${where_expr}${orderby}${limit}`;
}

// Update
function sqlUpdate(table_name, args={assign:null, where:null, priority:null, ignore:null, orderby:null, limit:null}, opts={}){
	var priority ='', ig='', orderby='', limit='';
	var assign_list = cskeyeqval(args.assign);
	var where_exp = where(args.where);
	if (['LOW_PRIORITY','DELAYED','HIGH_PRIORITY'].includes(args.priority)){
		priority = opts.priority + ' ';
		}
	if (args.ignore){
		ig = 'IGNORE ';
		}
	if (args.orderby){
		orderby = ' ORDER BY ' + csarray(args.orderby);
		}
	if (args.limit){
		limit = ' LIMIT ' + args.limit;
		}
	return `UPDATE ${priority}${ig}${table_name} SET ${assign_list} ${where_exp}${orderby}${limit}`;//Can have (value_list), (value_list)...
}

// Delete
function sqlDelete(table_name, args={where:null, priority:null, quick:false, ignore:false, orderby:null, limit:1}){
	if (args.where===undefined){return;}
	var where_exp='', priority='', quick='', ignore='', orderby='', limit='';
	
	if (args.where){
		where_exp = ' ' + where(args.where);
	}
	
	if (args.priority=='LOW_PRIORITY'){priority='LOW_PRIORITY ';}
	if (args.quick){quick='QUICK ';}
	if (args.ignore){ignore='IGNORE ';}
	if (args.orderby){
		orderby=` ORDERBY ${args.orderby}`;
	}
	if (args.limit){
		limit=' LIMIT ' + args.limit;
	}
	return `DELETE ${priority}${quick}${ignore}FROM ${table_name}${where_exp}${orderby}${limit}`;
}

// Querying Database
async function query(connection, sql, callback){
	var result;
	connection.connect(function(err){
		if (err) {errlog(err);}
		result = connection.query(sql, callback);
	}
	);
	return await result;
}

// Callbacks
function errlog(err){
	if (err) {lg(err.message)}
}

// Helpers
// Escape single quotes from SQL field values
function escape(string){
	if (typeof string == 'string'){
		string = string.replace(/\'/g,"''");
	}
	return string;
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

// Values (enclosed in double quotes): "val1", "val2"
function csvaldq(fields){
	var vala = Object.values(fields);
	var l= vala.length;
	var str = `"${string.dq2xdq(vala[0])}"`;
	for (i=1;i<l;i++){
		str = str.concat(', ' + `"${string.dq2xdq(vala[i])}"`);
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

// Key = Value (comma separated), key1 = val1, key2 = val2 - used in SET
function cskeyeqval(fields){
	var keya = Object.keys(fields);
	var l=keya.length;
	var str = `${keya[0]}='${escape(fields[keya[0]])}'`;
	for (i=1;i<l;i++){
		str = str.concat(`, ${keya[i]}='${escape(fields[keya[i]])}'`);
	}
	return str;
}

// Key = Value (' AND ' separated): key1 = val1 AND key2 = val2 - used in WHERE
function andkeyeqval(fields){
	var keya = Object.keys(fields);
	var l=keya.length;
	var str = `${keya[0]}='${escape(fields[keya[0]])}'`;
	for (i=1;i<l;i++){
		str = str.concat(` AND ${keya[i]}='${escape(fields[keya[i]])}'`);
	}
	return str;
}

// WHERE filter
function where(fields){
	var filtstr='';
	var keyr = Object.keys(fields);
	if (keyr[0]){
		filtstr = "WHERE ".concat(andkeyeqval(fields));
	}
	return filtstr;
}
// Helper utilities
// Is array, not string
function isArray(a){
	if (Array.isArray(a) && typeof a != 'string'){
		return true;
	} else return false;
}
// Is string, not array
function isString(a){
	return typeof a == 'string';
}
// Number elems in object
function numprops(obj){
	return Object.keys(obj).length;
}
// Return value if exists, otherwise ''
function ifexists(val){
	if (val){return val;} 
	else {return '';}
}
/* Based on 
 * https://dev.mysql.com/doc/refman/8.0/en/alter-table.html
 * Presumed Key: [] optional, ... more, | or, {} encapsulating logic (not included in sql)*/

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/mysql.js > `+ ref); console.log(tolog); }
/*
lg(sqlCreateDb('mydb')); 
lg(sqlCreateTable('customers', {name: 'VARCHAR(255)', address: 'VARCHAR(255)'}, {autopk:true}));
lg(sqlCloneTableSchema('customers_new', 'customers', {autopk:true, temporary:true}));
lg(sqlRenameTable('customers_new', 'customers'));
lg(sqlDropTable('customers'));
lg(sqlAddColumn('customers', {phone: 'VARCHAR(255)', email:'VARCHAR(255)'}));
lg(alterTable('customers',[tAddColumn({phone:'VARCHAR(255)', email:'VARCHAR(255)'},{location:'FIRST'})]));
lg(sqlRenameColumn('customers','name','user'));
lg(sqlDropColumn('customers','address'));
lg(sqlInsert('customers',{name:'Vincent Chun',address:'9 Olympian Ave'},{priority:'HIGH_PRIORITY'}));
lg(sqlSelect('customers',{columns:['name','address'], where:{name:'Vincent Chun'}, orderby:['pk'], limit:10}));
lg(sqlUpdate('customers', {assign:{name:'joe'}, where:{name:'Vincent Chun'}, orderby:['customer'], limit:5}));
lg(sqlDelete('customers', {where:null, orderby:['pk']}));
lg(sqlDelete('customers', {where:{customer:'Vincent'}, orderby:['pk'], limit:1}));
lg({name:'Vince'}.length);
lg(sqlAddIndex('customers','pk',{type:'INT',name:'name',option:'g'}));
*/
