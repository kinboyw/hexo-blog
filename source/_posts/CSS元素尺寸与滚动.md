---
title: CSS元素尺寸与滚动
type: categories
copyright: true
date: 2018-12-02 00:20:04
tags: [FE,CSS]
categories: 
- [FE,CSS]
---

原文：[Element size and scrolling](http://javascript.info/size-and-scroll) 

{%asset_img metric-all@2x.png  600%}

我们可以从很多 JavaScript 属性中得到关于元素宽度，高度和几何特性的信息。

当在 JavaScript 中移动或者定位元素时，我们需要这些信息来计算坐标。

<!--more-->

## 示例元素

我们将用会用下面的示例元素来演示这些属性：

```html
<div id="example">
  ...Text...
</div>
<style>
  #example {
    width: 300px;
    height: 200px;
    border: 25px solid #E8C48F;
    padding: 20px;
    overflow: auto;
  }
</style>
```

示例元素包含了 border，padding以及 scrolling。全套特性。这里没有 margin ，因为 margin 并不属于元素本身的一部分，对元素来说也不是特殊的属性。

这个元素长这样：

{%asset_img metric-css@2x.png  600%}

你可以 [在sandbox中打开文档](http://plnkr.co/edit/mqrTzVMfm5Qk7eaaENTH?p=preview)。

> 注意滚动条
>
> 上面这幅图展示了当元素包含一个滚动条时的最复杂的情况。一些浏览器（并不是所有）通过占据元素的空间来为滚动条保留空间。
>
> 所以，有滚动条的情况下，内容宽度是 `300px`，但是如果滚动条是 `16px` 宽（宽度可能会因浏览器或者设备而不同）则内容宽度就只会剩 `300-16 = 284px` ，我们应该考虑滚动条的宽度。这就是为什么这个示例中会包含一个滚动条。如果没有滚动条，事情就会简单一些了。

> `padding-bottom` 可能会填充文字
>
> 通常情况下 padding 在插图中显示的是空白的，但是如果元素中存在大量文字，并且溢出了，浏览器就会在 `padding-bottom` 中显示溢出的文字，于是你就可以看到了。但是 padding 仍然存在于那里的，除非有其他指定。 

## 几何

提供宽度，高度以及其几何性质的元素属性的值都是数字。一般认为他们的单位是像素。

这里是整体的图片：

{%asset_img metric-all@2x.png  600%}

这里有很多属性，很难将它们展示在同一张图片中，但是他们的值很简单，也很容易理解。

我们从外向内来探索它们。

## offsetParent, offsetLeft/Top

这些属性很少需要用到，但是他们是最外层的几何属性，所以我们从它们开始说。

`offsetParent` 是距离最近的一个满足下述条件的祖先元素：

1. 具有 CSS 定位（`position` 为 `absolute`， `relative`， `fixed` 或者 `sticky`），
2. 或者 `<td>`， `<th>`， `<table>`，
3. 或者 `<body>`。

在大多数实际情况下，我们可以使用 `offsetParent` 来得到最近的 `CSS 定位的` 祖先元素。并且 `offsetLeft / offsetTop` 提供了相对于它的左上角的 x / y 坐标。

在下面的例子中，内部的 `<div>` 有一个 `<main>` 作为 `offsetParent` ， 并且 `offsetLeft / offsetTop` 从它的左上角移开了（`180`像素）:

```markup
<main style="position: relative" id="main">
  <article>
    <div id="example" style="position: absolute; left: 180px; top: 180px">...</div>
  </article>
</main>
<script>
  alert(example.offsetParent.id); // main
  alert(example.offsetLeft); // 180 (note: a number, not a string "180px")
  alert(example.offsetTop); // 180
</script>
```

{%asset_img metric-offset-parent@2x.png  600%}

有几种情况下 `offsetParent` 为 `null` ：

1. 对于未显示的元素（`display:none` 或者不在文档中）。
2. 对于 `<body>` 和 `<html>` 元素。
3. 对于 `position:fixed` 的元素。

## [offsetWidth/Height](http://javascript.info/size-and-scroll#offsetwidth-height)

 现在我们来看看元素本身。

这两个属性是最简单的。它们提供了元素的`外部` width/height。或者，换句话说，包含 border 的完整尺寸。

{%asset_img metric-offset-width-height@2x.png  600%}

对于我们的示例元素：

- `offsetWidth = 390` – 外部宽度，可以计算为内部宽度（`300px`） + padding（`2*20px`）+ border （`2*25px`）。
- `offsetHeight = 290` – 外部高度。

未显示的几何属性的值为 0/null

几何属性只计算已显示的元素。

如果一个元素（或者它的任意祖先）有 `display:none` 或者不在文档中，则所有几何属性都是 0 或者 `null`，0 或者 `null` 取决于这个属性是什么。

例如，`offsetParent` 是 `null` ，`offsetWidth` ，`offsetHeight` 是 `0`。 

我们可以用这个来检查一个元素是否隐藏，像这样：

```javascript
function isHidden(elem) {
  return !elem.offsetWidth && !elem.offsetHeight;
}
```

请注意，这个 `isHidden` 对于没有显示在屏幕上，但是大小为 0 的元素（例如一个空的 `<div>`）返回 `true` 。

## [clientTop/Left](http://javascript.info/size-and-scroll#clienttop-left)

在这个元素内部，我们有 border 属性。

有 `clientTop` 和 `clientLeft` 属性可以用来测量它们。

在我们的示例中：

- `clientLeft = 25` – 左边框宽度

- `clientTop = 25` – 上边框宽度

{%asset_img metric-client-left-top@2x.png  600%}

但是确切地说，它们并不是 border ，只是内侧于外侧的相对坐标。

有什么区别？

当文档是从右指至左（操作系统时阿拉伯语或者希伯来语）时可见。滚动条将不会出现在右侧，而是在左侧，`clientLeft` 也包括了滚动条宽度。

在这种情况下， `clientLeft` 就不是 `25` 而是加上滚动条的宽度 `25+16=41`： 

{%asset_img metric-client-left-top-rtl@2x.png  600%}



## clientWidth/Height

这些属性提供了元素边界内部区域的尺寸。

它们包括了内容宽度，也包括了 padding ，但是不包括滚动条宽度：

{%asset_img metric-client-width-height@2x.png  600%}

在上面的图中，我们先看看 `clientHeight`：很容易计算。这里没有横向滚动条，所以就是边界内部各种长度的综合：CSS 高度 `200px` + top 和 bottom padding （2*20px），总共是 `240px`。 

现在计算 `clientWidth` ，内容宽度不是 `300px`，而是 `284px`，`16px` 被滚动条占用了。所以 `284px` + 左右 padding ，总共是 `324px`。

**如果没有 `padding` ，那么 clientWidth / Height 就直接是边界内部的内容区域和滚动条（如果存在）的宽度/高度。**

{%asset_img metric-client-width-nopadding@2x.png %}

所以当不存在 padding 时，我们可以用 `clientWidth / clientHeight` 来得到内容区域的大小。

## scrollWidth/Height

- 属性 `clientWidth / clientHeight` 只对元素的可视部分有效。
- 元素 `scrollWidth / scrollHeight` 也包括了滚出（隐藏）的部分：

{%asset_img metric-scroll-width-height@2x.png 600%}

在上面的图中：

- `scrollHeight = 723` – 是整个内容区域包括滚出部分的内部高度。
- `scrollWidth = 324` – 是整个内部宽度，这里我们没有横向滚动条，所以它就等于 `clientWidth`。

我们可以用这些属性来将元素宽度扩展为整个的宽度/高度。

像这样:

```javascript
// 将元素扩展到整个内容的宽度
element.style.height = `${element.scrollHeight}px`;
```

点击按钮来展开元素：

{%raw%}

<div id="element" style="width: 300px; height: 300px; margin:0 auto; padding: 0px; overflow: auto; border: 1px solid black;">text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text text</div><p style="margin:0 auto;text-align:center;"><button style="padding:0" onclick="element.style.height = `${element.scrollHeight}px`">element.style.height = </button><code>${element.scrollHeight}px</code></p>

{%endraw%}

## [scrollLeft/scrollTop](http://javascript.info/size-and-scroll#scrollleft-scrolltop)

属性 `scrollLeft / scrollTop` 是元素中隐藏的，滚出部分的 width/height。

在下面的图片中，我们可以看到一个具有垂直滚动条的块的 `scrollHeight` 和 `scrollTop` 。

{%asset_img metric-scroll-top@2x.png 600%}

换句话说，`scrollTop` 其实是 `向上滚动了多少`。

> `scrollLeft/scrollTop` 可以被修改。
>
> 大多数几何属性都是只读的，但是 `scrollLeft/scrollTop` 可以被修订，并且浏览器将会滚动元素。
>
> 如果你点击下面的元素，代码 `elem.scrollTop +=10` 会执行。这会使元素内容向下滚动 `10px`。
>
> {%raw%}
>
> <div onclick="this.scrollTop+=10" style="cursor:pointer;border:1px solid black;width:100px;height:80px;overflow:auto">Click<br>Me<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9</div>
>
> {%endraw%}
>
> 设置 `scrollTop` 为 `0` 或者 `Infinity` 将会分别使元素滚动到 `top/bottom` 的位置。

## 不要用 CSS 取 width/height

我们刚刚讲了 DOM 元素的几何属性。它们通常被用来获取宽度，高度以及计算 距离。

但是我们从 [Style and classes](http://javascript.info/styles-and-classes) 这一章知道了，可以用 `getComputedStyle` 来获取 CSS 的高度和宽度。

所以，为什么不能像这样读取元素的宽度呢？

```javascript
let elem = document.body;

alert( getComputedStyle(elem).width ); // show CSS width for elem
```

为什么我们应该使用几何属性？有两个原因：

1. 首先，CSS 的 `width/height` 决定于另外一个属性：定义了 CSS 的 width 和 height “是什么的”`box-sizing` 。一个出于某种 CSS 目的的对 `box-sizing` 的改动就可能破坏了这段 JavaScript 代码。
2. 第二，CSS `width/height` 可能是 `auto`，例如一个 `inline` 元素：

   ```html
   <span id="elem">Hello!</span>
   
   <script>
     alert( getComputedStyle(elem).width ); // auto
   </script>
   ```

站在 CSS 的角度来看，`width:auto` 是非常正常的，但是在 JavaScript 中我们需要一个可以用来计算的精确的像素尺寸。所以这种情况下 CSS width 一点用处都没有。

也有一些其他的原因：滚动条。有时候代码在没有滚动条的时候工作地很好，出现滚动条时就出问题了，因为滚动条会在一些浏览器中会占据内容的空间。所以内容真正可用的空间比 CSS width 要少。 `clientWidth / clientHeight` 会考虑这一点。

但是对于 `getComputedStyle(elem).width` ，情况就不同了。一些浏览器（例如，Chrome）返回真正的实际的内部宽度，负的滚动条，一些浏览器（例如，火狐）返回 CSS width（忽略滚动条）。这样的跨浏览器差异就是不要使用 `getComputedStyle` ，而是依靠几何属性的原因。

如果你的浏览器保留了滚动条的空间（Windows的大多数浏览器都有），那么你可以在下面测试。



<iframe class="code-result__iframe" data-trusted="1" src="https://en.js.cx/article/size-and-scroll/cssWidthScroll/" style="text-shadow: rgb(153, 153, 153) 0.01em 0.01em 0.01em !important; display: block; border: 0px; width: 798px; height: 300px; margin:0 auto; font-family: 微软雅黑 !important;"></iframe>

这个填充文字的元素有 CSS `width:300px`。

在一个 Windows 桌面操作系统中，Firefox，Chrome，Edge 全部保留了滚动条的空间。但是Firefox 显示 `300px` ，而 Chrome 和 Edge 显示的更少。这是因为 Firefox 返回的是 CSS width，其他浏览器返回的是 `实际` 宽度。

请注意，我们所说的只是关于用 JavaScript 读取 `getComputedStyle(elem).width`的差异 ，视觉上这些都是正确的。

## 总结

元素有下面这些几何属性：

- `offsetParent` – 是距离最近的 `定位` 的祖先，或者 `td`, `th`, `table`, `body`。
- `offsetLeft/offsetTop` – 相对于 `offsetParent` 左上角的坐标。
- `offsetWidth/offsetHeight` – 一个元素包含 border 的“外部” width/height 。
- `clientLeft/clientTop` – 从左上外角到左上内角的距离。对于从左至右的操作系统，它们总是左/上边界的宽度。对于从右至左的操作系统，垂直滚动条在左侧，所以 `clientLeft` 也包含滚动条的宽度。
- `clientWidth/clientHeight` – 内容的 `width/height` ，包括 padding 但是不包括滚动条。
- `scrollWidth/scrollHeight` – 内容的 `width/height` 包括滚出去的部分。也包括 padding 但是不包括滚动条。
- `scrollLeft/scrollTop` – 元素滚出部分的 `width/heigh`  ，从左上角开始。

All properties are read-only except `scrollLeft/scrollTop`. They make the browser scroll the element if changed.

所有属性都是只读的，除了 `scrollLeft/scrollTop`。如果发生改变，会让浏览器滚动元素。

## 任务

### 底部滚动距离是多少？

难度: 5

`elem.scrollTop` 属性是滚出部分的大小。如何得到 “`scrollBottom` ” — 也就是到底部的距离？

写出对任意一个元素 `elem` 有效的代码。

P.S. 请检查代码：如果元素没有滚动，或者滚到底了，就要返回 `0`。

> 答案:
>
> ```javascript
> let scrollBottom = elem.scrollHeight - elem.scrollTop - elem.clientHeight;
> ```
>
> 也就是: (全部高度) - (滚出的顶部高度) - (可见部分) – 这就是底部滚出距离。

### 滚动条宽度是多少？

难度: 3

写代码，返回滚动条宽度：

对于 Windows 操作系统，这个值在 `12px` 和 `20px` 之间。如果浏览器不保留滚动条宽度，就可能是 `0px`。 

P.S. 代码应该对任何 HTML 文档有效，不取决于内容。

> 为了得到滚动条宽度，我们可以创建一个元素，有滚动条，但是没有 border 和 padding 。
>
> 全宽 `offsetWidth` 和内容区域的宽度 `clientWidth` 之差就是滚动条的宽度了：
>
> ```js
> // create a div with the scroll
> let div = document.createElement('div');
> 
> div.style.overflowY = 'scroll';
> div.style.width = '50px';
> div.style.height = '50px';
> 
> // must put it in the document, otherwise sizes will be 0
> document.body.append(div);
> let scrollWidth = div.offsetWidth - div.clientWidth;
> 
> div.remove();
> 
> alert(scrollWidth);
> ```



### 将球放到草坪中间

难度: 5

这是原始文档的样子：

<iframe class="code-result__iframe" data-trusted="1" src="https://en.js.cx/task/put-ball-in-center/source/" style="text-shadow: rgb(153, 153, 153) 0.01em 0.01em 0.01em !important; display: block; border: 0px; width: 798px; height: 180px; font-family: 微软雅黑 !important;"></iframe>

草坪中心的坐标是多少？

计算中心坐标，然后将球放到草坪中心:

<iframe class="code-result__iframe" data-trusted="1" src="https://en.js.cx/task/put-ball-in-center/solution/" style="text-shadow: rgb(153, 153, 153) 0.01em 0.01em 0.01em !important; display: block; border: 0px; width: 798px; height: 180px; font-family: 微软雅黑 !important;"></iframe>

- 元素应该用 JavaScript 移动， 而不是 CSS。
- 代码应该适用于任意大小的球（`10`， `20`， `30` 像素），任意大小的草坪，不应该只是给定的值。

P.S. 当然，居中可以用 CSS 实现，但是这里我们只想用 JavaScript 。以后我们将会碰到其他的话题和更复杂的情况只能用 JavaScript。这里我们只是一个“热身”。

[在sandbox中查看任务](http://plnkr.co/edit/qTjKtFDHyRUVAD2DINIp?p=preview)

> 这个球有 `position:absolute` ，意味着它的 `left/top` 坐标是相对于最近的定位祖先元素，那就是`#草坪` （因为它有 `position:relative`）。
>
> 坐标从草坪内部的左上角开始：
>
> 草坪内部的 width/height 是 `clientWidth/clientHeight`所以草坪中心坐标是 `(clientWidth/2, clientHeight/2)`。 
>
> …但是如果我们设置 `ball.style.left/top` 为这样的值，那么并不是整个球，而是这个球的左上边缘在中间了:
>
> ```javascript
> ball.style.left = Math.round(field.clientWidth / 2) + 'px';
> ball.style.top = Math.round(field.clientHeight / 2) + 'px';
> ```
>
> 这是它的样子
>
> <iframe class="code-result__iframe" data-trusted="1" src="https://en.js.cx/task/put-ball-in-center/ball-half/" style="text-shadow: rgb(153, 153, 153) 0.01em 0.01em 0.01em !important; display: block; border: 0px; width: 732px; height: 180px; font-family: 微软雅黑 !important;"></iframe>
>
> To align the ball center with the center of the field, we should move the ball to the half of its width to the left and to the half of its height to the top:
>
> 为了让球在草坪上居中，我们应该将球左移自身宽度的一半，再上移自身宽度的一半：
>
> ```javascript
> ball.style.left = Math.round(field.clientWidth / 2 - ball.offsetWidth / 2) + 'px';
> ball.style.top = Math.round(field.clientHeight / 2 - ball.offsetHeight / 2) + 'px';
> ```
>
> **注意：陷阱！**
>
> 当 `<img>` 没有 width/height 时这段代码不可用：
>
> ```markup
> <img src="ball.png" id="ball">
> ```
>
> 当浏览器不知道图片的 width/height 时（根据元素属性或者CSS），那么它会假设它们等于 `0` 直到图片完成加载。
>
> 在实际情况下，浏览器初次加载时常常会缓存图片，下次加载时它会立刻得到大小。
>
> 但是第一次加载时 `ball.offsetWidth` 的值时 `0` 。这会导致错误的坐标。
>
> We should fix that by adding `width/height` to `<img>`:
>
> 我们应该通过给 `<img>` 添加 `width/height` 来解决:
>
> ```html
> <img src="ball.png" width="40" height="40" id="ball">
> ```
>
> …或者在 CSS 中提供大小：
>
> ```css
> #ball {
>   width: 40px;
>   height: 40px;
> }
> ```
>
> [在sandbox中查看答案](http://plnkr.co/edit/ntDEboGZLc2BgZ4DfiSE?p=preview)

### 对比: CSS width VS clientWidth

难度: 5

`getComputedStyle(elem).width` 和`elem.clientWidth`有什么不同？

给出至少 3 个差异。越多越好。

> 差异:
>
> 1. `clientWidth`是数值，而`getComputedStyle(elem).width` 返回一个以 `px` 结尾的字符串。
> 2. `getComputedStyle` 可能对内联元素返回非数字，像 `"auto"`。
> 3. `clientWidth` 是元素内部的内容区域加上内边距，而 CSS width (在标准 `box-sizing`下) 是内部内容区域 *不包含内边距*。 
> 4. 如果存在滚动条，并且浏览器保留了滚动条的空间，一些浏览器从 CSS width 减去滚动条宽度（导致内容宽度 受到影响），一些浏览器不会这样做。`clientWidth` 属性总是一致的：滚动条大小被减去了，如果保留了的话。