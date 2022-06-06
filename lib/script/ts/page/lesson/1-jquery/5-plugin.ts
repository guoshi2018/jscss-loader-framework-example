

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
* 调试完毕，可考虑将 __DEBUG__ 设为 false，以关闭加载的调试信息
* *******************************************************************************************************/



JscssLoader.getInstance().startEntry({

    //globalRes: 默认包含必要脚本的文件 '/lib/script/json/global.json',一般不用修改

    //是否启用调试
    debug: true, //默认false

    //1. 在此添加本入口文件需要包含的js css文件全路径,默认[]
    //必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
    privateRes: [
        [
            '/lib/style/css/2-jquery4/default.css',
            '/lib/style/css/2-jquery4/1-intro.css',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //2. to do
        simple_plugin_demo();
        /**
         * 简单插件示例
         */
        function simple_plugin_demo() {
            (function ($) {
                //@ts-ignore
                $.fn.redFrontColor = function () {
                    return this.css('color', 'red');
                }
            })(jQuery);

            $('.perform button:eq(0)').click(function () {
                //@ts-ignore
                $('.simple_plugin_demo *').redFrontColor().css('background-color', 'yellow');
            });

        }
    }
});




/**
 * 测试模板
 */
function simpleResult() {
    //方法说明:
    [
        '',
        (() => {

            return [];
        })(),

    ]
        .forEach((v, i) => {
            console.log(v);
        });
}



