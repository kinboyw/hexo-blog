---
title: CSS Positioning
type: categories
copyright: true
date: 2018-10-30 21:04:41
tags: [FE,CSS,Element-Position]
categories: 
- [FE,CSS]
---

## 1. position:static

*`position:static`* 是所有元素的默认定位，就是说元素没有定位，出现在文档中通常的位置。

一般情况下你不用去指定它，除非你需要用它来覆盖前面的定位设置。

```css
#div-1 {
 position:static;
}
```

<div style="max-width:500px;margin:auto">{% asset_img 1540906650237.png %}</div>

<!--more-->

如果指定了 *`position:relative`*，你就可以使用 *`top`* 或者 *`bottom`* , *`left`* 或者 *`right`* 来将元素移动到一个相对于它原来在文档中位置的新的位置。

我们来将 `div-1` 向下移动 20 像素，向左移动 40 像素：

```css
#div-1 {
 position:relative;
 top:20px;
 left:-40px;
}
```

注意 `div-1` 移动前应该在的位置，现在是空的了。当我们移动 `div-1` 时， 紧挨着的元素（`div-after`）并没有随之移动。那是因为 `div-1` 即使我们移动了 `div-1` ，它实际上仍然占据着文档中原来的位置。

看上去似乎 *`position:relative`* 不是很有用，但是在后面的教程中，它会扮演一个重要的角色。

<div style="max-width:500px;margin:auto"> {% asset_img 1540906757448.png %} </div> 

## 3. position:absolute

当你指定了 *`position:absolute`*, 元素会从当前文档（流）中移除，并且重新被放置到你指定的位置。

让我们移动 `div-1` 到页面的右上角：

```css
#div-1a {
 position:absolute;
 top:0;
 right:0;
 width:200px;
}
```

这次要注意，因为 `idv-1a` 从当前文档（流）中被移除了，所以页面上其他元素的定位也因此发生了变化：`div-1b`，`div-1c`，和 `div-after` 都向上移动了，因为 `div-1a` 已经不在那里了。

也要注意 `div-1a` 定位到了页面的右上角。虽然能够直接在页面上定位元素很不错，但是这样做的用处也很有限。

我真正需要的是让 `div-1a` 相对于 `div-1` 定位。这里就需要相对定位的加入了。

**备注：** 

- 在Windows 的 IE 浏览器中有一个 bug ：如果你指定一个相对宽度（例如，"width:50%"），那么这个宽度将会是基于父元素的，而不是发生定位的元素。

<div style="max-width:500px;margin:auto">{% asset_img 1540908103862.png %}</div>

## 4. position:relative + position:absolute

如果我们在 `div-1` 上面设置了 `relative` 定位，那么 `div-1` 内部的任何元素的定位都将是相对与 `div-1` 的。如果我们在 `div-1a` 上设置了绝对定位，那么我们就可以将 `div-1a` 移动到 `div-1` 的右上角去了。

```css
#div-1 {
 position:relative;
}
#div-1a {
 position:absolute;
 top:0;
 right:0;
 width:200px;
}
```

<div style="max-width:500px;margin:auto">{% asset_img 1540906940147.png %} </div>

## 5. two column absolute

现在我们可以用相对定位和绝对定位来制作两栏布局（两列布局）了！

```css
#div-1 {
 position:relative;
}
#div-1a {
 position:absolute;
 top:0;
 right:0;
 width:200px;
}
#div-1b {
 position:absolute;
 top:0;
 left:0;
 width:200px;
}
```

使用绝对定位的一个优点就是，我们可以将元素以任意顺序定位在页面上，不用管他们出现在 HTML 中的顺序。所以我将 `div-1b` 放在了 `div-1a` 的前面了。

不过等等 - 其他元素都到哪里去了？他们被绝对定位的元素遮住了。

<div style="max-width:500px;margin:auto">{% asset_img 1540907034419.png%}</div>

## 6. two column absolute height

一个解决办法是给被遮盖的元素一个固定的高度。

但是在多数设计中这种方案是不可行的，因为我们通常并不知道被隐藏的元素中将会有多少文字，也不知道这些文字确切的字体大小。

```css
#div-1 {
 position:relative;
 height:250px;
}
#div-1a {
 position:absolute;
 top:0;
 right:0;
 width:200px;
}
#div-1b {
 position:absolute;
 top:0;
 left:0;
 width:200px;
}
```

<div style="max-width:500px;margin:auto">{% asset_img 1540907383394.png %}</div>

## 7. float

对于可变高度的列，绝对定位不起作用，所以我们来尝试另一种解决办法。

我们可以让元素 **“浮动”** ，将它推到尽可能左或者右的位置，并允许文字环绕它。这种浮动通常是用于图片元素的，但是我们将它用于更加复杂的布局任务（因为这是我们唯一可用的工具）。 

```css
#div-1a {
 float:left;
 width:200px;
}
```

<div style="max-width:500px;margin:auto">{% asset_img 1540907469705.png %}</div>

## 8. float columns

如果浮动一列到左侧，另一列也浮动到左侧，他们会尽可能并排浮动到顶端。

```css
#div-1a {
 float:left;
 width:150px;
}
#div-1b {
 float:left;
 width:150px;
}
```

<div style="max-width:500px;margin:auto">{% asset_img 1540907560108.png %}</div>

## 9. float columns with clear

然后在浮动元素的后面，我们可以 **“清除”** 浮动效果，来将余下的内容按住，不让他们浮上来。

```css
#div-1a {
 float:left;
 width:190px;
}
#div-1b {
 float:left;
 width:190px;
}
#div-1c {
 clear:both;
}
```

<div style="max-width:500px;margin:auto">{% asset_img 1540907630263.png %}</div>

## 10. 免责声明

这些示例都及其简单，旨在简单实现效果以介绍几个定位的功能，并不会触发一些 Windows IE 浏览器中的 CSS bug（实际上有很多）。

