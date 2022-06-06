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
            //切换主题,注意最后一个按钮
            //'/lib/style/css/ui-themes/le-frog/jquery-ui-1.10.0.custom.css',
            //'/lib/style/css/ui-themes/smoothness/jquery-ui-1.10.0.custom.css',
            //'/lib/style/css/ui-themes/sunny/jquery-ui.min.css',
            //'/lib/style/css/ui-themes/humanity/jquery-ui.min.css',
            '/lib/style/css/ui-themes/trontastic/jquery-ui.min.css',
            '/lib/script/ts/indoor-lib/widget/guoshi-simpleTooltip.css',
            '/lib/style/css/2-jquery4/default.css',
            '/lib/style/css/2-jquery4/8-dev-plugin.css',
        ], [
            '/lib/external-core/jquery-ui-1.13.1.custom/jquery-ui.min.js',
        ], [
            '/lib/script/js/indoor-lib/widget/guoshi-simpleTooltip.js',
            '/lib/script/js/indoor-lib/function/jq-static/math.js',
            '/lib/script/js/indoor-lib/function/jq-instance/example.js',
            '/lib/script/js/indoor-lib/function/guoshi/guoshi.js',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //to do
        Guoshi.Html.clickBlankToRefreshDocment();
        //test();
        //fillData(1);
        //fillData3();
        //fillData4();
        //simpleInstanceMethod();
        //configPluginTestingButton();
        configWidgetTestButton();
        //i 表示使用第一种方法还是第二种方法
        function fillData(i) {
            const jtbody = $('table#inventory tbody');
            //产品总数
            const quantity = $('td:nth-child(2)', jtbody)
                .map((idx, ele) => {
                return $(ele).text();
            }).get(); //等价于 toArray()
            $('tr#sum td:nth-child(2)').text(eval(`$.gx_sum${i}`)(quantity).toFixed(2));
            $('tr#average td:nth-child(2)').text(eval(`$.gx_avg${i}`)(quantity).toFixed(2));
        }
        //第三种方法,尽量减少$命名空间的污染
        function fillData3() {
            const jtbody = $('table#inventory tbody');
            //产品总数
            const quantity = $('td:nth-child(2)', jtbody)
                .map((idx, ele) => {
                return $(ele).text();
            }).get(); //等价于 toArray()
            $('tr#sum td:nth-child(2)').text($.gx_math.sum(quantity).toFixed(2));
            $('tr#average td:nth-child(2)').text($.gx_math.avg(quantity).toFixed(2));
        }
        //第四种方法, 彻底不用$, 另立山头 guoshi:Bclz_gxy
        function fillData4() {
            const jtbody = $('table#inventory tbody');
            //产品总数
            const quantity = $('td:nth-child(2)', jtbody)
                .map((idx, ele) => {
                return $(ele).text();
            }).get(); //等价于 toArray()
            $('tr#sum td:nth-child(2)').text(Guoshi.Math.sum(quantity).toFixed(2));
            $('tr#average td:nth-child(2)').text(Guoshi.Math.avg(quantity).toFixed(2));
        }
        function simpleInstanceMethod() {
            $('no-such-ele').exam1().exam2('hey');
        }
        function configPluginTestingButton() {
            const jplugin = $('table,h1', '#plugin');
            $('input[type="button"].err').click(() => {
                $('tr').swapClass1('one', 'two');
            });
            $('input[type="button"].suc').click(() => {
                $('tr').swapClass2('one', 'two');
            });
            $('input[type="button"].shadow1').click(() => {
                jplugin.shadow1();
            });
            $('input[type="button"].shadow2').click(() => {
                jplugin.shadow2({
                    copies: 8,
                    opacity: 0.24,
                });
            });
            $('input[type="button"].shadow3').click(() => {
                //使用默认
                //$('table,h1').shadow3()
                //逐个修改默认选项的属性
                // $.fn.shadow3.defaults.copies = 8;
                // $.fn.shadow3.defaults.copyOffset = index => {
                // 	return {
                // 		left: index * 1.3,
                // 		top: index * (-0.9),
                // 	};
                // };
                // $.fn.shadow3.defaults.opacity = 0.3;
                // jplugin.shadow3();
                //一次修改完
                // $.fn.shadow3.defaults = {
                // 	copies: 10,
                // 	opacity: 0.4,
                // 	copyOffset: index => {
                // 		return {
                // 			left: index * (-0.9),
                // 			top: index * 0.6,
                // 		};
                // 	}
                // };
                // jplugin.shadow3();
                //调用时设置个别行为,而不是全局默认
                jplugin.shadow3({
                    copies: 15,
                });
            }).button(); //这个button外观会稍有不同
        }
        function configWidgetTestButton() {
            const jlink = $('a', 'table tbody tr td');
            //创建
            $('input[type="button"].create', 'div.container#widget').click(() => {
                //无参创建,采用默认
                //jlink.simpleTooltip();
                //同上
                //jlink.simpleTooltip({});
                //也可以只设置一部分
                jlink.simpleTooltip({
                    disabled: true,
                    location: {
                        left: 30,
                        top: 10,
                    },
                    content: function () {
                        //return $(this).data('tooltip-text');
                        return `${$(this).data('ttt')},${$(this).text()}`;
                    },
                });
            });
            //启用
            $('input[type="button"].enable', 'div.container#widget').click(() => {
                jlink.simpleTooltip('enable');
            });
            //禁用
            $('input[type="button"].disable', 'div.container#widget').click(() => {
                jlink.simpleTooltip('disable');
            });
            //打开
            $('input[type="button"].open', 'div.container#widget').click(() => {
                jlink.simpleTooltip('open');
            });
            //关闭
            $('input[type="button"].close-tip', 'div.container#widget').click(() => {
                jlink.simpleTooltip('close');
            });
            //方法连缀
            $('input[type="button"].cluster', 'div.container#widget').click(() => {
                jlink.simpleTooltip('test1').simpleTooltip('test2').simpleTooltip('test1');
            });
            //销毁
            $('input[type="button"].destroy', 'div.container#widget').click(() => {
                //console.log('current alive:', jlink.simpleTooltip('alive'));
                jlink.simpleTooltip('destroy');
            });
            $('h2.disabled').click(evt => {
                let result;
                try {
                    result = jlink.simpleTooltip('disabled');
                }
                catch (err) {
                    result = '未创建';
                }
                $('span', $(evt.target)).text(result);
            });
            //监听jlink事件:(还是收不到,换成guoshi.simpleTooltipopen,open也一样)
            jlink.on('simpleTooltipopen', () => {
                console.log('receive tooltipopen event');
            });
        }
        function test() {
            console.log('this two are all jquery version: ', $.fn.jquery, $('table').jquery);
        }
    }
});
//# sourceMappingURL=8-dev-plugin.js.map