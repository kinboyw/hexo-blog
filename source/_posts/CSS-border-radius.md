---
title: CSS border-radius
type: categories
copyright: true
date: 2018-10-31 22:33:13
tags: [FE,CSS]
categories: 
- [FE,blog]
---



​	今天遇到了一个 ***border-radius:50% 和 100% 有什么不同*** 的问题，查资料时在 YouTube找到了这个视频，关于 `border-radius` 的运用，里面有很多精彩的内容，我将字幕翻译成了中文。视频中的演讲者 [@LeaVerou](https://twitter.com/LeaVerou) 曾经在 W3C 工作，这是她在2014年做过的一个演讲，那时应该正在 W3C 就职。

{% raw %}

<div style="max-width:1080px;">
<video style="width:60%;margin:0 auto;display:inherit" controls muted
src="http://cdn.kinboy.wang/video_sub.mp4"
crossorigin="anonymous">
<track label="English" kind="subtitles" srclang="en" src="https://kinboyw.github.io/fedemo/resume/video/video.vtt" crossorigin="anonymous" default>
</video>
</div>




{% endraw %}



<!--more-->

## YouTube 视频和字幕下载

- 视频和字幕下载使用 **Chrome 浏览器** + **Tampermonkey** 扩展 + **[YouTube Download](https://greasyfork.org/en/scripts/38673-youtube-download-mp4-3gp-mp3-avi-1080-720-480-360)** + **[Youtube Subtitle Downloader v20](https://greasyfork.org/en/scripts/5368-youtube-subtitle-downloader-v20)** 脚本
- 字幕默认下载为 `srt` 格式，要在 HTML5 的 `Video`标签内使用 `track` 标签嵌入字幕，需要将 `srt` 转换为 `vtt` 格式，使用 [在线转换工具](https://atelier.u-sub.net/srt2vtt/) 
- 翻译字幕，因为非专业也不是经常干这个，就用 notepad++ 打开后逐行翻译，保存。

## 上传视频字幕到CDN

视频这类比较大的静态资源文件如果直接上传到站点服务器上，一方面可能会加载比较慢，另一方面也会增加反向代理服务器的流量开销，所以利用了 七牛云 每天10G流量的免费 CDN，将视频和字幕都上传后拷贝外链

## Markdown 嵌入视频

Markdown中嵌入复杂元素有多种方案，可以借助一些专门支持 video 的 Hexo 插件，我没有装这种插件，而是选择用 {% asset_img 1541004445801.png %} 将 HTML 直接注入到 Markdown 文档中，这样 Hexo 在将 md 文档渲染成 html 时会将注入的 HTML 代码原样输出，从而达到 HTML 代码注入的目的，代码如下

```html
{% raw %}

<div style="width:1080px;margin:0 auto;">
<video controls muted
src="//phbiw9gl9.bkt.clouddn.com/video_sub.mp4"
width="600"
height="400">
<track label="English" kind="subtitles" srclang="en" src="//phbiw9gl9.bkt.clouddn.com/video.vtt" default>
</video>
</div>

{% endraw %}

```

这里有个地方需要注意，一开始 `vtt` 字幕文件会加载失败，浏览器控制台输出 `blocked:origin` 错误，猜测大概是同源策略导致的，可以在 `Video` 标签的属性中增加 一项`crossorigin="anonymous"`， 这样就允许字幕文件不同源

允许跨域后发现字幕加载又失败了，出错为 `blocked:mixed-content` ，这个错误是因为我在 HTTPS 的网站中加载了不安全的 HTTP 资源，浏览器是不允许这种操作的，我的七牛云域名用的测试域名，正式域名还在备案，只能用 HTTP ，于是我只能将 `.vtt` 字幕文件上传到我的 `Github pages` 博客中，最终的配置就变成了 

```html
{% raw %}

<div style="width:1080px;">
<video style="margin:0 auto;display:inherit" controls muted
src="http://phbiw9gl9.bkt.clouddn.com/video_sub.mp4"
crossorigin="anonymous"
width="600"
height="400">
<track label="English" kind="subtitles" srclang="en" src="https://kinboyw.github.io/fedemo/resume/video/video.vtt" crossorigin="anonymous" default>
</video>
</div>
{% endraw %}
```



:sushi: 夜深了，饿