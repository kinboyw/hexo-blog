---
title: 迁移Jenkins作业到新的Jenkins服务器
date: 2018-10-15 12:58:49
tags: [Jenkins,CI,运维,架构]
categories:
- [架构]
- [运维]
- [Jenkins]
---



最近在公司搭建 Jenkins 持续集成环境，要将测试环境中配置的 Jenkins 作业导入到正式环境中，上网找了下资料，大概有三种可行的方案:

1. 拷贝作业文件夹
2. 用Jenkins插件
3. 用Jenkins cli 命令

有更好的办法欢迎交流。

<!--more-->

## 选项1：拷贝 `jobs` 目录

One option (and seems to be the recommended one) is to just copy the `jobs` directory from the old server to the new one.

一个方案是直接拷贝旧的  Jenkins 服务安装目录下的 `jobs` 文件夹到新服务同级目录下，这也是较为推荐的方案。

引自这篇文件 [Moving/copying/renaming jobs](https://wiki.jenkins-ci.org/display/JENKINS/Administering+Jenkins#AdministeringJenkins-Moving%2Fcopying%2Frenamingjobs):

> You can:
>
> > 你可以
>
> 1. Move a job from one installation of Jenkins to another by simply copying the corresponding job directory.
>
>    > 通过简单的拷贝对应的 job 目录将一个作业从一个 Jenkins 安装实例移动到另一个中。
>
> 2. Make a copy of an existing job by making a clone of a job directory by a different name.
>
>    > 可以通过克隆和重命名一个 job 文件夹来制作一个已有作业的副本。
>
> 3. Rename an existing job by renaming a directory. Note that the if you change a job name you will need to change any other job that tries to call the renamed job.
>
>    > 通过重命名文件夹来重命名一个已有的作业。注意如果你改变了一个作业的名称，你需要改变所有依赖这个作业的其他作业。
>
> Those operations can be done even when Jenkins is running. For changes like these to take effect, you have to click "reload config" to force Jenkins to reload configuration from the disk.
>
> > 这些选项可以在 Jenkins 正在运行的情况下操作。为了让改变生效，你必须点击 “重新加载配置”来强制 Jenkins 从硬盘重新加载配置。

## 选项2：尝试下面这两个插件

有一些 Jenkins 插件提供了作业导出的选项，下面推荐了两个：

- [Job Exporter Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Job+Exporter+Plugin) 这个插件并没有真正导出作业，而是改变了作业运行时的环境变量。
- [Job Importer Plugin](https://wiki.jenkins-ci.org/display/JENKINS/Job+Import+Plugin)

## 选项3：使用 [Jenkins CLI](https://wiki.jenkins-ci.org/display/JENKINS/Jenkins+CLI)

我使用了这种方案，它比较适合作业数量较少的情况下使用。如果你有非常多的 Jenkins 作业，你可以考虑下第一种方案。

1. 第一步，下载 `Jenkins CLI` 的 jar 包文件。

- 你可以在你的 Jenkins 安装实例的 `Jenkins CLI` 页面上下载。

{%asset_img JenkinsCLIMenu.png%}

2. 接着我们可以用下面的命令（指向旧服务器）来列出作业。

``` shell
java -jar jenkins-cli.jar -s http://<YourBuildServer>:<YourBuildServerPort>/ list-jobs
```

3. 使用上面列表中的一个作业，将作业的 xml 复制到剪贴板。（下面以`Mac` 为例，剪贴板用 `pbcopy` 和 `pbpaste` ）

``` shell
java -jar jenkins-cli.jar -s http://<YourBuildServer>:<YourBuildServerPort>/ get-job "NAME_OF_JOB" | pbcopy
```

 这里使用 cli 的 `get-job “NAME_OF_JOB”` 命令将这个 作业的 xml 打印到 `stdout` 标准输出，接着用管道符 输出到 *Mac* 的 `pbcopy` 以将配置加载到剪贴板。你当然也可以管道输出到一个文件中，像这样 `... > config.xml`。 

4. 如果用上面的命令将作业的 XML 放到了剪贴板中，你可以用下面的命令来将作业添加到新服务器上。

```
pbpaste | java -jar jenkins-cli.jar -s http://<YourBuildServer>:<YourBuildServerPort> create-job "NAME_OF_JOB"
```

This uses `pbpaste` to take what is in the clipboard, send it to `stdin` and pipe it to the Jenkins cli's `create-job "NAME_OF_JOB"`command. 这一步使用了 `pbpaste` 来获取剪贴板中的内容，发送到 `stdin` 标准输入，然后管道传递给 Jenkins cli `create-job "NAME_OF_JOB"` 命令。

希望能帮到你