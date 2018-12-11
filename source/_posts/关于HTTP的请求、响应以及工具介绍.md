---
title: 关于HTTP的请求、响应以及 CURL 工具介绍
type: categories
copyright: true
date: 2018-10-23 23:40:58
tags: [HTTP]
categories: [FE,HTTP]
---



在像 HTTP 这样的客户端 - 服务器协议中，会话一般包含三个部分：

1. 客户端建立 TCP 连接（或者如果传输层不是 TCP 的话就是某种适当的连接）。
2. 客户端发送请求，并等待服务器应答
3. 服务器处理请求，回送应答，提供状态码和适当的数据。

对于 HTTP/1.1来说，在完成第三步以后，连接不再被关闭，客户端可以立刻发起进一步的请求：这意味着第二、三两步现在可以执行任意次。即连接的复用。



<!--more-->

## 建立连接

在客户端 - 服务器协议中 ，是客户端建立连接。打开一个 HTTP 连接意味着在底层传输层中启动连接，通常这层传输层是 TCP。

对于 TCP ，默认端口（对于计算机上的 HTTP 服务器）是端口80。其他的端口也可以 使用，像 8000 或者8080 这些。获取一个页面的 URL 包含了域名和端口号，如果后者是80端口则通常可以忽略。

> 注意：客户端 - 服务器模型不允许服务器在没有明确的请求的情况下发送数据给客户端。为了解决这个问题，Web 开发者们使用了一些技术：用 [`XMLHTTPRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHTTPRequest) 轮询服务器，使用 [`Fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch) API，使用  [WebSockets API](https://developer.mozilla.org/en/WebSockets) ，或者相似的协议。

## 发送客户端请求

一旦请求建立，用户代理就可以发送请求（用户代理通常是浏览器，但是也可以是其他的东西，例如，爬虫）。客户端请求中包含了一些用 CRLF （回车换行）分隔开的文本指令，可划分三个块：

1. 第一行包含了一个请求方法，后跟其参数：
   - 文档路径，例如，一个不包含协议或者域名的绝对路径。
   - HTTP 协议版本
2. 后续行代表请求头部，像服务器提供有关适合的数据类型的信息（例如，什么语言，MIME 类型），或者其他改变其行为的数据（例如，如果已经缓存就不发送应答）。这些 HTTP 头组成了一个区块，这个区块以一个空行结尾。
3. 最后一个区块是一个可选的数据块，可能包含了一些主要被 POST 方法使用的数据。

## 示例请求

获取 developer.mozilla.org的根页面，例如，http://developer.mozilla.org/ ，并告诉服务器，如果可能，客户端将更喜欢法语页面：

```http
GET / HTTP/1.1
Host: developer.mozilla.org
Accept-Language: fr
<!--empty line-->

```

注意观察最后的 “empty line”，它将数据数块从头部区块分离开了。由于 HTTP 头部没有提供 `Content-Length` ，因此数据区块显示为空，标记了请求头部的末尾，允许服务器在接收到这个空行时处理该请求。

例如，发送一个表单的结果：

```HTTP
POST /contact_form.php HTTP/1.1
Host: developer.mozilla.org
Content-Length: 64
Content-Type: application/x-www-form-urlencoded

name=Joe%20User&request=Send%20me%20one%20of%20your%20catalogue
```

##  请求方法

HTTP 定义了一组  [请求方法](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)  ，指示要对资源执行的操作。尽管它们也能是名词，这些请求方法有时被称作 HTTP 动词。最常见的请求是 `GET` 和 `POST` ：

- `GET` 方法请求一个代表指定资源的数据。使用 `GET` 方法的请求应该只检索数据。
- `POST`  方法向服务器发送数据，所以它能改变服务器状态。这在 [HTML 表单](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Forms) 中经常用到。

## 服务器响应的结构

用户代理连接并发送数据后，服务器会处理请求和数据，最终返回一个响应。与 客户端请求 类似，服务器响应也是由一些以 CRLF 分隔的文本指令组成，可划分为三个区块：

1. 第一行，状态行，包含了使用的 HTTP 版本，跟着是一个状态请求（及其人类可读的简要含义）。
2. 接下来的几行代表了特定的 HTTP 头部，向客户端提供了关于返回数据的信息（例如，类型，数据大小，使用的压缩算法，关于缓存的提示）。与 客户端请求的 HTTP 头部区块一样，这些响应 HTTP 头部也是以空行结尾组成一个区块。
3. 最后一个区块是数据块，包含了可选的数据。

## 示例响应

成功的应用响应：

```http
HTTP/1.1 200 OK
Date: Sat, 09 Oct 2010 14:28:02 GMT
Server: Apache
Last-Modified: Tue, 01 Dec 2009 20:18:22 GMT
ETag: "51142bc1-7449-479b075b2891b"
Accept-Ranges: bytes
Content-Length: 29769
Content-Type: text/html

<!DOCTYPE html... (here comes the 29769 bytes of the requested web page)
```

请求的资源已被永久转移的通知：

```http
HTTP/1.1 301 Moved Permanently
Server: Apache/2.2.3 (Red Hat)
Content-Type: text/html; charset=iso-8859-1
Date: Sat, 09 Oct 2010 14:30:24 GMT
Location: https://developer.mozilla.org/ (this is the new link to the resource; it is expected that the user-agent will fetch it)
Keep-Alive: timeout=15, max=98
Accept-Ranges: bytes
Via: Moz-Cache-zlb05
Connection: Keep-Alive
X-Cache-Info: caching
X-Cache-Info: caching
Content-Length: 325 (the content contains a default page to display if the user-agent is not able to follow the link)

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="https://developer.mozilla.org/">here</a>.</p>
<hr>
<address>Apache/2.2.3 (Red Hat) Server at developer.mozilla.org Port 80</address>
</body></html>
```

请求的资源不存在的通知：

```http
HTTP/1.1 404 Not Found
Date: Sat, 09 Oct 2010 14:33:02 GMT
Server: Apache
Last-Modified: Tue, 01 May 2007 14:24:39 GMT
ETag: "499fd34e-29ec-42f695ca96761;48fe7523cfcc1"
Accept-Ranges: bytes
Content-Length: 10732
Content-Type: text/html

<!DOCTYPE html... (contains a site-customized page helping the user to find the missing resource)
```

## 响应状态码

[HTTP 响应状态码](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) 指示了一个 HTTP 请求是否成功执行。响应被分成了5类：通知类响应，成功响应，重定向，客户端错误，服务端错误。

- `200`: OK。请求成功。
- `301`: 永久转移。这个返回码意味着请求的资源的 URI 发生了改变。
- `404`: 未找到。服务器没找到请求的资源。

## curl 应用

curl  是一个用于在客户端和服务器之间发送数据的工具，支持很多种协议（DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTSP, SCP, SFTP, SMB, SMBS, SMTP, SMTPS, TELNET and TFTP）。该工具提供的功能类似浏览器，可以作为用户代理向服务器发送请求，但是被设计用于无用户交互环境下使用。

curl 发起一个 GET 请求

```shell
curl -s -v -H "Name: kinboy" -- "http://example.org"
```

参数选项的含义可以使用命令 `man curl` 查询，或者将命令直接粘贴到 https://explainshell.com/# 页面的搜索栏就可以清晰的看到每个选项的含义。

```shell
* Rebuilt URL to: http://example.org/
*   Trying 93.184.216.34...
* TCP_NODELAY set
* Connected to example.org (93.184.216.34) port 80 (#0)
> GET / HTTP/1.1
> Host: example.org
> User-Agent: curl/7.58.0
> Accept: */*
> Name: kinboy
>
* HTTP 1.0, assume close after body
< HTTP/1.0 200 OK
< Cache-Control: max-age=604800
< Content-Type: text/html; charset=UTF-8
< Date: Tue, 23 Oct 2018 17:18:21 GMT
< Etag: "1541025663+ident"
< Expires: Tue, 30 Oct 2018 17:18:21 GMT
< Last-Modified: Fri, 09 Aug 2013 23:54:35 GMT
< Server: ECS (sjc/4FC1)
< Vary: Accept-Encoding
< X-Cache: HIT
< Content-Lengti: 1270
< Connection: close
<
<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;

    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 50px;
        background-color: #fff;
        border-radius: 1em;
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        body {
            background-color: #fff;
        }
        div {
            width: auto;
            margin: 0 auto;
            border-radius: 0;
            padding: 1em;
        }
    }
    </style>
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is established to be used for illustrative examples in documents. You may use this
    domain in examples without prior coordination or asking for permission.</p>
    <p><a href="http://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
</html>
* Closing connection 0
```

curl 发起一个 POST 请求

```shell
curl -X POST -d "some data transfer to server" -s -v -H "name: kinboy" -- "http://example.org"
```

响应如下：

```shell
* Rebuilt URL to: http://example.org/
*   Trying 93.184.216.34...
* TCP_NODELAY set
*   Trying 2606:2800:220:1:248:1893:25c8:1946...
* TCP_NODELAY set
* connect to 2606:2800:220:1:248:1893:25c8:1946 port 80 failed: Connection refused
* Connected to example.org (93.184.216.34) port 80 (#0)
> POST / HTTP/1.1
> Host: example.org
> User-Agent: curl/7.58.0
> Accept: */*
> name: kinboy
> Content-Length: 28
> Content-Type: application/x-www-form-urlencoded
>
* upload completely sent off: 28 out of 28 bytes
< HTTP/1.1 200 OK
< Accept-Ranges: bytes
< Cache-Control: max-age=604800
< Content-Type: text/html; charset=UTF-8
< Date: Tue, 23 Oct 2018 17:23:42 GMT
< Etag: "1541025663"
< Expires: Tue, 30 Oct 2018 17:23:42 GMT
< Last-Modified: Fri, 09 Aug 2013 23:54:35 GMT
< Server: EOS (vny006/044F)
< Content-Length: 1270
<
<!doctype html>
<html>
<head>
    <title>Example Domain</title>

    <meta charset="utf-8" />
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
    body {
        background-color: #f0f0f2;
        margin: 0;
        padding: 0;
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;

    }
    div {
        width: 600px;
        margin: 5em auto;
        padding: 50px;
        background-color: #fff;
        border-radius: 1em;
    }
    a:link, a:visited {
        color: #38488f;
        text-decoration: none;
    }
    @media (max-width: 700px) {
        body {
            background-color: #fff;
        }
        div {
            width: auto;
            margin: 0 auto;
            border-radius: 0;
            padding: 1em;
        }
    }
    </style>
</head>

<body>
<div>
    <h1>Example Domain</h1>
    <p>This domain is established to be used for illustrative examples in documents. You may use this
    domain in examples without prior coordination or asking for permission.</p>
    <p><a href="http://www.iana.org/domains/example">More information...</a></p>
</div>
</body>
```

