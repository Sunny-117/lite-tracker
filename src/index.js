import { setConfig } from "./config";
import performance from "./performance";
import error from "./error";
import { tracker, autoTracker } from "./action";
import { pv, pageStayTime, pageChange, onVueRouter } from "./behavior";
import api from "./api";
import blankScreen from "./blankScreen";

const monitor = {
  init(options = {}) {
    console.log("==== init SDK ====");
    setConfig(options); //配置全局参数
    error(); //错误监听处理
    performance(); //性能监听处理
    autoTracker(); //自动埋点
    pv(); //page view
    api(); //api远程请求数据采集
    
    // 白屏检测（可选，通过配置控制）
    if (options.enableBlankScreen !== false) {
      blankScreen();
    }
  },
  tracker,
  pageStayTime,
  pageChange,
  onVueRouter,
};

export default monitor;
