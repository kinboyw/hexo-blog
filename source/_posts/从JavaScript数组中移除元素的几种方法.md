---
title: 从JavaScript数组中移除元素的几种方法
type: categories
copyright: true
date: 2018-11-13 10:28:12
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

​	{%asset_img jsarray.png 600 "JavaScript Array 删除元素的几种方法"%}

​	JavaScript 数组允许你对元素进行分组和迭代，你可以用不同的方式添加或者删除数组元素，但不幸的是，却并没有一个简单的 Array.remove 的方法。

​	JavaScript 数组有各种各样的方法来删除数组元素，而不是用 `delete` 方法。如果我们用 `delete arr[index]`的方式删除了数组元素，则只是将该数组中索引值为 `index` 的元素置为 `undefined` ，该位置上是一个空元素，并且数组长度不会减少。

​	从数组头部删除元素用 `shift` ，从尾部删除元素用 `pop` ，从中间删除元素用 `splice` ，还可以用 `filter` 方法来过滤出符合条件的元素，并将这些元素返回一个新的数组，这是一个更高级的用法。

<!--more-->

### 从JavaScript Array 尾部移除元素

可以通过设置数组的 `length` 属性来打到移除末端元素的效果，当新设置的 `length` 属性的值，小于当前数组长度时，索引值大于新的 `length` 属性的元素都会自动被删除。

```JavaScript
var ar = [1, 2, 3, 4, 5, 6];
ar.length = 4; // set length to remove elements
console.log( ar ); //  [1, 2, 3, 4]
```

`pop` 方法移除数组末端的最后一个元素，返回这个元素，更新 `length` 属性。

```javascript
var ar = [1, 2, 3, 4, 5, 6];
ar.pop(); // returns 6
console.log( ar ); // [1, 2, 3, 4, 5]
```

### 从JavaScript Array 头部移除元素

`shift` 方法会删除数组索引为 `0` 的元素，返回被删除的元素，删除后，剩余元素会向下移动。

```javascript
var ar = ['zero', 'one', 'two', 'three'];
ar.shift(); // returns "zero"
console.log( ar ); // ["one", "two", "three"]
```

当数组中元素为空，或者 `length` 为0时，方法返回 `undefined` 

### 用 splice 方法移除 JavaScript  Array 元素

`splice` 方法用于删除数组元素，也可以新增元素。第一个参数指定增加或者删除的起始位置，第二个参数指定要移除的元素个数。第三个参数以及后续的参数都是可选参数；他们指定了要被加入到数组中的元素。

下面的例子将从数组的第三个元素开始删除两个元素（数组从0开始）

```javascript
var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var removed = array.splice(2,2);

/*
removed === [3, 4]
array === [1, 2, 5, 6, 7, 8, 9, 0]
*/
```

`splice` 方法返回一个由被删除元素组成的数组

### 用 splice 方法删除 JavaScript Array 中的特定值的元素

如果知道想要从数组中删除的值，也可以用 `splice` 方法。但是也要先获取目标元素的索引，然后用根据索引来删除该元素

```javascript
var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

for( var i = 0; i < array.length-1; i++){ 
   if ( array[i] === 5) {
     arr.splice(i, 1); 
   }
}

//=> [1, 2, 3, 4, 6, 7, 8, 9, 0]
```

这是一个简单的例子，元素都是整数。如果数组元素是 object 类型，那么方法就会复杂的多了。

### 用 filter 方法移除 JavaScript Array 中的特定值的元素

不同于 `splice` 方法，`filter` 会创建一个新的数组，即不会改变调用 `filter` 方法的数组，不会产生副作用。

`filter` 方法只接收一个 `callback` 方法作为参数。当`fulter` 方法遍历数组元素时触发 `callback` 方法。`callback` 接收三个参数：当前元素的值，当前元素的索引，整个数组。

`callback` 方法返回 `true` 或者 `false` ，元素返回 `true` 还是 `false` 由你决定，返回为`true` 的元素将被加入到 `filter` 方法的返回数组中。

```javascript
var array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
var filtered = array.filter(function(value, index, arr){
    return value > 5;
});

//filtered => [6, 7, 8, 9]
//array => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]
```

### Lodash Array 删除方法

有时候使用现成的工具库来解决复杂问题是最佳的实践。Lodash 提供了一套丰富的数组操作方法，其中一个就是 `remove` 。Lodash 的 `remove` 方法与 JavaScript Array 的 `filter` 方法非常相似，但是它不会保存原始数组，即会产生副作用，它会删除匹配元素，并将删除的元素作为一个新的数组返回

```javascript
var array = [1, 2, 3, 4];
var evens = _.remove(array, function(n) {
  return n % 2 === 0;
});
console.log(array);
// => [1, 3]
console.log(evens);
// => [2, 4]
```

### 手写一个 Remove 方法

原生 JS 没有提供 Array.remove方法。Lodash 的 `remove` 方法的确可以解决问题，但是并不是总想要去引用 Lodash 的类库的。我们可以手写一个 remove 方法出来，这篇文章 [model to follow](https://johnresig.com/blog/javascript-array-remove/) 给出了一个例子，但是它是通过扩展 Array 对象的原型来实现的，这不是一个好主意。

下面是我实现的一个简单的例子：

```javascript
function arrayRemove(arr, value) {

   return arr.filter(function(ele){
       return ele != value;
   });

}

var result = arrayRemove(array, 6);

// result = [1, 2, 3, 4, 5, 7, 8, 9, 0]
```

### 使用 Delete 操作符显示地删除数组元素

你也可以使用 `delete` 运算符来删除数组元素

```javascript
var ar = [1, 2, 3, 4, 5, 6];
delete ar[4]; // delete element with index 4
console.log( ar ); // [1, 2, 3, 4, undefined, 6]
alert( ar ); // 1,2,3,4,,6
```

使用 `delete` 操作符不会影响数组的 `length` 属性，也不会影响后续元素的索引值。会将数组变成稀疏数组。

`delete` 操作符是被设计用于删除 JavaScript object 类型属性的，数组也是一种特殊的 object 类型。

元素没有真正被从数组中删除的原因是 `delete` 操作符的作用更多的是释放内存，而不是删除元素。当不再有对这个值的引用时，内存就会自动释放。