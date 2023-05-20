/* VC Web Apps: Node.JS Modules - templatates > components > sliders
 * Copyright Vincent Chun, VC Learning, used under license
 * REQUIRES vc.js frontend script
 */
// Exports
exports.slider = slider;
exports.nlslider = nlslider;
exports.autoslider = autoslider;
exports.trslider = trslider;
exports.nltrslider = nltrslider;
exports.autotrslider = autotrslider;
exports.sliderform = sliderform;
exports.trsliderform = trsliderform;

const config = require('vc/config');
const ht = require('vc/html');
const tmpl = require('vc/templates');

const rooturl = config.rooturl;

// Slider
function slider(attribs,slides){
	var id=attribs.id;
	var sliderHTML = ht.create(ht.div, attribs, slides);
	var slidinjs = `var sliders = ["${id}"]; initiateSliders(sliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}

// Non-Looping Slider
function nlslider(attribs,slides){
	var id=attribs.id;
	var sliderHTML = ht.create(ht.div, attribs, slides);
	var slidinjs = `var nlsliders = ["${id}"]; initiateNLSliders(nlsliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}

// Automatic Slider
function autoslider(attribs,slides,interval){
	var id=attribs.id;
	if (!interval){interval = 5000;}
	var sliderHTML = ht.create(ht.div, attribs, slides);
	var slidinjs = `var sliders = {${id}:${interval}}; initiateAutoSliders(sliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}

// Transient Slider
function trslider(attribs,slides){
	var id=attribs.id;
	var sliderHTML = ht.create(ht.div, attribs, slides);
	var slidinjs = `var trsliders = ["${id}"]; initiateTrSliders(trsliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}

// Non-Looping Transient Slider
function nltrslider(attribs,slides){
	var id=attribs.id;
	var sliderHTML = ht.create(ht.div, attribs, slides);
	var slidinjs = `var trsliders = ["${id}"]; initiateNLTrSliders(trsliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}

// Automatic Transient Slider
function autotrslider(attribs,slides,interval){
	var id=attribs.id;
	if (!interval){interval = 8000;}
	var sliderHTML = ht.create(ht.div, attribs, slides);
	var slidinjs = `var trsliders = {"${id}":${interval}}; initiateAutoTrSliders(trsliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}


// Input Form Sliders

// Slider Form
function sliderform(attribs,slides){
	var id=attribs.id;
	var sliderHTML = ht.create(ht.form, attribs, slides);
	var slidinjs = `var nlsliders = ["${id}"]; initiateNLSliders(nlsliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}

// Transient Slider Form
function trsliderform(attribs,slides){
	var id=attribs.id;
	var sliderHTML = ht.create(ht.form, attribs, slides);
	var slidinjs = `var trsliders = ["${id}"]; initiateNLTrSliders(trsliders);`
	var sliderinit = tmpl.scriptDOMLoad(slidinjs);
	return ht.create(ht.un, attribs, [sliderHTML,sliderinit]);
}
/* Inline javascript code to go to next slide:
 * slidenext('${sliderId}'); | slidenextnl('${sliderId}'); | trslidenext('${sliderId}'); | trslidenextnl('${sliderId}');
 */ 
function nextBttn(id, attribs, inner){
	if (!attribs){attribs = {class:'button'}}
	attribs.onclick = "slidenext('${id}');";
	return ht.create(ht.span, attribs, inner);
}

function nextBttnNL(id, attribs, inner){
	if (!attribs){attribs = {class:'button'}}
	attribs.onclick = "slidenextnl('${id}');";
	return ht.create(ht.span, attribs, inner);
}

function trnextBttn(id, attribs, inner){
	if (!attribs){attribs = {class:'button'}}
	attribs.onclick = "trslidenext('${id}');";
	return ht.create(ht.span, attribs, inner);
}

function trnextBttnNL(id, attribs, inner){
	if (!attribs){attribs = {class:'button'}}
	attribs.onclick = "trslidenextnl('${id}');";
	return ht.create(ht.span, attribs, inner);
}
