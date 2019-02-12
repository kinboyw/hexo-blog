---
title: 配置 Nginx HTTPS 服务器
type: categories
copyright: true
date: 2019-01-17 09:56:24
tags: [Nginx,HTTPS]
categories: 
- [Nginx]
---

译自官方文档—— [Configuring HTTPS servers](http://nginx.org/en/docs/http/configuring_https_servers.html)

要配置 HTTPS 服务器，必须在 server 区的监听（listen）套接字上允许 ssl 参数，同时要声明服务器证书和私钥文件的位置：

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

​	服务器证书是一个公开的实体。它会被发送给所有连接到服务器的客户端。私钥是一个安全实体，应该被保存在一个限制访问的文件中，但是要允许 Nginx 的主线程可读。私钥也可以保存在和证书同一个文件中：

    ssl_certificate     www.example.com.cert;
    ssl_certificate_key www.example.com.cert;
​	这种情况下文件的访问权限也应当被限制。尽管证书和私钥被保存在同一个文件中，只有证书会被发送给客户端。

​	`ssl_protocols` 和 `ssl_ciphers` 指令可以用来限制只允许高版本和强加密的 SSL/TLS 的连接。Nginx 默认使用  `“ssl_protocols TLSv1 TLSv1.1 TLSv1.2”` 和 `“ssl_ciphers HIGH:!aNULL:!MD5”`，所以通常不需要特意配置它们。要知道这些指令的默认配置变过几次。

<!--more-->

### HTTPS server optimization HTTPS 服务器优化
​	SSL 操作消耗额外的 CPU 资源。在多处理器系统中应该启动多个工作进程，数量不少于可用的 CPU 内核。最消耗 CPU 的操作是 SSL 握手。有两种方法可以让每个客户端的握手次数降低到最小：第一种是通过允许 `keepalive` 连接，这样就可以实现连接复用，即通过一个连接发送多个请求；第二种是重用 SSL 会话参数来避免并发请求和自请求的 SSL 握手。这些会话被保存在一个被工作进程共享的 SSL 会话缓存中，可以通过 `ssl_session_cache` 指令来配置。1MB 缓存可以包含 4000 个会话。默认的缓存过期时间是 5 分钟。可以通过 `ssl_session_timeout` 指令增加过期时间。下面是一个简单的配置，通过设置 10MB 共享会话缓存来优化一个多核系统：

``` nginx
worker_processes auto;

http {
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 10m;

    server {
        listen              443 ssl;
        server_name         www.example.com;
        keepalive_timeout   70;

        ssl_certificate     www.example.com.crt;
        ssl_certificate_key www.example.com.key;
        ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers         HIGH:!aNULL:!MD5;
        ...
```

### SSL 证书链

​	某些浏览器可能会抱怨由知名证书颁发机构签名的证书，而其他一些浏览器可能毫无问题的接受证书。发生这种情况是因为颁发机构使用中间证书对服务器进行了签名，该中间证书不存在于与特定浏览器一起分发的众所周知的可信任的证书颁发机构的证书库中。 这种情况下，颁发机构提供了一组链式证书，通过证书链应该能够链接到签名的服务器证书。在合并文件中，服务器证书必须出现在链式证书之前：

`$ cat www.example.com.crt bundle.crt > www.example.com.chained.crt`

结果文件应该用在 `ssl_certificate` 指令中：

```nginx
server {
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.chained.crt;
    ssl_certificate_key www.example.com.key;
    ...
}
```

​	如果服务器证书和链式证书用错误的顺序连接了，nginx将不能正常启动，并现实 错误信息：

>  SSL_CTX_use_PrivateKey_file(" ... /www.example.com.key") failed
>    (SSL: error:0B080074:x509 certificate routines:
> ​    X509_check_private_key:key values mismatch)

​	因为 nginx 尝试用私钥和链式证书中的第一个证书而不是服务器证书。

​	浏览器通常会保存接受到的由可信任颁发机构签发的中间证书，所以频繁使用的浏览器可能已经获取过中间证书，所以遇到没有包含链式证书的服务器证书就不会出现警告。为确保服务器发送了完整的证书链，可以用 openssl 命令行工具测试，例如：

```shell
$ openssl s_client -connect www.godaddy.com:443
...
Certificate chain
 0 s:/C=US/ST=Arizona/L=Scottsdale/1.3.6.1.4.1.311.60.2.1.3=US
     /1.3.6.1.4.1.311.60.2.1.2=AZ/O=GoDaddy.com, Inc
     /OU=MIS Department/CN=www.GoDaddy.com
     /serialNumber=0796928-7/2.5.4.15=V1.0, Clause 5.(b)
   i:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc.
     /OU=http://certificates.godaddy.com/repository
     /CN=Go Daddy Secure Certification Authority
     /serialNumber=07969287
 1 s:/C=US/ST=Arizona/L=Scottsdale/O=GoDaddy.com, Inc.
     /OU=http://certificates.godaddy.com/repository
     /CN=Go Daddy Secure Certification Authority
     /serialNumber=07969287
   i:/C=US/O=The Go Daddy Group, Inc.
     /OU=Go Daddy Class 2 Certification Authority
 2 s:/C=US/O=The Go Daddy Group, Inc.
     /OU=Go Daddy Class 2 Certification Authority
   i:/L=ValiCert Validation Network/O=ValiCert, Inc.
     /OU=ValiCert Class 2 Policy Validation Authority
     /CN=http://www.valicert.com//emailAddress=info@valicert.com
...
```

​	当用 SNI 测试配置的时候，指定 `-servername` 选项是很重要的，因为 openss 默认不使用 SNI 。

​	在该示例中，www.godaddy.com 服务器证书 #0 的主体由发行者（“ i ”）签名，发行者（“ i ”）本身是证书 #1  的主体，证书 #1 签名的发行者又是 证书 #2  的主体，证书 #2 是由知名发行方 ValiCert, Inc 签名的，ValiCert, Inc. 的证书保存在浏览器的内置证书库中。

​	如果缺少证书链，浏览器只能看到服务器证书 #0。

### 单 HTTP/HTTPS 服务器

可以配置一个单独的服务器来同时处理 HTTP 和 HTTPS 请求：

```nginx
server {
    listen              80;
    listen              443 ssl;
    server_name         www.example.com;
    ssl_certificate     www.example.com.crt;
    ssl_certificate_key www.example.com.key;
    ...
}
```

​	早在 0.7.14 版本之前，还不能像上面那样为个别 socket 监听选择性启用 SSL。SSL 只能通过 `ssl` 指令用于整个 server 配置，使得不可能配置一个单独的 HTTP/HTTPS 服务器。于是在`listen` 指令中添加 `ssl` 参数来解决这个问题。但是不鼓励在现代版本中使用 `ssl` 指令。

### 基于域名的 HTTPS 服务器

当配置两个或者多个 HTTPS 服务器监听同一个 IP 地址时会出现的一个常见的问题：

> server {
> ​    listen          443 ssl;
> ​    server_name     www.example.com;
> ​    ssl_certificate www.example.com.crt;
> ​    ...
> }
>
> server {
> ​    listen          443 ssl;
> ​    server_name     www.example.org;
> ​    ssl_certificate www.example.org.crt;
> ​    ...
> }

​	使用此配置,浏览器接受默认服务器的证书，即 www.example.com ，不论请求的服务器名称如何。这是由 SSL 协议的行为所致。SSL  连接是在浏览器发送 HTTP 请求之前建立的，nginx 不知道请求的服务器的名称。所以，它只能提供默认的服务器证书。

​	解决这个问题的最古老也是最稳定的办法就是为每个 HTTPS 服务器分配一个单独的 IP 地址：

> server {
> ​    listen          192.168.1.1:443 ssl;
> ​    server_name     www.example.com;
> ​    ssl_certificate www.example.com.crt;
> ​    ...
> }
>
> server {
> ​    listen          192.168.1.2:443 ssl;
> ​    server_name     www.example.org;
> ​    ssl_certificate www.example.org.crt;
> ​    ...
> }

### 具有多个域名的 SSL 证书

​	也有其他的方法允许在多个 HTTPS 服务器之间共享一个单独的 IP 地址。但是，所有这些办法都有副作用。一种方法是在证书的 `SubjectAltName` 字段上使用多个域名，例如 www.example.com 和 www.example.org。但是，`SubjectAltName` 字段的长度有限。

​	另一个方法是让证书使用通配符域名，例如，*.example.org。一个通配符证书能够加固指定域名的所有子域名，但仅限于一个级别。证书匹配 www.example.org，但是不能匹配 example.org 和 www.sub.example.org 。 这两种方法也可以合并。一个证书可以在 `SubjectAltName` 字段中包含准确的和通配符的域名，例如，`example.org  and *.example.org`。

​	最好将多域名证书文件和对应的私钥文件放在 http 级别的配置区域，以使证书的单个内存拷贝能够在所有服务器配置中共享： 

```nginx
ssl_certificate     common.crt;
ssl_certificate_key common.key;

server {
    listen          443 ssl;
    server_name     www.example.com;
    ...
}

server {
    listen          443 ssl;
    server_name     www.example.org;
    ...
}
```

### 服务器域名指示（SNI）

​	一个用于在单个 IP 地址上承载多个 HTTPS 服务器的更加通用的解决方案是使用 TLS Server Name Indicationj 扩展（SNI, RFC 6066），SNI 允许浏览器在 SSL  握手期间上传请求的服务器域名，于是服务器就能知道应该将哪个证书用于这个连接。SNI 现在已经被大多数现代浏览器支持，但是一些老版本的或者特定的浏览器还没有支持。  

​	SNI 中只能传递域名，但是如果一个请求中包含了字面的 IP 地址，有些浏览器可能错误地传递这个服务器的 IP 地址。不能完全依赖 SNI。

​	为了在 nginx 中使用 SNI，必须在构建 nginx 二进制的 OpenSSL 库以及在运行时动态链接到的库中支持它。OpenSSL 从 0.9.8f 版本开始支持 SNI ，需要在编译时指定编译选项 `”--enable-tlsext“`。从 OpenSSL 0.9.8j 版本开始，这个选项是默认开启的。如果 nginx 编译时支持了 SNI，运行 nginx 命令时加上 "-V" 开关会显示出来：

```nginx
$ nginx -V
...
TLS SNI support enabled
...
```

​	然而，如果开启了 SNI 的 nginx 动态链接到了不支持 SNI 的 OpenSSL 二进制，nginx 会显示警告：

> nginx was built with SNI support, however, now it is linked
> dynamically to an OpenSSL library which has no tlsext support,
> therefore SNI is not available