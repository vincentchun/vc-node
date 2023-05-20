/* VC Web Apps: field.js - fields
 * Copyright Vincent Chun, VC Learning used under license
 */

// Function Exports
exports.addressDisplay
exports.fkey = fkey;

//## Basic Fields
const title = {input:'text', display:'title', list:'strong', sqlite: 'TEXT'}

const stext1 = {input:'text', display:'text', list:'text', sqlite: 'TEXT'} // Short text 1, default text

const stext2 = {input:'text', display:'text', list:'itext', sqlite: 'TEXT'} // Short text 2, list inline

const stext3 = {input:'text', display:'text', list:null, sqlite: 'TEXT'} // Short text 2, list exclude

const ltext1 = {input:'textarea', display:'text', list:'trunc', sqlite: 'TEXT'} // Long text 1, list truncate

const ltext2 = {input:'textarea', display:'text', list:null, sqlite: 'TEXT'} // Long text 2, list exclude

const html = {input:'html', display:'text', list: {display:'text', length:200}, sqlite:'TEXT'}

const date = {input:'date', display:'date', list:'date', sqlite:'TEXT'}

const image = {input:'image', display:'image', sqlite: 'TEXT'} // Image (URL)

const integer = {input:'number', display:'text', list:'text', sqlite:'integer'}

// Foreign Keys, relationship
const authsystem = {table:'auth', input:null, display:'text', sqlite: 'INTEGER'}// System generated auth fields - not to be changed by user

const auth = {table:'auth', input:'number', display:'text', sqlite: 'INTEGER'}

function fkey(table){
	return {table:table, input:'fkey', display:'fkey', sqlite: 'INTEGER'}
}
//## Classes - also exported as <fieldname>.model
class Address {
	constructor(line1, line2, city, state, zip, country){
		this.line1 = line1;
		this.line2 = line2;
		this.city = city;
		this.state = state;
		this.zip = zip;
		this.country = country;
	}
}
/*
class Fkey {
	constructor(table, record){
		this.table = table;
		this.record = record; // eg: {rowid: 1}
	}
}
*/

//## Custom fields
const json = {input:'json', display:'json', sqlite: 'TEXT'}  // OBJ (JSON)

var address = {'model': Address, input:'address', display:'address', sqlite: 'TEXT'}//, fields:address_fields} // Address

//## Class object fields
address.fields = new Address(
	stext3, // line 1
	stext3, // line 2
	stext2, // city
	stext2, //state
	stext2, //zip
	stext2 //country
) 

function addressDisplay(address){
	if (typeof address == "string"){return address}
	else {
		return address.line1 + '<br>' + address.line2
	}
}

// Class Exports
exports.Address = Address;
//exports.Fkey = Fkey;

// Const & Var Exports
exports.title = title;
exports.text = stext1;
exports.stext1 = stext1;
exports.stext2 = stext2;
exports.stext3 = stext3;
exports.ltext1 = ltext1;
exports.ltext2 = ltext2;
exports.html = html;
exports.date = date;
exports.image = image;
exports.auth = auth;
exports.authsystem = authsystem;
exports.fkey = fkey;
exports.json = json;
exports.object = json; //legacy
exports.address = address;



