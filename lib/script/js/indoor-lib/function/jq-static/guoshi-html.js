"use strict";
($ => {
    Guoshi.Html = {
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
    };
})(jQuery);
//# sourceMappingURL=guoshi-html.js.map