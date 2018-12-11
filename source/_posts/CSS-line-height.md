---
title: CSS line-height
type: categories
copyright: true
date: 2018-11-02 23:42:10
tags: [FE,CSS]
categories: 
- [FE,CSS]
---

​	认识 line-height 之前，我们需要先了解一些 CSS 中与排版有关的概念。

​	 `leading` ，这个概念，对应中文的意思应该是“行距”，即排版中相邻两行之间的距离。lead有铅块的意思，在过去手工排版的时代，人们会向模板中插入细铅条来增加类型线之间的距离。现代排版中，leading 的确切定义已经混淆，大致分为两种：1.其一是指相邻两行 baseline （基线）之间的距离；2.其二是指上面一行的底部至下面一行的顶部的距离；其实两种表示的结果一致，但一般使用前者居多。

{% asset_img Line_spacing_comparison.svg 600  "不同线间距与字体高度的比较，许多字体处理器中，单个行间距自动设置为115%或者1.15em"%}

 `baseline`， 基线，在一开始学习英语的时候，我们会在四线格子中练习英文字母的书写。一般把英文字母纵向等分四线三格，第三条线称为基线，如下图：

{% asset_img leading.jpg 400 "英文 4 格线" %}

<!--more-->

在CSS中，`leading` 指内容高度与 `line-height` 属性值的差异。 leading 的一半叫作 `half- leading` 。用户代理通过向 `inline box` 的顶部和底部各添加一个 half-leading 来让字体垂直居中。例如，如果一个字体是 “12pt” 高，line-height 是 “14pt” ，那么多出来的 2pt 就会被加上：1pt 加到字体顶部，1pt 加到字体底部。（这个特性也适用于空盒子，就像这个空盒子包含了一个高度为零的字听）

> In [CSS](https://en.wikipedia.org/wiki/Cascading_Style_Sheets), leading refers to the difference between the content height and the value of the `line-height` property. Half the leading is called the half-leading. User agents center glyphs vertically in an inline box, which adds half-leading on the top and bottom. For example, if a piece of text is "12pt" high and the line-height value is "14pt", 2pt of extra space should be added: 1pt above and 1pt below the text (this applies to empty boxes as well, as if the empty box contained zero-height text).
>
> ——[维基百科](https://en.wikipedia.org/wiki/Leading) 



MDN 中对 line-height 的解释如下：

> **line-height** [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) 属性用于设置多行元素的空间量，比如文本。对于块级元素，它指定元素行盒（line boxes）的最小高度。对于非[替代](https://developer.mozilla.org/en-US/docs/Web/CSS/Replaced_element)的inline元素，它用于计算行盒（line box）的高度。

​	`line-height` 属性定义了内联元素的顶部和底部的空间量。也就是那些属性为 `display:inline` 或 `dispaly:inline-block` 的元素。它可以接收关键词 `normal` ，`none` 作为属性值，当然也可以接收 数字，长度以及百分比。

{%raw%}

<iframe src="https://interactive-examples.mdn.mozilla.net/pages/css/line-height.html" height="350" class="interactive" frameborder="0" width="100%"></iframe>

{%endraw%}

​	根据规范，`normal` 的值并不是直接应用于元素的一个具体的值，而是根据元素设置（或继承） 的字体大小计算出的 `合理的` 值，取决于客户端代理中元素应用的`font-family`  ，桌面浏览器（包括Firefox）默认值**大约为1.2**。

> ​	在 Chrome 调试工具中查看元素的行号的计算值，只能看到我们设置的 `normal` ，并不能直接看出实际行高，我们可以在 Firefox 浏览器下使用同样的方式查看，Firefox 浏览器会显示出计算出的实际行高的像素值。

​	长度可以是任何有效的 CSS 长度单位（px，em，rem等）。

​	百分比是指，用字体大小乘以这个百分比值，例如：

{%raw%}

<iframe height='265' scrolling='no' title='JejRVW' src='//codepen.io/redcorss/embed/JejRVW/?height=265&theme-id=0&default-tab=html,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/redcorss/pen/JejRVW/'>JejRVW</a> by RedCorss (<a href='https://codepen.io/redcorss'>@redcorss</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


{%endraw%}

​	在上面的例子中，四段文字的 line-height 分别设置为 150%，200%，250%，normal。字体大小都是 20px。最终计算出来的行高就分别是 30px，40px，50px，normal最终的计算行高与 font-family，font-size，浏览器甚至操作系统有关，而不是一个确切的数值。

​	规范推荐用无单位数字作为 line-height 的值。无单位数字可以是任意数字，包括 decimal 类型。

​	推荐无单位数字行高，是因为子元素会继承无单位数字行高，而不是行高的计算值，这样子元素可以根据自己计算出的字体大小来计算出适合自己的行高，而不是直接从父元素继承一个固定的行高。

