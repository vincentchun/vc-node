/* VC Web Apps: DBModels.js
 * Copyright Vincent Chun, VC learning, used under license.
 * SQLite datatypes: NULL, INTEGER, REAL, TEXT, BLOB
 * !Important: export only classes and model objects for each class, as these are used directly in creating/updating the database
 */
// const vc = require(vc);
const fields = require('vc/fields')// vc.fields;
const obj = require('vc/object') // vc.objects ;
/*
class Model{ //constructor takes fields and merges them, includes method to retrieve schema
	constructor(modelobj){
		this.name = modelobj.name;
		this.fields = obj.mergeObjects(modelobj.fields,'fields');
		this.database = modelobj.database;
	}
};
*/
const Model = require('./modelEngine').Model;

class Join{ // for Many-to-Many relationships - create a separate table
	constructor(joinobj){ // joinobj={table1:'',table2:'', meta:{}}
		this[joinobj.table1] = fields.fkey(joinobj.table1);
		this[joinobj.table2] = fields.fkey(joinobj.table2);
		this.meta = joinobj.meta;
		this.constructor.name = joinobj.table1 + '_' + joinobj.table2;
	}
	
};

// User Authentication Model
const auth_fields = require('vc/auth').auth_fields; // {email, username, password, hash, sald}
const auth_model = {
	modelName: 'auth',
	modelFields: {
		fields: auth_fields
	},
	modelDB: {
		configdb: 'default_sqlite',
		table: 'auth'
	}
}

class Auth extends Model {
	constructor(dataObject){
		super(auth_model);
		this.data = require('vc/auth').makeAuth(dataObject);//dataObject; // Maybe set to/merge with below?
		//this.auth = require('vc/auth').makeAuth(dataObject);
	}
}
//const auth = require('vc/auth')// Auth
//Object.assign(exports, auth.authModels); lg(exports); //exports.Auth = auth.Auth;//exports.auth = auth.auth;

const article_model = {
	modelName: 'article',
	modelFields: {
		fields: {
			title: fields.title,
			date: fields.date,
			body: fields.html,
			meta: fields.json,
			status: fields.json,
			auth: fields.authsystem,
		},
		label: {
			title: 'Title',
			date: 'Date',
			body: '',
			meta: 'Meta',
			status: 'Status',
			auth: 'Owner'
		},
		mysql: {
			title: 'VARCHAR(255)',
			date: 'DATE',
			body: 'TEXT',
			meta: 'JSON',
			status: 'JSON',
			auth: 'FOREIGN KEY'
		},
		
	},
	modelDB: {
		configdb: 'default_sqlite',
		table: 'article',
		//pk: 'rowid'
	},
	includeFrontEnd: {
		display: true, list: ['title_date','body','date'], edit: true, addnew: true
	},
	dataMethods: {
		title_date: (obj)=>{return `${obj.title} (${obj.date})`;}
	},
	virtual: ['title_date']
};

class Article extends Model {
	constructor(dataObject,dataQuery={}){
		super(article_model);
		this.data = dataObject;
		this.query = dataQuery;
	}
};


// Business Model
const business_model = {
	modelName: 'business',
	modelFields: {
		fields: {
			name: Object.assign(fields.title, {label: 'Name'}),//{sqlite: 'TEXT', input:'text', display:'title', list:'strong'}, // Name
			address: Object.assign(fields.address, {label: 'Address'}),//{sqlite: 'TEXT', input:'address', display:'address'}, // Address
			tagline: Object.assign(fields.text, {label: 'Tagline'}),//{sqlite: 'TEXT', input:'text', display:'text', list:'text'}, // Tagline
			description: Object.assign(fields.ltext2, {label: 'Description'}), // Description
			image: Object.assign(fields.image, {label: 'Image'}),//{sqlite: 'TEXT', input:'image', display:'image'}, // Image (URL)
			json: Object.assign(fields.json, {label: 'meta'})//{sqlite: 'TEXT', input:'object', display:'object'}  // OBJ (JSON)
		}
	},
	modelDB: {
		dbms: 'mysql',
		table: 'business'
	},
	includeFrontend: {
		display: true, list: true, edit: true, addnew: true
	}
};

class Business extends Model {
	constructor(dataObject){
		super(business_model),
		this.data = dataObject
	}
}

// Allow models to be overridden by models.js in APPDIR
try {
	customModels = require(_APPDIR + '/models');
	if (customModels){
		// Custom models found - override all models here
		Object.assign(exports, customModels);//exports = require(_APPDIR + '/models');
	}
}
catch(err){
	lg(`VC Models: '${_APPDIR}/models' not found - using native VC models. \n - ` + err.message, 'Import'); customModels = null;
}

// Include in Default Front End (Whitelist)
exports.includeFrontEnd = exports.includeFrontEnd ? exports.includeFrontEnd : [];
exports.includeFrontEnd.push('article');

// Exclude from Default Front End (Blacklist - not used by default have to edit Display, Edit & AddNew to use)
exports.excludeFrontEnd = exports.excludeFrontEnd ? exports.excludeFrontEnd : [];
//exports.excludeFrontEnd.push('auth');

// Exports - Model Classes (first letter capitalized) and Field Definitions (lowercase)
exports.Model = Model;
exports.article = Article;
//exports.article = new Article().fieldSchema;
exports.auth = Auth;
//exports.auth = new Auth().fieldSchema;
//exports.Business = Business;
//exports.business = new Business().modelFields;


//== Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/models.js > `+ ref); console.log(tolog); }

