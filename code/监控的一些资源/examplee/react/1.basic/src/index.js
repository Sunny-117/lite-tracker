import React from "./react"
import ReactDom from "./react-dom"

class Counter extends React.Component {
  constructor(props) {
    super(props)
    this.state = { number: 0 }
    console.log('Counter 1. constructor')
  }
  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
  }
  componentWillMount() {
    console.log('Counter 2. componentWillMount')
  }
  render() {
    console.log('Counter 3. render')
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>点击增加</button>
      </div>
    )
  }
  componentDidMount() {
    console.log('Counter 4. componentDidMount')
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log('Counter 5. shouldComponentUpdate')
    return nextState.number % 2 === 0 // 奇数不更新，偶数更新
  }
  componentWillUpdate() {
    console.log('Counter 6. componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('Counter 7. componentDidUpdate')
  }
}

ReactDom.render(<Counter />, document.getElementById('root'))

/*
Counter 1. constructor
Counter 2. componentWillMount
Counter 3. render
Counter 4. componentDidMount
Counter 5. shouldComponentUpdate
-点击button-
Counter 5. shouldComponentUpdate
Counter 6. componentWillUpdate
Counter 3. render
Counter 7. componentDidUpdate
*/