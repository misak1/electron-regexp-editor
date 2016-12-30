// var remote = require('remote');
var remote = require('electron').remote;
var fs = require('fs');
var open = require('open');
var dialog = require('electron');
var browserWindow = require('electron');



function loadRexExp(filenames) {
    fs.readFile(filenames, function (error, text) {
        if (error != null) {
            alert('error : ' + error);
            return;
        }
        // mdEditor.setValue(text.toString());
        Materialize.toast('Load complete.', 1000);
    });
    footerVm.currentPath = filenames;

    // show initial value from main process (in dev console)
    console.log(remote.getGlobal('sharedObj').prop1);

    // change value of global prop1
    remote.getGlobal('sharedObj').prop1 = filenames;

    // show changed value in main process (in stdout, as a proof it was changed)
    var ipcRenderer = require('electron').ipcRenderer;
    ipcRenderer.send('show-prop1');

    // show changed value in renderer process (in dev console)
    console.log(remote.getGlobal('sharedObj').prop1);

    trigger_regExpfilter();
}
/**
 * ファイルを開く
 */
function loadFile() {
    var win = browserWindow.getFocusedWindow();
    dialog.showOpenDialog(
        win,
        {
            properties: ['openFile'],
            filters: [
                {
                    name: 'Markdown',
                    // extensions: ['md', 'txt']
                    // name: 'javascript',
                    extensions: ['json']
                }
            ]
        },
        function (filenames) {
            if (filenames) {
                var filename = filenames[0];
                loadRexExp(filename);
            }
        });
}

/**
 * ファイルを保存する
 */
function openFile() {
    var prop1 = remote.getGlobal('sharedObj').prop1;

    if (prop1 == null) {
        Materialize.toast('jsonファイル読込み後に実行して下さい。', 1000);
        return;
    } else {
        open(prop1);
    }
}


/**
 * ファイルを保存する
 */
function saveFile() {
    if (footerVm.currentPath == "") {
        saveNewFile();
        return;
    }
    var win = browserWindow.getFocusedWindow();
    dialog.showMessageBox(win,
        {
            title: 'ファイルの上書き保存を行います。',
            type: 'info',
            buttons: ['OK', 'Cancel'],
            detail: '本当に保存しますか？'
        },
        function (res) {
            if (res == 0) {
                var data = mdEditor.getValue();
                writeFile(footerVm.currentPath, data);
            }
        }
    );
}

/**
 * ファイルを新規に保存する
 */
function saveNewFile() {
    var win = browserWindow.getFocusedWindow();
    dialog.showSaveDialog(
        win,
        {
            properties: ['openFile'],
            filters: [
                {
                    name: 'Documents',
                    extensions: ['md', 'txt']
                }
            ]
        },
        function (fileName) {
            if (fileName) {
                var data = mdEditor.getValue();
                footerVm.currentPath = fileName;
                writeFile(fileName, data);
            }
        }
    );
}

/**
 * ファイルを書き込む
 */
function writeFile(path, data) {
    fs.writeFile(path, data, function (error) {
        if (error != null) {
            alert('error : ' + error);
        }
        Materialize.toast('Save complete.', 1000);
    });
}