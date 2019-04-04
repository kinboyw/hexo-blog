---
title: GitFlow 工作流
type: categories
copyright: true
date: 2019-03-26 20:01:04
tags: [git]
categories: 
- [git]
---

 原文-- [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

Gitfow 工作流是一个 Git 工作流设计，第一次是被 [Vincent Driessen at nvie](http://nvie.com/posts/a-successful-git-branching-model/) 发布并收到欢迎。Gitflow 工作流 定义了一个严格围绕项目发布的分支模型。它提供了一个用于管理大型项目的稳定框架。

Gitflow 完美地适合于具有计划性发布周期的项目。这种工作流不会添加任何超出 [特性分支工作流](http://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) 所需范围之外的新概念或者命令。相反，它为不同分支分配了非常详细的角色，并且定义了如何以及合适他们应该交互。除了 `feature` 分支，它为准备阶段，维护阶段和记录版本阶段使用了独立的分支。当然，你也可以充分利用所有特性分支工作流的优势：拉取请求，独立实验，以及更多高效合作。

<!--more-->

## 开始

Gitflow 真的只是 Git 工作流的一个抽象理念。这意味着它指示了应该创建什么类型的分支以及如何合并他们。我们将会触及下面这些分支的墓地。git-flow 工具集是一个命令行工具，需要安装。git-flow 的安装过程很简单。各个操作系统平台都有对应的 git-flow 安装包。在 OSX 系统中，你可以执行 `brew install git-flow` 。在 Windows 上你需要[下载并安装 git-flow](https://git-scm.com/download/win) 。安装完成后，你可以在你的项目中执行 `git flow init` 来使用它。Git-flow 内部封装了 Git 。`git flow init` 命令是对默认 `git init` 的扩展，除了为你创建分支外，不会对你的仓库作出任何修改。

## 它如何工作

![Git flow workflow - Historical Branches](https://wac-cdn.atlassian.com/dam/jcr:2bef0bef-22bc-4485-94b9-a9422f70f11c/02%20(2).svg)  

### Develop 和 Master 分支

这个工作流使用两个分支来记录项目历史，而不是用一个单独的 `master` 分支。`master` 分支保存了正式发布历史，`develop` 分支用于集成特性分支。可以很方便地为 `master` 分支上的所有提交打上一个数字的版本标记。

第一步就是从 `master` 分支上新建出 `develop` 分支。一个简单的方法就是在本地新建一个空的 `develop` 分支，然后将它同步到服务器：

```shell
git branch develop
git push -u origin develop
```

这个分支将会包含项目的完整历史，而 `master` 分支将会包含一个简略的版本历史。其他开发者现在应该 clone 中心仓库，然后创建一个 `develop` 的跟踪分支。

当使用 git-flow 扩展库时，对一个已存在的仓库执行 `git flow init` 将会创建 `develop` 分支：

```shell
$ git flow init
Initialized empty Git repository in ~/project/.git/
No branches exist yet. Base branches must be created now.
Branch name for production releases: [master]
Branch name for "next release" development: [develop]

How to name your supporting branch prefixes?
Feature branches? [feature/]
Release branches? [release/]
Hotfix branches? [hotfix/]
Support branches? [support/]
Version tag prefix? []

$ git branch
* develop
 master
```

## 特性分支

每一个新的特性都应该有自己的分支，这样就可以被 [push 到中心仓库](https://www.atlassian.com/git/tutorials/syncing/git-push)达到备份/协作的目的。但是，`feature` 分支是将 `develop` 分支作为他们的父亲分支，而不是从 `master` 开辟分支。当一个特性开发完成后，它将会被 [merge 回到develop分支](https://www.atlassian.com/git/tutorials/using-branches/git-merge)中。特性分支应该永远不要和 `master` 分支交互。

![Git flow workflow - Feature Branches](https://wac-cdn.atlassian.com/dam/jcr:b5259cce-6245-49f2-b89b-9871f9ee3fa4/03%20(2).svg)

注意，无论出于什么目地，`feature` 分支与 `develop` 分支的结合就是特性分支工作流。但是 Gitflow 工作流还没有止步于此。

`feature` 分支通常从最新的 `develop` 分支创建。

### 创建一个特性分支

没有 git-flow 扩展的情况下：

```shell
git checkout develop
git checkout -b feature_branch
```

使用 git-flow 扩展的情况：

```shell
git flow feature start feature_branch
```

继续你的工作，并且像往常一样使用 Git。

### 结束一个特性分支

当你完成了特性的开发工作，下一步就是将 `feature_branch` merge 到 `develop ` 中。

不使用 git-flow 扩展：

```shell
git checkout develop
git merge feature_branch
```

使用 git-flow 扩展：

```shell
git flow feature finish feature_branch
```

## 发布分支

![Git Flow Workflow - Release Branches](https://wac-cdn.atlassian.com/dam/jcr:a9cea7b7-23c3-41a7-a4e0-affa053d9ea7/04%20(1).svg) 

一旦 `develop` 分支获取的特性足够发布一个版本了（或者快到了预定的发布日期），你就从 `develop` 分支开辟一个 `release` 分支。创建这个分支启动下一个发布周期，所有从这时开始不允许新特性加入进来——只允许 bug 修复，文档生成，以及其他面向发布的任务可以进入到这个分支中来。一旦准备好，`release` 分支就会被merge 到 `master` 分支中，并打上一个数字版本号。另外，它也应该被合并回 `develop` 中，在创建 `release` 分支以后，`develop` 分支可能会有推进。

使用一个专用的分支用于准备发布，这样就可以让一个团队来准备当前的发布，同时让另一个团队继续为下一个版本开发新特性。这也为开发创建了明确的阶段（例如，这样就很容易说 “这周我们准备 4.0 版本”，也很容易在仓库的结构中看到）

创建 `release` 分支是另一项直接的分支操作。就像 `feature` 分支，`release` 分支是基于 `develop` 分支的。一个新的 `release` 分支可以使用下面的方法创建。

不适用 git-flow 扩展：

```shell
git checkout develop
git checkout -b release/0.1.0
```

使用 git-flow 扩展：

```shell
$ git flow release start 0.1.0
Switched to a new branch 'release/0.1.0'
```

一旦新版本准备好了要发布，它将被合并到 `master` 和 `develop` 中，然后 `release` 分支将被删除。合并回 `develop` 分支是很重要的，因为可能有重要更新已经被添加到了 `release` 分支，他们也许要被新的特性使用到。如果你的团队重视代码重审，这是发起 pull request 理想时机。

结束一个 `release` 分支，要使用以下方法：

不使用 git-flow 扩展：

```shell
git checkout master
git merge release/0.1.0
```

使用 git-flow 扩展：

```shell
git flow release finish '0.1.0'
```

## 修补分支

![Git flow workflow - Hotfix Branches](https://wac-cdn.atlassian.com/dam/jcr:61ccc620-5249-4338-be66-94d563f2843c/05%20(2).svg) 

维护或者 `hotfix` 分支被用于快速修补生产版本。 `hotfix` 分支很像 `release` 分支与 `feature` 分支，除了他们是基于 `master` 分支 而不是 `develop` 分支。这是唯一一个应该直接从 `master` 分支开辟的分支。一旦 fix 完成了，它应该被 merge 回 `master` 和 `develop` （或者当前 `release` 分支），`master` 应该用一个更新的数字版本标记。

有一个专用的开发线用于 bug fix 可以让你的团队在不中断其余工作流程或等待下一个发布周期的情况下解决问题。你可以将维护分支视为直接与 `master` 分支协作的临时 `release` 分支。可以用下面的方法创建一个 `hotfix` 分支：

使用 git-flow 工作流：

```shell
git checkout master
git checkout -b hotfix_branch
```

不使用 git-flow 工作流：

```shell
$ git flow hotfix start hotfix_branch
```

与结束 `release` 分支类似，`hotfix` 分支要被 merge 回到 `master` 和 `develop` 中。

```shell
git checkout master
git merge hotfix_branch
git checkout develop
git merge hotfix_branch
git branch -D hotfix_branch
$ git flow hotfix finish hotfix_branch
```

## 示例

下面是一个特性分支工作流的完整演示示例。假设我们已经有一个具备 `master` 分支的仓库。

```shell
git checkout master
git checkout -b develop
git checkout -b feature_branch
# work happens on feature branch
git checkout develop
git merge feature_branch
git checkout master
git merge develop
git branch -d feature_branch
```

除了 `feature` 和 `release` 流程，下面还有一个 `hotfix` 的示例：

```shell
git checkout master
git checkout -b hotfix_branch
# work is done commits are added to the hotfix_branch
git checkout develop
git merge hotfix_branch
git checkout master
git merge hotfix_branch
```

## 总结

这里我们讨论了 Gitflow 工作流。Gitflow 是你和团队能够使用的众多 [Git 工作流](https://www.atlassian.com/git/tutorials/comparing-workflows) 之一。

关于 Gitflow 需要了解的关键点有这些：

- 这个工作流适合基于版本的软件开发工作流。
- Gitflow 为生产环境提供了 hotfix 通道。

Gitflow 的完整流程如下：

1. 从 `master` 创建一个 `develop` 分支
2. 从 `develop`创建一个 `release` 分支
3. 从 `develop` 创建 `feature` 分支
4. 当一个 `feature` 开发结束，将被 merge 到 `develop` 分支
5. 当 `release` 分支完成，将被 merge 到 `develop` 和 `master` 
6. 如果在 `master` 中发现问题，要从 `master` 创建一个 `hotfix` 分支
7. 一旦 `hotfix` 完成，将被 merge 回 `develop` 和 `master` 
