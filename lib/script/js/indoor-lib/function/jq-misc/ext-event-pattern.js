"use strict";
($ => {
    /**
     * 扩展事件模板
     */
    $.event.special.event_pattern = {
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
            //return false;
        },
        //#endregion
        description: 'this is my extension event pattern.',
    };
})(jQuery);
//# sourceMappingURL=ext-event-pattern.js.map