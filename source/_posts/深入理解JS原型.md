---
title: 深入理解JS原型
type: categories
copyright: true
date: 2019-02-27 00:53:39
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

本文不会过多介绍基础知识，而是把重点放在原型的各个难点上。

![](https://camo.githubusercontent.com/71cab2efcf6fb8401a2f0ef49443dd94bffc1373/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f332f31332f313632316538613962636230383732643f773d34383826683d35393026663d706e6726733d313531373232)

大家可以先仔细分析下该图，然后让我们进入主题

<!--more-->

## `prototype`
首先来介绍下 `prototype` 属性。这是一个显式原型属性，只有函数才拥有该属性。基本上所有函数都有这个属性，但是也有一个例外

```js
let fun = Function.prototype.bind()
```

如果你以上述方法创建一个函数，那么可以发现这个函数是不具有 `prototype ` 属性的。

#### prototype 如何产生的
当我们声明一个函数时，这个属性就被自动创建了。

```js
function Foo() {}
```

并且这个属性的值是一个对象（也就是原型），只有一个属性 `constructor`

![](https://camo.githubusercontent.com/6f4c44c54637dd87a083a6eced805595b6e3735e/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f332f31332f313632316561336462373063656430613f773d33303426683d383626663d706e6726733d3131313931)

`constructor` 对应着构造函数，也就是 `Foo`。

#### constructor
`constructor` 是一个公有且不可枚举的属性。一旦我们改变了函数的 `prototype` ，那么新对象就没有这个属性了（当然可以通过原型链取到 `constructor`）。

![](https://camo.githubusercontent.com/82e7d4306abd33940c2485c31a5eb91eb5a488bc/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f332f31332f313632316561613735306338373761653f773d34303826683d32303426663d706e6726733d3237333130)

那么你肯定也有一个疑问，这个属性到底有什么用呢？其实这个属性可以说是一个历史遗留问题，在大部分情况下是没用的，在我的理解里，我认为他有两个作用：

* 让实例对象知道是什么函数构造了它
* 如果想给某些类库中的构造函数增加一些自定义的方法，就可以通过 `xx.constructor.method` 来扩展

## `_proto_`
这是每个对象都有的隐式原型属性，指向了创建该对象的构造函数的原型。其实这个属性指向了 [[prototype]]，但是 [[prototype]] 是内部属性，我们并不能访问到，所以使用 `_proto_` 来访问。

因为在 JS 中是没有类的概念的，为了实现类似继承的方式，通过 `_proto_ ` 将对象和原型联系起来组成原型链，得以让对象可以访问到不属于自己的属性。

#### 实例对象的 `_proto_` 如何产生的
从上图可知，当我们使用 `new` 操作符时，生成的实例对象拥有了 `_proto_`属性。

```js
function Foo() {}
// 这个函数是 Function 的实例对象
// function 就是一个语法糖
// 内部调用了 new Function(...)
```

所以可以说，在 `new` 的过程中，新对象被添加了 `_proto_` 并且链接到构造函数的原型上。

#### new 的过程
1. 新生成了一个对象
2. 链接到原型
3. 绑定 this
4. 返回新对象

在调用 `new` 的过程中会发生以上四件事情，我们也可以试着来自己实现一个 `new`

```js
function create() {
    // 创建一个空的对象
    let obj = new Object()
    // 获得构造函数
    let Con = [].shift.call(arguments)
    // 链接到原型
	obj.__proto__ = Con.prototype
    // 绑定 this，执行构造函数
    let result = Con.apply(obj, arguments)
    // 确保 new 出来的是个对象
    return typeof result === 'object' ? result : obj
}
```

对于实例对象来说，都是通过 `new` 产生的，无论是 `function Foo()` 还是 `let a = { b : 1 }` 。

对于创建一个对象来说，更推荐使用字面量的方式创建对象。因为你使用 `new Object()` 的方式创建对象需要通过作用域链一层层找到 `Object`，但是你使用字面量的方式就没这个问题。

```js
function Foo() {}
// function 就是个语法糖
// 内部等同于 new Function()
let a = { b: 1 }
// 这个字面量内部也是使用了 new Object()
```

## Function.**proto** === Function.prototype
对于对象来说，`xx.__proto__.contrcutor` 是该对象的构造函数，但是在图中我们可以发现 `Function.__proto__ === Function.prototype`，难道这代表着 `Function` 自己产生了自己?

答案肯定是否认的，要说明这个问题我们先从 `Object` 说起。

从图中我们可以发现，所有对象都可以通过原型链最终找到 `Object.prototype` ，虽然 `Object.prototype` 也是一个对象，但是这个对象却不是 `Object` 创造的，而是引擎自己创建了 `Object.prototype` 。**所以可以这样说，所有实例都是对象，但是对象不一定都是实例。**

接下来我们来看 `Function.prototype` 这个特殊的对象，如果你在浏览器将这个对象打印出来，会发现这个对象其实是一个函数。

![](https://camo.githubusercontent.com/d72d59bb822b24a67742c8c1f7fdbe0faad7c23c/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f332f31342f313632323234353137666264343064633f773d34393426683d31313626663d706e6726733d3138363334)

我们知道函数都是通过 `new Function()` 生成的，难道 `Function.prototype` 也是通过 `new Function()` 产生的吗？答案也是否定的，这个函数也是引擎自己创建的。首先引擎创建了 `Object.prototype` ，然后创建了 `Function.prototype` ，并且通过 `__proto__` 将两者联系了起来。这里也很好的解释了上面的一个问题，为什么 `let fun = Function.prototype.bind()` 没有 `prototype` 属性。因为 `Function.prototype` 是引擎创建出来的对象，引擎认为不需要给这个对象添加 `prototype` 属性。

**所以我们又可以得出一个结论，不是所有函数都是 `new Function()` 产生的。**

有了 `Function.prototype` 以后才有了 `function Function()` ，然后其他的构造函数都是 `function Function()` 生成的。

现在可以来解释 `Function.__proto__ === Function.prototype` 这个问题了。因为先有的 `Function.prototype` 以后才有的 `function Function()` ，所以也就不存在鸡生蛋蛋生鸡的悖论问题了。对于为什么 `Function.__proto__` 会等于 `Function.prototype` ，个人的理解是：其他所有的构造函数都可以通过原型链找到 `Function.prototype` ，并且 `function Function()` 本质也是一个函数，为了不产生混乱就将 `function Function()` 的 `__proto__` 联系到了 `Function.prototype` 上。

## 总结
* `Object` 是所有对象的爸爸，所有对象都可以通过 `__proto__` 找到它
* `Function` 是所有函数的爸爸，所有函数都可以通过 `__proto__` 找到它
* `Function.prototype` 和 `Object.prototype` 是两个特殊的对象，他们由引擎来创建
* 除了以上两个特殊对象，其他对象都是通过构造器 `new` 出来的
* 函数的 `prototype` 是一个对象，也就是原型
* 对象的 `__proto__` 指向原型， `__proto__` 将对象和原型连接起来组成了原型链