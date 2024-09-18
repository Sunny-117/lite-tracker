import { updateQueue } from "./Component"

// 事件委托
export function addEvent(dom, eventType, eventHandle) {
  let store
  if (dom._store) {
    store = dom._store
  } else {
    dom._store = {}
    store = dom._store
  }
  store[eventType] = eventHandle // dom._store.onclick=handleClick
  if (!document[eventType]) { // document.onclick=dispatchEvent
    document[eventType] = dispatchEvent
  }
}

function dispatchEvent(event) { // event是原生事件
  let { target, type } = event // target=>dom=>button
  let eventType = 'on' + type

  updateQueue.isBatchingUpdate = true // 先把批量更新的变量为true

  let syntheticEvent = createSyntheticEvent(event) // 得到合成事件，基本等于原生事件

  let currentTarget = target
  while (currentTarget) { // 模拟向上冒泡的过程。会把冒泡父级的onclick都执行一遍
    let { _store } = currentTarget
    let eventHandle = _store && _store[eventType] // 如果有onclick处理函数，这里是handleClick

    if (eventHandle) {  // 冒泡对象没有绑定对应事件的处理函数，就不执行
      syntheticEvent.target = target
      syntheticEvent.currentTarget = currentTarget

      eventHandle.call(target, syntheticEvent)  // 执行事件处理函数。button => handleClick(syntheticEvent)
    }

    currentTarget = currentTarget.parentNode // 赋值父元素引用，继续循环，直到document
  }

  updateQueue.isBatchingUpdate = false
  updateQueue.batchUpdate()
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = { nativeEvent }
  for (const key in nativeEvent) {
    syntheticEvent[key] = nativeEvent[key]
  }
  return syntheticEvent
}