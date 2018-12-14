---
title: JavaScript原型图解
type: categories
copyright: true
date: 2018-12-13 21:53:05
tags:
categories:
---

总结：JavaScript 原型是每个 JavaScript 开发者必须理解的最重要的概念之一。这篇文章将会帮助你扫清关于原型的所有疑惑。

要看懂本文，需要理解 JavaScript 对象。如果你还不熟悉 JavaScript 对象，就看看这篇[理解 JavaScript 对象](https://kinboy.wang/2018/12/12/%E7%90%86%E8%A7%A3JavaScript%E5%AF%B9%E8%B1%A1/) 。

## 介绍 JavaScript 原型

JavaScript 引擎默认提供了 `Object()` 构造函数和一个可以被 `Object.prototype` 引用到的匿名对象。

```js
console.log(Object);
console.log(Object.prototype);
```

`Object.prototype` 对象有许多内置属性，例如 `toString()` ，`valueOf()`等等。也有一个名为 `constructor` 的属性，它指向 `Object()` 构造函数。

```JS
console.log(Object.prototype.constructor === Object); // true
```

假设原型代表一个函数，方块代表一个对象。下面的图形就描绘出了 `Object()` 函数和 `Object.prototype` 对象之间的关系：

{%asset_img JavaScript-Prototype-300x109.png 300%}

首先，我们定义一个名为 `Foo` 的函数如下：

```js
function Foo(name) {    
    this.name = name;
}
```

`Foo()` 函数接收一个参数，添加 `name` 属性到对象中，并设置 `name` 属性的值为传入的参数。

在这个情景的背后，JavaScript 引擎创建了一个函数 `Foo()` 和一个匿名对象。这个 `Foo()` 函数有一个名为 `prototype` 的属性指向这个匿名对象。这个匿名对象也有一个 `constructor` 属性指向这个 `Foo()` 函数。

另外，`Foo.prototype` 对象通过 `[[Prototype]]` 连接到 `Object.prototype` ，这就是我们知道的原型链接。原型链接由下图中的 `[[Prototype]]` 表示。

{%asset_img JavaScript-Prototype-Function-defined.png 600%}

第二步，添加一个名为 `whoAmI()` 的方法到这个 `Foo.prototype` 对象。

```js
Foo.prototype.whoAmI = function() {    
    return "I am " + this.name;
}
```

{%asset_img JavaScript-Prototype-Function.png 600%}

第三步，创建一个 `Foo` 对象的实例。

```js
var a = new Foo('a');
```

JavaScript 引擎在内部创建了一个新的对象，名为 `a` ，并通过原型链接将 `a` 对象连接到了 `Foo.prototype` 对象。

{%asset_img JavaScript-Prototype-New-Object.png 600%}

对象 `a`，`Foo.prototype`，和 `Object.prototype` 之间的连接就叫作原型链。

第四步，创建 `Foo` 对象的另一个实例 `b`。 

```js
var b = new Foo('b');
```

{%asset_img JavaScript-Prototype-second-object.png 600%}

第步，在 b 对象中添加一个 `say()` 方法。

```js
b.say = function() {   
    console.log('Hi from ' + this.whoAmI());
}
```

JavaScript 引擎在 `b` 对象中添加 `say()` 方法，而不是 `Foo.prototype` 对象。

{%asset_img JavaScript-Prototype-add-method-to-object.png 600%}

现在看看下面的代码。

```js
console.log(a.constructor); // Foo
```

对象 `a` 没有 `constructor` 属性，所以 JavaScript 引擎会沿原型链向上查找。因为 `a` 对象通过原型链接连接到了 `Foo.prototype`， 并且 `Foo.prototype` 有 `constructor` 属性，JavaScript 引擎会返回 `Foo`。所以下面的 表达式结果为 `true`。 

```js
console.log(a.constructor === Foo); // true
```

## 获取原型链接  

`__proto__` 是 `Object.prototype` 对象的一个访问器属性。它暴露了一个对象内部的原型链接（`[[Prototype]]`），同时也是通过原型链接被访问的。

`__proto__` 在 ES6 中被标准化，为了浏览器的兼容性。然而未来可能会被废除以支持 `Object.getPrototypeOf()` 。所以，一定不能在生产代码中使用 `__proto__`。 

你可以在前面的图标中看到，`a.__proto__` 暴露了指向 `Foo.prototype` 的 `[[Prototype]]` 。相似的，`b.__proto__` 也指向了和 `a.__proto__` 相同的对象：

```js
console.log(a.proto === Foo.prototype); // true
console.log(a.proto === b.proto); // true
```

前面提到过，你应该使用 `Object.getPrototypeOf()` 方法而不是 `__proto__` 。`Object.getPrototypeOf()` 方法返回一个指定对象的原型。

```js
console.log(a.proto === Object.getPrototypeOf(a)); // true
```

在 `Object.getPrototypeOf()` 方法还不能用的时候，程序员经常使用的另一种获得原型链接的方法是通过 `constructor` 属性，如下：

```js
a.constructor.prototype
```

`a.constructor` 返回 `Foo`，所以 `a.constructor.prototype`返回原型对象。 

## 影子

看看下面的方法调用。

```js
console.log(a.whoAmI()); // I am a
```

`a` 对象没有 `whoAmI()` 方法，所以当 这个方法被从 `a` 调用时， JavaScript 引擎会沿着原型链向上查找，直到找到它。这样一来，就在 `Foo.prototype` 对象中发现并执行了这个调用。

我们在 `a` 对象中添加一个新的方法，和 `Foo.prototype` 对象中的方法名字相同。

```js
a.whoAmI = function() {
    console.log('This is ' + this.name);
}
```

然后调用这个 `whoAmI` 方法：

```js
console.log(a.whoAmI()); // This is a
```

因为我们在 `a` 对象中有 `whoAmI()` 方法了， JavaScript 引擎不会在原型链中查找，而是立即执行调用。

这是一个关于 `影子` 的示例。`a` 对象的 `whoAmI()` 方法隐藏了 `a` 连接到的原型对象上的 `whoAmI()` 方法。 

现在你就拦截了关于 JavaScript 原型的所有重要概念，包括 原型链，原型链接，__proto__，以及影子。