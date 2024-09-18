# js-xlsx 的使用

```js
const XLSX = require('xlsx'); //生成xlsx

const sheetData = [
  ['2020', '2019', '2018'],
  ['31232', '43242', '6423'],
];

// 生成工作表
let ws = XLSX.utils.aoa_to_sheet(sheetData);

// 添加到新工作表
let wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, '茅台');

// 生成 buffer
let buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

// buffer 保存 excel
fs.writeFileSync('./茅台数据.xlsx', buffer);
```
