---
title: drag的api和实现
date: 2018-12-26 19:00:00
categories: [WebApi]
---

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
    <style>
      #demo1 {
        margin: 20px;
      }
      #demo1 .panel-list {
        overflow: hidden;
        list-style: none;
        margin: 0;
        padding: 0;
      }
      #demo1 .panel-item {
        float: left;
        margin-right: 30px;
        width: 100px;
        height: 100px;
        background: #ddd;
        border: 1px solid #ddd;
      }
      #demo1-src {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: purple;
      }
      #demo1 .over {
        border: 1px dashed #000;
        -webkit-transform: scale(0.8, 0.8);
      }
    </style>
  </head>
  <body>
    <div id="demo1">
      <ul class="panel-list">
        <li class="panel-item"></li>
        <li class="panel-item"></li>
        <li class="panel-item"></li>
        <li class="panel-item"></li>
        <li class="panel-item"></li>
      </ul>
      <h2>拖拽下面的方块到上面任意容器中</h2>

      <!-- 设置draggable使元素成为可拖拽元素 -->
      <span class="movable" id="demo1-src" draggable="true"></span>

      <script>
        (function() {
          var dnd = {
            // 初始化
            init: function() {
              var me = this;
              me.src = document.querySelector('#demo1-src');
              me.panelList = document.querySelector('.panel-list');

              // 为拖拽源监听dragstart,设置关联数据
              me.src.addEventListener('dragstart', me.onDragStart, false);

              // 拖拽鼠标移入元素,在拖放目标上设置视觉反馈
              me.panelList.addEventListener('dragenter', me.onDragEnter, false);

              // 取消元素dragover默认行为,使其可拖放
              me.panelList.addEventListener('dragover', me.onDragOver, false);

              // 拖拽移出元素,清除视觉反馈
              me.panelList.addEventListener('dragleave', me.onDragLeave, false);

              // 鼠标释放,在拖放目标上接收数据并处理
              me.panelList.addEventListener('drop', me.onDrop, false);
            },
            onDragStart: function(e) {
              e.dataTransfer.setData('text/plain', 'demo1-src');
            },
            onDragEnter: function(e) {
              if (e.target.classList.contains('panel-item')) {
                e.target.classList.add('over');
              }
            },
            onDragLeave: function(e) {
              if (e.target.classList.contains('panel-item')) {
                e.target.classList.remove('over');
              }
            },
            onDragOver: function(e) {
              e.preventDefault();
            },
            onDrop: function(e) {
              var id = e.dataTransfer.getData('text/plain');
              var src = document.getElementById(id);
              var target = e.target;
              if (target.classList.contains('panel-item')) {
                target.appendChild(src);
                target.classList.remove('over');
              }
            },
          };

          dnd.init();
        })();
      </script>
    </div>
  </body>
</html>
```
