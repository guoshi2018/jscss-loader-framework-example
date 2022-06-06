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
            '/lib/style/css/2-jquery4/12-adv-dom-oper.css',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //to do
        //example:
        //#region const for table t-1
        /**
         * 临时存贮在各行的data-属性里的排序关键字的名称, 值随当前选择的排序列变化而变化
         * 同时,也是html文件中,用以标识author列中,姓的span的css类标识
         */
        const Sort_Key = 'sort-key';
        /**
         * 持久存在于各行的data-属性里的, 由所有可能使用的排序列名称作为其属性名的
         * 对象, 各个属性的值在选择排序前已经配置好
         */
        const Sort_Key_Object = 'sort-key-object';
        const Sort_Key_Array = 'sort-key-array';
        /**
         * 存储在各个header的data-属性的名称
         */
        const Key_Type = 'key-type';
        //key的获取分支对象
        //有意是的方法名称与表示类的后半部分相同, 可免去条件判断语句
        //但也增加了其耦合度
        const SortKeyMethods = {
            /**
             * 纯粹字符串比较, 按照字母顺序, 兼容姓氏优先, 然后全体字符串
             * @param jele 包含比较字符串的html元素的对应jquery对象
             * @returns 用于比较的关键字
             */
            alpha: jele => {
                let key = jele.find(`span.${Sort_Key}`).text();
                const sep = key == '' ? '' : ' ';
                key += sep + jele.text();
                return key.toUpperCase();
            },
            /**
             * 数值字符串比较, 先转换成相应数值, 并以此值为比较关键字
             * @param jele 包含比较数值字符串的html元素的对应jquery对象
             * @returns 比较关键字, 如转换失败, 值为0
             */
            numeric: jele => {
                const num = jele.text().replace(/^[^\d.]*/, '');
                let key = parseFloat(num);
                if (isNaN(key)) {
                    key = 0;
                }
                return key;
            },
            /**
             * 日期字符串比较. 转换为时间戳,作为比较用的关键字
             * @param jele 包含比较日期字符串的html元素的对应jquery对象
             * @returns 由于本例的日期不包含日, 所以指定为当月1号
             */
            date: jele => {
                const key = Date.parse('1 ' + jele.text());
                return key;
            }
        };
        //#endregion
        //configTableOneSortable1();
        //configTableOneSortable2();
        //configTableOneSortable3();
        //configTableOneSortable4();
        //configTableOneSortable5();
        //configTableOneSortableByMyself1();
        //configTableOneSortableByMyself2();
        //configTableTwoSortable();
        //configTableThreeSortable();
        createElementTersely();
        //#region table t-1
        /**
         * 配置table的header,使之可以点击完成排序
         * 问题:
         * 1. data和price也是按字母, 而不是真正日期, 金额排序
         * 2. 只有升序, 无降序
         * 3. 性能差
         */
        function configTableOneSortable1() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders.wrapInner('<a href="#"/>').addClass('sort'); // th
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const column = $(this).index();
                const rows = jtable.find('tbody > tr').get();
                rows.sort((a, b) => {
                    let keyA = $(a).children('td').eq(column).text();
                    keyA = keyA.trim().toUpperCase();
                    let keyB = $(b).children('td').eq(column).text();
                    keyB = keyB.trim().toUpperCase();
                    return keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                });
                rows.forEach(row => {
                    jtable.children('tbody').append(row);
                });
            });
            //#endregion
        }
        /**
         * 采用预先计算要比较的关键字, 改进1,为2
         * 解决性能差的问题: 将要比较的信息预先存储为data-属性
         * 这样得到的data-sort-key属性值,因点击不同的链接而不同
         * 但该值是在sort方法外进行,所以效率必然比1有所提升
         */
        function configTableOneSortable2() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders.wrapInner('<a href="#"/>').addClass('sort'); // th
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const column = $(this).index();
                const rows = jtable.find('tbody > tr').each(function () {
                    const key = $(this).children('td').eq(column).text();
                    $(this).data(Sort_Key, key.trim().toUpperCase());
                }).get();
                rows.sort((a, b) => {
                    let keyA = $(a).data(Sort_Key);
                    let keyB = $(b).data(Sort_Key);
                    return keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                });
                rows.forEach(row => {
                    jtable.children('tbody').append(row);
                });
            });
            //#endregion
        }
        /**
         * 2基础上,考虑:
         * 作者应该按照姓而不是名排序.这在html中,以<span class='...'>姓</span>标识
         * 兼容该目的,并不影响其他无此标签的列.
         */
        function configTableOneSortable3() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders.wrapInner('<a href="#"/>').addClass('sort'); // th
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const column = $(this).index();
                const rows = jtable.find('tbody > tr').each(function () {
                    const jtr = $(this);
                    const jtd = jtr.children('td').eq(column);
                    let key = jtd.find(`span.${Sort_Key}`).text();
                    const sep = key == '' ? '' : ' ';
                    key += sep + jtr.children('td').eq(column).text();
                    jtr.data(Sort_Key, key.trim().toUpperCase());
                }).get();
                rows.sort((a, b) => {
                    let keyA = $(a).data(Sort_Key);
                    let keyB = $(b).data(Sort_Key);
                    return keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                });
                rows.forEach(row => {
                    jtable.children('tbody').append(row);
                });
            });
            //#endregion
        }
        /**
         * 3基础上,考虑:
         * 存储非字符串数据:date和price的比较,不能单纯以转化后的字符串进行
         * 这得依赖于标识css类: sort-alpha sort-date sort-numeric
         * 配置阶段而非点击响应时, 即存储各列的关键字类型至各自header的data-属性
         */
        function configTableOneSortable4() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders
                .each((idx, ele) => {
                $(ele).data(Key_Type, ele.className.replace(/^sort-/, ''));
            })
                .wrapInner('<a href="#"/>')
                .addClass('sort'); // th
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const jheader = $(this);
                const column = jheader.index();
                const keyType = jheader.data(Key_Type);
                if (typeof SortKeyMethods[keyType] == 'function') {
                    const rows = jtable.find('tbody > tr').each(function () {
                        const jtr = $(this);
                        const jtd = jtr.children('td').eq(column);
                        jtr.data(Sort_Key, SortKeyMethods[keyType](jtd));
                    }).get();
                    rows.sort((a, b) => {
                        let keyA = $(a).data(Sort_Key);
                        let keyB = $(b).data(Sort_Key);
                        return keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                    });
                    rows.forEach(row => {
                        jtable.children('tbody').append(row);
                    });
                }
                else {
                    console.log('对应的关键字获取方法找不到');
                }
            });
            //#endregion
        }
        /**
         * 4基础上,添加降序排列
         */
        function configTableOneSortable5() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders
                .each((idx, ele) => {
                $(ele).data(Key_Type, ele.className.replace(/^sort-/, ''));
            })
                .wrapInner('<a href="#"/>')
                .addClass('sort'); // th
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                const jheader = $(this);
                let sort_asc = 1; //默认升序				
                if (jheader.hasClass('sorted-asc')) {
                    sort_asc = -1;
                }
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const column = jheader.index();
                const keyType = jheader.data(Key_Type);
                if (typeof SortKeyMethods[keyType] == 'function') {
                    const rows = jtable.find('tbody > tr').each(function () {
                        const jtr = $(this);
                        const jtd = jtr.children('td').eq(column);
                        jtr.data(Sort_Key, SortKeyMethods[keyType](jtd));
                    }).get();
                    rows.sort((a, b) => {
                        let keyA = $(a).data(Sort_Key);
                        let keyB = $(b).data(Sort_Key);
                        return (keyA > keyB ? 1 : (keyA == keyB ? 0 : -1)) * sort_asc;
                    });
                    rows.forEach(row => {
                        jtable.children('tbody').append(row);
                    });
                    jheaders.removeClass('sorted-asc sorted-desc');
                    jheader.addClass(sort_asc == 1 ? 'sorted-asc' : 'sorted-desc');
                }
                else {
                    console.log('对应的关键字获取方法找不到');
                }
            });
            //#endregion
        }
        /**
         * 自创
         * 将各个不同的链接的文本以对象属性的方式,在点击前就预先存入data-sort-key属性值
         * 兼容姓氏排序优先
         * 加入降序
         */
        function configTableOneSortableByMyself1() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders.wrapInner('<a href="#"/>').addClass('sort'); // th > a > (text)
            //#endregion
            //确定属性名(使用各个cell的text)
            const props = ['']; //第一个(index=0)属性名不被采用
            jheaders.each((idx, td) => {
                props.push(td.innerText);
            });
            //#region 预先存入每行的sort-key-object对象内
            jtable.find('tbody tr').each((idx, tr) => {
                const jtr = $(tr);
                const keys = {};
                jtr.children('td').each((colIdx, td) => {
                    const jtd = $(td);
                    //姓氏优先的兼容处理
                    let v = jtd.find(`span.${Sort_Key}`).text();
                    const sep = v == '' ? '' : ' ';
                    keys[props[colIdx]] = v + sep + jtd.text().toUpperCase();
                });
                jtr.data(Sort_Key_Object, keys);
            });
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                const jtd = $(this);
                //默认采用升序排序, -1为降序
                let sortAsc = 1;
                //当前是升序,则该次点击转为降序
                if (jtd.hasClass('sorted-asc')) {
                    sortAsc = -1;
                }
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const column = jtd.index();
                const rows = jtable.find('tbody > tr').get();
                rows.sort((a, b) => {
                    //console.log($(a).data(Sort_Key_Object), $(b).data(Sort_Key_Object));
                    const keyA = $(a).data(Sort_Key_Object)[props[column]];
                    const keyB = $(b).data(Sort_Key_Object)[props[column]];
                    const rst = keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                    return rst * sortAsc;
                });
                rows.forEach(row => {
                    jtable.children('tbody').append(row);
                });
                jheaders.removeClass('sorted-asc sorted-desc');
                jtd.addClass(sortAsc == 1 ? 'sorted-asc' : 'sorted-desc');
            });
            //#endregion
        }
        /**
         * 1基础上, 关键字比较采根据td内的具体数据类型
         */
        function configTableOneSortableByMyself2() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-1');
            const jheaders = jtable.find('thead th').slice(1);
            //按顺序确定属性名(使用各个cell的text)及其对应关键字获取应调用的方法
            const methods = [];
            jheaders
                .wrapInner('<a href="#"/>')
                .each((idx, td) => {
                const method = SortKeyMethods[td.className.replace(/^sort-/, '')];
                if (typeof method != 'function') {
                    throw new Error('发现没有合适的关键字获取方法');
                }
                methods[idx] = method;
            })
                .addClass('sort'); // th > a > (text)
            //#endregion
            //#region 预先存入每行的sort-key-object对象内
            jtable.find('tbody tr').each((idx, tr) => {
                const jtr = $(tr);
                const keys = [];
                jtr.children('td').slice(1).each((colIdx, td) => {
                    keys[colIdx] = methods[colIdx]($(td));
                });
                jtr.data(Sort_Key_Array, keys);
                console.log(keys);
            });
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                const jtd = $(this);
                //默认采用升序排序, -1为降序
                let sortAsc = 1;
                //当前是升序,则该次点击转为降序
                if (jtd.hasClass('sorted-asc')) {
                    sortAsc = -1;
                }
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const column = jtd.index() - 1; //jtd.index()获取到的是在所有兄弟中的排行.
                const rows = jtable.find('tbody > tr').get();
                rows.sort((a, b) => {
                    //console.log($(a).data(Sort_Key_Object), $(b).data(Sort_Key_Object));
                    const keyA = $(a).data(Sort_Key_Array)[column];
                    const keyB = $(b).data(Sort_Key_Array)[column];
                    const rst = keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                    return rst * sortAsc;
                });
                rows.forEach(row => {
                    jtable.children('tbody').append(row);
                });
                jheaders.removeClass('sorted-asc sorted-desc');
                jtd.addClass(sortAsc == 1 ? 'sorted-asc' : 'sorted-desc');
            });
            //#endregion
        }
        //#endregion
        //#region table t-2
        /**
         * 配置table #t-2 为可排序, 使用纯粹的自定义data-属性特征
         * 这需要html中各tr做好相关配置, 不论是静态或是像configTableOneSortableByMyself2
         * 一样的动态生成.
         */
        function configTableTwoSortable() {
            //#region 将t-1 table的表头, 改造成链接, 使用wrapInner的方法
            const jtable = $('table#t-2');
            const jheaders = jtable.find('thead th').slice(1);
            jheaders
                .wrapInner('<a href="#"/>')
                .addClass('sort'); // th > a > (text)
            //#endregion
            //#region 配置链接点击, 排序
            jheaders.on('click', function (evt) {
                evt.preventDefault();
                const jtd = $(this);
                //默认采用升序排序, -1为降序
                let sortAsc = 1;
                //当前是升序,则该次点击转为降序
                if (jtd.hasClass('sorted-asc')) {
                    sortAsc = -1;
                }
                //元素数组排序,然后append至容器,append不会导致增加副本,只是移动
                const rows = jtable.find('tbody > tr').get();
                const sortKey = jtd.data('sort').key;
                rows.sort((a, b) => {
                    //console.log($(a).data(Sort_Key_Object), $(b).data(Sort_Key_Object));
                    const keyA = $(a).data('book')[sortKey];
                    const keyB = $(b).data('book')[sortKey];
                    const rst = keyA > keyB ? 1 : (keyA == keyB ? 0 : -1);
                    return rst * sortAsc;
                });
                rows.forEach(row => {
                    jtable.children('tbody').append(row);
                });
                jheaders.removeClass('sorted-asc sorted-desc');
                jtd.addClass(sortAsc == 1 ? 'sorted-asc' : 'sorted-desc');
            });
            //#endregion
        }
        //#endregion
        //#region table t-3
        /**
         * table t-3的数据填充, 排序功能打造
         */
        function configTableThreeSortable() {
            const imgBaseUrl = '/lib/image/jpg/12-adv-dom-oper';
            /**
             * 构造一个tr的outer html
             * @param row
             */
            function buildRow(row) {
                const authors = [];
                row.authors.forEach(name => {
                    authors.push(name.first_name + ' ' + name.last_name);
                });
                const html = `
				<tr>
					<td><img src="${imgBaseUrl}/${row.img}"/></td>
					<td>${row.title}</td>
					<td>${authors.join(', ')}</td>
					<td>${row.published}</td>
					<td>${row.price}</td>
				</tr>
				`;
                return html;
            }
            /**
             * 构造多个tr,根据给定的多个row数据(json)
             * @param rows 多个row数据(json)
             * @returns 多个<tr>...</tr>连接起来的html片段
             */
            function buildRows(rows) {
                const trs = rows.map(buildRow);
                return trs.join('');
            }
            $.getJSON('/lib/script/json/12-adv-dom-oper/books.json', (data) => {
                const jtable3 = $('table#t-3');
                jtable3.find('tbody').html(buildRows(data));
                //后续排序配置略
            });
        }
        //#endregion
        /**
         * 简洁创建元素
         */
        function createElementTersely() {
            $('table').each(function (idx) {
                const jtable = $(this);
                $('<h3></h3>', {
                    id: 'table-title-' + (idx + 1),
                    class: 'table-title',
                    text: `This is h3 caption for table${idx + 1}`,
                    data: {
                        index: idx,
                        a: 18,
                        b: 'good',
                    },
                    click: function (evt) {
                        evt.preventDefault();
                        jtable.fadeToggle();
                        //jtable.slideToggle('slow');
                    },
                    //先检查是否存在对应的jquery方法,有则调用,没有则试图设置响应属性
                    css: {
                        glowColor: '#00ff00',
                        color: '#ff0000',
                    }
                }).insertBefore(jtable);
            });
        }
    }
});
//# sourceMappingURL=12-adv-dom-oper.js.map