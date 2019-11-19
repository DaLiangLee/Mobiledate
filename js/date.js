// Martin 修改
function dateshow() {
    $("#datePlugin").animate({
        opacity: 1
    }, 300);
    $("#datePlugin").addClass("show");
}

function datehide() {
    $("#datePlugin").animate({
        opacity: 0
    }, 300);
    setTimeout(function () {
        $("#datePlugin").removeClass("show")
    }, 300);
}
(function ($) {
    $.fn.date = function (options, Ycallback, Ncallback) {
        var that = $(this);
        var docType = $(this).is('input');
        var nowdate = new Date();
        var indexY = 1,
            indexM = 1,
            indexD = 1;
        var initY = parseInt((nowdate.getFullYear())) - 1900;
        var initM = parseInt(nowdate.getMonth() + "") + 1;
        var initD = parseInt(nowdate.getDate() + "");
        var yearScroll = null,
            monthScroll = null,
            dayScroll = null;
        $.fn.date.defaultOptions = {
            beginyear: 1900,
            endyear: nowdate.getFullYear() + 50,
            beginmonth: 1,
            endmonth: 12,
            beginday: 1,
            endday: 31,
            beginhour: 1,
            endhour: 12,
            beginminute: 00,
            endminute: 59,
            curdate: false,
            theme: "date",
            mode: null,
            event: "click",
            show: true
        }
        var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
        if (!opts.show) {
            that.unbind('click');
        } else {
            that.bind(opts.event, function () {
                createUL();
                init_iScrll();
                extendOptions();
                that.blur();
                refreshDate();
                bindButton();
            })
        };

        function refreshDate() {
            yearScroll.refresh();
            monthScroll.refresh();
            dayScroll.refresh();
            resetInitDete();
            yearScroll.scrollTo(0, initY * 50, 100, true);
            monthScroll.scrollTo(0, initM * 50 - 50, 100, true);
            dayScroll.scrollTo(0, initD * 50 - 50, 100, true);
        }

        function resetIndex() {
            indexY = 1;
            indexM = 1;
            indexD = 1;
        }

        function resetInitDete() {
            if (opts.curdate) {
                return false;
            } else if (that.val() === "") {
                return false;
            }
            initY = parseInt(that.val().substr(0, 4)) - opts.beginyear;
            initM = parseInt(that.val().substr(5, 2));
            initD = parseInt(that.val().substr(8, 2));
        }

        function bindButton() {
            resetIndex();
            $("#dateconfirm").unbind('click').click(function () {
                var datestr = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1) + "-" +
                    indexM + "-" +
                    $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().substr(0, $("#daywrapper ul li:eq(" + Math.round(indexD) + ")").html().length - 1);
                if (Ycallback === undefined) {
                    if (docType) {
                        that.val(datestr);
                    } else {
                        that.find("i").eq(0).html(datestr);
                    }
                } else {
                    Ycallback(datestr);
                }
                $('.userBrithdate').val(datestr)
                datehide();
            });
            $("#datecancle").click(function () {
                datehide();
            });
        }

        function extendOptions() {
            dateshow();
        }

        function init_iScrll() {
            var strY = 0;
            var strM = 0;
            yearScroll = new iScroll("yearwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function () {
                    indexY = (this.y / 50) * (-1) + 1;
                    strY = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                    strM = indexM;
                    opts.endday = checkdays(strY, strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                    $("#monthwrapper").find("li").eq(crentMonthindex).addClass("crently").siblings().removeClass("crently");
                    $("#daywrapper").find("li").eq(crentDayindex).addClass("crently").siblings().removeClass("crently");
                }
            });
            monthScroll = new iScroll("monthwrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function () {
                    indexM = (this.y / 50) * (-1) + 1;
                    strY = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1);
                    strM = indexM;
                    opts.endday = checkdays(strY, strM);
                    $("#daywrapper ul").html(createDAY_UL());
                    dayScroll.refresh();
                    $("#daywrapper").find("li").eq(crentDayindex).addClass("crently").siblings().removeClass("crently");
                }
            });
            dayScroll = new iScroll("daywrapper", {
                snap: "li",
                vScrollbar: false,
                onScrollEnd: function () {
                    indexD = (this.y / 50) * (-1) + 1;
                }
            });
        }

        function checkdays(year, month) {
            var new_year = year;
            var new_month = month++;
            if (month > 12) {
                new_month -= 12;
                new_year++;
            }
            var new_date = new Date(new_year, new_month, 1);
            return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
        }

        function createUL() {
            CreateDateUI();
            $("#yearwrapper ul").html(createYEAR_UL());
            $("#monthwrapper ul").html(createMONTH_UL());
        }

        function CreateDateUI() {
            var str = '' +
                '' +
                '<div id="datePage" class="page">' +
                    '<section>' +
                        '<div id="datetitle"><h1>Please Select</h1></div>' +
                        '<div id="datemark"><a id="markyear"></a><a id="markmonth"></a><a id="markday"></a></div>' +
                        '<div id="timemark"><a id="markhour"></a><a id="markminut"></a><a id="marksecond"></a></div>' +
                        '<div id="datescroll">' +
                            '<div id="yearwrapper">' +
                                '<ul></ul>' +
                            '</div>' +
                            '<div id="monthwrapper">' +
                                '<ul></ul>' +
                            '</div>' +
                            '<div id="daywrapper">' +
                                '<ul></ul>' +
                            '</div>' +
                        '</div>' +
                    '</section>' +
                    '<footer id="dateFooter">' +
                        '<div id="setcancle">' +
                            '<ul>' +
                                '<li id="dateconfirm">Confirm</li>' +
                                '<li id="datecancle">Cancel</li>' +
                            '</ul>' +
                        '</div>' +
                    '</footer>' +
                '</div>'
            $("#datePlugin").html(str);
            dateshow();
        }

        function createYEAR_UL() {
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginyear; i <= opts.endyear; i++) {
                str += '<li>' + i + ' </li>'
            }
            return str + "<li>&nbsp;</li>";;
        }

        function createMONTH_UL() {
            var str = "<li>&nbsp;</li>";
            var months = ['January','February','March','April','May','June', 'July','August','September','October','November','December'];
            for (var i = 0; i < months.length; i++) {
                str += '<li>' + months[i] + ' </li>'
            }
            return str + "<li>&nbsp;</li>";;
        }

        function createDAY_UL() {
            $("#daywrapper ul").html("");
            var str = "<li>&nbsp;</li>";
            for (var i = opts.beginday; i <= opts.endday; i++) {
                if (i < 10) {
                    i = "0" + i
                }
                str += '<li>' + i + ' </li>'
            }
            return str + "<li>&nbsp;</li>";;
        }
    }
})(jQuery);