---
title: 探索 JavaScript For-in 循环
date: 2018-7-14 19:23:42
tags: FE;javascript
---

For-in 循环是对象属性迭代技术中唯一一项可以跨浏览器的。 关于使用 `for-in` 循环迭代数组的危险性以及何时使用 `hasOwnPropert` 过滤器的文章有很多，但是美中不足的是，关于这些普遍使用的语言结构的文章又出奇的不完整。本文尝试着填补一些空白，希望能对读者有所帮助。

## 基础
ES 5 规范详细说明了 `for-in` 语句的两种不同的语法：

### 1. for (var variable in objectExpression) {statement}

第一种是我们熟悉的格式。等号右边的 `objectExpression` 可以是任意可计算为 JavaScript 对象的表达式。如果我们在等号右边给定了原始类型，那么它将会被包装成对象。然后逐一迭代包装对象的属性。在每一次迭代中，对象属性的名称将被赋值给声明的迭代变量，如果存在表达式，会对表达式进行计算。

``` javascript
var myObj = {a: 1, b: 2, c: 3}, myKeys = [];
for (var property in myObj) {
    myKeys.push(property);
}
myKeys; //['a','b','c'];
```

<!--more-->

循环变量可以选择在 `for-in` 循环外部声明。只有当语句跨越多行并且语句为可选的情况下大括号才是必须的。因此下面的代码也是正确的，虽然看上去没什么意义，除非你就是对 `myObj` 的最后一个属性的名字感兴趣（稍后介绍更多关于迭代顺序的内容）。

```javascript
var myObj = {a: 1, b: 2, c: 3}, lastProperty;
for (lastProperty in myObj);
lastProperty; //"c";
```

这里是另外一个例子，这一次 `objectExpression` 是一个原始类型：

```javascript
var str = "hello!", spreadOut = "";

for (var index in str) {
    (index > 0) && (spreadOut += " ")
    spreadOut += str[index];
}

spreadOut; //"h e l l o !"
```

请注意，和所有属性名称一样，在上面的例子中的循环变量 `index` 实际上都是字符型，所以我们不能像上面那样简单地判断是否为真。稍后我们会一起看看为什么 `String` 类型与 `Array` 类型并不总是用于  `for-in` 循环的最佳选择。

### 2.for (LeftHandSideExpression in objectExpression) {statement}

这种有趣的语法很少出现在文档中（MDC没有提及这种语法）。在 `ECMAScript` 术语中， `leftHandSideExpression` 是解析为属性引用的任意表达式（想象一下任何可以出现在赋值等号左侧的表达式）。在每一次迭代中，下一个属性的名字被赋值给 `leftHandSideExpression` 的计算结果。`leftHandSideExpression` 表达式在每次迭代时解析为不同引用是完全可行的，有时候这种方式非常有用，甚至更加优雅，例如，获取属性名称数组现在变得轻而易举。

```javascript
var myObj = {a: 1, b: 2, c: 3}, myKeys = [], i=0;
for (myKeys[i++] in myObj);
myKeys; //['a','b','c'];
```

哪些属性会被迭代？
这需要了解一些JavaScript的内部原理。对象是属性的集合，每一个属性都有他们自己的一系列内部特性 。（我们可以将其看作抽象属性 - 他们被用于JavaScript引擎，但是用户不能直接访问这些特性。ECMAScript 使用[[property]]这样的格式来表示内部特性。

[[Enumerable]]是这些特性的其中之一。`for-in` 语句会迭代[[Enumerable]]值为true的每一个属性。包括对象原型链继承过来的可枚举属性。[[Enumerable]]值为false的属性，以及被覆盖的属性（例如，被子孙对象的同名属性覆盖的原型对象属性）不会被被迭代。

实际上这意味着,`for-in`循环会默认选择非影子，用户定义的（包括继承属性)但非内置的属性。例如，Ojbect 对象的内置方法（toString）不会被枚举。  

这也意味着，如果你习惯于扩展内置对象的原型，那么你的自定义扩展属性将会被枚举出来：

```javascript
var arr = ['a','b','c'], indexes = [];
Array.prototype.each = function() {/blah/};
for (var index in arr) {
    indexes.push(index);
}
indexes; //["0", "1", "2", "each"] whoops!
```

一些框架（例如，Prototype.js 以及 Mootools）添加了很多自定义原型扩展，并且使用 `for-in` 循环来迭代Array和String类型，这些通常都被认为不是什么好主意。使用常规 `for`循环来迭代Array和String类型是一个好的替代方法。另外,ES5 定义了一些自定义的Array迭代器（forEach，map等等）。不幸的是，这些作为替代方案的迭代策略没有一个对常规对象有效 - 这也是为什么扩展Object.prototype被认为是非常坏的实践。

关于 "DontEnum" bug
IE 9以下版本的浏览器会出现一些奇怪的迭代行为，因此内置影子属性（以及non-enumerable属性和ES3语法中的[[DontEnum]]属性）将不会被枚举出来。

```javascript
var obj = {
a: 2,
//shadow a non-enumerable
toString: "I'm an obj"
},

result = [];
for (result[result.length] in obj);
result;
//IE<9 -> ["a"]
//Other browsers -> ["a", "toString"]
```

我能阻止一些属性被迭代吗？
答案是可以。有许多标准技术可以将不需要的属性成员从`for-in`循环中过滤出来。

### 1. Object.prototype.hasOwnProperty

这个方法会调用属性的内置方法[[GetOwnProperty]]来确定给定的属性是不是直接定义在对象上的（而不是定义在原型链上某处的）。

```javascript
var arr = ['a','b','c'], indexes = [];
Array.prototype.each = function() {/*blah*/};
for (var index in arr) {
    if (arr.hasOwnProperty(index)) {
        indexes.push(index);
}
indexes; //["0", "1", "2"] 
```

JSLint 希望你总是将`for-in`语句的循环体用if语句包裹起来，即使是枚举一个常规对象的时候（不要紧，你可以简单地使用一个 && 替代 if! 语句来充当断言条件）。

如果你是一个偏执狂，你或者其他人可能会覆盖 `hasOwnProperty` 地本地定义，那么你直接调用原型引用。

```javascript
//snip...
    for (var index in arr) {
        if (Object.prototype.hasOwnProperty.call(arr, index)) {
            indexes.push(index);
        }
    }
```

### 2. Object.defineProperty

ES5 介绍了Object对象上的一些方法，允许使用自定义内部特性来定义属性（不支持FireFox<4 和 IE<9的版本）。

```javascript
var obj = {};
Object.defineProperty( obj, "value", {
  value: true,
  writable: false,
  enumerable: true,
  configurable: true
});
```

我们可以通过据此设置[[Enumerable]]特性的值来达到从`for-in`循环中隐藏一些自定义原型扩展的目的。

```javascript
var arr = ['a','b','c'], indexes = [];
Object.defineProperty(Array.prototype, "each", {
    value: function() {/*blah*/},
    writable: false,
    enumerable: false,
    configurable: false
});
for (var index in arr) {
    indexes.push(index);
}
indexes; //["0", "1", "2"] 
```

迭代顺序如何确定？
ECMA 标准没有声明枚举顺序，但是非数组是对象的实际标准是按照被属性赋值的的顺序来进行枚举。

```javascript
var obj = {a: 1, b: 2, c: 3}, result = [];
obj.e; //referenced but not assigned
obj.f = 'bar'; //1st assignment
obj.e = 4;
obj.dd = 5;
obj.f = 'foo'; //2nd assignment
for (var prop in obj) {
    result.push(prop);
}
result.toString(); //"a,b,c,f,e,dd"
```

然而目前有许多问题你需要注意：
在IE浏览器环境中删除属性
在IE中删除一个属性，然后重新定义它，不会更新属性在迭代顺序中的位置，这与其他主流浏览器中观察到的行为相悖：

```javascript
var obj = {a: 1, b: 2, c: 3}, result = [];
delete obj.b;
obj.b = 4;
for (var prop in obj) {
    result.push(prop);
}
result.toString(); 
//IE ->"a,b,c"
//Other browsers -> "a,c,b"
```

Chrome中数字命名的属性
Chrome 浏览器会优先处理数字命名的key，以数字顺序而不是插入顺序遍历。

 ```javascript
var obj = {3:'a', 2:'b', 'foo':'c', 1:'d'}, result = [];
for (var prop in obj) {
    result.push(prop);
}
result.toString();
//Chrome -&gt; "1,2,3,foo"
//Other browsers -&gt; "3,2,foo,1"
```

这个被记录下来的bug，有大量充满争议的评论在讨论这个bug是否应该被修复。我认为这个bug应该被修复。根据定义，常规对象的属性确定是无序的，并且ECMA也没有定义出一个标准 - 但 John Resig 和 Charles Kendrick 指出，ECMA标准的缺失不能成为借口 - 标准通常都是遵循实现的，而不是反过来 - 在这个例子中，chrome的处理是不合适的。

关于 `in` 操作符
这个漂亮的 `for-in` 表达式使用内置的[[HasProperty]]方法来检查一个给定的对象中是否存在某个命名的属性：

`propertyNameExpression`中的 `objectExpression`

它像下面的伪代码中这样工作：

```javascript
var name = //resolve [propertyNameExpression];
var obj = //resolve [objectExpression];
return obj.[[HasProperty]](name);
```

这里有一个使用方法的例子：

```javascript
var obj = {a:1, b:2, c:undefined, d:4}, aa = {};
'b' in obj; //true
'c' in obj; //true ('undefined' but still exists)
'e' in obj; //false (does not exist)
delete obj.c;
'c' in obj; //false (no longer exists)
obj.e;
'e' in obj; //false (referenced but not assigned)
//resolving expressions
aa.o = obj;
aa.a = 'a';
aa.a in aa.o; //true
```

请注意，'c'是如何在 o.c 值为 undefined 的情况下从obj对象中返回true的。内部方法[[HasProperty]]将会对任意赋值的对象返回true，不管值为多少。这一点在区分那些被刻意赋值为undefined的属性与只是简单的不存在的属性的时候很有用。
和 `for-in` 循环相似的是，in 操作符会搜索对象的原型链。与 `for-in` 循环不同的是，in 操作符不能区分可枚举属性与不可枚举属性：

```javascript
var arr = [true,false,false];
1 in arr; //true
'slice' in arr; //true
'toString' in arr; //true
```

这就是全部了，请随意在评论中提出建议，纰漏以及投诉。

--本文为译文 [原文链接](https://javascriptweblog.wordpress.com/2011/01/04/exploring-javascript-for-in-loops/)