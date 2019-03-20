---
title: JavaScript作用域
type: categories
copyright: true
date: 2019-02-13 16:43:28
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

​	作用域（[Scope](http://en.wikipedia.org/wiki/Scope_%28programming%29) ）是 JavaScript 语言的基础概念之一，可能是让我在编写复杂程序的时候煎熬最多的。记不清多少次迷失在追踪函数到函数之间传递控制时 `this` 关键字指向的问题中了，我发现自己经常以各种令人困惑的方式扭曲我的代码，试图对理解变量在哪些地方可以访问的问题上保留一点理智。

​	这篇文章将会正面解决问题，概述作用域和上下文的定义，测试两种允许我们操作上下文的 JavaScript 方法，并深入探讨我遇到过的 90% 的问题的解决方案。

### `this`？是什么？

- 调用一个对象的函数

  ​	在经典的面向对象编程中，我们需要一种方法来标识和指向我们正在操作的对象。`this` 优秀地满足了这个目的，为我们的对象提供了访问自己和指向自有属性的目的。

  ```html
  <script type="text/javascript">
    var deep_thought = {
    	the_answer: 42,
    	ask_question: function () {
    		return this.the_answer;
    	}
  };
  var the_meaning = deep_thought.ask_question();
  </script>
  ```

  ​	上面的示例构造了 一个对象，名为 `deep_thought` ，并将它的 `this_answer` 属性设置为 42，然后创建了一个 `ask_question` 方法。当 `deep_thought.ask_question()` 函数被执行的时候，JavaScript 为函数调用创建了一个执行上下文，将 `this` 设置为调用语句最后一个 ”.” 前面的变量所引用的对象，在这个例子中就是  `deep_thought` 。这个方法可以在后面通过 `this` 访问到 `deep_thought` 的镜像，并查看它的自有属性，并返回 `this.the_answer` 中保存的值：42。

- 构造函数

  ​	同样的，在定义一个用来作为可以使用 `new` 关键字的构造函数的方法时，`this` 可以被用来指向被创建的对象。 我们重写一下上面的例子来体现这个场景：

  ```html
  <script type="text/javascript">
    function BigComputer(answer) {
      this.the_answer = answer;
      this.ask_question = function () {
      return this.the_answer;
    }
  }
  var deep_thought = new BigComputer(42);
  var the_meaning = deep_thought.ask_question();
  </script>
  ```

  ​	我并没有显示地创建 `deep_thought` 对象，而是写了一个方法来创建 `BigComputer` 对象，然后通过 `new` 关键字将 `deep_thought` 实例化为一个实例变量。当 `new BigComputer()` 被执行的时候，一个全新的对象在后台透明地创建了。`BigComputer()` 方法被调用，然后它的 `this` 关键字被设置为指向 这个新创建的对象。这个函数可以将属性和方法设置到 `this` 上，然后在 `BigComputer` 执行结束后透明地将其返回。

  ​	 注意，尽管如此，`deep_thought.ask_question()` 仍然像以前一样工作。发生了什么，为什么 `this` 在 `the_question` 中的含义与在 `BigComputer` 中的不同？简单来说，我们是通过 `new` 进入 `BigComputer` 的，所以 `this` 表示 `新创建的对象` ，另一方面，我们通过 `deep_thought` 进入 `ask_question` ，所以当我们执行这个方法的时候， `this` 就代表着 `deep_thought` 指向的任意对象。`this` 并不是像其他变量一样从作用域链中读取的，而是基于上下文与上下文间重置的。

- 方法调用

  ​	如果我们只是调用一个简单的，没有这些眼花缭乱的对象的方法呢？ `this` 在这样的情景下指向哪里呢？

  ```html
  <script type="text/javascript">
  function test_this() {
  	return this;
  }
  var i_wonder_what_this_is = test_this();
  </script>
  ```

  ​	在这种情况下，我们没有通过 `new` 来提供一个上下文，也没有提供一个对象形式的上下文。在这里 `this` 会尽可能指向最全局的对象：对 网页来说，就是 `window` 对象。

- 事件处理函数 Event Handler

  For a more complicated twist on the normal function call, let’s say that we’re using a function to handle an `onclick` event. What does `this` mean when the event triggers our function’s execution? Unfortunately, there’s not a simple answer to this question.If we write the event handler inline, `this` refers to the global `window` object:

  对于一个

  However, when we add an event handler via JavaScript, `this` refers to the DOM element that generated the event. (Note: The event handling shown here is short and readable, but otherwise poor. Please use a [real addEvent function](http://dean.edwards.name/weblog/2005/10/add-event2/) instead.):

```html
  function addhandler() {
  document.getElementById(‘thebutton’).onclick = click_handler;
  }

  window.onload = addhandler;
  </script>
  …
  <button id='thebutton'>Click me!</button>
```



### Complications

Let’s run with that last example for a moment longer. What if instead of running `click_handler`, we wanted to ask `deep_thought` a question every time we clicked the button? The code for that seems pretty straightforward; we might try this:

```html
<script type="text/javascript">
function BigComputer(answer) {
	this.the_answer = answer;
	this.ask_question = function () {
		alert(this.the_answer);
	}
}
function addhandler() {
	var deep_thought = new BigComputer(42),
	the_button = document.getElementById(‘thebutton’);

	the_button.onclick = deep_thought.ask_question;
}

window.onload = addhandler;
</script>
```



Perfect, right? We click on the button, `deep_thought.ask_question` is executed, and we get back “42.” So why is the browser giving us `undefined` instead? What did we do wrong?

The problem is simply this: We’ve passed off a reference to the `ask_question` method, which, when executed as an event handler, runs in a different context than when it’s executed as an object method. In short, the `this` keyword in `ask_question` is pointing at the DOM element that generated the event, not at a `BigComputer` object. The DOM element doesn’t have a `the_answer` property, so we’re getting back `undefined` instead of “42.” `setTimeout` exhibits similar behavior, delaying the execution of a function while at the same time moving it out into a global context.

This issue crops up all over the place in our programs, and it’s a terribly difficult problem to debug without keeping careful track of what’s going on in all the corners of your program, especially if your object has properties that *do* exist on DOM elements or the `window` object.

### Manipulating Context With `.apply()` and `.call()`

We really *do* want to be able to ask `deep_thought` a question when we click the button, and more generally, we *do* want to be able to call object methods in their native context when responding to things like events and `setTimeout` calls. Two little-known JavaScript methods, `apply` and `call`, indirectly enable this functionality by allowing us to manually override the /files/includes/default.css value of `this` when we execute a function call. Let’s look at `call`first:

```html
<script type="text/javascript">
var first_object = {
	num: 42
};
var second_object = {
	num: 24
};
function multiply(mult) {
	return this.num * mult;
}

multiply.call(first_object, 5); // returns 42 * 5
multiply.call(second_object, 5); // returns 24 * 5
</script>
```



In this example, we first define two objects, `first_object` and `second_object`, each with a `num` property. Then we define a `multiply` function that accepts a single argument, and returns the product of that argument, and the `num` property of its `this` object. If we called that function by itself, the answer returned would almost certainly be `undefined`, since the global `window`object doesn’t have a `num` property unless we explicitly set one. We need some way of telling `multiply` what its `this` keyword ought refer to; the `call` method of the `multiply` function is exactly what we’re looking for.

The first argument to `call` defines what `this` means inside the executed function. The remaining arguments to `call` are passed into the executed function, just as if you’d called it yourself. So, when `multiply.call(first_object, 5)` is executed, the `multiply` function is called, `5` is passed in as the first argument, and the `this` keyword is set to refer to object `first_object`. Likewise, when `multiply.call(second_object, 5)` is executed, the `multiply` function is called, `5` is passed in as the first argument, and the `this` keyword is set to refer to object `second_object`.

`apply` works in exactly the same way as `call`, but allows you to wrap up the arguments to the called function in an array, which can be quite useful when programatically generating function calls. Replicating the functionality we just talked about using `apply` is trivial:

```html
<script type="text/javascript">
...
multiply.apply(first_object, [5]); // returns 42 * 5
multiply.apply(second_object, [5]); // returns 24 * 5
</script>
```



`apply` and `call` are very useful on their own, and well worth keeping around in your toolkit, but they only get us halfway to solving the problem of context shifts for event handlers. It’s easy to think that we could solve the problem by simply using `call` to shift the meaning of `this` when we set up the handler:

```js
function addhandler() {
	var deep_thought = new BigComputer(42),
	the_button = document.getElementById('thebutton');
	the_button.onclick = deep_thought.ask_question.call(deep_thought);
}
```



The problem with this line of reasoning is simple: `call` executes the function *immediately*. Instead of providing a function reference to the `onclick` handler, we’re giving it *the result* of an executed function. We need to exploit another feature of JavaScript to really solve this problem.

### The Beauty of `.bind()`

I’m not a *huge* fan of the [Prototype JavaScript framework](http://prototype.conio.net/), but I am very much impressed with the quality of its code as a whole. In particular, one simple addition it makes to the `Function` object has had a hugely positive impact on my ability to manage the context in which function calls execute: `bind` performs the same general task as `call`, altering the context in which a function executes. The difference is that `bind` returns a function reference that can be used later, rather than the result of an immediate execution that we get with `call`.

If we simplify the `bind` function a bit to get at the key concepts, we can insert it into the multiplication example we discussed earlier to really dig into how it works; it’s quite an elegant solution:

```html
<script type="text/javascript">
var first_object = {
	num: 42
};
var second_object = {
	num: 24
};
function multiply(mult) {
	return this.num * mult;
}

Function.prototype.bind = function(obj) {
	var method = this,
	temp = function() {
		return method.apply(obj, arguments);
	};

return temp;
}

var first_multiply = multiply.bind(first_object);
first_multiply(5); // returns 42 * 5

var second_multiply = multiply.bind(second_object);
second_multiply(5); // returns 24 * 5
</script>
```



First, we define `first_object`, `second_object`, and the `multiply` function, just as before. With those taken care of, we move on to creating a `bind` method on the `Function` object’s [`prototype`](http://en.wikipedia.org/wiki/Prototype-based_programming), which has the effect of making `bind` available for all functions in our program. When `multiply.bind(first_object)` is called, JavaScript creates an execution context for the `bind` method, setting `this` to the `multiply` function, and setting the first argument, `obj`, to reference `first_object`. So far, so good.

The real genius of this solution is the creation of `method`, set equal to `this` (the `multiply`function itself). When the anonymous function is created on the next line, `method` is accessible via its scope chain, as is `obj` (`this` couldn’t be used here, because when the newly created function is executed, `this` will be overwritten by a new, local context). This alias to `this` makes it possible to use `apply` to execute the `multiply` function, passing in `obj` to ensure that the context is set correctly. In computer-science-speak, `temp` is a [closure](http://www.jibbering.com/faq/faq_notes/closures.html) that, when returned at the end of the `bind` call, can be used in any context whatsoever to execute `multiply` in the context of `first_object`.

This is exactly what we need for the event handler and `setTimeout` scenarios discussed above. The following code solves that problem completely, binding the `deep_thought.ask_question`method to the `deep_thought` context, so that it executes correctly whenever the event is triggered:

```js
function addhandler() {
	var deep_thought = new BigComputer(42),
	the_button = document.getElementById('thebutton');
	the_button.onclick = deep_thought.ask_question.bind(deep_thought);
}
```



Beautiful.

### References

- [JavaScript Closures](http://www.jibbering.com/faq/faq_notes/closures.html) is the best resource on the net for a thorough discussion of closures: what they do, how they do it, and how to use them without going insane.
- The [Protype JavaScript Framework](http://prototype.conio.net/) is full of little nuggets like `bind`. The version available here not only allows the binding of a particular `this` value, but also of some or all of a function’s arguments, which comes in handy all too often.
- [Douglas Crockford’s JavaScript essays](http://javascript.crockford.com/) are excellent resources for both basic and advanced JavaScript programmers. The man knows what he’s talking about, and explains difficult concepts in an easy-to-grasp manner.
- [Variable Scope for New Programmers](http://www.digital-web.com/articles/variable_scope_for_new_programmers/) is a good article if you’d like more discussion of scope from a beginner’s perspective. Written by [Jonathan Snook](http://snook.ca/), and published in this very magazine at the end of last year, it’s still an informative and useful read.