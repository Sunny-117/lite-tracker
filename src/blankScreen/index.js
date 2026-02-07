import { report } from "../report";
import onload from "../util/onload";
import getSelector from "../util/getSelector";

/**
 * 白屏检测方法：关键点采样检测法
 * 原理：在页面有元素的方位选取点进行元素检测，这里采用以中心为基点的十字轴采样18个点，
 * 检测每个点对应的元素是否是原始的标签元素，如果是则认为该点是空白点，空白点达到阈值则发送白屏监控日志
 */
export default function blankScreen() {
  // 关键点的元素是这些则认为是空白点
  const wrapperElements = ['html', 'body', '#container', '.content', '#app', '#root'];
  let emptyPoints = 0;

  function isWrapper(element) {
    const selector = getSelector(element);
    if (wrapperElements.indexOf(selector) !== -1) {
      emptyPoints++;
    }
  }

  // 在页面onload事件完成后调用
  onload(function () {
    // 以中心为基点的横纵轴各取9个点作为采样点
    for (let i = 1; i <= 9; i++) {
      const xElement = document.elementFromPoint(
        (window.innerWidth * i) / 10,
        window.innerHeight / 2
      );
      const yElement = document.elementFromPoint(
        window.innerWidth / 2,
        (window.innerHeight * i) / 10
      );

      isWrapper(xElement);
      isWrapper(yElement);
    }

    // 空白点超过阈值发送日志
    if (emptyPoints >= 16) {
      const centerElement = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );

      const data = {
        subType: 'blank',
        emptyPoints,
        screen: window.screen.width + "X" + window.screen.height,
        viewPoint: window.innerWidth + "X" + window.innerHeight,
        selector: getSelector(centerElement),
      };

      report('error', data, true); // 白屏是严重问题，立即上报
    }
  });
}
