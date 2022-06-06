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
            '/lib/style/css/2-jquery4/9-adv-selector.css',
        ], [
            '/lib/script/js/indoor-lib/function/jq-selector/group-selector.js',
            '/lib/script/js/indoor-lib/function/jq-instance/cellsByColumn.js'
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //to do
        //testCustomGroupSelector(-2); //已废弃
        //showJqueryObjectProperties(); 
        addStripForRow();
        configHyperlink();
        testDomElementStack();
        /**
         * 为各个tbody内的偶数行添加条纹
         */
        function addStripForRow() {
            //书上原版, 隔行添加条纹 没有考虑更换topic后的呈现
            //$('#news').find('tr:nth-child(even)').addClass('alt');
            //等效于
            //$('#news tr:nth-child(even)').addClass('alt');
            //书上原版, 隔两行添加条纹, 但不是在每个tbody小范围内.
            // $('#news tr').filter((idx, ele) => {
            // 	return idx % 4 < 2;
            // }).addClass('alt');
            //书上原版, 交替效果已经在每个tbody内进行, 且跳过标题行th.但仍然不兼容其他topic
            // $('#news tbody').each(function () {
            // 	$(this).children().has('td').filter(idx => {
            // 		return idx % 4 < 2;
            // 	}).addClass('alt');
            // });
            //书上原版, 考虑topic筛选, 同时 
            //选择符:visible 比后面的 $(this).css('display') == 'none' 优雅
            // $('#news tbody').find('tr.alt').removeClass('alt');
            // $('#news tbody').each(function () {
            // 	$(this).children(':visible').has('td').filter(function (idx) {
            // 		return idx % 4 < 2;
            // 	}).addClass('alt');
            // });
            //如果考虑topic更换, 使用如下. 达到隔两行的效果, 需要将filter(":odd")
            //根据上述修改
            //注意, 下面的
            //		$('tr:not(:nth-child(1))', this) 等同于上面的
            //		$(this).children().has('td')
            //因为,标题行不包含 td ,而是 th
            //$('#news tbody').find('tr.alt').removeClass('alt');
            // $('#news tbody').each(function () {
            // 	$('tr:not(:nth-child(1))', this).not(function () {
            // 		return $(this).css('display') == 'none';
            // 	}).filter(":odd").addClass('alt');
            // });
            //采用 :visible 和 $(this).children().has('td') 加工上面
            $('#news tbody').find('tr.alt').removeClass('alt');
            $('#news tbody').each(function () {
                $(this).children(':visible:has(td):odd').addClass('alt');
            });
            //#region 存在问题
            //采用自定义的gourp选择符代替:odd
            //缺点, 对于同一个jquery语句,即使matches数组不变, 因而删除存储的序号一直递增,
            //导致不能重复使用, 故暂时废弃
            // $('#news tbody').find('tr.alt').removeClass('alt');
            // $('#news tbody').each(function () {
            // 	$(this).children(':visible:has(td):group(1)').addClass('alt');
            // });
            //貌似简单, 但在topic切换时效果不对, 估计和:odd :even选择符被启用有关
            //$('#news tbody').find('tr.alt').removeClass('alt');
            //$('#news tbody tr:visible:has(td):odd').addClass('alt');
            //$('#news tbody tr:visible:has(td):nth-child(even)').addClass('alt');
            //对应于 :visible 选择符, 还有 :hidden
            //console.log('隐藏的tr数量:', $('#news tbody tr:hidden').length);
            //#endregion
        }
        /**
         * 配置超级链接的点击响应:
         * 1. 阻止打开新页面的默认行为,
         * 2. 标识当前选择的链接, 使用css类
         * 3. 以选中为主题, 筛选相关行, 隐藏其他行
         * 4. 将空tbody(即只包含标题, 具体条目已被隐藏)隐藏
         * 5. 添加条纹效果
         */
        function configHyperlink() {
            const jlink = $('#topics a').click(function (evt) {
                //prepare:
                const jele = $(this);
                const topic = jele.text();
                $('#news tr').show();
                evt.preventDefault(); // 1
                jele.siblings('a.selected').removeClass('selected'); //2
                jele.addClass('selected');
                if (topic != 'All') { //3
                    //有瑕疵: 其他列如果包含topic,改行也会显示
                    //	$(`#news tr:has(td):not(:contains("${topic}"))`).hide(); 
                    // $('#news').find('tr:has(td)').not(function () { //书上原版
                    // 	return $(this).children(':nth-child(4)').text() == topic;
                    // }).hide();
                    // $('#news tr td:nth-child(4)').not(function () {	//ok
                    // 	return $(this).text() == topic;
                    // }).parent('tr').hide();
                    $('#news tr td:nth-child(4)').filter(function () {
                        return $(this).text() != topic;
                    }).parent('tr').hide();
                    // $('#news tr td:nth-child(4)').each(function () {	//ok,但效率不高
                    // 	if ($(this).text() != topic) {
                    // 		$(this).parent('tr').hide();
                    // 	}
                    // });
                    // $('tbody tr:nth-child(1)').not(function () {	// 4
                    // 	let found_visible = false;
                    // 	$(this).siblings('tr').each(function () {
                    // 		if ($(this).css('display') != "none") {
                    // 			found_visible = true;
                    // 			return false;	//相当于break 结束循环; return false,相当于continue 
                    // 		}
                    // 	})
                    // 	return found_visible;
                    // }).hide();
                    //进一步使用:visible 选择符简化:
                    $('tbody tr:nth-child(1)').not(function () {
                        return $(this).siblings('tr:visible').length > 0;
                    }).hide();
                }
                addStripForRow(); //5
            });
        }
        /**
         * jQuery对象属性 测试.
         * 结论:jQuery3以上, 已经废弃context selector,只保留 prevObject属性
         */
        function showJqueryObjectProperties() {
            const jele1 = $('#release'); //prevObject == undefined
            const jele2 = $('#release', '#topics'); //prevOjbect == $('div#topics'),虽然两者无关
            const jele3 = jele1.nextAll();
            threeProp(jele1, 'jele1');
            threeProp(jele2, 'jele2');
            threeProp(jele3, 'jele3');
            function threeProp(jq, name) {
                console.log(`${name} length:${jq.length}, props:`, {
                    context: jq.context, selector: jq.selector, prevObject: jq.prevObject,
                });
                if (jq.prevObject) {
                    console.log(`prevObject html of ${name}:${jq.prevObject.html()}`);
                }
            }
        }
        /**
         * 测试自定义选择符 :group(num) ,其中 num可为正负数
         * 注意, 自定义选择符, 由于index始终为0, 导致该选择符创建失败. 不知何故
         * 解决方案: 采用matches数组的某个闲置元素(比如索引10)存储递增的被检测的HTMLElement元素序号
         * 见 group-selector.ts
         * @param num为正数时, 开始(几)被选择, 然后隔(几)行选择,
         * 		num为负数时, 则相反
         * @deprecated 缺点, 对于同一个jquery语句, 即使matches数组不变,
         * 		因而删除存储的序号一直递增, 导致不能重复使用
         */
        function testCustomGroupSelector(num) {
            $('#news tr').filter(`:group(${num})`).addClass('alt');
        }
        function testDomElementStack() {
            const jrel = $('#release');
            console.log('是否相等:', $('#release').nextAll().prevObject === jrel, // false,因为源头是重塑的
            jrel.nextAll().prevObject === jrel // true
            );
            //jrel.nextAll().addClass('highlight');			// 1. jrel 后两个td高亮
            //jrel.nextAll().end().addClass('highlight');	//2. jrel 高亮
            //jrel.nextAll().addBack().addClass('highlight'); // 1 + 2 高亮
            const jnext = jrel.nextAll();
            console.log(jnext.prevObject === jrel.nextAll().end(), //false
            jnext.prevObject === jnext.end(), //true
            jnext.addBack().prevObject === jnext);
            $('#news td').click(function () {
                $('#news td.active').removeClass('active');
                const jcells = $(this).cellsByColumn();
                console.log(jcells.prevObject.text(), jcells.length); //查看栈是否正确
                jcells.addClass('active');
            });
        }
    }
});
//# sourceMappingURL=9-adv-selector.js.map