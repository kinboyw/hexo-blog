---
title: 浏览器缓存策略交互——maxAge 与 maxStale
date: 2018-08-18 19:45:42
tags: [浏览器,缓存策略,缓存]
---



原文：[Cache Policy Interaction—Maximum Age and Maximum Staleness](https://docs.microsoft.com/en-us/dotnet/framework/network-programming/cache-policy-interaction-maximum-age-and-maximum-staleness)

To help ensure that the freshest content is returned to the client application, the interaction of client cache policy and server revalidation requirements always results in the most conservative cache policy. All the examples in this topic illustrate the cache policy for a resource that is cached on January 1 and expires on January 4.

> 为确保客户端应用程序能够被返回最新的内容，客户端缓存策略与服务端验证的交互总是产生最保守的缓存策略。这个话题中的所有示例都是说明一个1月1日被缓存，并在1月4日到期的资源的缓存策略。

<!--more-->

In the following examples, the maximum staleness value (`maxStale`) is used in conjunction with a maximum age (`maxAge`):

> 下面的例子会将最大过期值（maxStale）与最大年龄（maxAge）结合使用：

- If the cache policy sets `maxAge` = 5 days and does not specify a `maxStale` value, according to the `maxAge`value, the content is usable until January 6. However, according to the server's revalidation requirements, the content expires on January 4. Because the content expiration date is more conservative (sooner), it takes precedence over the `maxAge` policy. Therefore, the content expires on January 4 and must be revalidated even though its maximum age has not been reached.

  > 如果缓存策略设置`maxAge` = 5 天并且没有指定一个`maxStale` 值，根据`maxAge` 值，该内容在1月6日之前可用。然而根据服务端验证要求，该内容在1月4日过期。因为内容过期日期更为保守（更快），它将优先于`maxAge`策略。因此，即使没有达到最大年龄，该内容也将在1月4日过期，必须被重新验证。

- If the cache policy sets `maxAge` = 5 days and `maxStale` = 3 days, according to the `maxAge` value, the content is usable until January 6. According to the `maxStale` value, the content is usable until January 7. Therefore, the content gets revalidated on January 6.

  > 如果缓存策略设置了`maxAge` = 5天，`maxStale` = 3天。根据 `maxAge` 值，该内容在1月6日前可用，根据`maxStale` 值，该内容在1月7日前可用。因此，该内容在1月6日重新验证。

- If the cache policy sets `maxAge` = 5 days and `maxStale` = 1 day, according to the `maxAge` value, the content is usable until January 6. According to the `maxStale` value, the content is usable until January 5. Therefore, the content gets revalidated on January 5.

  > 如果缓存策略设置`maxAge`值为5天，`maxStale`值为1天，根据`maxAge` 值，内容在1月6日前可用。根据`maxStale`值，内容在1月5日前可用，因此，内容在1月5日会被重新验证。

When the maximum age is less than the content expiration date, the more conservative caching behavior always prevails and the maximum staleness value has no effect. The following examples illustrate the effect of setting a maximum staleness (`maxStale`) value when the maximum age (`maxAge`) is reached before the content expires:

> 当最大 年龄小于内容过期日期时，总是存在更保守的缓存行为（即按照最大年龄缓存），并且最大过期值（`maxStale`）将不起作用。下面的例子证明了，当最大年龄（`maxAge`）在内容过期日期之前到来时，设置最大过期值（`maxStale`）的作用。

- If the cache policy sets `maxAge` = 1 day and does not specify a value for `maxStale` value, the content is revalidated on January 2 even though it has not expired.

  > 如果内容缓存策略设置`maxAge`  = 1天并且没有指定`maxStale`值，内容在1月2日重新验证，即使还没过期。

- If the cache policy sets `maxAge` = 1 day and `maxStale` = 3 days, the content is revalidated on January 2 to enforce the more conservative policy setting.

  > 如果缓存策略设置了`maxAge` = 1天，`maxStale` = 3天，内容在1月2日重新验证来强制执行更保守的策略设置。

- If the cache policy sets `maxAge` = 1 day and `maxStale` = 1 day, the content is revalidated on January 2.

  > 如果缓存策略设置`maxAge`=1天，`maxStale` = 1天，内容在1月2日重新验证。