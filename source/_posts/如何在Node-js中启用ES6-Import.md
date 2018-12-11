---
title: 如何在Node.js中启用ES6 Import
type: categories
copyright: true
date: 2018-11-16 23:00:57
tags: [FE,ES6]
categories: 
- [FE,ES6]
---

{%asset_img how-to-enable-es6-imports-in-nodejs.png 600%}

到目前，Node.js 还没有支持 ES6 的 `import` 模块。但是你可以通过 `Babel` 的协助来使用它。

下面是一个 express.js server 的示例。

<!--more-->

# 1. 安装依赖

``` shell
npm install babel-register babel-preset-env --save-dev
```

# 2. 改造Server.js

这是 server.js 的示例代码

``` js
const express = require('express')
const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
copy
```

我们用 **ES6 import** 代替 `require(…)` 

``` js
import express from 'express'
const app = express()

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
copy
```

如果你现在就执行 `node server.js` , 还是会报错 **SyntaxError: Unexpected token import** 。之所以这样是因为我们还没有让 `Babel` 在 Node.js 代码中生效，还需要进一步配置。

# 3. 添加一个入口文件 start.js

这个文件会充当我们的 Node.js 应用程序的入口，其中包含了注册 **babel** 的代码：

```js
// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
})

// Import the rest of our application.
module.exports = require('./server.js')
copy
```

And that's all, from now on, instead of running `node server.js`, start your app as `node start.js` and you will get a hassle-free ES6 Imports support in your node.js application.

到这里就差不多了，现在要运行 `node start.js` 而不是 `node server.js` 了，你的 node.js 应用程序就可以无障碍地使用 ES6 import 模块了。