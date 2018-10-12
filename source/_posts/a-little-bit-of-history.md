---
title: 浏览器的history
date: 2018-09-25 13:24:33
tags: [浏览器,history,web,翻译]
---



原文: [A little bit of history](https://medium.com/@pshrmn/a-little-bit-of-history-f245306f48dd)

If you wish to understand React Router, you must first study history. More specifically, the [history](https://github.com/ReactTraining/history) package, which provides the core functionality for React Router. It enables projects to easily add location based navigation on the client-side, which is essential for single page applications.

> 如果你想要理解 React Router，那你必须先学习 history。具体来说，是  [history](https://github.com/ReactTraining/history)  包，它提供了 React Router 的核心功能。它允许项目轻松的在客户端添加基于位置(location)的导航，这对但页面应用来说是至关重要的。

<!--more-->

```
npm install --save history
```

There are three types of history: browser, hash, and memory. The history package exports methods to create each type.

> 共有3种类型的history：browser，hash，和memory。history包导出了用于创建每种类型的方法。

```
import {
  createBrowserHistory,
  createHashHistory,
  createMemoryHistory
} from 'history'
```

If you are using React Router, it can automatically create history objects for you, so you may never have to actually interact with history directly. Still, it is important to understand the differences between each type of history so that you can determine which one is right for your project.

> 如果你使用 React Router，它能自动创建history对象，所以你可能永远不必与history直接交互。然而，理解history的几种类型之间的差异还是很重要的，这样你才能决定哪一种能适用于你的项目。

### What is history? 什么是history？

No matter which type of history you create, you will end up with an object that has nearly the same properties and methods.

> 不论你创建了哪种类型的history，你都将得到一个具有几乎相同属性和方法的对象。

#### Location 位置

The most important property of a history object is the location. The location object reflects “where” your application currently is. It contains a number of properties that are derived from a URL. These are `pathname` ,  `search` [1], and `hash`.

> history 对象最重要的属性是location。location对象反映了你的应用程序当前所在的位置。它包含了从URL派生过来的若干属性。即 `pathname` , `search`[1] ,和 `hash`。

Additionally, each location has a unique `key` property associated with it. This key can be used to identify and store data specific to a location.

> 另外，每个location都有一个唯一的 `key` 属性关联与之关联。这个 `key` 可以被用于标识和存储与特定location相关的数据

Finally, a location can have `state` associated with it. This provides a means of attaching data to a location that is not present in the URL.

> 最后，一个location还能有一个 `state`  与之关联。它提供了一种将数据附加到URL中没有出现的位置的方法。

```
{
  pathname: '/here',
  search: '?key=value',
  hash: '#extra-information',
  state: { modal: true },
  key: 'abc123'
}
```

When a history object is created, it will need an initial location. How this is determined is different for each type of history. For example, the browser history will parse the current URL.

> 当一个 history 对象被创建，它就会需要一个初始的 location。在各种类型的 history 中，如何确定这个初始位置是不同的。例如，`browser history`会将当前的URL转换为当前 location。

#### One location to rule them all? 

While there is only one current location that we can access, the history object keeps track of an array of locations. The ability to add locations and move throughout the location array is what makes history “history”. If history only knew about the current location, it would be more aptly named “present”.

> 虽然我们只能访问一个当前位置，但是 history 对象会跟踪一组 location 。能在 location 数组中完成添加和移动的能力让 history 成为真正的 “history”。如果 history 只知道当前的 location，那么它被叫成 “present” 可能会更合适一点。

In addition to an array of locations, the history also maintains an index value, which refers to the position of current location in the array.

> 除了一组 location ，history 还维护了一个 index 索引值，它指向了 location 数组中当前 location 的位置。

For the memory history, these are explicitly defined. For both the browser and hash histories, the array and index is controlled by the browser and cannot be directly accessed [2].

> 对与 memory history ，这些是明确定义的额。对于 browser 和 hash history，location 数组和 index 索引值都是被浏览器控制并且不可直接访问的[2]。

#### Navigation 导航

An object with a location property isn’t particularly exciting. Where a history object starts to become interesting is with the navigation methods. Navigation methods allow you to change the current location.

> 一个具有 location 属性的对象没什么值得令人兴奋的。history 对象有趣的地方在于 导航（navigation） 方法。导航方法允许你改变当前的 location。

#### Push 

The `push` method allows you to go to a new location. This will add a new location to the array after the current location. When this happens, any “future” locations (ones that exist in the array after the current location because of use of the back button) will be dropped.

> `push`方法让你能跳转到一个新的location。它会在 location 数组中的当前 location 的后面添加一个新的 location。当这种情况发生时，任何 “future” location（那些由于使用了后退按钮在数组中位于 current location 之后的 location） 将被删除。

By default, when you click on a `<Link>` from React Router, it will use `history.push` to navigate.

> 默认情况下，当你从 React Router 点击一个`<Link>`，它将使用 `history.push`来进行导航。

```
history.push({ pathname: '/new-place' })
```

#### Replace

The `replace` method is similar to `push`, but instead of adding a new location, it will replace the location at the current index. “Future” locations will not be dropped.

> `replace` 方法与 `push` 相似，但是不同于添加一个新的 location ，它会替换当前 index 索引位置上的 location。“Future” location 将不会被删除。

Redirects are a good time to use `replace`. This is what React Router’s`<Redirect>` component uses.

> 重定向是使用 `replace` 的好时机。React Router的 `<Redirect>` 也使用它。

For example, if you are on one page and click a link that navigates to a second page, that second page might redirect to a third page. If the redirect uses `push`, clicking the back button from the third will bring you back to the second page (which potentially would redirect you back to the third page again). Instead, by using `replace`, going back from the third page will take you to the first.

> 例如，如果你在一个页面上点击了一个 link 导航到第二个页面上，第二个页面可能重定向到第三个页面。如果重定向使用了 `push` ，在第三个页面点击后退按钮将会带你回到第二个页面（第二个页面可能会再次将你重定向到第三个页面上）。相反，使用 `replace` 从第三页将带你回到第一页。

```
history.replace({ pathname: '/go-here-instead' })
```

#### Go, go, go

Finally, there are three related methods: `goBack`, `goForward`, and `go`.

> 最后，有三个相关的方法：`goBack` ，`goForward` ，and `go`。

`goBack` goes back one page. This essentially decrements the index in the locations array by one.

> `goBack` 回退一页。它实质上将 location 数组上的 index 减 1。

```
history.goBack()
```

`goForward` is the opposite of `goBack`, going forward one page. It will only work when there are “future” locations to go to, which happens when the user has clicked the back button.

> 与 `goBack` 相反，`过Forward` 前进一页。它仅在有 `future`  location 时起作用，当用户点击了后退按钮时会出现这种情况。

```
history.goForward()
```

`go` is a more powerful combination of  `goBack` and  `goForward` . Negative numbers passed to the method will be used to go backwards in the array, and positive numbers will be used to go forward.

> `go` 是 `goBack` 与 `goForward` 的更强大的组合。传给这个方法的负数会被用于在数组中回退，整数会被用于前进。

```
history.go(-3)
```

#### Listen!

History uses the [observer pattern](https://en.wikipedia.org/wiki/Observer_pattern) to allow outside code to be notified when the location changes.

> history 使用[`观察者模式（observer pattern）`](https://en.wikipedia.org/wiki/Observer_pattern) 来允许外部代码在 location 改变时接收通知。

Each history object has a `listen` method, which takes a function as its argument. That function will be added to an array of listener functions that the history stores. Any time the location changes (whether this is by your code calling one of the history methods or because a user clicked a browser button), the history object will call all of its listener functions. This allows you to setup code that will update whenever the location changes.

> 每种 history 对象都有一个 `listen` 方法，接收一个 function 作为参数。这个 function 将被添加到一个 history 存储的监听函数数组中。一旦 location 变动（不论是你的代码调用了一个 history 方法还是一个用户点击了浏览器按钮），history 对象将会调用所有的监听函数。这允许你编写一些在 location 变化时更新的代码。

```
const youAreHere = document.getElementById('youAreHere')
history.listen(function(location) {
  youAreHere.textContent = location.pathname
})
```

A React Router’s router component will subscribe to its history object so that it can re-render whenever the location changes.

> React Router 的路由组件会订阅他的 history 对象，这样无论合适 location 发生了变化，它都能重新渲染。

#### Linking things together

Each history type also has a `createHref` method that can take a location object and output a URL.

> 每种类型的 history 都有一个 `createHref`方法，接收一个 location 对象，输出一个 URL。

Internally, history can navigate using location objects. However, any code that is unaware of the history package, such as anchor elements (`<a>`), does not know what location objects are. In order to generate HTML that will still properly navigate without knowledge of history, we must be able to generate real URLs.

> 在内部，history 可以用 location 对象导航。但是，任何不接触 history 包的代码，例如锚元素（`<a>`）,都不知道 location 对象是什么。为了生成在不了解 history 的情况下仍然能够正确导航的 HTML，我们必须生成真实的 URL。 

```
const location = {
  pathname: '/one-fish',
  search: '?two=fish',
  hash: '#red-fish-blue-fish'
}
const url = history.createHref(location)
const link = document.createElement('a')
a.href = url
// <a href='/one-fish?two=fish#red-fish-blue-fish'></a>
```

------

That covers the essential history API. There are a couple more properties and methods, but the above should be enough to have a solid understanding of how to work with a history object.

> 这覆盖了必要的 history API。还有一些属性和方法，但是上面这些应该足够让你充分了解如何使用 history 对象。

### With our powers combined

There are some differences between the history types that you will need to consider when deciding which is best suited for your project. Between the three of them, any use case should be covered.

> 在决定哪种类型最适合你的项目时，有一些 history 类型之间的差异你需要考虑。这三种类型，应该能够覆盖任何用例。

#### In the Browser

Browser and hash histories are both intended to be used in a browser. They interact with the [history](https://developer.mozilla.org/en-US/docs/Web/API/History) and [location](https://developer.mozilla.org/en-US/docs/Web/API/Location) web APIs so that the current location is the same as the one displayed in your browser’s address bar.

> Browser 和 hash history 都是在浏览器中使用的。它们与  [history](https://developer.mozilla.org/en-US/docs/Web/API/History) 和 [location](https://developer.mozilla.org/en-US/docs/Web/API/Location) web API交互，所以 current location 与浏览器地址栏中显示的是一样的。

```
const browserHistory = createBrowserHistory()
const hashHistory = createHashHistory()
```

The biggest difference between the two is how they create a location from a URL. The browser history uses the full URL [3], while the hash history only uses the portion of the URL located after the first hash symbol.

> 这两者最大的不同是它们如何从一个 URL 创建 location。browser history 将会使用完整 URL[3]，然而 hash history 只会用 URL 中位于第一个 hash 符号（#）之后的部分。

```
// Given the following URL
url = 'http://www.example.com/this/is/the/path?key=value#hash'
// a browser history creates the location object:
{
  pathname: '/this/is/the/path',
  search: '?key=value',
  hash: '#hash'
}
// a hash history creates the location object:
{
  pathname: 'hash',
  search: '',
  hash: ''
}
```

#### Hashing things out

Why would you ever want to use a hash history? When you navigate to a URL, in theory there is a corresponding file on your server.

> 为什么你会想要使用 hash history？当你导航到一个 URL，理论上你的服务器上应该有一个相应的文件。

For servers that can respond to dynamic requests, the requested file does not actually have to exist. Instead, the server will examine the requested URL and decide what HTML to respond with.

> 对那些能够响应动态请求的服务器来说，被请求的文件不必实际存在。相反，服务器会检查请求的 URL ，然后决定返回什么 HTML。

However, a static file server can only return the files that exist on the disk. The most dynamic thing that a static server can do is to return the `index.html` file from a directory when the URL only specifies the directory.

> 然而一个静态文件服务器只能返回服务器上存在的文件。静态服务器能做到的最动态的事情就是当 URL只指定到一个目录的时候返回这个目录下的 `index.html`文件。 

**Update 4/25/18**: I wrote a small article about [Single-Page Applications and the Server](https://medium.com/@pshrmn/single-page-applications-and-the-server-32a23d67936) that should help clarify the different ways a single-page application can be hosted.

> **Update 4/25/18**: 我写了一篇小文关于[Single-Page Applications and the Server](https://medium.com/@pshrmn/single-page-applications-and-the-server-32a23d67936)，应该能够帮助阐明单页面应用程序能够托管的不同方法。

Given the limitations imposed by a static file server, the simplest solution [4] for serving your application is to only have one “real” location on your server to fetch your HTML from. Of course, only having one location means only having one URL for your application, which would defeat the purpose of using history. To get around this limitation, the hash history uses the hash section of the URL to set and read locations.

> 考虑到静态文件服务器施加的限制，为你的应用程序提供服务的最简单的解决方案[4]就是在服务器上只有一个真实的 location  来获取 HTML。当然，只有一个位置意味着你的应用程序只有一个 URL，这破坏了 history 的目的。为了解决这个限制，hash history 使用 URL 的 hash 部分来设置和读取 location。

```
// If example.com uses a static file server, these URLs would
// both fetch html from /my-site/index.html
http://www.example.com/my-site#/one
http://www.example.com/my-site#/two
// However, with a hash history, an application's location will be
// different for each URL because the location is derived from
// the hash section of the URL
{ pathname: '/one' }
{ pathname: '/two' }
```

While the hash history works well, it can be considered a bit of a hack because of its reliance on the storing all of the path information in the hash of a URL. Therefore, it should only be considered when your website does not have a dynamic server to server your HTML.

> 虽然 hash history 工作得很好，但是由于它依赖与将所有 location 信息保存在 URL 的 hash 中，因此可以认为这种方法有一点点 hack。所以当你的网站没有动态服务器来服务你的 HTML 时可以考虑这种方法。 

#### Memory: The Catch-all History

The best thing about memory location is that you can use it anywhere that you can run JavaScript.

> 关于 memory history 的最好的事情是你能在任何可以运行 JavaScript 的地方使用它。

A simple example is that you can use it in unit tests run via Node. That allows you to test code that relies on a history object without having to actually test with a browser.

> 一个简单的例子是你可以在 Node 中运行的单元测试中使用它。这允许你测试一些依赖 history 对象的代码而不必真的用一个浏览器来测试。

More importantly, you can also use a memory history in mobile apps. A memory history is used by `react-router-native` to enable location based navigation in `react-native` apps.

> 更重要的是，你也可以在移动端 app 中使用它。memory history 被`react-router-native` 用于允许在`react-native`app中使用基于 location 的导航。

If you really wanted, you could even use a memory history in the browser (although you would be losing the integration with the address bar).

> 如果你真的想，你甚至可以在浏览器中使用 memory history（但是你会失去与地址栏的集成）。

The biggest difference between the memory history and the browser and hash histories is that it maintains its own in-memory array of locations. When creating a memory history you can pass information to setup the initial state. This state would be an array of locations and the index of the “current” location in that array [5]. This is different from the browser and hash histories, which rely on the browser to already be storing the array of locations.

> memory history 与 browser 和 hash history最大的不同在于它在内存中维护了自己而 location 数组。当创建一个 memory history 的时候你可以传递来设置初始状态。这个状态将是一个 location 数组和这个数组中的 “current” location 的索引[5]。这与 browser 和 hash history不同，后两个依赖于浏览器已经存储了 location 数组。

```
const history = createMemoryHistory({
  initialEntries: ['/', '/next', '/last'],
  initialIndex: 0
})
```

------

While you can roll your own history equivalent code, there are a lot of little gotchas in how browsers handle navigation that can cause a headache. Instead, it is probably easier to rely on history to think about these things for you.

> 虽然你可以创造出自己的 history 等效的代码，但是又很多关于浏览器如何处理导航的小问题会让人头痛。相反，利用 history 对象来思考这些事情可能会更简单。

No matter which history type you end up choosing you will end up with a simple to implement, but powerful way to perform navigation and location-based rendering in your application.

> 不论你最后选用了哪一种  history 类型，你都将得到一个简单易用，但是在应用程序中处理导航和基于位置的渲染的强大方法。

### Notes

[1] The `search` property is a string instead of a parsed object. This is because there are different search string parsing packages that handle some cases slightly differently. Instead of imposing one way to parse search strings, history leaves it up to you to decide how to parse the string. If you are looking for a way to parse search strings, some popular options are [qs](https://www.npmjs.com/package/qs), [query-string](https://www.npmjs.com/package/query-string), [querystring](https://www.npmjs.com/package/querystring), and the native [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).

[2] This restriction is out of security. The browser’s history’s location array contains more than just the locations that have been visited within your application. Allowing access to this list would leak information about a user’s browsing history that websites should not be allowed access to.

[3] By default, the browser history creates location objects whose `pathname` is the URL’s full pathname. However, you can specify a basename for a history, in which case a portion of the full pathname will be effectively ignored.

```
const history = createBrowserHistory({ basename: '/path' })
// given the url: http://www.example.com/path/here
// the history object will create the location
{ pathname: '/here', ... }
```

[4] Theoretically you could serve the same HTML file from every valid URL in your application. If all of your URLs are static, this *could* work, but it would create lots of redundant files. If any of your URLs use parameters to match a large number of possible values, this is infeasible.

[5] If you do not provide a memory history with initial locations and index, it will fallback to default values:

```
entries = [{ pathname: '/' }]
index = 0
```

This might be good enough for most applications, but being able to pre-populate the history can be very useful for things like session restoration.



- [JavaScript](https://medium.com/tag/javascript?source=post)
- [React](https://medium.com/tag/react?source=post)
- [React Router](https://medium.com/tag/react-router?source=post)