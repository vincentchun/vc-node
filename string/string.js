/* VC Web Apps: string.js - string manipulation
 * Copyright Vincent Chun, VC Learning
 */
// Function Exports
exports.capitalize = capitalize;
exports.cap = capitalize;
exports.bssq = bssq;
exports.bsdq = bsdq;
exports.sq2x = sq2x;
exports.dq2x = dq2x;
exports.ltgt = ltgt;
exports.cookieParse = cookieParse;

function capitalize(str){
	return str[0].toUpperCase()+str.slice(1);
}

// ' with \'
function bssq(str){
	try{return str.replace(/\'/g,`\'`);}catch{return str;}
}
	
// " with \"
function bsdq(str){
	try{return str.replace(/\"/g,`\"`);}catch{return str;}
}

// ' with ''
function sq2x(str){
	try{return str.replace(/\'/g,`''`);}catch{return str;}
}

// " with ""
function dq2x(str){
	try{return str.replace(/\"/g,`""`);}catch{return str;}
}

// < with &lt; , > with &gt;
function ltgt(str){
	try {return str.replace(/</g, '&lt;').str.replace(/>/g, '&gt;');}catch{return str;}
}

// Escaping
function sqlite(string){
	string = sq2xsq(string); // string.replace(/\'/g,`''`);
	return string;
}

function cookieParse(cookieString){ // "key=value;key1=value1" => {key: value, key1: value}
	var array = cookieString.split(';');
	var cookies = {};
	for (i=0;i<array.length;i++){
		let split = array[i].split(/=(.+)/);
		cookies[split[0].trim()] = split[1].trim();
	}
	return cookies;
}
