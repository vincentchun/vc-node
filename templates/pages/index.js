exports.article = require('./article.js');
exports.find = getPageTemplates;

function getPageTemplates(pageName){
	var templates={};
	try {templates=require(`./${pageName}`);} catch{}
	return templates;
}
