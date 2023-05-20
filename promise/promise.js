/* VC Web Apps: promise.js -- !!! Exclude
 * Copyright Vincent Chun, VC Learning
 */

// Function exports
exports.res = res;

//Debug
function lg(tolog, ref=''){console.log('promise.js > ' + ref); console.log(tolog); }

function res(promise){
	return promise.then(
		(value)=>{return value;},
		(error)=>{
			lg(error.message, "promise.js > res");
			return null;}
	);
}
