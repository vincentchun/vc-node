/* VC Web Apps: Node.JS Modules - templates.js
 * Copyright Vincent Chun, VC Learning, used under license
 */
const config = require('vc/config');
const ht = require('vc/html')

const rooturl = config.rooturl;
const MAINMENU = config.mainmenu;

//const pages = require('./pages');
//const article = require('./pages/article.js');
const components = require('./components');

// Exports
exports.react = react;
exports.topmenu = topmenu;
exports.vue = vue;
exports.html=html;
exports.head = head;
exports.page = page;
exports.navmenu = navmenu;
exports.logohead = logohead;

exports.pages = getPageTemplates;
//exports.article = article;
exports.components = components;

exports.dropdown = dropdown;

// Page load scripts
exports.scriptOnLoad = scriptOnLoad;
exports.scriptBeforeUnload = scriptBeforeUnload;

exports.optional = optional;
// Icons
exports.optico = optico;
exports.editico = editico;

// ReactJS
var react1 = ht.create(ht.script,{'src':`https://unpkg.com/react@17/umd/react.production.min.js`, 'crossorigin':''});
var react2 = ht.create(ht.script,{'src':`https://unpkg.com/react-dom@17/umd/react-dom.production.min.js`, 'crossorigin':''});
var react = ht.create(ht.un,{},[react1,react2]);


// Vue.js
var vue = ht.create(ht.script, {type: "text/javascript", src:"https://unpkg.com/vue"});

// HTML Doc template
function html(inner, attr={lang:"en"}){
	var doctype="<!DOCTYPE html>";
	return doctype + ht.create(ht.html, attr, inner).render();
}

// Page Template
function page(args){
//	var rooturl= args.rooturl ? args.rooturl : '';
// HTML
	var htmlarray=[];
// HTML Head
	var headEl = head(args.title, args.meta);
	if (args.htmlhead){
		headEl.addEnd(args.htmlhead);
	}
	htmlarray.push(headEl);
// HTML Body
	var bodyarray=[], headerarray=[], mainarray=[], footerarray=[];
	if (args.header || args.topmenu || args.logohead){
		optional(args.topmenu, ht.create(ht.div, {class:'ccol w960'}, topmenu(args.user)), headerarray, true);
		optional(args.logohead, logohead(), headerarray, true);
		bodyarray.push(ht.create(ht.div,{id:'header'},headerarray));
	}
	optional(args.premain,'',bodyarray, false);
	bodyarray.push(args.main);
	optional(args.postmain,'',bodyarray, false);
	var bodyEl = ht.create(ht.body,{},bodyarray);
	htmlarray.push(bodyEl);
	return html(htmlarray);
}

// HTML Head
function head(title='VC Web Apps', meta={}){
	var headr = [], css=[], scripts=[];
	headr.push(ht.title(title)); // Page title
	//CSS
	var vcss = ht.create(ht.link,{'rel':'stylesheet', 'type':'text/css', 'href':`${rooturl}/styles/vc.css`});
	var appcss = ht.create(ht.link,{'rel':'stylesheet', 'type':'text/css', 'href':`${rooturl}/styles/smartups.css`});
	css = [vcss,appcss]
	headr.push(css);
	//Scripts
	var vcjs = ht.create(ht.script,{'src':`${rooturl}/scripts/vc.js`});
	scripts = [vcjs, vue];
	headr.push(scripts);
	return ht.create(ht.head,{},headr);
} 

// Top menu bar
function topmenu(user){
	var left = ht.create(ht.div,{});
	var mid = ht.create(ht.div,{});
	var right = user ? ht.create(ht.div,{},profileMenu()) : ht.create(ht.a,{href:"/login"},'Log In');
	var elems = [left,mid,right];
	return ht.create(ht.div,{class:'flexrnw jb'},elems);
}

function profileMenu(menuItems){
	if (!menuItems){
		var menuItems = ht.create(ht.div,{}, [
			ht.create(ht.a, {href:'/myauthdetails', style:'display:block; white-space:nowrap'}, "My Login Details"),
			ht.create(ht.a, {href:'/logout', style:'display:block; white-space:nowrap'}, "Logout")
			]);
	}
	var array = []
	array.push(ht.create(ht.img,{src:`${rooturl}/app/img/avatar.png`, style:`height:16px; display:inline;`, onclick:`popnext(this)`})),
	array.push(ht.create(ht.div, {class:"vertical-menu", style:"display:none;"}, menuItems));
	return ht.create(ht.div,{style:'text-align:right;'},array);
}

function dropdown(items, toggle, attribs){
	var tog = ht.create(ht.div,{onclick:`popnext(this)`},toggle);
	var dropItems = ht.create(ht.div,{class:"vertical-menu", style:"display:none;"},items);
	return ht.create(ht.div,attribs,[tog,dropItems]);
}
		
// Nav Menu
function navmenu(menuitems={}, attr={}){
	var navhtml=[];
	var menu = Object.assign(MAINMENU, menuitems);
	for (const [key, val] of Object.entries(menu)){
		navhtml.push(ht.create(ht.a, val, key));
	}
	var navr = [
		ht.create(ht.div, {onClick:"popnext(this);", id:"navmtog"}, `&#9776;`),
//		`<div onClick="popnext(this);" id="navmtog">&#9776;</div>`,
		ht.create(ht.div,{id:'navm'}, navhtml)
		];
	return ht.create(ht.nav, attr, navr);
}

// Logo head
function logohead(){
	var lhr = []
	var logo = ht.create(ht.img, {'src':`${rooturl}/img/logo.png`, class:'center'});
	var linkedLogo = ht.create(ht.a, {href:rooturl}, logo);
	var hdv = ht.create(ht.div, {'class':'h20'});
	lhr = [linkedLogo,hdv];
	var logh = ht.create(ht.div, {'class':'article w600 center'}, lhr);
	return logh;
}

// Page Load scripts
// DOMContentLoaded - fully loaded HTML, DOM tree built
function scriptDOMLoad(js){
	return ht.create(ht.script, {}, [`document.addEventListener("DOMContentLoaded", () => {`, js, `})`]);
} exports.scriptDOMLoad = scriptDOMLoad;

// window.onload - whole page loaded including styles, images, resources
function scriptOnLoad(js){
	return ht.create(ht.script, {}, [`window.addEventListener('load', (event) => {`, js, `})`]);
}

// window.onbeforeunload - user tries to close the page
function scriptBeforeUnload(js){
	return ht.create(ht.script, {}, [`window.onbeforeunload = function() {`, js, `}`]);
}

// Icons
function editico(attr={}){
	attr = Object.assign({class:'editico', style:`display:block; font-weight:bold; text-decoration:none; padding:4px;`}, attr);
	return ht.create(ht.a, attr, ht.create(ht.img,{src:`${rooturl}/app/img/edit.png`, style:'height:16px;'}));
}
// Options icon (...)
function optico(attr={}){
	attr = Object.assign({class:'optico', style:`display:block; font-weight:bold; text-decoration:none; padding:4px;`}, attr);
	return ht.a(attr,'...')
}


// Get page templates for pageName (eg: 'article')
function getPageTemplates(pageName){
	var templates={};
	try {
		try {
			templates=require(`${_APPDIR}/pages/${pageName}`);
		} catch{templates=require(`./pages/${pageName}`);}
	} catch{}
	return templates;
}

//Foot scripts

// Helper functions
function fnu(arg){ // falsey, but not undefined - not used
	return arg==false || arg==null || arg=='';
}

function optional(arg, defHTML='', array=[], includeByDefault=false){
	if (includeByDefault){
		if (arg==undefined || arg==true){
			if (defHTML){
				array.push(defHTML);
			}
			return defHTML;
		} else if (arg==null){
			return '';
		} else if (arg.constructor == ht.HTelement){
			array.push(arg);
			return arg;
		}
	} else { // exclude by default
		if (!arg){
			return '';
		} else if (arg.constructor == ht.HTelement){
			array.push(arg);
			return arg;
		}
	}
}
// Add additional templates in ./templates
//add = require('./index2.js');
//exports.add = add;
//components = require('./templates/components');
//exports.components = components;

// Add custom templates defined in templates.js in APPDIR 
try {
	customTemplates = require(_APPDIR + '/templates');
	if (customTemplates){
		Object.assign(exports, customTemplates);
	}
}
catch(err){console.log("VC custom imports: No custom template found. \n - " + err.message); customTemplates = null;}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/templates.js > `+ ref); console.log(tolog); }
