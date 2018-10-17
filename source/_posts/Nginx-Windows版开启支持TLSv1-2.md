---
title: Nginx-Windows版开启支持TLSv1.2
date: 2018-10-17 10:53:27
tags: [Nginx,HTTPS]
categories: 
- [Nginx]
---



微信小程序要求使用 `https` 发送请求，并且 `TLS`（传输层安全协议）的版本至少为 `1.2`，在配置好 `https`之后，如果 `TLS` 的版本较低，就涉及到升级问题

从申请免费证书到配置 Nginx HTTPS 配置，有一篇比较完整的教程：[微信小程序Server端环境配置](https://mp.weixin.qq.com/s?__biz=MzA4Nzc4MjI4MQ==&mid=2652402451&idx=1&sn=56e3122d6c8774ba457d2ced49c8321a&chksm=8bd8f5f5bcaf7ce3e4b51336e7e7debbaad5c6e02954982756ed0da0572127b61d8754f6cb79&mpshare=1&scene=23&srcid=0110JlMJP90O3osLzHgO3onE#rd)

Linux 下配置的教程有很多，这里记录一下 Windows 中的配置过程，公司的 Nginx 跑在 Windows Server 上。

- 操作系统：Windows Server 2008 R2 
- Nginx版本：ngixn/1.12.2 for Windows
- 证书：腾讯云管理后台用 TrustAsia 签发的免费证书，有效期一年

当前 Nginx 配置中，Https 有关的配置：

```nginx
ssl_certificate      1_gis.wohitech.com_bundle.crt;
ssl_certificate_key  2_gis.wohitech.com.key;

ssl                  on;

ssl_protocols  SSLv2 SSLv3 TLSv1;
ssl_ciphers  HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers   on;				
```



<!--more-->

腾讯云提供了[工具](https://cloud.tencent.com/product/ssl)可以监测域名是否支持 HTTPS TLS1.2，当前检测可以看到不通过。

{%asset_img ssl-check.png%}

在火狐浏览器中打开网址，点击地址栏左侧的锁图标，可以查看当前域名的 HTTPS 加密协议版本，当前为 TLS 1.0

{%asset_img firefox-tls-version.png%}



找到了 Nginx 官网文档提供的 HTTPS 配置文档，[Configuring HTTPSS servers](https://nginx.org/en/docs/http/configuring_https_servers.html)

对比示例，我发现在 `ssl_protocols` 这一行的配置中，官方示例包含了 TLSv1.2

```nginx
server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers         HIGH:!aNULL:!MD5;
    ...
}
```

我用官方示例的配置替换了生产环境 Nginx 的配置，成功！

注意，在服务端修改 Nginx 配置后，浏览器再次访问前需要先清一下浏览器缓存，否则火狐中看到的是缓存的之前的证书信息。

FireFox 中查看域名的 TLS 版本

{%asset_img firefox-tls-version-ok.png%}

腾讯云检测结果

{%asset_img ssl-check-ok.png%}