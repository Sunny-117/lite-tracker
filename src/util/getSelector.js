/**
 * 获取元素的选择器
 * @param {Element} element DOM元素
 * @returns {string} 元素选择器
 */
export default function getSelector(element) {
  if (!element) return '';
  
  if (element.id) {
    return "#" + element.id;
  } else if (element.className && typeof element.className === 'string') {
    return "." + element.className.split(' ').filter(item => !!item).join('.');
  } else {
    return element.nodeName?.toLowerCase() || '';
  }
}
