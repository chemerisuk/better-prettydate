# better-prettydate [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url]
> Enhances `.prettydate` element to update text in realtime

Elements like "an hour ago", "X minutes ago" became to be a standard solution for some UI tasks. This project aims to solve adding support for this kind of extension by enhancing `.prettydate` elements in markup.

[VIEW DEMO](http://chemerisuk.github.io/better-prettydate/)

## Installing
Use [bower](http://bower.io/) to download this extension with all required dependencies.

    bower install better-prettydate

This will clone the latest version of the __better-prettydate__ into the `bower_components` directory at the root of your project.

Then append the following html elements on your page:

```html
<html>
<head>
    ...
    <!--[if IE]>
        <link href="bower_components/better-dom/dist/better-dom-legacy.htc" rel="htc"/>
        <script src="bower_components/better-dom/dist/better-dom-legacy.js"></script>
    <![endif]-->
</head>
<body>
    ...
    <script src="bower_components/better-dom/dist/better-dom.js"></script>
    <script src="bower_components/better-prettydate/dist/better-prettydate.js"></script>
</body>
</html>
```
## Browser support
#### Desktop
* Chrome
* Safari 6.0+
* Firefox 16+
* Opera 12.10+
* IE8+

#### Mobile
* iOS Safari 6+
* Android 2.3+
* Chrome for Android

[travis-url]: http://travis-ci.org/chemerisuk/better-prettydate
[travis-image]: https://api.travis-ci.org/chemerisuk/better-prettydate.png?branch=master

[coveralls-url]: https://coveralls.io/r/chemerisuk/better-prettydate
[coveralls-image]: https://coveralls.io/repos/chemerisuk/better-prettydate/badge.png?branch=master
