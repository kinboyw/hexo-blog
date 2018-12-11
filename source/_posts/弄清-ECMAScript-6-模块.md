---
title: 弄清 ECMAScript 6 模块
type: categories
copyright: true
date: 2018-11-13 15:56:58
tags: [FE,ES6]
categories: 
- [FE,ES6]
---

原文: [ECMAScript 6 modules: the final syntax](http://2ality.com/2014/09/es6-modules-final.html)

### 1. JavaScript 的模块系统现状

JavaScript 没有内建的模块系统，但是社区创造了很多给力的解决方案。 两种最重要（不幸的是互不兼容）的标准是:

- **CommonJS Modules**: 这个标准的主要 实现是在Node.js中（Node.js 模块有一些特性领先于 CommonJS)。

  特性：

  - 语法紧凑
  - 设计用于同步加载
  - 主要应用于服务器端

- **Asynchronous Module Definition (AMD):** 这个标准的主要实现是 RequireJS。

  特性：

  - 语法稍微复杂，使AMD能够在没有 `eval()`（或者无须编译）的情况下工作。

  - 设计用于异步加载

  - 主要用于浏览器端

上面只是对当前状况的简单介绍，如果想要详细了解，可以看看 Addy Osmani 写的  “[Writing Modular JavaScript With AMD, CommonJS & ES Harmony](https://addyosmani.com/writing-modular-js/)”

<!--more-->

### 2. ECMAScript 6 模块
ECMAScript 6（后面简称ES6） 模块的设计目标是要创造一种让 CommonJS 和 AMD 的用户都能愉快使用的模块系统：

- 类似 CommonJS ，ES6 模块也有紧凑的语法，偏向于单个导出，支持循环依赖。

- 类似 AMD，ES6 模块直接支持异步加载和可配置模块加载。

内置于语言中，使得 ES6 模块超越 CommonJS 和 AMD （后面会详细说明）:

- 语法甚至比 CommonJS 更加紧凑
- 结构可以静态分析（用于静态检查，优化等）
- 支持循环引用这一点要优于 CommonJS

ES6 模块分为两个部分:

- 声明语法（用于导入和导出）
- 可编程的加载器 API：配置模块的加载方式以及按条件模块加载

### 3. ES6 模块语法概述  
有两种导出方式：命名导出（一对多模块）和默认导出（一对一模块）。

#### 3.1 命名导出 （一对多模块）  
一个模块可以通过在声明前添加关键字 `export` 来导出多个东西。这些导出按名称区分，成为命名导出。

```js
//------ lib.js ------
export const sqrt = Math.sqrt;
export function square(x) {
    return x * x;
}
export function diag(x, y) {
    return sqrt(square(x) + square(y));
}
```

```js
//------ main.js ------
import { square, diag } from 'lib';
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

也有其他的方式声明命名导出（后面详细介绍），但是我发现这个非常方便：直接在js文件里写好代码，然后在你想导出的每一个东西的定义前加上一个 `export` 关键字。

你也可以引入整个模块，然后通过属性表达式引用其命名导出：

```js
//------ main.js ------
import * as lib from 'lib';
console.log(lib.square(11)); // 121
console.log(lib.diag(4, 3)); // 5
```

**CommonJS 语法中相同的代码：**曾经有段时间，我尝试过用一些聪明的办法，来减少 Node.js 中模块导出的冗余。现在我更喜欢下面的简单但略显冗长的风格:

```js
//------ lib.js ------
var sqrt = Math.sqrt;
function square(x) {
    return x * x;
}
function diag(x, y) {
    return sqrt(square(x) + square(y));
}
module.exports = {
    sqrt: sqrt,
    square: square,
    diag: diag,
};
```

```js
//------ main.js ------
var square = require('lib').square;
var diag = require('lib').diag;
console.log(square(11)); // 121
console.log(diag(4, 3)); // 5
```

#### 3.2 默认导出 （一对一模块）  
导出单一值的模块在 Node.js 社区大受欢迎。但是在前端开发中也很常见，在一些有`构造函数/类`的模型，且每个模型对应一个模块的地方。一个 ES6 模块可以选择默认导出，作为最重要的导出值。默认导出特别易于导入。

下面的 ES6 模块默认导出是一个函数：

```js
//------ myFunc.js ------
export default function () { ... };

//------ main1.js ------
import myFunc from 'myFunc';
myFunc();
```


一个默认导出是一个类的 ES6 模块如下:

```js
//------ MyClass.js ------
export default class { ... };

//------ main2.js ------
import MyClass from 'MyClass';
let inst = new MyClass();

```

注意：默认导出的操作对象是一个表达式语句，通常没有名称；然而，它可以通过模块的名称（模块的文件名）来识别。

#### 3.3 在一个模块中同时使用命名导出和默认导出 
下面的模式在 JavaScript 中很常见：一个类库是单一的函数，但是通过改函数的属性提供了附加服务。jQuery 和 Underscores.js 都是这种方式的例子。下面是将 Underscore.js 写成 CommonJS 模块的草图：

```js
//------ underscore.js ------
var _ = function (obj) {
    ...
};
var each = _.each = _.forEach =
    function (obj, iterator, context) {
        ...
    };
module.exports = _;

```

```js
//------ main.js ------
var _ = require('underscore');
var each = _.each;
...
```

从 ES6 来看，函数 _ 是默认导出，each 和 forEach 是命名导出。事实证明，你实际上可以同时使用命名导出和默认导出。看看下面的示例，前面的 CommonJS 模块用 ES6 模块的方式来写：

```js
//------ underscore.js ------
export default function (obj) {
    ...
};
export function each(obj, iterator, context) {
    ...
}
export { each as forEach };
```

```js
//------ main.js ------
import _, { each } from 'underscore';
...
```

​	注意，CommonJS 的版本和  ES6 的版本只是粗略的相似，后者具有更加扁平的结构，前者则是嵌套的。更偏向哪种风格是个人的喜好，但是扁平风格具有静态检查的优势（为什么这样做很好，下面解释）。CommonJS 风格似乎是部分受到了将对象作为命名空间的需求的驱动，这种需求通常可以通过 ES6 模块和命名导出的方式来实现。

#### 默认导出只是另一种形式的命名导出  
​	默认导出实际上是一种特殊的命名为 `default` 的命名导出。也就是说，下面的两种表达是等同的： 

```js
import { default as foo } from 'lib';
import foo from 'lib';
```

​	类似的，下面两个模块有相同的默认导出：

```js
//------ module1.js ------
export default 123;

//------ module2.js ------
const D = 123;
export { D as default };

```

#### 我们为什么需要命名导出

你可能想知道 — 如果我们可以简单地默认导出对象（像 CommonJS 一样），为什么需要命名导出？答案就是，你不能通过对象来强行使用静态结构，这会失去所有相关的有点（下一节中解释）。

### 4. 设计目标 

如果你想弄懂 ES6 模块，理解是什么样的目标影响了设计可能会帮到你，主要的目标就是：

- 默认导出是有利的
- 静态模块结构
- 同时支持同步和异步加载
- 支持模块间循环引用

下面的小节解释这些目标。

#### 4.1 默认导出是有利的
模块语法暗示了将默认导出当作模块可能看起来有些奇怪，但是如果你考虑到其中一个主要目标就是让默认导出尽可能方便的话就能说的通了。引用 David Herman:

> ECMAScript 6 favors the single/default export style, and gives the sweetest syntax to importing the default. Importing named exports can and even should be slightly less concise.

#### 4.2 静态模块结构  
​	在现代 JavaScript 模块系统中，你必须运行代码才能知道导入和导出的是什么。这就是 ES6 打破了这些系统的主要原因：通过将模块系统建立到语言中，你可以在语法上强制执行静态模块结构。我们先看看这意味着什么，再看看它带来了什么好处：

​	模块结构是静态的意味着你可以在编译时（静态的）决定导入和导出 — 你只需要看看源码，不必执行它。下面为什么 CommonJS 不可能做到静态检查的示例。在这个示例中，你必须运行代码才能知道它导入了什么：

```js
var mylib;
if (Math.random()) {
    mylib = require('foo');
} else {
    mylib = require('bar');
}
```

第二个例子中，你必须运行代码才能知道导出了什么：

```js
if (Math.random()) {
    exports.baz = ...;
}
```

​	ES6 提供更少的灵活性，它会迫使你保持静态。你也会因此受益<sup>[[2](http://calculist.org/blog/2012/06/29/static-module-resolution/)]</sup>，下面介绍。

##### 好处 1: 更快速的查找

​	如果你用 CommonJS `require` 一个类库，你会得到一个 object ：

```js
var lib = require('lib');
lib.someFunc(); // property lookup
```

​	因此，通过 `lib.someFunc` 访问一个命名导出意味着你必须执行属性查询，这是很慢的，因为它是动态的。

​	相反，如果你用 ES6 模块语法 `import` 一个类库，你可以静态地知道其内容并可以优化访问：

```js
import * as lib from 'lib';
lib.someFunc(); // statically resolved
```

##### 好处 2: 变量检查  
​	有了静态模块结构，你就总能静态地知道模块内任意位置的哪些变量是可见的：

- Global variables: increasingly, the only completely global variables will come from the language proper. Everything else will come from modules (including functionality from the standard library and the browser). That is, you statically know all global variables.

- Module imports: You statically know those, too.

- Module-local variables: can be determined by statically examining the module.
  This helps tremendously with checking whether a given identifier has been spelled properly. This kind of check is a popular feature of linters such as JSLint and JSHint; in ECMAScript 6, most of it can be performed by JavaScript engines.

  另外，任何对命名导出的访问（例如 lib.foo）也可以静态检查。

##### 好处3: 准备好了宏

​	宏仍然在 JavaScript 未来的技术路线图中。如果 JavaScript 引擎支持了宏，你就可以通过类库添加新的语法。Sweet.js 就是一个实验性的 JavaScript 宏系统。下面是一个来自 Sweet.js 官网的示例：class 的宏

```js
// Define the macro
macro class {
    rule {
        $className {
                constructor $cparams $cbody
                $($mname $mparams $mbody) ...
        }
    } => {
        function $className $cparams $cbody
        $($className.prototype.$mname
            = function $mname $mparams $mbody; ) ...
    }
}

// Use the macro
class Person {
    constructor(name) {
        this.name = name;
    }
    say(msg) {
        console.log(this.name + " says: " + msg);
    }
}
var bob = new Person("Bob");
bob.say("Macros are sweet!");

```

​	对于宏，JavaScript 引擎在编译前会进行一个预处理步骤：如果解析器生成的 token 流中的 token 序列与宏的模式部分匹配，那么它将会被宏体生成的 token 替换。预处理步骤只在能够静态查找到宏定义的情况下有效。所以如果你想通过模块引入宏，那么模块必须是静态结构的。

##### 好处4:   准备好了类型
​	静态类型检查强加了类似于宏的约束：它在定义能被静态地找到的情况下有用。同样，如果类型具有静态结构，只能从模块导入。

​	类型很有吸引力，因为他们支持静态类型的 JavaScript 快速变体，其中可以编写性能关键代码。一个这样的变体就是 [Low-Level JavaScript](http://lljs.org/) (LLJS)。它现在被编译到了 [asm.js](http://2ality.com/2013/02/asm-js.html)

##### 好处 5: 支持其他语言
​	如果你想要支持将使用宏和静态类型的语言编译到 JavaScript 中，JavaScript 的模块就应该有一个静态结构，这在前面两节讲过了。

#### 同时支持同步和异步加载  
​	ES6 模块必须在不论引擎同步（例如服务器端）还是异步（例如浏览器中）加载模块的情况下工作。它的语法非常适合同步加载，异步加载是通过静态结构实现的：因为你可以静态地决定所有的导入，所以可以在评估模块主题之前就加载他们（以一种类似 AMD 模块的方式）

#### 4.3 支持模块间的循环引用  

​	如果 A （可能间接/可传递地）导入了 B，同时 B 导入了 A，那么模块 A 和 B 就形成了[循环依赖](https://en.wikipedia.org/wiki/Circular_dependency)。如果可能，应该尽量避免循环依赖，它导致了  A 和 B 的紧耦合 — 它们只能同时引入和使用。 

##### 为什么要支持循环依赖?  
​	循环依赖本身并不是邪恶的。特别是对于对象，有时候你甚至需要这种依赖。例如，在一些树（例如 DOM 文档树）中，父亲指向孩子，同时孩子也指向父亲。在类库中，你通常会通过仔细的设计来避免循环依赖。在大型系统中，这种情况可能发生，尤其是在重构期间。然后，如果模块系统支持循环引用的话就非常有用了，因为重构时不会导致系统崩溃。

​	Node.js 文档中承认了循环依赖的重要性<sup>[[3](https://nodejs.org/api/modules.html#modules_cycles)]</sup> , Rob Sayre 提供了补充[证明](https://mail.mozilla.org/pipermail/es-discuss/2014-July/038250.html)：

> Data point: I once implemented a system like [ECMAScript 6 modules] for Firefox. I got asked for cyclic dependency support 3 weeks after shipping.
>
> That system that Alex Fritze invented and I worked on is not perfect, and the syntax isn't very pretty. But it's still getting used 7 years later, so it must have gotten something right.

​	我们来看看 CommonJS 和 ES6 如何处理循环依赖。

##### CommonJS 中的循环依赖 
​	在 CommonJS 中，如果模块 B 依赖模块 A , 而 A 的主体正在评估中，那么它将返回 A 在当前状态中的导出对象（下面示例中的第一行）。这就允许 B 引用其导出内对象的属性（第二行）。这些属性在 B 的评估结束后填充，此时 B 的导出工作正常。

```js
//------ a.js ------
var b = require('b');
exports.foo = function () { ... };

//------ b.js ------
var a = require('a'); // (1)
// Can’t use a.foo in module body,
// but it will be filled in later
exports.bar = function () {
    a.foo(); // OK (2)
};

//------ main.js ------
var a = require('a');

```

作为一般规则，需要记住，对于循环依赖，你无法访问模块正文中的导入。这是该现象固有的，并不能被 ES6 模块改变。

CommonJS 的方式有一些限制：

-  Node.js 风格的单值导出不起作用。在 Node.js 中，你可以像这样导出单个值而不是对象：
    `module.exports = function () { ... }` 

  如果你在模块 A 中这样做了，你就无法在模块 B 中使用导出的方法，因为 B 的变量 `a` 仍然指向 A 的原始导出对象。

- 你不能直接使用命名导出。也就是说，模块 B 不能像这样导入 `a.foo` ：
  `var foo = require('a').foo;` 
   foo 将会是 undefined。换句话说，你没有其他选择，只能通过导出对象 `a` 来引用 foo。

​	CommonJS 有一个独一无二的特点：你可以在导入之前导出。这种导出保证可以在引用的模块中被访问到。也就是说，如果 A 这样做了，那么它就可以在 B 中被访问到。然而在导入前导出的特性很少有用。

##### ES6 中的循环引用 
为了消除上述的两条限制，ES6 模块导出了绑定而不是值。也就是说与模块体内声明的变量的连接是保持鲜活的。在下面的代码中证明：

```js
//------ lib.js ------
export let counter = 0;
export function inc() {
    counter++;
}

//------ main.js ------
import { inc, counter } from 'lib';
console.log(counter); // 0
inc();
console.log(counter); // 1

```

​	因此，对于循环依赖，不论你是直接访问命名导出还是通过模块访问都无关紧要：两种情况之间有间接联系，而且始终有效。

### 5. 再说一点导入和导出 
#### 5.1 导入  
​	ES6提供了下面这些方式的导入:

```js
// Default exports and named exports
import theDefault, { named1, named2 } from 'src/mylib';
import theDefault from 'src/mylib';
import { named1, named2 } from 'src/mylib';

// Renaming: import named1 as myNamed1
import { named1 as myNamed1, named2 } from 'src/mylib';

// Importing the module as an object
// (with one property per named export)
import * as mylib from 'src/mylib';

// Only load the module, don’t import anything
import 'src/mylib';

```

#### 5.2 导出  
​	有两种方式可以导出当前模块中的东西。一种是你可以在声明前添加 `export` 关键字。

``` js
export var myVar1 = ...;
export let myVar2 = ...;
export const MY_CONST = ...;

export function myFunc() {
    ...
}
export function* myGeneratorFunc() {
    ...
}
export class MyClass {
    ...
}
```

​	默认导出的操作符是一个表达式（包括函数表达式和类表达式）。例如：

```js
export default 123;
export default function (x) {
    return x
};
export default x => x;
export default class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
};
```

​	另一方面，你可以将需要导出的任何东西列在模块末尾。

``` js
const MY_CONST = ...;
function myFunc() {
    ...
}

export { MY_CONST, myFunc };

```

​	你也可以用不同的名字导出：

``` js
export { MY_CONST as THE_CONST, myFunc as theFunc };
```

​	注意，不能用保留字（例如，default 和 new ）作为变量名，但是你可以用他们作为导出名称（你也可以在 ES5 中用它们作为属性名称）。如果你想直接导入这样命名的导出，你必须要重命名成合适的名字。

#### 5.3 重导出
​	重导出意思是将另一个模块的导出添加到当前模块的导出中。你要么可以添加其他模块的全部导出：

``` js
export * from 'src/other_module';
```

​	要么可以更有选择性（也可以重命名）：

``` js
export { foo, bar } from 'src/other_module';

// Export other_module’s foo as myFoo
export { foo as myFoo, bar } from 'src/other_module';
```

### 6. eval() 和 模块
​	eval() 不支持模块语法。它根据脚本的语法规则解析传入的参数，而脚本不支持模块语法（后面解释）。如果你想要评估模块代码，可以使用模块加载 API（接下来介绍）

### 7. ES6 模块加载 API
除了使用模块的声明式语法外，还有一个编程 API，它允许你：

- 用编程方式使用模块和脚本
- 配置模块加载

​    	加载器处理解析模块标识符（位于`import…from` 后面的字符串 ID），加载模块等。他们的构造函数是 `Reflect.Loader` 。每个平台都在全局变量 System（系统加载器）中保留一个自定义实例，实现其特定的模块加载方式。

#### 7.1 引入模块和加载脚本 
你可以通过基于 ES6 promise 的 API，编程化的导入一个模块：

``` js

```

System.import() 允许你:

- 使用<script>元素内的模块（这里不支持模块语法）
- 按条件加载模块

System.import() 获取一个模块, 你可以用 Promise.all() 来导入多个模块:

```js
Promise.all(
    ['module1', 'module2', 'module3']
    .map(x => System.import(x)))
.then(([module1, module2, module3]) => {
    // Use module1, module2, module3
});
```


更多加载器方法:

- `System.module(source, options?)` 将source中的 JavaScript 代码评估为模块（这种方式通过 promise 异步传输）
- `System.set(name, module)` 这个方法用于注册一个模块（例如，一个你通过 System.module()创建的模块）。
- `System.define(name, source, options?)` 同时评估 source 中的模块代码和注册生成的模块。

#### 7.4 配置模块加载  
模块加载器 API 有各种用于配置的 hooks（钩子），它仍在进行中。第一个用于浏览器的系统加载器目前已经实现并通过测试。目标是要弄清楚如何最好的实现模块加载可配置化。

The loader API will permit many customizations of the loading process. For example:

加载器 API 将会允许许多加载处理过程的自定义设置。例如：

- 导入Lint模块(e.g. 通过 JSLint 还是 JSHint).
- 导入自动转椅模块(代码中可能包含 CoffeeScript 或者 TypeScript 代码).
- 使用遗留模块(AMD, Node.js).

配置模块加载在 CommonJS 和 Node.js 中是受限制的