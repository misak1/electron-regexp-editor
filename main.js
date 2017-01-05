const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// const remote = electron;
const {Menu, MenuItem} = electron

const menu = new Menu()
menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked'); } }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))

var force_quit = false;
let package_info = require('./package.json')

// Quit when all windows are closed.
// 全てのウィンドウが閉じたら終了
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        //force_quit=true; 
        app.quit()
    }
})
// This is another place to handle events after all windows are closed
app.on('will-quit', function () {
    // This is a good place to add tests insuring the app is still
    // responsive and all windows are closed.
    console.log("will-quit");
    mainWindow = null;
})


let fs = require('fs')

// メインウィンドウはGCされないようにグローバル宣言
//let browserWindow;
let browserWindow = null;

// let electron = require('electron');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function () {
    // Create the browser window.
    browserWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        // title: package_info.config.appname
    })
    // and load the index.html of the app.
    // browserWindow.loadURL('file://' + __dirname + '/contents.html') // webviewデバッグ
    browserWindow.loadURL('file://' + __dirname + '/index.html')

    let application_menu = [{
        label: "Edit",
        submenu: [{
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            selector: "cut:"
        }, {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            selector: "copy:"
        }, {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            selector: "paste:"
        }, {
            label: "Select All",
            accelerator: "CmdOrCtrl+A",
            selector: "selectAll:"
        }, {
            label: 'Search in File',
            accelerator: 'CmdOrCtrl+F',
            click() {
                browserWindow.webContents.send('toggleSearch')
            }
        }, {
            label: 'Debug',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: (function () {
                        if (process.platform == 'darwin')
                            return 'Alt+Command+I';
                        else
                            return 'Ctrl+Shift+I';
                    })(),
                    click(item, focusedWindow) {
                        if (focusedWindow)
                            focusedWindow.webContents.toggleDevTools();
                    }
                }
            ]
        }]
    }]
    if (process.platform == 'darwin') {
        let app_name = package_info.config.appname
        application_menu.unshift({
            label: app_name,
            submenu: [{
                label: 'About ' + app_name,
                role: 'about'
            }, {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: function () {
                    app.quit();
                }
            },]
        })
    }
    let menu = Menu.buildFromTemplate(application_menu)
    Menu.setApplicationMenu(menu)

    // Emitted when the window is closed.
    browserWindow.on('closed', function (e) {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        // console.log("close");
        // if (!force_quit) {
        //     e.preventDefault();
        //     browserWindow.hide();
        // }
        app.quit();
    })
    // You can use 'before-quit' instead of (or with) the close event
    app.on('before-quit', function (e) {
        // Handle menu-item or keyboard shortcut quit here
        // console.log("before-quit");
        // force_quit = true;
    });

    app.on('activate', function () {
        // console.log("reactive");
        browserWindow.show();
    });

    //browserWindow.toggleDevTools()
    // Open the DevTools.
    // browserWindow.webContents.openDevTools()
})

// sharedObj
global.sharedObj = { prop1: null };
global.sharedObj = { userData: app.getPath('userData') };

