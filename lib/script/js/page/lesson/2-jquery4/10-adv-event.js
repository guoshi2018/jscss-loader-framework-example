"use strict";
/*********************************************************************************************************
 * 页面的入口文件，是前端页面文件（例如cshtml或html）中唯一包含的<script >标签中，entry属性指定的js脚本文件
 *
 * 使用方法：
 *      1、在前端页面文件末尾，加入以下标签（普通html页面，则不需要@section，其他类型的页面文件，请参考相关文档）：
                @section custom_javascript{
                             <script src="<jscss-loader.js文件的全路径>" entry="<本js文件的全路径>"></script>
                }
 *      2、找到main方法中，按照提示写入代码。
 *
* 调试完毕，可考虑将 true改为false, 以关闭加载的调试信息
* *******************************************************************************************************/
JscssLoader.getInstance().startEntry({
    //globalRes: 默认包含必要脚本的文件 '/lib/script/json/global.json',一般不用修改
    //null 或 空字符串 '' 或 输入路劲不存在, 则放弃公共先决资源文件的加载
    //是否启用调试
    debug: true,
    //在此添加本入口文件需要包含的js css文件全路径,默认[]
    //页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
    //必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
    privateRes: [
        [
            '/lib/style/css/2-jquery4/default.css',
            '/lib/style/css/2-jquery4/10-adv-event.css',
            '/lib/style/scss/10-adv-event/main.css',
            '/lib/script/js/indoor-lib/function/guoshi/guoshi.js'
        ], [
            '/lib/script/js/indoor-lib/function/guoshi/guoshi.js',
            '/lib/script/js/indoor-lib/function/jq-misc/ext-event.js',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        const MAX_PAGE = 12;
        let nextPage = 0;
        Guoshi.Html.clickBlankToRefreshDocment();
        //仅释放其一
        //configHoverImage1();
        configHoverImage2();
        //to do
        //testAjax();
        //testScrollBarMethod();
        //以下三个测试前, 注意取消页面末尾注释
        //testTrigger();
        //testExtEvent1();
        //testExtEvent2();
        chapterExercise();
        //下面一组 与 这一组下面的一句, 如果同时运行可能有问题,至少是体验上的
        //#region 自编自导 ok
        // configLoadmoreByCaption();
        // configLoadmoreByHyperlink();
        // configDocumentCustomEvent();
        // configLoadmoreByScrollbar();
        // configLoadmoreByMousewheel();
        //#endregion
        //extensionEvenAccordingToBook();
        /**
         * 配置图片hover时的显隐detail, 对于后续加载的图片无效
         */
        function configHoverImage1() {
            // $('div.photo').hover(function () {
            // 	$(this).find('.details').fadeTo('fast', 0.5);
            // }, function () {
            // 	$('.details', this).fadeOut('fast');
            // })
            //或者
            $('div.photo').on('mouseenter mouseleave', function (evt) {
                const jdetails = $('.details', this);
                evt.type.toLowerCase() == 'mouseenter' ?
                    jdetails.fadeTo('fast', 0.5) :
                    jdetails.fadeOut('fast');
            });
        }
        /**
         * 改进后的代码
         */
        function configHoverImage2() {
            //委托给body当然也可以, 但是性能上由损失, 但有时候这样的早委托又是必要的
            $('div#gallery').on('mouseenter mouseleave', '.photo', function (evt) {
                const jdetails = $('.details', this); //注意和上面一模一样
                evt.type.toLowerCase() == 'mouseenter' ?
                    jdetails.fadeTo('fast', 0.5) :
                    jdetails.fadeOut('fast');
            });
        }
        /**
         * 1. 配置点击链接 more photo... 之行为:
         * 		将存储html片段的html文件内容加载到页面
         */
        function configLoadmoreByHyperlink() {
            /**
             * scrollToVisible:表示是否滚动到适当位置, 让新加载的
             * 内容可见
             */
            $('a#more-photos').click(function (evt, scrollToVisible) {
                evt.preventDefault();
                nextPage++;
                console.log('current page:', nextPage);
                if (nextPage <= MAX_PAGE) {
                    $.get(`/lib/html-clip/${nextPage}.html`, data => {
                        //$('#gallery').append(data);
                        const jdata = $(data).appendTo('#gallery');
                        if (scrollToVisible) {
                            $(window).scrollTop(jdata.offset()?.top || 0);
                            //	$(window).scrollTop(10);
                        }
                    });
                    if (nextPage == MAX_PAGE) {
                        //保住链接尺寸,以便结合其位置,撑起父容器的高度, 能保住容器外部下面的内容可见
                        //$(this).off('click').css('visibility', 'hidden');
                        //这样就不能保住文档底部(位于容器外部,下面)的内容
                        //$(this).off('click').hide();
                        //但是,如果加入一直visibility:hidden的元素在容器底部, 则上两方法均可以
                        //甚至:
                        //$(this).off('click').slideUp();
                        $(this).off('click').fadeOut();
                    }
                }
            });
        }
        /**
         * 配置点击大标题, 模拟多次加载更多
         */
        function configLoadmoreByCaption() {
            $('h1.caption').click(function () {
                for (let i = 0; i < MAX_PAGE + 5; i++) {
                    $('a#more-photos').trigger('click', true);
                }
            });
        }
        /**
         * 配置document的自定义事件loadmore,当被激发,则引发加载链接的click事件
         */
        function configDocumentCustomEvent() {
            let loadmore = 0;
            //3配置document的自定义事件loadmore,当被激发,则引发加载链接的click事件
            $(document).on('loadmore', function (_, scrollToVisible) {
                console.log('document received loadmore event:', ++loadmore);
                $('a#more-photos').trigger('click', scrollToVisible);
            });
        }
        /**
         * 4. 配置滚动条事件,当滚至文档底部, 触发document的loadmore事件
         */
        function configLoadmoreByScrollbar() {
            let scroll = 0; //记录滚动条滚动次数
            let bott = 0; //记录滚动条到底次数
            //4 配置滚动调试件,当滚至文档底部, 触发document的loadmore事件
            $(document).on('scroll.for-loadmore', function (evt) {
                console.log('scroll bar:', ++scroll);
                if (nextPage < MAX_PAGE) {
                    //文档顶部到窗口底部的距离: 
                    const distance = ($(window).scrollTop() || 0) + ($(window).height() || 0);
                    const h = $('#container').height() || 0;
                    console.log(`doctop-winbot:${distance.toFixed(0)}, h:${h.toFixed(0)}`);
                    if (distance >= h) { //见 checkScrollPosition 注释
                        console.log(`to bottom ${++bott}`);
                        $('div#loadingMsg').trigger('loadmore'); //利用事件冒泡,随便找个提升引发,只要事件冒泡不被stop
                        //$('div#loadingMsg').trigger('loadmore', true); // true or false
                    }
                }
                else {
                    $(document).off('scroll.for-loadmore'); //加载完则卸载事件
                }
            });
        }
        /**
         *
         * 5. 配置鼠标滚轮事件: 滚动条未出现时, 鼠标滚轮向下滚动, 触发document的loadmore事件,
         * 		出现滚动条, 则取消该事件响应
         */
        function configLoadmoreByMousewheel() {
            let wheel = 0; //记录滚轮在窗体未出现滚动条时,向下滚动的次数
            //5 配置鼠标滚轮事件: 滚动条未出现时, 鼠标滚轮向下滚动, 触发document的loadmore事件,
            // 出现滚动条, 则取消该事件响应
            $(document).on('mousewheel.for-loadmore', function (evt) {
                //@ts-ignore
                console.log('mousewheel:', evt.originalEvent.wheelDelta);
                if (!Guoshi.Html.isScrollBarActive() && nextPage < MAX_PAGE) {
                    //@ts-ignore 小于0,滚轮下滚;大于0,滚轮上滚.实测仅仅为-120和120
                    if (evt.originalEvent.wheelDelta < 0) {
                        console.log('mousewheel down:', ++wheel);
                        $(document).trigger('loadmore', true);
                    }
                    ////一旦出现滚动条或者加载完毕, 则销毁事件响应
                }
                else {
                    console.log('scrollbar usable or content complete. then unload event');
                    $(this).off('mousewheel.for-loadmore');
                }
            });
        }
        /**
         * 按照书上原版抄录, 包括
         * 1. 自定义事件: document引发 nextPage 事件,则 load more
         * 	 甚至 load more 超级链接的点击, 也是通过触发 nextPage事件进行加载
         *
         */
        function extensionEvenAccordingToBook() {
            //注册在document上的优势之一: 页面一打开文档就立即可用!
            $(document).on('nextPage', function () {
                nextPage++;
                console.log('current page:', nextPage);
                if (nextPage >= MAX_PAGE) {
                    //这里移除, 需要本次响应(包含下面的相应完毕方才生效)
                    console.log('remove nextPage event');
                    //在下一个周期, 顺便将下面的第二个事件处理卸载
                    $(this).off('nextPage');
                    //$(window).off('scroll');
                    $(window).off('throttledScroll');
                    //保住链接尺寸,以便结合其位置,撑起父容器的高度
                    $('#more-photos').off('click').css('visibility', 'hidden');
                    //如果将其移除或隐藏, 导致container的高度突然变小, 但对加载无影响:
                    //$('#more-photos').off('click').remove();
                    //但是如果html中container外下部设有相应的不可见的占位符,则两者皆可
                    $('div#loadingMsg').hide();
                }
            });
            $(document).on('nextPage', function (_, scrollToVisible) {
                //这里不用判断nextPage的值, 因为两个处理是按注册的顺序执行
                $.get(`/lib/html-clip/${nextPage}.html`, async (data) => {
                    const jdata = $(data).appendTo('#gallery');
                    if (scrollToVisible) {
                        $(window).scrollTop(jdata.offset()?.top || 0);
                    }
                    //循环, 直至加载图片导致container高度,大于视口与滚动条位移之和
                    //这样就不惧页面事先被缩小,一次loadmore不足以出现滚动条的问题
                    //但这样会一次加载完毕.
                    //checkScrollPosition();
                    //像这样,加入滚动条可用判断,可以弥补上述缺点
                    if (!Guoshi.Html.isScrollBarActive()) {
                        checkScrollPosition();
                    }
                    //使用jdata作为trigger的源,以保证可以冒泡接收
                    jdata.trigger('pageLoaded', nextPage); //此时的nextPage还是加载的页号
                });
            });
            //超链点击,利用事件冒泡, 最终由document处理 
            $('#more-photos').click(function (evt) {
                $(this).trigger('nextPage', true); //true:让新加载的photo可见
                //$(this).triggerHandler('nextPage', true); //不冒泡,所以无法使用
                return false;
            });
            let infscroll = 0;
            /**
             * 检查视口以上是否有多余空间, 有则加载更多内容
             */
            function checkScrollPosition() {
                //文档顶部到窗口底部的距离: 
                const distance = ($(window).scrollTop() || 0) + ($(window).height() || 0);
                const h = $('#container').height() || 0;
                console.log(`doctop-winbot:${distance.toFixed(0)}, h:${h.toFixed(0)}`);
                if (distance >= h) {
                    console.log('infinite scroll :', ++infscroll);
                    $(document).trigger('nextPage', false); //如果为true,反倒会使得滚动不平滑
                }
            }
            //鼠标滚轮响应略, 所以如果页面缩小到一定程度,首次编程实现的滚动导致, 或者节流主动调用
            //checkScrollPosition加载的第一页, 内容可能不足以撑出滚动条. 此时就必须点击链接 #load-more了
            //但如果在nextPage响应中,添加checkScrollPosition的调用,则可保证循环加载至内容足够多,
            //滚动条出现
            //#region  加载即滚动一次
            //页面加载后,立即来一次loadmore
            //$(window).scroll(checkScrollPosition).trigger('scroll'); //ok
            //$(window).on('scroll', checkScrollPosition).trigger('scroll');	//ok
            //$(window).on('scroll', checkScrollPosition).scroll();		//ok
            //scrollThrottle1();
            //scrollThrottle2();
            //采用扩展事件事先的封装节流滚动:(window真正的scroll监听,在throttledScroll的setup中进行)
            $(window).on('throttledScroll', checkScrollPosition).trigger('throttledScroll');
            /**
             * 滚动条滚动加入节流处理,方案一, 延时器
             */
            function scrollThrottle1() {
                let timer = 0;
                $(window).on('scroll', function () {
                    if (!timer) {
                        timer = setTimeout(function () {
                            checkScrollPosition();
                            timer = 0;
                        }, 510);
                    }
                }).trigger('scroll');
            }
            /**
             * 滚动条滚动加入节流处理,方案二, 定时器
             */
            function scrollThrottle2() {
                let canScroll = false;
                setInterval(function () {
                    if (canScroll) {
                        checkScrollPosition();
                        canScroll = false;
                    }
                }, 510);
                $(window).on('scroll', function () {
                    canScroll = true;
                });
                //页面加载时首次调用:
                checkScrollPosition();
            }
            //#endregion
        }
        /**
         * 测试附带的 live server 的ajax行为: ok
         */
        async function testAjax() {
            // $.get('/lib/html-clip/1.html', data => { //ok
            // 	console.log(data);
            // });
            const data = await $.get('/lib/html-clip/1.html'); //ok
            console.log(data);
        }
        /**
         * 测试滚动条相关的自定义方法:
         * 1. 点击底部占位符div.footer, 是否位于底部: scrollBarAtBottom scrollBarBottomed
         * 2. 点击顶部占位符div.footer, 是否出现并可用(需要禁用滚动条和鼠标滚轮加载数据,
         * 		可通过循环递增占位符高度实现滚动条):isScrollBarActive scrollBarActived
         *
         */
        function testScrollBarMethod() {
            $('div.footer').click(function () {
                console.clear();
                console.log('滚动条实验开始:');
                let sab = 0;
                let sbd = 0;
                $(window).on('scroll', function () {
                    const win_h = $(window).height() || 0; //窗口高度
                    const src_loc = $(window).scrollTop() || 0;
                    const doc_h = $(document).height() || 0;
                    //console.log(`win-h:${win_h},scr-loc:${src_loc},doc-h:${doc_h}`);
                    //实测: 和比高小 0.5 则到底.
                    //console.log(`和:${win_h + src_loc},高:${doc_h}`);
                    if (Guoshi.Html.scrollBarAtBottom()) {
                        console.log('scrollBar At Bottom:fire', ++sab);
                    }
                    if (Guoshi.Html.scrollBarBottomed()) {
                        console.log('scrollBar Bottomed:fire', ++sbd);
                    }
                });
            });
            async function examScroll(evt) {
                const jele = $(evt.target);
                jele.off('click');
                console.clear();
                console.log('开始测试滚动条出现时机的判断:');
                const origH = jele.height() || 0;
                while (
                //!Guoshi.Html.isScrollBarActive()
                !Guoshi.Html.scrollBarActived()) {
                    const h = jele.height() || 0;
                    jele.height(h + 0.1);
                }
                console.log('scrollbar visible. placeholder height:', jele.height());
                const resp = await Guoshi.Misc.sleep(3258);
                console.log(resp, '现在恢复初始高度,并还原事件响应');
                jele.height(origH);
                jele.on('click', examScroll);
            }
            $('div.header').on('click', examScroll);
        }
        /**
         * 测试trigger,triggerHandler区别及其参数
         */
        function testTrigger() {
            console.clear();
            let divClicked = 0;
            let divHello = 0;
            $('div.trigger-test')
                .on('click', evt => {
                console.log('div clicked:', ++divClicked);
            })
                .on('hello', evt => {
                console.log('div hello:', ++divHello);
            });
            $('a.baidu,a.sina').on('click', evt => {
                console.log(`${evt.target.innerHTML} clicked.`);
            });
            $('a.baidu,a.sina').on('hello', evt => {
                console.log(`${evt.target.innerHTML} hello.`);
            });
            //mock click
            $('input.trigger-click').on('click', evt => {
                console.log('mock click use trigger:---------------------');
                $('a.baidu,a.sina').trigger('click');
            });
            $('input.triggerHandler-click').on('click', evt => {
                console.log('mock click use triggerHandler:-----------------');
                $('a.baidu,a.sina').triggerHandler('click');
            });
            //mock hello
            $('input.trigger-hello').on('click', evt => {
                console.log('mock hello use trigger:---------------------');
                $('a.baidu,a.sina').trigger('hello');
            });
            $('input.triggerHandler-hello').on('click', evt => {
                console.log('mock click use triggerHandler:-----------------');
                $('a.baidu,a.sina').triggerHandler('hello');
            });
        }
        /**
         * 全部设计成middle接收事件并处理, 触发方式有多种组合
         * 测试扩展事件的name bindType delegateType与收发关系即限制,结论如下
         * 1. 如果是元素自己触发,自己监听,方式为:
         * 		trigger("payoff") 或 trigger("bind-payoff"),
         * 		接收事件 event.type 一致的等于 "bind-payoff"
         * 2. 如果是其他元素触发,方式只能是:
         * 		trigger("bind-payoff"),接收事件的type同上
         * 3. 收到的type ,delegateType优先于name
         * 注意, 1,2 结论建立在下面的hook全部未实现(即采用默认)的基础上.
         * 		如果有实现,可能结果会不一致(收不到事件通知)
         */
        function testExtEvent1() {
            const jouter = $('div.ext-event');
            const jmiddle = $('div.middle');
            //直接
            jmiddle.on('payoff', function (evt) {
                console.log('[on payoff] middle receive: ', evt.type);
            });
            jmiddle.on('bind-payoff', function (evt) {
                console.log('[on bind-payoff] middle receive: ', evt.type);
            });
            jmiddle.on('delegate-payoff', function (evt) {
                console.log('[on delegate-payoff] middle receive: ', evt.type);
            });
            //代理
            jouter.on('payoff', 'div.middle', evt => {
                console.log('[outer delegate payoff] middle receive: ', evt.type);
            });
            jouter.on('bind-payoff', 'div.middle', evt => {
                console.log('[outer delegate bind-payoff] middle receive: ', evt.type);
            });
            jouter.on('delegate-payoff', 'div.middle', evt => {
                console.log('[outer delegate delegate-payoff] middle receive: ', evt.type);
            });
            //mockers :
            $('input.inner-payoff').on('click', function () {
                console.log('inner trigger payoff---------------------------');
                $(this).trigger('payoff');
            });
            $('input.inner-bind').on('click', function () {
                console.log('inner trigger bind-payoff---------------------------');
                $(this).trigger('bind-payoff');
            });
            $('input.inner-delegate').on('click', function () {
                console.log('inner trigger delegate-payoff---------------------------');
                $(this).trigger('delegate-payoff');
            });
            /*
                            <input type="button" value="middle-payoff" class="middle-payoff" />
                            <input type="button" value="middle-bind" class="middle-bind" />
                            <input type="button" value="middle-delegate" class="middle-delegate" />
            */
            $('input.middle-payoff').on('click', function () {
                console.log('middle trigger payoff---------------------------');
                jmiddle.trigger('payoff');
            });
            $('input.middle-bind').on('click', function () {
                console.log('middle trigger bind-payoff---------------------------');
                jmiddle.trigger('bind-payoff');
            });
            $('input.middle-delegate').on('click', function () {
                console.log('middle trigger delegate-payoff---------------------------');
                jmiddle.trigger('delegate-payoff');
            });
        }
        /**
         * 关闭bindType和delegateType,测试各个钩子
         * 注意: 在监听时(调用on方法), 配置data参数, 应仔细核对. 原因见下面试验结果
         */
        function testExtEvent2() {
            const jouter = $('div.ext-event');
            const jmiddle = $('div.middle');
            $('input.start').on('click', function () {
                function hualongHandler(evt, data) {
                    console.log('[jouter on payoff.hualong.wenshan.yunnan self ] middle receive: ', evt, data);
                    //这两句均会阻止调用 _default hook
                    //evt.preventDefault();	
                    //return false;
                }
                //jouter的三次监听,虽然最后一个是代理其他元素, 仍然只调用一次setup hook
                jouter.on('payoff.hualong.wenshan.yunnan', {
                    amount: 8008,
                    desc: 'salary',
                }, hualongHandler);
                jouter.on('payoff.ppt', {
                    x: 1010,
                    y: 'here',
                }, (evt, data) => {
                    console.log('[jouter on payoff.ppt self ] middle receive: ', evt, data);
                });
                jouter.on('payoff.yunxi', 'div.middle', {
                    amount: 3000,
                    desc: 'apply'
                }, (evt, data) => {
                    console.log('[outer delegate for middle on payoff] middle receive: ', evt, data);
                    //			evt.preventDefault();
                });
                //jmiddle的监听,引发setup hook, 与jouter的监听没有关系
                //注意下面data按理说应属于middle元素而与上无关,
                //但是实测是:不论由谁trigger,只要能收到通知,得到的jquery.Event.data与此无关
                //即使放在最前面on也如此. 要使该data起作用, 需要使用事件命名空间
                jmiddle.on('payoff.my-ns', {
                    a: 1,
                    b: 2,
                }, function (evt, data) {
                    console.log('[jmiddle on payoff self] middle receive: ', evt, data);
                });
            });
            $('input.trigger').on('click', function () {
                console.clear();
                // $(this).trigger('payoff.my-ns', {
                // 	here: 'for middle'
                // });
                // $(this).trigger('payoff', {
                // 	sit: 'for outer'
                // });
                //triggerHandler激发的事件,自能有激发者自身响应
                //$(this).triggerHandler('payoff'); //jouter jmiddle均监听不到
                jmiddle.triggerHandler('payoff'); //仅jmiddle监听到
                //jouter.triggerHandler('payoff');  //仅jouter监听到
            });
            $('input.stop').on('click', () => {
                console.clear();
                //jmiddle.off('payoff');
                //jmiddle.off('payoff');	//重复调用hook被忽略
                jouter.off('payoff');
                //jouter.off('payoff');		//重复调用hook被忽略
            });
        }
        /**
         * 本章练习,针对 extensionEvenAccordingToBook 的配置
         * 1.用户单击照片时,为包含照片的<div class='photo'/>添加或删除selected类.
         * 2.添加一个名为pageLoaded的自定义事件,在新一组照片加载完成后触发
         * 3.使用nextPage和pageLoaded处理程序,仅在加载新页面的过程中,在页面底部显示一条正在加载的消息
         * 4.为照片绑定mousemove处理程序,记录鼠标的当前位置
         * 5.改进4,使其每秒钟最多记录5次位置信息
         * 6.创建一个名为tripleclick的特殊事件,单鼠标在500毫秒内单击3次的情况下触发.
         * 7.创建名为mousemovehalt的特殊事件,在鼠标移动后停止触发.
         */
        function chapterExercise() {
            //1.
            $('div#gallery').on('mousedown mouseup', 'div.photo', function (evt) {
                //$(this).toggleClass('selected');
                if (evt.type == 'mousedown') {
                    $(this).addClass('selected');
                }
                else {
                    $(this).removeClass('selected');
                }
            });
            //2
            $(window).on('pageNext', (evt, pageIndex) => {
                console.log(`page ${pageIndex} loaded successfully!`);
            });
            //3.应放在起始位置最佳
            $('div#loadingMsg')
                .ajaxStart(function () {
                $(this).show();
            }).ajaxStop(function () {
                $(this).hide();
            });
            //4. 5.
            (() => {
                function printMouseLocation(ele, evt) {
                    const loc = Guoshi.Html.relLocFrom(ele, evt);
                    console.log(`mouse x:${loc.left},y:${loc.top}`);
                }
                //4. 普通方法, 非节流
                // $('div#gallery').on('mousemove', 'div.photo', function (evt) {
                // 	printMouseLocation(this, evt);
                // });
                //5-1:节流1
                // let mousemove_timer = 0;
                // $('div#gallery').on('mousemove', 'div.photo', function (evt) {
                // 	if (!mousemove_timer) {
                // 		mousemove_timer = setTimeout(() => {
                // 			printMouseLocation(this, evt);//this需要穿透查找
                // 			mousemove_timer = 0;
                // 		}, 250);
                // 	}
                // });
                //5-2:节流2
                // (() => {
                // 	let ele: HTMLElement | undefined;
                // 	let e: JQuery.MouseMoveEvent | undefined;
                // 	$('div#gallery').on('mousemove', 'div.photo', function (evt) {
                // 		ele = this;
                // 		e = evt;
                // 	});
                // 	setInterval(() => {
                // 		if (ele && e) {
                // 			printMouseLocation(ele, e);
                // 			ele = undefined;
                // 			e = undefined;
                // 		}
                // 	}, 350);
                // })();
                //5-3 由于涉及到动态添加图片, 扩展事件实现节流条件是setup内trigger事件由
                // 元素自身或者其子元素触发, 父级触发的实现会很复杂. 故放弃
            })();
            //6-1.三击切换显隐, 使用超时器方案
            $('div.header').on('tripleclick1', function () {
                $('div#gallery').toggle();
            });
            //6-2.三击切换显隐, 使用定时器方案
            $('div.header').on('tripleclick2', function () {
                $('div#gallery').toggle();
            });
            //卸载上述两个监听
            $('h1.caption').on('click', () => {
                $('div.header').off("tripleclick2 tripleclick1");
            });
            let halt_times = 0;
            //7.点击footer启动.gallery的图片div监听鼠标移动停顿
            $('div.footer').one('click', () => {
                $('div#gallery').one('mousemovehalt', 
                // {
                // //	delay: 1500,
                // },
                evt => {
                    console.log('mousemove halt:', ++halt_times);
                });
            });
        }
    }
});
//# sourceMappingURL=10-adv-event.js.map