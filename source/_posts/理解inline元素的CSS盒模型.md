---
title: 理解inline元素的CSS盒模型
type: categories
copyright: true
date: 2018-11-14 23:34:53
tags: [FE,HTML,Inline,Box]
categories: 
- [FE,HTML]
---

{%asset_img html-inline.png 600%}

原文：[Understanding the CSS box model for inline elements](https://hacks.mozilla.org/2015/03/understanding-inline-box-model/) 

​	页面上的每一个元素都会被浏览器渲染成一个个的矩形的盒子。[box model](https://developer.mozilla.org/en-US/docs/Web/CSS/box_model)解释了元素的 `content`, `padding`, `border`, 和 `margin` 是如何决定元素占据的空间以及与页面上其他元素之间的关系。

​	页面元素因 `display` 属性设置不同可能出现两种类型：block box（块级元素）或者  inline box（内联元素）。盒模型对这两种类型的处理方式不同。本文就聊一聊盒模型如何作用于 inline box。

<!--more-->

## Inline box 和 line box

inline box 横向分布于 line box 中：

[![2-inline-boxes](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/2-inline-boxes.png)](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/2-inline-boxes.png)



如果水平方向没有足够的空间来将所有元素在一行内显示，浏览器就会在当前行的后面创建一个新的 line box。一个 inline 元素就有可能被拆分到两行中：

[![line-boxes](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/line-boxes.png)](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/line-boxes.png)

## inline box 的盒模型

​	当 inline box被拆分成多行的时候，它在逻辑上仍然是一个盒子。这就是说，任何水平的 padding, border, 或者 margin 的设置只会作用于元素占据的第一行的起始位置和最后一行的末尾。

​	例如，在下面的截图中，高亮的 `span` 被分成了 2 行。水平的 padding 没有作用于第一行的末尾，也没有作用于第二行的开头。

[![horizontal-padding](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/horizontal-padding.png)](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/horizontal-padding.png)

​	对 inline 元素设置的任何垂直的 padding, border, 或者 margin 都不能将元素上下的相邻元素推开：

[![vertical-padding](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/vertical-padding.png)](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/vertical-padding.png)

​	然而，请注意垂直的 padding 和 border 仍然应用了，padding 也将border 推开了：

[![vertical-border-padding](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/vertical-border-padding.png)](https://2r4s9p1yi1fa2jd7j43zph8r-wpengine.netdna-ssl.com/files/2015/03/vertical-border-padding.png)

如果你需要调整行距，要用 `line-height` 。