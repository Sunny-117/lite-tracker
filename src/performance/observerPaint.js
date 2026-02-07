import { lazyReportCache } from "../report";

/**
 * 监控 FCP (First Contentful Paint) 和 FP (First Paint)
 */
export default function observerPaint() {
  if (!PerformanceObserver) return;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const data = {
          subType: entry.name, // 'first-paint' 或 'first-contentful-paint'
          startTime: entry.startTime,
          duration: entry.duration,
        };

        lazyReportCache('performance', data);

        // FCP 只需要上报一次
        if (entry.name === 'first-contentful-paint') {
          observer.disconnect();
        }
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('Paint monitoring not supported:', e);
  }
}
