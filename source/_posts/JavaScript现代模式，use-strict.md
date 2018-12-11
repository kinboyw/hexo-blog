---
title: JavaScript现代模式，use strict
type: categories
copyright: true
date: 2018-12-02 12:43:36
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

{%asset_img javascript-825x300.jpg %}

很久以来，JavaScript 的发展过程中都不存在兼容性问题。新特性不断添加，但是并没有改变旧的功能。

这样的好处就是永远不会破坏已有的代码。但是不好的一面是，任何由 JavaScript 作者带来的错误或者设计缺陷都将永远伴随这门语言。

直到 ECMAScript 5（ES5）出现，状况才有所改观。它新增了语言特性的同时也修改了一些旧的特性。为了让代码能够正常工作，多数改动都是默认关闭的。开发者需要用 `use strict` 指令显示地启用它们。

<!--more-->

## “use strict”

这个指令看上去就像一个字符串：`"use strict"` 或者 `'use strict'` 。当它被放在脚本的顶部时，整个脚本就会以 `现代`的方式运行。

例如

```javascript
"use strict";

// this code works the modern way
...
```

`"use strict"` 也可以用在一个 function 的开头（大多数 fucntion）而不一定是脚本的起始位置。这样就会只在 function 内部启用严格模式。但是通常人们会对整个脚本使用严格模式。

> 确保 "use strict" 在代码顶部
>
> 务必保证 `"use strict"` 在代码顶部，否则严格模式不会启用。
>
> 下面的代码中就没有启用严格模式：
>
> ```javascript
> alert("some code");
> // "use strict" below is ignored, must be on the top
> 
> "use strict";
> 
> // strict mode is not activated
> ```
>
> 只有注释可以出现在 `"use strict"` 的顶部。

不能取消 `use strict`

没有一个叫 `"no use strict"`或者类似的指令可以让 Javascript 返回旧的行为模式。

一旦我们进入了严格模式，就不能返回了。

## 始终“use strict”

1. `"use strict"` 指令将引擎切换到 “现代” 模式，改变内置特性的行为。
2. `"use strict"` 出现在顶部会启用严格模式。也有一些语言特性，像 “class” 和 “module” 会自动启用严格模式。
3. 所有浏览器都支持严格模式。
4. 始终建议用 `"use strict"` 来开始编写脚本。