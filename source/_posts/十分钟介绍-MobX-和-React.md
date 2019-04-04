---
title: 十分钟介绍 MobX 和 React
type: categories
copyright: true
date: 2019-03-24 13:45:00
tags: [FE,JavaScript]
categories: 
- [FE,JavaScript]
---

原文：[Ten minute introduction to MobX and React](https://mobx.js.org/getting-started.html)

[`MobX`](https://github.com/mobxjs/mobx) 是一个简单的，可扩展并且经过实战考研的状态管理解决方案。这篇教程将会花10分钟时间教会你关于 MobX 的全部重要概念。MobX 是一个独立的库，但是大多数人会将它和 React 组合使用，本篇教程也将关注这种组合的用法。

<!--more-->

### 核心概念

状态是每个应用程序的核心，没有比使用不一致的状态，或者四处分散且不能同步的本地变量组成的状态更容易创造出充满错误和不可管理的应用程序了。因此很多状态管理解决方案都会限制修改状态的方式，例如使用不可变状态。但是这样做会引入新的问题；数据需要规范化，参照完整性就不能得到保证，于是就不再可能使用像原型这样强大的概念。*

MobX 通过解决了根本问题使得数据管理再次变得简单：它保证了不可能创造出不一致状态。实现的策略很简单：确定一切能够从应用程序的状态继承的，都将从应用程序的状态继承。并且自动完成继承。

概念上，MobX 对待你的应用程序与电子表格类似。

![img](https://mobx.js.org/getting-started-assets/overview.png) 

1. 首先，应用程序中有 state（状态）。即构成应用程序的数据模型中的对象，数组，基础值，引用组成的图表。这些值是你应用程序的数据单元
2. 然后有 derivations（求导）。基本上是指所有能够根据应用程序的 state 自动计算出的值。这些 derivation， 或者计算值的范围可以是从简单值类型，例如未完成的 todo 数量，到复杂类型例如 todo 的可视化 HTML 表示。电子表格中的等价物：那些公式和应用程序的图表。
3. *Reaction*（反应）和 derivation 十分相似。主要的差异在于 react 不会创造得出一个值，而是通过自动运行来执行一些任务。通常是 I/O 相关的。它们用来确定 DOM 被更新，或者网络请求会在正确的时间自动执行等。
4. 最后是 action（动作）。action 是所有能够改变状态的东西。MobX 将会确保所有通过 ation 对状态所做的修改都能自动被所有的 derivation 和 reaction 处理。同步并且无干扰。

### 一个简单的 todo store

原理说得够多了，实践操作一下可能会比认真阅读上面那些东西学到更多。为了从头开始，我们先创建一个非常简单的 ToDo store。注意下方的所有代码块都是可编辑的，点击 `run code` 按钮执行代码。下面是一个非常直接的 `TodoStore` ，用来管理一个 todo 集合。还没有引入 MobX。

```jsx
class TodoStore {
    todos = [];

    get completedTodosCount() {
        return this.todos.filter(
            todo => todo.completed === true
        ).length;
    }

    report() {
        if (this.todos.length === 0)
            return "<none>";
        return `Next todo: "${this.todos[0].task}". ` +
            `Progress: ${this.completedTodosCount}/${this.todos.length}`;
    }

    addTodo(task) {
        this.todos.push({
            task: task,
            completed: false,
            assignee: null
        });
    }
}

const todoStore = new TodoStore();
                        
```

我们创建了一个 `todoStore` 的实例，实例中包含了 `todo` 的集合。给这个 todoStore 添加一些对象。为了确保看到修改的效果，我们在每次改变之后调用 `todoStore.report` 来输出日志。注意 report 故意始终只打印第一个任务。这使得这个例子非常人工，但是你将会在下面看到它能很好地证明 MobX 的依赖追踪是多么的动态。

```jsx
todoStore.addTodo("read MobX tutorial");
console.log(todoStore.report());

todoStore.addTodo("try MobX");
console.log(todoStore.report());

todoStore.todos[0].completed = true;
console.log(todoStore.report());

todoStore.todos[1].task = "try MobX in own project";
console.log(todoStore.report());

todoStore.todos[0].task = "grok MobX tutorial";
console.log(todoStore.report());
                        
```

### 变得响应式

目前，这部分代码还没有什么特别之处。但是如果我们不必显示执行 `report` ，而是可以只用声明我们想要它在每一次状态改变时都被触发执行呢？这样能够将我们从负责在代码库中任何可能影响 report 结果的地方调用 `report` 的工作中解放出来。我们只需要确定最后的 report 被打印出来。但是不想花费精力来维护部分代码。

幸运的是这正是 MobX 能够为你做的。自动执行代码只取决于状态。所以我们的 `report` 方法自动更新，就像电子表格中的图表一样。为了实现这一点，`TodoStore` 必须变成可观察的，这样 MobX 就能够追踪所有产生的修改。我们修改一下这个类来实现这样的功能。

同样，`completedTodosCount` 属性可以自动从 todo 列表继承。通过使用 `@observable` 和 `@computed` 装饰器，我们能够在一个对象中引入可观察属性：

```jsx
class ObservableTodoStore {
    @observable todos = [];
    @observable pendingRequests = 0;

    constructor() {
        mobx.autorun(() => console.log(this.report));
    }

    @computed get completedTodosCount() {
        return this.todos.filter(
            todo => todo.completed === true
        ).length;
    }

    @computed get report() {
        if (this.todos.length === 0)
            return "<none>";
        return `Next todo: "${this.todos[0].task}". ` +
            `Progress: ${this.completedTodosCount}/${this.todos.length}`;
    }

    addTodo(task) {
        this.todos.push({
            task: task,
            completed: false,
            assignee: null
        });
    }
}


const observableTodoStore = new ObservableTodoStore();
                        
```

就是它！我们将一些属性标记为 `@observable` 来通知 MobX 这些值可能随时变化。计算用 `@computed` 装饰以标识这些可以从 state 继承。

`pendingRequests` 和 `assignee` 属性目前还没有使用，但是会在这个教程的后面的部分用到。为了简洁，本页的所有示例都是用 ES6，JSX 和装饰器。但是不用担心，MobX 中的所有装饰器在 [ES5](https://mobx.js.org/best/decorators.html) 中都有对等的概念。

在构造函数中，我们创建了一个用来打印 `report` 的方法，并用 `autorun`包裹起来。Autorun 创建一个运行一次的 reaction，创建之后每当应用程序内部使用的任意可观察数据发生改变时自动再次执行。因为 `report` 使用了 可观察的 `todos` 属性，它将会在任何合适的时候打印 report 。下一个列表中会证实这一点。点击 `run` 按钮运行代码： 

```jsx
observableTodoStore.addTodo("read MobX tutorial");
observableTodoStore.addTodo("try MobX");
observableTodoStore.todos[0].completed = true;
observableTodoStore.todos[1].task = "try MobX in own project";
observableTodoStore.todos[0].task = "grok MobX tutorial";
```

很有趣对吧？`report` 自动地，同步地打印出来，不会泄漏中间值。如果仔细观察日志，你会发现第四行没有产生新的日志行。因为 report 没有因为重命名而真正地改变，尽管后端的数据的确改变了。另一方面，改变第一条 todo 的名称的确更新了 report，因为更新的名称出现在了 report 中。这很好地证明了不只是 `todos` 数组被  `autorun` 观察了，todo 数组元素的内部属性也被观察了。

### 让 React 变得响应式

好的，目前我们实现了一个很蠢的响应式 report。是时候用这个同样的 store 实现一个响应式的用户界面了。React 组件（不管名字如何）并不是开箱即用的响应式。`mobx-react` 包中的 `@observer` 装饰器通过将 React 组件的 `render` 方法包裹在 `autorun` 中解决了这个问题，自动保持组件与 state 同步。这在概念上和我们前面处理 `report` 的方式没什么不同。

下面的清单定义了一些 React 组件。其中唯一与 MobX 有个的东西就是 `@observer` 装饰器。这些就足以保证每个组件在数据发生变化时能够独立完成重渲染。你不再需要调用 `setState` ，也不需要搞清楚如何使用选择期或者需要配置的高阶组件来订阅应用程序状态的正确部分。基本上所有的组件都变得更加聪明了。然而他们是以一种愚蠢的陈述性的方式声明的。

点击 `run code` 按钮来看看下面代码的运行结果。下面的代码列表是可编辑的，所以请随意玩耍。可以试试移除所有的 `@observer` 调用，或者只移除装饰 `TodoView` 的那个。右边预览区域的数字会在每次组件重新渲染时高亮。

```jsx
@observer
class TodoList extends React.Component {
  render() {
    const store = this.props.store;
    return (
      <div>
        { store.report }
        <ul>
        { store.todos.map(
          (todo, idx) => <TodoView todo={ todo } key={ idx } />
        ) }
        </ul>
        { store.pendingRequests > 0 ? <marquee>Loading...</marquee> : null }
        <button onClick={ this.onNewTodo }>New Todo</button>
        <small> (double-click a todo to edit)</small>
        <RenderCounter />
      </div>
    );
  }

  onNewTodo = () => {
    this.props.store.addTodo(prompt('Enter a new todo:','coffee plz'));
  }
}

@observer
class TodoView extends React.Component {
  render() {
    const todo = this.props.todo;
    return (
      <li onDoubleClick={ this.onRename }>
        <input
          type='checkbox'
          checked={ todo.completed }
          onChange={ this.onToggleCompleted }
        />
        { todo.task }
        { todo.assignee
          ? <small>{ todo.assignee.name }</small>
          : null
        }
        <RenderCounter />
      </li>
    );
  }

  onToggleCompleted = () => {
    const todo = this.props.todo;
    todo.completed = !todo.completed;
  }

  onRename = () => {
    const todo = this.props.todo;
    todo.task = prompt('Task name', todo.task) || todo.task;
  }
}

ReactDOM.render(
  <TodoList store={ observableTodoStore } />,
  document.getElementById('reactjs-app')
);
                        
```

下面的代码很好地展示了我们除了更新数据以外不需要做其他任何事情。MobX 将会自动地从 store 中的状态继承并更新用户界面。

```js
const store = observableTodoStore;
store.todos[0].completed = !store.todos[0].completed;
store.todos[1].task = "Random todo " + Math.random();
store.todos.push({ task: "Find a fine cheese", completed: true });
// etc etc.. add your own statements here...
                        
```

### 使用引用

上面我们已经创建了可观察对象（基于原型的对象和纯对象），数组和基础值。你可能想知道，MobX 中如何处理引用？我的状态能否形成一个图？在前面的清单中你可能已经注意到了 todos 中包含了 `assignee` 属性。我们通过引入另一个包含了people的 “store“ （好吧，这只是一个美化的数组）来给他们赋值，然后分派任务给他们。

```js
var peopleStore = mobx.observable([
    { name: "Michel" },
    { name: "Me" }
]);
observableTodoStore.todos[0].assignee = peopleStore[0];
observableTodoStore.todos[1].assignee = peopleStore[1];
peopleStore[0].name = "Michel Weststrate";
                        
```

我们现在有两个独立的 store 了。一个包含了 people，一个包含了 todos。当我们将一个 `assignee` 指配给一个 people store 中的人时，我们只是指配了一个引用。这些改变回自动被 `TodoView` 获取。有了 MobX 以后就不用先对数据进行标准化也不用写选择器来保证组件被更新。事实上 store 中保存的数据是什么都不重要了。只要对象被变成了可观察的，MobX 就能够追踪他们。真正的 JavaScript 引用将起作用。如果他们是和 derivation 有关系的，那么 MobX 将会自动追踪他们。为了测试这一点，试试在下面的的输入框内改变你的名字（要确保先点击了上面的 `run code` 按钮）

------

Your name: 

------

顺便一提，上面输入框的 HTML 很简单：

```
<input onkeyup="peopleStore[1].name = event.target.value" />
```

### 异步 action

因为我们的 Todo 应用程序中的每一部分都是从 state 派生出的，所以 state 什么时候改变都不重要。这使得创建异步 action 非常直接。直接点击下面的按钮（多次点击）来模仿异步加载新的 todo 项：

------

Load todo

------

这部分背后的代码也相当直接。我们从更新 store 属性 `pendingRequests` 开始来让 UI 反应出当前加载状态。一旦加载结束，我们就更新 store 中的 todos，并且减少 `pendingRequests` 计数器。直接对比这个代码段和前面的 `TodoList` 定义来看看 pendingRequests 是如何运用的。

```
observableTodoStore.pendingRequests++;
setTimeout(function() {
    observableTodoStore.addTodo('Random Todo ' + Math.random());
    observableTodoStore.pendingRequests--;
}, 2000);
```



### 开发工具

[`mobx-react-devtools`](https://github.com/mobxjs/mobx-react-devtools) 提供了开发工具，显示在屏幕的右上方并且可以被任意 MobX + ReactJS 应用使用。点击第一个按钮将会高亮每一个正在被重渲染的 `@observer` 组件。如果点击第二个按钮，然后再点击预览中的任意一个组件，这个组件的依赖树就会显示出来，这样你可以准确地观察任意给定时刻正在被观察的数据。

### 结论

以上就是全部了！没有反复套用的模板。只是一些组成我们的整个 UI 的简单的，声明式的组件。这些组件都是完全地，响应式地从我们的 state 中派生出来的。你现在可以在你的应用程序中使用 `mobx` 和 `mobx-react` 了。学到这里简单的总结一下：

1. 使用 `@observable` 装饰器或者 `observable(object 或者 array)` 方法来为 MobX 创建出可追踪对象。
2.  `@computed` 装饰器可以被用来创建能够自动从 state 中派生出值的方法。
3. 使用 `autorun` 来自动运行依赖于一些 ovservable state 的方法。这对于输出日志，发起网络请求等是很有用的。
4. 使用 `mobx-react` 中的  `@observer` 装饰器来让你的 React 组件变得真正响应式。他们将会自动并且高效地更新。即使应用于具有大量数据的大型复杂应用。

可以随意调试上面的可编辑代码块来感受一下 MobX 是如何对你的修改作出反应的。例如你可以在 `report` 方法被调用时添加日志描述。或者完全不显示 `report` 看看是如何影响 `TodoList` 渲染的。或者只在特定情况下显示。

### MobX 不是一个状态容器

人们镜常用 MobX 来替代 Redux。 但是请注意 MobX 只是用来解决一个技术问题的库，不是一个框架，甚至内部没有包含状态容器。从这个意义上来说，上面的例子都是人为的。建议使用适当的工程实践，例如在方法中封装逻辑，在 store 或者 controller 中组织他们等等。或者如 HackerNews 所述：

> *“MobX, it's been mentioned elsewhere but I can't help but sing its praises. Writing in MobX means that using controllers/ dispatchers/ actions/ supervisors or another form of managing dataflow returns to being an architectural concern you can pattern to your application's needs, rather than being something that's required by default for anything more than a Todo app.”*



### Learn more

Intrigued? Here are some useful resources:

- [MobX on GitHub](https://github.com/mobxjs/mobx)
- [Api documentation](https://mobxjs.github.io/mobx)
- (Blog) [Making React reactive: the pursuit of high performing, easily maintainable React apps](https://www.mendix.com/tech-blog/making-react-reactive-pursuit-high-performing-easily-maintainable-react-apps/)
- (Blog) [Becoming fully reactive: an in-depth explanation of Mobservable](https://medium.com/@mweststrate/becoming-fully-reactive-an-in-depth-explanation-of-mobservable-55995262a254#.4kvwpd2nh)

------

- [JSFiddle](https://jsfiddle.net/mweststrate/wv3yopo0/) with a simple todo app
- [MobX, React, TypeScript boilerplate](https://github.com/mobxjs/mobx-react-typescript-boilerplate)
- [MobX, React, Babel boilerplate](https://github.com/mobxjs/mobx-react-boilerplate)
- [MobX demo from Reactive2015 conference](https://github.com/mobxjs/mobx-reactive2015-demo)
- [MobX + React TodoMVC](https://github.com/mobxjs/mobx-react-todomvc)