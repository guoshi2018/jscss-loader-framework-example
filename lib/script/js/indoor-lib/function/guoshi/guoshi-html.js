"use strict";
($ => {
    const Guoshi = {
        Html: {
            clickBlankToRefreshDocment: () => {
                //点击页面空白,重载(刷新)页面
                $('body').click(function (evt) {
                    if (evt.target == this) {
                        //ok:
                        //window.history.go(0);
                        //window.location.reload();
                        window.location = location;
                        //window.location.assign(window.location.href);
                        //location.replace(location.href);	
                        //fail
                        //document.execCommand('refresh');		//fail
                        //document.URL = location.href;		//fail
                    }
                });
            },
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
            }
        }
    };
})(jQuery);
//# sourceMappingURL=guoshi-html.js.map