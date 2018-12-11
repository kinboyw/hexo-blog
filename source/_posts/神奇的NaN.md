---
title: 神奇的NaN
type: categories
copyright: true
date: 2018-11-13 13:42:38
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---



这是一个大约需要花10-15分钟看完的技术讲义，关于 NaN 是什么？它会在哪里出现？以及对于它大家需要知道些什么？

讲义的作者是 [Lewis J Ellis](https://speakerdeck.com/lewisjellis)，有一份这个讲义的演讲[视频录像](https://www.youtube.com/watch?v=GeM22aTO4Ks)，还可以在 [Github](https://github.com/lewisjellis/nantalk) 上找到这个讲义的项目。

{%raw%}

<script async class="speakerdeck-embed" data-id="6fa4466960814982872e8f146047e39b" data-ratio="1.77777777777778" src="//speakerdeck.com/assets/embed.js"></script>

{%endraw%}

<!--more-->

# "NaN" 的意思是:

# Not a Number

------

## 什么东西会给我们一个NaN?

------

## 令人头晕的数学计算

```javascript
console.log(
  0 / 0,
  Infinity / Infinity,
  0 * Infinity,
  Infinity - Infinity
);
```

```
> NaN NaN NaN NaN
```

------

## 复杂的数字

```javascript
console.log(
  Math.sqrt(-1),
  Math.log(-1),
  Math.acos(2),
  Math.asin(2)
);
```

```
> NaN NaN NaN NaN
```

------

## 将其他类型转换为数字

```javascript
console.log(
  parseInt('hello'), parseFloat('world'),
  Number(undefined), Number({}),
  +undefined, +{},
  +new Date('hello')
);
```

```
> NaN NaN NaN NaN NaN NaN NaN
```

------

## 在 JavaScript 中，NaN 是什么

------

## "Not a Number" 是...

```javascript
console.log(NaN);
```

```
> NaN
```

... 一个特殊的 JavaScript 值.

(*非常* 特殊)

------

## "Not a Number" 是...

```javascript
console.log(typeof NaN);
```

```
> number
```

...一个 Number.

------

{%asset_img what.jpg 400 %}

------

## "Not a Number" 是...

```javascript
console.log(NaN === NaN);
```

```
> false
```

... 不是一个"Not a Number".

------

{%asset_img what.jpg 400 %}

------

## "Not a Number" 是...

```javascript
var assert = require('assert');
assert.equal(NaN, NaN);
```

```
> AssertionError: NaN == NaN
```

...棘手的测试.

------

# "NaN" 实际上意思是:

# Not a NaN

------

{%asset_img ariya-tweet.png 400 %}

------

## 所以我们知道了 `NaN` 在什么地方出现, 但是我们如何判断一个值是 `NaN` ？



## 放轻松！只需要使用 `isNaN` 方法:

```javascript
console.log(isNaN(NaN));
```

```
> true
```

------

## 也许可能不是...

```javascript
console.log(isNaN('foo'), isNaN(['bar']), isNaN({}));
```

```
> true true true
```

```javascript
console.log(typeof 'foo', typeof ['bar'], typeof {});
```

```
> string object object
```

------

{%asset_img polarbearfacepalm.jpg 400%}

------

## 我们自己写一个方法来判断:

```javascript
function myIsNaN(x) {
  return typeof x === 'number' && isNaN(x);
}

console.log([NaN, 'foo', ['bar'], {}].map(isNaN));
console.log([NaN, 'foo', ['bar'], {}].map(myIsNaN));
```

```
> true true true true
> true false false false
```

------

## 或者我们可以回调 "Not a NaN":

```javascript
function myIsNaN(x) {
  return x !== x;
}

console.log([NaN, 'foo', ['bar'], {}].map(isNaN));
console.log([NaN, 'foo', ['bar'], {}].map(myIsNaN));
```

```
> true true true true
> true false false false
```

------

## 这个方法有用是因为 `NaN` 是 JavaScript 中唯一一个等号操作符是非自反的值。

------

## 幸运的是, ES2015 中增加了 `Number.isNaN`:

```javascript
console.log([NaN, 'foo', ['bar'], {}].map(isNaN));
console.log([NaN, 'foo', ['bar'], {}].map(Number.isNaN));

```

...它正是我们想要的方法:

```
> true true true true
> true false false false
```

------

## 或者我们也可以 用 `Object.is`:

```javascript
console.log([NaN, 'foo', ['bar'], {}].map(isNaN));
console.log([NaN, 'foo', ['bar'], {}].map(n => Object.is(n, NaN)));
```

```
> true true true true
> true false false false
```

这种方法用到了 `SameValue` 这个内部操作，它的对比方式与 `Set` 区分元素的方法（大部分）相似。

------

## 但是 NaN 不仅仅是 JavaScript 中才有的！

------

## NaN 实际上是在 IEEE 754 浮点标准中定义的。

------

## 如果你知道 NaN 在一种语言中可能出现的地方，以及它的表现，那么它在其他语言中也大致相似。

------

## IEEE 754 规范定义了 `pow` 方法：

```
pow(2, 3) -> 8
pow(-1, 1.5) -> NaN
pow(NaN, anything) -> NaN
pow(anything, NaN) -> NaN
```

If either input is `NaN`, or if the base is negative and the exponent is not an integer, the result is `NaN`.

如果输入是 `NaN` ，或者基数为负且指数不是整数，则结果为 `NaN`。 

------

## 三种不明确的 `pow`:

```
pow(0, 0) -> 1
pow(Infinity, 0) -> 1
pow(1, Infinity) -> 1
```

这种行为 继承自 C99 和 POSIX 2001

多数语言都遵循这一条规则

------

## 这是 Python 的行为 :

```python
[0 ** 0, float("inf") ** 0, 1 ** float("inf")]
```

```
> [1 1.0 1.0]
```

------

##  Ruby :

```ruby
[0 ** 0, Float::INFINITY ** 0, 1 ** Float::INFINITY]
```

```
> [1 1.0 1.0]
```

------

##  Lua :

```lua
print(math.pow(0, 0), math.pow(math.huge, 0), math.pow(1, math.huge))
```

```
> 1 1 1
```

------

# 但是JavaScript?

------

```javascript
Math.pow(0, 0);
```

------

```javascript
Math.pow(0, 0);
```

```
> 1
```

------

```javascript
Math.pow(0, 0);
```

```
> 1
```

```javascript
Math.pow(Infinity, 0);
```

------

```javascript
Math.pow(0, 0);
```

```
> 1
```

```javascript
Math.pow(Infinity, 0);
```

```
> 1
```

------

```javascript
Math.pow(0, 0);
```

```
> 1
```

```javascript
Math.pow(Infinity, 0);
```

```
> 1
```

```javascript
Math.pow(1, Infinity);
```

------

```javascript
Math.pow(0, 0);
```

```
> 1
```

```javascript
Math.pow(Infinity, 0);
```

```
> 1
```

```javascript
Math.pow(1, Infinity);
```

```
> NaN
```

------

{%asset_img oddpenguinout.jpeg 400%}

------

为什么？

------

{%asset_img es3.png 400%}

------

{%asset_img 12734.png 400%}

------

- ES`1` 声明`pow`: 1997
- C99 声明`pow`: 1999
- POSIX 声明`pow`: 2001
- IEEE 754 声明`pow`: 2008

------

{%asset_img 12734-note.png 400%}

------

## 就像关于 JavaScript 的其他问题一样，答案就是…

------

向后兼容

------

## 所以不论如何，看看 IEEE 754 告诉我们要如何表示 NaN？

------

##  float32 类型值的 bit 表达方式：

```
0 10000000 01000000000000000000000

```

- 1 位符号
- 8 位指数, 偏移量 `127`
- 23 位有效位数 (前面的第24位隐藏)
- `(-1) ^ s * 2 ^ (exp - 127) * 1.significand`

------

## 例如 float32 的值:

```
0 10000000 01000000000000000000000

```

- `(-1) ^ 0 = 1`
- `2 ^ (10000000b - 127) = 2`
- `1.01b = 1.25`
- `1 * 2 * 1.25 = 2.5`

------

## 特殊值的 bit 表达方式:

```
0 11111111 00000000000000000000000 -> Infinity
1 11111111 00000000000000000000000 -> -Infinity

```

Infinity 的值有一个最大的指数和一个为零的有效位数。

------

## 特殊值的 bit 表达方式:

```
0 11111111 10000000000000000000000 -> NaN

```

NaN 的值有一个最大的指数和一个非零的有效位数。

------

## 这些也都是 NaN:

```
1 11111111 10000000000000000000000 -> NaN (quiet, negative)
0 11111111 10000000000000000000001 -> NaN (quiet, but different)
0 11111111 00000000000000000000001 -> NaN (signaling)
0 11111111 00000000000000000000010 -> NaN (signaling, but different)
0 11111111 00000000000000000000011 -> NaN (we can start counting!)

```

------

## 这些也都是 NaN:

```
1 11111111 10000000000000000000000 -> NaN (quiet, negative)
0 11111111 10000000000000000000001 -> NaN (quiet, but different)
0 11111111 00000000000000000000001 -> NaN (signaling)
0 11111111 00000000000000000000010 -> NaN (signaling, but different)
0 11111111 00000000000000000000011 -> NaN (we can start counting!)

```

  一共有多少个`NaN`，真的吗？

------

# 2^24 - 2 = *16,777,214*

------

## 这只是类型位 float32 的情况下!

## 那么如果是 double64 呢?

------

# 2^53 - 2 = *9,007,199,254,740,990*

------

## 也就是 9 * 10^15, 或者 9 万亿.

## 9PB相当于可以播放20000年的音乐

------

## 如果有这么多可能的 `NaN` ，那这一切才看起来合理了些…

------

## ...就是说一个随机的 NaN 几乎不可能等于另一个随机的 NaN！

------

# 因此, NaN !== NaN[^1].

[^1]: With probability `1/9,007,199,254,740,990`.

------

## 相关链接

- [http://ariya.ofilabs.com/2014/05/the-curious-case-of-javascript-nan.html](http://ariya.ofilabs.com/2014/05/the-curious-case-of-javascript-nan.html)
- [http://www.2ality.com/2012/02/nan-infinity.html](http://www.2ality.com/2012/02/nan-infinity.html)
- [https://en.wikipedia.org/wiki/NaN](https://en.wikipedia.org/wiki/NaN)
- [https://tc39.github.io/ecma262/#sec-applying-the-exp-operator](https://tc39.github.io/ecma262/#sec-applying-the-exp-operator)

