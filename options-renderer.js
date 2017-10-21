// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

const openOverlayButton = document.getElementById('open-overlay-button')
const closeOverlayButton = document.getElementById('close-overlay-button')
const changeOverlayOpacityInput = document.getElementById('overlay-opacity')
const openImageSelectButton = document.getElementById('open-image-select-button')

const openOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'open-overlay'
  })
}

const persistOverlayImageSource = url => {
  window.localStorage.setItem('imageUrl', url)
}

const persistOverlayImageOpacity = value => {
  window.localStorage.setItem('imageOpacity', value)
}

const closeOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'close-overlay'
  })
}

const changeOverlayOpacity = () => {
  const opacityValue = changeOverlayOpacityInput.value
  persistOverlayImageOpacity(opacityValue)
  ipcRenderer.send('overlay-action', {
    action: 'change-overlay-opacity',
    value: opacityValue
  })
}

const openImageSelect = () => {
  ipcRenderer.send('main-action', {
    action: 'open-image-select-dialog'
  })
}

openOverlayButton.onclick = openOverlay
closeOverlayButton.onclick = closeOverlay
changeOverlayOpacityInput.onchange = changeOverlayOpacity
openImageSelectButton.onclick = openImageSelect

ipcRenderer.on('persist-overlay-url', (event, imageUrl) => {
  persistOverlayImageSource(imageUrl)
})
ipcRenderer.on('persist-overlay-opacity', (event, opacityValue) => {
  persistOverlayImageOpacity(opacityValue)
})
