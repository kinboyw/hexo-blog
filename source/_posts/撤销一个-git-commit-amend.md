---
title: 撤销一个 git commit --amend
type: categories
copyright: true
date: 2019-03-29 10:17:44
tags: [git]
categories: 
- [git]
---

你可能会碰到这样的情况，你想要将本该在 HEAD 之前提交的修改通过 `git commit --amend` 提交来修改 HEAD。在这样的情况下，你可能会需要回滚你刚刚完成的操作，然后将它应用到正确的提交上。对于简单的修改，你可能会发现 [`git reset -p`](https://blog.pivotal.io/users/khicks/blog/articles/git-reset-p)  很方便。很多情况下修改的内容太多，并且和前面的提交交织在一起，你可能会需要 `git reflog` 帮忙。

引用日志记录分支顶端的更新。顶端会在你每次创建新的提交，追加提交，重置提交，切换分支等等操作的时候被更新。基本上，一旦 HEAD 发生了变化，就会生成一次 reflog 记录。因此 reflog 是理解仓库如何进入特定状态的强大工具。

`git reflog -2` 会给你 Git 最近两次完成的操作。这种情况下，看起来就像下面：

```shell
8751261 HEAD@{0}: commit (amend): Something something something commit message
9d3a192 HEAD@{1}: reset: moving to HEAD~1
```

`git commit --amend` 是一种简写（考虑修改已经产生，不在索引区就在工作目录中）：

```shell
git stash
git reset HEAD~1
git stash pop
git add .
git commit
```

或者用文字描述：

- 将你想要应用到 HEAD 提交中的修改保存到 stash 中
- 移除 HEAD 提交，将内容放置到索引区
- 将暂存起来的修改释放到工作目录，添加到刚刚被重置的提交的修改中。
- 执行一个新的提交。

因此，reflog 中的最后两部操作是 **reset** 和 **commit**。

所以，我们能用它做什么？好吧，在 amend（尤其是在 reset 之前）发生之前，**9d3a192** 是 HEAD。8751261是在 amend 操作之后生成的提交。`git diff 8751261..9d3a192` 将会向你展示 amend 中应用了什么修改。

From here, you can use `git apply` to apply the difference from before the amend to after the amend to your working tree via `git diff`:

从这里开始，你可以用 `git apply` 来将 amend 之前到 amend 之后的差异应用到你的工作树，通过 `git diff`：

```
git diff 8751261..9d3a192 | git apply -
```

- Note: The hyphen in `git apply -` causes `git apply` to take stdin as input.
- Extra Note: The arguments here are given in reverse order, with the later commit happening first to show the reverse of the amend. It’s the same as doing `git diff 9d3a192..8751261 -R`, which reverses the diff output. Additionally, the -R argument may be applied to `git apply` instead of `git diff` to achieve the same effect.

Now we can do another amend to put the commit back to where it was before we did the previous amend:

```
git commit -a --amend -CHEAD
```

And then, by reversing the order of the SHAs to `git diff`, get the changes we want to apply to the correct commit back:

```
git diff 9d3a192..8751261 | git apply -
```

And commit as necessary, this time using –fixup to indicate the correct commit (in this example, 1234567):

```
git commit -a --fixup 1234567
```

Then you can rebase at a later time (or now) to do the ‘amend’ you had originally intended:

```
git rebase --i --autosquash 1234567~1
```

So don’t fret when you do an accidental amend. It’s just a couple commands away from being unwound and applied to the correct commit.

