const config = {
  // 项目名称
  appId: 'monitor-sdk-demo',
  userId: 'ys',
  //上报地址
  reportUrl: 'http://localhost:3001/report/actions',
  //是否全埋点
  trackerAll: false,
  vue: {
    Vue: null,
    router: null
  },
  ua: navigator.userAgent,
  
  // 新增配置项
  isImageUpload: false, // 是否使用图片方式上报
  batchSize: 2, // 批量上报的数量阈值
  enableBlankScreen: true, // 是否启用白屏检测
  reportMethod: 'beacon', // 上报方式：'beacon' | 'xhr' | 'image'
  maxCacheSize: 10, // 最大缓存数量
};


export default config;

export function setConfig(options) { 
  for (const key in config) { 
    if (options[key] !== undefined) { 
      config[key] = options[key];
    }
  }
}