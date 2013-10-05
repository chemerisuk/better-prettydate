(function(DOM, undefined) {
    "use strict";

    // Inspired by jquery-prettydate:
    // http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/

    DOM.extend("time.prettydate", {
        constructor: function() {
            this._refreshDate();
        },
        getDate: (function() {
            // https://github.com/csnover/js-iso8601/blob/master/iso8601.js
            var rES5ts = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/,
                // Indexes in a rES5ts match list that are required for Date.UTC,
                // Use in a loop to replace undefined with 0 (otherwise Date.UTC would give NaN)
                dateUrcReqIndx = [1, 4, 5, 6, 7, 10, 11];

            return function() {
                var i, k, minutesOffset = 0,
                    m = rES5ts.exec(this.get("datetime"));

                if (!m) throw "Invalid ISO String";

                for (i = 0; (k = dateUrcReqIndx[i]); ++i) {
                    m[k] = +m[k] || 0;
                }
                // Undefined days and months are allowed
                m[2] = +m[2] || 1;
                m[3] = +m[3] || 1;

                if (m[8] !== "Z" && m[9] !== undefined) {
                    minutesOffset = m[10] * 60 + m[11];

                    if (m[9] === "+") minutesOffset *= -1;
                }

                return Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5] + minutesOffset, m[6], m[7]);
            };
        }()),
        setDate: (function() {
            var pad = function(value) { return ("00" + value).slice(-2) };

            return function(value) {
                var result = value.getUTCFullYear() +
                    "-" + pad( value.getUTCMonth() + 1 ) +
                    "-" + pad( value.getUTCDate() ) +
                    "T" + pad( value.getUTCHours() ) +
                    ":" + pad( value.getUTCMinutes() ) +
                    ":" + pad( value.getUTCSeconds() ) +
                    "." + String( (value.getUTCMilliseconds() / 1000).toFixed(3) ).slice(2, 5) +
                    "Z";

                this.set("datetime", result)._refreshDate();

                return this;
            };
        }()),
        _refreshDate: function() {
            var diff = (new Date() - this.getDate()) / 1000,
                dayDiff = Math.floor(diff / 86400),
                value = 1,
                i18nKey;

            if (dayDiff <= 0) {
                if (diff < 60) i18nKey = "prettydate-now";
                else if (diff < 120) i18nKey = "prettydate-minute";
                else if (diff < 3600) { i18nKey = "prettydate-minutes"; value = Math.floor(diff / 60); }
                else if (diff < 7200) { i18nKey = "prettydate-hour"; }
                else { i18nKey = "prettydate-hours"; value = Math.floor(diff / 3600); }
            } else if (dayDiff === 1) { i18nKey = "prettydate-yesterday"; }
            else if (dayDiff < 7) { i18nKey = "prettydate-days"; value = dayDiff; }
            else if (dayDiff < 8) { i18nKey = "prettydate-week"; }
            else if (dayDiff < 14) { i18nKey = "prettydate-days"; value = dayDiff; }
            else if (dayDiff < 30) { i18nKey = "prettydate-weeks"; value = Math.ceil(dayDiff / 7); }
            else if (dayDiff < 32) { i18nKey = "prettydate-month"; }
            else if (dayDiff < 363) { i18nKey = "prettydate-months"; value = Math.ceil(dayDiff / 31); }
            else if (dayDiff > 380) { i18nKey = "prettydate-years"; value = Math.ceil(dayDiff / 365); }
            else { i18nKey = "prettydate-year"; }
            // protect from internal inserted content + trigger reflow in IE8
            this.set({ "data-i18n": i18nKey, "data-prettydate": value }).set("");
            // schedule next update if it's less than 1 day ago
            if (dayDiff === 0) {
                this.each(function(el) {
                    setTimeout(function() { el._refreshDate() }, (diff < 3600 ? 60 : 3600) * 1000);
                });
            }
        }
    });
}(window.DOM));
