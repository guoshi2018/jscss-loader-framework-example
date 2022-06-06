"use strict";
($ => {
    //测试:10-adv-event.ts
    $.event.special.payoff = {
        noBubble: false,
        //1. 如果是元素自己触发,自己监听,方式为: 
        //	trigger("payoff") 或 trigger("bind-payoff"),
        //	接收事件 event.type 一致的等于 "bind-payoff"
        //2. 如果是其他元素触发,方式只能是:
        //	trigger("bind-payoff"),接收事件的type同上
        //3. 注意, 1,2 结论建立在下面的hook全部未实现(即采用默认)的基础上.
        //	如果有实现,可能结果会不一致(收不到事件通知)
        //bindType: "bind-payoff",
        // 总之这两个属性有点乱, 先不用. 以后再说
        //delegateType: "delegate-payoff",
        //#region  on方法调用引发
        /**
         * 对于每个元素,只调用一次,不管该元素是自己监听,还是代理其他元素监听
         * @param this 元素的HTMLElement. 注意继承方式:
         * 		HTMLElement->Element-Node->EventTarget
         * @param data 监听时传递给hook的数据.注意该对象被存储在jQuery.Event.data
         * 		且后续add的监听器的data会覆盖前任,即使是undefined, 但作为监听代理的data
         * 		则被忽略
         * @param namespace 文档定义是string, 其实是string[],
         * 	由于仅代表第一个监听,一般没有什么用
         * @param eventHandle 反正不是初次监听传递的响应函数
         * @return 定义文件标记为 false | void, 一般应该与teardown返回一致
         * 	false: 作为浏览器事件保存, 以便可以用attacheEvent/addEventListener监听
         *  true 或者不返回(即返回void): 不作如上保存,只能继续采用on监听
         */
        setup: function (data, namespace, eventHandle) {
            console.log('setup hook:--------------------------------');
            console.log('this ref: ', this);
            console.log('data:', data);
            console.log('namespace:', namespace);
            console.log('eventHandle:', eventHandle);
            //return false;
        },
        /**
         * 所有使用on监听时调用, 包括第一个
         * @param this 元素的HTMLElement
         * @param handleObj 包含有关event的更多信息,监听时提供的data,被存储为其data字段
         * 	而后将data和该handleObj两者同时作为event的两个字段,但注意data的覆盖问题
         */
        add: function (handleObj) {
            console.log('add hook: ---------------------');
            console.log('this ref: ', this);
            console.log('handleObj: ', handleObj);
        },
        //#endregion		
        //#region trigger方法调用引发
        /**
         * 首端trigger事件后,处理端响应前触发,在此可以修改event,data,
         * @param this 引发事件的HTMLElement(trigger元素)
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @param data 事件触发端trigger时携带的数据,不是监听端调用on携带的data
         */
        trigger: function (event, data) {
            console.log('trigger hook:-------------------------');
            console.log('this ref: ', this);
            console.log('event: ', event);
            console.log('data: ', data);
            //event.preventDefault(); //仅短接末尾的_default及page_default
            //return false;		//终止, 则处理端收不到事件通知
        },
        /**
         * 事件分发前
         * @param this 监听元素HTMLElement
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @return false:短接,直接进入_default hook
         */
        preDispatch: function (event) {
            console.log('preDispatch hook:------------------');
            console.log('this ref: ', this);
            console.log('event: ', event);
            //event.preventDefault(); //短接_default
            //return false //调至_default入口
        },
        /**
         * 默认执行 event.handleObj.handler.apply(this, [event, data]) 或者
         * 	event.handleObj.handler.call(this, event, data). 所以,如果定义了
         *  handle钩子, 且不中断响应端的事件处理, 则需要显式调用上面两句之一
         *  同样,在这里也可以调用 preventDefault跳过_default hook
         * 注意, 每个监听端有一次handle的调用
         * @param this 响应事件的HTMLElement(监听者), 即与setup hook一致
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @param data 事件触发端trigger时携带的数据,不是监听端调用on携带的data
         */
        handle: function (event, data) {
            console.log('handle hook:------------------');
            console.log('this ref: ', this);
            console.log('event: ', event);
            console.log('data: ', data);
            //event.handleObj.handler.apply(this, [event, data]);
            event.handleObj.handler.call(this, event, data);
            //条件阻止默认, 只要发生一次,则影响所有事件响应, 忽略 _default hook.
            // if ($(this).attr('class') == 'middle') {
            // 	event.preventDefault();
            // }
            //return false;//最多执行一次回调
        },
        //---------------------------------------------------------------------//
        //***********************这里是订阅端的事件响应区占位符****************//
        //---------------------------------------------------------------------//
        /**
         *
         * @param this 响应事件的HTMLElement(监听者), 即与setup hook一致
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         */
        postDispatch: function (event) {
            console.log('postDispatch hook:------------------');
            console.log('this ref: ', this);
            console.log('event: ', event);
            //event.preventDefault();
        },
        /** 在事件接收端处理完, postDispatch之后,触发该钩子,除非接收端处理时返回false或
         * 显示调用过preventDefault(),
         * @param this 注意这里的引用是: window
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @param data 事件触发端trigger时携带的数据,不是监听端调用on携带的data
         * @return false: 忽略调用上述接收端页面的默认方法(如果有);
         * 			其他: 正常调用
         */
        _default: function (event, data) {
            console.log('_default hook:------------------');
            console.log('this ref: ', this);
            console.log('event: ', event);
            console.log('data: ', data);
            //event.preventDefault();
        },
        //#endregion
        //#region off调用引发
        /**
         * off事件时调用
         * @param this 监听元素HTMLElement
         * @param handleObj 包含data,handler等字段,正确记录调用on方法时的参数
         */
        remove: function (handleObj) {
            console.log('remove hook:--------------------');
            console.log('this ref: ', this);
            console.log('handleObj: ', handleObj);
        },
        /**
         * off最后一个监听后,执行. 应释放setup中定义的资源
         * @param this 当前元素的HTMLElement
         * @returns 一般与setup相同
         */
        teardown: function () {
            console.log('teardown hook:------------------------');
            console.log('this ref: ', this);
            //return false;
        },
        //#endregion
        description: 'this is my first extended event as an example',
    };
    /**
     * 扩展的事件: 经节流响应的垂直滚动条滚动事件
     */
    $.event.special.throttledScroll = {
        //#region  on方法调用引发
        /**
         * 对于每个元素,只调用一次,不管该元素是自己监听,还是代理其他元素监听
         * @param this 元素的HTMLElement
         * @param data 监听时传递给hook的数据.注意该对象被存储在jQuery.Event.data
         * 		且后续add的监听器的data会覆盖前任,即使是undefined, 但作为监听代理的data
         * 		则被忽略
         * @param namespace 文档定义是string, 其实是string[],
         * 	由于仅代表第一个监听,一般没有什么用
         * @param eventHandle 反正不是初次监听传递的响应函数
         * @return 定义文件标记为 false | void, 一般应该与teardown返回一致
         * 	false: 作为浏览器事件保存, 以便可以用attacheEvent/addEventListener监听
         *  true 或者不返回(即返回void): 不作如上保存,只能继续采用on监听
         */
        setup: function (data, namespace, eventHandle) {
            let timer = 0;
            $(this).on('scroll.throttledScroll', function (evt) {
                if (!timer) {
                    timer = setTimeout(() => {
                        //triggerHandler优势: 仅自身监听得到;忽略trigger _default钩子
                        $(this).triggerHandler('throttledScroll'); //this需要穿透
                        //$(this).trigger('throttledScroll');
                        timer = 0;
                    }, 280);
                }
            });
            //return false;
        },
        /**
         * 所有使用on监听时调用, 包括第一个
         * @param this 元素的HTMLElement
         * @param handleObj 包含有关event的更多信息,监听时提供的data,被存储为其data字段
         * 	而后将data和该handleObj两者同时作为event的两个字段,但注意data的覆盖问题
         */
        add: function (handleObj) {
        },
        //#endregion		
        //#region trigger方法调用引发
        /**
         * 首端trigger事件后,处理端响应前触发,在此可以修改event,data,
         * @param this 引发事件的HTMLElement(trigger元素)
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @param data 事件触发端trigger时携带的数据,不是监听端调用on携带的data
         */
        trigger: function (event, data) {
            //event.preventDefault(); //仅短接末尾的_default及page_default
            //return false;			//终止, 则处理端收不到事件通知
        },
        /**
         * 事件分发前
         * @param this 监听元素HTMLElement
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @return false:短接,直接进入_default hook
         */
        preDispatch: function (event) {
            //event.preventDefault(); //仅短接末尾的_default及page_default
            //return false 		//跳至_default入口
        },
        /**
         * 默认执行 event.handleObj.handler.apply(this, [event, data]) 或者
         * 	event.handleObj.handler.call(this, event, data). 所以,如果定义了
         *  handle钩子, 且不中断响应端的事件处理, 则需要显式调用上面两句之一
         *  同样,在这里也可以调用 preventDefault跳过_default hook
         * 注意, 每个监听端有一次handle的调用
         * @param this 响应事件的HTMLElement(监听者), 即与setup hook一致
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @param data 事件触发端trigger时携带的数据,不是监听端调用on携带的data
         */
        handle: function (event, data) {
            event.handleObj.handler.apply(this, [event, data]);
        },
        //---------------------------------------------------------------------//
        //***********************这里是订阅端的事件响应区占位符****************//
        //---------------------------------------------------------------------//
        /**
         *
         * @param this 响应事件的HTMLElement(监听者), 即与setup hook一致
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         */
        postDispatch: function (event) {
            //event.preventDefault();
        },
        /** 在事件接收端处理完, postDispatch之后,触发该钩子,除非接收端处理时返回false或
         * 显示调用过preventDefault(),
         * @param this 注意这里的引用是: window
         * @param event 事件对象,包含但不限于data,以及本身已经包含data的handleObject
         * @param data 事件触发端trigger时携带的数据,不是监听端调用on携带的data
         * @return false: 忽略调用上述接收端页面的默认方法(如果有);
         * 			其他: 正常调用
         */
        _default: function (event, data) {
            //event.preventDefault();
        },
        //#endregion
        //#region off调用引发
        /**
         * off事件时调用
         * @param this 监听元素HTMLElement
         * @param handleObj 包含data,handler等字段,正确记录调用on方法时的参数
         */
        remove: function (handleObj) {
        },
        /**
         * off最后一个监听后,执行. 应释放setup中定义的资源
         * @param this 当前元素的HTMLElement
         * @returns 一般与setup相同
         */
        teardown: function () {
            $(this).off('scroll.throttledScroll');
            //return false;
        },
        //#endregion
        description: 'this is my extension event pattern.',
    };
    /**
     * 利用超时器(类似于节流),完成的鼠标三击事件
     */
    $.event.special.tripleclick1 = {
        setup: function () {
            let timer = 0;
            let click_count = 0;
            $(this).on('click.tripling1', function () {
                if (!timer) {
                    click_count++;
                    console.log('click_count:', click_count);
                    timer = setTimeout(() => {
                        if (click_count >= 3) {
                            console.log('now condition ready!');
                            //如果不采用箭头函数向上穿透寻找this, function()形式则为window
                            $(this).triggerHandler('tripleclick1', click_count);
                            click_count = 0;
                        }
                        timer = 0;
                        console.log('coming please...');
                    }, 500);
                }
            });
        },
        teardown: function () {
            console.log('free resource for tripleclick1');
            $(this).off('click.tripling1');
        }
    };
    /**
     * 利用定时器(类似于节流),完成的鼠标三击事件
     */
    $.event.special.tripleclick2 = {
        setup: function () {
            let jlistener = $(this);
            let click_count = 0;
            jlistener.on('click.tripling2', function () {
                click_count++;
            });
            //定时器保存在element的data属性里,以便teardown时清理
            jlistener.data('timer', setInterval(() => {
                console.log('click count:', click_count);
                if (click_count >= 3) {
                    console.log('capture a tripleclick...');
                    jlistener.triggerHandler('tripleclick2', click_count);
                    click_count = 0;
                }
            }, 500));
        },
        teardown: function () {
            console.log('free resource for tripleclick2');
            clearInterval($(this).off('click.tripling2').data('timer'));
        }
    };
    $.event.special.mousemovehalt = {
        /**
         *
         */
        setup: function (options, namespace) {
            const opt = $.extend(true, {}, {
                delay: 300, // 默认停顿声明
            }, options);
            let timer = 0;
            $(this).on('mousemove.mousemovehalt', function (evt) {
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                timer = setTimeout(() => {
                    $(this).triggerHandler('mousemovehalt'); //this需要穿透
                    timer = 0;
                }, opt.delay);
            });
        },
        teardown: function () {
            $(this).off('mousemove.mousemovehalt');
        }
    };
})(jQuery);
//# sourceMappingURL=ext-event.js.map