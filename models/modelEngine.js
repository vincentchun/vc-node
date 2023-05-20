// VC Web Apps - modelEngine.js, Copyright Vincent Chun, VC Learning
const config = require('vc/config');
const db = require('vc/database');
//const obj = require('vc/objects') // vc.objects ;

class Model{ //constructor takes fields and merges them, includes method to retrieve schema
	constructor(modelobj){
		var name = modelobj.modelName, fields=modelobj.modelFields, modelDB = modelobj.modelDB, incFrontEnd = modelobj.includeFrontEnd, dataMethods = modelobj.dataMethods, virtual = modelobj.virtual;
		
		if (!name && !modelDB.table){console.log("ERROR: No modelName or modelDB.table defined in model");}
		else if (name && !modelDB.table){
			console.log(`'${name}' model: modelDB.table not defined, will set to modelName: '${name}'`);
			modelDB.table = name;
		}
		else if (name != modelDB.table){
			console.log(`'${name}' model: modelName will be set to table name, modelDB.table: '${modelDB.table}'`);
			name = modelDB.table;
		}
		
		if (modelDB.configdb){
			Object.assign(modelDB, config.databases[modelDB.configdb]);
		}
		if (!modelDB.pk){
			try{
				modelDB.pk = db[modelDB.dbms].pk;
				if (!modelDB.allFields){modelDB.allFields = db[modelDB.dbms].allFields;}
			}// Don't know why, but for some reason, this only works in a try block, or db[this.modelDB.dbms] does not exist
			catch{console.log(`Warning: 'pk', 'allFields' properties not set on modelDB for modelName: ${name}`)}
		}
		this.data = {}; // Initialise data
		this.__proto__.modelName = name;
		this.__proto__.fieldSchema = modelSchema(fields,'fields');
		this.__proto__.modelDB = modelDB;
		this.__proto__.frontEnd = (page)=>{
			incFrontEnd = incFrontEnd ? incFrontEnd : {};
			if (!page) {return incFrontEnd;}
			else{return incFrontEnd[page] || incFrontEnd.all;}
		}
		this.__proto__.dataMethods = dataMethods ? dataMethods : {};
		this.__proto__.virtual = virtual ? virtual : [];
		
	}
	
	field(fieldname){
		// Recursive implementaion
		if (Array.isArray(this.data)){
			return doEach(this.data, (obj)=>{
				var objmodel = new this.constructor(obj);
				return objmodel.field(fieldname);
			})
		} else if (this.data) {
			//try{
				if (this.data[fieldname]){
					return this.data[fieldname];
				} else
				if (this.dataMethods[fieldname]){
					return this.dataMethods[fieldname](this.data);
				}
			//} catch(err) {lg(err,'l59'); return undefined;}
		}
	}

	//frontEnd(page){		return this.includeFrontEnd[page] || this.includeFrontEnd.all;	}
	
	getByPK(pk){
		return this.select({where:{[this.modelDB.pk]:pk}});
	}
	
	render(){
	// Recursive implementation
		if (Array.isArray(this.data)){
			return doEach(this.data, (obj)=>{
				var objmodel = new this.constructor(obj); //console.log(objmodel);
				return objmodel.render();
			});
		} else if (this.data) {
				var json = this.data;
			//try{
				if(this.virtual){
					this.virtual.forEach((key)=>{json[key]=this.field(key)});
				}
				return json;
			//} catch (err){lg(err,'l82'); return json;}
			
		}
	}

	setData(dataObject){
		this.data = dataObject;
	}

	async insert(query, callback){
		query.fieldkeys = Object.keys(this.fieldSchema[this.modelDB.dbms]);
		return db.insert(this.modelDB, query, callback);
	}
	
	async delete(query, callback){
		if (!query.where){query.where = this.data;}
		return db.remove(this.modelDB, query, callback);
	}
	
	async select(query, callback){
		var result = await db.select(this.modelDB, query, callback);
		return new this.constructor(result, query);
	}
	
	async update(query, callback){
		if (!query.where && this.data){query.where = this.data;}
		return db.update(this.modelDB, query, callback);
	}
	
};

exports.Model = Model;

//========
/* Get schema (eg, 'sqlite') for model fields: {fieldname: {sqlite: sqparam, input:inparam...}...} =>  * {fieldname: sqparam...} - used in models.js */
function modelSchema(modelFields, fieldsKey){
	var fieldsObject = modelFields[fieldsKey], schemaKeys = new Set(), fieldSchema={};
	
	for (key in fieldsObject){
		Object.keys(fieldsObject[key]).forEach(item => schemaKeys.add(item)); // Get keys for schema, eg: 'display', 'label', 'mysql'
	}
	
	schemaKeys.forEach(key => {fieldSchema[key] = getSchema(fieldsObject, key);});
	
	for (key in modelFields){
		if (key != fieldsKey){
			if (fieldSchema[key]){ Object.assign(fieldSchema[key], modelFields[key]);}
			else {fieldSchema[key] = modelFields[key];}
		} 
	}
	return fieldSchema;
}

function getSchema(model, schema){ 
	var params = {};
	for (let [key,val] of Object.entries(model)){
		if (val[schema]){
			params[key] = val[schema];
		}
	}
	return params;
}

function doEach(array, func){ // return array of processed elements
	var l=array.length, i, processed=[];
	for(i=0; i<l; i++){
		processed.push(func(array[i]));
	}
	return processed;
}

function isObject(obj){
	return typeof(obj)==='object' && obj!=null && !Array.isArray(obj);
}

function lg(tolog, ref=''){console.log(`\n${__dirname}/modelEngine.js > `+ ref); console.log(tolog); }
