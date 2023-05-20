/* VC Web Apps: regex.js - string manipulation
 * Copyright Vincent Chun, VC Learning
 */
/* var phonenumber= /\d{7}/
 * var phonenumber=new RegExp("\\d{7}", "g")
 * 
 Cheatsheet
Character classes
.	any character except newline
\w\d\s	word, digit, whitespace
\W\D\S	not word, digit, whitespace
[abc]	any of a, b, or c
[^abc]	not a, b, or c
[a-g]	character between a & g
Anchors
^abc$	start / end of the string
\b\B	word, not-word boundary
Escaped characters
\.\*\\	escaped special characters
\t\n\r	tab, linefeed, carriage return
Groups & Lookaround
(abc)	capture group
\1	backreference to group #1
(?:abc)	non-capturing group
(?=abc)	positive lookahead
(?!abc)	negative lookahead
Quantifiers & Alternation
a* a+ a?	0 or more, 1 or more, 0 or 1
a{5} a{2,}	exactly five, two or more
a{1,3}	between one & three
a+? a{2,}?	match as few as possible
ab|cd	match ab or cd
 */
exports.rx = rx;
exports.mod = mod;
exports.chbw = chbw;
exports.escape = escape;
exports.or = or;
exports.nor = nor;
exports.group = group; exports.gr = group;
exports.until = until;
exports.ltgt = ltgt;
exports.tagattr = tagattr;
exports.ht = ht;
exports.hc = hc;
exports.and = and;
exports.word = word;
exports.wordpart = wordpart;
exports.keepf = keepf;
exports.keepr = keepr;
exports.charinc = charinc;
exports.expinc = expinc;


function lg(tolog, ref=''){console.log('vc/regex.js > ' + ref); console.log(tolog); }

// Constants
const rndbrcktsstr = /(^[(][\s\S]*[)]$)/g; //String that starts with '(' & ends with )
exports.rndbrcktsstr = rndbrcktsstr;

const rndbrckts = /(\b[(][\s\S]*[)]\b)/g;

// Functions
function rx(exp, flag){
	expression = RegExp(exp, mod(flag)); //lg(expression, 'rx'); // To do: escaping, eg \ => \\
	return RegExp(exp, mod(flag));
}


function mod(switches){
	var swtch = "";
	if (switches){
		if (switches.includes('g')){swtch=swtch+'g';}
		if (switches.includes('i')){swtch=swtch+'i';}
		if (switches.includes('m')){swtch=swtch+'m';}
	}
	return swtch; 
}

// Characters
const ANYCHAR = '.'; // any character except newline
const WORD = '\w', NOTWORD = '\W'; // word, not word
const DIGIT = '\d', NOTDIGIT = '\D'; // digit (numeric), not digit
const SPACE = '\s', NOTSPACE = '\S'; // whitespace, not whitespace

const TAB = '\t';
const NEWLINE = '\n';
const RETURNC = '\r';

const ANY='[\s\S]';

const wordchars = '[0-z]|';

const separators = '[\\s\.,;]+';
exports.separators = separators;

function flt(str){
	if (!str){str=''}
	return str;
}

function chbw(a,b){ //char between (ASCII)
	return '['+a+'-'+b+']';
}

function escape(char){
	return '\\' + char; // \. \* \\ 
} 

// Or, Nor (any of, not any of)
function or(str){ // any - can include groups of chars. Can use to escape chars, eg [(] [)]
	return '['+str+']';
}

function nor(str){ // not
	return '[^'+str+']';
}

function group(exp, flag=false, ignoreifgrouped=true){
	if (ignoreifgrouped && exp.match(rndbrcktsstr)){ 
		return flag ? rx(exp) : exp;
	}
	return flag ? rx('(' + exp + ')', mod(flag)) : '(' + exp + ')';
}
gr=group;

//Patterns

function until(stop){
	return ".*?"+stop; // Any char, 0+, few as possible till next char
}

function ltgt(tagname, group=true){ // XML & HTML tags: <div attr=""...>
	var exp = '<' + tagname + until('>');
	return group ? gr(exp) : exp;
}

function tagattr(tagname, attr, group=true){// not working
	var [key, val] = attr;
	return group ? `(<${tagname}.+${key}\s*=\s*${val}.+?>)` : `<${tagname}.+${key}\s*=\s*val.+.*>`;
}

//HTML Tag
function ht(tagname, flag){
	return flag ? rx(ltgt(tagname), flag) : ltgt(tagname);
}

//HTML closing tag
function hc(tagname, flag){
	return flag ? rx(ltgt('/'+tagname), flag) : ltgt('/'+tagname);
}

function and (a,b){ // Probably doesn't work how I want
	return `(?=.*\\b` + a + `\\b);(?=.*\\b` + b + `\\b)`;
}

function word(wordstr){
	return `(\\b${wordstr}\\b)`;
}

function wordpart(wordstr){
	return `(${flt(wordstr)}\\w)`;
}

function keepf(exp, flag=false){
	return flag ? rx(`(?=${exp})`,flag) : `(?=${exp})`;
}

function keepr(exp, flag=false){
	return flag ? rx(`(?<=${exp})`,flag) : `(?<=${exp})`;
}

function keepfr(ex1,ex2, flag=false){
	return flag ? rx(`(?=${ex1})|(?<=${ex2})`,flag) : `(?=${ex1})|(?<=${ex2})`;
}

// String split, include delimiter character in array on its own, eg charstr = '()' to split off '(' and ')'
function charinc(charstr, flag){
	return flag ? rx(`([${charstr}])`, flag) :`([${charstr}])`;
}

// String split, include delimiter expression in array on its own, eg expa = ['[(]','[)]'] to split off '(' and ')'
function expinc(expa, flag){
	if (expa){
		var exp = `${expa[0]}`; // before putting into ()
		for (i=1; i < expa.length; i++){
			exp = exp + '|' + expa[i];
		}
	exp = group(exp);
	return flag ? rx(exp, flag) : exp;
	} else {
		return '';
	}
}

/*
function parenthesisOpen(flag){
	return  rx('(?=[(])',flag); //rx('(?=\\()','g');
}

function parenthesisInner(flag){
	return rx('[(\b()()\b))]','g');//rx('[(?=\\()(?<=\\))]','g'); //rx('[(\((?=\b))((?<=\b)\))]','g')
}
//var div = "<div.*?>$"; // "<div" + (any character, zero or more times, as few as possible,) + >

// (<div).*?(class=['"].*\s*banana\s+.*['"]).*?(<\/div>)
//<div class="banana orange">Ho, this is a fruit!</div>

// (<div).*?(class=['"].*(?=.*\bbanana\b)(?=.*\borange\b).*['"]).*?(<\/div>).*[\s\S]
// <div class="banana orange">Ho, this is a fruit!</div>

/* References
 * http://www.javascriptkit.com/jsref/regexp.shtml
 * https://stackoverflow.com/questions/12001953/javascript-and-regex-split-string-and-keep-the-separator
 * https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285
 * https://www.ocpsoft.org/tutorials/regular-expressions/and-in-regex/
 */ 
