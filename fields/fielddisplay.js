/* Field Display (field.js)
 * Copyright Vincent Chun, VC Learning, used under license.
 */
const ht = require('vc/html')
const models = require('vc/models')//.models
// Global variables: ROOTURL

// Function Exports
exports.getModel = getModel;
exports.nullfield = nullfield;
exports.image = image;
exports.title = title;
exports.text = text;
exports.itext = itext;
exports.strong = strong;
exports.address = address;

exports.output=output;
exports.render = render;
exports.list = list;

function getModel(cname){
	return models.filter(model => model.constructor.name == cname)[0];
}

// Field Displays
function nullfield(key, val){
	return ht.create(ht.div, {'class':`${key} field null`}, '');
}

function image(key, src){
	var rgx = new RegExp(`^https?://`);
	if (! rgx.test(src)){src = `${ROOTURL}/${src}`}
	return ht.create(ht.img, {'src': src, 'class': `${key} field image`});
} 

function title(key, text){
	return ht.create(ht.h1, {'class':`${key} field title`}, text);
} 

function text(key, text){
		return ht.create(ht.div, {'class':`${key} field text`}, text);
} 

function itext(key, text){
	return ht.create(ht.span, {'class':`${key} field itext`}, text);
}

function strong(key, text){
	return ht.create(ht.strong, {'class':`${key} field strong`}, text);
}

function address(key, text){
	var addy = JSON.parse(text);
//	var addystr = addy.line1 + '<br>' + addy.line2 + '<br>' + addy.city + '<br>' + addy.zip + '<br>' + addy.country;
	var addya = [];
	for (key in addy){
		addya.push(ht.create(ht.div, {'class':`address-${key}`}, addy[key]));
	}
	return ht.create(ht.div, {'class':`${key} field address`}, addya);
}

//Output field
function output(key, val, display){
	if (display=='null' || display==null){
		return nullfield(key, val)
	} else if (typeof module.exports[display] == "function"){
		return module.exports[display](key, val);
	} else {
		return text(key, val);
	}
}

// Render val
function render(display, key, val){ 
	//var proto = models[tablename];//getModel(Cname);
	if (val){
		if (display){
		//var display = fieldDisplay//proto[key].display;
		return output(key, val, display);
		} else { // Val, no proto[key].display
			return output(key, val, 'text');
		}
	} else { // No val
			return output(key, '', 'null');
	}
}
/*
// Render val
function render(tablename, key, val){ 
	var proto = models[tablename];//getModel(Cname);
	if (val){
		if (proto[key]){
		var display = proto[key].display;
		return output(key, val, display);
		} else { // Val, no proto[key].display
			return output(key, val, 'itext');
		}
	} else { // No val
			return output(key, '', 'null');
	}
}
*/

// Render val for list
function list(tablename, key, val){ 
	var proto = models[tablename];//getModel(Cname);
	if (val){
		if (proto[key]){
		var display = proto[key].list;
		return output(key, val, display);
		} else { // Val, no proto[key].display
			return output(key, val, 'itext');
		}
	} else { // No val
			return output(key, '', 'null');
	}
}


