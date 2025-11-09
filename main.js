const { app, BrowserWindow, ipcMain } = require('electron')
const url = require('url')
const path = require('path')
require('./src/grpc_client/')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1680,
    height: 945,
    webPreferences: {
      preload: path.join(__dirname, './src/grpc_client/preload.js'),
    },
    
  })

  mainWindow.loadFile('./build/index.html')
  // mainWindow.loadURL('http://localhost:3009/');

  if (require('electron-squirrel-startup')) return app.quit();
}



app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
