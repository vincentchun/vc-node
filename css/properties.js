/* Node.JS Module
 * VC Web Apps: css - properties.js , ver 20210128
 * Copyright: Vincent Chun, VC Learning. Used under license.
*/

var color = {formats:['#FFF', '#FFFFFF', '#FFFFFFFF', 'rgba(255,255,255,1)', 'color_name']};
var length = {
	type: ['Number'],
	units: {
		absolute:['cm', 'mm', 'in', 'px', 'pt', 'pc'], 
		relative:['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', '%' ],
		grid:['fr']
	}
};
var lengtha = {units:{absolute:length.units.absolute, relative:length.units.relative}};
var lengthb = {units: {absolute:length.units.absolute, relative:['em', 'ex', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax']}};

var cssProperties = {
	'align-content': {
		values: ['stretch','center','flex-start','flex-end','space-between','space-around','initial','inherit'],
		//related: ['flex']
	},
	'align-items': {
		values: ['stretch','center','flex-start','flex-end','baseline','initial','inherit'],
		//related: ['flex']
	},
	'align-self': {
		values: ['auto','stretch','center','flex-start','flex-end','baseline','initial','inherit'],
		//related: ['flex']//parent
	},
	'all': {
		values: ['initial','inherit','unset'],
	},
	'animation': {
		shorthand: ['animation-name','animation-duration','animation-timing-function','animation-delay','animation-iteration-count','animation-direction','animation-fill-mode','animation-play-state'],
		values: ['initial','inherit'],
	},
	'animation-name': {
		values:['keyframename','none','initial','inherit']
	},
	'animation-duration': {
		values:['time','initial','inherit']
	},
	'animation-timing-function': {
		values:['linear','ease','ease-in','ease-out','ease-in-out','step-start','step-end','steps(int,start','end)','cubic-bezier(n,n,n,n)','initial','inherit']
	},
	'animation-delay': {
		values:['time','initial','inherit']
	},
	'animation-iteration-count': {
		values: ['number','infinite','initial','inherit']
	},
	'animation-direction': {
		values: ['normal','reverse','alternate','alternate-reverse','initial','inherit']
	},
	'animation-fill-mode': {
		values: ['none','forwards','backwards','both','initial','inherit']
	},
	'animation-play-state': {
		values: ['paused','running','initial','inherit']
	},
	'backface-visibility': {
		values: ['visible','hidden','initial','inherit']
	},
	'background': {
		shorthand: ['background-color','background-image','background-position','background-size','background-repeat','background-origin','background-clip','background-attachment']
	},
	'background-color': {
		values: ['color','transparent','initial','inherit']
	},
	'background-image': {
		values: ['url','none','initial','inherit']
	},
	'background-position': {
		values: ['left top','left center','left bottom','right top','right center','right bottom','center top','center center','center bottom', 'top','left','bottom','right','center']
	},
	'background-size': {
		values: ['auto','length','cover','contain','initial','inherit']
	},
	'background-repeat': {
		values: ['repeat','repeat-x','repeat-y','no-repeat','initial','inherit']
	},
	'background-origin': {
		values: ['padding-box','border-box','content-box','initial','inherit']
	},
	'background-clip': {
		values: ['border-box','padding-box','content-box','initial','inherit']
	},
	'background-attachment': {
		values: ['scroll','fixed','local','initial','inherit']
	},
	'background-blend-mode': {
		values: ['normal','multiply','screen','overlay','darken','lighten','color-dodge','saturation','color','luminosity']
	},
	'border': {
		shorthand: ['border-width', 'border-style', 'border-color']
	},
	'border-width': {
		values: ['medium','thin','thick','length','initial','inherit']
	},
	'border-style': {
		values: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','initial','inherit']
	},
	'border-color': {
		values: ['[color]'], note: "max. 4 values: top right bottom left"
	},
	'border-bottom': {
		shorthand: ['border-bottom-width','border-bottom-style','border-bottom-color']
	},
	'border-bottom-width': {
		values: ['medium','thin','thick','length','initial','inherit']
	},
	'border-bottom-style': {
		values: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','initial','inherit']
	},
	'border-bottom-color': {
		values: ['color']
	},
	'border-collapse': {
		values: ['separate','collapse','initial','inherit']//table
	},
	'border-image': {
		shorthand: ['border-image-source','border-image-slice','border-image-width','border-image-outset','border-image-repeat']
	},
	'border-image-source': {
		values: ['none','image','initial','inherit']
	},
	'border-image-slice': {
		values: ['number','%','fill','initial','inherit']
	},
	'border-image-width': {
		values: ['number','%','auto','initial','inherit']
	},
	'border-image-outset': {
		values: ['length','number','initial','inherit']
	},
	'border-image-repeat': {
		values: ['stretch','repeat','round','initial','inherit']
	},
	'border-left': {
		shorthand: ['border-left-width','border-left-style','border-left-color']
	},
	'border-left-width': {
		values: ['medium','thin','thick','length','initial','inherit']
	},
	'border-left-style': {
		values: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','initial','inherit']
	},
	'border-left-color': {
		values: ['color']
	},
	'border-radius': {
		shorthand: ['border-top-left-radius','border-top-right-radius','border-bottom-right-radius','border-bottom-left-radius']
	},
	'border-top-left-radius': {
		values: ['[length]', 'initial', 'inherit']
	},
	'border-top-right-radius': {
		values: ['[length]', 'initial', 'inherit']
	},
	'border-bottom-right-radius': {
		values: ['[length]', 'initial', 'inherit']
	},
	'border-bottom-left-radius': {
		values: ['[length]', 'initial', 'inherit']
	},
	'border-right': {
		shorthand: ['border-right-width','border-right-style','border-right-color']
	},
	'border-right-width': {
		values: ['medium','thin','thick','length','initial','inherit']
	},
	'border-right-style': {
		values: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','initial','inherit']
	},
	'border-right-color': {
		values: ['color']
	},
	'border-spacing': {
		values: ['length','initial','inherit'],
		elements: ['table'],//table
		requires: ['border-collapse: separate;']
	},
	'border-top': {
		shorthand: ['border-top-width','border-top-style (required)','border-top-color']
	},
	'border-top-width': {
		values: ['medium','thin','thick','length','initial','inherit']
	},
	'border-top-style': {
		values: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','initial','inherit']
	},
	'border-top-color': {
		values: ['color']
	},
	'bottom': {
		values: ['auto','length','initial','inherit']
	},
	'box-decoration-break': {
		values: ['slice','clone','initial','inherit']
	},
	'box-shadow': {
		values: ['none','box-shadow','[h-offset v-offset (blur) (spread) (color) (inset)]','initial','inherit']
	},
	'box-sizing': {
		values:['content-box','border-box','initial','inherit']
	},
	'break-after': {
		values: ['auto','all','always','avoid','avoid-column','avoid-page','avoid-region','column','left','page','recto','region','right','verso','initial','inherit']
	},
	'break-before': {
		values: ['auto','all','always','avoid','avoid-column','avoid-page','avoid-region','column','left','page','recto','region','right','verso','initial','inherit']
	},
	'break-inside': {
		values: ['auto','all','always','avoid','avoid-column','avoid-page','avoid-region','column','left','page','recto','region','right','verso','initial','inherit']
	},
	'caption-side': {
		values: ['top','bottom','initial','inherit']
	},
	'caret-color': {
		values: ['auto','color','initial','inherit']
	},
	'clear': {
		values: ['none','left','right','both','initial','inherit']
	},
	'clip': {
		values: ['auto','shape','initial','inherit'],
		note: 'Deprecated - use \'clip-path\' instead.'
	},
	'clip-path': {
		values: ['clip-source','basic-shape','margin-box','border-box','padding-box','content-box','fill-box','stroke-box','view-box','none','initial','inherit']
	},
	'color': {
		values: ['color']
	},
	'columns': {
		shorthand: ['column-width','column-count']
	},
	'column-width': {
	},
	'column-count': {
	},
	'column-fill': {
		values: ['balance','auto','initial','inherit']
	},
	'column-gap': {
		values: ['length','normal','initial','inherit']
	},
	'column-rule': {
		shorthand: ['column-rule-width','column-rule-style','column-rule-color']
	},
	'column-span': {
		values: ['none','all','initial','inherit']
	},
	'content': {
		values: ['normal','none','counter','attr','string','open-quote','close-quote','no-open-quote','no-close-quote','url','initial','inherit'],
		pseudo: ['::before', '::after']
	},
	'counter-increment': {
		values: ['none','id','initial','inherit'],
		related: ['counter-reset','content']
	},
	'counter-reset': {
		values: ['none','name number','initial','inherit'],
		related: ['counter-increment','content']
	},
	'cursor': {
		values: ['alias','all-scroll','auto','cell','context-menu','col-resize','copy','crosshair','default','e-resize','ew-resize','grab','grabbing','help','move','n-resize','ne-resize','nesw-resize','ns-resize','nw-resize','nwse-resize','no-drop','none','not-allowed','pointer','progress','row-resize','s-resize','se-resize','sw-resize','text','URL','vertical-text','w-resize','wait','zoom-in','zoom-out','initial','inherit']
	},
	'direction': {
		values: ['ltr','rtl','initial','inherit']
	},
	'display': {
		values: ['inline', 'block', 'contents', 'flex', 'grid', 'inline-block', 'inline-flex', 'inline-grid', 'inline-table', 'list-item', 'run-in', 'table', 'table-caption', 'table-column-group', 'table-header-group', 'table-footer-group', 'table-row-group', 'table-cell', 'table-column', 'table-row', 'none', 'initial', 'inherit']
	},
	'empty-cells': {
		values: ['show','hide','initial','inherit'],
		tagname: ['table']
	},
	'filter': {
		values: ['none', 'blur()', 'brightness()', 'contrast()', 'drop-shadow()', 'grayscale()', 'hue-rotate()', 'invert()', 'opacity()', 'saturate()', 'sepia()', 'url()']
	},
	'flex': {
		shorthand: ['flex-grow', 'flex-shrink', 'flex-basis'],
		values: ['auto','initial','inherit']
	},
	'flex-grow': {
		values: ['number', 'initial', 'inherit']
	},
	'flex-shrink': {
		values: ['number', 'initial', 'inherit']
	},
	'flex-basis': {
		values: ['number', 'initial', 'inherit']
	},
	'flex-flow': {
		shorthand: ['flex-direction flex-wrap'],
		values: ['initial','inherit']
	},
	'flex-direction': {
		values: ['row','row-reverse', 'column', 'column-reverse', 'initial', 'inherit']
	},
	'flex-wrap': {
		values: ['nowrap', 'wrap', 'wrap-reverse', 'initial', 'inherit']
	},
	'float': {
		values: ['none', 'left', 'right', 'initial', 'inherit']
	},
	'font': {
		shorthand: ['font-style', 'font-variant', 'font-weight', 'font-size / line-height', 'font-family'],
		values: ['caption', 'icon', 'menu', 'message-box', 'small-caption', 'status-bar', 'initial', 'inherit']
	},
	'font-style': {
		values: ['normal', 'italic', 'oblique', 'initial', 'inherit']
	},
	'font-variant': {
	},
	'font-weight': {
	},
	'font-size': {
		values: ['number', 'medium', 'xx-small', 'x-small', 'small', 'large', 'x-large', 'xx-large', 'smaller', 'larger', 'initial', 'inherit']
	},
	'line-height': {
		'values': ['number','normal','length','initial','inherit'],
		'units': ['']
	},
	'font-family': {
		values: ['family-name','generic-family','initial','inherit']
	},
	'font-feature-settings': {
		values: ['normal','feature-value']
	},
	'font-kerning': {
		values: ['auto','normal','none']
	},
	'font-size-adjust': {
		values: ['number','none','initial','inherit']
	},
	'font-variant': {
		values: ['normal','small-caps','initial','inherit']
	},
	'font-variant-caps': {
		values: ['normal', 'small-caps', 'all-small-caps', 'petite-caps', 'all-petite-caps', 'unicase', 'titling-caps', 'initial', 'inherit', 'unset']
	},
	'font-weight': {
		values: ['normal','bold','bolder','lighter', 'number', 'initial', 'inherit']
	},
	'grid': {
		shorthand: ['grid-template-rows / grid-template-columns', 'grid-template-areas', 'grid-template-rows / (grid-auto-flow) grid-auto-columns', '(grid-auto-flow) grid-auto-rows / grid-template-columns'],
		values: ['none', 'initial', 'inherit'],
		requires: ['display:grid;']
	},
	'grid-template': {
		shorthand: ['grid-template-rows / grid-template-columns','grid-template-areas'],
		values: ['none','initial','inherit'],
		requires: ['display:grid;']
	},
	'grid-template-rows': {
		values: ['none','auto','max-content','min-content','length','initial','inherit'],
		//units: ['fr'],
		requires: ['display:grid;']
	},
	'grid-template-columns': {
		values: ['none','auto','max-content','min-content','length','initial','inherit'],
		//units: ['fr'],
		requires: ['display:grid;']
	},
	'grid-template-areas': {
		values: ['grid-areas'], // 1 string per row, each row same number of area names
		requires: ['display:grid;']
	},
	'grid-auto-rows': {
		values: ['auto','max-content','min-content','length'],
		requires: ['display:grid;']
	},
	'grid-auto-columns': {
		values: ['auto','max-content','min-content','length'],
		requires: ['display:grid;']
	},
	'grid-auto-flow': {
		values: ['row','column','dense','row dense','column dense'],
		requires: ['display:grid;']
	},
	'grid-area': {
		shorthand: ['grid-row-start / grid-column-start / grid-row-end / grid-column-end'],
		values: ['grid-areas'],
		parent: ['display:grid;'],
		'Eg. using grid-template-areas': ["grid-area: header; // eg, user specified area name: 'header'"]
	},
	'grid-row': {
		shorthand: ['grid-row-start / grid-row-end'],
		parent: ['display:grid;']
	},
	'grid-row-start': {
		values: ['auto', 'row-line'],
		parent: ['display:grid;']
	},
	'grid-row-end': {
		values: ['auto','row-line','span n'],
		parent: ['display:grid;']
	},
	'grid-column': {
		shorthand: ['grid-column-start / grid-column-end'],
		parent: ['display:grid;']
	},
	'grid-column-start': {
		values: ['auto','span n','column-line'],
		parent: ['display:grid;']
	},
	'grid-column-end': {
		values: ['auto','span n','column-line'],
		parent: ['display:grid;']
	},
	'grid-gap': {
		shorthand: ['grid-row-gap grid-column-gap'],
		requires: ['display:grid;']
	},
	'grid-row-gap': {
		values: ['length'],
		requires: ['display:grid;']
	},
	'grid-column-gap': {
		values: ['length'],
		requires: ['display:grid;']
	},
	/* Hanging Punctuation - not supported by major browsers*/
	'height': {
		values: ['auto','length','initial','inherit']
	},
	'hyphens': {
		values: ['none','manual','auto','initial','inherit']
	},
	'isolation': {
		values: ['auto','isolate','initial','inherit']
	},
	'justify-content': {
		values: ['flex-start','flex-end','center','space-between','space-around','space-evenly','initial','inherit']
	},
	'left': {
		values: ['auto','length','initial','inherit']
	},
	'letter-spacing': {
		values: ['normal','length','initial','inherit']
	},
	'list-style': {
		shorthand: ['list-style-type list-style-position list-style-image'],
		values: ['initial','inherit']
	},
	'list-style-type': {
		values: ['disc','armenian','circle','cjk-ideographic','decimal','decimal-leading-zero','georgian','hebrew','hiragana','hiragana-iroha','katakana','katakana-iroha','lower-alpha','lower-greek','lower-latin','lower-roman','none','square','upper-alpha','upper-greek','upper-latin','upper-roman','initial','inherit']
	},
	'list-style-position': {
		values: ['inside','outside','initial','inherit']
	},
	'list-style-image': {
		values: ['none','url','initial','inherit']
	},
	'margin': {
		shorthand: ['margin-top','margin-right','margin-bottom','margin-left'],
		values: ['auto','initial','inherit']
	},
	'margin-top': {
		values: ['none','length','initial','inherit']
	},
	'margin-right': {
		values: ['none','length','initial','inherit']
	},
	'margin-bottom': {
		values: ['none','length','initial','inherit']
	},
	'margin-left': {
		values: ['none','length','initial','inherit']
	},
	'max-height': {
		values: ['none','length','initial','inherit']
	},
	'max-width': {
		values: ['none','length','initial','inherit']
	},
	'min-height': {
		values: ['length','initial','inherit']
	},
	'min-width': {
		values: ['length','initial','inherit']
	},
	'mix-blend-mode': {
		values: ['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','difference','exclusion','hue','saturation','color','luminosity']
	},
	'object-fit': {
		values: ['fill','contain','cover','scale-down','none','initial','inherit']
	},
	'object-position': {
		values:['x-axis y-axis','initial','inherit']
	},
	'opacity': {
		values: ['number','initial','inherit']
	},
	'order': {
		values: ['number','initial','inherit']
	},
	'outline': {
		shorthand: ['outline-width outline-style outline-color'],
		values: ['initial','inherit']
	},
	'outline-width': {
		values: ['medium','thin','thick','length','initial','inherit']
	},
	'outline-style': {
		values: ['none','hidden','dotted','dashed','solid','double','groove','ridge','inset','outset','initial','inherit']
	},
	'outline-color': {
		values: ['invert','color','initial','inherit']
	},
	'outline-offset': {
		values: ['length','initial','inherit']
	},
	'overflow': {
		values: ['visible','hidden','scroll','auto','initial','inherit']
	},
	'overflow-x': {
		values: ['visible','hidden','scroll','auto','initial','inherit']
	},
	'overflow-y': {
		values: ['visible','hidden','scroll','auto','initial','inherit']
	},
	'padding': {
		shorthand: ['padding-top','padding-right','padding-bottom','padding-left'],
		values: ['length','initial','inherit']
	},
	'padding-top': {
		values: ['length','initial','inherit']
	},
	'padding-right': {
		values: ['length','initial','inherit']
	},
	'padding-bottom': {
		values: ['length','initial','inherit']
	},
	'padding-left': {
		values: ['length','initial','inherit']
	},
	'page-break-after': {
		values: ['auto','always','avoid','left','right','initial','inherit']
	},
	'page-break-before':  {
		values: ['auto','always','avoid','left','right','initial','inherit']
	},
	'page-break-inside':  {
		values: ['auto','avoid','initial','inherit']
	},
	'perspective':  {
		values: ['length','none']
	},
	'perspective-origin':  {
		values: ['x-axis y-axis','initial','inherit']
	},
	'pointer-events': {
		values: ['auto','none']
	},
	'position': {
		values: ['static','absolute','fixed','relative','sticky','initial','inherit']
	},
	'quotes': {
		values: ['none','string','initial','inherit']
	},
	'resize': {
		values: ['none','both','horizontal','vertical','initial','inherit']
	},
	'right': {
		values: ['auto','length','initial','inherit']
	},
	'scroll-behavior': {
		values: ['auto','smooth','initial','inherit']
	},
	'tab-size': {
		values: ['number','length','initial','inherit']
	},
	'table-layout': {
		values: ['auto','fixed','initial','inherit']
	},
	'text-align': {
		values: ['left','right','center','justify','initial','inherit']
	},
	'text-align-last': {
		values: ['auto','left','right','center','justify','start','end','initial','inherit']
	},
	'text-decoration': {
		shorthand: ['text-decoration-line', 'text-decoration-color', 'text-decoration-style'],
		values: ['initial','inherit']
	},
	'text-decoration-line': {
		values: ['none','underline','overline','line-through','initial','inherit']
	},
	'text-decoration-color': {
		values: ['color','initial','inherit']
	},
	'text-decoration-style': {
		values: ['solid','double','dotted','dashed','wavy','initial','inherit']
	},
	'text-indent': {
		values: ['length','initial','inherit']
	},
	'text-justify': {
		values: ['auto','inter-word','inter-character','none','initial','inherit']
	},
	'text-overflow': {
		values: ['clip','ellipsis','string','initial','inherit']
	},
	'text-shadow': {// Multiple, comma separated
		values: ['text-shadow','h-shadow v-shadow blur-radius color','none','initial','inherit']
	},
	'text-transform': {
		values: ['none','capitalize','uppercase','lowercase','initial','inherit']
	},
	'top': {
		values: ['auto','length','initial','inherit']
	},
	'transform': {
		values: ['none','transform-functions','initial','inherit']
	},
	'transform-origin': {
		values: ['x-axis y-axis z-axis','initial','inherit']
	},
	'transform-style': {
		values: ['flat','preserve-3d','initial','inherit']
	},
	'transition': {
		shorthand: ['transition-property transition-duration transition-timing-function transition-delay'],
		values: ['initial','inherit']
	},
	'transition-property': {
		values: ['none','all','property','initial','inherit']
	},
	'transition-duration': {
		values: ['time','initial','inherit']
	},
	'transition-timing-function': {
		values: ['linear','ease','ease-in','ease-out','ease-in-out','step-start','step-end','steps(int,start','end)','cubic-bezier(n,n,n,n)','initial','inherit']
	},
	'unicode-bidi': {
		values: ['normal','embed','bidi-override','initial','inherit']
	},
	'user-select': {
		values: ['auto','none','text','all']
	},
	'vertical-align': {
		values: ['baseline','length','sub','super','top','text-top','middle','bottom','text-bottom','initial','inherit']
	},
	'visibility': {
		values: ['visible','hidden','collapse','initial','inherit']
	},
	'white-space': {
		values: ['normal','nowrap','pre','pre-line','pre-wrap','initial','inherit']
	},
	'width': {
		values: ['auto','value','initial','inherit']
	},
	'word-break': {
		values: ['normal','break-all','keep-all','break-word','initial','inherit']
	},
	'word-spacing': {
		values: ['normal','length','initial','inherit']
	},
	'word-wrap': {
		values: ['normal','break-word','initial','inherit']
	},
	'writing-mode': {
		values: ['horizontal-tb','vertical-rl','vertical-lr']
	},
	'z-index': {
		values: ['auto','number','initial','inherit']
	},
	
	
	values: {
		'color': {formats:['#FFF', '#FFFFFF', '#FFFFFFFF', 'rgba(255,255,255,1)', 'color_name']},
		'length': length,/*{
			value: ['Number'],
			units: {
				absolute:['cm','mm','in','px','pt','pc',], 
				relative:['em','ex','ch','rem','vw','vh','vmin','vmax','%'],
				grid:['fr']
			}
		},*/
		'box-shadow': {//[h-offset v-offset (blur) (spread) (color) (inset)]
			formats: ['[h-offset v-offset (blur) (spread) (color) (inset),]'],'h-offset':['length'],'v-offset':['length'],'blur':['length'],'spread':['length'],'color':['color'],'inset':['inset'],
			'<br>values': {length:lengthb, color:color}
		},
		'number': {value: ['Number']},
		'row-line': {value: ['Integer']},
		'column-line': {value: ['Integer']},
		'span n': {formats: ['span 1']},
		'url': {formats: ['url("https://example.com/resource.jpg")']},
		'x-axis y-axis': {'x-axis':['left','center','right','length','%'], 'y-axis': ['top','center','bottom','length','%'], '<br>values': {length:lengtha}},
		'x-axis y-axis z-axis': {'x-axis':['left','center','right','length','%'], 'y-axis': ['top','center','bottom','length','%'], 'z-axis': ['length'],'<br>values': {length:lengtha}},
		'time': {formats: ['1s','1000ms']},
		'clip-source': 'url',
		'basic-shape': {},
		'grid-areas':{
			'parent': {'grid-template-areas':["'header header header header header'<br>'sidebar1 main main main sidebar2'<br>'footer footer footer 'footer footer '"]},
			'child': {'grid-area': ['header']}
		},
		'text-shadow': {
			formats: ['h-shadow v-shadow blur-radius color']
		}
		
		//'keyframename'
	}
}

exports.prop = cssProperties;

//lg(Object.keys(cssProperties).length, 'CSS Properties: ');
//lg(Object.keys(cssProperties), 'CSS Properties: ');
//lg(JSON.stringify(cssProperties.background));
//Debug
function lg(tolog, ref=''){console.log(`\n${__dirname}/properties.js > `+ ref); console.log(tolog); }
