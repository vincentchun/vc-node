/* VC Web Apps: HTML Attributes (for reference)
 * Copyright Vincent Chun, VC Learning, used under license.
 */

var form = {action:[], autocomplete:["on", "off"], method:["get", "post"], name:[]}
exports.form = form;

var global = {id: [], 'class': [], style: []}
exports.global = global;

var input = {}

	input.attributes = ['type', 'name', 'form', 'accept'/*file*/, 'autocomplate', 'autofocus', 'checked'/*checkbox,radio*/, 'disabled', 'formaction'/*submit,image*/, 'formenctype'/*submit,image*/, 'formmethod'/*["get","post"]*/, 'formtarget'/*submit,image*/, 'list', 'max', 'min', 'maxlength', 'minlength', 'multiple', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'src', 'step', 'value'];

	input.type = ["button", "checkbox", "color", "date", "datetime-local", "email", "file", "hidden", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "tel", "text", "time", "url", "week"];
exports.input = input;

var label = {'for': []}
exports.label = label;

var references = ["https://www.w3schools.com/tags/tag_input.asp"]
