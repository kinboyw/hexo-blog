---
title: Gitlab Docker容器中SSH端口失效问题
date: 2018-08-06
tags: [docker,gitlab,ssh]
---



在Gitlab配置文件/srv/gitlab/config/gitlab.rb中，将SSH协议的端口设置为8822了，但是在一些情况下会出现用SSH协议的Url执行网络同步操作时提示` "访问被拒，可能是权限问题"` 。

例如在我在服务器上`sudo docker rm gitlab` 之后再重新 `sudo docker run`之后就会重现以上问题。

排查过程如下：

SSH连接远程连接到12.1服务器，查看SSH进程的运行状态

```shell
sudo ps -aux | gerp sshd	
```

得到如下图所示输出

{% asset_img 1535944132772.png %}

<!--more-->

可以看到12.1服务器上的`sshd`进程启动的配置文件是`/assets/sshd_config` ，而一般默认的配置路径是`/etc/ssh/sshd_config`，没找到是什么原因，不过有了这个线索就可以顺藤摸瓜了。

打开配置文件

```shell
sudo vim /assets/sshd_config
```

发现是空的。

那就只能进到`gitlab`的docker container里面去看看了

```shell
sudo docker exec -ti docker bash
vim /assets/sshd_config
```

如图


{% asset_img "1535944611703.png" "" %}


发现这个配置文件里面设置的 ssh 端口号是 22。我们把它改成 8822 端口，`:wq`保存退出，` service ssh restart` 重启ssh服务，就解决问题了。