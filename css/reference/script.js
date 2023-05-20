
function autocomplete(inp, properties, opts={disp:"#info-display", showProps:[], showSubProps:[], copyText:true}, itemClick=showInfo) {
	var arr = Object.keys(properties);
	var currentFocus;
	inp.addEventListener("input", function(e) {/*listen for text input*/
		var a, b, i, val = this.value; // a: autocomplete list; b: list items;
		closeAllLists();/*close any already open lists of autocompleted values*/
		if (!val) { return false;}
		currentFocus = -1;

		a = document.createElement("DIV");/* autocomplete list - create a DIV element that will contain the items (values):*/
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");

		this.parentNode.appendChild(a);/*append autocomplete list as a child of the autocomplete container:*/

		for (i = 0; i < arr.length; i++){/*for each item in the array...*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {/*check if the item starts with the same letters as the text field value:*/
				b = document.createElement("DIV"); /*create a DIV element for each matching element:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";/*make the matching letters bold:*/
				b.innerHTML += arr[i].substr(val.length);/*add the rest of the string*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";/*insert a input field that will hold the current array item's value:*/
				b.addEventListener("click", function(e) {/*execute a function when someone clicks on the item value (DIV element):*/
					inp.value = this.getElementsByTagName("input")[0].value;/*insert the value for the autocomplete text field:*/
					itemClick(inp, properties, opts);// On item click, eg: display property info
					closeAllLists();/*close the list of autocompleted values, (or any other open lists of autocompleted values:*/
				});
				a.appendChild(b);
			}
		}
	});
	
	
	inp.addEventListener("keydown", function(e) {/*Navigating list: execute a function on up/down arrow key presses*/
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed, increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed, decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});
	
	function addActive(x) {/*a function to classify an item as "active":*/
		if (!x) return false;
		removeActive(x);/*start by removing the "active" class on all items:*/
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");/*add class "autocomplete-active":*/
	}
	
	function removeActive(x) {/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	
	function closeAllLists(elmnt) {/*close all autocomplete lists in the document, except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	
	document.addEventListener("click", function (e) {/*close lists if click in document*/
			closeAllLists(e.target);
	});
}

// Show Info on click
function showInfo(input, properties, opts={disp:"#info-display", showProps:['shorthand'], showSubProps:['values'], copyText:true}){
	var disp = document.querySelector(opts.disp); // #info-display
	var showProps = opts.showProps, showSubProps = opts.showSubProps, onclickcopyattr='';
	if (opts.copyText){
		onclickcopyattr = 'onclick="copyText(this);"';
		var dispOpts = {copyText:opts.copyText}
	}
	// Display property
	var info = `<span ${onclickcopyattr}>${input.value}</span>:<div style="margin-left:1em">${propDisp(properties[input.value], dispOpts)}</div><hr>`;
	var propArrays = {}, subPropArrays={};// eg: {shorthand: [related shorthand]}, {values: [values to print]}
	
	// Create arrays for (sibling) Property values
	for (let i=0; i<showProps.length; i++){
		propArrays[showProps[i]] = []; // Declare empty array
		if (properties[input.value][showProps[i]]){// If selected property has showProp, add those props to list
			let prop = mergeKeys(properties[input.value][showProps[i]]);
			propArrays[showProps[i]] = propArrays[showProps[i]].concat(prop); //!Object.keys()
		}
	}
	// Create arrays for subProp values - for each showSubProps, subPropArrays[showSubProps[i]]=[]
	for (let i=0; i<showSubProps.length; i++){
		subPropArrays[showSubProps[i]]=[];// Declare empty array
		if (properties[input.value][showSubProps[i]]){
			subPropArrays[showSubProps[i]] = subPropArrays[showSubProps[i]].concat(properties[input.value][showSubProps[i]]);
		}
	}
	//console.log(JSON.stringify(propArrays)); console.log(JSON.stringify(subPropArrays));
	
	// For each propArray, display those props
	for (let [prop,keys] of Object.entries(propArrays)){
		info = info + `<p class="prop" style="font-weight:bold;"># ${prop}</p>` + propDispList(properties, keys, dispOpts);
	}
	
	// For each subPropArray, add from sibling props and display those subProps -- still not work
	for (let [subProp,spkeys] of Object.entries(subPropArrays)){ // {values: [length, color]}
		for (let [prop,pkeys] of Object.entries(propArrays)){// {shorthand: [border-color, border-width]}For each prop key, get subprops
			for (let i=0; i<pkeys.length; i++){
				if (properties[pkeys[i]][subProp]){// if properties['border-color']['values']
					subPropArrays[subProp] = subPropArrays[subProp].concat(properties[pkeys[i]][subProp]);
				}
			}
		} //console.log(properties[subProp]); console.log(subPropArrays);
		subPropArrays[subProp] = mergeKeys(subPropArrays[subProp]);// remove dups
		info = info + `<p class="subprop" style="font-weight:bold;">## ${subProp}</p>` + propDispList(properties[subProp], subPropArrays[subProp], dispOpts);
	}

	disp.innerHTML = info;
/*	if (opts.copyonclick){//not working
		onclickCopy(opts.copyonclick);
	}*/
	function inSubProps(val){
		var is=false;
		for (let i=0; i<showSubProps.length; i++){
			is = is || properties[showSubProps[i]][stripKey(val)];
		}
		return is;
	}
	// Property display functions
	function propDisp(obj,opts){
		var html = '', onclickcopyattr='';
		try{if (opts.copyText){onclickcopyattr = 'onclick="copyText(this);"';}}catch{}
		if (Array.isArray(obj)){//Array: list array elements, one per row
			for (let i=0; i<obj.length; i++){
				var val = obj[i];
				mrk = inSubProps(val) ? ' *': '';//properties.values[stripKey(val)] ? ' *': '';
				html = html + `<div class="pd-array-el" style="margin-left:1em"><span ${onclickcopyattr}>${val}</span>${mrk}</div>`
			}
		} else if (typeof obj === 'object'){//Object: list enumerable key, then indent property val
			for (const [key,val] of Object.entries(obj)){
				html = html + `<span class="pd-key" ${onclickcopyattr}>${key}</span>:<div class="pd-keyval" style="margin-left:1em">${propDisp(val, opts)}</div><hr style="border:0.6px solid #00000016; margin-top:1em;">`;
			}
		} else {
			html = JSON.stringify(obj);
		}
		return html;
	}
	
	function propDispList(obj,keys,opts){
		var html = '', onclickcopyattr='';
		try{if (opts.copyText){onclickcopyattr = 'onclick="copyText(this);"';}}catch{}
		for (let i=0; i<keys.length; i++){
			if (obj[keys[i]]){
				html = html + `<span class='listkey' ${onclickcopyattr}>${keys[i]}</span>:<div style="margin-left:1em">${propDisp(obj[keys[i]],opts)}</div><hr>`
				//html = html + propDisp(obj[keys[i]]);
			}
		}
		return html;
	}

}
	
function mergeKeys(keys){
	var merged = [];
	for (let i=0; i<keys.length; i++){
		if (keys[i].match(/[/|\s]/g)){
			let subkeys = keys[i].split(/[/|\s]/g);// also handle '/' /[/|\s]/g
			for (let j=0; j<subkeys.length; j++){
				let stripped = stripKey(subkeys[j]);
				if (!merged.includes(stripped) && !['','/','|',' '].includes(stripped)){
					merged.push(stripped);
				}
			}
		} else {
			merged.push(stripKey(keys[i]));
		}
	}
	return merged.filter((item,index,array)=>{return array.indexOf(item)===index});//Unique
}
	
function stripKey(key){
	try{
	var stripped = key.replace(/[\[\]()<>^*]/g, '');
	return stripped;
	} catch {return key}
}

function stripKeys(keys){
	var stripped = [];
	for (let i=0; i<keys.length; i++){
		stripped.push(stripKey(keys[i]));
		}
	return stripped;
}
/*
function onclickCopy(querySelectors){//Not working
	console.log(querySelectors);
	if (!querySelectors){return;}
	for (let i=0; i<querySelectors.length; i++){
		let elems = document.querySelectorAll(querySelectors[i]);
		for (let j=0; j<elems.length; j++){
			elems[j].onclick = "copyText(this);";
		}
	}
}
*/

function copyInp(selector){
	document.querySelector(selector).select();
	document.execCommand('copy');
}

function copyText(node) {
	if (typeof node == 'string'){
		node = document.querySelector(node);
	}
	if (document.body.createTextRange) {
		const range = document.body.createTextRange();
		range.moveToElementText(node);
		range.select();
	} else if (window.getSelection) {
		const selection = window.getSelection();
		const range = document.createRange();
		range.selectNodeContents(node);
		selection.removeAllRanges();
		selection.addRange(range);
	} else {
		console.warn("Could not select text in node: Unsupported browser.");
	}
	document.execCommand('copy');
}

// Apply to page
//autocomplete(document.getElementById("myInput"), cssProperties, {disp:"#info-display",showProps:['shorthand'],showSubProps:['values']});
