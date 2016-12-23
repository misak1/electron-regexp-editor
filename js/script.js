var $ = jQuery = require("./js/jquery-2.1.4.min.js");
var Hammer = require('./js/hammer.min.js');
var parseJson = require('./js/parse-json.js');
hljs.initHighlightingOnLoad();

var md = require('./js/markdown-it.min.js')({
	html: true,
	linkify: true,
	typographer: true,
	highlight: function (str, lang) {
		lang = lang.split(":")[0];
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) { }
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (__) { }

		return ''; // use external default escaping
	}
});
var mdEditor = CodeMirror.fromTextArea(document.getElementById('editor_textarea'), {
	mode: "markdown",
	autofocus: true,
	lineNumbers: true,
	indentUnit: 2,
	extraKeys: {
		"Enter": "newlineAndIndentContinueMarkdownList"
	},
});
var elLeftVm = $('#left-component');
// left-pane focus.
function elLeftVmForcus() {
	var elm = document.querySelector('.CodeMirror textarea'); // テキストエリアのelement取得
	elm.focus();
	// IE?
	// if (elm.createTextRange) {
	// 	var range = elm.createTextRange();
	// 	range.move('character', 5);
	// 	range.select();
	// } else if (elm.setSelectionRange) {
	// 	elm.setSelectionRange(elm.value.length, 3);
	// }
}


function regExpfilter(input, filepath) {

	var pj = new parseJson(filepath);
	console.log(pj.read());

	var obj = JSON.parse(pj.read());
	Object.keys(obj).forEach(function (key) {
		var k = Object.keys(obj[key]);
		var v = obj[key][k];

		Materialize.toast(key, 1000);

		// console.log(k + "は" + v[0] + "=" + v[1] + "！");
		var re = new RegExp(v[0], k);
		input = input.replace(re, v[1]);
	});
	return input;
}


function adjustWindow() {
	var h = $(window).height();
	var hHeader = $("#nav_toolbar").height();
	var hFooter = $("#footer").height();
	$('html').css('height', h - hHeader - hFooter - 5); //可変部分の高さを適用
}

var editorVm, toolbarVm, footerVm, leftVm;

$(function () {
	$('div.split-pane').splitPane();
	$(window).on('resize', function () {
		setTimeout(function () { adjustWindow() }, 50);
	});
	editorVm = new Vue({
		el: '#editor',
		data: {
			input: ""
		}
		// ,filters: {
		// 	marked: function(input) {
		// 		var result = md.render(input);
		// 		result = result.replace(/(:[0-9a-zA-Z_\+\-]+?:)/g, " $1 ");
		// 		console.log(input);
		// 		return emojify.replace(result);
		// 	return input.replace(/\n/,"<br>");
		// 	}
		// }
	});

	elLeftVm.on(
		'click',
		function () {
			// console.log("click!");
			elLeftVmForcus();
		}
	);

	mdEditor.on(
		'change',
		function () {
			mdEditor.save();

			// Materialize.toast('aa.', 1000);
			// Materialize.toast('bb.', 1000);
			// Materialize.toast('cc.', 1000);
			// console.log(remote.getGlobal('sharedObj').prop1);

			var filepath = remote.getGlobal('sharedObj').prop1;
			// editorVm.input = $('#editor_textarea').val() + ":test";
			editorVm.input = regExpfilter($('#editor_textarea').val(), filepath);




		}
	);

	toolbarVm = new Vue({
		el: '#nav_toolbar',
		data: {},
		methods: {
			load: function (e) {
				loadFile();
			},
			save: function (e) {
				saveFile();
			}
		}
	});
	footerVm = new Vue({
		el: '#footer',
		data: {
			currentPath: remote.getGlobal('sharedObj').prop1
		}
	});
});