---
title: Grid文档
date: 2018-04-12 22:00:00
categories: [CSS应用]
---

## 容器的属性

**grid-template-rows: 网格项分为 X 行,每行 Y 像素**
**grid-template-columns: 网格项分为 X 列,每列 Y 像素**

```css
.container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
}
/* 网格项分为 3 列,每列 50px */
```

---

## grid-template-rows/columns 的值

- px: 绝对像素
- fr：设置列或行占剩余空间的一个比例
- auto：设置列宽或行高自动等于它的内容的宽度或高度
- %：将列或行调整为它的容器宽度或高度的百分比
- repeat(X, Y...): Y 值重复 X 次
- minmax(X, Y): 网格容器改变大小时限制网格项的大小

```css
.container {
  display: grid;
  grid-template-columns: auto 50px 10% 2fr 1fr;
}
/* 网格项分为五列。第一列的宽与它的内容宽度相等；第二列宽 50px；第三列宽是它容器的 10%；最后两列，将剩余的宽度平均分成三份，第四列占两份，第五列占一份。 */

.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr 50px) 20px;
}
/* 等同于 grid-template-columns: 1fr 50px 1fr 50px 20px; */

.container {
  display: grid;
  grid-template-columns: 100px minmax(50px, 200px);
}
/* 添加两列，第一列 100px 宽，第二列宽度最小值是 50px，最大值是 200px。 */
```

---

**grid-row-gap: 行与行之间添加间隙**
**grid-column-gap: 列与列之间添加间隙**
**grid-gap: grid-row-gap 和 grid-column-gap 的缩写,可以为 1 个值或 2 个值**

```css
.container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-column-gap: 10px;
}
/* 网格项分为 3 列,每列 50px */
/* 每列间隙 10px */

.container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-gap: 10px 20px;
}
/* 网格项分为 3 列,每列 50px */
/* 每行间隙 10px, 每列间隙 20px */
```

---

---

## 网格项的属性

**grid-row:定义网格项开始和结束的位置，控制每个网格项占用的行数。**
**grid-column:定义网格项开始和结束的位置，控制每个网格项占用的列数。**

```css
.item {
  grid-column: 2 / 4;
  /* 网格项占用网格的最后两列 */
}
```

---

---

# areas 区域用法

## 容器的属性

**grid-template-areas:将网格中的一些网格单元格组合成一个区域（area），并为该区域指定一个自定义名称**

```css
.container {
  grid-template-areas:
    'header header header'
    'advert content content'
    'footer footer footer';
}
/* 将顶部三个单元格合并成一个名为header的区域，将底部三个单元格合并为一个名为footer的区域，并在中间行生成两个区域,advert和content。 */
/* 句点（.）表示一个空单元格 */
```

---

## 网格项的属性

**grid-area: 将网格项放入自定义区域**
**grid-area: 起始水平线 / 起始垂直线 / 末尾水平线 / 终止垂直线 ;**

```css
.item5 {
  grid-area: header;
}
/* 将item5放入header区域 */

item5 {
  grid-area: 3 / 1 / 4 / 4;
}
/* 将item5放入第 3 条和第 4 条水平线及第 1 条和第 4 条垂直线之间的区域内 */
```

---

---

# 对齐方式

## 容器

**justify-items: 水平对齐所有网格项的内容的方式**
**align-items: 垂直对齐所有网格项的内容的方式**

有 3 种值

- start：使内容在单元格左/上侧对齐
- center：使内容在单元格居中对齐
- end：使内容在单元格右/下侧对齐

```css
.container {
  display: grid;
  grid-template-columns: 50px 50px 50px;
  grid-gap: 10px 20px;
  justify-items: center;
}
/* 网格项分为 3 列,每列 50px */
/* 每行间隙 10px, 每列间隙 20px */
/* 所有网格项的内容水平方向居中对齐 */
```

## 网格项

**justify-self: 控制内容在单元格内沿行轴对齐的方式**
**align-self: 控制内容在单元格内沿列轴对齐的方式**
有 3 种值

- start：使内容在单元格左/上侧对齐
- center：使内容在单元格居中对齐
- end：使内容在单元格右/下侧对齐

```css
.item {
  align-self: end;
  /* item的内容底端对齐 */
}
```
