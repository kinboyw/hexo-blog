---
title: CentOS 7.4 配置路由网关服务器
date:  2018.09.07
tags: [vpn,linux]
---



Linux具有内核级的路由表，默认是没有启用转发功能的，添加网卡的IP转发功能

```shell
sudo vim /etc/sysctl.conf
#添加如下行
net.ipv4.ip_forward = 1
```

重载网络配置，使生效

```shell
sudo sysctl -p
```

开启public区域ip伪装

```shell
sudo firewall-cmd --permanent --zone=public --add-masquerade
```

开启public区域ip端转发

```shell
sudo firewall-cmd --permanent --zone=public --add-rich-rule='rule family=ipv4 source address=192.168.12.0/24 masquerade'
```

上面命令中192.168.12.0/24 IP段包含了路由器IP：192.168.12.252，这样设置会导致CentOS与路由器的通信被转发，VPN断开连接，这里只需要指定我们需要的一部分网段就可以了。

重新加载防火墙配置

```shell
sudo firewall-cmd --reload
```

