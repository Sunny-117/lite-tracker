# Proxy

```js
const obj = { a: 1 };

const p = new Proxy(obj, {
  get(target, property, receiver) {
    console.log(`${property}=${target[property]}`);
    return Reflect.get(target, property, receiver);
  },
  set(target, property, value, receiver) {
    console.log(`监听到属性${property}改变为${value}`);
    return Reflect.set(target, property, value, receiver);
  },
});

p.a = 2; // 监听到属性a改变
p.a; // 'a' = 2
```
