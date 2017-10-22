const {ipcRenderer} = require('electron')

const defaultOverlaySettings = {
  imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII=',
  imageOpacity: 0
}

const overlayImgElement = document.getElementById('overlay-img')

const changeOverlayOpacity = opacityValue => {
  overlayImgElement.style.opacity = Math.max(0, Math.min(100, opacityValue)) / 100
}

const changeOverlayImage = url => {
  overlayImgElement.src = url
}

ipcRenderer.on('change-overlay-opacity', (event, opacityValue) => {
  changeOverlayOpacity(opacityValue)
})

ipcRenderer.on('change-overlay-image', (event, url) => {
  changeOverlayImage(url)
})

// load overlay settings from localStorage or use transparent defaults
changeOverlayImage(window.localStorage.getItem('imageUrl') || defaultOverlaySettings.imageUrl)
changeOverlayOpacity(window.localStorage.getItem('imageOpacity') || defaultOverlaySettings.imageOpacity)
