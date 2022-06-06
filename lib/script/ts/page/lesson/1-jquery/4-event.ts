
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
        // asso_data_demo();
        // mulevent_same_handler_demo();
        // mulevent_mulhandler_in_one_statement_demo();
        // teardown_event_namedhandler_demo();
        // one_demo();
        //hover_helper_demo();
        trigger_arg_demo();


        /**
         * Any data that was passed in when the event was bound,一般不用于辨识当前对象
         */
        function asso_data_demo() {
            $('.asso_data_demo a').on(
                'click',
                {
                    //      cust_name: $(this).data('custName'),  //没必要,也不合语法.
                    cust_name: "foo,bar is here",
                },
                function (evt: JQuery.ClickEvent) {
                    evt.preventDefault();
                    console.log('click:', $(this).text(), evt.data.cust_name,
                        $(this).data("cust-name"));
                }
            );

        }

        /**
         * 多个事件绑定到一个处理器上,并同时演示处理器的命名空间,以及移除处理器
         */
        function mulevent_same_handler_demo() {
            $('.mult input[type="text"]').on(
                'click.tempNS change.tempNS',
                function (evt) {
                    if (evt.type == 'click')
                        console.log($(this).val(), 'input clicked');
                    else
                        console.log($(this).val(), 'text changed.');
                }
            );

            $('.mult input[type="button"]').on(
                'click',
                function (evt) {
                    if ($(this).is('.remove-click'))
                        $('.mult input[type="text"]').off('click.tempNS');
                    else if ($(this).is('.remove-change'))
                        $('.mult input[type="text"]').off('change.tempNS');
                }
            );
        }

        /**
         * 一条语句,搞定多个不同事件的不同处理器,用对象的方式
         */
        function mulevent_mulhandler_in_one_statement_demo() {
            $('.mult input').on({
                'click': function () {
                    console.log($(this).val(), 'mouse click');
                },
                mouseover: function () {
                    console.log($(this).val(), 'mouse over');
                },
            });
        }

        /**
         * 卸载命名处理函数
         */
        function teardown_event_namedhandler_demo() {
            let foo = function () { console.log("foo"); };
            let bar = function () { console.log("bar"); };
            let jele = $('.mult input[value="two"]');

            jele.on("click", foo).on("click", bar);

            setTimeout(() => {
                jele.off("click", bar);// foo is still bound to the click event
            }, 5000);
        }

        /**
         * one应用到多事件处理器
         */
        function one_demo() {
            $('.mult input.remove-click').one("focus mouseover keydown click", evt => {
                console.log(evt.type);
            });
        }

        /**
         *      The .hover() method lets you pass one or two functions to be run when the mouseenter 
         * and mouseleave events occur on an element. If you pass one function, it will be run for 
         * both events; if you pass two functions, the first will run for mouseenter, and the second 
         * will run for mouseleave.
         */
        function hover_helper_demo() {
            $('.mult input.remove-click').hover(function () {
                console.log('mouse enter');
            }, function () {
                console.log('mouse leave');
            });
        }

        /**
         *      .trigger() method takes an event type as its argument. Optionally, it can also take an 
         * array of values. These values will be passed to the event handling function as arguments 
         * after the event object.
         *      trigger() 多用于自定义事件.配合自定义参数,不会扰乱原生event对象
         */
        function trigger_arg_demo() {
            let jbtn1 = $('.trigger_arg_demo input:first-child');
            let jbtn2 = jbtn1.next();

            //点击btn1,arg是undefined.
            jbtn1.click(function (evt: JQuery.Event, arg) {
                console.log(evt, arg);
            });

            //点击btn2,控制台打印arg不再是undefined.trigger换为on则没有反应.使用click可以激发,但无法携带参数.
            jbtn2.click(function () {
                // jbtn1.trigger('click',           //ok
                //     {
                //         a: 10,
                //         b: -8,
                //         c: 'hello,world',
                //     });

                jbtn1.click(); //ok,但是无法携带参数

                //尝试使用click, 并携带参数: 失败
                // jbtn1.on('click',  //not response
                //     {
                //         a: 100,
                //         b: -83,
                //         c: 'hello,world',
                //     });

                // jbtn1.click({  //error
                //     a: 3,
                //     b: 4,
                // });
            });
        }
    }
});




/**
 * 测试模板
 */
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



