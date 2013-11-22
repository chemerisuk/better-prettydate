/**
 * @file src/better-prettydate.js
 * @version 1.2.0-rc.1 2013-11-23T00:21:37
 * @overview Enhances time element to update text in realtime
 * @copyright Maksim Chemerisuk 2013
 * @license MIT
 * @see https://github.com/chemerisuk/better-prettydate
 */
(function(DOM, undefined) {
    "use strict";

    // Inspired by jquery-prettydate:
    // http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/

    DOM.extend(".prettydate", {
        constructor: function() {
            var ts = Date.parse(this.get());

            if (!ts) throw "Can't parse date string";

            this.data("ts", ts).refreshPrettyDate();
        },
        refreshPrettyDate: function() {
            var diff = (+new Date() - this.data("ts")) / 1000,
                dayDiff = Math.floor(diff / 86400),
                value = 1,
                i18nKey;

            if (dayDiff <= 0) {
                if (diff < 60) i18nKey = "just now";
                else if (diff < 120) i18nKey = "a minute ago";
                else if (diff < 3600) { i18nKey = "${prettydate} minutes ago"; value = Math.floor(diff / 60); }
                else if (diff < 7200) { i18nKey = "an hour ago"; }
                else { i18nKey = "${prettydate} hours ago"; value = Math.floor(diff / 3600); }
            } else if (dayDiff === 1) { i18nKey = "yesterday"; }
            else if (dayDiff < 7) { i18nKey = "${prettydate} days ago"; value = dayDiff; }
            else if (dayDiff < 8) { i18nKey = "a week ago"; }
            else if (dayDiff < 14) { i18nKey = "${prettydate} days ago"; value = dayDiff; }
            else if (dayDiff < 30) { i18nKey = "${prettydate} weeks ago"; value = Math.ceil(dayDiff / 7); }
            else if (dayDiff < 32) { i18nKey = "a month ago"; }
            else if (dayDiff < 363) { i18nKey = "${prettydate} months ago"; value = Math.ceil(dayDiff / 31); }
            else if (dayDiff > 380) { i18nKey = "${prettydate} years ago"; value = Math.ceil(dayDiff / 365); }
            else { i18nKey = "an year ago"; }

            this.i18n(i18nKey, {prettydate: value});
            // schedule next update if the delta is less than 1 day ago
            if (dayDiff === 0) {
                this.each(function(el) {
                    setTimeout(function() { el.refreshPrettyDate() }, (diff < 3600 ? 60 : 3600) * 1000);
                });
            }
        }
    });
}(window.DOM));
