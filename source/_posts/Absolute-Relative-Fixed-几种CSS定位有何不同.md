---
title: 'Absolute, Relative, Fixed ,几种CSS定位有何不同'
type: categories
copyright: true
date: 2018-10-30 23:31:39
tags: [FE,CS]
categories: 
- [FE,CSS]
---

​	{% asset_img position.jpg 400 "理解 CSS 定位原理" %}

​	首先要理解的一个非常重要的概念就是，页面上的每一个元素都是一个块（block）。字面意思是一个像素矩形。如果你将元素设置为 `display:block;` 或者这个元素本身默认的就是 `display:block;` ；这意味着你可以设置一个元素的宽高，这个元素也会遵循它。但是那些默认是 `display:inline;` 的元素，就像默认情况下的，也是矩形，他们只是用不同的方式流入页面，**尽可能的横向排列**。

<!--more-->

​	既然你现在可以将每个页面元素都视作一个像素块了，我们就可以聊一聊如何使用元素定位来将这些像素块放置到页面上我们指定的位置。这里我们将不会对盒模型进行任何讨论，但是它在这里确实会有影响…

- **Static** ：这是每一个页面元素的默认设置。不同类型的元素的默认定位都是 `static` 。`Static` 没有别的意思，它就是说这个元素会流到页面上它本应该在的位置。你将元素设置为 `position:static;` 的唯一理由就是强制清除元素上在其他地方应用的定位设置。这种情况极少，因为定位属性不会继承。

- **Relative** ：这种定位类型可能是最容易混淆和用错的。它真正的意思是“相对自身”。如果你在一个元素上设置了 `position:relative;` 但是没有设置其他定位属性（top，left，bottom，或者right），就完全不会影响这个元素的定位，它会保持在原地，就像设置为 `position:absolute;` 一样。但是如果你的确设置了一些其他的定位属性，假如说， `top:10px;` ,它会从自己当前的位置向下移动 10 像素。我确定你能想象，能够基于常规位置移动一个元素非常有用。我自己经常用这中方式来排列那些没有按照我希望的方式排列的表单元素。 

  当你在一个元素上设置 `position:relative;` 的时候需要注意另外两件事。一个是相对定位引入了在这个元素上使用 `z-index` 的能力，即元素使用相对定位，且 `z-index` 的值不等于 auto 的时候 会创建一个新的 `层叠上下文`（[stacking context）](https://developer.mozilla.org/en/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context)

   ，这在绝对定位的元素上是并不真正起作用的。甚至如果你没有设置一个 `z-index` 的值，这个元素也会出现在其他决定对位元素的顶层。另一件事是 **相对定位限制了绝对定位子元素的作用范围** 。任何相对定位元素的子元素都可以绝对定位在该块的内部。这带来了一些强大的功能，我在[这里说过](https://css-tricks.com/absolute-positioning-inside-relative-positioning/)。 

  {%raw%}

  <iframe height='265' scrolling='no' title='Relative positioning' src='//codepen.io/redcorss/embed/rQaNvK/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width:100%'>See the Pen <a href='https://codepen.io/redcorss/pen/rQaNvK/'>Relative positioning</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>


  {%endraw%}

- **Absolute**：这是一种非常强大的定位类型，允许你直白地将任何页面元素放置到你想要的位置。使用 top，left，bottom，和 right 来设定位置。记住，这些值是相对于最近的一个具有相对（或者绝对）定位的父元素。如果没有这样的父元素，它就会默认的找到最外层的 `<html>` 元素，就是说相对于整个网页移动。

  使用绝对定位需要权衡（也是需要记住的最重要的）的地方是这些元素会从页面的文档流中被移除，于是后续元素会自然地尽可能向上浮动。一个具有绝对定位的元素不受其他元素影响，也不会影响其他元素。这是一个你每次使用绝对定位时都要认真思考的问题。滥用和错误地使用绝对定位都会限制你的网站的灵活性

  {%raw%}

  <iframe height='265' scrolling='no' title='Absolute positioning' src='//codepen.io/redcorss/embed/qQEBKw/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width:100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/qQEBKw/'>Absolute positioning</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
  </iframe>


  {%endraw%}

- **Fixed**：这种定位非常少见，但是也有它的作用。固定定位元素是相对于视口（*viewport*） ，或者浏览器窗口的。当窗口滚动时视口不会改变，所以当页面滚动时固定定位元素会保持在原位置，制造出一种过去老套的 “帧” 一样的效果。这种定位的优点是，可以用它来实现导航栏，页面滚动时，导航栏固定定位，始终停留在当前视口中，不会移出视线。缺点是，这种效果对设备的兼容性较差，在小屏幕的笔记本，平板或者手机上，侧边导航栏的内容可能会被截断，影响使用。总而言之，这是一个很酷的效果，有它的用处，但是使用时需要充分测试。

{%raw%}

<iframe height='265' scrolling='no' title='Fixed positioning' src='//codepen.io/redcorss/embed/KrwKxy/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width:100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/KrwKxy/'>Fixed positioning</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>




{%endraw%}

- **Sticky**：目前是实验属性，粘性定位可以被认为是 Relative 定位与 Fixed 定位的混合体。粘性定位在给定的阈值范围内都是被当成一个相对定位元素对待，直到移动出了父元素边界就变成一个固定定位元素了。

{%raw%}

<iframe height='265' scrolling='no' title='Sticky positioning' src='//codepen.io/redcorss/embed/bQNGzW/?height=265&theme-id=0&default-tab=result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width:100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/bQNGzW/'>Sticky positioning</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


{%endraw%}