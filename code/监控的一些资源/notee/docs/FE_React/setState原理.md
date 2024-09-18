# setState 原理

#### 1.在事件处理函数中或生命周期函数中的批量更新，是异步的

```js
class Updater {
  constructor() {
    this.state = { name: 'zwh', number: 0 };
    this.queue = [];
  }
  setState(newState) {
    this.queue.push(newState);
  }
  flush() {
    for (let i = 0; i < this.queue.length; i++) {
      let update = this.queue[i];
      if (typeof update === 'function') {
        this.state = { ...this.state, ...update(this.state) };
      } else {
        this.state = { ...this.state, ...update };
      }
    }
  }
}
let updater = new Updater();
updater.setState({ number: 1 });
updater.setState(previousState => ({ number: previousState.number + 1 }));
updater.setState({ number: 2 });
updater.setState({ number: 3 });

updater.flush();
console.log(updater.state);

//{ name: 'zwh', number: 3 }
```

#### 2.其它地方都是直接同步更新的，比如在 setTimeout

```js
import React from 'react';
import ReactDOM from 'react-dom';
let root = document.getElementById('root');

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick = () => {
    setTimeout(() => {
      this.setState({ number: 1 });
      console.log(this.state.number); // 1
      this.setState({ number: 2 });
      console.log(this.state.number); // 2
    });
  };
  render() {
    return (
      <div>
        <p>number:{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

ReactDOM.render(<Counter />, root);
```

```js
class Updater {
  constructor() {
    this.state = { name: 'zwh', number: 0 };
    this.queue = [];
  }
  setState(update) {
    if (typeof update === 'function') {
      this.state = { ...this.state, ...update(this.state) };
    } else {
      this.state = { ...this.state, ...update };
    }
  }
}
let updater = new Updater();
updater.setState({ number: 1 });
console.log(updater.state);
updater.setState(previousState => ({ number: previousState.number + 1 }));
console.log(updater.state);
updater.setState({ number: 3 });
console.log(updater.state);
updater.setState({ number: 4 });
console.log(updater.state);

/*

{ name: 'zwh', number: 1 }
{ name: 'zwh', number: 2 }
{ name: 'zwh', number: 3 }
{ name: 'zwh', number: 4 }

*/
```
