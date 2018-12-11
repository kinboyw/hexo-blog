---
title: Emmet Cheat Sheet
type: categories
copyright: true
date: 2018-10-28 17:20:42
tags: [FE,Emmet]
categories: 
- [FE,Emmet]
---

{%asset_img emmet.gif%}

​	之前一直手敲HTML标签😅，最近知道了 Emmet 这个神奇的东西，可以用短短一行代码生成复杂的树结构，同时绑定属性，还具有自动编号等强大功能。于是上官网把 Cheat Sheet 都手敲了一遍，然后记录一下，添加了一些注解，方便自己记忆查阅，[原文](https://docs.emmet.io/cheat-sheet/)。

<!--more-->

### Child: >

nav>ul>li

```html
<nav>
    <ul>
        <li></li>
    </ul>
</nav>
```

### Sibling: +

div+p+bq

```html
<div></div>
<p></p>
<blockquote></blockquote>
```

### Climb-up: ^

div+div>p>span+em^bq

```html
<div></div>
<div>
    <p><span></span><em></em></p>
    <blockquote></blockquote>
</div>
```

div+div>p>span+em^^bq

```html
<div></div>
<div>
    <p><span></span><em></em></p>
</div>
<blockquote></blockquote>
```

### Grouping: ()

div>(header>ul>li\*2>a)+footer>p

```html
<div> 
    <header>
        <ul>
            <li><a href=""></a></li>
            <li><a href=""></a></li>
        </ul>
    </header>
    <footer>
        <p></p>
    </footer>
</div>
```

(div>dl>(dt+dd)*3)+footer>p

```html
<div>
    <dl>
        <dt></dt>
        <dd></dd>
        <dt></dt>
        <dd></dd>
        <dt></dt>
        <dd></dd>
    </dl>
</div>
<footer>
    <p></p>
</footer>
```

### Multiplication: *

ul>li*5

```html
<ul>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
</ul>
```

`li*2` 会使 **同一分组下** 之后的元素分别 `*2` ，例如 `li*2>a+span` 生成的html是这样的

```html
 <li><a href=""></a><span></span></li>
 <li><a href=""></a><span></span></li>
```

### Item numbering: $

ul>li.item$*5		编号

```html
<ul>
    <li class="item1"></li>
    <li class="item2"></li>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
</ul>
```

h$[title=item$]{Header $}*3	任意位置都可以写

```html
<h1 title="item1">Header 1</h1>
<h2 title="item2">Header 2</h2>
<h3 title="item3">Header 3</h3>
```

ul>li.item$$$*5	多位数编号

```html
<ul>
    <li class="item001"></li>
    <li class="item002"></li>
    <li class="item003"></li>
    <li class="item004"></li>
    <li class="item005"></li>
</ul>
```

ul>li.item$@-*5		倒序

```html
<ul>
    <li class="item5"></li>
    <li class="item4"></li>
    <li class="item3"></li>
    <li class="item2"></li>
    <li class="item1"></li>
</ul>
```

ul>li.item$@3*5		从指定数值开始编号

```html
<ul>
    <li class="item3"></li>
    <li class="item4"></li>
    <li class="item5"></li>
    <li class="item6"></li>
    <li class="item7"></li>
</ul>
ID and CL
```

### ID and CLASS attributes

#header

```html
<div id="header"></div>
```

.title

```html
<div class="title"></div>
```

form#search.wide

```html
<form id="search" class="wide"></form>
```

p.class1.class2.class3

```html
<p class="class1 class2 class3"></p>
```

### Custom attributes	自定义属性

p[title="Hello World"]		属性值可以不加引号，但是如果包含空格，则要加上，否则，World 会被当作另一个属性名称

```html
<p title="Hello world"></p>
```

td[rowspan=2 colspan=3 title]

```html
<td rowspan="2" colspan="3" title=""></td>
```

[a='value1' b='value2'] 	自定义属性，属性值可以不加引号

```html
<div a="value1" b="value2"></div>
```

### Text: {}	插入文本内容

a{Click me}

```html
<a href="">Click me</a>
```

p>{Click }+a{here}+{ to continue}	等效于 p{Click}>a{here}+{to continue}

```html
<p>Click <a href="">here</a> to continue</p>
```

### Implicit tag names 隐式标签

声明一个带class的div 可以不用输入div；
`.header+.footer` 则生成:

```html
<div class="header"></div>
<div class="footer"></div>
```

Emmet 还会根据父标签进行判定
例如输入`ul>.item*3` 则生成：

```html
<ul>
   <li class="item"></li>
   <li class="item"></li>
   <li class="item"></li>
</ul>
```

下面是所有的隐式标签名称：

- li：用于 ul 和 ol 中
- tr：用于 table、tbody、thead 和 tfoot 中
- td：用于 tr 中
- option：用于 select 和 optgroup 中

