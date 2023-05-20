/* VC Web Apps: config.js - configuration file
 * Copyright Vincent Chun, VC Learning
 */

/*== Config may be overridden by config.js in app root directory (see bottom of this script) */

//== Global Variables
// APPDIR
// Specify Root Directory of App
try {_APPDIR = _APPDIR} catch(err) {_APPDIR = __dirname}

// ROOT URL
// Specify root URL of front-end web app; _ROOTURL may be defined as global variable in app.js
try {_ROOTURL = _ROOTURL} catch(err) {_ROOTURL = `http://localhost:3000`};

// System Admin Auth Accounts
const sysAdmin = [1];

//== App Settings
const appName = 'VC Web Apps';

const appdir = _APPDIR;

const rooturl = _ROOTURL;

//Database - SQLITE
const dbpath = _APPDIR + '/db/smartups.db';

const databases = {
	default_sqlite: {
		dbms: 'sqlite',
		path: _APPDIR + '/db/smartups.db'
	}
};

// Main Menu
var mainmenu = {
	Home: {href: _ROOTURL},
}

// Allow config to be overridden by config.js in APPDIR
try {
	customConfig = require(_APPDIR + '/config'); //lg(customConfig);
	if (customConfig){
		exports = Object.assign(exports, customConfig);
	}
} catch(err){
	lg(`VC Config: '${_APPDIR}/config' not found - using default config.\n -- ` + '>>' + err.message, 'Import');
	customConfig = null;
}

//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/config.js > `+ ref); console.log(tolog); }

//Exports
exports.sysAdmin = sysAdmin;
exports.appName = appName;
exports.appdir = appdir;
exports.rooturl = rooturl;
exports.dbpath = dbpath;
exports.databases = databases;
exports.mainmenu = mainmenu;
