---
title: SVN 到 Git，迁移的准备工作
date: 2018-7-22 13:24:33
copyright: true
tags: [git,svn]
categories: 
- [Git]
---



原文：[SVN to Git - prepping for the migration](https://www.atlassian.com/git/tutorials/svn-to-git-prepping-your-team-migration#for-administrators)

在[Why Git](https://www.atlassian.com/git/tutorials/why-git)中，我们讨论了Git可以帮助您的团队变得更加敏捷的多种方式。一旦你已经决定转换，下一步就是弄清楚如何将已有的开发工作流迁移到Git。

这篇文章解释了你在将团队从SVN转换为Git时可能会遭遇到的最大变化。在迁移过程中最重要的事情是要记住Git不是SVN。为了理解Git的全部潜力，请尽力拥抱版本控制的新思想。

[For administrators](https://www.atlassian.com/git/tutorials/svn-to-git-prepping-your-team-migration#for-administrators)  [Basic Git commands](https://www.atlassian.com/git/tutorials/svn-to-git-prepping-your-team-migration#basic-git-commands)  [Git Migration Tools](https://www.atlassian.com/git/tutorials/svn-to-git-prepping-your-team-migration#git-migration-tools)  [For developers](https://www.atlassian.com/git/tutorials/svn-to-git-prepping-your-team-migration#for-developers)

## For administrators 对管理员

采用Git可能需要几天到几个月的时间，具体取决于团队的规模。本节介绍了在培训员工使用 Git 以及从 SVN 迁移仓库到 Git过程中工程经理需要注意的问题。

<!--more-->

## Basic Git commands 基本Git命令

Git 曾因其陡峭的学习曲线儿闻名。然而 Git 维护者一直在稳步发布新的改进，例如合理的默认值和上下文帮助信息，这使得上手Git的过程更加轻松愉悦。

Atlassian 提供了全面的自学Git的[系列教程](https://www.atlassian.com/git/tutorials),也包含了网络讨论和在线训练课程。所有这些应该满足了你的团队着手使用Git所需要的全部培训选择。为了让你能够顺利开始，这里有一些常见Git命令的列表：

| Git task                                                     | Notes                                                        | Git commands                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [Tell Git who you are](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-config) | Configure the author name and email address to be used with your commits.Note that Git strips some characters (for example trailing periods) from user.name. | git config --global user.name "Sam Smith" git config --global user.email sam@example.com |
| [Create a new local repository](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-init) |                                                              | git init                                                     |
| [Check out a repository](https://www.atlassian.com/git/tutorials/setting-up-a-repository/git-clone) | Create a working copy of a local repository:                 | git clone /path/to/repository                                |
|                                                              | For a remote server, use:                                    | git clone username@host:/path/to/repository                  |
| [Add files](https://www.atlassian.com/git/tutorials/saving-changes/git-add) | Add one or more files to staging (index):                    | git add <filename>git add *                                  |
| [Commit](https://www.atlassian.com/git/tutorials/saving-changes/git-commit) | Commit changes to head (but not yet to the remote repository): | git commit -m "Commit message"                               |
|                                                              | Commit any files you've added with git add, and also commit any files you've changed since then: | git commit -a                                                |
| [Push](https://www.atlassian.com/git/tutorials/syncing/git-push) | Send changes to the master branch of your remote repository: | git push origin master                                       |
| [Status](https://www.atlassian.com/git/tutorials/inspecting-a-repository/git-status) | List the files you've changed and those you still need to add or commit: | git status                                                   |
| [Connect to a remote repository](https://www.atlassian.com/git/tutorials/syncing/git-remote) | If you haven't connected your local repository to a remote server, add the server to be able to push to it: | git remote add origin <server>                               |
|                                                              | List all currently configured remote repositories:           | git remote -v                                                |
| [Branches](https://www.atlassian.com/git/tutorials/using-branches) | Create a new branch and switch to it:                        | git checkout -b <branchname>                                 |
|                                                              | Switch from one branch to another:                           | git checkout <branchname>                                    |
|                                                              | List all the branches in your repo, and also tell you what branch you're currently in: | git branch                                                   |
|                                                              | Delete the feature branch:                                   | git branch -d <branchname>                                   |
|                                                              | Push the branch to your remote repository, so others can use it: | git push origin <branchname>                                 |
|                                                              | Push all branches to your remote repository:                 | git push --all origin                                        |
|                                                              | Delete a branch on your remote repository:                   | git push origin :<branchname>                                |
| [Update from the remote repository](https://www.atlassian.com/git/tutorials/syncing/git-pull) | Fetch and merge changes on the remote server to your working directory: | git pull                                                     |
|                                                              | To merge a different branch into your active branch:         | git merge <branchname>                                       |
|                                                              | View all the merge conflicts:View the conflicts against the base file:Preview changes, before merging: | git diff git diff --base <filename> git diff <sourcebranch> <targetbranch> |
|                                                              | After you have manually resolved any conflicts, you mark the changed file: | git add <filename>                                           |
| Tags                                                         | You can use tagging to mark a significant changeset, such as a release: | git tag 1.0.0 <commitID>                                     |
|                                                              | CommitId is the leading characters of the changeset ID, up to 10, but must be unique. Get the ID using: | git log                                                      |
|                                                              | Push all tags to remote repository:                          | git push --tags origin                                       |
| [Undo local changes](https://www.atlassian.com/git/tutorials/undoing-changes) | If you mess up, you can replace the changes in your working tree with the last content in head:Changes already added to the index, as well as new files, will be kept. | git checkout -- <filename>                                   |
|                                                              | Instead, to drop all your local changes and commits, fetch the latest history from the server and point your local master branch at it, do this: | git fetch origin git reset --hard origin/master              |
| Search                                                       | Search the working directory for foo():                      | git grep "foo()"                                             |

## Git Migration Tools Git 迁移工具

有很多工具可以帮助你将已有的工程从SVN迁移到Git上，但是在你决定使用哪种工具之前，你需要弄清楚你希望如何迁移自己的代码。你有以下选项：

-  迁移整个代码库到Git，同时停用SVN。
-  不迁移现有工程到Git，但是新的工程使用Git。
- 迁移一些工程到Git，同时在其他工程上继续使用SVN。
- 在同一个工程上同步使用SVN 和 Git。

完整迁移到Git会降低开发流程的复杂性，因此这是首选方案。然而对那些拥有数十个开发团队和可能几百个工程项目的大公司来说，这也不一定可行。

你选择的迁移工具很大程度取决于你所选择的上面的策略。一些常见的 SVN-to-Git的迁移工具介绍如下。

### Atlassian’s migration scripts	Atlassian的迁移工具

如果你对突然过渡感兴趣，那么Atlassian的迁移脚本对你来说是个不错的选择。这些脚本提供了将已有的SVN仓库可靠地转换为Git仓库所需要的全部工具。生成的native-Git历史记录可确保你在转换过程后无须处理任何SVN-to-Git的互操作性问题。

我们提供了完整的[技术演练](https://www.atlassian.com/git/tutorials/migrating-overview) ，使用这些脚本将您的整个代码库转换为Git仓库集合。演练解释了从提取SVN作者信息到重新组织非标准SVN存储库结构的所有内容。

### SVN Mirror for Stash (now Bitbucket Server) plugin

[SVN Mirror for Stash](https://marketplace.atlassian.com/plugins/org.tmatesoft.subgit.stash-svn-importer) 是一个[Bitbucket Server](https://bitbucket.org/product/server) 插件，可以让你轻松地维护兼容SVN和Git的混合代码库。和Atlassian的迁移脚本不同的是，SVN Mirror for Stash 允许你在同一个工程上同步使用 Git 和 SVN，只要你喜欢。

这个折中的解决方案对大公司来说是一个很棒的选择。它允许不同的团队在方便时迁移工作流，从而实现增量采用Git。

### What is Git-SVN?

git-svn工具是一个作用于本地Git仓库和 远程SVN仓库之间的接口。Git-svn让开发者可以在本地编写和向本地Git提交代码，然后将提交的内容用 SVN commit风格的操作提交到SVN中心仓库。这应该是暂时的，但是探索从SVN切换到Git的过程中很有帮助。

如果你不确定要切换到Git并希望让一些开发者探索Git命令而不全面迁移的情况下，git svn 是一个选择。它也非常适合培训阶段 - 而不是突然过渡，你的团队可以轻松地使用本地Git命令，不必担心协作的工作流。

要注意 git svn 应该只是你的迁移过程中的暂时阶段。因为它仍然依赖于SVN这个后端，它无法利用更加强大的Git功能，例如分支或者高级协作工作流程。

### Rollout Strategies 推出策略

迁移代码库只是应用Git的一个方面。你也应该考虑如何将Git介绍给代码库背后的人。外部顾问，内部Git冠军和飞行员团队是将开发团队迁移到Git的三个主要策略。

### External Git Consultants 外部顾问

Git顾问基本上可以象征性地收费为你处理迁移过程。这样做的优点是，你可以不用自己花时间学习就能创建一个完美适配你的团队的Git工作流。它还可以为您提供专家培训资源，如果你的团队正在学习Git。 [Atlassian Experts](https://www.atlassian.com/resources/experts/?tab=find-an-expert&expertskills=SVNtoGitmigration&products=*&expertlocation=) 是从SVN迁移到Git的专家，也是寻找Git顾问的好资源。

另一方面，自己设计和实现一个Git工作流是团队理解新的开发流程的内部工作的好办法。这中方式可以避免当专家离开后，团队陷入黑暗的风险。


### Internal Git Champions 内部Git冠军

Git冠军是你公司内部对使用Git感到很高兴的开发者。利用冠军程序员对于拥有强大的开发者文化的公司和渴望成为早期Git使用者的热心程序员来说是一个很好的选择。

相比于外面的顾问，这种方式还有一个有点就是能够将Git专业知识保留在内部。然而需要大量的时间来训练Git冠军，而且需要承担选择错误的Git工作流或者错误的实现的风险。

### Pilot Teams 飞行员团队

第三种选择是用飞行员团队测试。如果你有一个小团队在一个相对独立的项目上工作，这种方式最好。将外部专家于飞行员团队内部的Git冠军组合甚至效果更佳。

这样做的好处是需要整个团队的支持，并且还限制了选择错误工作流的风险，因为它在设计新的开发流程的时候获得了整个团队的输入。换句话说，它确保确保比顾问或冠军在独自设计工作流程时更早的捕获到任何缺失的部分。

另一方面，利用飞行员团队意味着更多的初期训练和调试时间：并不是一个开发者在整理工作流，整个开发团队会在他们对新的工作流程感到舒适时暂时降低工作效率。

### Security and Permissions 安全和权限

访问控制是你需要从根本上重新思考如何管理代码库的Git的一个方面。

在SVN中，你通常将所有代码库存放在一个单独的中心仓库中，然后限制不同团队或者个人对文件夹的访问。在Git中，这 不再可能了：开发者必须能够签出整个仓库才能使用它。你通常不能签出一个仓库的子集，就像在SVN上时一样。权限只能被授予整个Git仓库。

这就意味着你必须将庞大的单片SVN仓库拆分成几个小的Git仓库。当我们将 [Jira](https://www.atlassian.com/software/jira) 开发团队迁移到Git上时，我们实际上在Atlassian遇到了这个第一手资料。

请记住，Git是被设计用于从几千个独立Linux开发者那里安全地集成代码贡献的，所以，它必定提供了一些方式来供你搭建你的团队需要的任何方式的访问控制。但是这可能需要重新审视您的构建周期。

如果你担心要维护新的Git仓库集合之间的依赖关系，你可能会发现Git之上的依赖关系管理层会很有帮助。依赖管理层将会有助于构建期，因为随着项目增长，你需要缓存来加速构建时间。可以在这篇有用的文章中找到每个技术栈的推荐依赖关系管理层工具列表：[“Git和项目依赖关系”](http://blogs.atlassian.com/2014/04/git-project-dependencies/) .

## For developers 开发者

### A Repository for Every Developer  每个开发人员的代码库

作为开发者，你需要适应的最大的改变就是Git分布式的本质。不同于单个中心库，每一个开发者都有他们自己的整个代码库的副本。这极大的改变了你和程序员同事们协作的方式。

你可以使用 `git clone` 将整个Git仓库克隆到本地计算机上，而不是使用`svn checkout`从SVN库签出工作副本。

通过使用`git push`，`git fetch` 或者`git pull` 在仓库的分支之间移动来实现协作。共享通常在Git分支级别上完成，但也可以像SVN一样在提交级别上完成。但是在Git中，提交代表着项目的整个状态，而不是文件修改。你在SVN 和 Git中都可以使用分支，这里重要的区别是你可以用Git在本地完成提交，而不用共享你的工作。这能让你更自由进行实验，在离线状态下工作更有效，而且加速几乎所有版本控制相关的命令。

然而，理解这一点很重要，就是远程仓库并不是一个直接链接到其他人的仓库的。它只是一个标签，防止你每次与远程仓库交互的时候必须重新键入整个URL。你一直都是在一个独立的环境中工作的，直到你明确地从一个远程仓库pull或者push一个分支。

对SVN而言，另一个较大的调整就是“local" 和 “remote” 的概念。本地仓库在你的本地计算机上，所有其他的仓库都被认为是远程仓库。远程仓库的主要目的是为了让你的代码可以被团队的其他人访问到，因此并不会在其中（远程仓库）进行活动开发。本地仓库位于本地计算机上，你可以在其中进行所有软件开发。

### Don’t Be Scared of Branching or Merging 不要还怕分支和合并

在SVN中，你通过在你的工作副本中编辑文件来提交，然后运行 `svn commit` 来发送代码到中心库。然后其他人就可以通过`svn update`拉取这些修改到他们自己的工作副本中。SVN分支通常避讳用于项目的大型，长期运行方面，因为合并是一个危险的过程，有可能破坏项目结构。

Git的基本开发工作流程是非常不同的。Git开发围绕着分支和合并而不是受限于单一的开发线（例如，trunk/）。

当你想要在Git中开始处理任何事情时，你可以用 `git checkout -b <branch-name> ` 创建并签出一个新的分支。这让你有了一条专有的开发支线，你可以在这条支线上写代码，不用担心影响到团队里的其他任何人。如果你破坏了一些东西无法修复，你只需要使用`git branch -d <branch-name> ` 抛弃分支。如果你构建了一些有用的东西，就提交一个pull请求，要求将其合并到master分支中。

### Potential Git Workflows 潜在的Git工作流

当你选择Git工作流的时候，考虑你的团队需求很重要。一个简单的工作流可以最大化开发速度和灵活性，而更复杂的工作流程可以确保更高的一致性和对正在进行的工作的控制。

-  [中心化工作流](https://www.atlassian.com/git/tutorials/comparing-workflows/centralized-workflow/) 提供与常见SVN流程最接近的匹配，所以这是一个很好的入门选项。
- 基于这个想法，使用[功能分支工作流](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) 可以让开发人员保持工作的独立性，并保护重要的共享分支。功能分支也构成了通过pull请求来管理更改的基础。
- 一个[Gitflow 工作流](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) 是功能分支的一个更加正式的，结构化的扩展，使其成为具有明确定义的发布周期的大型团队的理想选择。
- 最后，如果你需要最大限度地隔离和控制更改，或者让更多开发人员贡献于同一个存储库，请考虑[forking 工作流](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow) 。

但是，如果你真的想要充分利用Git，作为专业团队，你应该考虑用**功能分支工作流**。这是一个真正分布式工作流，具有高度安全性，令人难以置信的可扩展性和典型的敏捷性。

### Conclusion 总结

将团队迁移到Git可能是一个艰巨的任务，但是也不一定是。这篇文章介绍了一些常用的选项来迁移你的代码库，将Git融入到你的开发团队，以及处理安全和权限问题。我们也介绍了开发者在迁移过程中应该为止做好准备的最大挑战。

希望你现在以及有了坚实的基础来将分布式开发引入你的公司，无论其规模或其当前的开发实践。