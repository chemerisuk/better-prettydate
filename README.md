better-prettydate [![Build Status](https://api.travis-ci.org/chemerisuk/better-prettydate.png?branch=master)](http://travis-ci.org/chemerisuk/better-prettydate)
======================
> Enhances time element to update text in realtime

Demo: http://chemerisuk.github.io/better-prettydate/

Installing
----------
Use [bower](http://bower.io/) to download this extension with all required dependencies.

    bower install better-prettydate

This will clone the latest version of the __better-prettydate__ into the `bower_components` directory at the root of your project.

Then append the following html elements on your page:

```html
<html>
<head>
    ...
    <!--[if IE]><script src="bower_components/html5shiv/dist/html5shiv.js"></script><![endif]-->
</head>
<body>
    ...
    <script src="bower_components/better-dom/better-dom.js" data-htc="bower_components/better-dom/better-dom.htc"></script>
    <script src="bower_components/better-prettydate/better-prettydate.js"></script>
    <script src="bower_components/better-prettydate/i18n/better-prettydate.en.js"></script>
</body>
</html>
```