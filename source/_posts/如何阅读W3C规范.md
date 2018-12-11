---
title: 如何阅读W3C规范
type: categories
copyright: true
date: 2018-10-29 09:02:43
tags: [FE,W3C]
categories: 
- [FE,W3C]
---

<div style="max-width: 400px; margin: auto">{% asset_img w3c.jpg %}</div>

[如何阅读W3C规范](https://alistapart.com/article/readspec)？

​	看到这样一篇文章，作者是 [J. David Eisenberg](https://alistapart.com/author/j.davideisenberg) ，于 2001年9月28日发表于 [CSS](https://alistapart.com/topic/css), [HTML](https://alistapart.com/topic/html)。 

​	[J. David Eisenberg](mailto:catcode@catcode.com) 是一位程序员兼教师，和他的猫, Marco Polo 和 Big Tony一起生活在 San Jose, CA 。写过一本关于 [Scalable Vector Graphics（SVG）](http://www.oreilly.com/catalog/svgess/)的书。对 [OpenDocument Format](http://books.evc-cit.info/blog) 和 [学外语](http://langintro.com/)感兴趣。

​	我将主题内容及要点翻译并罗列如下，原文请看 [How to Read W3C Specs](https://alistapart.com/article/readspec)。 

​	World Wide Web Consoritium（W3C）是所有网络技术规范的守护者。作为 web 设计者，你应该访问过他们的网站([w3.org](http://www.w3.org/)) 来寻找关于 XHTML 的问题的答案，或者关于一些更新的技术，例如 XSL Formatting Objects 或者 Scalable Vector Graphics。（文章发表时间较早，HTML5 还没诞生）

​	你跑去看规范，然后立刻陷入混乱，说：“这根本没法看！”。实际上，它是可读的，只要你理解了一点关键信息

<!--more-->

### 规范不是用户手册

> The Bible was not meant to be read, but interpreted.
>
> ——*attribution unknown*

​	当你寻找答案的时候，你其实需要的是用户手册或者指南，你想使用这项技术。而这并不是 W3C 规范的目的。“spec” 的目的是告诉那些要实现这个规范的程序员，必须要有哪些特性，以及如何实现这些特性。

​	当你在使用最新的技术时，可能没有任何用户参考手册；唯一可用的文档就是技术规范。在这样的情况下，学习阅读规范就是很有必要的，而不是一个奢侈的事情了。

### 规范的结构

​	大部分规范都有一个描述文档自身的章节。例如 [HTML](http://www.w3.org/TR/html401/about.html) 和  [CSS](http://www.w3.org/TR/REC-CSS2/about.html) 规范的第一节就是告诉你规范的各个部分是如何组织的，以及如何正确阅读规范。

### 基本概念

> I hate definitions.
>
> ——*Benjamin Disraeli*

W3C 规范是用日本歌舞伎剧中的仪式化形式编写的，当你阅读规范时，你将会遇到这些词语

- normative

  “this section is normative” 意味着你将阅读的内容是实现者应该遵循的细节，这部分一般会包含示例和解释。

- user agent

  一般是指用户用于访问该技术的程序的代名词。对于 HTML 来说，user agent 就是指浏览器；对 Scalable Vector Graphics（SVG）来说，它可能是像  [Batik](http://xml.apache.org/batik/) 这样的程序 或者 [Adobe’s SVG viewer ](http://www.adobe.com/svg/)这样的插件。

- RFC

  **R**equest **F**or **C**omment, 一个代表了互联网标准的文档。

- *helping verbs*

  如果一个规范说它遵循了  [RFC2119](http://www.ietf.org/rfc/rfc2119.txt) ，则某些助动词就具有正式的含义。`must` 表示定义是绝对的要求，`must not` 表示定义是绝对的禁止，`should` 表示一项特性可以实现也可以不实现，但是如果你不实现它，最好要有充分的理由， `should not` 意味着如果你要加入一个特性，最好要有充分的理由。

### 略读

> Dear Aunt Martha: Thank you for the book on elephants. It told me more about elephants than I wanted to know.
>
> ——*A child’s thank-you letter*

​	不必仔细阅读规范的每一个单词，如果你发现自己处于一个完全没有任何术语索引标签的区域，又看起来像法律文书或者计算机科学文章一样，那么就简单瞥一眼就够了。

​	比如像下面的 XLS:FO 规范这些部分就完全是可以跳过的。（实际上，作为一个用户来说，这个规范真正需要仔细阅读的部分在第六章之前都不会到来。）

> **4.2.5 Stacking Constraints**: This section defines the notion of block-stacking constraints and inline-stacking constraints involving areas. These are defined as ordered relations, i.e., if A and B have a stacking constraint it does not necessarily mean that… *Hey! Are you ready to skim yet?!*

​	另一方面，有些地方你应该慢下来认真看。如果你看到插图，要看一下标签或者标注。他们通常会提到重要的信息，如果看到带有示例的部分，也要放慢节奏仔细阅读。

### 命名空间

​	在 XML 术语中，**命名空间** 使用来将不同标记语言混合在文档中的机制。例如我想在 HTML 文档中引入 数学标记语言（Math Markup Language），我就必须在文档的顶部元素中放入额外的声明，然后在数学元素前面添加 `ml:` 前缀

> Here is Einstein’s famous equation, E = MC2, with which we *all* are familiar.

​	最好遵循你在示例中看到的任何命名空间前缀。大部分情况下，如果你遇到了一个关于某项 XML 技术是 “命名空间感知” 的大篇幅讨论，你可以安全地跳过了。

### 学会阅读 BNF

​	BNF 代表 **B**ackus **N**aur **F**orm, 或者 **B**ackus **N**ormal **F**orm。它是一种表达计算机语言语法的紧凑方式，一直存在，并将永远存在。不同的声明使用不同风格的 BNF, 但是他们都会将冗长的英语描述翻译成符号格式。以三明治的构成为例：

> A sandwich consists of a lower slice of bread, mustard or mayonnaise; optional lettuce, an optional slice of tomato; two to four slices of either bologna, salami, or ham (in any combination); one or more slices of cheese, and a top slice of bread.

<div style="max-width:500px;margin:auto">{% asset_img 1540907630263.png %}</div>

> sandwich ::=    lower_slice     [ mustard | mayonnaise ]    lettuce? tomato?    [ bologna | salami | ham ] {2,4}    cheese+    top_slice

​	定义的的组成部分都是顺序排列，空格分隔的。方括号表示分组，分组内的选项用竖线分隔。

​	如果一个项目后面跟着一个问号（？），表示“一个或者没有”；如果后面跟着加号（+），表示“一个或者多个”；如果后面是星号（*），表示“零个或者多个”；如果后面跟着大括号内的数字，它就给出了这个项目可以出现的最少和最多的次数限制。

​	括弧或者多组方括号用来将更加复杂的定义中的项目分组。有时候通用项目（例如“color”）包含在 `<` 和 `>` 中，或者固定项目将包含在引号中。

### 学会阅读文档类型定义

> The Grolier Encyclopedia® is the source authority for all answers and questions asked on Jeopardy®.
>
> ——*Credit on TV game show*

​	我们一般会在文档中添加 `<!DOCTYPE …>` 标签声明来告诉浏览器你用的是 HTML 或者 XHTML 的哪个版本。这些声明就是文档类型声明（Document Type Definition），或者 DTD，定义了文档中合法的元素组合。

​	阅读 DTD 是比较难的，但也不是不可能。并且它是值得一读的，因为 DTD 是判断在特定的标记语言中语法正确性的最高权威。

​	关于如何阅读 DTD 文档的完整解释不在本文范围内，但是可以在[Elizabeth Castro](http://www.cookwood.com/) 的 [XML for the World Wide Web](http://www.amazon.com/exec/obidos/ASIN/0201710986/jeffreyzeldmanprA/) 视觉快速入门指南，或者 Erik Ray的 [Learning XML](http://www.amazon.com/exec/obidos/ASIN/0596000464/jeffreyzeldmanprA/) 中读到。这里有一些你可能在 DTD 中看到的简短示例：

```
<!ENTITY %fontstyle "(tt | i | b)"> 
<!ENTITY %inline "(#PCDATA | %fontstyle;)"> 
<!ELEMENT div (p | %inline;)+> 
<!ATTLIST div align (left | right | center) #IMPLIED>
```

这里是他们的英文解释：

> The font style elements are `<code>`, `<i>`, and `<b>`.  Inline elements consist of text or font style elements.  A `<div>` can contain one or more `<p>` or inline elements in any order.  A `<div>` has an optional `align` attribute with values of `left`, `right`, or `center`.

### IDLE PAST IDL, BE BOUND BY BINDINGS

​	一些 XML 技术，例如 SVN 和 SMIL ，允许用户编写程序来动态控制文档，就像 JavaScript 让你可以控制 HTML 文档一样。他们的规范中会有一些章节描述脚本是如何与 Document Object Model 工作的。这部分用 **IDL** 来描述接口，**I**nterface **D**efinition **L**anguage。 

​	IDL 是一类通用符号，用于描述用户代理用来访问编程环境的信息，即描述软件编程接口（API）的语言。IDL 不是一种编程语言；它是用一种紧凑的方式来描述接口的符号系统。IDL 接口定义很可能不是你要找的东西。

​	你需要的东西，决定于你选择的编程语言，是 Java *binding* 还是 ECMAScript *bindings* 。

​	Bindings 是脚本中可用的对象，属性，和方法列表的奇特的术语。ECMAScript 是 European Computer Manufacturer's Association standard version of JavaScript。

​	如果你使用的是一些其他的像 Perl 或者 Python 这样的语言，你就要去其他地方看看相关的资料，例如 [Comprehensive Perl Archive Network](http://cpan.org/) 或者 [Python XML Special Interest Group](http://www.python.org/sigs/xml-sig/).

### 总结

1. 理解 W3C 规范是写给实现者的，而不是用户。
2. 许多规范都有一个章节会告诉你规范是如何组织的，以及你应该如何阅读
3. 了解规范使用的词汇表
4. 记住你不必读懂每一个单词，跳过那些读不通的部分
5. 避开关于命名空间的讨论
6. 学会阅读 BNF——它在许多地方用到
7. 学会阅读 DTD来解答语法问题
8. 如果技术是可以编写脚本的，则信息在 binding 中。

只要耐心和坚持，你就会惊讶与你可以从 W3C 规范中获得的信息量。



### 作者的其他文章

- [Using XML](https://alistapart.com/article/usingxml)
- [Get Ready for HTML 5](https://alistapart.com/article/get-ready-for-html-5)
- [“Forgiving” Browsers Considered Harmful](https://alistapart.com/article/forgiving)
- [DOM Design Tricks](https://alistapart.com/article/dom2)