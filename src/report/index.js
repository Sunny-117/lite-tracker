import config from '../config'
import getUniqueID from "../util/getUniqueID";
import { getCache,addCache,clearCache } from '../util/cache';

const uniqueID = getUniqueID();
/**
 * 由于我们有很多内容需要上报，
 * 所以我这里为了简单区分和上报
 * 用type来区分上报的内容是什么
 * @param {string} type 上报类型 “error” | "action" | "behavior" | "api" | "performance"
 * @param {Object} data 上报信息
 * @param {boolean} isImmediate 是否立即上报，默认为false
 */
export function report(type, data, isImmediate = false) { 
  if (config.reportUrl === null) { 
    console.error("请先配置上报地址");
    return;
  }

  const reportData = JSON.stringify({
    id:uniqueID,
    appId: config.appId, //应用id
    userId: config.userId, //用户id
    currentTime: Date.now(), //当前事件
    type, //上报类型
    data, //上报信息
    currentPage: window.location.href, //当前页面
    ua: config.ua, //用户浏览器和系统
  })

  // fetch直接上报
  /*
  fetch(config.reportUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: reportData,
  })
    .then(res => res.text())
    .then(res => console.log(res))
    .catch(err => console.log(err))
  */
  
  //立即上传
  if (isImmediate) { 
    sendBeacon(config.reportUrl, reportData);
    return;
  }
  
  // 浏览器空闲时间进行上报
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      sendBeacon(config.reportUrl, reportData);
    }, { timeout: 3000 });
  }
  else { 
    setTimeout(() => { 
      sendBeacon(config.reportUrl, reportData);
    })
  }
  
}

let timer = null;
//延迟上传,一定时间之后再进行上传
export function lazyReportCache(type, data, timeout = 3000) { 
  //把数据加入到map缓存中
  addCache(type, data);
  
  clearTimeout(timer);
  timer = setTimeout(() => { 
    //获取缓存中的数据
    const dataMap = getCache();

    if (dataMap.size) { 
      for (const [type, data] of dataMap) { 
        console.log(type, data); //error [xxx,xx,xx], api [xx,xx,xxx]
        report(type, data);
      }

      clearCache();
    }

  },timeout)
}


//Navigator.sendBeacon()方式上报
function sendBeacon(reportUrl, reportData) {
  if (navigator.sendBeacon) {
    navigator.sendBeacon(reportUrl, reportData);
  }
  else { 
    reportWithXHR(reportUrl, reportData);
  }
  
} 

// XMLHttpRequest方式上报
function reportWithXHR(reportUrl, reportData) { 
  const xhr = new XMLHttpRequest();
  xhr.open('POST', reportUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(reportData);
}