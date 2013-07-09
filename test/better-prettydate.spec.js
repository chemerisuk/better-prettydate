describe("better-prettydate", function() {
    "use strict";

    var time;

    beforeEach(function() {
        time = DOM.mock("time[datetime]");
    });

    it("should allow to read Date from the attribute value", function() {
        var spy = spyOn(time, "get").andReturn("2013-07-09T13:12:52.795Z");
        expect(+time.getDate()).toBe(1373375572795);
        expect(spy).toHaveBeenCalled();

        spy.andReturn("2013-07-09T13:12:52.795+03");
        expect(+time.getDate()).toBe(1373364772795);
        expect(spy).toHaveBeenCalled();

        spy.andReturn("2013-07-09T13:12:52.795-07");
        expect(+time.getDate()).toBe(1373400772795);
        expect(spy).toHaveBeenCalled();

        spy.andReturn("2012");
        expect(+time.getDate()).toBe(1325376000000);
        expect(spy).toHaveBeenCalled();
    });

    it("should throw error if attribute value is invalid", function() {
        var spy = spyOn(time, "get").andReturn("abc");
        expect(function() { time.getDate(); }).toThrow();
        expect(spy).toHaveBeenCalled();
    });

    it("should allow to set Date object", function() {
        var value = new Date(Date.UTC(2013,6,2,12,46,21,333)),
            spy = spyOn(time, "set").andReturn(time),
            spy2 = spyOn(time, "_refreshDate");

        time.setDate(value);
        expect(spy).toHaveBeenCalledWith("datetime", "2013-07-02T12:46:21.333Z");
        expect(spy2).toHaveBeenCalled();
    });

    it("should schelude next update using appropriate timeout", function() {
        var now = new Date(),
            spy = spyOn(time, "getDate").andReturn(now),
            //timeoutSpy = spyOn(window, setTimeout),
            setSpy = spyOn(time, "set"),
            timeoutSpy = spyOn(window, "setTimeout");

        time._refreshDate();
        expect(spy).toHaveBeenCalled();
        checkAttrs(timeoutSpy, 60, setSpy, "prettydate-now", 1);

        now.setMinutes(now.getMinutes() - 1);
        time._refreshDate();
        checkAttrs(timeoutSpy, 60, setSpy, "prettydate-minute", 1);
        
        now.setMinutes(now.getMinutes() - 23);
        time._refreshDate();
        checkAttrs(timeoutSpy, 60, setSpy, "prettydate-minutes", 24);

        now.setMinutes(now.getMinutes() - 40);
        time._refreshDate();
        checkAttrs(timeoutSpy, 3600, setSpy, "prettydate-hour", 1);

        now.setHours(now.getHours() - 2);
        time._refreshDate();
        checkAttrs(timeoutSpy, 3600, setSpy, "prettydate-hours", 3);

        now.setDate(now.getDate() - 1);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-yesterday", 1);

        now.setDate(now.getDate() - 4);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-days", 5);

        now.setDate(now.getDate() - 2);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-week", 1);

        now.setDate(now.getDate() - 3);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-days", 10);

        now.setDate(now.getDate() - 10);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-weeks", 3);

        now.setDate(now.getDate() - 10);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-month", 1);

        now.setMonth(now.getMonth() - 1);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-months", 2);

        now.setMonth(now.getMonth() - 10);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-year", 1);

        now.setFullYear(now.getFullYear() - 10);
        time._refreshDate();
        checkAttrs(timeoutSpy, 86400, setSpy, "prettydate-years", 12);
    });

    function checkAttrs(timeoutSpy, timeout, spy, i18n, value) {
        expect(timeoutSpy.mostRecentCall.args[1]).toBe(timeout * 1000);
        expect(spy).toHaveBeenCalledWith({"data-i18n": i18n, "data-prettydate": value});
    }
});
