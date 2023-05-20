/* Node.JS Module
 * VC Web Apps: html.js , ver 20201122
 * Copyright: Vincent Chun, VC Learning. Used under license.
*/

// Function exports
exports.render = render;
exports.create = create;
exports.atstr = atstr;
exports.str = str;
exports.isAttr = isAttr;
exports.isInner = isInner;
exports.un = un;
exports.el = el;
exports.ncl = ncl; // non-closing tag
exports.html = html;
exports.head = head;
exports.body = body;
exports.div = div;
exports.a = a;
exports.p = p;
exports.span = span;
exports.img = img;
exports.h1 = h1;
exports.h2 = h2;
exports.h3 = h3;
exports.h4 = h4;
exports.h5 = h5;
exports.nav = nav;
exports.em = em;
exports.strong = strong;
exports.b = b;
exports.i = i;
exports.title = title;
exports.meta = meta;
exports.link = link;
exports.script = script;
exports.style = style;
exports.form = form;
exports.label = label;
exports.input = input;
exports.textarea = textarea;
exports.nxst = nxst;
exports.xst = xst;

// HTML Element object class
class HTelement {
	constructor(htmlfunc=div, attribs={}, inner='') {
		if (htmlfunc.constructor === Function){ // Catch non-functions for htmlfunc
			this.htmlfunc = htmlfunc;
			} else {
			this.htmlfunc = div
			}
		this.attribs = attribs;
		this.inner = inner;
	}
	render() {
		return render(this);
	}
}
HTelement.prototype.addEnd = function(element){
	if (!this.inner){this.inner=[];}
	if (!Array.isArray(this.inner)){
		this.inner = new Array(this.inner);
	}
	(this.inner).push(element);
}
HTelement.prototype.addBegin = function(element){
	if (!this.inner){this.inner=[];}
	if (!Array.isArray(this.inner)){
		this.inner = new Array(this.inner);
	}
	(this.inner).unshift(element);
}
HTelement.prototype.addAt = function(index, element){
	if (!this.inner){this.inner=[];}
	if (!Array.isArray(this.inner)){
		this.inner = new Array(this.inner);
	}
	(this.inner).splice(index, 0, element);
}

exports.HTelement = HTelement;

// Render HTML
function render(el){ // Add optional attrs argument?
	if (nxst(el)){ // el does not exist
		return '';
		}
	if (el.constructor === HTelement){
		return el.htmlfunc(el.attribs, render(el.inner));
	} else if (el.constructor === Array){
		var str='';
		for (let i=0; i<el.length; i++){
			str = str + render(el[i]);
		}
		return str;
	} else {
		return el;
	}
}

function create(htmlfunc=div, attribs={}, inner=''){
	if (htmlfunc.constructor === String){
		var tagname = htmlfunc;
		var htmlfunc = function(attr, inn){
			return el(tagname, attr, inn)
			}
	}
	return new HTelement(htmlfunc, attribs, inner);
}


// Attributes string - to generate string of attributes for HTML tags
function atstr(attributes={}){
	var astring='';
	for(key in attributes){
		value = attributes[key];
		if (typeof value == "string"){value=`"${value}"`;}// add quotes
		astring=`${astring} ${key}=${value}`;
	}
	return astring;
}


// str - string arrays
function str(arg){
	if (Array.isArray(arg)){
		var i, string = ''; 
		for (i=0; i<arg.length; i++){ 
			string = string + str(arg[i]);
		}
		return string;
	} else {
		return '' + render(arg); //Handle HTelements
	}
}


// Check arg to see if it matches Attr type: object, but not array
function isAttr(arg){
	if (xst(arg) && arg.constructor === Object){
		return true;
	} else {
		return false;
	}
}


// Check arg to see if it matches Inner type: string/number/elementary type or an array
function isInner(arg){
	if (xst(arg) && arg.constructor !== Object){
		return true;
	} else {
		return false;
	}
}


// HTML Elements/Tags
function un(attr, inner){ // Untagged - return string as is, no element
	if (! inner && isInner(attr)){
		inner=attr;
		}
	return str(inner);
}


function el(tagname, attr, inner=''){
	if (isInner(attr)){ 
		var inn=inner;
		inner=attr; // Logic: more likely to forget to include attr, than switch order
		attr=(isAttr(inn) ? inn : {});
	}
	attribs = atstr(attr);
	return `<${tagname}${attribs}>` + str(inner) + `</${tagname}>`;
};


function ncl(tagname, attr, inner=''){
	attribs=atstr(attr);
	return `<${tagname}${attribs}>`;
}

// Page Structure tags
// <body>

// <html>
function html(attr={}, inner=''){
	return el('html', attr, inner);
};


// <head>
function head(attr={}, inner=''){
	return el('head', attr, inner);
};


function body(attr={}, inner=''){
	return el('body', attr, inner);
};


// <div> tags
function div(attr={}, inner=''){
	return el('div', attr, inner);
};


// Elements
// <a> tags
function a(attr={}, inner=''){
	return el('a', attr, inner);
};


// <p> tags
function p(attr={}, inner=''){
	return el('p', attr, inner);
};


// <span> tags
function span(attr={}, inner=''){
	return el('span', attr, inner);
};


// <img>
function img(attr){
	return el('img', '', attr);
};


// <h1>
function h1(attr={}, inner=''){
	return el('h1', attr, inner);
};


// <h2>
function h2(attr={}, inner=''){
	return el('h2', attr, inner);
};


// <h3>
function h3(attr={}, inner=''){
	return el('h3', attr, inner);
};


// <h4>
function h4(attr={}, inner=''){
	return el('h4', attr, inner);
};


// <h5>
function h5(attr={}, inner=''){
	return el('h5', attr, inner);
};


// <nav>
function nav(attr={}, inner=''){
	return el('nav', attr, inner);
};


//Text
// <em> tags
function em(attr={}, inner=''){
	return el('em', attr, inner);
};


// <strong> tags
function strong(attr={}, inner=''){
	return el('strong', attr, inner);
};


// <b> tags
function b(attr={}, inner=''){
	return el('b', attr, inner);
};


// <i> tags
function i(attr={}, inner=''){
	return el('i', attr, inner);
};


// Meta tags
// <title>
function title(attr, inner=''){
	return el('title', attr, inner);
};


// <meta>
function meta(attr){
	return el('meta', attr);
};


// <link>
function link(attr, inner=''){
	return el('link', attr, inner);
};


// <script>
function script(attr, inner=''){
	return el('script', attr, inner);
};


// <style>
function style(attr, inner=''){
	return el('style', attr, inner);
};


// Forms & input
// <form>
function form(attr, inner=''){
	return el('form', attr, inner);
};


// <label>
function label(attr, inner=''){
	return el('label', attr, inner);
}


// <input>
function input(attr, inner=''){
	return ncl('input', attr, inner);//el
};


// <button>
function button(attr, inner=''){
	return el('button', attr, inner);//el
};


// <textarea>
function textarea(attr, inner=''){
	return el('textarea', attr, inner);
}


// Not Exist - if not exist, return true
function nxst(val){
	return val == undefined || val == null;
}
function xst(val){
	return ! nxst(val);
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/html.js > `+ ref); console.log(tolog); }
