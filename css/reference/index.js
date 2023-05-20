csprop = require('../properties.js').prop;
fs = require('fs');
fs.readFile('css-refindex.html', 'utf-8', (err,data)=> {
	//console.log(data);
});

//console.log(JSON.stringify(csprop));
var body = fs.readFileSync(`${__dirname}/body.html`, 'utf-8');
var css = fs.readFileSync(`${__dirname}/style.css`, 'utf-8');
var cssPropertiesJS = `var cssProperties = ${JSON.stringify(csprop)};`;
var js = fs.readFileSync(`${__dirname}/script.js`, 'utf-8');

var apply = `autocomplete(document.getElementById("cssInput"), cssProperties, {disp:"#info-display",showProps:['shorthand'],showSubProps:['values'], copyText:true});`;
/*console.log(body);
console.log(css);
console.log(cssPropertiesJS);
console.log(js);*/
var html = body + '<style>'+css+'</style>' + '<script>'+cssPropertiesJS+js+apply+'</script>'
exports.html = html;
//console.log(html);
