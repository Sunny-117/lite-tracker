import tracker from "../utils/tracker"
import onload from "../utils/onload"
import getLastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector"
import getEventPath from "../utils/getEventPath"

export function timing() {
    let FMP, LCP
    // 性能条目的观察者
    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries()
        FMP = perfEntries[0]
        observer.disconnect()
    }).observe({ entryTypes: ['element'] }) // 观察页面中有意义的元素

    new PerformanceObserver((entryList, observer) => {
        let perfEntries = entryList.getEntries();
        LCP = perfEntries[0];
        observer.disconnect()
    }).observe({ entryTypes: ['largest-contentful-paint'] }); // 观察最大的元素

    new PerformanceObserver((entryList, observer) => {
        let lastEvent = getLastEvent()
        let firstInput = entryList.getEntries()[0]
        // console.log('FID firstInput', firstInput)
        // 点击页面会触发
        if (firstInput) {
            // processingStart开始处理时间，startTime开始点击的时间，差值就是处理延迟的时间
            let inputDelay = firstInput.processingStart - firstInput.startTime;
            let duration = firstInput.duration;

            if (inputDelay > 0 || duration > 0) {
                tracker.send({
                    kind: 'experience', // 用户体验指标
                    type: 'firstInputDelay', // 首次输入延迟
                    inputDelay,
                    duration,
                    startTime: firstInput.startTime,
                    selector: lastEvent ? getSelector(getEventPath(lastEvent)) : ''
                })
            }
        }
        observer.disconnect()
    }).observe({ type: "first-input", buffered: true }) // 观察页面第一次交互

    onload(function () {
        setTimeout(() => {
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
                loadEventStart
            } = performance.timing;

            // 发送一些加载时间
            tracker.send({
                kind: 'experience', // 用户体验指标
                type: 'timing', // 统计每个阶段的时间
                connectTime: connectEnd - connectStart, // 连接时间
                ttfbTime: responseStart - requestStart, // 首字节到达时间
                responseTime: responseEnd - responseStart, // 响应读取时间
                parseDOMTime: loadEventStart - domLoading, // DOM解析时间
                domContentLoadedTime: domContentLoadedEventEnd - domContentLoadedEventStart,
                timeToInteractive: domInteractive - fetchStart, // 首次可交互时间
                loadTime: loadEventStart - fetchStart, // 完整的加载时间
            })

            setTimeout(() => {
                // 发送性能指标
                const FP = performance.getEntriesByName('first-paint')[0]
                const FCP = performance.getEntriesByName('first-contentful-paint')[0]
                tracker.send({
                    kind: "experience", // 用户体验指标
                    type: 'paint', // 统计每个阶段的时间
                    firstPaint: FP.startTime,
                    firstContentfulPaint: FCP.startTime,
                    firstMeaningfulPaint: FMP.startTime,
                    largestContentfulPaint: LCP.startTime,
                })
            }, 1000) // 防止把上一个tracker.send请求取消了
        }, 3000) // 需要等到所有事件执行完毕之后才能计算
    })
}