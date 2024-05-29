import { lazyReportCache } from '../report';

const originalPrototype = XMLHttpRequest.prototype;
const originalOpen = originalPrototype.open;
const originalSend = originalPrototype.send;

function overWriteOpenAndSend() { 
  originalPrototype.open = function newOpen(...args) { 
    this.url = args[1];
    this.method = args[0];
    originalOpen.apply(this, args);
  }
  originalPrototype.send = function newSend(...args) { 
    this.startTime = Date.now();

    const onLoadEnd = () => { 
      this.endTime = Date.now();
      this.duration = this.endTime - this.startTime;

      const { status, duration, startTime, endTime, url, method } = this;
      
      const reportData = {
        status,
        duration,
        startTime,
        endTime,
        url,
        method: method || 'GET',
        success: status >= 200 && status < 300,
        subType: 'xhr',
      }

      lazyReportCache('api', reportData);

      this.removeEventListener('loadend', onLoadEnd, true);
    }

    //当请求结束时触发，无论请求成功 (load) 还是失败 (abort 或 error)
    this.addEventListener('loadend', onLoadEnd, true);
    originalSend.apply(this, args);
  }


}

export default function xhr() { 
  overWriteOpenAndSend();
}