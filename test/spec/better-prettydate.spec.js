describe("better-prettydate", function() {
    "use strict";

    var time, thisYear = new Date().getFullYear();

    beforeEach(function() {
        time = DOM.mock("time.prettydate>`{0}`", [thisYear]);
    });

    it("should support datetime and innerHTML", function() {
        var date = new Date();

        time = DOM.mock("time.prettydate[datetime=`{0}`]", [date.toISOString()]);
        expect(time.data("ts")).toBe(date.getTime());

        time = DOM.mock("time.prettydate>`{0}`", [date.toISOString()]);
        expect(time.data("ts")).toBe(date.getTime());
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
    //         spy = spyOn(time, "set").and.returnValue(time),
    //         spy2 = spyOn(time, "_refreshDate");

    //     time.setDate(value);
    //     expect(spy).toHaveBeenCalledWith("datetime", "2013-07-02T12:46:21.333Z");
    //     expect(spy2).toHaveBeenCalled();
    // });

    it("should schelude next update using appropriate timeout", function() {
        var now = new Date(),
            setSpy = spyOn(time, "i18n").and.returnValue(time),
            timeoutSpy = spyOn(window, "setTimeout");

        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(timeoutSpy, 60, setSpy, "just now", 1);

        now.setMinutes(now.getMinutes() - 1);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(timeoutSpy, 60, setSpy, "a minute ago", 1);

        now.setMinutes(now.getMinutes() - 23);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(timeoutSpy, 60, setSpy, "{0} minutes ago", 24);

        now.setMinutes(now.getMinutes() - 40);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(timeoutSpy, 3600, setSpy, "an hour ago", 1);

        now.setHours(now.getHours() - 2);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(timeoutSpy, 3600, setSpy, "{0} hours ago", 3);

        now.setDate(now.getDate() - 1);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "yesterday", 1);

        now.setDate(now.getDate() - 4);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "{0} days ago", 5);

        now.setDate(now.getDate() - 2);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "a week ago", 1);

        now.setDate(now.getDate() - 3);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "{0} days ago", 10);

        now.setDate(now.getDate() - 10);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "{0} weeks ago", 3);

        now.setDate(now.getDate() - 10);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "a month ago", 1);

        now.setMonth(now.getMonth() - 1);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "{0} months ago", 2);

        now.setMonth(now.getMonth() - 10);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "an year ago", 1);

        now.setFullYear(now.getFullYear() - 11);
        time.data("ts", now.getTime()).doRefreshText(time.doRefreshText);
        checkAttrs(null, 86400, setSpy, "{0} years ago", 12);
    });

    function checkAttrs(timeoutSpy, timeout, spy, i18n, value) {
        expect(spy).toHaveBeenCalledWith(i18n, [value]);

        // if (timeoutSpy) expect(timeoutSpy.calls.mostRecent).toBe(timeout * 1000);
    }
});
