---
title: HTTP Request
date: 2018-10-23 13:40:32
copyright: true
tags: [HTTP,翻译]
categories: 
- [翻译]
- [FE,HTTP]
---



翻译原文：[Request](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html)

## Request

A request message from a client to a server includes, within the first line of that message, the method to be applied to the resource, the identifier of the resource, and the protocol version in use.

> 一个从客户端发送到服务器的请求消息的行首（请求的第一行）中包括了，操作资源的method方法（GET/POST/PUT等），资源标识符（即URI），以及使用的协议版本（HTTP/1.1,HTTP/1.2等）。

完整的请求消息结构如下，包含了4个部分：行首，请求头，换行，消息体

``` ht
        Request       = Request-Line              ; 行首（1）
                        *(( general-header        ; 通用头部（2）
                         | request-header         ; 请求头部（2）
                         | entity-header ) CRLF)  ; 实体头部（2）
                        CRLF			  ; 请求头与消息体之间有换行（3）
                        [ message-body ]          ; 消息体（4）
```

<!--more-->

### 5.1 Request-Line

The Request-Line begins with a method token, followed by the Request-URI and the protocol version, and ending with CRLF. The elements are separated by SP characters. No CR or LF is allowed except in the final CRLF sequence.

> 请求的首行以方法名称（Method）开头，接着是请求地址（Request-URI），协议版本，以CRLF结尾。这些元素以空格分隔，末尾只能是CRLF，不可能是CR 或者 LF。

```
        Request-Line   = Method SP Request-URI SP HTTP-Version CRLF
```

### 5.1.1 Method

The Method token indicates the method to be performed on the resource identified by the Request-URI. The method is case-sensitive.

> 方法名称（Method）指定了当前请求对请求地址（Request-URI）所指向的服务器资源将要执行的操作方法。

```
       Method         = "OPTIONS"                ; Section 9.2
                      | "GET"                    ; Section 9.3
                      | "HEAD"                   ; Section 9.4
                      | "POST"                   ; Section 9.5
                      | "PUT"                    ; Section 9.6
                      | "DELETE"                 ; Section 9.7
                      | "TRACE"                  ; Section 9.8
                      | "CONNECT"                ; Section 9.9
                      | extension-method
       extension-method = token
```

The list of methods allowed by a resource can be specified in an Allow header field (section 14.7). The return code of the response always notifies the client whether a method is currently allowed on a resource, since the set of allowed methods can change dynamically. An origin server SHOULD return the status code 405 (Method Not Allowed) if the method is known by the origin server but not allowed for the requested resource, and 501 (Not Implemented) if the method is unrecognized or not implemented by the origin server. The methods GET and HEAD MUST be supported by all general-purpose servers. All other methods are OPTIONAL; however, if the above methods are implemented, they MUST be implemented with the same semantics as those specified in section 9.

> 可以在 `Allow` 头部字段中指定资源允许的方法列表。因为允许操作的方法集合可以动态修改，所以响应的返回码始终会通知客户端是否允许在资源上使用当前方法。如果服务器理解当前方法但是不允许在请求的资源上执行则源服务器应该返回状态码 `405` （方法不被允许）。如果方法未源服务器识别或者不支持则返回  `501` （不支持）。所有的服务器都 `必须` 支持 GET 和 POST 方法。所有其他方法都是可选的；但是，如果服务器要实现上面的方法，则必须用 [section 9](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9) 中指定的语义相同的语义实现它们。 

###  5.1.2 Request-URI

The Request-URI is a Uniform Resource Identifier (section [3.2](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2)) and identifies the resource upon which to apply the request.

> Request-URI 本质上就是一个 URI（Uniform Resource Identifier，section [3.2](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2)），用来标识请求所指向的资源。

```
       Request-URI    = "*" | absoluteURI | abs_path | authority
```

The four options for Request-URI are dependent on the nature of the request. The asterisk "*" means that the request does not apply to a particular resource, but to the server itself, and is only allowed when the method used does not necessarily apply to a resource. One example would be

> Request-URI 的四个选项取决于请求的性质。星号 `”*“`  表示请求不适用于特定资源，而是适用于服务器本身，并且仅在使用的方法不一定适用于资源的时候才允许。下面是一个例子：

```
       OPTIONS * HTTP/1.1
```

The absoluteURI form is REQUIRED when the request is being made to a proxy. The proxy is requested to forward the request or service it from a valid cache, and return the response. Note that the proxy MAY forward the request on to another proxy or directly to the server specified by the absoluteURI. In order to avoid request loops, a proxy MUST be able to recognize all of its server names, including any aliases, local variations, and the numeric IP address. An example Request-Line would be:

> 在向代理发出请求的时候，必须使用`absoluteURI（绝对URI）` 。代理会转发请求或者提供有效的缓存，然后返回响应。要知道代理可能转发请求给另一个代理或者直接转发给服务器，由 `absoluteURI` 指定。为了避免请求循环，代理 `必须` 能够识别所有的服务器名称，包括任何别名，本地变体，以及 IP 地址。一个 `Request-URI` 的示例如下：

```
       GET http://www.w3.org/pub/WWW/TheProject.html HTTP/1.1
```

To allow for transition to absoluteURIs in all requests in future versions of HTTP, all HTTP/1.1 servers MUST accept the absoluteURI form in requests, even though HTTP/1.1 clients will only generate them in requests to proxies.

> 为了在未来的版本的 HTTP 中允许将所有请求转换为 `absoluteURI` ，所有 HTTP/1.1 服务器必须在请求中接受 `absoluteURI` ，尽管 HTTP/1.1 客户端只能在向代理发出请求时生成这些 `absoluteURI`。

The authority form is only used by the CONNECT method (section [9.9](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.9)).

> 权限（authority）仅由 `CONNECT` 方法使用  (section [9.9](https://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.9))。	

The most common form of Request-URI is that used to identify a resource on an origin server or gateway. In this case the absolute path of the URI MUST be transmitted (see section [3.2.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.1), abs_path) as the Request-URI, and the network location of the URI (authority) MUST be transmitted in a Host header field. For example, a client wishing to retrieve the resource above directly from the origin server would create a TCP connection to port 80 of the host "www.w3.org" and send the lines:

> 最常用的 `Request-URI` 格式是用于标识源服务器或者网关上的一个资源。这种情况下，URI的绝对路径必须作为 `Request-URI` 传送 (参见第 [3.2.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.1)节,  abs_path)，并且 URI（权限）的网络位置必须在 `Host` 头部字段中传输。例如，一个想要直接从源服务器上检索上述资源的客户端将会创建一个到主机 “www.w3.org” 的端口 80 的 TCP 连接，并发送以下行：

```
       GET /pub/WWW/TheProject.html HTTP/1.1
       Host: www.w3.org
```

followed by the remainder of the Request. Note that the absolute path cannot be empty; if none is present in the original URI, it MUST be given as "/" (the server root).

> 然后是请求的其余部分。要注意绝对路径不能为空；如果源 URI 中不存在，则必须以 “/”（服务器根目录）给出。

The Request-URI is transmitted in the format specified in section 3.2.1. If the Request-URI is encoded using the "% HEX HEX" encoding [[42\]](https://www.w3.org/Protocols/rfc2616/rfc2616-sec17.html#bib42), the origin server MUST decode the Request-URI in order to properly interpret the request. Servers SHOULD respond to invalid Request-URIs with an appropriate status code.

> Request-URI 以第 [3.2.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.2.1) 节中声明的格式传输。如果 Request-URI 使用 “% HEX HEX"编码 [[42\]](https://www.w3.org/Protocols/rfc2616/rfc2616-sec17.html#bib42) 进行编码，则源服务器必须解码 Request-URI 以正确解释请求。对于无效 Request-URI 服务器应该返回合适的状态码。

A transparent proxy MUST NOT rewrite the "abs_path" part of the received Request-URI when forwarding it to the next inbound server, except as noted above to replace a null abs_path with "/".

> 透明代理在将请求转发到下一个入站服务器时不得重写接受到的 Request-URI 的 “abs_path" 部分，除了上面提到的用 ”/“ 替换 null abs_path。

```
      Note: The "no rewrite" rule prevents the proxy from changing the
      meaning of the request when the origin server is improperly using
      a non-reserved URI character for a reserved purpose.  Implementors
      should be aware that some pre-HTTP/1.1 proxies have been known to
      rewrite the Request-URI.
```

### 5.2 The Resource Identified by a Request

The exact resource identified by an Internet request is determined by examining both the Request-URI and the Host header field.

> 通过检查 Request-URI 和 Host 头部字段来确定网络请求指定的确切资源。

An origin server that does not allow resources to differ by the requested host MAY ignore the Host header field value when determining the resource identified by an HTTP/1.1 request. (But see section [19.6.1.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.6.1.1) for other requirements on Host support in HTTP/1.1.)

> 在确定由 HTTP/1.1 请求标识的资源时，不允许资源因服务器而不同的源服务器可能会忽略 `Host` 头部字段值。（但有关HTTP / 1.1中主机支持的其他要求，请参阅第 [19.6.1.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.6.1.1) 节。） 

An origin server that does differentiate resources based on the host requested (sometimes referred to as virtual hosts or vanity host names) MUST use the following rules for determining the requested resource on an HTTP/1.1 request:

> 根据请求的主机（有时也叫作 虚拟主机 或者 虚荣主机名）区分资源的源服务器必须用下面的规则来确定 HTTP/1.1 请求上请求的资源：

\1. If Request-URI is an absoluteURI, the host is part of the Request-URI. Any Host header field value in the request MUST be ignored.

> 如果 Request-URI 是一个absoluteURI，主机是 Request-URI 的一部分。必须忽略请求中任何 Host 头部字段的值。

\2. If the Request-URI is not an absoluteURI, and the request includes a Host header field, the host is determined by the Host header field value.

> 如果 Request-URI 不是 absoluteURI，请求中包含一个 Host 请求头字段，主机有 Host 头部字段的值决定。

\3. If the host as determined by rule 1 or 2 is not a valid host on the server, the response MUST be a 400 (Bad Request) error message.

> 如果根据规则 1 或者 2 确定的主机不是服务器上的有效主机，响应必须是 400 （Bad Request）错误消息。

Recipients of an HTTP/1.0 request that lacks a Host header field MAY attempt to use heuristics (e.g., examination of the URI path for something unique to a particular host) in order to determine what exact resource is being requested.

> 缺少 Host 头字段的 HTTP/1.0 请求的接收者可以尝试启发算法（例如，检查 URI 路径以寻找特定主机特有的东西），以确定正在请求的资源。

### 5.3 Request Header Fields

The request-header fields allow the client to pass additional information about the request, and about the client itself, to the server. These fields act as request modifiers, with semantics equivalent to the parameters on a programming language method invocation.

> 请求头字段允许客户端将有关请求以及客户端本身的其他信息传递给服务器。这些字段充当请求修饰符，其语义等同于编程语言调用方法的参数。

```
       request-header = Accept                   ; Section 14.1
                      | Accept-Charset           ; Section 14.2
                      | Accept-Encoding          ; Section 14.3
                      | Accept-Language          ; Section 14.4
                      | Authorization            ; Section 14.8
                      | Expect                   ; Section 14.20
                      | From                     ; Section 14.22
                      | Host                     ; Section 14.23
                      | If-Match                 ; Section 14.24
                      | If-Modified-Since        ; Section 14.25
                      | If-None-Match            ; Section 14.26
                      | If-Range                 ; Section 14.27
                      | If-Unmodified-Since      ; Section 14.28
                      | Max-Forwards             ; Section 14.31
                      | Proxy-Authorization      ; Section 14.34
                      | Range                    ; Section 14.35
                      | Referer                  ; Section 14.36
                      | TE                       ; Section 14.39
                      | User-Agent               ; Section 14.43
```

Request-header field names can be extended reliably only in combination with a change in the protocol version. However, new or experimental header fields MAY be given the semantics of request- header fields if all parties in the communication recognize them to be request-header fields. Unrecognized header fields are treated as entity-header fields.

> 请求头字段的名称只能与协议版本的更改一起可靠地扩展。但是如果通信中的各方都能识别新增或者实验性的请求头字段，则可以为它们赋予请求头字段的语义。无法识别的头部字段被视为实体请求头字段。