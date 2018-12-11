---
title: SEO中的几个重要的 META tag
type: categories
copyright: true
date: 2018-10-29 02:59:51
tags: [FE,SEO,META tags]
categories: 
- [FE,SEO]
---

<div style="max-width: 400px; margin: auto">{% asset_img w3c.jpg %}</div>

<div style="max-width:400px;margin:auto">{% asset_img tags-lead.png %}</div>

​	**Meta tags** 作为描述网页内容的文本片段，它不会在页面上显示，只会存在与页面代码中。不同网站的 **Meta tags** 或多或少都有点相似，一些内容描述符，告诉搜索引擎网页的内容。**Meta tags** 只会出现在页面 “head” 标签内，只对搜索引擎可见。然而，它是 SEO 的重要手段。

​	我们介绍一下 SEO 中的 8 个重要的 Meta tag：

`Title tag`, `Meta description`, `Canonical Tag`,  `Alternative text (Alt) Tag`, ` Robots meta tag`,  `Social Media Meta Tags (Open Graph and Twitter Cards)`,  `Header tags`,  `Responsive Design Meta Tag` 

<!--more-->

#### TITLE TAG

​	不论对访问者还是搜索引擎来说，`Title tag` 都是第一个出现的对网页作出声明的 HTML 元素。 所有浏览器都支持传这个标签，包括 Chrome, Firefox, Safari 等.

​	始终要在网站页面的 `<head>` 区域添加 Title tag。

```html
<head>
	<title>This is Title Sample</title>
</head>
```

​	**Title tag 优化的长度:** Google 通常显示 55–64 个字符 (保持 60 字符以内).

​	Title tags 对 SEO 和来访者都很重要，它会显示在 SERP （**S**earch **E**ngine **R**esult **P**age）和 浏览器标题栏中。

浏览器标题栏显示如下:

![img](https://cdn-images-1.medium.com/max/1100/0*PIYVqZyhlW8MaRD-.png)

SERP 标题显示如下: 



![img](https://cdn-images-1.medium.com/max/1100/0*xVAO4UzZJn7VZDHz.png)

> Title tags 是 SEO 中仅次于内容的最重要的的页面因素。— Source: [MOZ](https://moz.com/learn/seo/on-page-factors)

> 你不能在你的页面上添加多于一个的 `<title>` 元素。 — Source: [w3schools](https://www.w3schools.com/tags/tag_title.asp)

**好的 Title tags 的几个要点:**

- 在 title tag 中添加`修饰词`  (How to |The current year | Review |Best | Tips | Top |Find | Buy | Easy)
- 在 title tag 中迁入长尾关键词
- 在标题中添加数字 (例如：9 个重要的 HTML 标签帮助你的网站优化 SEO)
- title tag 中按重要性排序，重要关键词前置
- 不要不在乎关键词
- 每个页面使用唯一的 title tag

#### META DESCRIPTION

​	Meta Description 是综述网页的 HTML 元素。搜索引擎通常在搜索结果的标题下方显示 Meta description。

**代码示例**

```html
<head>
<meta name=”description” content=”This is a meta description sample. We can add up to 160 characters.”>
</head>
```

​	Google does not use the Meta description as a ranking signal; still, it has a massive effect on your page CTR because it shows up in search results.

​	Google 不使用 Meta description 作为搜索排名的指标；但是，它对你的网页 CTR（**C**lick**T**hrough **R**ate ）有重要影响，因为它会显示在搜索结果中。

​	在2017年12月, [Google 增加了搜索结果片段的长度](https://searchengineland.com/google-officially-increases-length-snippets-search-results-287596)。现在 Google 确认了在去年12月扩大长度后再次 [缩短了搜索结果片段](https://searchengineland.com/google-confirms-it-shortened-search-results-snippets-after-expanding-them-last-december-298196)。

​	**Meta description 的较优长度是多少?**

> “这些片段没有固定的长度，长度因我们的系统认为认为的最优而不同” 他补充说, “Google 不会给出片段的最大长度，因为这些片段都是动态生成的”
>
> [Source, Danny Sullivan](https://twitter.com/dannysullivan/status/996065145443893249)

​	在桌面端浏览器中描述片段的平均长度大约从原来的 300+ 字符 减少到大约 160 字符。

​	移动端搜索结果现在下降到平均 130 字符。

Goolge 生成的搜索结果描述

![img](https://cdn-images-1.medium.com/max/1100/0*TmgOhwSS17aHHYlV.png)

**优质 Description tag 的几项要点**

- Don’t put emphasis on the number of characters, as Google might pull Meta description text from your content based on a user’s query. 不要过分强调字数，因为 Google 可能会在用户请求下，从你的网页上拉取 Meta 描述信息的文本。
- Do not add duplicate Meta Descriptions
- Add clear Call-to-action (CTA) in your descriptions like Apply today, Check-out, Contact us today etc. See these [CTA keywords for marketing campaigns](https://www.beacontechnologies.com/blog/2009/12/100-call-to-action-keywords-for-ad-campaigns/)
- Add your targeted keywords in descriptions
- Strategically provide solutions to a problem
- Write for your users and encourage them to click with specific and relevant content
- Add any discounts or offers you’ve going on
- Show empathy while writing your Meta Descriptions

**CANONICAL TAG**

The Canonical tag is an HTML link tag with “rel=canonical” attribute that is used if you have a single page URL that has the same content with other multiple page URLs.

By implementing the Canonical tag in the code, we are telling search engines that this URL is the main page and avoid indexing other duplicate page URLs.

A canonical tag Syntax:

<link rel=”canonical” href=”http://example.com/” />

**Where should we choose a canonical URL?**

**Multiple URLs:**

- [http://www.example.com](http://www.example.com/)
- [https://www.example.com](https://www.example.com/)
- [http://example.com](http://example.com/)
- <http://example.com/index.php>

Google sees all the above URLs as duplicate versions of the Homepage. And to fix this problem, the canonical tag (rel=canonical) was invented.

**Session ID URLs:**

These are the automatic system-generated URLs and commonly generated due to the tracking URLs, breadcrumb links and permalinks in CMS

<http://example.com/properties/villa-331-luxury-rental?partnerID=18>

<http://example.com/target.php?session_id=rj3ids98dhpa0mcf3jc89mq1t0>

**Mobile URL:**

When using a special URL (m. example.com) for the mobile version of your website.

SEMrush itself has 2 versions — one is a mobile version and the other is a desktop version. For the mobile and desktop version, SEMrush is using the following canonical tag:

<link rel=”canonical” href=”https://www.semrush.com/” />



![img](https://cdn-images-1.medium.com/max/1100/0*gHjJmtFu1IcyZdVg.png)

#### ALTERNATIVE TEXT (ALT) TAG

The Alt tag is important for any images, as search engines cannot read them, so you need to add proper Alt text to the images so the search engine can consider them.

**Syntax for Alt Text:**

<img src=”http://example.com/xyz.jpg” alt=”xyz” />

**Key points to consider while creating alt-tags for images:**

- All images should have informative filenames
- Alt text needs to be short clear and to the point
- Always use the original, right type of image, as this is an essential step towards success
- Create an image sitemap
- Use 50–55 characters (up to 16 words) in the alt text
- Use an optimal file size without degrading its quality for faster page loading speed

> “Adding an alt tag is very easy to do and you should pretty much do it on all of your images. It helps your accessibility and it can help us understand what’s going on in your image.”

> [Source](https://www.hobo-web.co.uk/how-many-words-in-alt-text-for-google-yahoo-bing/)

#### ROBOTS META TAG

The Robots Meta tag is an HTML tag that provides instructions to web crawlers on whether to index or noindex a web page.

The Robots Meta tag has four main values for search engine crawlers:

- FOLLOW –The search engine crawler will follow all the links in that web page
- INDEX –The search engine crawler will index the whole web page
- NOFOLLOW — The search engine crawler will NOT follow the page and any links in that web page
- NOINDEX — The search engine crawler will NOT index that web page

The Robots Meta tag syntax:

<meta name=”robots” content=”noindex, nofollow”> — Means not to index or not to follow this web page.

<meta name=”robots” content=”index, follow”> — Means index and follow this web page.

**Note:** *The robots Meta tag should be placed in the <head> section of your web page.*

#### SOCIAL MEDIA META TAGS (OPEN GRAPH AND TWITTER CARDS)

**Open Graph Tags:**

Open Graph Meta tags are designed to promote integration between Facebook, LinkedIn, Google and the website URLs that you shared on these platforms.

**Here is a sample of how Open Graph tags look like in standard HTML:**

<meta property=”og:type” content=”article” />

<meta property=”og:title” content=”TITLE OF YOUR POST OR PAGE” />

<meta property=”og:description” content=”DESCRIPTION OF PAGE CONTENT” />

<meta property=”og:image” content=”LINK TO THE IMAGE FILE” />

<meta property=”og:url” content=”PERMALINK” />

<meta property=”og:site_name” content=”SITE NAME” />

**Twitter Cards:**

Twitter cards work in a similar way to Open Graph, except you add these special Meta tags only for Twitter. Twitter will use these tags to enhance the display of your page when shared on their platform.

Here is a sample of how a Twitter card looks like in standard HTML:

<meta name=”twitter:title” content=”TITLE OF POST OR PAGE”>

<meta name=”twitter:description” content=”DESCRIPTION OF PAGE CONTENT”>

<meta name=”twitter:image” content=”LINK TO IMAGE”>

<meta name=”twitter:site” content=”@USERNAME”>

<meta name=”twitter:creator” content=”@USERNAME”>

**How both Social Media Meta Tags look like:**



![img](https://cdn-images-1.medium.com/max/1100/0*42qxwBWqyM5G8NQv.png)

Head over to [this post](https://warfareplugins.com/open-graph-tags-twitter-cards-rich-pins/) if you want to know everything about these tags.

#### HEADER TAGS

A Header tag is used for headings creations, i.e. by using these we can apply font changes.

The heading elements are H1, H2, H3, H4, H5, and H6 with H1 being the highest (or most important) level and H6 the least.

Here is an example of how we can use header tags taken from [SEMrush](https://www.semrush.com/blog/9-tips-for-boosting-the-speed-of-your-shopify-website/):

<h1> 9 Tips for Boosting the Speed of your Shopify Website </h1>

<p>Paragraph of content</p>

<p>another paragraph of content</p>

<h2>Performance Analysis</h2>

<p>Paragraph of content</p>

<h3>Analyzes the Mobile and Desktop Performance with PageSpeed Insights</h3>

> Important Point to consider: Use as Many H1 Tags as You Want

> Source: [Search Engine Roundtable](https://www.seroundtable.com/google-h1-tags-23699.html)

#### RESPONSIVE DESIGN META TAG

The final important Meta tag is the Responsive Design Meta tag, which we call “Viewport Meta Element”. By using the viewport meta tag we can control layout for web pages on mobile browsers.

This viewport element is included in the head section of your web page.

**Syntax:**

<meta name=”viewport” content=”width=device-width,initial-scale=1″>

If you want to learn more about this responsive design Meta tags, head over to [this nicely written post](https://www.w3schools.com/css/css_rwd_viewport.asp).

**Note:** *Do not use this responsive Meta tag if your website pages are not responsive, as it will make the user experience worse.*

### Meta Tags to ignore

Finally, there are a few tags — we can call them bad Meta tags and we should simply ignore them:

**Keywords tag**– Google does not use the keywords Meta tag in web ranking. — [Source](https://webmasters.googleblog.com/2009/09/google-does-not-use-keywords-meta-tag.html)

**Revisit after** — This HTML tag is a command to robots to return to a page after a specific period. This tag is not followed by any major search engine and has no value in SEO. It is better to avoid this tag and leave it to the search engines to decide how to crawl your website. Syntax: <meta name=”revisit-after” content=”7 days” />

**Expiration/date** — This tag defines the expiration date of your page. Personally I would not recommend this, just remove this if you are using it. Syntax: <meta http-equiv=”Expires” content=”Fri, 28 April 2018 23:59:59 GMT”>

**Site verification**– Just ignore this. You can verify your site using Google Search Console and Bing Webmaster tool.

**Copyright**– Every site puts their copyright in the footer, so you don’t need a separate tag. A big NO for this tag.

**Distribution** — The “distribution” value is supposedly used to control who can access the document, typically set to “global”. It’s inherently implied that if the page is open (not password-protected, like on an intranet) that it’s meant for the world. Go with it, and leave the tag off the page. — [Source](https://moz.com/blog/seo-meta-tags)

**Generator** — Useless tag.

**Cache control** –This tag allows web publishers to define how often a page is cached. Generally, these are not required; we can simply use the HTTP header instead of this HTML tag.

**The ODP Robots Meta Tag** — Google no longer follows this Meta tag. –[Source](https://www.seroundtable.com/google-stops-noodp-robots-directive-23942.html)

**Geo Meta Tag** — Google does not use Geo Meta tags to rank pages. — [Source](https://twitter.com/JohnMu/status/895371836170678272)

So these are the few HTML tags which we should consider or simply ignore. Now you can easily use the relevant HTML Meta tags intelligently.

Don’t forget to comment below and share your views on HTML Tags. Thanks for reading!

Originally published at [advancedwebranking.com](https://www.advancedwebranking.com/blog/meta-tags-important-in-seo/)



- [SEO](https://medium.com/tag/seo?source=post)
- [Meta Tags In 2018](https://medium.com/tag/meta-tags-in-2018?source=post)
- [Meta Tags](https://medium.com/tag/meta-tags?source=post)
- [Searchengineoptimization](https://medium.com/tag/searchengineoptimization?source=post)