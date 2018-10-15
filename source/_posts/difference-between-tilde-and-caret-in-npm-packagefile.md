---
title: NPM package.json 中的 tilde (~) 和 caret (^) 
date: 2018-10-12 16:33:27
tags: [npm,web,FE]
---



原文：[What's the difference between a tilde (~) and a caret (^) in a npm package.json file?](https://michaelsoolee.com/npm-package-tilde-caret/)

If you use npm to manage packages in your JavaScript application, you’re probably familiar with the package.json file.

如果你用 `npm` 来管理 `JavaScript` 应用程序的 `package` ，那你应该熟悉 `package.json` 文件了。

```
{
  "devDependencies": {
    "ember-cli": "~2.14.0"
  }
}
```

The syntax is in JSON format where the key is the name of the package and the value is the version of the package to be used.

语法是 `JSON` 格式，key 是 package 的名称，value 是要使用的这个 package 的版本号。

npm uses the package.json file to specify the version of a package that your app depends on.

npm 就是用 `package.json` 文件来声明你的 app 依赖的 package 的版本的。

The version number is in [semver syntax](http://semver.org/) which designates each section with different meaning. semver is broken into three sections separated by a dot.

```
major.minor.patch

1.0.2
```

Major, minor and patch represent the different releases of a package.

npm uses the tilde (~) and caret (^) to designate which patch and minor versions to use respectively.

So if you see `~1.0.2` it means to install version `1.0.2` or the latest patch version such as `1.0.4`. If you see `^1.0.2` it means to install version `1.0.2` or the latest minor or patch version such as `1.1.0`.