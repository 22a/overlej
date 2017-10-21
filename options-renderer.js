// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

const openOverlayButton = document.getElementById('open-overlay-button')
const closeOverlayButton = document.getElementById('close-overlay-button')
const changeOverlayOpacityInput = document.getElementById('overlay-opacity')
const openImageSelectButton = document.getElementById('open-image-select-button')
const previewImage = document.getElementById('preview-img')

const renderPreview = () => {
  const imageUrl = window.localStorage.getItem('imageUrl')
  const imageOpacity = window.localStorage.getItem('imageOpacity')
  if (imageUrl) {
    previewImage.src = imageUrl
    previewImage.style.opacity = Math.max(0, Math.min(100, imageOpacity)) / 100
    previewImage.classList.add('visible')
  } else {
    previewImage.classList.remove('visible')
  }
}

const openOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'open-overlay'
  })
}

const persistOverlayImageSource = url => {
  window.localStorage.setItem('imageUrl', url)
  renderPreview()
}

const persistOverlayImageOpacity = value => {
  window.localStorage.setItem('imageOpacity', value)
  renderPreview()
}

const persistOverlayStatus = status => {
  window.localStorage.setItem('isOpen', status)
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

const changeOverlayImageUrl = (url) => {
  persistOverlayImageSource(url)
  ipcRenderer.send('overlay-action', {
    action: 'change-overlay-image',
    value: url
  })
}

const openImageSelect = () => {
  ipcRenderer.send('main-action', {
    action: 'open-image-select-dialog'
  })
}

openOverlayButton.onclick = openOverlay
closeOverlayButton.onclick = closeOverlay
changeOverlayOpacityInput.oninput = changeOverlayOpacity
openImageSelectButton.onclick = openImageSelect

ipcRenderer.on('persist-overlay-url', (event, imageUrl) => {
  persistOverlayImageSource(imageUrl)
})
ipcRenderer.on('persist-overlay-opacity', (event, opacityValue) => {
  persistOverlayImageOpacity(opacityValue)
})
ipcRenderer.on('persist-overlay-status', (event, status) => {
  persistOverlayStatus(status)
})

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}
document.body.ondrop = (ev) => {
  ev.preventDefault()
  const imageUrl = ev.dataTransfer.files[0].path
  changeOverlayImageUrl(imageUrl)
}

renderPreview()

// TODO: some spicy ondragdrop hover styles
// document.addEventListener('dragenter', applyHoverStyle, false);
// document.addEventListener('dragleave', removeHoverStyle, false);
