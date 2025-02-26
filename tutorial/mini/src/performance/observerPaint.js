import { lazyReportBatch } from '../report';
export default function observerPaint() {
    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
                observer.disconnect();
                const json = entry.toJSON();
                console.log(json);
                const reportData = {
                    ...json,
                    type: 'performance',
                    subType: entry.name,
                    pageUrl: window.location.href,
                }
                // 发送数据 todo;
                lazyReportBatch(reportData);
            }
        }
    
    }
    // 统计和计算fp的时间
    const observer = new PerformanceObserver(entryHandler);
    // buffered: true 确保观察到所有paint事件
    observer.observe({type: 'paint', buffered: true});
    
    
}
