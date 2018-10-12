---
title: 单页面应用与服务器
date: 2018-09-28 20:25:04
tags: 
- 架构
- 单页面应用程序
---



原文：[Single-Page Applications and the Server](https://medium.com/@pshrmn/single-page-applications-and-the-server-32a23d67936)

## SPAs minimize server requests, but they aren’t server-less

Single-page applications (SPAs) are distinguished from regular applications because they do not need to make server requests when the user navigates. However, the application still needs a server to provide the initial files for the application to render. [Demystifying Single-Page Applications](https://medium.com/@pshrmn/demystifying-single-page-applications-3068d0555d46) covers the client-side aspect of how this works and here we will cover how different types of servers can support single-page applications.

<!--more-->

### Server Types

Websites are backed by two types of servers: web and application. NGINX, a web server, [provides a good explanation of the two](https://www.nginx.com/resources/glossary/application-server-vs-web-server/). The most general way to differentiate the two is to say that a web server serves static content (i.e. files that already exist on the server) while an application server can generate new content.

With single-page applications, there are three main scenarios for serving the application’s content:

1. Purely static
2. Configurable static
3. Dynamic

#### Purely Static

A purely static web server can only successfully respond to requests if a resource at the requested location exists. This will typically be the case when you are using a static host, such as GitHub Pages or Amazon S3.

With a purely static server, a request for `/horses.html` only succeeds (returns a response with status `200`) if the server’s root directory contains a `horses.html` file. If the resource does not exist, the server will return a `404` response.

#### Configurable Static

A web server can be configured to respond with an alternative file if the requested resource doesn’t actually exist on the disk. If a request for `/bears` comes in and the server has no `bears` file, the configuration can tell it to respond with an `index.html` file instead.

#### Dynamic

An application server will have a web framework running on top of it. For example, a [Node](https://nodejs.org/en/) application server might be running [Express](https://expressjs.com/) and a [Unicorn](https://bogomips.org/unicorn/) application server may be used to run [Ruby on Rails](http://rubyonrails.org/).

The framework is able to match requests and dynamically generate responses. Like a configurable static setup, requests don’t have to map directly to files on the server, but a dynamic setup gives you even more leeway.

An application server is most likely run as a proxy of a web server, but the web server would typically just pass non-static requests to the application server.

Generally speaking, a dynamic/configurable static server is preferable for running a single-page application. If you are using a static file host, you can still run a single-page application, but there are some limitations that you will need to know.

### Serving Single-Page Applications From Static File Hosts

If you are running a single-page application through a static file host, you have two options.

The first, and more practical, is to have a single HTML file. With this system, the URL’s `hash` will be used to store location data.

This would be the home page:

```
https://example.com/#/
```

and this is the contact page:

```
https://example.com/#/contact
```

Because the location is stored in the URL’s `hash`, and the server only uses the location’s `pathname` to map resources, all requests to the server for pages in the application will be for the root `index.html` file.

Most single-page application routers should provide you with a way to encode locations in the hash. With the [Curi router](https://curi.js.org/), this is done using the [Hickory hash history](https://github.com/pshrmn/hickory/blob/master/docs/api/Hash.md).

```
import Hash from "@hickory/hash";
// ...
const history = Hash();
const router = curi(history, routes);
// current URL: "example.com/#/"
history.push("/contact");
// push() changes the URL to "example.com/#/contact"
```

The popular `history` package also has a `hash` option.

```
import { createHashHistory } from "history";
const history = createHashHistory();
```

A visual drawback of using hash URLs is that they are a bit ugly. However, they are your best bet and I would recommend just dealing with it.

If you *really* want “pretty” URLs, you could generate an HTML file for **every single possible URL in your application**. That would allow your server to be able to respond with an HTML file for every (valid) request. This is technically feasible for applications with a small number of routes, and some static site generators will do this for you. However, this breaks down for sites that generate URLs for dynamic content, like profile pages for users.

### Serving Single-Page Applications from Configurable Static Servers

If you can configure your web server, creating a single-page application with “pretty” URLs is much easier.

The basic gist of how to configure a web server for single-page applications is that you have a single HTML file that your application serves for almost every request.

```
<!-- index.html -->
<!doctype html>
<html>
  <head>...</head>
  <body>
    <div id="root"></div>
    <script src="/static/js/index.js"></script>
  </body>
</html>
```

Request for`/camels`? Respond with `index.html`. Request for `/badgers`? Respond with `index.html`. Request for `/static/js/index.js`? That is where the “almost” comes in. The server needs to distinguish between requests for HTML content for requests for other files so that it can serve the correct files, and not the `index.html` file, for those requests.

With the Apache web server, you can use `mod_rewrite` to try to respond with the requested file, but fall back to responding with a default HTML file when the resource does not exist.

```
RewriteEngine On
# set the base URL prefix
RewriteBase /
# for requests for index.html, just respond with the file
RewriteRule ^index\.html$ - [L]
# if requested path is not a valid filename, continue rewrite
RewriteCond %{REQUEST_FILENAME} !-f
# if requested path is not a valid directory, continue rewrite
RewriteCond %{REQUEST_FILENAME} !-d
# if you have continue to here, respond with index.html
RewriteRule . /index.html [L]
```

With Nginx, you can use `try_files` to serve the HTML file. This will attempt to serve the file at the provided `$uri`, but if that does not exist, it will fall back to the `index.html` file.

```
server {
  ...
  location / {
    try_files $uri /index.html;
  }
}
```

**Note:** These configurations are gleaned from an [old React Router documentation](https://github.com/ReactTraining/react-router/blob/afa0560326eebc4ac426bb206ffd2b07f5448964/docs/guides/Histories.md#configuring-your-server). If you have issues getting these Apache/NGINX setups to work, I would recommend either checking their respective documentation or StackOverflow.

### Dynamically Serving Single-Page Applications with Application Servers

The setup for application servers is similar to configurable static servers. In some cases, they may even overlap by having Apache/NGINX/etc. serve static files and pass other requests to a proxy, the application server.

There are so many different application servers out there, that it is impractical to cover the setup for each of them here, but the gist is always the same: process the request, determine how to respond, and respond with some HTML. The example code below will use the Express framework.

An application server needs to identify static resource requests and respond with the correct file. If you configure your web server to handle these, then you can skip this on the application server. Additionally, a dynamic server needs to identify API requests so that they can be handled properly.

Some single-page applications will also employ server-side rendering. Instead of using a common HTML file, server-side rendering will respond with the fully structured HTML for the requested page. Some people swear by this, while others consider it unnecessary. At the very least, there are some caveats to it, but we will come back to this in a little bit.

Your framework should provide a way to identify static resource requests. This basically entails specifying a static file directory so that any request whose `pathname` begins with the static directory will just serve the requested file (or fail with a `404` response if the requested file does not exist).

To do this with Express, you would use its `static()`[ method](https://expressjs.com/en/starter/static-files.html) and your Express app’s `use()` method. `static()` receives the local directory where the static files exist. You can either pass this as the only argument to `use()`, in which case it will respond to requests for the same local directory, or you can pass it a first argument path if static file requests don’t refer to the literal location.

```
const express = require("express");
const app = new express();
// requests for /public/js/index.js will return public/js/index.js
app.use(express.static("public"));
// requests for /static/js/index.js will return public/js/index.js
app.use("/static", express.static("public"));
app.listen("8000");
```

Frameworks also need to know how to map requests to to how they should respond, similar to how routes work in a single-page application. When the framework gets a request, it will iterate over these handlers and use the first one that matches the request to respond.

In order for the framework to respond to any possible location, we need to give it a catch-all route handler that responds with the common HTML file.

```
const path = require("path");
app.use("*", function(req, resp) {
  resp.sendFile("/public/index.html");
});
```

The order of operations is important here. A catch-all route will match every location, so anything that shouldn’t be matched by it (i.e. static file and API requests) needs to be defined prior to the wildcard route.

```
// 1. match static files
app.use("/static", express.static("public"));
// 2. match API requests
app.use("/graphql", ...);
// 3. finally, match everything else
app.use("*", function(req, resp) {
  resp.sendFile("/public/index.html");
});
```

#### Server-Side Rendering

The technique outlines above sends a minimal HTML file, which will be “filled in” on the client-side to render the application. Server-side rendering (SSR) allows you to render each route’s HTML content on the server. The response will then be an HTML file that is already “filled in”.

Server-side rendering also only really makes sense to attempt if you are running a Node server because you can re-use client-side code on the server. Technically speaking, if you aren’t using Node, you could create the same UI for whatever framework your server uses, but that would require you to duplicate your render logic.

The advantages of using SSR is that your application will have a faster initial render for users and that it is easier for search engines to crawl your content. Whether an application really benefits has a variety of factors. For example, if you are using server-side rendering for search engine optimization, only public pages need to be server-side rendered. A private page page (one that is only visible to authorized users) would not benefit from server-side rendering since no search engines should attempt to index it.

Instead of returning an HTML file from the disk, server-side rendering will generate an HTML string when a request comes in. There are two parts to this HTML string: the base HTML and the route specific HTML.

The base HTML is a template that will be used for all requests. This should include any `<script>` tags that will be necessary for running the application on the client. The route specific HTML will be inserted into the template. Most of this should be inserted into a container element in the `<body>` of the template, but you may also want to insert elements into the `<head>`, such as a `<title>`.

The technique for rendering on the server will depend entirely on how you are rendering on the client. If you are using React, the `react-dom` package provides server methods for generating an HTML string.

**Note:** If you do server-side rendering using React, on the client you will want to use `ReactDOM.hydrate()` instead of `ReactDOM.render()`.

```
function responseHTML(content) {
  return `<!doctype html>
    <html>
      <head></head>
      <body>
        <div id="root">${content}</div>
        <script src="/static/js/bundle.js"></script>
      </body>
    </html>`;
}
```

**Important!** Any static resource references in the template should be absolute. If you use a relative path (`static/js/bundle.js`) in the template, then requests for nested URLs (`/parent/child`) would attempt to load non-existent resource URLs (`/parent/static/js/bundle.js`).

When the application just sends the same HTML file for every request, it doesn’t matter what the requested path is, but with server-side rendering it is important to render based on the request URL.

**Note:** With Express, the request object can be referenced to get the requested path. `req.path`, which is just the requested URL’s `pathname`, *can* be used to determine the route that matches. However, if the app renders content using the `search`/`hash`, `req.url` should be used.

To demo the actual rendering, we will use React and the [Curi router](https://curi.js.org/), which makes server-side rendering very easy.

```
import React from "react";
import renderToString from "react-dom/server";
import curi from "@curi/core";
import InMemory from "@hickory/in-memory";
import { CuriProvider } from "@curi/react";
import routes from "../client/routes";
app.use("*", function(req, resp) {
  // 1. Use the request's URL to create the router.
  // Curi will use the provided location to generate a response
  // object
  const history = InMemory({ locations: [req.url] });
  const router = curi(history, routes);
  // 2. Render the application using React.
  // The exact implementation here will vary, but Curi uses
  // a render-invoked prop to render a "body" component
  // from the response object provided by the router.
  const content = renderToString(
    <CuriProvider>
      {({ response }) => <response.body response={response} />}
    </CuriProvider>
  );
  // 3. Insert the content into the template.
  // We want to return the entire page's HTML, not just
  // the content rendered by React
  const html = responseHTML(content);
  
  // 4. Send the response HTML.
  resp.send(html);
});
```

That is the general gist of server-side rendering. Actual implementations vary by framework and router, but the idea is always the same.

### Recap

If you are using a static file host, you will either need to use hash routing and a shared HTML file or generate an HTML file for every possible route in your application.

Web servers can be made more amenable to single-page applications if you can configure them. This allows you to respond with an HTML file for requests that don’t have a matching resource on the server.

Application servers make serving single-page applications easy by using catch-all routes to respond to requests for any location. It is important that these match any other possible URLs, such as static resource and API requests, first so that the catch-all doesn’t catch those. If your application server is running Node, you can take advantage of server-side rendering to pre-generate the page’s HTML content, but this isn’t always necessary.



- [React](https://medium.com/tag/react?source=post)