import { lazyReportCache } from '../report'
import { getPaths } from '../util/paths'
import config from "../config"

export const tracker = (event) => { 
  //如果是全自动上报，则不需要手动上报
  if (config.trackerAll) return;

  const target = event.target;

  const data = {
    eventType: event.type,
    tagName: target.tagName,
    x: event.x,
    y: event.y,
    paths: getPaths(event),
    value: target.value || target.innerText,
  }

  lazyReportCache('action',data);
}

export const autoTracker = () => { 
  ['click', 'keydown', 'blur', 'focus', 'touchstart', 'touchend'].forEach(eventType => { 
    let timer = null;
    document.addEventListener(eventType, event => { 
      clearTimeout(timer);
      //防抖
      timer = setTimeout(() => { 
        const target = event.target;
        const dataTracker = target.getAttribute('data-tracker');

        //如果配置项中config.trackerAll为true，则所有元素都需要上报
        //如果元素上有data-tracker属性，则上报
        if (config.trackerAll || dataTracker) { 
          const data = {
            eventType: event.type,
            tagName: target.tagName || 'window',
            x: event.x,
            y: event.y,
            paths: getPaths(event),
            value: target.value || target.innerText || '',
          }
          lazyReportCache('action', data);
        }
      }, 500)
    }, false)
  })
}