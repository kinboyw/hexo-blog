---
title: Git 压缩多个commit为单个commit
tags:
  - git
type: categories
copyright: true
date: 2019-04-09 23:02:20
categories: 
- [git]
---


原文——[Squash commits into one with Git](https://www.internalpointers.com/post/squash-commits-into-one-git)



本篇介绍一个很棒的能将多次修改合并起来的方法，尤其是在将他们共享出去之前

在 Git 中，你可以使用强大的 `interactive rebase`（交互式 rebase）将多次提交合并成一次。这是我常用的一个很方便的工具；我经常通过将多个临时的小的提交合并成一次提交，然后将整理好的代码 push 给远端。 



<!--more-->

## 步骤 1: 选择你的起始提交

第一步就是让 git 开始一次交互式 rebase 会话：

```shell
git rebase --interactive HEAD~[N]
```

或者简写的方式:

```shell
git rebase -i HEAD~[N]
```

这里的 N 就是你想要合并的提交的数量，从最近的一次提交往前数。例如，这是一个假象的从 `git log` 中拉取的提交列表，我当前正在修改 feature Z：

```shell
871adf OK, feature Z is fully implemented      --- newer commit
0c3317 Whoops, not yet...
87871a I'm ready!
643d0e Code cleanup
afb581 Fix this and that
4e9baa Cool implementation
d94e78 Prepare the workbench for feature Z
6394dc Feature Y                               --- older commit
```

然后这是我要做的事情：

```shell
871adf OK, feature Z is fully implemented      --- newer commit --┐
0c3317 Whoops, not yet...                                         |
87871a I'm ready!                                                 |
643d0e Code cleanup                                               |-- Join these into one
afb581 Fix this and that                                          |
4e9baa Cool implementation                                        |
d94e78 Prepare the workbench for feature Z     -------------------┘
6394dc Feature Y                               --- older commit
```

要达到的效果：

```shell
84d1f8 Feature Z                               --- newer commit (result of rebase)
6394dc Feature Y                               --- older commit
```

所以在这个案例中，要执行的命令就是：

```shell
git rebase --interactive HEAD~[7]
```

因为我想将最后的 7 次提交合并为一次，所以 `d94e78 Prepare the workbench for feature X` 就是第 7 次提交。

### 我有数不清的提交要压缩，必须一个一个的数吗？

`git rebase --interactive HEAD~[N]` 命令的缺点就是你必须一个一个的数出准确的提交次数。幸运的是这里还有另一种方式：

```shell
git rebase --interactive [commit-hash]
```

`[commit-hash]` 就是你要压缩的提交范围的起始提交之前的一次提交的 hash。所以在我的示例中的命令就是：

```shell
git rebase --interactive 6394dc
```

 `6394dc` 是 `Feature Y`。你可以将这个命令理解为：



> 对 `[commit-hash]` 之上的所有提交进行合并。

这样更简单不是吗？



## 步骤 2: 选择与压缩

这时你的编辑器会有弹窗，显示出你想要合并的提交列表。注意，一开始可能会感觉有点看不明白，因为是按反序排列的，旧的提交显示在顶部。我通过 `--- older commit` 和 `--- newer commit` 进行了说明，在编辑器的窗口中不会显示说明。

```shell
pick d94e78 Prepare the workbench for feature Z     --- older commit
pick 4e9baa Cool implementation 
pick afb581 Fix this and that  
pick 643d0e Code cleanup
pick 87871a I'm ready! 
pick 0c3317 Whoops, not yet... 
pick 871adf OK, feature Z is fully implemented      --- newer commit

[...]
```

在提交列表的底部有一个简短的注释（示例中忽略了），提示了所有的操作选项。你可以在交互式 rebase 中进行各种操作，我们现在只进行一些基本的操作。我们的任务是将所有的提交注释为 **squashable**，除了第一个（最早的）提交：它将被用作起始点。

你可以通过将任务 `pick` 修改为 `squash` （或者简写为 `s` ，评论中有提示）来将提交标记为 squashable 。最后的结果就是：

```shell
pick d94e78 Prepare the workbench for feature Z     --- older commit
s 4e9baa Cool implementation 
s afb581 Fix this and that  
s 643d0e Code cleanup
s 87871a I'm ready! 
s 0c3317 Whoops, not yet... 
s 871adf OK, feature Z is fully implemented      --- newer commit

[...]
```

保存文件，关闭编辑器。



## 步骤 3: 创建新的提交

你刚刚告诉了 Git 将全部的 7 次提交合并到列表的第一个提交中。现在要给它添加注释：你的编辑器会再次弹出一个带有默认消息的窗口，内容是压缩的所有提交的注释。

你可以保留默认的提交注释，这样最终的提交信息将会是这些临时提交的注释列表，如下所示：

```shell
Prepare the workbench for feature Z
Cool implementation 
Fix this and that  
Code cleanup
I'm ready! 
Whoops, not yet... 
OK, feature Z is fully implemented
```

通常我不喜欢保留这些信息，所以我会清楚默认消息，使用一些自定义注释，例如 `Implemented feature Z`。

