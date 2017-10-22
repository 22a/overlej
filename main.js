const electron = require('electron')
const {app, dialog, ipcMain, BrowserWindow} = electron
const path = require('path')
const url = require('url')

// Keep a global reference of the window objects, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let optionsWindow
let overlayWindow

const persistImageUrlToLocalStorage = url => {
  optionsWindow.webContents.send('persist-overlay-url', url)
}
const persistImageOpacityToLocalStorage = opacityValue => {
  optionsWindow.webContents.send('persist-overlay-opacity', opacityValue)
}
const persistOverlayStatusToLocalStorage = status => {
  optionsWindow.webContents.send('persist-overlay-status', status)
}

const setOverlayImage = ([filePath]) => {
  const imageUrl = url.format({
    pathname: filePath,
    protocol: 'file:',
    slashes: true
  })

  persistImageUrlToLocalStorage(imageUrl)

  if (overlayWindow) {
    overlayWindow.webContents.send('change-overlay-image', imageUrl)
  }
}

const setOverlayOpacity = opacityValue => {
  persistImageOpacityToLocalStorage(opacityValue)
  if (overlayWindow) {
    overlayWindow.webContents.send('change-overlay-opacity', opacityValue)
  }
}

const openImageSelectDialog = () => {
  dialog.showOpenDialog(optionsWindow, {
    title: 'fuggleWamp',
    filters: [
      { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
    ]
  }, setOverlayImage)
}

const renderOverlay = () => {
  // don't do anything if the overlay already exists
  if (overlayWindow) return

  overlayWindow = new BrowserWindow({
    // type: 'desktop',
    // focusable: false,
    // transparent: true,
    frame: false,
    webPreferences: {
      webSecurity: false
    }
  })

  // overlayWindow.setAlwaysOnTop(true, 'screen-saver')
  // overlayWindow.setFocusable(false)
  // overlayWindow.setIgnoreMouseEvents(true)
  // overlayWindow.maximize()

  overlayWindow.webContents.openDevTools()

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
    persistOverlayStatusToLocalStorage(false)
    overlayWindow = null
  })

  persistOverlayStatusToLocalStorage(true)
  // close the main window then the overlay opens
  optionsWindow.close()
}

const killOverlay = () => {
  if (overlayWindow) {
    overlayWindow.close()
    overlayWindow = null
  }
}

const createOptionsWindow = () => {
  // Create the browser window.
  optionsWindow = new BrowserWindow({
    width: 360,
    height: 600,
    titleBarStyle: 'hidden',
    frame: false
  })

  optionsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'options.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  optionsWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  optionsWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    optionsWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createOptionsWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // TODO: unswizzle this, perhaps
  app.quit()
  // if (process.platform !== 'darwin') {
  //   app.quit()
  // }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (optionsWindow === null) {
    createOptionsWindow()
  }
})

ipcMain.on('main-action', (event, {action, value}) => {
  switch (action) {
    case 'open-image-select-dialog':
      openImageSelectDialog()
      break
    default:
      console.log('I\'m not sure what you\'re trying to do here. action: ', action)
  }
})

ipcMain.on('overlay-action', (event, {action, value}) => {
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
    case 'change-overlay-image':
      setOverlayImage([value])
      break
    default:
      console.log('I\'m not sure what you\'re trying to do here. action: ', action)
  }
})
