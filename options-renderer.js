// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const {ipcRenderer} = require('electron')

const overlayToggleButton = document.getElementById('overlay-toggle-button')
const changeOverlayOpacityInput = document.getElementById('overlay-opacity')
const openImageSelectButton = document.getElementById('open-image-select-button')
const previewImage = document.getElementById('preview-img')

const renderPreview = () => {
  const imageUrl = window.localStorage.getItem('imageUrl')
  const imageOpacity = window.localStorage.getItem('imageOpacity')
  if (imageUrl) {
    previewImage.src = imageUrl
    previewImage.style.opacity = Math.max(0, Math.min(100, imageOpacity || 50)) / 100
    previewImage.classList.add('visible')
  } else {
    previewImage.classList.remove('visible')
  }
}

const renderOverlayToggleButton = () => {
  const imageUrl = window.localStorage.getItem('imageUrl')
  const imageOpacity = window.localStorage.getItem('imageOpacity')
  if (imageUrl) {
    const overlayIsOpen = window.localStorage.getItem('isOpen')
    const overlayWasOpenedThisSession = window.sessionStorage.getItem('opened')
    if (overlayIsOpen && overlayWasOpenedThisSession) {
      overlayToggleButton.innerHTML = 'Close Overlay'
      overlayToggleButton.onclick = closeOverlay
      overlayToggleButton.disabled = false
    } else {
      overlayToggleButton.innerHTML = 'Open Overlay'
      overlayToggleButton.onclick = openOverlay
      overlayToggleButton.disabled = false
    }
  } else {
    overlayToggleButton.innerHTML = 'Open Overlay'
    overlayToggleButton.onclick = () => {}
    overlayToggleButton.disabled = true
  }
}

const openOverlay = () => {
  window.sessionStorage.setItem('opened', true)
  ipcRenderer.send('overlay-action', {
    action: 'open-overlay'
  })
}

const persistOverlayImageSource = url => {
  window.localStorage.setItem('imageUrl', url)
  renderPreview()
  renderOverlayToggleButton()
}

const persistOverlayImageOpacity = value => {
  window.localStorage.setItem('imageOpacity', value)
  renderPreview()
  renderOverlayToggleButton()
}

const persistOverlayStatus = status => {
  console.log(status)
  if (status) {
    window.localStorage.setItem('isOpen', status)
  } else {
    window.localStorage.removeItem('isOpen')
  }
  renderOverlayToggleButton()
}

const closeOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'close-overlay'
  })
  persistOverlayStatus(false)
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
renderOverlayToggleButton()

// TODO: some spicy ondragdrop hover styles
// document.addEventListener('dragenter', applyHoverStyle, false);
// document.addEventListener('dragleave', removeHoverStyle, false);
