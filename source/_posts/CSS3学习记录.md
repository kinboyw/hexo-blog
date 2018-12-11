---
title: CSS3选择器 Selector Level 3
type: categories
copyright: true
date: 2018-10-27 11:05:10
tags: [FE,CSS]
categories: 
- [FE,CSS]
---



阅读 W3C 2018年9月11日发布的  [Selectors Level 3 ](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#dependencies) 提议的一些翻译和记录，文档中说，这份提议还只是草稿，不属于规范的一部分。

## 概要

​	选择器（[*Selectors*](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#selector) ）是一种用来匹配树节点元素的模式，因此一种可以用来选择XML文档节点的技术。选择器已经针对 HTML  和 XML 进行了优化，旨在用于性能苛刻的代码。

​	CSS (Cascading Style Sheets) 是一种用于描述在显示器、纸张和语音等中渲染和呈现 HTML 和 XML 文 档的语言。CSS 用选择器将样式属性绑定到文档的元素。 

​	在 CSS1 和 CSS2 中已经有了选择器，下面介绍 CSS3 以及其他语言可能需要用到的选择器。

​	选择器定义了下面的方法：

```css
expression * element -> boolean
```

​	就是说，给定一个元素和一个选择器，规范定义改元素是否与选择器匹配。

通过对一个子树中的所有元素进行表达式评估，这些表达式还可以被用于选择一些元素集合，或者从元素集合中选择一个元素。

<!--more-->

## 介绍

一级选择器（Selector Level 1）和二级选择器（Selector Level 2）已经分别被定义为 CSS1 和 CSS2.1规范中定义的选择器功能的子集。

## 相对 CSS2 的变化

- 一些基本的定义（selector，group of selector,simple selector等）发生了变化；尤其是，在 CSS2 中的简单选择器现在称为简单选择器序列（sequence of simple selectors）,术语“简单选择器” 现在被用于该序列的组件。
- 可选的命名空间组件现在可以被用于元素类型选择器，通用选择器和属性选择器。
- 引入了新的[组合器](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#general-sibling-combinators)——后续兄弟组合（Subsequent-sibling combinator）
- 新的简单选择器，包括子串匹配属性选择器（substring matching attribute）和新的伪类（pseudo-classes）
- 新的伪元素，以及伪元素的 “::” 约定的引入。
- 语法被重写
- 选择器现在是 CSS3 的模块，有独立的声明，其他选择器可以独立于 CSS 参考本选择器的文档。

## 选择器（Selector）

下面是选择器语法的总结

| Pattern                  | Represents                                                   | Description                                                  | Level   |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------- |
| *                        | any element                                                  | [Universal selector](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#universal-selector) | 2       |
| E                        | an element of type E                                         | [Type selector](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#type-selectors) | 1       |
| E[foo]                   | an E element with a "foo" attribute                          | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 2       |
| E[foo="bar"]             | an E element whose "foo" attribute value is exactly equal to "bar" | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 2       |
| E[foo~="bar"]            | an E element whose "foo" attribute value is a list of whitespace-separated values, one of which is exactly equal to "bar" | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 2       |
| E[foo^="bar"]            | an E element whose "foo" attribute value begins exactly with the string "bar" | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 3       |
| E[foo$="bar"]            | an E element whose "foo" attribute value ends exactly with the string "bar" | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 3       |
| E[foo*="bar"]            | an E element whose "foo" attribute value contains the substring "bar" | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 3       |
| E[foo\|="en"]            | an E element whose "foo" attribute has a hyphen-separated list of values beginning (from the left) with "en" | [Attribute selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#attribute-selectors) | 2       |
| E:root                   | an E element, root of the document                           | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:nth-child(n)           | an E element, the n-th child of its parent                   | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:nth-last-child(n)      | an E element, the n-th child of its parent, counting from the last one | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:nth-of-type(n)         | an E element, the n-th sibling of its type                   | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:nth-last-of-type(n)    | an E element, the n-th sibling of its type, counting from the last one | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:first-child            | an E element, first child of its parent                      | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 2       |
| E:last-child             | an E element, last child of its parent                       | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:first-of-type          | an E element, first sibling of its type                      | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:last-of-type           | an E element, last sibling of its type                       | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:only-child             | an E element, only child of its parent                       | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:only-of-type           | an E element, only sibling of its type                       | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:empty                  | an E element that has no children (including text nodes)     | [Structural pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#structural-pseudos) | 3       |
| E:link E:visited         | an E element being the source anchor of a hyperlink of which the target is not yet visited (:link) or already visited (:visited) | [The link pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#link) | 1       |
| E:active E:hover E:focus | an E element during certain user actions                     | [The user action pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#useraction-pseudos) | 1 and 2 |
| E:target                 | an E element being the target of the referring URI           | [The target pseudo-class](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#target-pseudo) | 3       |
| E:lang(fr)               | an element of type E in language "fr" (the document language specifies how language is determined) | [The :lang() pseudo-class](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#lang-pseudo) | 2       |
| E:enabled E:disabled     | a user interface element E which is enabled or disabled      | [The UI element states pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#UIstates) | 3       |
| E:checked                | a user interface element E which is checked (for instance a radio-button or checkbox) | [The UI element states pseudo-classes](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#UIstates) | 3       |
| E::first-line            | the first formatted line of an E element                     | [The ::first-line pseudo-element](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#first-line) | 1       |
| E::first-letter          | the first formatted letter of an E element                   | [The ::first-letter pseudo-element](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#first-letter) | 1       |
| E::before                | generated content before an E element                        | [The ::before pseudo-element](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#gen-content) | 2       |
| E::after                 | generated content after an E element                         | [The ::after pseudo-element](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#gen-content) | 2       |
| E.warning                | an E element whose class is "warning" (the document language specifies how class is determined). | [Class selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#class-html) | 1       |
| E#myid                   | an E element with ID equal to "myid".                        | [ID selectors](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#id-selectors) | 1       |
| E:not(s)                 | an E element that does not match simple selector s           | [Negation pseudo-class](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#negation) | 3       |
| E F                      | an F element descendant of an E element                      | [Descendant combinator](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#descendant-combinators) | 1       |
| E > F                    | an F element child of an E element                           | [Child combinator](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#child-combinators) | 2       |
| E + F                    | an F element immediately preceded by an E element            | [Next-sibling combinator](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#adjacent-sibling-combinators) | 2       |
| E ~ F                    | an F element preceded by an E element                        | [Subsequent-sibling combinator](https://www.w3.org/TR/2018/PR-selectors-3-20180911/#general-sibling-combinators) | 3       |

## 区分大小写

所有的选择器语法都是在 ASCII 范围内且大小不写敏感的（例如 [a-z] 和 [A-Z]是等同的），除了不受选择器控制的部分。在选择器中的文档语言元素名称，属性名称和属性值的是否区分大小写要取决于文档语言本身。例如，在 HTML 中，元素名是大小写敏感的，但是 XML 中区分大小写。