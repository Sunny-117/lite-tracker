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
    router:null
  },
  ua:navigator.userAgent,
};


export default config;

export function setConfig(options) { 
  for (const key in config) { 
    if (options[key]) { 
      config[key] = options[key];
    }
  }
}