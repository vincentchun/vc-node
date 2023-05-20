const config = require('vc/config');
const ht = require('vc/html')

rooturl = config.rooturl;

//Exports
exports.editico = editico;
exports.optico = optico;

// Elements
// Edit icon
function editico(attr={}){
	attr = Object.assign({class:'editico', style:`display:block; font-weight:bold; text-decoration:none; padding:4px;`}, attr);
	return ht.create(ht.a, attr, ht.create(ht.img,{src:`${rooturl}/app/img/edit.png`, style:'height:16px;'}));
}
// Options icon (...)
function optico(attr={}){
	attr = Object.assign({class:'optico', style:`display:block; font-weight:bold; text-decoration:none; padding:4px;`}, attr);
	return ht.a(attr,'...')
}
