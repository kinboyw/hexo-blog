---
title: 探索JavaScript构造函数与原型继承
type: categories
copyright: true
date: 2019-02-15 11:39:40
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

> In javascript, every object has a constructor property that refers to the constructor function that initializes the object.

Sounds nice: it makes constructors sound static like classes in Java. Even the `new Constructor()` syntax looks like it. And it seems true:

```
function MyConstructor() {}
var myobject = new MyConstructor();
myobject.constructor == MyConstructor;     // true
```

But life isn’t that simple:

```
function MyConstructor() {}
MyConstructor.prototype = {};
var myobject = new MyConstructor();

myobject.constructor == MyConstructor;  // false
```

<!--more-->

## What’s going on? Some definitions



### Objects and methods

Javascript[1](https://zeekat.nl/articles/constructors-considered-mildly-confusing.html#fn.1) objects are simply bags of named properties that you can read and set. Javascript does not have classes.

Functions in javascript are first-class objects. Methods in javascript are just properties that are functions.

### Prototypes

The *prototype* of an object is an internal property that I’ll refer to here as {Prototype}. In other words, `obj.prototype` is in general **not** the `obj`’s {Prototype}. The standard does not provide *any* way to retrieve the {Prototype} property from an object.

### Property lookup

Javascript objects can delegate properties to their {Prototype} and their {Prototype} can do the same; all the way up to `Object.prototype`.

Whenever a property *propname* of an object is read, the system checks if that object has a property named *propname*. If that propery does not exist, the system checks the object’s {Prototype} for that property, recursively.

This means that objects that share a {Protoype} also share the properties of that {Prototype}.

### Setting properties

Whenever a property *propname* of an object is set, the property is inserted into that object, ignoring the {Prototype} chain of that object.

The {Prototype} property is set from the (public) `prototype` property of the constructor function when constructor function is called.

## What’s going on? Line by line.

This is what the relevant `prototype` and {Prototype} properties look like. The ellipses are objects, the arrows are properties that reference other objects. The {Prototype} chain(s) are in green.

### #1: Define constructor function

```
function MyConstructor() {}
```

![graph1.png](https://zeekat.nl/articles/graph1.png)

Fairly simple. `MyConstructor.prototype` is an object that’s automatically created which in turn has a `constructor` property pointing back at `MyConstructor`. Remember that: the only objects that in fact have a `constructor` property by default are the automatically created`prototype` properties of functions.

The rest isn’t really relevant but may confuse and enlighten (and hopefully in that order):

`MyConstructor`’s {Prototype} is `Function.prototype`, not `MyConstructor.prototype`. Also note that the {Prototype} chain for each object ends up at `Object.prototype`.

`Object.prototype`’s {Prototype} is actually `null` indicating that it’s the end of the chain. [2](https://zeekat.nl/articles/constructors-considered-mildly-confusing.html#fn.2)

For the next steps I’m leaving out the {Prototype} chain of `MyConstructor` for clarity, since it doesn’t change and it’s not relevant.

### #2: Assign new prototype property

```
MyConstructor.prototype = {}
```

![graph2.png](https://zeekat.nl/articles/graph2.png)

We’ve now done away with the predefined MyConstructor.protoype object and replaced it with an anonymous object, shown here as `{}`. This object does not have a constructor property,

### #3: Call constructor to create new object

```
var myobject = new MyConstructor();
```

![graph3.png](https://zeekat.nl/articles/graph3.png)

From this graph, following the L</property lookup> rules, we can now see that myobject.constructor is delegated to Object.prototype.constructor, which points to Object. In other words:

```
function MyConstructor() {}
MyConstructor.prototype = {};
var myobject = new MyConstructor();

myobject.constructor == Object // true
```

## What about `instanceof` ?

Javascript provides the instanceof operator that’s intended to check the prototype chain of the object you’re dealing with. From the above you might think that the following would return false:

```
function MyConstructor() {}
MyConstructor.prototype = {};
var myobject = new MyConstructor();

myobject instanceof MyConstructor  // true
```

But in fact it works. It also notices that myobject delegates to Object.prototype:

```
function MyConstructor() {}
MyConstructor.prototype = {};
var myobject = new MyConstructor();

myobject instanceof Object  // true
```

When `instanceof` is called it checks the `prototype` property of the given constructor and checks it agains the {Prototype} chain of the given object. In other words, it’s not dependent on the `constructor` property.

All nice and dandy, but you *can* still break it if you try hard enough:

```
function MyConstructor() {}
var myobject = new MyConstructor();
MyConstructor.prototype = {};

[ myobject instanceof MyConstructor,     // false !
  myobject.constructor == MyConstructor, // true !
  myobject instanceof Object ]           // true
```

This is what the prototype chains look like after running that:

![graph4.png](https://zeekat.nl/articles/graph4.png)

## Constructors are not classes

In a class-based object system, typically classes inherit from each other, and objects are instances of those classes. Methods and properties that are shared between instances are (at least conceptually) properties of a class. Properties (and for some languages, methods) that should not be shared are properties of the objects themselves.

Javascript’s constructors do nothing like this: in fact constructors have their own {Prototype} chain *completely separate* from the {Prototype} chain of objects they initialize.

## Constructors do not work like class-based initializers

A constructor call associates a new object with a {Prototype} the constructor function *may*set additional properties on the object. Constructor calls do **not** call “inherited” constructors, and they shouldn’t because the object’s {Prototype} (the constructor’s`prototype`) is assumed to be shared and (probably) already initialized.

## Constructors are just functions

Any user-defined function in javascript automatically gets a `prototype` property which in turn has a `constructor` property that refers back to the function.

Any user-defined function in javascript can be called as a constructor by prepending `new` to the call. This will pass a new `this` object to the function and its {Prototype} property will be set to the `prototype` property of the function.

## References



### A comp.lang.javascript question

```
Subject: "x.constructor == Foo" vs "x instanceof Foo".
Message-ID: <fniu6a$2cn$1@reader2.panix.com>>
http://groups.google.com/group/comp.lang.javascript/msg/102ab20c68aa738f
```

### Ecma-262

[Standard ECMA-262. ECMAScript Language Specification 3rd edition (December 1999)](http://www.ecma-international.org/publications/standards/Ecma-262.htm)

### Flanagan 2006

JavaScript: The Definitive Guide, Fifth Edition. ISBN 10: 0-596-10199-6 | ISBN 13:9780596101992