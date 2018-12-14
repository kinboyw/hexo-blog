---
title: 理解JavaScript对象
type: categories
copyright: true
date: 2018-12-12 22:55:47
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

原文：[Understanding JavaScript Objects](http://www.javascripttutorial.net/javascript-objects/) 

如果你写过 C++，Java 或者 C#，那你通常会定义类，类是对象的蓝图，然后从这个类创建一些跟这个类具有相同属性和方法的对象。

JavaScript 面向对象编程的方式有所不同。JavaScript 中没有其他面向对象编程语言中的类的概念（ES6中才开始定义了类）。

JavaScript 将对象定义为一组包含了初始值，对象与函数的属性的无序集合。换句话说，对象就是一组键值对（哈希），值就是数据或者函数。

<!--more-->

对象可以在内部类或者用户定义类的基础上创建。创建一个自定义类的最简单的方法就是创建一个 `Object` 的实例，然后向其中添加属性和方法。

```js
var machine = new Object(); 

// property
machine.isOn = false; 

// method
machine.start = function() {    
    this.isOn = true;    
    console.log('Machine has been starting');
}
```

在这个例子中，我们定义了 `Object` 的一个 machine 实例，并且添加了 `isOn` 属性和 `start()` 方法。

另一个方法，可能是更简单的办法，就是用对象表达式创建一个对象。下面的例子创建的 `machine` 对象和前面例子中的 `machine` 对象是一样的。

```js
var machine = {    
    isOn: false,    
    start: function() {        
        this.isOn = true;        
        console.log('Machine has been starting');    
    }
};
```

## 属性的类型

JavaScript 通过用两对方括号包围着内部属性来指定属性的特性，例如 `[[Enumerable]]`。JavaScript 有两种类型的属性：数据属性和访问器属性。

### 数据属性

数据属性中包含数据值的单个地址。一个数据属性有四个元属性，描述如下：

-  `[[Configurarable]]` –  决定一个数据属性是否可以被 `delete` 或者重定义操作删除。
-  `[[Enumerable]]` – 表示数据属性可以在 `for…in` 循环中遍历访问。
-  `[[Writable]]` – 指示数据属性的值是否可以被改变。
-  `[[Value]]` – 包含了数据属性实际的值。是该属性读取和写入值的位置。

默认情况下，直接在一个对象上定义的所有属性的`[[Configurable]]`，`[[Enumerable]]`，和 `[[Writable]]` 属性的值都被设置为 `true` 。`[[Value]]` 属性的默认值是 `undefined`。 

为了改变一个属性的元属性，你可以使用 `Object.defineProperty()` 方法。`Object.defineProperty()` 方法接收三个参数：

- 被定义属性的对象
- 该对象上定义的属性的名称
- 元属性描述对象有四个属性: `configurable`, `enumerable`, `writable`, 和`value` 

如果你用 `Object.defineProperty()` 方法来定义一个对象的属性，`[[Configurable]]`, `[[Enumerable]]`, 和 `[[Writable]]`的默认值都是 `false` ，除非专门指定。

```js
var machine = {};
machine.isOn = false;
delete machine.isOn;
console.log(machine.isOn); // undefined
```

因为默认情况下 `[[Configurable]]` 属性的值为 `true` ，我们可以用 `delete` 操作负删除该属性。

下面的例子创建了一个 `machine` 对象，然后用 `Object.defineProperty()`方法添加了 `isOn` 属性。

```js
var machine = {}; 
Object.defineProperty(machine, 'isOn', {    
    configurable: false,    
    value: false
}); 

delete machine.isOn; // undefined
// Uncaught TypeError: Cannot delete property 'isOn' of #<Object>
```

上面的例子中，我们将 `configurable` 属性设置为 `false` ，因此删除 `isOn` 属性在严格模式中会报错。

另外，如果一个属性被设置为不可配置，它就不可能再变成可配置的了。如果用 `Object.defineProperty()` 方法来更改 writable 以外的任何属性，都会出错。

```js
Object.defineProperty(machine, 'isOn', {    
    configurable: true
});
// Uncaught TypeError: Cannot redefine property: isOn
```

默认情况下，在对象上定义的所有属性的 enumerable 属性都是 true 。意味着你可以用 `for…in` 循环来遍历属性，如下所示：

```js
var machine = {};
machine.isOn = false;
machine.name = 'computer'; 
for (var prop in machine) {    
    console.log(prop);
} 
// isOn
// name
```

下面的代码通过将 enumerable 属性设置为 false ，让 name 属性变成不可遍历的。

```js
// make the name non-enumerable
Object.defineProperty(machine, 'name', {    
    enumerable: false
}); 

for (var prop in machine) {    
    console.log(prop);
}
// isOn
```

### 访问器属性

和数据属性相同，访问器属性也有 `[[Configurable]]` 和 `[[Enumerable]]` 属性。然而，访问器属性有 `[[Get]]` 和 `[[Set]]` 属性而不是 `[[Value]]` 和 `[[Writable]]` 。

当你从访问器属性读取数据时， `[[Get]]` 方法被调用，返回一个值。`[[Get]]`方法的默认返回值是 `undefined` 。相似的，当你给属性赋值一个值时， `[[Set]]` 方法被调用。

要定义一个访问器属性，必须使用 `Object.defineProperty()`方法。看下面的例子： 

```js
var person = {    
    firstName: 'John',    
    lastName: 'Doe'
} 
Object.defineProperty(person, 'fullName', {    
    get: function() {        
        return this.firstName + ' ' + this.lastName;    
    },    
    set: function(value) {        
        var parts = value.split(' ');        
        if (parts.length == 2) {            
            this.firstName = parts[0];            
            this.lastName = parts[1];        
        } else {            
            throw 'Invalid name format';        
        }    
    }
}); 

console.log(person.fullName); // 

person.fullName = 'John Cho'; 
console.log(person.firstName); // John
console.log(person.lastName); // Cho
console.log(person.fullName); // John Cho
```

## 定义多个属性

你可以用 `Object.defineProperty()` 在单个表达式中定义多个属性。



```js
let product = {}; 
Object.defineProperties(product, {    
    name: {        
        value: 'iPhone'    
    },    
    price: {        
        value: 799    
    },    
    tax: {        
        value: 0.1   
    },    
    netPrice: {       
        get: function() {     
            return this.price * (1 + this.tax);   
        }   
    }
}); 

console.log('The net price of ' + product.name +    
            ' is ' + product.netPrice.toFixed(2) + ' USD');
```

## 获取属性的元属性

ES5中引入了新的方法 `Object.getOwnPropertyDescriptor()` ，允许你用它来获取一个对象属性的描述对象。

`Object.getOwnPropertyDescriptor()` 方法接收两个参数：对象和对象的属性，返回对象的描述器。

```js
var descriptor = Object.getOwnPropertyDescriptor(product, 'name'); console.log(descriptor.configurable); // false
console.log(descriptor.writable); // false
console.log(descriptor.enumerable); // false
console.log(descriptor.value); // iPhone
```

