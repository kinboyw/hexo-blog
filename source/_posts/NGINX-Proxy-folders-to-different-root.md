---
title: 'NGINX: Proxy folders to different root'
date: 2018-10-17 17:40:17
tags: [Nginx]
categories: 
- [Nginx]
---



原文: [NGINX: Proxy folders to different root](https://raymii.org/s/tutorials/NGINX_proxy_folder_to_different_root.html)

------

这篇教程教你在 Nginx 中将站点的不同目录设置成不同的反向代理站点的根目录。

默认情况下，假设有一个设置了 `proxy_pass` 的 `location` 区块，这个 `location` 区块匹配的是一个目录，例如 `/wiki` ，访问这个目录将跳转到代理服务器：

```
location /nagios/ {
    proxy_pass  http://10.0.21.8:80/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_redirect    off;
}
```

当在浏览器中访问的时候，上面的配置会将你的请求发送到 `http://10.0.21.8/nagios/` ，因为这就是 Nginx `location` 的默认行为。然而如果你想要浏览器转发请求到 `http://10.0.21.8/` ，你要么 `rewrite` URL 要么就使用 `/` location。

<!--more-->

下面是正确的重写规则的示例：

```
location /nagios/ {
    rewrite ^/nagios(/.*)$ $1 break;
    proxy_pass  http://10.0.21.8:80/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
    proxy_redirect    off;
}
```

可以这一行配置：

```
rewrite ^/collectd(/.*)$ $1 break;
```

它解决了问题, 将你的请求发送到 `http://10.0.21.8/` 而不是 `http://10.0.21.8/nagios`.