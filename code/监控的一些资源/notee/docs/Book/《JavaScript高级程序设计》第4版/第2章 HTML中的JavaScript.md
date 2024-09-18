# 第2章 HTML中的JavaScript

```js
<!DOCTYPE html>
<html>
<head>
	<title>Example HTML Page</title>
</head>
<body>
	<!-- 这里是页面内容 -->
	<script src="example1.js"></script>
	<script src="example2.js"></script>
</body>
</html>
```

浏览器只要遇到`<script>`都会立即下载，默认会按照`<script>`在页面中出现的顺序依次解释它们。第二个`<script>`元素的代码必须在第一个`<script>`元素的代码解释完毕才能开始解释，第三个则必须等第二个解释完，以此类推。

把`<script>`放在`<body>`底部，页面会在处理 JavaScript 代码之前已经完全渲染页面，避免出现初始页面空白的情况。

> 外部 JavaScript 文件的扩展名是.js是可以省略的，不过服务器经常会根据文件扩展来确定响应的正确 MIME 类型。如果省略.js ，一定要确保服务器能返回正确的 MIME 类型。



## defer属性

`<script>`可添加defer属性，可以让这个脚本延迟到文档完全被解析和显示之后再执行。相当于告诉浏览器立即下载，但延迟执行。

```js
<!DOCTYPE html>
<html>
<head>
	<title>Example HTML Page</title>
	<script defer src="example1.js"></script>
	<script defer src="example2.js"></script>
</head>
<body>
	<!-- 这里是页面内容 -->
</body>
</html>
```



**defer属性可以替代把`<script>`放在`<body>`底部吗？不能！**

首先浏览器只要遇到`<script>`都会立即下载，这样仍然会增加页面打开到显示的时间。而且在实际当中，defer推迟执行的脚本不一定总会按顺序执行或者在 DOMContentLoaded 事件之前执行。通常defer只按照业务需要加在特殊且唯一的脚本中。



## async属性

`<script>`可添加async属性，让这个脚本变成独立的异步脚本。不会阻止其他页面动作，比如下载资源或等待其他脚本加载。

```js
<!DOCTYPE html>
<html>
<head>
	<title>Example HTML Page</title>
	<script async src="example1.js"></script>
	<script async src="example2.js"></script>
</head>
<body>
	<!-- 这里是页面内容 -->
</body>
</html>
```

没有加async时，第二个`<script>`元素的代码必须在第一个`<script>`元素的代码解释完毕才能开始解释。

在这个例子中，**重点在于它们之间没有了依赖关系**，依次开始下载，谁先下载完成就先执行。现在第二个脚本可能先于第一个脚本执行。给脚本添加 async 属性的目的是告诉浏览器，不必等脚本下载和执行完后再加载页面，同样也不必等到该异步脚本下载和执行后再加载其他脚本。



> ```js
> let script = document.createElement('script'); 
> script.src = 'gibberish.js'; 
> document.head.appendChild(script);
> ```
>
> 默认情况下，以这种方式创建的`<script>`元素是以异步方式加载的，相当于添加了 async 属性。



## type属性

type属性不填，默认是"text/javascript"，如果这个值是 module，则代码会被当成 ES6 模块，而且只有这时候代码中才能出现 import 和 export 关键字。



## integrity属性

允许比对接收到的资源和指定的加密签名以验证子资源完整性。如果接收到的资源的签名与这个属性指定的签名不匹配，则页面会报错，脚本不会执行。这个属性可以用于确保内容分发网络（CDN，Content Delivery Network）不会提供恶意内容。通常配合CDN使用。