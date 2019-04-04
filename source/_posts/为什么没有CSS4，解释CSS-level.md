---
title: 为什么没有CSS4，解释CSS level
type: categories
copyright: true
date: 2019-03-21 01:00:41
tags: [CSS,Layout,CSS布局]
categories: 
- [FE,CSS]
---

原文-- [Where there is no CSS4 - explaining CSS Levels](https://rachelandrew.co.uk/archives/2016/09/13/why-there-is-no-css4-explaining-css-levels/)

​	我们已经有了 CSS1 和 CSS2，我们甚至还有过 CSS2.1，后来我们接着有了 CSS3，CSS3 真的存在吗？这篇文章将会快速介绍当今 CSS 是如何制定版本号的。

<!--more-->

​	CSS 版本 1 和 2 都是属于单体声明。即 CSS 中所有概念都被包含在一个庞大的文档中。Selector，Position，Colour — 全部都在其中。

​	单体声明有一个问题，就是为了结束一个规范的版本，必须要所有的组件都一起完成该版本的修订。但是随着 CSS 的发展变得越来越复杂了，新特性不断添加进来，为了制定一个 CSS 版本而让所有部分都停工作，这样没有任何意义。因此 CSS2.1 之后，就将 2.1 版本规范中的所有部分都被拆分成了模块。旧特性组成的 CSS 模块加上新添加的特性，都将出现在 Level 3 中。于是和我一样将 CSS 理解为一个单体规范的人们就将这一组 Level 3 模块称之为 “CSS3”。

​	然而将所有新的 CSS 特性称之为 CSS3 并没有反映出如今 CSS 的本质。如果你阅读过一些关于 CSS3 选择器的文章，那么你可能知道 CSS3 选择器实际上就是 [CSS Selectors Level 3](https://www.w3.org/TR/css3-selectors/) 规范的一部分。事实上 CSS 选择器是标记为已完成和推荐的规范之一。CSS 工作组目前正在制定 [Selectors Level 4](https://drafts.csswg.org/selectors-4/)，它由一些新提议的特性加上 Level 3（以及 CSS 1 和 2 ）的一部分选择器组成。是 CSS 规范的一小部分。

​	我们已经有一些为特性制定的规范，这些特性不属于 CSS 1 和 2 的一部分，所以这些特性的规范现在就是 Level 1。他们都是全新的。Level 1 的特性规范的例子有[ CSSGrid Layout](https://drafts.csswg.org/css-grid/) and [Flexbox](https://www.w3.org/TR/css-flexbox-1/) 。Flexbox 已经是一个候选推荐（CR，Candidate Recommendation）的规范了，Grid 也已经被投票参选 CR 了。因此从现在起提议的任何新特性都将可能出现在下一个 Level 的规范中 — Flexbox Level 2 和 CSS Grid Level 2。

​	如果你想看看各种 CSS 特性的状态，以及他们当前所在的 level，可以查看 CSS 工作组 [Current Work document](https://www.w3.org/Style/CSS/current-work) 。为了理解一个规范的不同状态，可以看看工作进展文档中  [Maturity Levels](https://www.w3.org/2005/10/Process-20051014/tr#maturity-levels) 上的信息。