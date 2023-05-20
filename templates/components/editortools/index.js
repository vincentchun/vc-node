/* VC Web Apps: Node.JS Modules - templatates > components > editor tools
 * Copyright Vincent Chun, VC Learning, used under license
 */
// Exports

 
const config = require('vc/config');
const ht = require('vc/html');
const movable = require('vc/templates/components/movable');

const rooturl = config.rooturl;

function editorTools() {
	var popout = movable.popout(`<img src="${rooturl}/app/img/Edit_tools64.png" style="width:32px;">`, 
	{id:'editorTools'}, 
	`<iframe src="http://localhost:3000/reference/css" style="width:100%; height:100%; background:none;"></iframe>`);
	return ht.create(ht.div, {style:"position:fixed; left:0px; top:50px; z-index:2; padding:12px 6px 12px 0px; border-radius:0px 6px 6px 0px; border: 1px solid #00000044; background:#F8FFF8AA;"}, popout)
}
exports.tools=editorTools();
