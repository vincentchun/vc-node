/* VC Web Apps: Javascript Objects manipulation
 * Copyright: Vincent Chun, VC Learning; Used under individual license.
 */

// Function Exports
exports.deprototype = deprototype;
exports.fitproto = fitproto;
exports.matchKeys = matchKeys;
exports.stringify = stringify;
exports.strFields = strFields;
exports.combineFields = combineFields;
exports.getKeyVals = getKeyVals;
exports.repKeyVal = repKeyVal;
exports.consolidate = consolidate;
exports.dbtext = dbtext;
exports.modelSchema = modelSchema;
exports.mergeObjects = mergeObjects;
exports.assign = assign;
exports.join = join;
exports.compare = compare;
exports.obArraytoObj = obArraytoObj;
exports.deMethod = deMethod;
exports.filterObj = filterObj;
exports.isObject = isObject;
exports.ud = ud;
//To to: object equality
//debug
function lg(tolog, ref=''){console.log('objects.js > '+ ref); console.log(tolog); }

function deprototype(obj){
	Object.setPrototypeOf(obj,{});
}

function fitproto(proto, object){
	var newObject = {};
	for (key in proto){
			newObject[key] = object[key];
	}
	return newObject;
}

function matchKeys(keyArray, object){
	var newObject = {};
	keyArray.forEach((key)=>{
		newObject[key] = object[key];
	});
	return newObject;
}

function stringify(input){
	if (typeof input == "object"){
		return JSON.stringify(input);
	} else {
		return input;
	}
}

// Convert each field of object to string
function strFields(obj){
	var obj1 = obj;//assign?
	for (key in obj1){
		if (typeof obj1[key] === "object"){
			obj1[key] = JSON.stringify(obj1[key]);
		}
	}
	console.log(obj1);
	return obj1;	
}


// {address.line1: val1, address.line1: val1} => {address: {line1:val1, line2:val2}}
function combineFields(obj){
	var newObj={}
	for (key in obj){
		if (key.includes('.')){
			var keyField = key.split('.');
				if (! newObj[keyField[0]]){newObj[keyField[0]]={}}
				newObj[keyField[0]][keyField[1]] = obj[key];
		} else {
			newObj[key] = obj[key];
		}
	}
	return newObj;
}

// Extract key/val pairs from object: {key1:'val1', key2:'val2'}
function getKeyVals(obj, keystr='key', valstr='val', startind=0){
	var keyvals = {};
	for (i=startind; obj[keystr+String(i)]; i++){
		keyvals[obj[keystr+String(i)]] = obj[valstr+String(i)];
	}
	return keyvals;
} //exports.getKeyVals = getKeyVals;

// Replace key, val with key: val pairs.
function repKeyVal(obj, keystr='key', valstr='val', startind=0){
	var newObj = obj;
	for (i=startind; newObj[keystr+String(i)]; i++){
		newObj[newObj[keystr+String(i)]] = newObj[valstr+String(i)];
		delete newObj[keystr+String(i)];
		delete newObj[valstr+String(i)];
	}
	return newObj;
}

function consolidate(obj){ //parseInput
	if (typeof obj !== "object"){
		return obj;
	} else {
		var obj1 = repKeyVal(obj);
		obj1 = combineFields(obj1);
		var obj2 = {};
		for (key in obj1){
			if (typeof obj1[key] == 'object'){
				obj2[key] = consolidate(obj1[key]);
			} else {
				obj2[key] = obj1[key];
			}
		}
		return obj2;
	}
}

function dbtext(obj){
	//console.log(obj); console.log(consolidate(obj)); console.log(strFields(consolidate(obj)));
	return strFields(consolidate(obj));
}

/* Get schema (eg, 'sqlite') for model fields: 
 * {fieldname: {sqlite: sqparam, input:inparam...}...} => 
 * {fieldname: sqparam...} - used in models.js
 */
function modelSchema(model, schema){ 
	var params = {};
	for (let [key,val] of Object.entries(model)){
		if (val[schema]){
			params[key] = val[schema];
		}
	}
	return params;
}

function mergeObjects(object, mergeTo, args={addProps:true, exclude:[]}){
	var merged={};
	if (object[mergeTo]){
		merged=object[mergeTo];
	}
	for (let [key1,val1] of Object.entries(object)){
		if (key1 != mergeTo && isObject(val1) && !args.exclude.includes(key1)){
			for (let [key2,val2] of Object.entries(val1)){
				if(args.addProps || mergeTo[key2]){
					merged[key2][key1]=val2;
				}
			}
		}
	}
	return merged;
}
/* Also useful:
 * returnedTarget = Object.assign(target, source);
 */ 
function assign(target, source){
	var newobj = {}; Object.assign(newobj, target);
	return Object.assign(newobj, source);
}

function join(target, source){
	var newobj = {}; assign(newobj, target);
	var tobj = (typeof target === 'object' && target !== null), sobj = (typeof source === 'object' && source !== null);
	if (tobj && sobj){
		for (key in target){
			if (source[key]) { // Copy to source before assigning to target
				source[key] = join(target[key], source[key]);
			}
		}	
		return assign(newobj, source);
	} else if (tobj){ // !sobj
		return target;
	}
	else {
		return source;
	}
}
//exports.join = join;

function compare(obja, objb){
	var result = {equal:[], notEqual:[], anotb:[], bnota:[]}
	if (typeof obja == 'object' && typeof obja == 'object'){
		for (let [keya,vala] of Object.entries(obja)){
			if (vala == objb[keya]){ // equal, even if undef
				result.equal.push(keya);
			} else if (objb[keya]) { // nequal, b exist
				result.notEqual.push(keya);
			} else { // nequal, b undef
				result.anotb.push(keya);
			}
		}
		for (let [keyb, valb] of Object.entries(objb)){
			if (! obja[keyb]){result.bnota.push(keyb);}
		}
	}
	return result;
}

// Take array of objects and create object referencing each element by one of its keys
function obArraytoObj(array, refkey){
	var obj = {};
	for ([ind,val] of Object.entries(array)){
		if (name = val[refkey]){
			obj[name] = val;
		} else {
			obj[ind] = val;
		}
	}
	return obj;
}

function deMethod(obj){
	var newobj = {};
	for (key in obj){
		if (typeof obj[key] !== 'function'){
			newobj[key] = obj[key];
		}
	}
	return newobj;
}

function filterObj(obj,keys){
	var filtered = {};
	for (let i=0; i<keys.length; i++){
		if (obj[keys[i]]){
			filtered[keys[i]] = obj[keys[i]];
		}
	}
	return filtered;
}	

function isObject(obj){
	return typeof(obj)==='object' && obj!=null && !Array.isArray(obj);
}

// if (obj[propname]) Cannot get property propname of undefined obj => if (ud(obj, propname)) ; Save if (obj){if(obj[propname]){}}
function ud(obj, propname, ref=''){
	try {return obj[propname];}
	catch(err) {lg(err.message,ref);}
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/objects.js > `+ ref); console.log(tolog); }
