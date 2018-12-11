---
title: JavaScript对象拷贝的误区
type: categories
copyright: true
date: 2018-11-14 11:26:28
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

{%asset_img maxresdefault.jpg 600%}

JavaScript 对象拷贝暗藏陷阱，JavaScript 提供了许多种方式来拷贝一个对象，但非都是深拷贝，大多数情况下浅拷贝是默认行为。

## 深拷贝 VS 浅拷贝

​	浅拷贝能够成功地复制数字和字符串等`原始值` （基本类型），但是不会递归地复制任何对象的引用，而是复制得到的新对象将会引用之前的同一个对象。

​	如果一个对象 A 引用了另一个对象 B ，当对对象 A 执行 **浅拷贝** 的时候，你只是拷贝了对 B 的引用，复制得到的新对象仍然引用了 B 。

​	当执行**深拷贝**的时候，外部的 B 对象也会一并拷贝，所以新复制得到的对象是完全独立于 B 对象的。

<!--more-->

## 最简单的选择：使用 Lodash

建议工作中执行深拷贝时最好用一些经过严格测试的第三方类库，比如很受欢迎的一直在维护的：Lodash。

Lodash 提供了非常方便的 `clone` 和 `deepclone` 函数来实现浅拷贝和深拷贝。

Lodash 有一个很棒的特性：**你可以只导入单个函数**来降低你的项目依赖数量。

在 Node.js 中：

```js
const clone = require('lodash.clone')
const clonedeep = require('lodash.clonedeep')
```

这里是两个函数的使用示例：

```js
const clone = require('lodash.clone')
const clonedeep = require('lodash.clonedeep')

const externalObject = {
  color: 'red'
}

const original = {
  a: new Date(),
  b: NaN,
  c: new Function(),
  d: undefined,
  e: function() {},
  f: Number,
  g: false,
  h: Infinity,
  i: externalObject
}

const cloned = clone(original)

externalObject.color = 'blue'

console.info('⬇️ shallow cloning 🌈')
console.info(
  '✏️ Notice the i.color property we changed on original is also changed in the shallow copy'
)
console.log(original)
console.log(cloned)

const deepcloned = clonedeep(original)

externalObject.color = 'yellow'
console.log('')
console.info('⬇️ deep cloning 🌈')
console.info('✏️ Notice the i.color property does not propagate any more')
console.log(original)
console.log(deepcloned)
```

In this simple example we first create a shallow copy, and edit the i.color property, which propagates to the copied object.

In the deep clone, this does not happen.

See this [live in Glitch](https://glitch.com/edit/#!/flavio-lodash-clone-shallow-deep).

<iframe src="https://glitch.com/embed/#!/embed/flavio-lodash-clone-shallow-deep?path=server.js&amp;previewSize=42&amp;previewFirst=true&amp;sidebarCollapsed=true" alt="flavio-lodash-clone-shallow-deep on glitch" style="text-shadow: rgb(153, 153, 153) 0.01em 0.01em 0.01em !important; font-family: 微软雅黑 !important; height: 892px; width: 765px; border: 0px;"></iframe>

## Object.Assign()

[`Object.assign()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) 执行浅拷贝，不是深拷贝.

```js
const copied = Object.assign({}, original)
```

Being a shallow copy, values are cloned, and objects references are copied (not the objects themselves), so if you edit an object property in the original object, that’s modified also in the copied object, since the referenced inner object is the same:

浅拷贝只会复制值类型和对象类型的引用（而不是对象本身）。所以如果你编辑了原始对象的属性，复制对象中的这个属性也会被修改，因为原始对象和复制对象内部的引用指向是相同的：

```js
const original = {
  name: 'Fiesta',
  car: {
    color: 'blue'
  }
}
const copied = Object.assign({}, original)

original.name = 'Focus'
original.car.color = 'yellow'

copied.name //Fiesta
copied.car.color //yellow
```

## 使用对象展开表达式

这个 [ES6/ES2015](https://flaviocopes.com/es6/) 特性提供了非常方便的浅拷贝方法，它和`Object.assign()` 做的事情相同。

```js
const copied = { ...original }
```

## 错误的方式

### 使用 Object.create()

> 不推荐这样实现对象拷贝

```js
const copied = Object.create(original)
```

​	这是错误的做法，它并没有做任何拷贝的操作。

​	相反,  `original` 对象会被当成 `copied` 对象的 **prototype** 。

​	表面上它可以成功，但是实际上没有：

```js
const original = {
  name: 'Fiesta'
}
const copied = Object.create(original)
copied.name //Fiesta

original.hasOwnProperty('name') //true
copied.hasOwnProperty('name') //false
```

### JSON 序列化

> 也不推荐

​	网上有一些建议是将对象转换成 JSON，然后再从 JSON  反向生成对象

```js
const cloned = JSON.parse(JSON.stringify(original))
```

​	但是这样做可能有预料不到的后果：

​	这样做你可能会失去任何在 JSON 中找不到对等类型的 JavaScript 属性，比如 `Function` 或者 `Infinity`。 任何赋值为 `undefined` 的属性也会直接被 `JSON.stringify` 忽略掉，导致这些属性在复制对象中消失了。

​	此外，也有一些对象只是简单地转成字符串，例如 Date 对象（同样，不考虑时区，默认为UTC），Set，Map以及许多其他类型：

```js
JSON.parse(
  JSON.stringify({
    a: new Date(),
    b: NaN,
    c: new Function(),
    d: undefined,
    e: function() {},
    f: Number,
    g: false,
    h: Infinity
  })
)
```

![Parsing as JSON](https://flaviocopes.com/how-to-clone-javascript-object/parse-json.png)

这种方式只适用于对象不包含任何内部对象和函数，只有值类型的情况。

下面是用原生 JS 手动实现的两种深拷贝的方式

```js
var array = [
   { number: 1 },
   { number: 2 },
   { number: 3 }
];
function copy (obj) {
        var newobj = obj.constructor === Array ? [] : {};
        if(typeof obj !== 'object'){
            return;
        }
        for(var i in obj){
           newobj[i] = typeof obj[i] === 'object' ?
           copy(obj[i]) : obj[i];
        }
        return newobj
}
var copyArray = copy(array)
copyArray[0].number = 100;
console.log(array); //  [{number: 1}, { number: 2 }, { number: 3 }]
console.log(copyArray); // [{number: 100}, { number: 2 }, { number: 3 }]
```



```js
(function($) {
    'use strict';

    var types = 'Array Object String Date RegExp Function Boolean Number Null Undefined'.split(' ');

    function type() {
        return Object.prototype.toString.call(this).slice(8, -1);
    }

    for (var i = types.length; i--;) {
        $['is' + types[i]] = (function(self) {
            return function(elem) {
                return type.call(elem) === self;
            };
        })(types[i]);
    }

    return $;
})(window.$ || (window.$ = {})); //类型判断

function copy(obj, deep) {
    if (obj === null || (typeof obj !== "object" && !$.isFunction(obj))) {
        return obj;
    }

    if ($.isFunction(obj)) {
        return new Function("return " + obj.toString())();
    } else {
        var name, target = $.isArray(obj) ? [] : {},
            value;

        for (name in obj) {
            value = obj[name];

            if (value === obj) {
                continue;
            }

            if (deep) {
                if ($.isArray(value) || $.isObject(value)) {
                    target[name] = copy(value, deep);
                } else if ($.isFunction(value)) {
                    target[name] = new Function("return " + value.toString())();
                } else {
                    target[name] = value;
                }
            } else {
                target[name] = value;
            }
        }
        return target;
    }　
}
```

