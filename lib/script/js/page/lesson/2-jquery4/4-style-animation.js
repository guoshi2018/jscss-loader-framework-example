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
            '/lib/style/css/2-jquery4/4-style-animation.css',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //to do
        configSwitcherButtons();
        configReadmore();
        configMockButtons();
        /**
         * 字体大小按钮配置
         */
        function configSwitcherButtons() {
            const jspeech = $('div.speech');
            const jspanCurSize = $('span#curSize');
            const defaultFontSize = parseFloat(jspeech.css('font-size'));
            jspanCurSize.text(defaultFontSize.toFixed(2) + 'px');
            $('#switcher button').click(function () {
                let num = parseFloat(jspeech.css('font-size')); //fontSize ok too.
                const flag = this.id.split('-')[1];
                switch (flag) {
                    case 'large':
                        num += 0.1; // num *= 1.4 幅度太大
                        break;
                    case 'small':
                        num -= 0.1; // num /= 1.4 也是
                        break;
                    case 'default':
                        num = defaultFontSize;
                        break;
                    default:
                        break;
                }
                jspeech.css('fontSize', num + 'px');
                jspanCurSize.text(num.toFixed(2) + 'px');
            });
        }
        function configReadmore() {
            const jp1 = $('p').eq(1).hide();
            $('a.more').click((evt) => {
                evt.preventDefault();
                //	jp1.toggle('slow'); //show and hide
                //jp1.toggle(1000);
                //jp1.fadeToggle(1000);		//fadeIn and fadeOut
                jp1.slideToggle(1000); //slideUp and slideDown
            });
        }
        /**
         * 配置试验按钮, 以测试anmate方法
         */
        function configMockButtons() {
            //<input type="button" id="mock-slideToggle" value="使用anmiate方法实现slideToggle的效果" />
            $('#mock-slideToggle').click((evt) => {
                const jp1 = $('p').eq(1);
                jp1.animate({
                    height: 'toggle',
                    margin: 'toggle',
                    padding: 'toggle',
                    opacity: 'toggle',
                }, 3000);
            });
            //<input type="button" id="anim-switcher-box" value="为字体切换面板增加动画"/>
            $('#anim-switcher-box').click((evt) => {
                const pw = $('div.speech p').outerWidth();
                const jsw = $('div#switcher');
                const sww = jsw.outerWidth();
                jsw.css('position', 'relative'); //ok
                //		jsw.css('background-color', 'red');
                jsw.animate({
                    borderWidth: '5px',
                    left: pw - sww,
                    height: '+=20px',
                    //	'background-color': 'red', //无效
                }, 'slow');
                //jsw.css('position', 'relative'); //这里也ok
                //or
                // jsw.animate({
                // 	'border-width': '+=1px',
                // 	left: '+=10px',
                // 	height: '+=20px',
                // 	width: '+=10px',
                // 	//maxHeight: '100px', //应该在css文件中预设好
                // }, 'slow');
            });
            //<input type="button" id="anim-queue-switcher-box" value="字体切换面板动画队列"/>
            //将三个动画使用animate方法各自分开调用,即可实现対列
            $('#anim-queue-switcher-box').click((evt) => {
                const pw = $('div.speech p').outerWidth();
                const jsw = $('div#switcher');
                const sww = jsw.outerWidth();
                jsw.css('position', 'relative')
                    .fadeTo('fast', 0.5)
                    .animate({
                    left: pw - sww,
                }, 2000)
                    .fadeTo('fast', 1.0)
                    .animate({
                    height: '+=20px',
                }, 'slow')
                    .slideUp('slow')
                    .slideDown('slow')
                    .animate({
                    borderWidth: '5px'
                }, 'slow');
            });
            //<input value="使用queue属性,将分部进行改为同时进行;使用queue方法或animate的回调函数,使非效果方法定时进行"/>
            $('#anim-opacity-move-at-the-same-time').click((evt) => {
                const pw = $('div.speech p').outerWidth();
                const jsw = $('div#switcher');
                const sww = jsw.outerWidth();
                jsw.css('position', 'relative')
                    .fadeTo(6500, 0.5)
                    .animate({
                    left: pw - sww,
                }, {
                    duration: 4000,
                    queue: false, //为false表示与上一动画同时开始
                })
                    .fadeTo(3000, 1.0)
                    .animate({
                    height: '+=20px',
                }, {
                    duration: 5000,
                    queue: false,
                })
                    .slideUp('slow')
                    .queue((next) => {
                    jsw.css('background-color', 'blue');
                    next(); //无此方法调用,后续animate将被忽略
                })
                    .slideDown('slow')
                    .animate({
                    borderWidth: '10px'
                }, {
                    duration: 5000,
                    complete: () => {
                        jsw.css('background-color', 'red');
                    },
                });
            });
            //<input type="button" id="mult-ele-anim" value="多元素的动画默认效果同时进行"/>
            $('#mult-ele-anim').click((evt) => {
                $('p').eq(2).css('border', '1px solid #333')
                    .one('click', (evt) => {
                    $(evt.target).slideUp(5000)
                        .next().slideDown(3000);
                });
                $('p').eq(3).css('background-color', '#ccc').hide();
            });
            //<input value="利用回调函数实现多元素的动画效果依次进行"/> 
            $('#mult-ele-anim-step').click((evt) => {
                const jclickedItem = $('p').eq(2).css('border', '1px solid #333')
                    .one('click', function (evt) {
                    $(evt.target).next().slideDown(3000, function () {
                        //$(this).slideUp(4000); //现在的this还是指向eq(3)
                        //$(this).prev().slideUp(4000); //ok ,
                        jclickedItem.slideUp(4000); //ok too ,but 太低档,
                    });
                    //还可采用箭头函数
                    // $(evt.target).next().slideDown(3000, () => {
                    // 	$(this).slideUp(4000); //现在的this指向eq(3)
                    // });
                });
                $('p').eq(3).css('background-color', '#ccc').hide();
            });
            //<input "利用queue实现多元素动画效果依次进行"/>
            $('#mult-ele-by-queue').click((evt) => {
                $('p').eq(2).css('border', '1px solid #333')
                    .one('click', function (evt) {
                    $(evt.target).next().slideDown(3000)
                        .queue(() => {
                        $(evt.target).slideUp(4000);
                    });
                });
                $('p').eq(3).css('background-color', '#ccc').hide();
            });
        }
    }
});
//# sourceMappingURL=4-style-animation.js.map