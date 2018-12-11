---
title: JavaScript的数据类型
type: categories
copyright: true
date: 2018-12-10 20:23:21
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

#### JavaScript的两种类型

JavaScript中有两种数据：初始值和对象。对象以外的类型就是初始值类型，初始值类型不包含方法。

JS中共有6中初始值类型：Boolean，Number，String，Null，Undefined，Symbol

<!--more-->

**Boolean**

布尔类型表示**true** 和 **false** 这两个值的其中一个，可以将布尔型想象成 开/关，或者是/否。

```js
var boo1 = true;
var boo2 = false;
```

#### **Number**

JavaScript中只有一种数字类型：基于 IEEE754标准的双精度64位二进制格式的值（-(263 -1) 到 263 -1）。数字类型不带小数点就是整数，JavaScript 没有为整数声明一种特殊的类型。除了能表示浮点数以外，还可以带符号的特殊值：`Infinity`， `-Infinity`， `NaN（Not a Number）`  。

```js
var num1 = 32;
var num2 = +Infinity;
```

#### String

字符型用于表示文本数据，它由一组16位无符号整型数值表示的“元素”组成。字符型必须用单引号或者双引号括起来。在 JS 中，字符型是不可变的。修改一个字符串的过程是，创建一个改变过的新字符串，再将新字符串赋值给变量。

```js
var str1 = 'hello, it is me';
var str2 = "hello, it's me";
```

#### **Null**

Null 类型只有一个值：null。

```js
var nothing = null;
```

#### Undefined

已声明未赋值的变量的值就是 `undefined`， 也是其所述类型的唯一一个值。

```js
var testVar;
console.log(testVar); // undefined
```

#### Symbol

符号类型是ES6新引入的类型。符号型是唯一的，也是不可变的初始值类型，只能用作对象属性的键，具体可以看[这里](https://developer.mozilla.org/en-US/docs/Glossary/Symbol) 。

```
const mySymbol = Symbol('mySymbol');
```

------

#### 对象是什么?

对象不是初始值类型。

对象是一组属性的集合。这些属性以键值对的形式保存。属性可以指向任意类型的数据，包括数值值和对象。

```
var obj = {
  key1: 'value',
  key2: 'value',
  key3: true,
  key4: 32,
  key5: {}
}
```

------

#### 松散类型

JavaScript 是一种松散类型的语言。这意味着你不必声明变量的类型。JavaScript自动替你决定变量类型。同时也意味着，变量类型是可以改变的。示例如下：

我们创建一个变量 `car` ，并给它赋值一个字符串：

```
var car = 'ford';
```

然后，我们想要car保存它生产的年份，于是我们将 `car` 的值改成一个数字：

```
car = 1998;
```

成功了，在JavaScript中你可以更随心所欲。因为它是松散类型的，我们可以随意改变变量类型。