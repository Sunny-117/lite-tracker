/*

const curring = (fn) => {
  const exec = (sumArgs = []) => {
    return sumArgs.length >= fn.length ? fn(...sumArgs) : (...args) => exec([...sumArgs, ...args])
  }
  return exec()
}

function sum(a, b, c, d) {
  return a + b + c + d;
}

console.log(curring(sum)(1)(2, 3)(4));

*/


const curring = (fn: Function) => {
  const exec = (sumArgs:any[] = []) => {
    return sumArgs.length >= fn.length ? fn(...sumArgs) : (...args:any[]) => exec([...sumArgs, ...args])
  }
  return exec()
}

function sum(a, b, c, d) {
  return a + b + c + d;
}

console.log(curring(sum)(1)(2, 3)(4));