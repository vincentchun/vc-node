/* VC Web Apps: url.js
 * Copyright Vincent Chun, VC Learning, used under license
 */
// Dependencies
const url = require('url')

function root(req){
	return url.format({
		protocol: req.protocol,
		host: req.get('host'),
	});
} exports.root = root;

function redirect(url,delay=0){
	return `<meta http-equiv="refresh" content="${delay}; URL=${url}" />`;
}
