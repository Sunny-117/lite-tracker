var monitor = (function (exports) {
    'use strict';

    var config = {
      url: '',
      projectName: 'eyesdk',
      appId: '123456',
      userId: '123456',
      isImageUpload: false,
      batchSize: 5
    };
    function setConfig(options) {
      for (var key in config) {
        if (options[key]) {
          config[key] = options[key];
        }
      }
    }

    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
      }
      return e;
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
    }
    function _defineProperty(obj, key, value) {
      key = _toPropertyKey(key);
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }
      return obj;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
      return arr2;
    }
    function _createForOfIteratorHelper(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (!it) {
        if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
          if (it) o = it;
          var i = 0;
          var F = function () {};
          return {
            s: F,
            n: function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            },
            e: function (e) {
              throw e;
            },
            f: F
          };
        }
        throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
      }
      var normalCompletion = true,
        didErr = false,
        err;
      return {
        s: function () {
          it = it.call(o);
        },
        n: function () {
          var step = it.next();
          normalCompletion = step.done;
          return step;
        },
        e: function (e) {
          didErr = true;
          err = e;
        },
        f: function () {
          try {
            if (!normalCompletion && it.return != null) it.return();
          } finally {
            if (didErr) throw err;
          }
        }
      };
    }

    function deepCopy(target) {
      if (_typeof(target) === 'object') {
        var result = Array.isArray(target) ? [] : {};
        for (var key in target) {
          if (_typeof(target[key]) == 'object') {
            result[key] = deepCopy(target[key]);
          } else {
            result[key] = target[key];
          }
        }
        return result;
      }
      return target;
    }
    function generateUniqueId() {
      return 'id-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    }

    var cache = [];
    function getCache() {
      return deepCopy(cache);
    }
    function addCache(data) {
      cache.push(data);
    }
    function clearCache() {
      cache.length = 0;
    }

    var originalOpen$1 = XMLHttpRequest.prototype.open;
    var originalSend$1 = XMLHttpRequest.prototype.send;
    function report(data) {
      if (!config.url) {
        console.error('请设置上传 url 地址');
      }
      var reportData = JSON.stringify({
        id: generateUniqueId(),
        data: data
      });
      // 上报数据，使用图片的方式
      if (config.isImageUpload) {
        imgRequest(reportData);
      } else {
        // 优先使用 sendBeacon
        if (window.navigator.sendBeacon) {
          return beaconRequest(reportData);
        } else {
          xhrRequest(reportData);
        }
      }
    }
    // 批量上报数据
    function lazyReportBatch(data) {
      addCache(data);
      var dataCache = getCache();
      console.error('dataCache', dataCache);
      if (dataCache.length && dataCache.length > config.batchSize) {
        report(dataCache);
        clearCache();
      }
      //
    }
    // 图片发送数据
    function imgRequest(data) {
      var img = new Image();
      // http://127.0.0.1:8080/api?data=encodeURIComponent(data)
      img.src = "".concat(config.url, "?data=").concat(encodeURIComponent(JSON.stringify(data)));
    }
    // 普通ajax发送请求数据
    function xhrRequest(data) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(function () {
          var xhr = new XMLHttpRequest();
          originalOpen$1.call(xhr, 'post', config.url);
          originalSend$1.call(xhr, JSON.stringify(data));
        }, {
          timeout: 3000
        });
      } else {
        setTimeout(function () {
          var xhr = new XMLHttpRequest();
          originalOpen$1.call(xhr, 'post', url);
          originalSend$1.call(xhr, JSON.stringify(data));
        });
      }
    }

    // const sendBeacon = isSupportSendBeacon() ? navigator.sendBeacon : xhrRequest
    function beaconRequest(data) {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(function () {
          window.navigator.sendBeacon(config.url, data);
        }, {
          timeout: 3000
        });
      } else {
        setTimeout(function () {
          window.navigator.sendBeacon(config.url, data);
        });
      }
    }

    var originalFetch = window.fetch;
    function overwriteFetch() {
      window.fetch = function newFetch(url, config) {
        var startTime = Date.now();
        var reportData = {
          type: 'performance',
          subType: 'fetch',
          url: url,
          startTime: startTime,
          method: config.method
        };
        return originalFetch(url, config).then(function (res) {
          var endTime = Date.now();
          reportData.endTime = endTime;
          reportData.duration = endTime - startTime;
          var data = res.clone();
          reportData.status = data.status;
          reportData.success = data.ok;
          // todo 上报数据
          lazyReportBatch(reportData);
          return res;
        }).catch(function (err) {
          var endTime = Date.now();
          reportData.endTime = endTime;
          reportData.duration = endTime - startTime;
          reportData.status = 0;
          reportData.success = false;
          // todo 上报数据
          lazyReportBatch(reportData);
        });
      };
    }
    function fetch() {
      overwriteFetch();
    }

    function observerEntries() {
      if (document.readyState === 'complete') {
        observerEvent();
      } else {
        var onLoad = function onLoad() {
          observerEvent();
          window.removeEventListener('load', onLoad, true);
        };
        window.addEventListener('load', onLoad, true);
      }
    }
    function observerEvent() {
      var entryHandler = function entryHandler(list) {
        var data = list.getEntries();
        var _iterator = _createForOfIteratorHelper(data),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            if (observer) {
              observer.disconnect();
            }
            var reportData = {
              name: entry.name,
              // 资源的名字
              type: 'performance',
              // 类型
              subType: entry.entryType,
              //类型
              sourceType: entry.initiatorType,
              // 资源类型
              duration: entry.duration,
              // 加载时间
              dns: entry.domainLookupEnd - entry.domainLookupStart,
              // dns解析时间
              tcp: entry.connectEnd - entry.connectStart,
              // tcp连接时间
              redirect: entry.redirectEnd - entry.redirectStart,
              // 重定向时间
              ttfb: entry.responseStart,
              // 首字节时间
              protocol: entry.nextHopProtocol,
              // 请求协议
              responseBodySize: entry.encodedBodySize,
              // 响应内容大小
              responseHeaderSize: entry.transferSize - entry.encodedBodySize,
              // 响应头部大小
              transferSize: entry.transferSize,
              // 请求内容大小
              resourceSize: entry.decodedBodySize,
              // 资源解压后的大小
              startTime: performance.now()
            };
            lazyReportBatch(reportData);
            // console.log(entry);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      var observer = new PerformanceObserver(entryHandler);
      observer.observe({
        type: ['resource'],
        buffered: true
      });
    }

    function observerLCP() {
      var entryHandler = function entryHandler(list) {
        if (observer) {
          observer.disconnect();
        }
        var _iterator = _createForOfIteratorHelper(list.getEntries()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            var json = entry.toJSON();
            console.log(json);
            var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
              type: 'performance',
              subType: entry.name,
              pageUrl: window.location.href
            });
            // 发送数据 todo;
            lazyReportBatch(reportData);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      // 统计和计算lcp的时间
      var observer = new PerformanceObserver(entryHandler);
      // buffered: true 确保观察到所有paint事件
      observer.observe({
        type: 'largest-contentful-paint',
        buffered: true
      });
    }

    function observerFCP() {
      var entryHandler = function entryHandler(list) {
        var _iterator = _createForOfIteratorHelper(list.getEntries()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            if (entry.name === 'first-contentful-paint') {
              observer.disconnect();
              var json = entry.toJSON();
              console.log(json);
              var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
                type: 'performance',
                subType: entry.name,
                pageUrl: window.location.href
              });
              // 发送数据 todo;
              lazyReportBatch(reportData);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      // 统计和计算fcp的时间
      var observer = new PerformanceObserver(entryHandler);
      // buffered: true 确保观察到所有paint事件
      observer.observe({
        type: 'paint',
        buffered: true
      });
    }

    function observerLoad() {
      window.addEventListener('pageShow', function (event) {
        requestAnimationFrame(function () {
          ['load'].forEach(function (type) {
            var reportData = {
              type: 'performance',
              subType: type,
              pageUrl: window.location.href,
              startTime: performance.now() - event.timeStamp
            };
            // 发送数据
            lazyReportBatch(reportData);
          });
        }, true);
      });
    }

    function observerPaint() {
      var entryHandler = function entryHandler(list) {
        var _iterator = _createForOfIteratorHelper(list.getEntries()),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            if (entry.name === 'first-paint') {
              observer.disconnect();
              var json = entry.toJSON();
              console.log(json);
              var reportData = _objectSpread2(_objectSpread2({}, json), {}, {
                type: 'performance',
                subType: entry.name,
                pageUrl: window.location.href
              });
              // 发送数据 todo;
              lazyReportBatch(reportData);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      };
      // 统计和计算fp的时间
      var observer = new PerformanceObserver(entryHandler);
      // buffered: true 确保观察到所有paint事件
      observer.observe({
        type: 'paint',
        buffered: true
      });
    }

    var originalProto = XMLHttpRequest.prototype;
    var originalSend = originalProto.send;
    var originalOpen = originalProto.open;
    function overwriteOpenAndSend() {
      originalProto.open = function newOpen() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        this.url = args[1];
        this.method = args[0];
        originalOpen.apply(this, args);
      };
      originalProto.send = function newSend() {
        var _this = this;
        this.startTime = Date.now();
        var onLoaded = function onLoaded() {
          _this.endTime = Date.now();
          _this.duration = _this.endTime - _this.startTime;
          var url = _this.url,
            method = _this.method,
            startTime = _this.startTime,
            endTime = _this.endTime,
            duration = _this.duration,
            status = _this.status;
          var reportData = {
            status: status,
            duration: duration,
            startTime: startTime,
            endTime: endTime,
            url: url,
            method: method.toUpperCase(),
            type: 'performance',
            success: status >= 200 && status < 300,
            subType: 'xhr'
          };
          // todo 发送数据
          lazyReportBatch(reportData);
          _this.removeEventListener('loadend', onLoaded, true);
        };
        this.addEventListener('loadend', onLoaded, true);
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }
        originalSend.apply(this, args);
      };
    }
    function xhr() {
      overwriteOpenAndSend();
    }

    function performance$1() {
      fetch();
      observerEntries();
      observerLCP();
      observerFCP();
      observerLoad();
      observerPaint();
      xhr();
    }

    function error() {
      // 捕获资源加载失败的错误： js css  img
      window.addEventListener('error', function (e) {
        var target = e.target;
        if (target.src || target.href) {
          var url = target.src || target.href;
          var reportData = {
            type: 'error',
            subType: 'resource',
            url: url,
            html: target.outerHTML,
            pageUrl: window.location.href,
            pahts: e.path
          };
          // todo 发送错误信息
          lazyReportBatch(reportData);
        }
      }, true);
      // 捕获js错误
      window.onerror = function (msg, url, lineNo, columnNo, error) {
        var reportData = {
          type: 'error',
          subType: 'js',
          msg: msg,
          url: url,
          lineNo: lineNo,
          columnNo: columnNo,
          stack: error.stack,
          pageUrl: window.location.href,
          startTime: performance.now()
        };
        // todo 发送错误信息
        lazyReportBatch(reportData);
      };
      // 捕获promise错误  asyn await
      window.addEventListener('unhandledrejection', function (e) {
        var _e$reason;
        var reportData = {
          type: 'error',
          subType: 'promise',
          reason: (_e$reason = e.reason) === null || _e$reason === void 0 ? void 0 : _e$reason.stack,
          pageUrl: window.location.href,
          startTime: e.timeStamp
        };
        // todo 发送错误信息
        lazyReportBatch(reportData);
      }, true);
    }

    function click() {
      ['mousedown', 'touchstart'].forEach(function (eventType) {
        window.addEventListener(eventType, function (e) {
          var target = e.target;
          if (target.tagName) {
            var reportData = {
              // scrollTop: document.documentElement.scrollTop,
              type: 'behavior',
              subType: 'click',
              target: target.tagName,
              startTime: e.timeStamp,
              innerHtml: target.innerHTML,
              outerHtml: target.outerHTML,
              with: target.offsetWidth,
              height: target.offsetHeight,
              eventType: eventType,
              path: e.path
            };
            lazyReportBatch(reportData);
          }
        });
      });
    }

    function pageChange() {
      // hash histroy
      var oldUrl = '';
      window.addEventListener('hashchange', function (event) {
        console.error('hashchange', event);
        var newUrl = event.newURL;
        var reportData = {
          form: oldUrl,
          to: newUrl,
          type: 'behavior',
          subType: 'hashchange',
          startTime: performance.now(),
          uuid: generateUniqueId()
        };
        lazyReportBatch(reportData);
        oldUrl = newUrl;
      }, true);
      var from = '';
      window.addEventListener('popstate', function (event) {
        console.error('popstate', event);
        var to = window.location.href;
        var reportData = {
          form: from,
          to: to,
          type: 'behavior',
          subType: 'popstate',
          startTime: performance.now(),
          uuid: generateUniqueId()
        };
        lazyReportBatch(reportData);
        from = to;
      }, true);
    }

    function pv() {
      var reportData = {
        type: 'behavior',
        subType: 'pv',
        startTime: performance.now(),
        pageUrl: window.location.href,
        referror: document.referrer,
        uuid: generateUniqueId()
      };
      lazyReportBatch(reportData);
    }

    function behavior() {
      click(), pageChange(), pv();
    }

    window.__webEyeSDK__ = {
      version: '0.0.1'
    };

    // 针对Vue项目的错误捕获
    function install(Vue, options) {
      if (__webEyeSDK__.vue) return;
      __webEyeSDK__.vue = true;
      setConfig(options);
      var handler = Vue.config.errorHandler;
      // vue项目中 通过 Vue.config.errorHandler 捕获错误
      Vue.config.errorHandler = function (err, vm, info) {
        // todo: 上报具体的错误信息
        var reportData = {
          info: info,
          error: err.stack,
          subType: 'vue',
          type: 'error',
          startTime: window.performance.now(),
          pageURL: window.location.href
        };
        console.log('vue error', reportData);
        lazyReportBatch(reportData);
        if (handler) {
          handler.call(this, err, vm, info);
        }
      };
    }
    // 针对React项目的错误捕获
    function errorBoundary(err, info) {
      if (__webEyeSDK__.react) return;
      __webEyeSDK__.react = true;
      // todo: 上报具体的错误信息
      var reportData = {
        error: err === null || err === void 0 ? void 0 : err.stack,
        info: info,
        subType: 'react',
        type: 'error',
        startTime: window.performance.now(),
        pageURL: window.location.href
      };
      lazyReportBatch(reportData);
    }
    function init(options) {
      setConfig(options);
      // performance();
      // error();
      // behavior();
    }
    var webEyeSDK = {
      install: install,
      errorBoundary: errorBoundary,
      performance: performance$1,
      error: error,
      behavior: behavior,
      init: init
    };

    // webEyeSDK.init({
    //     appId: '10000',
    //     batchSize: 50,

    // })

    exports.default = webEyeSDK;
    exports.errorBoundary = errorBoundary;
    exports.init = init;
    exports.install = install;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({});
//# sourceMappingURL=monitor.js.map
