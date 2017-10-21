const electron = require('electron')
const {app, ipcMain, BrowserWindow} = electron
const path = require('path')
const url = require('url')

// Keep a global reference of the window objects, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let overlayWindow

function killOverlay () {
  if (overlayWindow) {
    overlayWindow.close()
    overlayWindow = null
  }
}

function renderOverlay () {
  // don't do anything if the overlay already exists
  if (overlayWindow) return

  overlayWindow = new BrowserWindow({
    type: 'desktop',
    focusable: false,
    transparent: true,
    frame: false
  })

  overlayWindow.setAlwaysOnTop(true, 'screen-saver')
  overlayWindow.setFocusable(false)
  overlayWindow.setIgnoreMouseEvents(true)
  overlayWindow.maximize()

  overlayWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'overlay.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  overlayWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    overlayWindow = null
  })

  // close the main window then the overlay opens
  mainWindow.close()
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: 'hidden',
    frame: false
  })

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'options.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  app.quit()
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('overlay-action', (event, {action, value}) => {
  console.log(action)

  switch (action) {
    case 'open-overlay':
      renderOverlay()
      break
    case 'close-overlay':
      killOverlay()
      break
    case 'change-overlay-opacity':
      setOverlayOpacity(value)
      break
    default:
  }
})

const setOverlayOpacity = opacityValue => {
  overlayWindow.webContents.send('change-overlay-opacity', opacityValue)
}
