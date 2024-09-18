# React 和 Vue

#### 赋值方式

```react
this.setState((prevState) => ({
  name: 'zwh',
  age: prevState + 1
}), () => {
  console.log(this.state.name) // zwh
})
console.log(this.state.name) // ! name 还没赋值
// setState 是异步的，赋值完成后会执行第二个回调函数
```

```vue
this.state.name = 'zwh' this.state.age = this.state.age + 1
console.log(this.state.name) // zwh
```

#### 组件传值校验和默认值

```react
static propTypes = {
  msg: PropTypes.string
}
static defaultProps = {
  msg: 'zwh'
}
```

```vue
props: { msg: { type: String, default: 'zwh' } }
```

#### 包裹标签(渲染时隐藏)

`<Fragment></Fragment>`

`<template></template>`

#### 循环列表

```react
{
  this.state.list.map(item => {
    return <li>{item}</li>
  })
}

//  { [<li>{item}</li>, <li>{item}</li>] }
```

```vue
<li v-for="item of list">{{item}}</li>
```

#### 渲染 HTML

```react
<li dangerouslySetInnerHTML={{ __html: item }}></li>
```

```vue
<li v-html="item"></li>
```

#### DOM 的引用 ref

```react
// createRef 方法
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
this.myRef.current // 访问DOM


// 回调 Refs 方法
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = null
    this.setInputRef = element => {
      this.inputRef = element
    }
  }
  render() {
    return <div ref={this.setInputRef} />;
  }
}
this.inputRef // 访问DOM
```

```vue
<!-- DOM节点的引用 -->
<p ref="p">hello</p>

<!-- 组件DOM的引用 -->
<child-component ref="child"></child-component>

this.$refs.p // 访问DOM
```

#### 性能优化

```react
shouldComponentUpdate(nextProps, nextState){
  return nextProps.item !=== this.props.item
}
```

#### 路由传参

```react
url:  /detail/1
router-path: '/detail/:id'

this.props.match.params
// 1
```

```vue
url: /detail/1 router-path: '/detail/:id' this.$route.params // 1
```
