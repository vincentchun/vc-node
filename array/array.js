/* VC Web Apps: array.js
 * Copyright Vincent Chun, VC Learning, used under license
 */
// Function Exports
exports.addBegin = addBegin;
exports.addEnd = addEnd;
exports.insertAt = insertAt;
exports.col = col;
exports.doEach = doEach;
exports.filter = filter;
exports.filter2d = filter2d;
exports.filterind = filterind;
exports.strarrayfilt = strarrayfilt;

// filters
exports.exists = exists;
exports.defined = defined;
exports.emptystr = emptystr;
exports.existstr = existstr;
exports.equals = equals;
exports.morethan = morethan;
exports.lessthan = lessthan;
exports.morethneq = morethneq;
exports.lessthneq = lessthneq;
exports.inrange = inrange;
exports.outside = outside;
exports.strincludes = strincludes;

// Add source to target
function addBegin(target, source){
	if (target.constructor === Array){
		return target.unshift(source);
	} else {
		return [target].unshift(source);
	}
}

function addEnd(target, source){
	if (target.constructor === Array){
		return target.push(source);
	} else {
		return [target].push(source);
	}
}

function insertAt(target, index, source){
	if (index == NaN){
		return target;
	} else {
		return target.splice(index, 0, source);
	}
}	

function col(array, ind){ // return column of 2D array by index
	var l=array.length, i, column=[];
	for(i=0; i<l; i++){
		column.push(array[i][ind]);
	}
	return column;
}


function doEach(array, func){ // return array of processed elements
	var l=array.length, i, processed=[];
	for(i=0; i<l; i++){
		processed.push(func(array[i]));
	}
	return processed;
}


function filter(array, comparison, criteria){ // filter array by criteria (logical function) and comparison data
	compare = function(a){
		return criteria(a, comparison);
	}
	return array.filter(compare);
}


function filter2d(array, comparison, indx=0, criteria=equals){ // filter 2-dimensional array by row/inner-index
	var l = array.length, i, filtered=[];
	for(i=0; i<l; i++){
		if (criteria(array[i][indx], comparison)) {
			filtered.push(array[i]);
			}
	}
	return filtered;
}

function filterind(array, comparison, criteria=equals){ // return array indices of elements that match
	var l=array.length, i, indices=[];
	for (i=0; i<l; i++){
		if (criteria(array[i], comparison)){
			indices.push(i);
		}
	}
	return indices;
}

function strarrayfilt(strarray){
	return strarray.filter(existstr);
}

// Filters
// Single var
function exist(a){
	if (a ==0){
		return true;
	} else {
		return a;
	}
}

function exists(a){
	if (a == undefined || a == null){
		return false;
	} else {
		return true;
	}
}

function defined(a){
	if (a == undefined){
		return false;
	} else {
		return true;
	}
}

function emptystr(a){
	if (a == ''){
		return true;
	}
}

function existstr(a){
	return (exist(a) && !emptystr(a));
}
// Binary
function equals(a, b){
	return a==b;
}

function morethan(a, b){
	return a>b;
}

function lessthan(a, b){
	return a<b;
}

function morethneq(a, b){
	return a>=b;
}

function lessthneq(a, b){
	return a<=b;
}

function inrange(a, b){
	return a>=b[0] && a<=b[1];
}

function outside(a, b){
	return !inrange(a, b);
}

function strincludes(a, b){
	return a.includes(b);
}

