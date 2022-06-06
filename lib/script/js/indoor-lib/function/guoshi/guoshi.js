"use strict";
(($, global) => {
    Object.defineProperty(global, 'Guoshi', {
        value: {
            Html: {
                clickBlankToRefreshDocment: () => {
                    $('body').on('click', function (evt) {
                        if (evt.target == this) {
                            //ok:
                            global.history.go(0);
                            //global.location.reload();
                            //global.location = global.location;
                            //global.location.assign(window.location.href);
                            //location.replace(location.href);	
                            //fail
                            //document.execCommand('refresh');		//fail
                            //document.URL = location.href;		//fail
                        }
                    });
                },
                scrollBarAtBottom: () => {
                    //实测到底时满足: 滚动条位置与窗口高度之和等于文档整个高度 - 0.5
                    const doc = document.documentElement || document.body;
                    //留点余地
                    return Math.abs(doc.scrollHeight - (doc.scrollTop + doc.clientHeight)) <= 0.8;
                },
                scrollBarBottomed: () => {
                    //实测到底时满足: 滚动条位置与窗口高度之和等于文档整个高度 - 0.5
                    const doc_h = $(document).height() || 0;
                    const sum = ($(global).height() || 0) + ($(global).scrollTop() || 0);
                    //留点余地
                    return Math.abs(doc_h - sum) <= 0.8;
                },
                isScrollBarActive: () => {
                    const doc = document.documentElement || document.body;
                    return doc.scrollHeight > doc.clientHeight || doc.scrollHeight > global.innerHeight;
                },
                scrollBarActived: function () {
                    // const doc_h = $(document).innerHeight() || 0;
                    // const view_h = $(global).outerHeight() || 0;
                    // console.log(doc_h, view_h);
                    // return doc_h > view_h;
                    return this.isScrollBarActive();
                },
                relLocFrom: function (ele, evt) {
                    const loc = $(ele).offset();
                    const left = loc?.left || 0;
                    const top = loc?.top || 0;
                    const x = Math.floor(evt.pageX - left);
                    const y = Math.floor(evt.pageY - top);
                    return {
                        left: x,
                        top: y,
                    };
                }
            },
            Math: {
                sum: (arr) => {
                    let total = 0;
                    arr.forEach(v => {
                        //		const s = typeof (v);
                        total += typeof v == 'string' ? parseFloat(v.trim()) : v;
                    });
                    return total;
                },
                avg: function (arr) {
                    return arr.length > 0 ? this.sum(arr) / arr.length : 0;
                },
            },
            Misc: {
                sleep: (delay) => {
                    return new Promise((res => {
                        setTimeout(() => {
                            const s = (delay / 1000).toFixed(2);
                            res(`delay ${s} seconds successfully`);
                        }, delay);
                    }));
                },
            }
        },
        writable: false,
        configurable: false,
        enumerable: true,
    });
})(jQuery, this);
//# sourceMappingURL=guoshi.js.map