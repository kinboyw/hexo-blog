---
title: 创建一个Git仓库
date: 2018-7-21 13:24:33
tags: git
categories: 
- [Git]
---

[git init](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-init)   [git clone](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone)   [git config](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config)

本教程主要覆盖的几点如下:

- 初始化一个新的 Git repo
- 克隆一个已有的 Git Repo
- 向 Repo 提交一个文件的修改版本
- 对 Git Repo 进行一些远程协作的配置
- 常用的 Git 版本控制命令

在本章结束后，你应该就能够创建一个 Git Repo，使用 Git 常用的命令，提交修改的文件，查看工程的修改历史以及连接一个 Git 托管服务（如 Bitbucket）

<!--more-->

# Git仓库是什么?

 [Git 仓库](http://bitbucket-marketing.atlassian.com/product/code-repository) 是你的工程的一个虚拟的存储，它允许你保存代码的不同版本，这样你就可以在需要的时候获取这些版本了。

## 初始化一个新的仓库：git init

你将使用 `git init` 来创建一个新的 repo，`git init` 对新 repo 执行初始化设置的一次性命令。执行这个命令会在你的当前工作目录下创建一个名为`.git` 的子目录。同时也会创建一个新的master分支。

<!--more-->

### 创建新的git仓库对现有工程进行版本控制

这个示例假设你已经有了想要在里面创建git repo的工程文件夹。第一步是`cd`到这个工程文件夹的根目录下，然后执行`git init`命令。

```bash
cd /path/to/your/existing/code
git init
```

将`git init`命令指向这个已有的工程目录也会执行和上面同样的初始化设置，作用于该项目目录。

```bash
git init <project directory>
```

浏览[git init](http://www.atlassian.com/git/tutorials/setting-up-a-repository/git-init)页面查看`git init`的详细信息。

## 克隆一个已有的仓库：git clone

如果项目已经搭建了一个中心仓库，clone命令就是最常用的获取本地开发克隆的命令。和`git init`一样，克隆通畅也是一次性指令。一旦获取到一个working copy，所有 [version control](http://bitbucket-marketing.atlassian.com/product/version-control-software) 指令都是通过本地仓库管理的。

``` bash
git clone <repo url>
```

`git clone`被用于创建一个copy或者远端仓库的clone。你可以给`git clone`传一个仓库的URL地址。Git支持几种不同的网络传输协议和对应的URL格式。示例中我们将会用到Git SSH协议。Git SSH URL遵循这样一个模板`git@HOSTNAME:USERNAME/REPONAME.git` 

一个Git SSH URL的示例以及它与模板的对应关系如下：

- `HOSTNAME: bitbucket.org`
- `USERNAME: rhyolight`
- `REPONAME: javascript-data-store`

当命令执行后，将会开始拉取远端仓库master分支上的最新版本的文件，这些文件会被存放在一个新建的文件夹内。新建的文件夹会命名为上面示例中的REPONAME，即`javascript-data-store` 。这个文件夹包含了远端仓库的全部历史记录以及新创建的master分支。

更多`git clone ` 的使用和支持的Git URL格式，请看[git clone Page](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone)

## 保存修改到仓库：git add 和 git commit

既然你已经克隆或者初始化了一个仓库，你就可以向它提交文件版本的修改了。下面的例子假设你已经在`/path/to/project`目录下创建了一个项目。步骤如下：

- 将当前目录指向 `/path/to/project` 
- 新建一个文件 `CommitTest.txt` 包含内容"test content for git tutorial"
- 执行 git add 将 `CommitTest.txt` 添加到仓库暂存区（staging area）
- 提交修改，附带一个描述本次提交修改内容的message参数

``` bash
cd /path/to/project
echo "test content for git tutorial" >> CommitTest.txt
git add CommitTest.txt
git commit -m "added CommitTest.txt to the repo"
```

执行示例后，你的repo就会将`CommitTest.txt`添加到历史中，并跟踪未来这个文件的更新。

这个示例介绍了两个git命令：`add`和`commit`。示例非常有限，更多关于这两个命令的内容在[git add](https://www.atlassian.com/git/tutorials/saving-changes) 和 [git commit](https://www.atlassian.com/git/tutorials/saving-changes#git-commit) 。`git add`的另一个常用的案例是`--all`选项。执行 `git add --all`会将仓库中所有的修改未跟踪的文件添加到repo并更新repo的工作树（working tree）。

## 协作：git push

理解这一点很重要，Git中`working copy` 的概念与你从SVN仓库中使用check out命令签出代码得到的working copy是非常不同的。与SVN不同，Git的所有working copy都于中心仓库一模一样，他们都是完整（full-fledged）的Git仓库（[Git repositories](http://bitbucket-marketing.atlassian.com/product/code-repository) ）。

这就造成了Git协作与SVN协作根本上的不同。SVN依赖与中心仓库与工作副本之间的关系，而Git的协作模型基于仓库与仓库之间的交互。在Git你是从一个仓库向另一个仓库推送或拉取，而不是向SVN的中心仓库迁入工作副本。

当然，没有任何事情阻止你给某个特定的Git Repo赋予特殊的意义。例如，简单地将某个Git Repo设定未中心库，就可以使用Git建立一个中心化的工作流。

### 裸仓库 vs. 克隆的仓库

如果你用上一节 "Initializing a new Repository" 中的`git clone`来创建的本地仓库，那么你的仓库里就已经配置好了远程协作。`git clone`将会自动地为你的repo配置一个指向远端克隆来源的URL。这就意味着，一旦你修改了文件并执行了提交，你就可以将这些修改`git push`到远端仓库

如果你使用`git init`创建的一个新鲜的repo，那么你就没有这个可以push修改的远端repo。通常初始化一个新的repo的做法是先去Git托管那里创建一个repo。  服务将会提供一个Git URL，你可以将这个URL添加到你的本地仓库，然后`git push`到托管repo。一旦你用选择的Git托管服务创建了远端repo，那么你就需要更新你的本地仓库配置，建立映射。我们将会在下面 Configuration & Set Up教程中探讨这个操作。

如果你更喜欢托管自己的远程仓库，则需要设置“裸仓库”。`git init`和`git clone`命令都接收 `--bare`参数。裸仓库最通常是用于创建远程的中心仓库。

## 配置和设置：git config

一旦你设置了远端repo，你就需要在你的本地`git config`中添加一个远程repo的url，并为你的本地分支设置一个上游分支。`git remote`命令提供了这样的工具。

```bash
git remote add <remote_name> <remote_repo_url>	
```

这个命令会将位于`<remote_repo_url>`的远程仓库映射到你的本地仓库下的`<remote_name>`引用中（这里是指 remote_name 是远端仓库的一个标识或引用，相当于别名，这样在执行如git push，pull，fetch等其他指令时就可以轻松地指定远端仓库）。一点你建立了远端repo的映射，你就可以将本地分支推送给远端仓库。

```bash
git push -u <remote_name> <local_branch_name>
```

这个命令将会将本地repo的`<local_branc_name>`分支push到未于`<remote_name>` 的远端repo。

跟深入的了解`git remote`，见[`Git remote page`](https://www.atlassian.com/git/tutorials/syncing#git-remote)。

除了配置远端repo的URL，你还需要设置一些Git全局配置选项，例如username，email。`git config`命令可以帮助你用命令行配置你的Git安装程序（或者一个单独的仓库）。这个命令可以完成从用户信息到优先选项（preference），到仓库行为的一切定义。下面列出了几个常用的配置选项。

Git在三个单独的文件中保存了配置选项，允许你将配置选项的作用域设定为单个仓库（本地），用户（全局）或者整个系统（系统）：

- 本地: `<repo>/.git/config` – 具体仓库的设置.
- 全局: `/.gitconfig` – 具体用户的设置. 这是加 --global 标识的设置保存的位置.
- 系统: `$(prefix)/etc/gitconfig` – 系统级设置.

在当前仓库中定义用于所有提交操作的作者名称。通常我们会想要为当前用户的设置加上 `--global` 标识。

``` bash
git config --global user.name <name>
```

为当前用户定义所有提交的作者名称。

加上`--local`选项或者干脆不指定配置级别，将会为当前的本地仓库设置`user.name` 。

```bash
git config --local user.email <email>
```

为当前用户定义用于所有提交的作者邮箱。

```bash
git config --global alias.<alias-name> <git-command>
```

为Git命令创建一个快捷方式。这是一个很强大的功能，能够为常用的git命令创建自定义的快捷方式。简单的示例如下：

```bash
git config --global alias.ci commit
```

创建一个 `ci`命令作为快捷方式来执行`git commit`。 学习更多的git别名访问 [`git config` page](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config).

```bash
git config --system core.editor <editor>
```

为当前计算机上的所有用户指定用于`git commit`等命令的文本编辑器。`<edtor>` 参数是启动所需要的编辑器的命令（例如，vi）。这个示例用到了--system选项。--system选项将会将配置应用于整个系统，意味着这台机器上的所有用户和repo。更多关于配置级别的详细信息访问[git config page](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config)。 

```
git config --global --edit
```

在文本编辑器中打开全局配置文件来进行手动设置。深入了解如何在文本编辑器中配置Git，访问 [Git config page](http://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config)。 

### 讨论

所有配置选项都保存在一个纯文本文件中，所以`git config`命令真的是一个方便的命令行接口。通常你只需要在安装Git的时候设置一次，就可以在一台新的开发机器上开始工作了，为了适用于所有情况，你需要使用`--global`标识。一个重要的例外是作者邮箱地址。你可能需要为一些个人或者开源的仓库设置个人邮箱地址，为你的工作相关的仓库设置你的专业邮箱地址。

Git将配置保存在三个单独的文件中，允许你将配置选项设定在单个仓库，用户和整个系统的作用域里。

- `<repo>/.git/config` – 具体仓库的配置。
- `~/.gitconfig` – 用户级配置，这里保存着那些附加了`--global` 选项的配置。
- `$(prefix)/etc/gitconfig` – 系统级配置。

当这些文件中的选项冲突时，本地设置覆盖用户设置，用户设置会覆盖系统级设置。如果你打开任意一个配置文件 ，将会看到下面这些东西：

```
[user] 
name = John Smith 
email = john@example.com 

[alias] 
st = status 
co = checkout 
br = branch 
up = rebase 
ci = commit 

[core] 
editor = vim
```

你可以手动编辑这些值，这与`git config `的效果是一样的。

### 例子

在你安装完Git之后的第一见想做的事情就是告诉Git你的名字和email，以及自定义一些默认的设置。一个经典的初始配置看起来差不多是下面这个样子：

告诉Git你是谁`git config` 

```
git --global user.name "John Smith" git config --global user.email john@example.com
```

选择你最喜欢的文本编辑器

```
git config --global core.editor vim
```

添加一些类似SVN的别名

```
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.up rebase
git config --global alias.ci commit
```

这样会创建一个上一节中讲到的`~/.gitconfig` 文件。深入的了解git config 请看[git config page](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config)。 

## 总结

这里我们演示了如何使用 [git init](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-init) 和 [git clone](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone) 创建一个 git 仓库。这篇教程可以被应用在管理软件源码和其他需要被版本话管理的内容。[Git add](https://www.atlassian.com/git/tutorials/saving-changes), [git commit](https://www.atlassian.com/git/tutorials/saving-changes#git-commit), [git push](https://www.atlassian.com/git/tutorials/syncing#git-push), 和 [git remote](https://www.atlassian.com/git/tutorials/syncing#git-remote) 也被引入并在高级别上应用了. 

Read our [guide about which code repository system is right for your team](http://bitbucket-marketing.atlassian.com/product/code-repository)! 