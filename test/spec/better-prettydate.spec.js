describe("better-prettydate", function() {
    "use strict";

    var time;

    beforeEach(function() {
        time = DOM.mock("time.prettydate>{2012}");
    });

    // it("should allow to read Date from the attribute value", function() {
    //     expect(+time.getDate()).toBe(1325376000000);

    //     time.set("datetime", "2013-07-09T13:12:52.795Z");
    //     expect(+time.getDate()).toBe(1373375572795);

    //     time.set("datetime", "2013-07-09T13:12:52.795+03");
    //     expect(+time.getDate()).toBe(1373364772795);

    //     time.set("datetime", "2013-07-09T13:12:52.795-07");
    //     expect(+time.getDate()).toBe(1373400772795);
    // });

    // it("should throw error if attribute value is invalid", function() {
    //     time.set("datetime", "abc");
    //     expect(function() { time.getDate(); }).toThrow();
    // });

    // it("should allow to set Date object", function() {
    //     var value = new Date(Date.UTC(2013,6,2,12,46,21,333)),
    //         spy = spyOn(time, "set").andReturn(time),
    //         spy2 = spyOn(time, "_refreshDate");

    //     time.setDate(value);
    //     expect(spy).toHaveBeenCalledWith("datetime", "2013-07-02T12:46:21.333Z");
    //     expect(spy2).toHaveBeenCalled();
    // });

    it("should schelude next update using appropriate timeout", function() {
        var now = new Date(),
            setSpy = spyOn(time, "i18n").andReturn(time),
            timeoutSpy = spyOn(window, "setTimeout");

        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(timeoutSpy, 60, setSpy, "just now", 1);

        now.setMinutes(now.getMinutes() - 1);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(timeoutSpy, 60, setSpy, "a minute ago", 1);

        now.setMinutes(now.getMinutes() - 23);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(timeoutSpy, 60, setSpy, "${prettydate} minutes ago", 24);

        now.setMinutes(now.getMinutes() - 40);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(timeoutSpy, 3600, setSpy, "an hour ago", 1);

        now.setHours(now.getHours() - 2);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(timeoutSpy, 3600, setSpy, "${prettydate} hours ago", 3);

        now.setDate(now.getDate() - 1);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "yesterday", 1);

        now.setDate(now.getDate() - 4);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "${prettydate} days ago", 5);

        now.setDate(now.getDate() - 2);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "a week ago", 1);

        now.setDate(now.getDate() - 3);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "${prettydate} days ago", 10);

        now.setDate(now.getDate() - 10);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "${prettydate} weeks ago", 3);

        now.setDate(now.getDate() - 10);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "a month ago", 1);

        now.setMonth(now.getMonth() - 1);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "${prettydate} months ago", 2);

        now.setMonth(now.getMonth() - 10);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "an year ago", 1);

        now.setFullYear(now.getFullYear() - 10);
        time.data("ts", now.getTime()).doRefreshText();
        checkAttrs(null, 86400, setSpy, "${prettydate} years ago", 12);
    });

    function checkAttrs(timeoutSpy, timeout, spy, i18n, value) {
        expect(spy).toHaveBeenCalledWith(i18n, {prettydate: value});
        if (timeoutSpy) expect(timeoutSpy.mostRecentCall.args[1]).toBe(timeout * 1000);
    }
});
