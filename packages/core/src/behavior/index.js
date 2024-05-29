
import { lazyReportCache,report } from "../report";
import config from "../config";

const connection = navigator.connection;
export function pv() { 
  lazyReportCache('behavior', {
    subType: 'pv',
    referrer: document.referrer,
    effectiveType: connection ? connection.effectiveType : '', //网络环境
    rtt: connection ? connection.rtt : '', //往返时间
  })
}

//页面停留时间
export function pageStayTime() {
  const startTime = Date.now();
  //unload和beforeunload会在窗口卸载的时候触发
  //要注意窗口卸载的时候，如果你使用ajax提交会出现问题
  window.addEventListener('beforeunload', () => {
    const stayTime = Date.now() - startTime;

    report('behavior', [{
      subType: 'pageStayTime',
      effectiveType: connection ? connection.effectiveType : '', //网络环境
      stayTime
    }],true)
  },true);
}

//首先记录一开始的时间
window.pageViewStartTime = Date.now();
//通过vue的路由来记录页面切换
export function onVueRouter() { 
  if (!config.vue || !config.vue.router) return;

  config.vue.router.beforeEach((to, from, next) => { 
    //如果是首次加载页面不需要统计
    if (!from.name) return next();
    
    const stayTime = Date.now() - window.pageViewStartTime;
    console.log(`页面停留时间 ${from.name}: ${stayTime}ms`);
    console.log(to);
    console.log(from);

    window.pageViewStartTime = Date.now();

    lazyReportCache('behavior', {
      subType: 'vueRouterChange',
      params: to.params,
      query: to.query,
      name: to.name || to.path,
      from: from.fullPath,
      to: to.fullPath,
      stayTime
    })

    next();
  });
}

export function pageChange() { 
  let from = document.referrer;

  window.addEventListener('popstate', () => { 
    const to = window.location.href;
    console.log(to, from);
    lazyReportCache('behavior', {
      subType: 'pageChange',
      from,
      to
    });

    from = to;
  },true)

  let oldURL = document.referrer;
  window.addEventListener('hashchange', event => { 
    const newURL = event.newURL;

    lazyReportCache('behavior', {
      subType: 'pageChange',
      from: oldURL,
      to: newURL
    });

    oldURL = newURL;
  },true)

}