---
title: 使用vimdiff作为git mergetool
date: 2018-10-09 13:24:33
tags: 
	- vim
	- git
---

译自：[Use vimdiff as git mergetool](http://www.rosipov.com/blog/use-vimdiff-as-git-mergetool/)

使用vimdiff作为`git mergetool`可能有点难以理解，因为它会打开多个窗口，只有极少的说明。本篇是一个简单的练习，介绍`vimdiff`的基本使用方法以及什么是`LOCAL` ,`BASE`,和`REMOTE`。这篇教程默认你至少具备了一点基础的`vim`知识（如何移动光标，保存，窗口切换）。如果你还不具备这些知识，这里有一篇短文可以帮助到你： [Using vim for writing code](./用vim写代码.md)。显然，对git和分支的基本理解也是必须的。

<!--more-->

##  Git 配置


开始之前，你需要知道如何将`vimdiff`设置为`git mergetool`。如下：

```
git config merge.tool vimdiff
git config merge.conflictstyle diff3
git config mergetool.prompt false
```

这些设置会使用`git`作为默认的合并工具，合并时会显示出冲突分支的共同祖先，会禁用打开vimdiff的提示命令。

## 创造合并冲突


我们来创建一个测试环境。你可以自由选择跳过这部分或者跟着教程来做。

```
mkdir zoo
cd zoo
git init
vi animals.txt
```

添加一些动物

```
cat
dog
octopus
octocat
```

保存文件

```
git add animals.txt
git commit -m "Initial commit"
git branch octodog
git checkout octodog
vi animals.txt  # let's change octopus to octodog
git add animals.txt
git commit -m "Replace octopus with an octodog"
git checkout master
vi animals.txt  # let's change octopus to octoman
git add animals.txt
git commit -m "Replace octopus with an octoman"
git merge octodog  # merge octodog into master
```

这里我们就会得到一个合并错误：

```
Auto-merging animals.txt
CONFLICT (content): Merge conflict in animals.txt
Automatic merge failed; fix conflicts and then commit the result.
```

## 用vimdiff解决合并冲突


让我们来解决冲突：

```
git mergetool
```

![Three-way merge using vimdiff. Local changes are in top left, followed by a common ancestor, and branch `octodog` in the top right corner. Resulting file is at the bottom.](http://www.rosipov.com/images/posts/three-way-merge-with-vimdiff.png)


这一开始看起来会很恐怖，我们来解释一下发生了什么。

从左至右，从上到下：

`LOCAL` - 这个文件来自当前分支；`BASE` - 两个分支的共同祖先，在两个分支上的文件改变之前的样子；`REMOTE` - 要合并到你当前分支的外部分支上的文件；`MERGED` - 合并结果，将会保存到本地`repo`中。


假设我们希望保留`octodog` 的变化（来自REMOTE）。为此，移动到`MERGED`文件上（Ctrl + w, j）,移动光标到一个合并冲突的区域，然后：

```
:diffget RE
```

这一步从`REMOTE`上获得相应的更改并将其放入到`MERGED`文件中，你也可以：

```
:diffg RE  " get from REMOTE
:diffg BA  " get from BASE
:diffg LO  " get from LOCAL
```

保存文件，然后退出（快速保存写入并退出的方法是`:wap` ）

执行`git commit`，你就完成了！