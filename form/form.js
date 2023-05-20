/* VC Web Apps: Field input (input.js)
 * Copyright Vincent Chun, VC Learning, used under license
 */
const ht = require('vc/html');
const fields = require('vc/fields');
const models = require('vc/models');
const htattr = require('vc/html/html-attribs');
const config = require('vc/config');
const tmpl = require('vc/templates');
const ADDVUE = false; // Need to include vue.js for html field - set to true if vue isn't incluced by default in template header
const rooturl = config.rooturl;

// Function Exports
exports.address = address;
exports.html = html;
exports.json = json;
exports.password_conf = password_conf;
exports.input = input;
exports.addfielda = addfielda;
exports.fieldobj = fieldobj;
exports.dbfieldform = dbfieldform;
exports.dbfieldhidden = dbfieldhidden;
exports.dbfieldformpw = dbfieldformpw;
exports.dbfieldhiddenpw = dbfieldhiddenpw;

//========
// Define Custom Input Fields Here
// Refer to fieldobj function below for composition of var attr: id, name, form(?)

// Address Field
function address(initial={}, attr={}){
	var addrflds = fields.address.fields;
	var fielda = [];
	if (initial){
		var init = JSON.parse(initial);
	}
	for (key in addrflds){
		var fieldName = 'address.' + key;
		var inputType = addrflds && addrflds[key] && addrflds[key].input ? addrflds[key].input : 'text';
		var label = key;
		var fieldInit = init ? init[key] ? init[key] : '' : '';
//		addfielda(fieldName, inputType, label, fieldInit, {}, fielda);
		fielda.push(fieldobj({field:fieldName, type:inputType, label:label, init:fieldInit, inputattr:{}}));
	}
	return ht.create(ht.div, {'class': "address-field"}, fielda);
} 

// HTML Field
function html(init='', attr={}, sticky=true, addVue=ADDVUE){//to do
	var htfielda = [];
	let form = attr.form ? attr.form : '';
	if (addVue){
		htfielda.push(
			ht.create(ht.script, {src: "https://unpkg.com/vue"})
		);
	}
	var txattr={'class':'html-input'}; var dvattr={'class':'html-preview'}; Object.assign(txattr, attr); Object.assign(dvattr, attr);
	txattr['v-model'] = `${attr.id}_html`;
	dvattr['v-html'] = `${attr.id}_html`;
	htfielda.push(
		ht.create(ht.div, {id:`${attr.id}_html_editor`}, [
			ht.create(ht.div, {'class':'html-input-label'}, "HTML:"),
			ht.create(ht.textarea, txattr, init),
			tmpl.components.editorTools.tools,
			ht.create(ht.div, {'class':'html-input-label'}, "Preview:"),
			ht.create(ht.div, dvattr)
			]
		)
	);
	htfielda.push(
		ht.create(ht.script, {}, `var ${attr.id}_html_editor = new Vue({ el: '#${attr.id}_html_editor', data: { ${attr.id}_html: \`${init}\` } })`)
	);
	if (sticky){
		htfielda.push(
			ht.create(ht.style, {}, `#${attr.id}_html_editor textarea {position:sticky; top:0;}`)
		);
	}
	return ht.create(ht.div, {class:'html-editor'}, htfielda);	
}

// JSON Field
function json(init={}, attr={}){
	return input('text', init, attr);
} 

// Password Confirm Field
function password_conf(init={}, attr={}){
	var id = attr.id ? attr.id : '';
	var farray = [];
	// Password confirm script
	var pwconfirmjs = ht.create(ht.script,{},`
	function checkpass() {
		if (document.querySelector('input#${'pwconf'+id}').value == document.querySelector('input#${'confirm_pwconf'+id}').value) {
			document.querySelector('#passconfmsg').style.color = 'green';
			document.querySelector('#passconfmsg').innerHTML = 'passwords match';
			document.querySelector('#submit').disabled = false;
			document.querySelector('#submit').style.display = 'inline-block';
		} else {
			document.querySelector('#passconfmsg').style.color = 'red';
			document.querySelector('#passconfmsg').innerHTML = 'not matching';
			document.querySelector('#submit').disabled = true;
			document.querySelector('#submit').style.display = 'none';
		}
	}`);
	farray.push(pwconfirmjs);
	// Password field
	farray.push(fieldobj({field:'pwconf'+id,type:'password',label:'Password',inputattr:{placeholder:'password', required:true, onkeyup:'checkpass();'}}));
	// Password confirmation message - match with confirm field
	farray.push(ht.create(ht.div, {id:'passconfmsg'}, ''))
	// Confirm password field
	farray.push(fieldobj({field:'confirm_pwconf'+id,type:'password',label:'Confirm Password',inputattr:{placeholder:'confirm password', required:true, onkeyup:'checkpass();'}}));
	
	return ht.create(ht.div, attr, farray);
}

//========
// Creating HTML inputs, form fields & forms
// htinput() helper function to get HTML input element from type and other attributes
function htinput(type, attr={}){
	var htatt = {type:type};
	Object.assign(htatt, attr);
	return ht.create(ht.input, htatt);
}

// Input Field
function input(type, init='', attr={}){
	if (type=='textarea'){ // Handle textarea elements
		return init ? ht.create(ht.textarea, attr, init) : ht.create(ht.textarea, attr);
	} else if (htattr.input.type.includes(type)){ // Handle valid html input types
		var inputattr = init ? {type:type, value:init} : {type:type}; // If initial value is given, set value attribute
		Object.assign(inputattr, attr); // Assign additional supplied attributes 
		return htinput(type, inputattr); // Create & return HTML input element from type and other attributes
	} else if (field = module.exports[type]){ // Handle custom field types
		return field(init, attr); // Call function corresponding to custom field type
	}
} 


// Add label and form field to an array, return array 
function addfielda(params={field:REQUIRED,type:REQUIRED,label:'',init:'',form_id:'',inputattr:{}}, array=[]){
	var field = params.field;
	var type = params.type;
	var label = params.label ? params.label : '';
	var init = params.init ? params.init : undefined; 
	var form_id = params.form_id ? params.form_id :'';
	var inputattr = params.inputattr ? params.inputattr :{};
	
	if (type){
		let labelattr = form_id ? {'for':field, 'form':form_id} : {'for':field};
		var label = ht.create(ht.label, labelattr, label);
		var attr = form_id ? {id:field, name:field, form:form_id} :  {id:field, name:field};
		Object.assign(attr, inputattr);
		array.push(ht.create(ht.div, {'class':`formfield ${field}`},[label, "<br>", input(type, init, attr)]));
	}
	return array;
} 

// Add label and form field, create & return object
function fieldobj(params={field:REQUIRED,type:REQUIRED,label:'',init:'',form_id:'',inputattr:{}}){
	var field = params.field;
	var type = params.type;
	var label = params.label ? params.label : '';
	var init = params.init ? params.init : undefined; 
	var form_id = params.form_id ? params.form_id :'';
	var inputattr = params.inputattr ? params.inputattr :{};
	
	if (type){
		var array=[];
		let labelattr = form_id ? {'for':field, 'form':form_id} : {'for':field};
		var label = form_id ? ht.create(ht.label, labelattr, label) : ht.create(ht.label, labelattr, label);
		var attr = form_id ? {id:field, name:field, form:form_id} :  {id:field, name:field};
		Object.assign(attr, inputattr);
		if (['radio','checkbox'].includes(type)){
			array.push(ht.create(ht.div, {'class':`formfield ${field}`},[input(type, init, attr), " ", label]));
		} else {
			array.push(ht.create(ht.div, {'class':`formfield ${field}`},[label, "<br>", input(type, init, attr)]));
		}
	}
	return ht.create(ht.div, {'class':`field-${field}`}, array);
} 

// Single field form
function dbfieldform(modelInstance, field, attribs={}){
	attr = Object.assign({method:'POST'}, attribs);
	var table = modelInstance.modelName;
	var pk = modelInstance.data[modelInstance.modelDB.pk];
	var type = modelInstance.fieldSchema.input[field];
	var flabel = modelInstance.fieldSchema.label[field];
	var form_id = `${table}-${pk}-${field}`; // Set 'form' attribute
	var init = modelInstance.data[field];
	//var inputattr = modelInstance.fieldSchema.inputattr[field];
	formArray = [];
	formArray.push(fieldobj({field:field, type:type, label:flabel, init:init, form_id:form_id, /*inputattr:inputattr*/}));//, form_id);
	formArray.push(htinput('submit',{value:'Save', form:form_id})); /*, form:form_id*/
	var formattr = Object.assign(attr, {id:form_id}); // Define form attributes
	return ht.create(ht.form, formattr, formArray);
}
//exports.dbfieldform = dbfieldform;

function dbfieldhidden(modelInstance, field, attr={}){
	//if (! models[table][field]){return '';}if (! models[table][field].input){return '';}
	arr = [];
	arr.push(ht.create(ht.img, {src:`${rooturl}/app/img/edit.png`, onclick:"popnext(this);", style:"width:14px;", title:`edit ${field}`}));
	Object.assign(attr, {style:"display:none;"})
	arr.push(dbfieldform(modelInstance, field, attr))
	return ht.create(ht.div, {}, arr);
}
//exports.dbfieldhidden = dbfieldhidden;

// Single field form with password for verification
function dbfieldformpw(modelInstance, field, attribs={}){
	attr = Object.assign({method:'POST'}, attribs);
	var table = modelInstance.modelName;
	var pk = modelInstance.data[modelInstance.modelDB.pk];
	var type = modelInstance.fieldSchema.input[field];
	var flabel = modelInstance.fieldSchema.label[field];
	var form_id = `${table}-${pk}-${field}`; // Set 'form' attribute
	var init = modelInstance.data[field];
	//var inputattr = modelInstance.fieldSchema.inputattr[field];
	formArray = [];
	formArray.push(fieldobj({field:field, type:type, label:flabel, init:init, form_id:form_id, /*inputattr:inputattr*/}));//, form_id);
	formArray.push(fieldobj({field:'password', type:'password', label:"Enter your current password to verify change:", init:'', form_id:form_id}));
	formArray.push(htinput('submit',{value:'Save', form:form_id})); /*, form:form_id*/
	var formattr = Object.assign(attr, {id:form_id}); // Define form attributes
	return ht.create(ht.form, formattr, formArray);
}
//exports.dbfieldform = dbfieldform;

function dbfieldhiddenpw(modelInstance, field, attr={}){
	//if (! models[table][field]){return '';}
	arr = [];
	arr.push(ht.create(ht.img, {src:`${rooturl}/app/img/edit.png`, onclick:"popnext(this);", style:"width:14px;", title:`edit ${field}`}));
	Object.assign(attr, {style:"display:none;"})
	arr.push(dbfieldformpw(modelInstance, field, attr))
	return ht.create(ht.div, {}, arr);
}
//exports.dbfieldhidden = dbfieldhidden;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/form.js > `+ ref); console.log(tolog); }
