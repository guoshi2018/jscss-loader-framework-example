"use strict";
// $(document).ready(function() {
//   $('span:contains(language)').addClass('emphasized');
// });
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
(() => {
    const __DEBUG__ = false;
    //#region 
    /**
     * 入口方法，由jscss-loader.js调用
     * */
    (async () => {
        const loader = JscssLoader.getInstance();
        //当necessary.js加载完毕, 且其包含的库文件可用, 方可运行.
        //所以下面的函数,实际上由necessary.js内部调用
        loader.next = async (info) => {
            __DEBUG__ && console.log(info);
            await main(resourcesOfCurrentPage);
        };
        //加载ncessary.js文件，该文件内部负责加载常规依赖，例如jquery,bootstrap,site.css等
        const resp_necc = await loader.loadResource({
            filepath: '/lib/script/json/global.json',
            debug: __DEBUG__,
        });
        __DEBUG__ && console.log(resp_necc);
        /**
         * 加载本页面依赖的js css文件
         * */
        async function resourcesOfCurrentPage(filepaths) {
            let results = await loader.loadResources(filepaths, __DEBUG__);
            __DEBUG__ && console.log('page-js-model.js load resources :', results);
        }
    })();
    //#endregion
    //#region 
    /**
     * 业务逻辑主方法
     * */
    async function main(callback) {
        //1、在此添加包含的js css文件全路径,
        //必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
        await callback([
            //    '<filefullpath>',
            '/lib/style/css/2-jquery4/default.css',
            '/lib/style/css/2-jquery4/1-intro.css',
        ]);
        //2、to do 
        //example:
        $('span:contains(language)').addClass('emphasized');
        $('div.poem-stanza').addClass('highlight');
    }
    ;
    //#endregion
})();
//# sourceMappingURL=1-intro%20copy.js.map