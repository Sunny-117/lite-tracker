/**
 * 页面加载完成后执行回调
 * @param {Function} callback 回调函数
 */
export default function onload(callback) {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback, { once: true });
  }
}
