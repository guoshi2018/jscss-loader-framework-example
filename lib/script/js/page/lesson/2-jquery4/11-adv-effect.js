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
    //globalRes: 'not a path ',
    //是否启用调试
    debug: true,
    //在此添加本入口文件需要包含的js css文件全路径,默认[]
    //页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
    //必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
    privateRes: [
        [
            '/lib/style/css/2-jquery4/default.css',
            '/lib/style/css/2-jquery4/11-adv-effect.css',
            '/lib/external-core/jquery-ui-1.13.1.custom/jquery-ui.css',
        ],
        [
            '/lib/external-core/jquery-ui-1.13.1.custom/jquery-ui.js',
            '/lib/script/js/indoor-lib/function/guoshi/guoshi.js',
            '/lib/script/js/indoor-lib/function/jq-misc/ext-event.js'
        ]
    ],
    //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
    main: () => {
        //to do
        //example:
        Guoshi.Html.clickBlankToRefreshDocment();
        configHoverImage();
        configFxToggle();
        configAlertClosingPage(30, 5);
        configEffectSpeed();
        configClickPhotoToToShowDetailsThenBio();
        /**
         * 配置鼠标进入,离开图片区域,引发放大/还原
         */
        function configHoverImage() {
            /**
             * 预备函数, 多次使用到:
             * 	 根据当前的事件类型, 返回合适的img元素的尺寸(宽高相同)和对应padding(四个方向一致)
             * @param eventType
             * @returns 第一个元素为size(宽高相同),第二个元素为padding(四个方向一致)
             */
            function correctParams(eventType) {
                let size = 85;
                let padding = 0;
                if (eventType == 'mouseleave') {
                    size = 75;
                    padding = 5;
                }
                return [size, padding];
            }
            /**
             * 各种方案均会调用的
             * @param jele 影响的元素
             * @param evt 代表当前是进入还是离开的事件
             */
            function switchByEvent(jele, evt) {
                const [size, padding] = correctParams(evt.type);
                jele.animate({
                    width: size,
                    height: size,
                    padding,
                }, 'turtle');
            }
            $('div.member').on('mouseenter mouseleave', function (evt) {
                const jimg = $('img', this);
                //方案一:每次进入离开的动画,被忠实记录在队列中,即使鼠标已经完全离开
                //存在问题: 鼠标动作太快, 则鼠标都已经离开很久, 放大/还原还在不停往返进行
                //switchByEvent(jimg, evt);
                //方案二:如果正在动画中, 则忽略新来的动画
                //问题很多, 主要是进入离开太快的话,可能会离开后保持放大;进入后可能保持还原
                // if (!jimg.is(':animated')) {
                // 	switchByEvent(jimg, evt);
                // }
                //方案三:忽略正在动画时的进入事件的放大动画, 有改观
                //存在问题:
                //	1)进入后快速离开, 仍然有完整的放大 -> 还原动画
                //	2)离开后快速进入, 由于正处于还原动画中, 所以放大动画被忽略. 
                // if (!jimg.is(':animated') || evt.type == 'mouseleave') {
                // 	switchByEvent(jimg, evt);
                // }
                //方案四:清除队列, 跳到终点值
                //存在问题:
                //	鼠标移动太快, 图像会发生忽然跳至最大,忽然跳至原始尺寸
                //switchByEvent(jimg.stop(true, true), evt);
                //方案五:效果以上类似,问题也一样(最终的变化突兀)
                //switchByEvent(jimg.finish(), evt);
                //注意:---------------------------------------------------------
                //使用stop(), 如果不保存两种情况下的目标值, 就会引发以下问题: 
                //	放大进行当中被终止的中间尺寸, 被作为下次放大的终点值.即下次放大不会到85.
                //	还原进行当中也存在类似情况
                //	相当于调用stop(false,false),即不清除队列, 动画未完成也不跳到终点值
                //------------------------------------------------------------
                //#region 完美结局
                //方案六 perfect: animate前, 使用stop方法,: 有动画来临, 立即停止(取消)当前动画(如果正在进行)
                //由于两种状态下的目标值已经保存,所以被中断的中间值,不会作为下次返回的目标值.
                switchByEvent(jimg.stop(), evt);
                //方案七 方案二结合扩展事件mousemovehalt也可以.只不过感觉多此一举, 直接stop()就好:
                // if (!jimg.is(':animated')) {
                // 	switchByEvent(jimg, evt);
                // }
                // const [size, padding] = correctParams(evt.type);
                // $(this).one('mousemovehalt', () => { //必须是响应一次就卸载
                // 	jimg.animate({
                // 		width: size,
                // 		height: size,
                // 		padding,
                // 	}, 'turtle');
                // });
                //#endregion
            });
        }
        let close_times = 0;
        /**
         * 配置提示自动关闭页面,算是扩展事件mousemovehalt之用武之地吧
         * @param idleBysecond 记录当鼠标停止活动多长时间, 页面自动关闭. 单位:秒
         * @param warnBysecond 自提示关闭, 至真正关闭页面的警告时间. 单位:秒
         */
        function configAlertClosingPage(idleBysecond, warnBysecond) {
            const delay = idleBysecond * 1000;
            $(window).on('mousemovehalt', {
                delay, //2秒钟鼠标不动
            }, async () => {
                console.log(`------------------------------------------`);
                console.log(`The mouse has stopped active for ${idleBysecond} second(s),` +
                    `and the page will close after ${warnBysecond} second(s)`);
                await Guoshi.Misc.sleep(warnBysecond * 1000);
                console.log(`now window is closed ${++close_times}`);
                //window.close();
            });
        }
        /**
         * 配置#fx-toggle按钮显示出来, 当点击时,切换动画效果的打开与关闭
         */
        function configFxToggle() {
            $('#fx-toggle').show().on('click', () => {
                $.fx.off = !$.fx.off;
            });
        }
        function configEffectSpeed() {
            //自定义龟速为1.5秒, 如果不定义, jquery将以_default充当
            $.fx.speeds.turtle = 1500;
            //修改默认为0.8秒, 如果不修改, jquery 将以默认的_default=400
            $.fx.speeds._default = 880;
            //自定义
            $.fx.speeds.zippy = 390;
        }
        function configClickPhotoToToShowDetailsThenBio() {
            //#region 准备动态显示的人物简介
            const jmovable = $('<div id="movable"></div>').appendTo('body'); //动态容纳不同简介
            const bioBaseStyle = {
                display: 'none',
                height: '5px',
                width: '25px',
            };
            const bioEffects = {
                duration: 800,
                easing: 'easeOutQuart',
                specialEasing: {
                    opacity: 'linear',
                },
            };
            /**
             * 显示相关简介
             * @param this 完成延迟对象生成的JQuery对象
             */
            function showBio() {
                const jbio = $(this).siblings('p.bio');
                const jparent = jbio.parent();
                const parent_loc = jparent.offset() || {
                    left: 0,
                    top: 0,
                };
                const par_border_top = parseFloat(jparent.css('border-top-width').replace(/s+|px/gi, ''));
                const par_margin_top = parseFloat(jparent.css('margin-top').replace(/s+|px/gi, ''));
                const startStyle = $.extend(bioBaseStyle, parent_loc); //混入容器的left,top坐标
                const endStyle = {
                    width: jbio.width(),
                    //为了与div.name平齐,而后者的margin-top:5px,同时考虑上方的border和margin
                    top: parent_loc.top + par_margin_top + par_border_top + 5,
                    left: (jparent.width() || 0) + parent_loc.left - 5,
                    //原版是 'show',设为1或者采用 display: 'block' 无效果
                    //说明涉及不透明度的animate有其特殊性:https://api.jquery.com/animate/
                    opacity: 'show',
                };
                // jmovable
                // 	.stop()	
                // 	.delay(2000)					//练习 (4))					
                // 	//@ts-ignore
                // 	.html(jbio.clone())	//原版是jbio.clone()
                // 	.css(startStyle as JQuery.PlainObject)
                // 	.animate(endStyle, bioEffects)
                // 	.animate({
                // 		height: jbio.height(),
                // 	}, {
                // 		easing: 'easeOutQuart',
                // 		duration: 'zippy',			//练习 (1)
                // 	}).promise().done(() => {
                // 		jparent.find('div').addClass('highlight'); //练习(3)
                // 	});
                //为了把非效果方法添加到队列,以便应用stop(),上面应修改为 :
                jmovable
                    .stop()
                    .delay(2000) //练习 (4))	
                    .queue(next => {
                    jmovable.html(jbio.html()); //原版是jbio.clone(), 需要@ts-ignore	
                    next();
                })
                    .queue(next => {
                    jmovable.css(startStyle);
                    next();
                })
                    .animate(endStyle, bioEffects)
                    .animate({
                    height: jbio.height(),
                }, {
                    easing: 'easeOutQuart',
                    duration: 'zippy', //练习 (1)
                }).promise().done(() => {
                    jparent.find('div').addClass('highlight'); //练习(3)
                });
            }
            //#endregion
            $('div.member').on('click', function () {
                const jmember = $(this);
                if (!jmember.hasClass('active')) {
                    //淡出当前可见的人物简介 bio
                    jmovable
                        //	.fadeOut();
                        .stop();
                    //淡出或者折叠上次显示的 name position location
                    jmember.siblings('.active')
                        .removeClass('active')
                        .children('div')
                        .removeClass('highlight') //for 练习(5)
                        //	.fadeOut();
                        .slideUp(); //练习(5): 折叠个人信息
                    //标记当前显示的 name position location的容器
                    //不在最后 .end.addClass(...)的原因,在于each方法
                    //后使用延迟对象, 然后再最后一个子元素动画结束后
                    //动画显示其对应的人物简介
                    //然后动画显示当前的 name position location
                    //这三个动画不进同一个队列,所以可以认为同时进行,但谁最后
                    //完成不好说, .promise()方法却可以保证在最后完成的动画后
                    //执行done方法指定的函数.
                    jmember
                        .addClass('active')
                        .find('div').css({
                        display: 'block',
                        left: '-300px',
                        top: 0,
                    })
                        //虽然animate也是隐式迭代,但不作显示迭代的话,无法逐个div设置高度(否则所有div重叠在一起)
                        // .animate({
                        // 	left: 0,
                        // 	top: 25,
                        // 	// top: function (idx: number) { //这样也不行,返回恒为0
                        // 	// 	return 25 * idx;
                        // 	// },
                        // });
                        .each((idx, ele) => {
                        //动画是基于不同的ele,所以不会排队,视觉上看,几乎同时发生
                        $(ele).animate({
                            left: 0,
                            top: 25 * idx, //无单位,默认保持px
                        }, {
                            //多属性指定缓动形式, 而不是默认的_default
                            //注意: 这里牵扯到$.easing方法, 故需要引入jquery-ui.js
                            duration: 'slow',
                            specialEasing: {
                                top: 'easeInQuart',
                                left: 'easeOutBounce', //练习(2)
                            }
                        });
                    })
                        .promise()
                        .done(showBio); //done的方法参数的this指向仍为promise调用者
                }
            });
        }
    }
});
//# sourceMappingURL=11-adv-effect.js.map