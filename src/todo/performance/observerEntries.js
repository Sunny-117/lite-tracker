/*
 * @file 统计所有资源
 * @author fuzhiqiang@baidu.com
 * @date 2025-02-26 09:51:04
 */

import { lazyReportBatch } from '../report';
export default function observerEntries() {
    if (document.readyState === 'complete') {
        observerEvent();
    } else {
        const onLoad = () => {
            observerEvent();
            window.removeEventListener('load', onLoad, true);
        };
        window.addEventListener('load', onLoad, true);
    }
}
export function observerEvent() {
    const entryHandler = (list) => {
        const data = list.getEntries();
        for (let entry of data) {
            if (observer) {
                // 存在 则暂停链接
                observer.disconnect();
            }
            const reportData = {
                name: entry.name, // 资源的名字
                type: 'performance', // 类型
                subType: entry.entryType, //类型
                sourceType: entry.initiatorType, // 资源类型
                duration: entry.duration, // 加载时间
                dns: entry.domainLookupEnd - entry.domainLookupStart, // dns解析时间
                tcp: entry.connectEnd - entry.connectStart, // tcp连接时间
                redirect: entry.redirectEnd - entry.redirectStart, // 重定向时间
                ttfb: entry.responseStart, // 首字节时间
                protocol: entry.nextHopProtocol, // 请求协议
                responseBodySize: entry.encodedBodySize, // 响应内容大小
                responseHeaderSize: entry.transferSize - entry.encodedBodySize, // 响应头部大小
                transferSize: entry.transferSize, // 请求内容大小
                resourceSize: entry.decodedBodySize, // 资源解压后的大小
                startTime: performance.now(),
            };
            lazyReportBatch(reportData);
            // console.log(entry);
        }
    };

    let observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: ['resource'], buffered: true });
}