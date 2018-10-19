# JavaScript Array

Array.from()

> Array.from(array-like [, mapFn [, thisArg]])

- Array from a String

  ```js
  Array.from('Hello world!')
  [ 'H', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd', '!' ]
  ```

- Array from a Set

- ```js
  > var s = new Set(["foo","bar"])
  undefined
  > Array.from(s);
  [ 'foo', 'bar' ]
  ```

  Array from a Map

  ```js
  > var m = new Map([[1,2],[2,4],[4,8]]);
  undefined
  > m
  Map { 1 => 2, 2 => 4, 4 => 8 }
  > Array.from(m);
  [ [ 1, 2 ], [ 2, 4 ], [ 4, 8 ] ]
  > Array.from(m.values());
  [ 2, 4, 8 ]
  > Array.from(m.keys());
  [ 1, 2, 4 ]
  ```

- Array from an Array-like Object (arguments)

  ```js
  > function f(x){
  ...     return Array.from(arguments);
  ... }
  undefined
  > f(1, 2, 3);
  [ 1, 2, 3 ]
  ```

- arrow function and Array.from

  ```js
  //lambda表达式作 map 函数
  > Array.from([1,3,4],x => x+2);
  [ 3, 5, 6 ]
  //生成一个数值数组
  //数组初始化时每个元素的初始值为 undefined 
  //所以 v 的值为 undefined
  Array.from({length:5},(v,i) => i);
  ```

- 序列生成器

  ```js
  //序列生成器
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + (i * step));
  
  // 生成 0 - 4 的数值数组
  range(0, 5, 1);
  // [0, 1, 2, 3, 4]
  
  // Generate the alphabet using Array.from making use of it being ordered as a sequence
  range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1, 1).map(x => String.fromCharCode(x));
  // ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
  ```

- ```
  $arg_ paraA  $arg__site
  ```