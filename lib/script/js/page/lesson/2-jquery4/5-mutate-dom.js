"use strict";
/*-download by http://www.jb51.net
*  ATTRIBUTE MANIPULATION
*
*/
// // Use .attr() to add "inhabitants" class to all paragraphs.
// $(document).ready(function() {
//   $('p').each(function(index) {
//     var currentClass = $(this).attr('class');
//     $(this).attr('class', currentClass + ' inhabitants');
//   });
// });
// // Use attr() to add an id, rel, and title.
// $(document).ready(function() {
//   $('div.chapter a[@href*=wikipedia]').each(function(index) {
//     var $thisLink = $(this);
//     $(this).attr({
//       'rel': 'external',
//       'id': 'wikilink-' + index,
//       'title': 'learn more about ' + $thisLink.text() + ' at Wikipedia'
//     });
//   });
// });
// /*
// *
// *  BACK-TO-TOP LINKS
// *
// */
// $(document).ready(function() {
//   $('<a id="top" name="top"></a>').prependTo('body');
//   $('<a href="#top">back to top</a>').insertAfter('div.chapter p:gt(2)');
// });
// /*
// *
// *  FOOTNOTES
// *
// */
// $(document).ready(function() {
//   $('<ol id="notes"></ol>').insertAfter('div.chapter');
//   $('span.footnote').each(function(index) {
//     $(this)
//       .before('<a href="#foot-note-' + (index+1) + '" id="context-' + (index+1) + '" class="context"><sup>' + (index+1) + '</sup></a>')
//       .appendTo('#notes')
//       .append( '&nbsp;(<a href="#context-' + (index+1) + '">context</a>)' )
//       .wrap('<li id="foot-note-' + (index+1) + '"></li>');
//   });
// });
// /*
// *
// *  PULL QUOTES
// *
// */
// $(document).ready(function() {
//   $('span.pull-quote').each(function(index) {
//     var $parentParagraph = $(this).parent('p');
//     $parentParagraph.css('position', 'relative');
//     var $clonedCopy = $(this).clone();
//     $clonedCopy
//       .addClass('pulled')
//       .find('span.drop')
//         .html('&hellip;')
//       .end()
//       .prependTo($parentParagraph)
//       .wrap('<div class="pulled-wrapper"></div>');
//     var clonedText = $clonedCopy.text();
//     $clonedCopy.html(clonedText);
//   });
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
            '/lib/style/css/2-jquery4/5-mutate-dom.css',
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //to do
        configMockButtons();
        /**
         * 配置各模拟按钮的点击响应
         */
        function configMockButtons() {
            //<input type="button" id="use-attr" value="attr方法操作属性"/>
            $('#use-attr').click(() => {
                $('div.chapter a[href*=wikipedia]').attr({
                    //attr方法,不论何种属性, 均出现在html中
                    rel: 'external',
                    title: function (index, oldTitle) {
                        return `Learn more about ${$(this).text()} at Wikipedia`;
                    },
                    id: (index, oldId) => `wikilink-${index}`,
                    three: 'three-value',
                    four: 'four-value',
                });
            });
            //<input type="button" id="use-prop" value="prop方法操作属性"/>
            $('#use-prop').click(() => {
                $('div.chapter a[href*=wikipedia]').prop({
                    //非固有属性,不会出现在html中
                    one: 'one-value',
                    two: function (idx, oldV) {
                        return 'hey,this is value for ' + idx;
                    },
                    //这是固有属性,会出现在html中
                    type: 'xixi',
                });
            });
            //<input type="button" id="view-result" value="查看其中一个链接的所有属性"/>
            $('#view-result').click(() => {
                const arr_name = ['one', 'two', 'three', 'four', 'type', 'rel', 'id', 'title'];
                const anch = $('div.chapter a[href*=wikipedia]')[2];
                const jres = $('#result');
                jres.val('使用 domElement[prop-name] 获取\n');
                for (const p in anch) {
                    if (arr_name.includes(p)) {
                        //@ts-ignore            
                        jres.val(jres.val() + `${p}:${anch[p]}\n`);
                    }
                }
                jres.val(jres.val() + '\n使用 domElement.attributes[prop-name] 获取\n');
                for (const p in anch) {
                    if (arr_name.includes(p)) {
                        //@ts-ignore            
                        jres.val(jres.val() + `${p}:${anch.attributes[p]}\n`);
                    }
                }
                jres.val(jres.val() + '\n使用 $(...).attr() 获取\n');
                for (const p in anch) {
                    if (arr_name.includes(p)) {
                        //@ts-ignore            
                        jres.val(jres.val() + `${p}:${$(anch).attr(p)}\n`);
                    }
                }
                jres.val(jres.val() + '\n使用 $(...).prop() 获取\n');
                for (const p in anch) {
                    if (arr_name.includes(p)) {
                        //@ts-ignore            
                        jres.val(jres.val() + `${p}:${$(anch).prop(p)}\n`);
                    }
                }
                jres.val(jres.val() + "\n结论:使用attr或prop方法设置或添加的属性," +
                    "均为元素的一级属性,从获取到的结果上看, jquery的attr方法, " +
                    "是prop方法的子集.具体在html中是否显示, 得看浏览器");
            });
            //<input value="为每个段落添加回到顶部的锚功能"/>
            $('#create-top-anchor').one('click', () => {
                $('<a id="top"/>').prependTo('body');
                //$('<a href="#top">back to top</a>').insertAfter('div.chapter p');//p的外部
                $('<a href="#top">back to top</a>').appendTo('div.chapter p');
            });
            //<input value="转移脚注到footer之前,手工添加标记"/>
            $('#transfer-footnote1').one('click', (evt) => {
                //简单的提取脚注到footer前
                //$('span.footnote').insertBefore('div#footer');
                // $('span.footnote')
                //   .each((idx: number, ele: HTMLElement) => {
                //     const t = $(ele).text();
                //     const n = idx + 1;
                //     $(ele).text(`${n}.${t}`)
                //       .before(`<a id="ref-${n}" class="text-reference" href="#footnote-${n}">${n}</a>`)
                //       .wrapInner(`<a href="#ref-${n}" id="footnote-${n}"/>`);
                //   })
                //   .insertBefore('div#footer')
                //   .css('text-indent', '2em');
                //很奇怪,单个jquery对象无法调用wrap方法, 否则在wrapInner处,即可将span包起来,而不是
                //使用wrapInner,只能包span的子内容
                //下面是jquery对象集合调用wrap方法, 可将各自span包在每个<a></a>内部
                //但是发现, 下面的原版演示, 单个jquery对象,又可以用<li></li>各个包装
                $('span.footnote')
                    .each((idx, ele) => {
                    const t = $(ele).text();
                    const n = idx + 1;
                    $(ele).text(`${n}.${t}`)
                        .before(`<a id="ref-${n}" 
              class="text-reference" href="#footnote-${n}"><sup>${n}</sup></a>`);
                })
                    .insertBefore('div#footer')
                    .css('text-indent', '2em')
                    .wrap(function (idx) {
                    const n = idx + 1;
                    return `<a id="footnote-${n}" href="#ref-${n}"/>`;
                });
            });
            //<input value="转移脚注到footer之前,使用ol有序列表自动生成"/>
            //这是书上原版P94
            $('#transfer-footnote2').one('click', (evt) => {
                //简单的提取脚注到footer前
                //$('span.footnote').insertBefore('div#footer');
                $('span.footnote')
                    .insertBefore('div#footer')
                    .wrapAll('<ol id="notes"></ol>')
                    .wrap('<li></li>');
            });
            //<input value="value="使用显示迭代实现""/>
            //这是书上原版P95
            $('#transfer-footnote3').one('click', (evt) => {
                const jnotes = $('<ol id="notes"></ol>').insertBefore('#footer');
                $('span.footnote').each((idx, ele) => {
                    $(`<sup>${idx + 1}</sup>`).insertBefore(ele);
                    $(ele).appendTo(jnotes).wrap('<li></li>');
                });
            });
            //<input value="使用反向插入方法实现链式方法调用"/>
            //书上原版P96
            $('#transfer-footnote4').one('click', (evt) => {
                const jnotes = $('<ol id="notes"></ol>').insertBefore('#footer');
                $('span.footnote').each((idx, ele) => {
                    const n = idx + 1;
                    $(ele)
                        .before(`
              <a href="#footnote-${n}" id="context-${n}" class="context">
                <sup>${idx + 1}</sup>
              </a>
            `)
                        .appendTo(jnotes)
                        .append(`
              &nbsp;<a href="#context-${n}">context</a>
            `)
                        .wrap(`
            <li id="footnote-${n}"/>
            `);
                });
            });
            //<input value="按钮到页脚,但无事件响应" />
            $('#clone-elements-without-event').one('click', (evt) => {
                $('div.t-btns').clone(true, true).appendTo('body');
            });
            //<input type="button" id="clone-to-extrusive-reference" value="通过复制创建突出引用"/>
            $('#clone-to-extrusive-reference').one('click', evt => {
                $('span.pull-quote').each(function (idx) {
                    const jpar = $(this).parent('p');
                    jpar.css('position', 'relative');
                    const jcopy = $(this).clone();
                    jcopy
                        .addClass('pulled')
                        .prependTo(jpar)
                        .find('span.drop')
                        .html('&hellip;') //省略号代替
                        .end()
                        .text(jcopy.text());
                });
            });
        }
    }
});
//# sourceMappingURL=5-mutate-dom.js.map