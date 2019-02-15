---
title: CSS Layout
type: categories
copyright: true
date: 2018-11-05 08:58:46
tags: [CSS,Layout,CSS布局]
categories: 
- [FE,CSS]
---



## 水平居中

水平居中布局需要看子元素是 `block` 元素还是 `inline` 元素，`width` 是否固定。因此形成下面四个例子。

- demo1 是子元素为 `inline` ，对父元素设置 `text-align:center`。
- demo2 中子元素为 `block` ，宽度固定，则对子元素设置 `margin:0 auto`,左右宽度固定
- demo3 中子元素为 `block` ，宽度不定，则子元素 `display:inline` ,父元素 `text-align:center` 
- demo4 中采用了 `flex` 布局，是一种通用的方案，对 `inline` 和 `block` 两种元素均有效，`display:flex` 主轴居中对齐 `justify-content:center;` 

{%raw%}

<iframe height='265' scrolling='no' title='水平居中布局' src='//codepen.io/redcorss/embed/aQzVXP/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/aQzVXP/'>水平居中布局</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

{%endraw%}

<!--more-->

## 垂直居中

垂直居中布局则因子元素是单行内联文本，多行内联文本以及块级元素而异

- demo1  父元素高度固定，子元素为单行内联文本，设置父元素行高为子元素的 `line-height`
- demo2 父元素高度固定，子元素为多行内联文本，这时用上面的方法会导致子元素只有第一行在父元素内部，其他行飘出去了，于是要换一种思路，父元素设置 CSS  `display:table-cell; vertical-align:middle` ，如果不成功，注意检查外部CSS污染。
- demo3 子元素是块级元素的时候，使用定位+位移的方式，父元素设置为 `static` 以外的值，子元素 `position:absolute; top:50%;transform:translateY(-50%);`
- demo4 通用方案，使用 Flex 布局， `display:flex;` ,交叉轴居中对齐 `align-items:center;` 

{%raw%}

<iframe height='265' scrolling='no' title='垂直居中布局' src='//codepen.io/redcorss/embed/mQyGeP/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/mQyGeP/'>垂直居中布局</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

{%endraw%}

## 左中右布局

## position + margin

使用绝对定位，让元素脱离原始的文档流，然后使用 top ，left，right将左右边栏分别固定在左上，右上，中间自适应上浮。注意，中间主面板要使用左右margin，值为左右面板的宽度。

优点是，这种写法不限制 div 的书写顺序，可以先写主面板，让重要内容优先渲染。

{%raw%}

<iframe height='265' scrolling='no' title='position+margin-布局' src='//codepen.io/redcorss/embed/eQmwQM/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/eQmwQM/'>position+margin-布局</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

{%endraw%}



## float + 负margin

下面是传统的使用 float + 负margin的方式来实现的圣杯布局，这几种方式的 HTML 中，都没有考虑主页栏（class=“main"）写在侧边栏前面的问题，这样能让浏览器中主页内容在侧边栏之前加载。

第4个 demo 使用的 父元素左右 margin 替代的父元素左右 padding 

第5个 demo 使用子元素 浮动，主页元素左右margin 自动上浮，缺点是需要将 主页元素写在侧边栏之后，导致页面加载时会先加载侧边栏，后加载主页

{%raw%}

<iframe height='565' scrolling='no' title='float +父padding+ 负margin 圣杯布局' src='//codepen.io/redcorss/embed/EOjXVv/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/EOjXVv/'>float +父padding+ 负margin 圣杯布局</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

{%endraw%}

## 传统圣杯布局

关于圣杯布局的出处可以看 [这里](https://alistapart.com/article/holygrail) 

- 创建HTML，要把中间的div写在左右边栏的前面，让它首先渲染

  ```html
  <div class="container">
      <div class="center"></div>
      <div class="left"></div>
      <div class="right"></div>
  </div>
  ```

- 左右定宽 `width:200px` ，中间100%宽度，三栏同时左浮 `float:left`

- left 元素 `margin-left:-100%` , 上浮到 center 元素的左侧；right 元素 `margin-left:-200px` ，上浮到center元素的右侧，此时center元素的左右两边与 left ，right 元素是发生重叠的

- 父元素container `padding:0 200px;`, left元素 `position:relative;left:200px;` ，right 元素 `position:relative;right:200px`，至此圣杯布局完成

{%raw%}

<iframe height='265' scrolling='no' title='传统圣杯布局' src='//codepen.io/redcorss/embed/KrdKXz/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/KrdKXz/'>传统圣杯布局</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

{%endraw%}

##  Flex 弹性盒子布局

{%raw%}

<iframe height='265' scrolling='no' title='Responsive Holy Grail Layout using FlexBox' src='//codepen.io/redcorss/embed/YRXoKL/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/YRXoKL/'>Responsive Holy Grail Layout using FlexBox</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

{%endraw%}

