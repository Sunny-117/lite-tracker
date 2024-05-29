let lastCaptureEvent;
['click', 'mousedown', 'keyup', 'scroll', 'mouseover', 'mousewheel'].forEach(eventType => { 
    document.addEventListener(eventType, event => {
        lastCaptureEvent = event;
    }, {
        capture: true,
        passive: true
    })
})

export default () => { 
  return lastCaptureEvent;
}