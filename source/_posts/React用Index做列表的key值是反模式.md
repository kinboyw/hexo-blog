---
title: React中用Index做列表的key值是反模式
type: categories
copyright: true
date: 2018-11-19 23:22:26
tags: [FE,React]
categories: 
- [FE,React]
---

{%asset_img download.png 600%}

翻译原文：[Index as a key is an anti-pattern](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) 

经常见到程序员用 `index` 作为列表项的 `key` 值传给 React 来渲染列表：

```js
{todos.map((todo, index) =>
  <Todo
    {...todo}
    key={index}
  />
)}
```

这看起来还比较优雅，的确也消除了警告。但是这里有什么危险？

<!--more-->

> 它可能会破坏你的应用，甚至显示错误数据

让我来解释一下， `key` 是 React 用来区分 DOM 元素的唯一标识。如果你在中途向 list 中增加了一个 元素，或者删除了一些东西，会发生什么？如果更新后的 `key` 的值跟之前是一样的，那 React 就会认为这个 `key` 对应的 DOM 元素和之前是一样的。但是实际上不是。



{% asset_img 1.png 600 "Stephen 描述了他在 egghead.io 遇到的问题" %}



为了证明这种潜在的危险，我创建了[一段简单的示例代码](https://codesandbox.io/s/8px1nw4km9?autoresize=1)。

{%raw%}

<iframe src="https://codesandbox.io/embed/8px1nw4km9?autoresize=1&view=preview" style="width:100%; height:600px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

{%endraw%}



结果表名，当没有传 `key` 的时候，React 默认使用 `index` 作为 `key` ，因为此时这是最合适的选择。而且 React 会警告你，这不是最理想的（这个警告说的有点容易让人误解）。如果你提供了 `index` 作为 `key` 值，React 就会认为你知道自己在做什么，想想上面的示例代码，这会导致不可预测的后果。

#### 更好的办法

每一个这样的项目都应该有一个***永恒***的***唯一***的属性。理想情况下，应该在被创建的时候就赋值。当然，我说的是这个 *id*。然后我们就可以像下羡慕这样来用它了：

```js
{todos.map((todo) =>
  <Todo {...todo}
    key={todo.id} />
)}
```

> 注意：首先看看列表项的已有属性。他们很可能已经有一些可以用来当作 *id* 的属性了。

一个办法就是在抽象中用一个递增的数值来代替 *id*。用一个全局的 index 来保证任意两个列表项都有不同的 *id*。 

```js
todoCounter = 1;
function createNewTodo(text) {
  return {
    completed: false,
    id: todoCounter++,
    text
  }
}
```

#### 比更好还要好的办法

在生产环境中应该用一种更具有鲁棒性的方法，要能处理列表项的分布式创建。对这种情况，我推荐使用 [shortid](https://www.npmjs.com/package/shortid) 类库。它可以快速生成 "短小的非序列且 URL 友好的唯一" id。代码如下：

```js
var shortid = require('shortid');
function createNewTodo(text) {
  return {
    completed: false,
    id: shortid.generate(),
    text
  }
}
```

------

> 长话短说：为每一个列表项生成一个唯一 *id*，并在渲染列表的时候将它设置为 key。

------

更新：例外情况

许多人会问他们是否总是需要生成 *id*。还有一些人建议了一些非常适合用 index 来作为 key 的用例。

的确，有的时候生成新的 *id* 是多余的，也可以避免。例如许可条款和贡献者列表的翻译。

为了帮你做决定，我将这些示例共有的三个条件放在一起：

1. 列表和列表项都是静态的-不是计算出来的值，也不会改变；
2. 列表中的列表项没有 id；
3. 列表不可能会创新渲染，也不会发生过滤。

如果满足上面的全部，你就可以安全地用 index 了当 key 值了。

更新2: React，Preact 和 *react

尽管这篇文章写的是关于 React 的，但是这个问题却不局限于 React。在相似的类库中，例如 Preact，也同样存在这中问题。尽管效果可能不同。

------

#### 相关文章

- [Dynamic Children](https://facebook.github.io/react/docs/multiple-components.html#dynamic-children) and [Keyed Fragments](https://facebook.github.io/react/docs/create-fragment.html) in React Docs
- [Explanation from Paul O’Shannessy](https://github.com/facebook/react/issues/1342#issuecomment-39230939)
- [The importance of component keys in React.js](https://coderwall.com/p/jdybeq/the-importance-of-component-keys-in-react-js)
- [React.js and Dynamic Children — Why the Keys are Important](http://blog.arkency.com/2014/10/react-dot-js-and-dynamic-children-why-the-keys-are-important/)
- [React animations for a single component](http://unitstep.net/blog/2015/03/03/using-react-animations-to-transition-between-ui-states/), section *The key is using key*
- [Why you need keys for collections in React](https://paulgray.net/keys-in-react/) by [Paul Gray](https://medium.com/@pfgray)