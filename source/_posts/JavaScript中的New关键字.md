---
title: JavaScript中的New关键字
type: categories
copyright: true
date: 2019-02-15 11:31:52
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

The `new` keyword in JavaScript can be quite confusing when it is first encountered, as people tend to think that JavaScript is not an object-oriented programming language.

- What is it?
- What problems does it solve?
- When is it appropriate and when not?



It does 5 things:

1. It creates a new object. The type of this object is simply *object*.
2. It sets this new object's internal, inaccessible, *[[prototype]]* (i.e. **__proto__**) property to be the constructor function's external, accessible, *prototype* object (every function object automatically has a *prototype* property).
3. It makes the `this` variable point to the newly created object.
4. It executes the constructor function, using the newly created object whenever `this` is mentioned.
5. It returns the newly created object, unless the constructor function returns a non-`null` object reference. In this case, that object reference is returned instead.

Note: *constructor function* refers to the function after the `new` keyword, as in

```
new ConstructorFunction(arg1, arg2)
```

Once this is done, if an undefined property of the new object is requested, the script will check the object's *[[prototype]]* object for the property instead. This is how you can get something similar to traditional class inheritance in JavaScript.

The most difficult part about this is point number 2. Every object (including functions) has this internal property called *[[prototype]]*. It can *only* be set at object creation time, either with *new*, with *Object.create*, or based on the literal (functions default to Function.prototype, numbers to Number.prototype, etc.). It can only be read with *Object.getPrototypeOf(someObject)*. There is *no*other way to set or read this value.

Functions, in addition to the hidden *[[prototype]]* property, also have a property called *prototype*, and it is this that you can access, and modify, to provide inherited properties and methods for the objects you make.

------

Here is an example:

```
ObjMaker = function() {this.a = 'first';};
// ObjMaker is just a function, there's nothing special about it that makes 
// it a constructor.

ObjMaker.prototype.b = 'second';
// like all functions, ObjMaker has an accessible prototype property that 
// we can alter. I just added a property called 'b' to it. Like 
// all objects, ObjMaker also has an inaccessible [[prototype]] property
// that we can't do anything with

obj1 = new ObjMaker();
// 3 things just happened.
// A new, empty object was created called obj1.  At first obj1 was the same
// as {}. The [[prototype]] property of obj1 was then set to the current
// object value of the ObjMaker.prototype (if ObjMaker.prototype is later
// assigned a new object value, obj1's [[prototype]] will not change, but you
// can alter the properties of ObjMaker.prototype to add to both the
// prototype and [[prototype]]). The ObjMaker function was executed, with
// obj1 in place of this... so obj1.a was set to 'first'.

obj1.a;
// returns 'first'
obj1.b;
// obj1 doesn't have a property called 'b', so JavaScript checks 
// its [[prototype]]. Its [[prototype]] is the same as ObjMaker.prototype
// ObjMaker.prototype has a property called 'b' with value 'second'
// returns 'second'
```

It's like class inheritance because now, any objects you make using `new ObjMaker()` will also appear to have inherited the 'b' property.

If you want something like a subclass, then you do this:

```
SubObjMaker = function () {};
SubObjMaker.prototype = new ObjMaker(); // note: this pattern is deprecated!
// Because we used 'new', the [[prototype]] property of SubObjMaker.prototype
// is now set to the object value of ObjMaker.prototype.
// The modern way to do this is with Object.create(), which was added in ECMAScript 5:
// SubObjMaker.prototype = Object.create(ObjMaker.prototype);

SubObjMaker.prototype.c = 'third';  
obj2 = new SubObjMaker();
// [[prototype]] property of obj2 is now set to SubObjMaker.prototype
// Remember that the [[prototype]] property of SubObjMaker.prototype
// is ObjMaker.prototype. So now obj2 has a prototype chain!
// obj2 ---> SubObjMaker.prototype ---> ObjMaker.prototype

obj2.c;
// returns 'third', from SubObjMaker.prototype

obj2.b;
// returns 'second', from ObjMaker.prototype

obj2.a;
// returns 'first', from SubObjMaker.prototype, because SubObjMaker.prototype 
// was created with the ObjMaker function, which assigned a for us
```

------

I read a ton of rubbish on this subject before finally finding [this page](http://joost.zeekat.nl/constructors-considered-mildly-confusing.html), where this is explained very well with nice diagrams.



手写一个 new 的实现

```js
function New(func) {
    var res = {};
    if (func.prototype !== null) {
        res.__proto__ = func.prototype;
    }
    var ret = func.apply(res, Array.prototype.slice.call(arguments, 1));
    if ((typeof ret === "object" || typeof ret === "function") && ret !== null) {
        return ret;
    }
    return res;
}
```

