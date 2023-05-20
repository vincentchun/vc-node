/* VC Web Apps: Movable popout 
 * Copyright: Vincent Chun, VC Learning; Used under individual license
 */
// Dependencies
const ht = require('vc/html');

// Function exports
exports.movable_elem = movable_elem;
//exports.movablecss=movablecss;
exports.movablejs = movablejs;
exports.apply = apply;
exports.complete = complete;
exports.popout = popout;
// Constants
var divStyle = `position: absolute; z-index: 2; background-color: #f0f0f0; text-align: center; border: 1px solid #d3d3d3; width:400px; max-width:9999px; overflow:auto; resize:both; display:none;`;
var headerStyle = `position: static; display:grid; grid-template-columns: 1fr min-content; height: 20px; padding: 2px 6px; cursor: move; z-index: 10; background-color: #444444;//#2196F3; text-align:right; font-family: arial, sans-serif; color: #fff;`;

function movable_elem(attr, inner, opts={closable:false}){
	var id='movable', closer='';
	if (attr.id){id=attr.id;}
	var mover = ht.div({id:attr.id+'_mover',style:"width:90%;height:100%;float:left;"});
	try{if (opts.closable){closer=ht.create(ht.div, {title:'close', onclick:`toggleq('#${attr.id}');`}, 'X');}}catch{}
	var header = ht.create(ht.div,{id:attr.id+'_header', style:headerStyle},[mover,closer]);
	var el = ht.create(ht.div,{id:attr.id, style:divStyle},[header,inner/*,movablecss(attr.id)*/]);
	return el;
}

function movablecss(id){// Not needed, as css is included in style attributes instead
	return ht.create(ht.style, {}, `#${id} {${divStyle}} #${id}_header {${headerStyle}}`)
}

function movablejs(){
	const dragFunc = `function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  document.getElementById(elmnt.id + "_mover").onmousedown = dragMouseDown;
  if (! document.getElementById(elmnt.id + "_mover")) {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}`;
	return ht.create(ht.script, {}, dragFunc);
}

function apply(id){
	return ht.create(ht.script,{},`dragElement(document.getElementById("${id}"));`);
}

function complete(attr, inner){
	var elem = movable_elem(attr,inner, {closable:false});
	var js = movablejs(attr.id);
	var appl = apply(attr.id);
	return ht.create(ht.un, {},[elem,js,appl]);
}

function popout(poptag, attr, inner){
	var elem = movable_elem(attr,inner, {closable:true});
	//var css = ht.create(ht.style,{},`#${attr.id} {display:none;}`);
	var popper = ht.create(ht.div,{onclick:"popnext(this);"}, poptag);
	return ht.create(ht.div, {id:attr.id+'popout', style:"position:relative;"},[popper,elem,movablejs(),apply(attr.id)]);
}
