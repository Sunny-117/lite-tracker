---
title: js 截图应用(html2canvas)
date: 2019-02-16 22:00:00
categories: [JavaScript应用]
# JavaScript基础, JavaScript应用, 正则表达式, WebApi, CSS应用, Vue
# JavaScript初级算法题, JavaScript中级级算法题, JavaScript高级算法题
---

html2canvas

---

```html
<html>
  <head>
    <meta name="layout" content="main" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="https://cdn.bootcss.com/jquery/3.3.0/jquery.min.js"></script>
    <script src="https://cdn.bootcss.com/html2canvas/0.5.0-beta4/html2canvas.min.js"></script>

    <script type="text/javascript">
      $(document).ready(function() {
        $('.example1').on('click', function(event) {
          event.preventDefault();
          html2canvas(document.querySelector('#textArea'), {
            allowTaint: true,
            taintTest: false,
            onrendered: function(canvas) {
              canvas.id = 'mycanvas';
              //document.body.appendChild(canvas);
              //生成base64图片数据
              var dataUrl = canvas.toDataURL();
              var newImg = document.createElement('img');
              newImg.src = dataUrl;
              document.body.appendChild(newImg);
            },
          });
        });
      });
    </script>
  </head>

  <body>
    Hello!
    <div class="" style="background-color: #abc;">
      测试html5页面截图
    </div>

    <textarea id="textArea" col="20" rows="10"></textarea>
    <input class="example1" type="button" value="button" />
    生成界面如下：
  </body>
</html>
```
