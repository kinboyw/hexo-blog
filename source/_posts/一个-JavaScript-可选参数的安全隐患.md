---
title: 一个 JavaScript 可选参数的安全隐患
date: 2018-10-19 01:33:37
copyright: true
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---



<div style="max-width:400px;margin:auto">{% asset_img tags-lead.png %}</div>

<div style="max-width: 400px; margin: auto"> {%asset_img download.png%} </div>

​	这显然是个棘手的问题，可能大多数程序员会认为这个表达式会返回一个类似  `[1，2，3]` 的数组，如果你在浏览器中输入上面的表达式回车后，就会看到实际返回的是 `[1, NaN, NaN]` 。

​	解释如下，`parseInt` 作为 `JavaScript` 的内置函数，试图将一个字符串转换为数值，并返回该数值。所以，一个这样的调用：

```js
const n = parseInt('123');
```

​	应该将数值 `123` 赋给变量 `n`。

​	你应该知道，当遇到字符串无法转换为数值的时候，`parseInt` 方法会返回 `NaN` ，`NaN` 是 `Not a Number` 的缩写，通常意味着出现了某种数值计算错误。所以，一个这样的表达式：

```js
const x = parseInt('xyz');
```

​	会将 `NaN` 赋值给变量 `x`。

<!--more-->

​	`map` 是 `ECMAScript5` 中的内置函数，许多浏览器中都已支持。`map` 以一个 function 对象作为参数，遍历整个数组，并对每一个数组元素调用该参数 function，将元素作为参数传入该 function。然后将这些 function 调用的返回值组成一个新的数组返回。参考下面的例子

```js
[1，2，3].map(function(value) {return value + 1});
```

​	这个表达式执行后会返回一个值为 `[2，3，4]` 的数组。最常见的是传递一个诸如此类的函数表达式或者 `lambda` 表达式给 `map` ，但是传递一个已有的函数对象 `parseInt` 也是有效的。

​	了解了 `parseInt` 和 `map` 的基本概念后，文章开头的表达式就很好理解了，它试图将一个数值字符串的数组转换为一个包含了每个字符串对应数值的数组。为什么不成功呢？为了找到答案，我们就要继续深入了解一下 `parseInt` 和 `map` 的定义了。

​	看看 [parseInt 的定义](http://es5.github.io/#x15.1.2.2) ，你会注意到它接收两个参数。第一个参数是要被转换的字符串，第二个参数是要被转换成的数值的基数，所以 `parseInt('ffff',16)`会返回 65535 ，然而 `parseInt('ffff',8)` 就会返回 `NaN`。因为 `ffff` 不能转换为一个八进制数。如果第二个参数缺失或者为 `0` ，那么默认值将是 `10` ，所以 `parseInt('12',10)` ，`parseInt('12',0)` 以及 `parseInt('12')` 都会返回数值 `12`。

​	现在仔细看看  [map 方法的声明 ](http://es5.github.com/#x15.4.4.19) 。它指出 `callbackfn` 是第一个作为参数传入 `map` 的 function ，定义中说 **“the *callbackfn* is called with *three* arguments: the value of the element, the index of the element, and the object that is being traversed.” **  （使用三个参数调用 callbackfn 函数：元素值，元素索引，和被遍历的对象）。仔细阅读这句话。它的意思是，并不是像下面这样调用了三次 `parseInt`：

```js
parseInt("1")
parseInt("2")
parseInt("3")
```

​	我们实际上是有三次这样的调用：

```js
parseInt('1', 0, theArray);
parseInt('2', 1, theArray);
parseInt('3', 2, theArray);
```

​	上面的 `theArray` 就是原始数组 `['1','2','3']` 。

​	JavaScript 方法通常会忽略多余的参数，而 `parseInt` 函数只需要两个参数，所以我们不必担心上面这些调用中的 `theArray` 参数。但是第二个参数呢？第一个调用的第二个参数是 `0` ，我们已知这里默认基数是 10，所以 `parseInt('1',0)` 会返回 1。第二次调用传入 `1` 作为基数参数。定义中非常清晰的说明了这种情况会发生什么。如果基数非零且小于2，则方法直接返回 `NaN` 甚至不用读取字符串。

​	第三次调用传入了 `2` 作为基数。这意味着带转换的字符串应该是仅由数字字符 `"0"` 和 `"1"` 组成的二进制数。 `parseInt` 的定义中（第11步）说，它只转换字符串中第一个不是传入基数的有效数字的字符左侧的子字符串。第三次调用中的第一个字符串是 `"3"` ，不是以数字 2 为基数的有效数字，所以要转换的子字符串是一个空字符串。步骤12说到，如果子字符串是空字符串，方法将返回 `NaN` 。所以三次调用的返回结果是 `1`，`NaN` 和 `NaN`。

​	使用原始表达式的程序员可能会在两个方面犯错。第一个可能的地方是他们可能忘记了或者从来不知道 `parseInt` 接收可选的第二个参数。第二个可能的地方是他们可能忘记或者从不知道 `map` 调用 *callbackfn* 有三个参数。最可能的是这两种情况都占了。 `parseInt` 最常见的用法只取第一个参数，而绝大多数情况下传给 `map` 的方法也只使用第一个参数，所以这两种情况下都很容易忘记可能存在可选参数。

​	有一个直接的方法是重写原始的表达式来避免错误：

```js
['1','2','3'].map(function(value) {return parseInt(value)})
```

​	而不是直接使用：

```js
['1','2','3'].map(parseInt)
```

​	这样明确的定义了 *callbackfn* 只取一个参数，并且很清晰地只用一个参数调用 `parseInt` 函数。但是这样也使得代码更加冗长，少了些优雅。

​	我继续在推特上搜索了这个问题，有一些扩展 JavaScript 来避免此问题或者至少让代码更加简介的方法。

​	[Angus Croll (@angusTweets)](http://twitter.com/#!/angusTweets/status/35774944293953537) 建议用 `Number` 构造函数而不是 `parseInt` 作为 *callbackfn* 能解决此问题。用这种方式调用 `Number`  也能将字符串转换为 `decimal` 数值，而且它只需要一个参数。

​	[@__DavidFlanagan](http://twitter.com/#!/__DavidFlanagan/status/35769732795736064) 建议新增一个 `mapValues` 方法来解决此问题，这个方法只传一个参数给 *callbackfn* 。然而 ECMAScript 5 有 7 种不同的 Array 方法，其操作方式与 `map` 类似，所以我们就真的不得不新增 7 个这种方法。

​	我认为新增下面这样的方法也是一种解决的办法：

```js
Function.prototype.only = function(numberOfArgs){
    var self = this; //原始方法
    return function(){
        return self.apply(this,[].slice.call(arguments,0,numerOfArgs))
    }
}
```

​	这是一个高阶函数，以一个函数作为参数，返回一个新的函数，返回的新函数调用原始函数，并且只使用指定数量的参数。使用 `only`，原始表达式可以写成这样：

```js
['1','2','3'].map(parseInt.only(1));
```

​	这样只是略显冗长，并且保留了一定程度的优雅。

​	这个问题引发了关于 JavaScript *curry function* （柯里化函数，真正意义上的  [partial function application](http://en.wikipedia.org/wiki/Partial_application) ——部分函数应用，或偏函数应用，或散函数应用）的讨论。`部分函数应用` 取一个需要特定数量参数的函数，产生一个新的需要更少参数的函数。我的 `only` 函数就是一个实现了 `部分函数应用` 的函数示例。ES5中新增的 `Function.prototype.bind` 方法也是。JavaScript 需要这样的方法吗？例如，一个 固定最右侧参数而不是最左侧参数的`bindRight` 方法。也许可以，但是参数数量允许可变时，最右究竟有什么意义呢？可能一个取参数位置的 `bindRight` 方法可能更适合 JavaScript。

​	然而，所有这些关于扩展的讨论已经偏离了原始问题的关键问题。为了使用他们任意一个，你必须首先知道 `map` 和 `parseInt` 的可选参数不匹配。如果你知道了这个问题，那么有很多中方式来解决问题。如果你还不知道，那么上面推荐的任何一种解决方案都没有帮助。这似乎主要是一个 API 设计问题，并提出了一些关于在 JavaScript 中适当使用可选参数的基本问题。

​	一个用例是从调用这的角度来看可选参数，另一个用例是从被调用者的角度来看。在 `parseInt` 的情况下，它的设计假设调用者知道它正在调用 `parseInt` 并且已经适当的选择了实际的参数值。从调用者的角度来看，第二个参数是可选的。如果它想要使用默认的基数，就可以换略第二个参数。但是 `parseInt` 的实际规范中详细定义了使用一个或两个参数以及各种参数值调用时，被调用者将执行的操作。

​	另一个用例更多来自不同类型的函数调用者。一个调用者，它不知道它实际调用了什么函数，并且总是传递一个固定大小的参数。`map` 的规范中明确定义了它将总是传递三个参数给它提供的任何 *callbackfn* 。因为调用者并不真正知道被调用者的身份，以及被调用者需要什么信息，`map` 将所有可用的信息作为参数传递。假设实际的被调用者将忽略任何它不需要的参数。在这个用例中，从被调用者的角度来看，第二个和第三个参数是可选的。

​	这两个都是有效的可选参数用例，但是当我们将两者结合起来的时候，我们就得到一个软件 “impedance mismatch”（阻抗失配）。被调用者的可选参数很少与调用者的可选参数匹配。`bind` 或者 `only` 这样的高阶函数可以被用来解决这样的失配，但是前提是程序员意识到了失配的存在。 JavaScript API 的设计者需要记住这一点，每个 JavaScript 程序员都要格外小心，了解究竟什么值被传递给了回调函数。