/* VC Web Apps: Node.JS Modules - templates.js additional templates
 * Copyright Vincent Chun, VC Learning, used under license
 */
const ht = require('vc/html');

// Add before body - styles // Can just be array
var head = ht.create(ht.un,{},[
	ht.style(`/*.rowid {display:none;} .fieldlabel.title, .fieldlabel.body {display:none;}*/`)
	]);
exports.head = head;

//Add New
var addNew = {
	beforeContent:(args)=>{return "Use this form to add a new article.";}
}
exports.addNew = addNew;

// Display
var display = {
	head: head,
	beforeContent: (args)=>{lg(args.modelInstance.query); return ""},
	afterContent:()=>{},
	
}
exports.display = display;

// Edit
var edit = {
//	head: head,
	beforeContent: (args)=>{lg(args.modelInstance.query); return ""},
	afterContent:()=>{},
	
}
exports.edit = edit;

// List
var list = {
	head:head,
	beforeContent:(args)=>{return `${args.modelInstance.data.length} articles`;},
	afterContent:()=>{},
	
}
exports.list = list;

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/article.js > `+ ref); console.log(tolog); }
