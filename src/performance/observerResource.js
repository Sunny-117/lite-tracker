import { lazyReportCache } from "../report";

/**
 * 监控资源加载性能
 * 包括 JS、CSS、图片、字体等资源的加载时间和大小
 */
export default function observerResource() {
  if (!PerformanceObserver) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry) => {
        // 只上报加载时间较长的资源（超过100ms）
        if (entry.duration > 100) {
          const data = {
            subType: 'resource',
            name: entry.name,
            initiatorType: entry.initiatorType, // 资源类型：script, css, img, etc.
            duration: entry.duration,
            size: entry.transferSize || 0,
            protocol: entry.nextHopProtocol || '',
            // 详细时间分解
            dns: entry.domainLookupEnd - entry.domainLookupStart,
            tcp: entry.connectEnd - entry.connectStart,
            request: entry.responseStart - entry.requestStart,
            response: entry.responseEnd - entry.responseStart,
            // 缓存命中
            cached: entry.transferSize === 0 && entry.decodedBodySize > 0,
          };

          lazyReportCache('performance', data);
        }
      });
    });

    observer.observe({ type: 'resource', buffered: true });
  } catch (e) {
    console.warn('Resource monitoring not supported:', e);
  }
}
