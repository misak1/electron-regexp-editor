var $ = jQuery = require("./js/jquery-2.1.4.min.js");
var Hammer = require('./js/hammer.min.js');
var parseJson = require('./js/parse-json.js');
var storage = require('electron-json-storage');
hljs.initHighlightingOnLoad();


// // # electron-worker(server)
// var electronWorkers = require('electron-workers')({
// 	connectionMode: 'server',
// 	pathToScript: 'js/background-server.js',
// 	timeout: 5000,
// 	numberOfWorkers: 5
// });

// electronWorkers.start(function(startErr) {
// 	if (startErr) {
// 		return console.error(startErr);
// 	}

// 	// `electronWorkers` will send your data in a POST request to your electron script 
// 	electronWorkers.execute({ someData: 'someData' }, function(err, data) {
// 		if (err) {
// 			return console.error(err);
// 		}

// 		console.log(JSON.stringify(data)); // { someData: 'someData' } 
// 		electronWorkers.kill(); // kill all workers explicitly 
// 	});
// });


// var electronWorkers = require('electron-workers')({
//   connectionMode: 'ipc',
//   pathToScript: 'background-ipc.js',
//   timeout: 5000,
//   numberOfWorkers: 5
// });

// electronWorkers.start(function(startErr) {
//   if (startErr) {
//     return console.error(startErr);
//   }

//   // `electronWorkers` will send your data in a POST request to your electron script 
//   electronWorkers.execute({ someData: 'someData' }, function(err, data) {
//     if (err) {
//       return console.error(err);
//     }

//     console.log(JSON.stringify(data)); // { value: 'someData' } 
//     electronWorkers.kill(); // kill all workers explicitly 
//   });
// });



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
var elText = document.querySelector('.CodeMirror textarea'); // テキストエリアのelement取得

// left-pane focus.
function elLeftVmForcus() {
	elText.focus();
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


function trigger_regExpfilter() {
	var filepath = remote.getGlobal('sharedObj').prop1;
	editorVm.input = regExpfilter($('#editor_textarea').val(), filepath);
}


function adjustWindow() {
	var h = $(window).height();
	var hHeader = $("#nav_toolbar").height();
	var hFooter = $("#footer").height();
	$('html').css('height', h - hHeader - hFooter - 5); //可変部分の高さを適用
}

var editorVm, toolbarVm, footerVm, leftVm;
var suggestList = []; // サジェスト検索用
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

			trigger_regExpfilter();
		}
	);

	$('#input-regexp-search').on(
		'keyup blur',
		function () {
			var searchText = $(this).val();
			storage.get('config', function (error, data) {
				if (searchText in data) {
					loadRexExp(data[searchText]);
				}
			});
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
			},
			open: function (e) {
				openFile();
			}
		}
	});

	// new Vue({
	// 	el: '#input-regexp-search-wrap',
	// 	data: {},
	//   methods:{
	//     change:function(e){
	//       console.log(e);
	//     }
	//   }
	// });


	// // webworker
	// var worker = new Worker("js/background.js");
	// var AA = { n: 1, l: 2, m: 3 }; //Worker に渡すオブジェクトを宣言
	// worker.postMessage(AA);   //Worker に オブジェクトを渡す
	// worker.onmessage = function (event) {
	// console.log("worker onmessage");
	// console.log( event.data);
	// }
	var gitFiles = {};
	storage.get('config', function (error, data) {
		if (error) throw error;
		if (Object.keys(data).length === 0) {
			// データがないときの処理
			console.log("can't not found config.json.");
		} else {
			gitFiles = data;
			suggestList = Object.keys(gitFiles);
			console.log(suggestList);
			startSuggest();
		}
	});

	function logArrayElements(element, index, array) {
		// console.log(element.path + ":" + element.git_url);
		if (element.path in gitFiles) {
			// key がある場合
		} else {
			// key がない場合
			gitFiles[element.path] = element.git_url;
		}
	}

	// アプリケーションディレクトリ
	var path = require('path');
	var mkdirp = require("mkdirp")
	var fs = require("fs")
	var getDirName = require("path").dirname
	// ディレクトリを作りつつ、fs.writeFileする
	function writeFile(path, contents, cb) {
		mkdirp(getDirName(path), function (err) {
			if (err) return cb(err)
			fs.writeFile(path, contents, cb)
		})
	}
	var userData = remote.getGlobal('sharedObj').userData;
	console.log('userData:', userData);
	var request = require('superagent');
	request
		// GitHub WEB API
		.get('https://api.github.com/search/code?q=regexp+in:path+language:json+repo:misak1/regexp-json')
		.end(function (err, res) {
			// console.log(res.text);//レスポンス
			//レスポンスがJSONの場合 
			// console.log(res.body.items);//ここにparse済みのオブジェクトが入る

			res.body.items.forEach(logArrayElements);
			console.log(gitFiles);
			storage.set('config', gitFiles, function (error) {
				if (error) throw error;
			});

			suggestList = Object.keys(gitFiles);
			startSuggest();

			// GitHubからデータダウンロード
			storage.get('config', function (error, data) {
				if (error) throw error;
				if (Object.keys(data).length === 0) {
					// データがないときの処理
					console.log("can't not found config.json.");
				} else {
					// 設定をダウンロード
					Object.keys(data).forEach(function (key) {
						console.log(key + ":" + data[key]);
						var data_url = data[key];
						if (/^https?:\/\//.test(data_url)) {
							console.log('httpダウンロード');
							request
								// GitHub WEB API
								.get(data_url)
								.end(function (err, res) {
									try{
										var b = new Buffer(res.body.content, 'base64');
										var filepath = userData + path.sep + key;
										console.log('filepath', filepath);
										writeFile(filepath, b.toString(), function (err) {
											if (err == null) {
												data[key] = filepath;
											} else {
												console.log(err);
											}
										});
										console.log("------------------------");
										console.log(data);

										// 設定更新
										storage.set('config', data, function (error) {
											if (error) throw error;
										});
									}catch(e){
										Materialize.toast(JSON.stringify(res.body), 30000);
									}
								});


						} else {
							// 既存のregexp.jsonを使用する
						}
						// storage.set('config', data, function (error) {
						// 	if (error) throw error;
						// });
					});

				}
			});
		});

	var _currentPath = remote.getGlobal('sharedObj').prop1;
	if (_currentPath == null) {
		_currentPath = 'jsonファイルが読み込まれていません。';
	}

	footerVm = new Vue({
		el: '#footer',
		data: {
			currentPath: _currentPath
		}
	});
});