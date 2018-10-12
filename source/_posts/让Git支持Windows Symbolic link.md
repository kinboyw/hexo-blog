---
title: Symbolic Links|符号链接
date: 2018-08-10 18:22:34
tags:
- git
- symbolic links
---



原文：[Symbolic links](https://github.com/git-for-windows/git/wiki/Symbolic-Links)

Short version: there is no exact equivalent for POSIX symlinks on Windows, and the closest thing is unavailable for non-admins by default. Therefore, symlink emulation support is switched off by default and needs to be configured by you, the user, via the `core.symlinks=true` config setting.

>  简介：Windows平台上没有与POSIX的symlinks完全对等的对象，最接近的一种类型（symbolic link）默认对非管理员用户是不可用的。所以，在安装Git-windows的时候默认关闭了支持 symlink 的选项，需要用户通过设置 `core.symlinks=true`  配置项来手动配置。 

<!--more-->

# Background

Starting with Windows Vista, there is support for symbolic links. These are not your grandfather's Unix symbolic links; They differ in quite a few ways:

> Windows从Vista开始支持symbolic links（符号链接）。这不是你爷爷的Unix上的symbolic links，他们非常不同：

- Symbolic links are only available on Windows Vista and later, most notably not on XP

  > Symbolic links 只在Windows Vista 和更新的版本中可用，甚至XP中都不行。

- You need the `SeCreateSymbolicLinkPrivilege` privilege, which is by default assigned only to Administrators and guarded by UAC, but can be assigned to other users or user groups (see below).

  > 你需要`SeCreateSymbolicLinkPrivilege` 权限来创建Symbolic links，这个权限默认是只分配给Administrators，被UAC守护的，但是也可以分配给其他用户和用户组。

- Symbolic links on remote filesystems are disabled by default (call `fsutil behavior query SymlinkEvaluation` to find out)

  > 默认情况下禁用远程文件系统中的Symbolic links（调用 `fsutil behavior query SymlinkEvaluation` 可以看到）

- Symbolic links will only work on NTFS, not on FAT nor exFAT

  > Symbolic links 只能作用在NTFS文件系统中，不能用于FAT和exFAT

- Windows' symbolic links are typed: they need to know whether they point to a directory or to a file (for this reason, Git will update the type when it finds that it is wrong)

  > Windows 的Symbolic links是有类型的：它们需要知道它们被指向的是目录还是文件（因此，Git在发现错误时会更新类型）

- Many programs do not understand symbolic links

  > 许多程序不能识别symbolic links

For those reasons, Git for Windows disables support for symbolic links by default (it will still read them when it encounters them). You can enable support via the `core.symlinks` config variable, e.g. when cloning:

> 因为这些原因，Git for Windows 默认禁用了对Symbolic links的支持（当遇到symbolic links时，Git仍然会读取它们）。你可以通过修改配置项`core.symlinks`的值来启用对Symbolic links的支持，例如在`clone`仓库的时候：

```
git clone -c core.symlinks=true <URL>
```

# 创建 symbolic links

By default, the `ln -s` command in *Git Bash* does *not* create symbolic links. Instead, it creates copies.

> 默认情况下，Git Bash中的 `ln -s` 命令不会创建symbolic links。相反，它会创建副本。

To create symbolic links (provided your account has permission to do so), use the built-in `mklink` command, like so:

> 要创建Symbolic links（如果你的账户有权限这样做），请使用Windows的`cmd.exe`内建的`mklink` 命令，像这样：

```shell
mklink /d this-link-points-to c:\that-directory 	#创建目录类型的symbolic link
mklink this-link-points-to c:\that-file		#创建文件类型的symbolic link
```

因为执行`mklink`需要管理员权限，所以在Windows命令行中执行`mklink`时需要用管理员权限启动命令行工具。