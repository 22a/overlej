// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

const openOverlayButton = document.getElementById('open-overlay-button')
const closeOverlayButton = document.getElementById('close-overlay-button')
const changeOverlayOpacityInput = document.getElementById('overlay-opacity')

const openOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'open-overlay'
  })
}

const closeOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'close-overlay'
  })
}

const changeOverlayOpacity = () => {
  ipcRenderer.send('overlay-action', {
    action: 'change-overlay-opacity',
    value: changeOverlayOpacityInput.value
  })
}

openOverlayButton.onclick = openOverlay
closeOverlayButton.onclick = closeOverlay
changeOverlayOpacityInput.onchange = changeOverlayOpacity
