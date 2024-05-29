import config from "../config";
import lastCaptureEvent from "../util/captureEvent";
import { getComposedPath, getPaths } from "../util/paths";
import { report,lazyReportCache } from "../report";

/**
 * 这个正则表达式用于匹配 JavaScript 错误栈中的堆栈跟踪信息中的单个条目，其中包含文件名、行号和列号等信息。
 * 具体来说，它匹配以下格式的文本：
 * at functionName (filename:lineNumber:columnNumber)
 * at filename:lineNumber:columnNumber
 * at http://example.com/filename:lineNumber:columnNumber
 * at https://example.com/filename:lineNumber:columnNumber
 */
const FULL_MATCH =
  /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;

//限制追溯的错误堆栈数量
const STACK_TRACE_LIMIT = 10;

//通过正则表达式解析一行的错误信息
function parseStackLine(line) { 
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return {};
  const filename = lineMatch[2] || '<anonymous>';
  const functionName = lineMatch[1] || '';
  const lineno = parseInt(lineMatch[3], 10) || undefined;
  const colno = parseInt(lineMatch[4], 10) || undefined;

  return {
    filename,
    functionName,
    lineno,
    colno
  }
}

//解析错误堆栈
function parseStackFrames(error) { 
  const { stack } = error;
  //如果没有stack直接返回[]
  if (!stack) return [];
  const frames = [];

  for (const line of stack.split('\n').slice(1)) { 
    const frame = parseStackLine(line); //分析一行的错误信息
    if (frame.filename) { 
      //放入到堆栈错误信息数组中
      frames.push(frame);
    }
  }
  return frames.slice(0, STACK_TRACE_LIMIT);
} 


export default function error() {
  console.log('error');
  /*
  const rawOnError = window.onerror;
  window.onerror = function (message, url, lineno, colno, error) { 
    if (rawOnError) { 
      rawOnError.call(window, message, url, lineno, colno, error);
    }

    console.log('onerror 监听中...');
    console.log(message, url, lineno, colno);
    console.log(error);
  }
  */
  
  //资源错误没有冒泡，所以只能在捕获阶段采集获取错误
  window.addEventListener('error', function (event) {
    const target = event.target;
    console.log('error 监听中...');
    console.log(event);

    //获取执行的事件
    const lastEvent = lastCaptureEvent();
    
    //获取事件的执行路径
    const paths = getPaths(lastEvent);
    console.log(paths);

    //要判断是资源错误，还是js错误，很简单，直接判断事件对象有没有src或者href属性就可以了
    if (target && (target.src || target.href)) {
      console.log('资源错误');
      //上报资源错误 todo...
      const data = {
        errorType: 'resourceError',
        filename: target.src || target.href,
        tagName: target.tagName,
        message: `加载${target.tagName}失败`,
      }
      console.log(data);
      lazyReportCache('error', data)
    }
    else {
      console.log('js错误');
      //上报js错误 todo...
      const errs = parseStackFrames(event.error);
      console.log(errs);
      const { 
        filename,
        functionName,
        lineno,
        colno,
      } = errs[0];

      const data = {
        errorType:'jsError',
        filename,
        functionName,
        lineno,
        colno,
        message: event.message,
        stack: event.error.stack,
        paths
      }
  
      console.log(data)
      lazyReportCache('error', data)
    }
  }, true)
  
  //promise错误
  window.addEventListener('unhandledrejection', function (event) { 
    console.log('promise错误');
    console.log(event);
    //获取执行的事件
    const lastEvent = lastCaptureEvent();
    
    //获取事件的执行路径
    const paths = getPaths(lastEvent);
    console.log(paths);
    //上报promise错误 todo...
    const reason = event.reason;
    const errs = parseStackFrames(reason);
    console.log(errs);
    const { 
      filename,
      functionName,
      lineno,
      colno,
    } = errs[0];

    const data = {
      errorType:'promiseError',
      filename,
      functionName,
      lineno,
      colno,
      message: reason.message,
      stack: reason.stack,
      paths
    }

    console.log(data)
    lazyReportCache('error', data)
  })


  //vue错误
  if (config.vue?.Vue) { 
    console.log('vue错误');
    config.vue.Vue.config.errorHandler = function (err, vm, info) { 
      console.log(err);

      //获取执行的事件
      const lastEvent = lastCaptureEvent();
      
      //获取事件的执行路径
      const paths = getPaths(lastEvent);
      console.log(paths);

      //上报vue错误 todo...
      const errs = parseStackFrames(err);

      const { 
        filename,
        functionName,
        lineno,
        colno,
      } = errs[0];

      const data = {
        errorType:'vueError',
        filename,
        functionName,
        lineno,
        colno,
        message: err.message,
        stack: err.stack,
        paths
      }

      console.log(data);

      lazyReportCache('error', data)

    }
  }
}