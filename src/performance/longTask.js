import { lazyReportCache } from "../report";
import formatTime from "../util/formatTime";
import lastCaptureEvent from "../util/captureEvent";
import getSelector from "../util/getSelector";
import { getPaths } from "../util/paths";

/**
 * 长任务监控
 * 监控执行时间超过50ms的任务
 */
export default function longTask() {
  if (!PerformanceObserver) return;

  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        // 长任务阈值：50ms
        if (entry.duration > 50) {
          const lastEvent = lastCaptureEvent();
          const paths = lastEvent ? getPaths(lastEvent) : [];

          if (window.requestIdleCallback) {
            window.requestIdleCallback(() => {
              const data = {
                subType: 'longTask',
                eventType: lastEvent?.type || 'unknown',
                startTime: entry.startTime,
                duration: entry.duration,
                selector: lastEvent ? getSelector(lastEvent.path?.[0] || lastEvent.target) : '',
                paths,
              };
              lazyReportCache('performance', data);
            });
          } else {
            setTimeout(() => {
              const data = {
                subType: 'longTask',
                eventType: lastEvent?.type || 'unknown',
                startTime: entry.startTime,
                duration: entry.duration,
                selector: lastEvent ? getSelector(lastEvent.path?.[0] || lastEvent.target) : '',
                paths,
              };
              lazyReportCache('performance', data);
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ["longtask"] });
  } catch (e) {
    console.warn('Long task monitoring not supported:', e);
  }
}
