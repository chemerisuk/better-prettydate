/**
 * @file <%= pkg.name %>.js
 * @version <%= pkg.version %> <%= grunt.template.today("isoDateTime") %>
 * @overview <%= pkg.description %>
 * @copyright <%= pkg.author %> <%= grunt.template.today("yyyy") %>
 * @license <%= pkg.license %>
 * @see <%= pkg.repository.url %>
 */
(function(DOM, undefined) {
    "use strict";

    // Inspired by jquery-prettydate:
    // http://bassistance.de/jquery-plugins/jquery-plugin-prettydate/

    var I18N_NOW = "prettydate-now",
        I18N_MINUTE = "prettydate-minute",
        I18N_MINUTES = "prettydate-minutes",
        I18N_HOUR = "prettydate-hour",
        I18N_HOURS = "prettydate-hours",
        I18N_YESTERDAY = "prettydate-yesterday",
        I18N_DAYS = "prettydate-days",
        I18N_WEEK = "prettydate-week",
        I18N_WEEKS = "prettydate-weeks",
        I18N_MONTH = "prettydate-month",
        I18N_MONTHS = "prettydate-months",
        I18N_YEAR = "prettydate-year",
        I18N_YEARS = "prettydate-years";

    DOM.extend("time[datetime]", {
        constructor: function() {
            this.set("").bind("_refreshDate")._refreshDate();
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
                
                for (i = 0; (k = dateUrcReqIndx[i]); i += 1) {
                    m[k] = +m[k] || 0;
                }
                // Undefined days and months are allowed
                m[2] = +m[2] || 1;
                m[3] = +m[3] || 1;

                if (m[8] !== "Z" && m[9] !== undefined) {
                    minutesOffset = m[10] * 60 + m[11];

                    if (m[9] === "+") minutesOffset = 0 - minutesOffset;
                }

                return Date.UTC(m[1], m[2] - 1, m[3], m[4], m[5] + minutesOffset, m[6], m[7]);
            };
        }()),
        setDate: (function() {
            var pad = function(value) { return ("00" + value).slice(-2); };

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

            if (dayDiff === 0) {
                if (diff < 60) i18nKey = I18N_NOW;
                else if (diff < 120) i18nKey = I18N_MINUTE;
                else if (diff < 3600) { i18nKey = I18N_MINUTES; value = Math.floor(diff / 60); }
                else if (diff < 7200) { i18nKey = I18N_HOUR; }
                else if (diff < 86400) { i18nKey = I18N_HOURS; value = Math.floor(diff / 3600); }
            } else if (dayDiff === 1) { i18nKey = I18N_YESTERDAY; }
            else if (dayDiff < 7) { i18nKey = I18N_DAYS; value = dayDiff; }
            else if (dayDiff < 8) { i18nKey = I18N_WEEK; }
            else if (dayDiff < 14) { i18nKey = I18N_DAYS; value = dayDiff; }
            else if (dayDiff < 30) { i18nKey = I18N_WEEKS; value = Math.ceil(dayDiff / 7); }
            else if (dayDiff < 32) { i18nKey = I18N_MONTH; }
            else if (dayDiff < 363) { i18nKey = I18N_MONTHS; value = Math.ceil(dayDiff / 31); }
            else if (dayDiff <= 380) { i18nKey = I18N_YEAR; }
            else if (dayDiff > 380) { i18nKey = I18N_YEARS; value = Math.ceil(dayDiff / 365); }

            this.set({ "data-i18n": i18nKey, "data-prettydate": value });
            // schedule next update
            setTimeout(this._refreshDate, (dayDiff > 0 ? 86400 : (diff < 3600 ? 60 : 3600)) * 1000);
        }
    });
}(window.DOM));
