
//让渡方式一:
/*
let JQ = jQuery.noConflict();
JQ(function () {
    JQ("a.test").click(function (evt) {
        //   event.preventDefault();
        evt.preventDefault();
        console.log(event, evt);
        JQ(this).hide('slow', function () {
            console.log('link is hided!');
        });
    });

console.log("ready by jq");
JQ('iframe.test').remove();

}); */

//让渡方式2:
/*
jQuery.noConflict();
jQuery(function ($) {       //完整写法: jQuery(document).ready(function($){...});
    console.log('hello,world');
    $('a.test').hide('slow', () => {
        console.log('link is hided.');
    });

    //继续使用$
}); */


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
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //text();
        //css();
        //data();
        //inArray();
        //extend();
        //proxy1();
        //proxy2();
        //determineType();
        //map();
        //scroll();
        //index();
        //Dom_jq();
        //toggle_state();
        escape_css_notation();
        //disable_enable();
        /**
         *  Setters affect all elements in a selection, whereas getters return the requested value only
         *   for the first element in the selection, with the exception of .text(), which retrieves the
         *   values of all the elements.
         * Note that in most cases, the "getter" signature returns the result from the first element in
         * a jQuery collection while the setter acts over the entire collection of matched elements.
         * The exception to this is .text() where the getter signature will return a concatenated string
         * of text from all matched elements.
         */
        function text() {
            console.log($('a').html());         //return html of the first link only:jQu<i>er</i>y
            console.log($('a').text());      //return a string from an array:jQuerya temp linkgoto guitarchina
            $('a').text('new text affect all links.'); //affect all links
        }
        /**
         * 测试css方法是否能获取组合属性(对象)
         */
        function css() {
            console.log($('body').css('font'));     //非对象,而是带空格的多属性值字符串表达式,类似于css定义时.
        }

        /**
         * 测试data-属性和自定义常规属性的添加,对html的影响
         */
        function data() {
            //测试添加普通attribute,data-属性的html显示,读取方式
            let jtempLink = $('a.temp');
            jtempLink.attr('customAttr', 'hello,world');     //这个看得到
            console.log(jtempLink.attr('custom-attr'), jtempLink.attr('customAttr')); //undefined "hello,world"
            //data- 赋予一般字串
            jtempLink.data('yourKeyName', 23.9);         //赋值成功,但是html里看不到
            console.log(jtempLink.data('your-key-name'));
            //data- 赋予对象
            jtempLink.data("myKeyName", {          //赋值成功,但是html里更看不到.
                name: 'guoshiwo',
                age: 48,
                family: {
                    foo: 'bar',
                    birth: new Date(),
                }
            });
            console.log(jtempLink.data('my-key-name'));
            console.log(jtempLink.get(0)?.outerHTML);        //仍然看不到data-属性
        }
        /**
         * $.inArray方法测试
         */
        function inArray() {
            //$.inArray返回指定值在数组中的索引,找不到返回-1   大约是 index of the value in Array 之意.
            let myArr = [1, 2, 3, 5];
            console.log($.inArray(3, myArr), $.inArray(42, myArr)); //2 -1
        }

        /**
         * $.extend方法测试
         */
        function extend() {
            let obj1 = {
                a: 1,
                b: 2,
            };
            let obj2 = {
                b: -2,
                c: -3,
            };

            // let obj = $.extend(obj1,obj2);
            //  console.log(obj,obj1,obj2,obj === obj1); //obj1被改变,且obj === obj1

            let obj = $.extend({}, obj1, obj2);
            console.log(obj, obj1, obj2, obj === obj1);  //obj1维持原状. obj !== obj1
        }
        /**
         * $.proxy测试,使用(func,thisObj)形式
         */
        function proxy1() {
            let f = function (this: any) {
                console.log(this);
            };
            f();                    //window

            //proxy方法,类似于bind(func,thisObj),起置换this的作用
            let obj = {
                flag: 'hello,world',
            };
            let f_new = $.proxy(f, obj);
            f_new();                //{flag: "hello,world"}

            //f不是obj的方法,故无法这样调用,正确方式见demo2
            //   let f_new2 = $.proxy(obj,"f");          
            //   f_new2();
        }
        /**
         * $.proxy方法测试,使用(obj,method-name-of-obj)
         */
        function proxy2() {
            let obj = {
                f: function (evt: Event) {
                    evt.preventDefault();
                    console.log(this);
                },
            };
            //HTMLElement: <a class="temp" href="#not an id">a temp link</a>
            //$('a.temp').click(obj.f);
            //$('a.temp').click($.proxy(obj, "f")); // obj

            //$('a.temp').click($.proxy(obj.f, obj));  //效果同上: obj
        }

        /**
         * 类型判定测试
         */
        function determineType() {
            //方法说明:
            [
                '类型判定测试,注意,全是小写开头',
                //    (() => {

                //        return [
                $.isArray([]),                              //true
                $.isFunction(function () { }),                 //true
                $.isNumeric(3.1417),                        //true

                $.type(true),                               //boolean
                $.type(3),                                  //number
                $.type("test"),                             //string

                //      $.type(new function () { }),                   //object
                $.type(function () { }),                       //function

                $.type(new Boolean()),                      //boolean
                $.type(new Number(21)),                     //number
                $.type(new Function()),                     //function

                $.type([]),                                 //array
                $.type(null),                               //null
                $.type(/test/),                             //regexp
                $.type(new Date()),                         //date
                //          ];
                //      })(),

            ]
                .forEach((v, i) => {
                    console.log(v);
                });
        }
        /**
         * .map方法,必须识别是jQuery实例方法,还是js实例方法
         */
        function map() {
            [
                'map()方法,返回值由调用方决定',
                (() => {
                    let rst1 = $('a').map(function (index, ele) {          //这是jQuery object的方法
                        //          console.log(this === ele);      //顺便测试 true
                        return this.id;
                    });
                    let rst2 = ['a', 'b', 'c', 'd'].map(function (ele, idx) {  //这是js 实例的方法,所以连参数顺序都不一样
                        console.log(ele);
                        return ele + (idx * 2);
                    });
                    // let rst3 = $.map($('a'), function (ele, idx) {          //在jQuery内部,仍然调用了js实例方法
                    //     return ele.id;
                    // });
                    let rst4 = $.map(['a', 'b', 'c', 'd'], function (ele, idx) {   //同上
                        return ele + (idx * 3);
                    });
                    return [
                        rst1,           //jQuery Object
                        rst2,           //js common Array
                        rst1.get(),     //js common Array
                        //rst3,           //js common Array
                        rst4,           //js common Array
                    ];
                })(),

            ]
                .forEach((v, i) => {
                    console.log(v);
                });
        }
        /**
         *      The horizontal scroll position is the same as the number of pixels that are hidden
         * from view to the left of the scrollable area.
         *      If the scroll bar is at the very left, or if the element is not scrollable,
         * this number will be 0.
         * 即:scrollLeft() scrollTop()仅仅指滚动条的位置
         */
        function scroll() {
            $('*').click(function (evt: JQuery.ClickEvent) {
                evt.stopPropagation();
                let jele = $(this);
                console.log(jele.position(), jele.scrollLeft(), jele.scrollTop());
            });
        }
        /**
         *      .index() is a method on jQuery objects that's generally used to search for a given element
         * within the jQuery object that it's called on. This method has four different signatures
         * with different semantics that can be confusing.
         */
        function index() {
            [
                '.index() with No arguments:gives the zero-based index ' +
                'of the element within its parent',
                (() => {
                    let [jfoo, jlies, jdivs] = [
                        $('.index_demo #foo1'),
                        $('.index_demo li'),
                        $('.index_demo div')
                    ];
                    return [
                        jfoo.index(),                   //1

                        jlies.index(),                  //1
                        jlies.first().index(),          //1

                        jdivs.index(),                  //0
                        jdivs.first().index(),          //0
                    ];
                })(),
            ]
                .forEach((v, i) => {
                    console.log(v);
                });

            [
                '.index() 带一个字符串参数:以该参数为选择器,定位范围,' +
                '获取caller在其中的 zero - indexed序号',
                (() => {
                    let jbar = $('.index_demo #bar1');
                    return [
                        jbar.index('.index_demo li'),           //  1

                        $('*'),                                 //包含所有html元素标签的jquery对象,包括html head meta等等
                        jbar.index('*'),                        //

                        jbar.index('div'),                      //-1  (在 $('div')内找不到)

                    ];
                })(),
            ]
                .forEach((v, i) => {
                    console.log(v);
                });

            [
                '.index()带一个jQuery对象参数:在caller定位的范围内,查找argument的序号',
                (() => {
                    let jbar = $('.index_demo #bar1');
                    return [
                        $('.index_demo li').index(jbar),        // 1
                        $('div').index(jbar),                   // -1
                    ];
                })(),

            ]
                .forEach((v, i) => {
                    console.log(v);
                });

            [
                '.index()带一个DOMElement 参数:文档说与上一种情况类似,实测结果不然.以后再说.',
                // (() => {
                //     let jbar = $('.index_demo #bar1');
                //     let domul = document.getElementsByClassName('index_demo');

                //     let jul = $('.index_demo');
                //     let dombar = document.getElementById('bar1');

                //     return [
                //         jul.index(dombar),                  //-1
                //         jbar.index(domul),                  //-1
                //     ];
                // })(),

            ]
                .forEach((v, i) => {
                    console.log(v);
                });
        }
        /**
         * Dom Element 连接 jquery对象
         */
        function Dom_jq() {
            [
                '联合使用Dom element和jquery对象:',
                (() => {
                    const dom = document.getElementById('temp_ul');
                    return [
                        //        $(dom + '.c_foo1'),     //error:unrecognized expression: [object HTMLUListElement].c_foo1
                        //         $(dom + '#bar1'),     //error: unrecognized expression: [object HTMLUListElement]#bar1
                        //@ts-ignore
                        $(dom).find('.c_foo1'),     //ok
                        //@ts-ignore
                        $(dom).find('#bar1'),       //ok
                    ];
                })(),

            ]
                .forEach((v, i) => {
                    console.log(v);
                });
        }
        function toggle_state() {
            function showState(jele: JQuery<HTMLElement>) {
                const [isV, isH] = [
                    jele.is(':visible'),
                    jele.is(':hidden'),
                ];
                console.log({ isV, isH });
            }
            $('#ph').addClass('temp-border').click(function () {
                $(this).toggle(3000, () => {
                    showState($(this));
                });
                $(this).toggle(14000, () => {
                    showState($(this));
                });

            });
        }
        /**
         * 当ID包含css字符
         */
        function escape_css_notation() {
            function jq(myid: string) {
                return "#" + myid.replace(/(:|\.|\[|\]|,|=|@|\s|'|")/g, "\\$1");
            }

            [
                'css字符转义:',
                (() => {
                    let id = "such id,you'will be mad.or.crazy";
                    let id_1 = "such\ id,you\'will\ be\ mad\.or\.crazy";
                    let escId = "such\\ id\\,you\\'will\\ be\\ mad\\.or\\.crazy";
                    let escId_1 = jq(id);
                    return [
                        //              $('#' + id).val(), //Syntax error, unrecognized expression: #such id,you'will be mad.or.crazy
                        //              $('#' + id_1).val(), //同上
                        $('#' + escId).val(),   //ok: 'hello,world'
                        $('#' + escId)[0].id,   //还原得到原版html id值
                        $('#' + id.replace(/(:|\.|\[|\]|,|=|@|\s|'|")/g, "\\$1")).val(),     //ok
                        escId_1,                //ok
                        $(jq(id)).val(),        //ok
                    ];
                })(),

            ]
                .forEach((v, i) => {
                    console.log(v);
                });
        }
        /**
         * to disable/enable a form element
         */
        function disable_enable() {
            //方式一:Dom element
            let t1 = document.getElementById('tt');
            //   t1.disabled = 1 | "hello" | true | {} | 'disabled' | 'donnot disable';                //disabled
            //   t1.disabled = false | 0 | undefined | null;                                           //enabled

            //方式二:jquery object
            let jt2 = $('#tt');
            //@ts-ignore
            jt2.prop('disabled', 1 | "hello" | true | {} | 'disabled' | 'donnot disable');       //disabled
            //jt2.prop('disabled', false | 0 | undefined | null);
        }

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

    }
});
