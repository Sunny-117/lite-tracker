import { compareTwoVdom, findDOM } from "./react-dom"

export let updateQueue = { // 点击后的更新器队列
  isBatchingUpdate: false,
  updaters: [],
  batchUpdate() {
    for (let updater of updateQueue.updaters) {
      updater.updateComponent() // 执行更新器的更新状态
    }
    updateQueue.updaters.length = 0
    updateQueue.isBatchingUpdate = false
  }
}

class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance // 组件实例
    this.pendingStates = [] // 数组存着setState传的对象
  }
  addState(partialState) {
    this.pendingStates.push(partialState)
    this.emitUpdate() // 触发更新
  }
  emitUpdate(nextProps) {
    this.nextProps = nextProps
    if (updateQueue.isBatchingUpdate) { // 批量异步更新
      updateQueue.updaters.push(this) // 把更新器实例添加到队列
    } else {
      this.updateComponent() // 直接更新。如在setTimeout中，不在react控制范围，react只是触发函数
    }
  }
  updateComponent() {
    const { classInstance, nextProps, pendingStates } = this
    // 只要有nextProps或者有setState传的对象，都要去更新属性或状态
    if (nextProps || pendingStates.length > 0) { // 异步更新一次就能跑完pendingStates
      shouldUpdate(classInstance, this.nextProps, this.getState())
    }
  }
  getState() {
    const { classInstance, pendingStates } = this
    let { state } = classInstance // 组件实例的state
    pendingStates.forEach(pendingState => {
      if (typeof pendingState === 'function') { // setState可能是一个回调函数
        pendingState = pendingState(state)
      }
      state = { ...state, ...pendingState }
    })
    pendingStates.length = 0
    return state
  }
}

function shouldUpdate(classInstance, nextProps, nextState) { // 将要更新的数据，nextProps：新的属性对象，nextState：新的状态对象
  let willUpdate = true // 组件是否要更新
  // 类组件实例有shouldComponentUpdate函数，且函数执行返回false，willUpdate赋值为false
  if (classInstance.shouldComponentUpdate && !classInstance.shouldComponentUpdate(nextProps, nextState)) {
    willUpdate = false // 不更新组件
  }
  // 如果要更新组件，且有componentWillUpdate函数，就执行他
  if (willUpdate && classInstance.componentWillUpdate) {
    classInstance.componentWillUpdate()
  }
  if (nextProps) { // 不管要不要更新组件，只要有属性，都要更新
    classInstance.nextProps = nextProps
  }
  classInstance.state = nextState // 不管要不要更新组件，都要更新状态

  if (willUpdate) { // 要更新组件
    classInstance.forceUpdate()
  }
  // classInstance.state = nextState
  // classInstance.forceUpdate() // 强制更新
}

class Component {
  static isReactComponent = true // 类也是函数，后面为了判断类组件和函数组件，这里加一个静态属性
  constructor(props) {
    this.props = props
    this.state = {}
    this.Updater = new Updater(this) // 观察者模式。每个组件都有自己的更新器
  }
  setState(partialState) {
    this.Updater.addState(partialState)
  }
  forceUpdate() {

    let oldRenderVdom = this.oldRenderVdom // 类组件render()返回的旧虚拟dom
    let oldDOM = findDOM(oldRenderVdom) // 虚拟dom上挂载的真实dom

    let newRenderVdom = this.render() // 基于新的属性和状态，计算新的虚拟dom
    compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom) // 比较新旧虚拟dom，dom-diff

    this.oldRenderVdom = newRenderVdom // 更新上一次的虚拟dom

    if (this.componentDidUpdate) { // 完成dom更新，执行componentDidUpdate
      this.componentDidUpdate(this.props, this.state)
    }
  }
}

export default Component