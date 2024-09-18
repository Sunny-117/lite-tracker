/*

输入：
let element2 = 
{
  "type": "h1",
  "ref": "undefined",
  "key": "undefined",
  "props": {
    "className": "title",
    "style": {
      "color": "red"
    },
    "children": [
      {
        "type": Symbol(REACT_TEXT),
        "props": {
          "content": "hello"
        }
      },
      {
        "type": "span",
        "ref": "undefined",
        "key": "undefined",
        "props": {
          "children": {
            "type": Symbol(REACT_TEXT)
            "props": {
              "content": "world"
            }
          }
        }
      }
    ]
  }
}

输出：
浏览器可识别的标注dom格式

*/

import { REACT_FORWARD_REF, REACT_TEXT } from "./constants"
import { addEvent } from "./event"

function render(vdom, container) {
  mount(vdom, container)
}

function mount(vdom, parentDOM) {
  let newDOM = createDOM(vdom)
  if (newDOM) {
    parentDOM.appendChild(newDOM)
    if (newDOM._componentDidMount) newDOM._componentDidMount()
  }
}

export function createDOM(vdom) { // 创建真实dom
  if (!vdom) return null
  let { type, props, ref } = vdom
  let dom
  if (type.$$typeof === REACT_FORWARD_REF) {
    return mountForwardComponent(vdom)
  } else if (type === REACT_TEXT) { // 元素是一个文本
    dom = document.createTextNode(props.content)
  } else if (typeof type === 'function') {
    if (type.isReactComponent) {
      return mountClassComponent(vdom)
    } else {
      return mountFunctionComponent(vdom)
    }
  } else {
    dom = document.createElement(type) // div p span
  }

  if (props) { // 处理属性
    updateProps(dom, {}, props)
    if (props.children) {
      let children = props.children
      if (typeof children === 'object' && children.type) { //这是一个react元素
        mount(children, dom)
      } else if (Array.isArray(children)) {
        reconcileChildren(props.children, dom) // 处理子元素
      }
    }
  }
  vdom.dom = dom // 在vdom上挂载对应的真实dom
  if (ref) ref.current = dom // 如果有ref属性，就把dom引用挂载在ref.current上
  return dom
}

function mountClassComponent(vdom) { // 处理类组件
  let { type: ClassComponent, props, ref } = vdom
  let classInstance = new ClassComponent(props) // nwe类组件，返回实例
  if (ref) ref.current = classInstance // 如果类组件有ref属性，就把类组件的引用挂载到ref.current
  if (classInstance.componentWillMount) { // 将要装载函数，写在render之前
    classInstance.componentWillMount()
  }
  let renderVdom = classInstance.render() // 运行render函数返回jsx=>babel自动转成js=>react.createElement转成vdom
  classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom // 可能类组件嵌套函数组件
  let dom = createDOM(renderVdom)
  if (classInstance.componentDidMount) { // 先把完成装载函数componentDidMount挂载到真实dom上，appendChild后执行
    dom._componentDidMount = classInstance.componentDidMount.bind(classInstance)
  }
  return dom
}
function mountFunctionComponent(vdom) { // 处理函数组件
  let { type, props } = vdom
  let renderVdom = type(props) // 运行函数，返回jsx=>babel自动转成js=>react.createElement转成vdom
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}
function mountForwardComponent(vdom) { // 处理包装的函数组件
  let { type, props, ref } = vdom
  let renderVdom = type.render(props, ref) // TextInput(props, forwardRef) => {}
  vdom.oldRenderVdom = renderVdom
  return createDOM(renderVdom)
}

function reconcileChildren(childrenVdom, parentDOM) { // 处理props.children
  childrenVdom.forEach(childVdom => mount(childVdom, parentDOM))
}

function updateProps(dom, oldProps, newProps) { // 把属性挂载到dom中
  for (const key in newProps) {
    if (key === 'children') { // children有另外的处理
      continue
    } else if (key === 'style') { // style行内样式的处理
      let styleObj = newProps[key]
      for (const arrt in styleObj) {
        dom.style[arrt] = styleObj[arrt]
      }
    } else if (key.startsWith('on')) {
      // dom[key.toLocaleLowerCase()] = newProps[key] // 事件绑定，onClick转成onclick。保存原来的值
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]) // 事件委托处理
    } else {
      dom[key] = newProps[key] // className id title
    }
  }
}

export function findDOM(vdom) {
  if (vdom.dom) { // 只有jsx里面才有dom属性，类组件、函数组件身上没有dom属性，需要递归到最后一层的jsx
    return vdom.dom
  } else {
    return findDOM(vdom.oldRenderVdom)
  }
}


// dom-diff，比较新旧虚拟dom的差异，把差异同步到真实dom上
export function compareTwoVdom(parentDOM, oldVdom, newVdom) {
  let oldDOM = findDOM(oldVdom) // 虚拟dom上挂载的真实dom
  let newDOM = createDOM(newVdom) // 生成新的真实dom
  parentDOM.replaceChild(newDOM, oldDOM) // 把旧真实dom替换为新真实dom
}

const ReactDom = {
  render
}

export default ReactDom