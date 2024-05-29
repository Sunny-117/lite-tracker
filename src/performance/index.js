import { onCLS, onFCP, onFID, onLCP, onTTFB } from "web-vitals";
import { lazyReportCache } from "../report";

export default function performance() {
  /*
  const {
    fetchStart,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    domLoading,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
    domainLookupStart,
    domainLookupEnd,
    navigationStart
  } = window.performance.timing;

  console.log(fetchStart,
    connectStart,
    connectEnd,
    requestStart,
    responseStart,
    responseEnd,
    domLoading,
    domInteractive,
    domContentLoadedEventStart,
    domContentLoadedEventEnd,
    loadEventStart,
    domainLookupStart,
    domainLookupEnd,
    navigationStart)
  
    const tcp = connectEnd - connectStart; // TCP连接耗时
    const dns = domainLookupEnd - domainLookupStart; // dns 解析时长
    const ttfbTime = responseStart - requestStart; // 首字节到达时间
    const responseTime = responseEnd - responseStart; // response响应耗时
    const parseDOMTime = loadEventStart - domLoading; // DOM解析渲染的时间
    const domContentLoadedTime = domContentLoadedEventEnd - domContentLoadedEventStart; // DOMContentLoaded事件回调耗时
    const timeToInteractive = domInteractive - fetchStart; // 首次可交互时间
    const loadTime = loadEventStart - fetchStart; // 完整的加载时间
    const whiteScreen = domLoading - navigationStart; // 白屏时间
    
  
    console.log(tcp,dns,ttfbTime,responseTime,parseDOMTime,domContentLoadedTime,timeToInteractive,loadTime,whiteScreen)
  */

  /*
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntriesByName("first-contentful-paint")) {
      console.log("FCP====", entry.startTime, entry);
    }
  }).observe({ type: "paint", buffered: true });

  //每一个资源的响应时间
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    for (const entry of entries) {
      if (entry.responseStart > 0) {
        console.log(
          `TTFB === ${entry.responseStart - entry.requestStart}`,
          entry.name
        );
      }
    }
  }).observe({ type: "resource", buffered: true });
  */

  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

function sendToAnalytics(metric) {
  console.log(metric);
  const data = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta
  }
  lazyReportCache('performance', data);
}
