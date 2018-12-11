---
title: 从Linux系统中恢复最近误删的文件
date: 2018-10-13 22:14:08
copyright: true
tags: [linux]
categories: 
- [Linux]
---



​	谁都会有手抖的时候，晚上远程公司的ArchLinux时不小心 `sudo rm -rf Desktop` 了一下，然后开始尝试恢复误删文件。

> google了一篇恢复的教程：[PhotoRec – Recover Deleted or Lost Files in Linux](https://www.tecmint.com/photorec-recover-deleted-lost-files-in-linux/)

​	当我们不小心用 `shift + delete` ，删除选项，或者清空回收站的方式删除了文件的时候，文件的内容实际上并没有被从硬盘上擦除。系统只是简单的将这些文件从目录结构中移除了，所以在被删的文件夹下看不到删除的文件了，但是他们实际上仍然保存在硬盘上被删除的位置上。

​	只要具备了正确的工具和知识，你就可以将他们从电脑上恢复出来。但是如果你从硬盘上恢复更多文件时，最近被删除的文件可能会被覆盖，导致你可能拿不到最近删除的文件。

<!--more-->

​	我们将使用 `Testdisk` 这个工具来完成本次Linux下的文件恢复操作，`Testdisk` 是一款非常出色的恢复工具套件，附带一个名为 `PhotoRec` 的免费工具。

## 在Linux上安装 `Testdisk(PhotoRec)`

```shell
------- On Debian/Ubuntu/Linux Mint ------- 
$ sudo apt-get install testdisk

------- On CentOS/RHEL/Fedora ------- 
$ sudo yum install testdisk

------- On Fedora 22+ ------- 
$ sudo dnf install testdisk   

------- On Arch Linux ------- 
$ pacman -S testdisk             

------- On Gentoo ------- 
$ emerge testdisk  
```

也可以去管网下载二进制安装包来手动安装，[地址](https://www.cgsecurity.org/wiki/TestDisk_Download)

## 恢复文件

工具安装完成后，需要在 shell 中用 `root` 权限启动 `PhotoRec`，指定被删除文件所在的分区，我这次是在 `/dev/sda2` :

```shell
sudo photorec /dev/sda2
```

然后可以看到这样的界面

{%asset_img 1.png%}

使用左右键选择菜单按钮，回车确定。这里选 `Proceed`，然后敲回车。

出现这样的界面：

{%asset_img 2w.png%}

选择 `Options` 查看有哪些恢复操作选项：

{%asset_img 3.png%}

键盘按 `Q` 返回，在下面的界面中，你可以指定你想搜索和恢复的文件扩展名。选择 `File Opt` 然后回车。

按 `s` 来启用/禁用选择所有的文件扩展，如果你已经禁用了所有文件扩展名，则只需要使用右键（或者左键取消选择）选择要恢复的文件扩展类型。

{%asset_img 4.png%}

这里我选择恢复 `jpg` 和一些其他类型。

然后按 `b` 来保存设置，应该能看到下图的消息。按回车键返回（也可以按 `Q`），然后再按 `Q` 返回到主菜单。

{%asset_img 5.png%}

现在选择 `Search` 选项来开始恢复操作，在下面的界面中，选择被删文件所在的文件系统类型，然后按回车。

{%asset_img 6.jpg%}

接下来，选择是只有空余空间还是整个分区都要分析。注意，选择全分区可能会使分区变慢，耗时更长。一旦你选择了合适的分区选项，按回车继续。

{%asset_img 7.png%}

选择一个目录存放将要恢复出来的文件，如果目标正确，按 `C` 继续。

选择不同分区上的一个文件夹，避免被删文件被这个分区上恢复出来的其他文件覆盖。

要选择 root 分区，用 `左键`。

{%asset_img 8.png%}

这里，我在根目录下创建了一个 `recover` 文件夹用来存放恢复文件

```shell
sudo mkdir /recover
```

下面的截图展示了恢复出来的指定类型的被删文件。你可以按回车来停止操作。

注意：你的系统可能会变慢，某些时候还可能卡顿，需要耐心等待知道整个过程完成。

{%asset_img 9.png%}

​	在整个过程的最后，`PhotoRec` 会告诉你恢复的文件数量和存放的位置。

​	被恢复出来的文件默认是用 root 权限存储的，所以也要用提升的权限打开文件管理器以访问文件。

​	操作有疑问的可以去 PhotoRec 官网上去看看文档：[http://www.cgsecurity.org/wiki/PhotoRec](https://www.cgsecurity.org/wiki/PhotoRec).

## 注意事项

​	恢复出来的文件名会被恢复工具重命名，文件存放目录也不是按照删除之前的样子，要从恢复出来的文件中找到自己需要的那几个，还是要费点功夫的。

​	如果你像我一样，也是在远程 shell 中执行恢复过程，为了避免远程 shell 因为网络问题终端而导致 PhotoRec 的恢复进程被中止，建议在 `screen` 中执行恢复操作，这样及时远程 shell 断开，恢复进程也会在后台继续执行，再次远程登录时还可以恢复到之前的界面。