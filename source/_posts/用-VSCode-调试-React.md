---
title: 用 VSCode 调试 React
type: categories
copyright: true
date: 2019-04-02 10:16:15
tags: [工具]
categories:
- [工具]
---



![img](https://cdn-images-1.medium.com/max/1400/1*XzK7XPYkM2le0dgoKqxtjA.jpeg)

我终于不用再花时间在终端，浏览器和编辑器之间往返来回了。难道不是所有人都在这么做吗？

在这篇教程中我会教你用 Visual Studio Code 的 debug 功能为你的 React 工作流赋能。你会学到如何如何将 VSCode 和 Chrome 连接起来，这样你就可以做到直接从 VSCode 调试浏览器中的代码了😎

<!--more-->

### 准备测试项目

在开始教程之前我们需要创建一个测试应用，后面将会用到。我尝尝适用 `create-react-app` 因为我不喜欢写模板。如果你已经有一个应用程序了你也可以就用它。

首先创建测试应用：

1. 执行 `npm i -g create-react-app` 命令，在全局安装 `create-react-app` 
2. 安装成功后，运行命令 `create-react-app vscode-tutorial` 创建一个新项目

完成后会创建一个包含新的 React 应用程序的目录。

### 设置 VSCode

Next up we need to install the VSCode extension so it knows how to talk to Chrome. VSCode connects to Chrome through Chrome’s [debugger protocol](https://developer.chrome.com/devtools/docs/debugger-protocol). This is the same debugger protocol that Chrome’s developer tools use. Instead of using Chrome’s developer tools you can use VSCode to debug browser code.

接下来我们需要安装 VSCode 扩展，通过扩展来和 Chrome 通信。VSCode 通过 Chrome 的 [debugger 协议](https://developer.chrome.com/devtools/docs/debugger-protocol) 来连接到 Chrome。这个协议与 Chrome 开发者工具使用的协议相同。你可以用 VSCode 取代 Chrome 的开发者工具来调试浏览器代码。

#### 安装 Chrome Debugger 扩展工具

To get VSCode and Chrome communicating with each other we need to install an extension called *Debugger for Chrome*. Install it by navigating to the extensions pane and searching for: *debugger for chrome*. It should look similar to below:

为了让 VSCode 和 Chrome 之间相互通信，我们需要安装一个叫作 *Debugger for Chrome* 的扩展。通过导航到 VSCode 的扩展面板，搜索 *Debugger for Chrome* 。它应该看起来与下图相似。



![img](https://cdn-images-1.medium.com/max/800/1*M9IewWesFpwIILHkje2OVQ.png)

### 设置 VSCode 连接到 Chrome

接下来我们需要设置 VSCode 来让它连接到 Chrome。

1. 点击 debugging 图标
2. 点击下拉菜单（在**运行**按钮旁），然后点击“添加配置...”
3. 从“选择环境”下拉菜单中选择“Chrome”

这一步完成后会自动在你的工程根目录下新建一个 `.vscode` 目录。目录将会包含一个 `launch.json` 文件，它将被用来配置你当前工程下的 VSCode 的 debugger 。每次创建一个新的项目时，你都必须按照相同步骤来设置远程 debug（或者拷贝之前项目的 `.vscode` 目录到新项目中）

修改 `url` 属性，将其只想开发服务器的 URL。对与 `create-react-app` 来说，这个 URL 是 `http://localhost:3000` 。

完整的配置选项列表可以 [在这里找到](https://github.com/Microsoft/vscode-chrome-debug#other-optional-launch-config-fields)。

### 运行调试器

不要着急，我们快要完成了。接下来我们需要用到我们的测试项目来测试 debugger 是否正常工作。

#### 打开调试器

你可以通过下面的几种方式来打开调试器：

- 按 F5
- 在调试面板中按绿色的运行按钮
- 从菜单运行： `Debug > Start Debugger`

#### 设置一个断点

断点是用来告诉调试器，当代码执行到指定的位置时暂停执行。这样你就可以查看变量，回调函数，甚至在应用程序运行的时候修改代码。

这一步，我们在代码 `src/App.js` 的第 11 行设置一个断点。



#### 启动一个开发服务器

最后要看是否能成功，通过在终端运行 `npm start` 来启动开发服务器。这会启动一个新的服务器，可以通过地址 http://localhost:3000/ 访问。

![img](https://cdn-images-1.medium.com/max/800/1*bxUZwnWT0W0CagUpoSzi1g.png)

导航到 http://localhost:3000/，然后你应该能看到页面“冻结”了。这是因为应用程序命中了断点。如果你切换回 VSCode 中去看，你会注意第 11 行代码高亮了，并且调试面板也更新了能够反应出调用栈。

![img](https://cdn-images-1.medium.com/max/800/1*qn2CeUXCJHuNRTfbFdczQQ.png)

如果一切运行成功，那么恭喜你！你已经学会了如何设置 VSCode 远程调试。如果想要了解更多关于 VSCode 调试的知识，可以[看看这里](https://code.visualstudio.com/docs/editor/debugging)