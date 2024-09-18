---
title: XML生成和下载
date: 2019-2-19 01:00:00
categories: [WebApi]
# JavaScript基础, JavaScript应用, 正则表达式, WebApi, CSS应用, Vue
# JavaScript初级算法题, JavaScript中级级算法题, JavaScript高级算法题
---

```js
function CreatXmlDoc(obj) {
  this.tagName = obj.tagName;
  var children = obj.children.map(function(item) {
    if (typeof item == 'object') {
      item = new CreatXmlDoc(item);
    }
    return item;
  });
  this.children = children;
}

CreatXmlDoc.prototype.render = function() {
  var el = document.createElement(this.tagName);
  var children = this.children || [];
  children.forEach(function(child) {
    var childEl =
      child instanceof CreatXmlDoc
        ? child.render()
        : document.createTextNode(child);
    el.appendChild(childEl);
  });
  return el;
};
```

---

```js
export function downloadXml(string) {
  const blob = new Blob([string], {
    type: 'text/xml',
  });
  const a = document.createElement('a');
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = 'xmlDoc.xml';
  a.click();
}
```

## dome

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>CreatXmlDoc</title>
  </head>

  <body>
    <script>
      function CreatXmlDoc(obj) {
        this.tagName = obj.tagName;
        var children = obj.children.map(function(item) {
          if (typeof item == 'object') {
            item = new CreatXmlDoc(item);
          }
          return item;
        });
        this.children = children;
      }

      CreatXmlDoc.prototype.render = function() {
        var el = document.createElement(this.tagName);
        var children = this.children || [];
        children.forEach(function(child) {
          var childEl =
            child instanceof CreatXmlDoc
              ? child.render()
              : document.createTextNode(child);
          el.appendChild(childEl);
        });
        return el;
      };

      var obj = {
        tagName: 'Setup',
        children: [
          {
            tagName: 'ProtocolList',
            children: [
              {
                tagName: 'Protocol',
                children: [
                  {
                    tagName: 'Name',
                    children: ['onvif'],
                  },
                  {
                    tagName: 'UserName',
                    children: ['admin'],
                  },
                  {
                    tagName: 'PassWord',
                    children: ['admin'],
                  },
                ],
              },
              {
                tagName: 'Protocol',
                children: [
                  {
                    tagName: 'Port',
                    children: ['8000'],
                  },
                  {
                    tagName: 'MediaPort',
                    children: ['8000'],
                  },
                ],
              },
            ],
          },
          {
            tagName: 'Function',
            children: [
              {
                tagName: 'PlayBack',
                children: ['onvif'],
              },
              {
                tagName: 'Other',
                children: ['rtsp'],
              },
            ],
          },
        ],
      };

      doc = new CreatXmlDoc(obj);
      SetupSerial = new XMLSerializer().serializeToString(doc.render());
      var reg = new RegExp(' xmlns="http://www.w3.org/1999/xhtml"', 'g');
      SetupSerial = SetupSerial.replace(reg, '');
      console.log(SetupSerial);
    </script>
  </body>
</html>
```
