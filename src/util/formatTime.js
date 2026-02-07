/**
 * 格式化时间，保留两位小数
 * @param {number} time 时间戳
 * @returns {string} 格式化后的时间
 */
export default function formatTime(time) {
  return `${time.toFixed(2)}ms`;
}
