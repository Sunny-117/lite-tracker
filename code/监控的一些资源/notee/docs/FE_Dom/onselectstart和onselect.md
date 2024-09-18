---
title: onselectstart和onselect的区别
date: 2018-12-27 19:00:00
categories: [WebApi]
---

## 二者的区别

- onselect 事件会在文本框中的文本被选中时发生
- 支持该事件的 HTML 标签：`<input type="text">，<textarea>`
- 支持该事件的 JavaScript 对象：window

**使用举例：**

```html
<input
  type="text"
  value="Hello world!"
  onselect="alert('你已经选中了文字！')"
/>
```

即当鼠标的左键划过并选中了 input 输入框中的内容时，就会触发 onselect 事件。

---

- onselectstart 触发时间为目标对象被开始选中时（即选中动作刚开始，尚未实质性被选中）
- onselectstart 几乎可以用于所有对象
- 注意：onselectstart 事件不被 input 和 textarea 标签支持

**使用举例（非 Firefox 浏览器下）：**

```html
<div onselectstart="return false;">我不能被鼠标选中哦</div>
```

Firefox 不支持上面这样的使用方式，在 Firefox 浏览器下可以通过设置 CSS 样式来达到相同的效果

```css
div {
  -moz-user-select: none;
}
```

**即 onselectstart 事件才是用来实现元素内文本不被选中的正确方法。**
