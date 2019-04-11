---
title: NPM package.json 中的 tilde (~) 和 caret (^) 
date: 2018-10-12 16:33:27
copyright: true
tags: [npm]
categories: 
- [FE,工程化]
---



原文：[What's the difference between a tilde (~) and a caret (^) in a npm package.json file?](https://michaelsoolee.com/npm-package-tilde-caret/)



如果你用 `npm` 来管理 `JavaScript` 应用程序的 `package` ，那你应该熟悉 `package.json` 文件了。

```json
{
  "devDependencies": {
    "ember-cli": "~2.14.0"
  }
}
```

语法是 `JSON` 格式，key 是 package 的名称，value 是要使用的这个 package 的版本号。

<!--more-->

npm 就是用 `package.json` 文件来声明你的 app 依赖的 package 的版本的。

版本号以 [semver 语法](http://semver.org/) 表示，它指定每个部分具有不同的含义。semver 被点号划分成 3 各部分。

```shell
major.minor.patch

1.0.2
```

Major，minor 和 patch 代表包的不同发行版本。

Npm 用波浪线（~）和插入符（^）来分别指定要使用的 patch（补丁）和 minor（小）版本。

所以如果你看到了 `~1.0.2` 就表示要安装 `1.0.2` 或以上的 patch 版本，例如 `1.0.4` 。如果你看到 `^1.0.2` 就表示要安装 `1.0.2` 或者最新的 minor 版本或者 patch 版本，例如 `1.1.0` 。

