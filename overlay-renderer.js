const {ipcRenderer} = require('electron')

const overlayImgElement = document.getElementById('overlay-img')

const changeOverlayOpacity = opacityValue => {
  overlayImgElement.style.opacity = Math.max(0, Math.min(100, opacityValue)) / 100
}

ipcRenderer.on('change-overlay-opacity', (event, opacityValue) => {
  changeOverlayOpacity(opacityValue)
})
