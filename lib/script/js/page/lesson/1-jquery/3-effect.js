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
* 调试完毕，可考虑将 __DEBUG__ 设为 false，以关闭加载的调试信息
* *******************************************************************************************************/
JscssLoader.getInstance().startEntry({
    //globalRes: 默认包含必要脚本的文件 '/lib/script/json/global.json',一般不用修改
    //null 或 空字符串 '' 或 输入路劲不存在, 则放弃公共先决资源文件的加载
    //是否启用调试
    debug: true,
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
        enable_disable_anim_demo();
        fade_demo();
        color_anim_demo();
        queue_demo();
        custom_queue_demo();
        clear_queue_demo();
        replace_queue_demo();
        get_queue_demo();
        function enable_disable_anim_demo() {
            $('div.enable_disable_anim_demo input[type="button"]').click(function () {
                $.fx.off = !$.fx.off;
                console.log(`current animation:${!$.fx.off}`);
            });
        }
        /**
         *      测试fadeOut后的尺寸 不透明度 display 结论 :
         * 尺寸依旧在,虽然不尽同
         */
        function fade_demo() {
            let jcontent = $('pre.content-demo');
            let jbtn1 = $('.fade_demo input[type="button"]:first-child');
            let jbtn2 = jbtn1.next();
            let jbtn3 = jbtn2.next();
            let jbtn4 = jbtn3.next();
            function showProps() {
                let jele = $(this);
                console.log(jele.width(), jele.height(), jele.css('opacity'), jele.css('display'));
            }
            jbtn1.click(function () {
                //尺寸依旧在,虽然不尽同: (全屏)1862 105 "1" "block"
                jcontent.fadeIn(3000, showProps);
            });
            jbtn2.click(evt => {
                //尺寸依旧在,虽然不尽同: (全屏)578.5 105 "1" "none"
                jcontent.fadeOut(3000, showProps);
            });
            jbtn3.click(evt => {
                //      jcontent.fadeToggle(3000,showProps);   // ok
                jcontent.fadeToggle(3000).promise().done(showProps); // ok
            });
            jbtn4.click(evt => {
                //     jcontent.slideToggle(3000).promise().done(showProps);                      // good
                jcontent.stop(false, true).slideToggle(3000).promise()
                    .done(showProps); //better
                //jcontent.stop().slideToggle(3000).promise().done(showProps);                     //best
            });
        }
        /**
         *      Color-related properties cannot be animated
         * with .animate() using jQuery out of the box. Color animations
         * can easily be accomplished by including the color plugin.
         * 颜色相关的属性动画,不受animate支持.
         */
        function color_anim_demo() {
            $('.color_anim_demo').click(function () {
                $(this).animate({
                    left: ["+=300", 'swing'],
                    opacity: ["-=0.25", 'linear'],
                    'background-color': 'green',
                    color: 'yellow', //也没有反应
                }, 3000).promise().done(function () {
                    console.log('animate done.');
                });
            });
        }
        /**
         * 使用queue方法,代替回调函数
         */
        function queue_demo() {
            $('.queue_demo').click(function () {
                $(this).animate({
                    height: "+=50",
                }, 3000)
                    .queue(function () {
                    $(this).text('高度动画结束!');
                    $(this).dequeue(); //没有这句,后续的queue,animate将被忽略.
                })
                    .css('color', 'white') //不管dequeue,立即执行,因为非异步函数
                    .animate({
                    width: "+=100",
                }, 2000)
                    .queue((nextFunction) => {
                    $(this).text('宽度变换完毕');
                    nextFunction('hello,world'); // ok,
                })
                    .queue(function (arg) {
                    console.log('this is the end.', arg); //传递参数失败.
                });
            });
        }
        /**
         * 自定义队列名,否则采用默认的 fx
         */
        function custom_queue_demo() {
            $('.queue_demo').click(function () {
                let qn = "fx";
                //    let qn = 'custom_queue_name';
                $(this)
                    .queue(qn, function (next) {
                    setTimeout(() => {
                        console.log('step 1');
                        next();
                    }, 5000);
                })
                    .queue(qn, (next) => {
                    setTimeout(() => {
                        console.log('step 2');
                        //        $(this).dequeue(qn);
                        next();
                    }, 3000);
                })
                    .queue(qn, function (next) {
                    setTimeout(() => {
                        console.log('step 3');
                        //           $(this).dequeue(qn);        
                        next();
                    }, 1000);
                })
                    .animate({
                    height: "+=50",
                }, 2000)
                    .dequeue(qn); //必须调用,以此启动队列
            });
        }
        /**
         *      jquery.com说:Another way of clearing the queue is to
         * call .stop( true ). That will stop the currently running animations
         * and will clear the queue.
         * but....
         */
        function clear_queue_demo() {
            $(".box:eq(0)")
                //   .stop(true)                   //fail to clear
                .queue("steps-one", function (next) {
                console.log("Will never log because we clear the queue");
                next();
            })
                //  .clearQueue( "steps" )          //ok to clear
                //  .stop(true)                     //fail to clear
                .dequeue("steps-one")
                .stop(true); //fail to clear
        }
        /**
         *  When you pass an array of functions as the second argument to .queue(),
         * that array will replace the queue.
         */
        function replace_queue_demo() {
            $(".box:eq(0)")
                .queue("steps-two", function (next) {
                console.log("I will never fire as we totally replace the queue");
                next();
            })
                .queue("steps-two", [
                function (next) {
                    console.log("the first new.");
                    next();
                },
                function (next) {
                    console.log("the second new.");
                    next();
                }
            ])
                .dequeue("steps-two");
        }
        /**
         *      You can also call .queue() without passing it functions, which will
         * return the queue of that element as an array.
         */
        function get_queue_demo() {
            let jbox1 = $(".box:eq(0)");
            jbox1.queue("steps", [function (next) {
                    console.log("I fired!");
                    next();
                }, next => {
                    console.log("you are fired");
                    next();
                }]);
            console.log(jbox1.queue("steps")); //函数数组     
            jbox1.dequeue("steps");
        }
        function call_by_outer_demo() {
            console.log('this is in effect.js');
        }
    }
});
// /**
//  * 测试模板
//  */
// function simpleResult() {
//     //方法说明:
//     [
//         '',
//         (() => {
//             return [];
//         })(),
//     ]
//         .forEach((v, i) => {
//             console.log(v);
//         });
// }
//# sourceMappingURL=3-effect.js.map