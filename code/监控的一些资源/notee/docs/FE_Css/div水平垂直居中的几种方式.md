---
title: div水平垂直居中的几种方式
date: 2016-2-08 11:28:27
categories: [CSS应用]
---

```css
h1 {
  text-align: center;
}
.pop-win {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.pop-win div {
  position: absolute;
  width: 400px;
  height: 200px;
  padding: 10px;
  background: rgba(31, 175, 0, 0.6);
  border: 1px solid white;
  border-radius: 6px;
}

/*CSS 水平和垂直居中方法【 1  CSS3】：  将父级元素设为盒子模型，使子元素水平垂直居中。
.pop-win {
	display:flex;
	justify-content:center;
	align-items:center;
} */

/*CSS 水平和垂直居中方法【 2 CSS2】： 将要设置居中的元素分别向 下 和 向 右 各偏移50%，再将margin值设为 负的 元素本身的宽高咸半
.pop-main {
	top:50%;
	left:50%;
	margin-top:-100px;
	margin-left:-200px;
}*/

/*CSS 水平和垂直居中方法【 3 CSS3】： 和上面方法2的原理一样
.pop-main {
	top:50%;
	left:50%;
	transform:translate(-50%,-50%);
}*/

/*CSS 水平和垂直居中方法【 4 推荐】：将要设置居中的元素上 、右、下、左 都设为0，再将margin值设为水平垂直居中
.pop-main {
	top:0px;
	right:0px;
	bottom:0px;
	left:0px;
	margin:auto;
}*/
```
