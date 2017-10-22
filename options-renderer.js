const {ipcRenderer, webFrame} = require('electron')

// prevent zoom, pinch or otherwise
webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)

const overlayToggleButton = document.getElementById('overlay-toggle-button')
const changeOverlayOpacityInput = document.getElementById('overlay-opacity')
const opacityValueElement = document.getElementById('opacity-value-indicator')
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

const triggerToggleButtonRender = () => {
  ipcRenderer.send('main-action', { action: 'overlay-status-check' })
}

const renderOverlayToggleButton = () => {
  const imageUrl = window.localStorage.getItem('imageUrl')
  const imageOpacity = window.localStorage.getItem('imageOpacity')
  if (imageUrl) {
    const overlayIsOpen = window.localStorage.getItem('isOpen')
    if (overlayIsOpen) {
      overlayToggleButton.innerHTML = 'Close Overlay'
      overlayToggleButton.onclick = closeOverlay
      overlayToggleButton.disabled = false
      overlayToggleButton.classList.add('button-close')
      overlayToggleButton.classList.remove('button-open')
    } else {
      overlayToggleButton.innerHTML = 'Open Overlay'
      overlayToggleButton.onclick = openOverlay
      overlayToggleButton.disabled = false
      overlayToggleButton.classList.add('button-open')
      overlayToggleButton.classList.remove('button-close')
    }
  } else {
    overlayToggleButton.innerHTML = 'Open Overlay'
    overlayToggleButton.onclick = () => {}
    overlayToggleButton.disabled = true
    overlayToggleButton.classList.add('button-open')
    overlayToggleButton.classList.remove('button-close')
  }
}

const openOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'open-overlay'
  })
  // setOverlayStatus(true)
}

const persistOverlayImageSource = url => {
  window.localStorage.setItem('imageUrl', url)
  renderPreview()
  triggerToggleButtonRender()
}

const persistOverlayImageOpacity = value => {
  window.localStorage.setItem('imageOpacity', value)
  renderPreview()
  triggerToggleButtonRender()
}

const setOverlayStatus = status => {
  if (status) {
    window.localStorage.setItem('isOpen', status)
  } else {
    window.localStorage.removeItem('isOpen')
  }
  renderOverlayToggleButton()
}

const initialiseOpacitySlider = () => {
  const opacityValue = window.localStorage.getItem('imageOpacity')
  changeOverlayOpacityInput.value = opacityValue
  opacityValueElement.innerHTML = opacityValue
}

const closeOverlay = () => {
  ipcRenderer.send('overlay-action', {
    action: 'close-overlay'
  })
  setOverlayStatus(false)
}

const changeOverlayOpacity = () => {
  const opacityValue = changeOverlayOpacityInput.value
  opacityValueElement.innerHTML = opacityValue
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
ipcRenderer.on('overlay-status', (event, status) => {
  setOverlayStatus(status)
})

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}
document.ondrop = (ev) => {
  ev.preventDefault()
  const imageUrl = ev.dataTransfer.files[0].path
  changeOverlayImageUrl(imageUrl)
}

initialiseOpacitySlider()
triggerToggleButtonRender()
renderPreview()

// TODO: some spicy ondragdrop hover styles
// document.addEventListener('dragenter', applyHoverStyle, false);
// document.addEventListener('dragleave', removeHoverStyle, false);
