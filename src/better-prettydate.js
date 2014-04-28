(function(DOM, undefined) {
    "use strict";

    // Inspired by jquery-prettydate:
    // http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/

    DOM.extend(".prettydate", {
        constructor: function() {
            var value = this.get("datetime") || this.get(),
                refresher = this.doRefreshText.bind(this, this.doRefreshText),
                ts = Date.parse(value);

            if (!ts) throw "Can't parse a date string '" + value + "'";

            this
                .set("_ts", ts)
                .doRefreshText(refresher);
        },
        doRefreshText: function(refresher) {
            var diff = (Date.now() - this.get("_ts")) / 1000,
                dayDiff = Math.floor(diff / 86400),
                value = 1,
                i18nKey;

            if (dayDiff <= 0) {
                if (diff < 60) i18nKey = "just now";
                else if (diff < 120) i18nKey = "a minute ago";
                else if (diff < 3600) { i18nKey = "{0} minutes ago"; value = Math.floor(diff / 60); }
                else if (diff < 7200) { i18nKey = "an hour ago"; }
                else { i18nKey = "{0} hours ago"; value = Math.floor(diff / 3600); }
            } else if (dayDiff === 1) { i18nKey = "yesterday"; }
            else if (dayDiff < 7) { i18nKey = "{0} days ago"; value = dayDiff; }
            else if (dayDiff < 8) { i18nKey = "a week ago"; }
            else if (dayDiff < 14) { i18nKey = "{0} days ago"; value = dayDiff; }
            else if (dayDiff < 30) { i18nKey = "{0} weeks ago"; value = Math.ceil(dayDiff / 7); }
            else if (dayDiff < 32) { i18nKey = "a month ago"; }
            else if (dayDiff < 362) { i18nKey = "{0} months ago"; value = Math.ceil(dayDiff / 31); }
            else if (dayDiff > 380) { i18nKey = "{0} years ago"; value = Math.ceil(dayDiff / 365); }
            else { i18nKey = "an year ago"; }

            this.i18n(i18nKey, [value]);
            // schedule next update if the delta is less than 1 day ago
            if (!dayDiff) setTimeout(refresher, (diff < 3600 ? 60 : 3600) * 1000);
        }
    });
}(window.DOM));
