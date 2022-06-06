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
    //是否启用调试
    debug: true,
    //在此添加本入口文件需要包含的js css文件全路径,默认[]
    //页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
    //必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
    privateRes: [
        [
            '/lib/style/css/2-jquery4/default.css',
            '/lib/style/css/2-jquery4/3-event.css',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        enfeoffJQuery();
        configButtons1();
        //configButtons2();
        //configButtons3();
        configPanelShowOrHidden();
        configPanelTitleBackgroundColor();
        //$('div#switcher').click();    //模拟单击,于是隐藏面板
        //or
        $('div#switcher').trigger('click');
        preventGuitar();
        configKey();
        /**
         * 配置点击按钮id="enfeoff-jq"时, 让渡$符号的使用权
         */
        function enfeoffJQuery() {
            $('#enfeoff-jq').click(() => {
                console.log('让渡前,$和jQuery分别是:', $, jQuery);
                jQuery.noConflict();
                console.log('让渡后,$和jQuery分别是:', $, jQuery);
                console.log('也可以自定义类似于$的符号,变量, 现命名为jqc');
                const jqc = jQuery.noConflict();
                console.log($, jQuery, jqc);
            });
        }
        /**
         * 按钮处理
         */
        function configButtons1() {
            $('#switcher-default').addClass('selected');
            $('#switcher .button').click(function (event) {
                $('body').removeClass();
                if (this.id == 'switcher-narrow') {
                    $('body').addClass('narrow');
                }
                else if (this.id == 'switcher-large') {
                    $('body').addClass('large');
                }
                $('#switcher .button').removeClass('selected');
                $(this).addClass('selected');
                event.stopPropagation();
            });
        }
        /**
         * 进一步优化配置按钮处理
         */
        function configButtons2() {
            $('#switcher-default').addClass('selected');
            $('#switcher .button').click(function (evt) {
                const bodyClass = this.id.split('-')[1];
                $('body').removeClass().addClass(bodyClass);
                $('#switcher .button').removeClass('selected');
                $(this).addClass('selected');
                // evt.stopImmediatePropagation();
                evt.stopPropagation();
            });
        }
        /**
         * 使用基于事件冒泡的事件委托, 让父元素代理子元素, 处理各子按钮的点击事件
         */
        function configButtons3() {
            $('#switcher').click(function (evt) {
                if ($(evt.target).is('.button')) { //真正被点击的是按钮吗?
                    const bodyClass = evt.target.id.split('-')[1];
                    $('body').removeClass().addClass(bodyClass);
                    $('#switcher .button').removeClass('selected');
                    $(evt.target).addClass('selected');
                    //   evt.stopPropagation(); //在此阻止的是按钮容器的上级接收事件了.所以无效
                }
            });
        }
        /**
         * 配置转换器面板方式1,使之点击导致三按钮的显隐
         */
        function configPanelShowOrHidden() {
            $('#switcher').click(function (evt) {
                //  $('.button', this).toggleClass('hidden');
                if (!$(evt.target).is('.button')) {
                    $('.button', this).slideToggle().fadeToggle;
                }
            });
        }
        /**
         * 配置转换器面板方式2,hover h3,改变h3背景色
         */
        function configPanelTitleBackgroundColor() {
            // $('#switcher h3').hover(function () { //不过这个方法被废弃了,目前
            //   $(this).addClass('hover');
            // }, function () {
            //   $(this).removeClass('hover');
            // });
            //or:
            // $('#switcher h3').mouseenter(function () {
            //   $(this).addClass('hover');
            // }).mouseleave(function () {
            //   $(this).removeClass('hover');
            // });
            //or:
            $('#switcher h3').on('mouseenter mouseleave', function () {
                $(this).toggleClass('hover');
            });
        }
        /**
         * 默认操作的阻止
         */
        function preventGuitar() {
            $('a#guitar').click(function (evt) {
                const anc = evt.target;
                const result = prompt(`go to ${anc.href}?`);
                if (result == null) {
                    evt.preventDefault();
                    //return false;  == evt.preventDefault() + evt.stopPropagation()
                }
            });
        }
        const classes = {
            D: 'default',
            N: 'narrow',
            L: 'large',
        };
        /**
         * 处理按键事件,一般而言:
         * keyup/keydown: 按了哪个键
         * kepress: 输入了什么字符
         */
        function configKey() {
            $(document).keyup((evt) => {
                const key = String.fromCharCode(evt.keyCode);
                if (key in classes) {
                    //@ts-ignore
                    $('body').removeClass().addClass(classes[key]);
                    $('#switcher .button').removeClass('selected');
                    //@ts-ignore
                    $('#switcher-' + classes[key]).addClass('selected');
                    // evt.stopImmediatePropagation();
                    evt.stopPropagation();
                }
            });
        }
    }
});
// $(document).ready(function() {
//   $('#switcher .button').hover(function() {
//     $(this).addClass('hover');
//   }, function() {
//     $(this).removeClass('hover');
//   });
// });
// $(document).ready(function() {
//   var toggleStyleSwitcher = function() {
//     $('#switcher .button').toggleClass('hidden');
//   };
//   $('#switcher').click(toggleStyleSwitcher);
//   $('#switcher-normal').click(function() {
//     $('#switcher').click(toggleStyleSwitcher);
//   });
//   $('#switcher-narrow, #switcher-large').click(function() {
//     $('#switcher').unbind('click', toggleStyleSwitcher);
//   });
// });
// $(document).ready(function() {
//   $('#switcher').click();
// });
//# sourceMappingURL=3-event.js.map