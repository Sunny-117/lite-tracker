import { lazyReportCache } from "../report";

/**
 * 监控 LCP (Largest Contentful Paint)
 * LCP 是衡量页面主要内容加载速度的重要指标
 */
export default function observerLCP() {
  if (!PerformanceObserver) return;

  try {
    let lcpValue = 0;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      // LCP 可能会更新多次，记录最新的值
      lcpValue = lastEntry.startTime;

      const data = {
        subType: 'largest-contentful-paint',
        startTime: lastEntry.startTime,
        duration: lastEntry.duration,
        size: lastEntry.size,
        elementType: lastEntry.element?.tagName || 'unknown',
      };

      lazyReportCache('performance', data);
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });

    // 页面隐藏或卸载时停止观察
    const stopObserving = () => {
      if (observer) {
        observer.disconnect();
      }
    };

    ['visibilitychange', 'pagehide'].forEach((type) => {
      window.addEventListener(type, stopObserving, { once: true });
    });
  } catch (e) {
    console.warn('LCP monitoring not supported:', e);
  }
}
