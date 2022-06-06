
interface SimpleTooltipOptions {
	/**
	 * true:已禁用
	 * false:已启用
	 * undefined:未创建或已删除
	 */
	disabled?: boolean;
	/**
	 * tooltip左上角相对于元素左下角的位置(by pixes)
	 */
	location?: JQuery.Coordinates;
	/**
	 * 返回提示内容的
	 * @param thisArg: 触发tooltip的html元素: 
	 */
	content?: (this: HTMLElement) => any;
}


/**
 * guoshi-tooltip的创建使用的属性
 */
interface WidgetGuoshiSimpleTooltipProperties extends JQueryUI.WidgetCommonProperties {
	// element: JQuery;
	// defaultElement: string;
	// document: Document;
	// namespace: string;
	// uuid: string;
	// widgetEventPrefix: string;
	// widgetFullName: string;
	// window: Window;
	version: string;
	options: SimpleTooltipOptions;

	_create: () => void;
	_open: () => void;
	_close: () => void;
	_trigger: (eventName: string) => void;
	enable: () => void;
	disable: () => void;
	destroy: () => void;
	open: () => void;
	close: () => void;

	test1: () => void;
	test2: () => void;

	/**
	 * 鼠标移动到元素时,用做临时显示内容的容器
	 */
	_jtip: JQuery;

	disabled: () => boolean
}


interface SimpleTooltipStatic {
	/**
	 * 简单tooltip, 采用默认值
	 */
	(): JQuery;

	(options: SimpleTooltipOptions): JQuery;

	/**
	 * 对simple tooltip ,采取相应的行为, 为以下字串之一:
	 * 实验证明, 下划线开头的方法名称,例如_open/_close,即使这里声明,ts验证通过,
	 * 但仍然无法访问,导致异常发生
	 * ```
	 * destroy:销毁
	 * enable:启用
	 * disable:禁用
	 * ```
	 */
	(action: 'destroy' | 'enable' | 'disable' | 'open' | 'close' | 'test1' | 'test2'): JQuery;


	/**
	 * 判断是否被禁用
	 * ```
	 * disabled: widget当前是否禁用
	 * true:  	当前为禁用状态
	 * false:  	 当前为启用状态
	 * undefined:  当前为未定义状态, 原因可能为部件未创建或已销毁
	 * ```
	 */
	(question: 'disabled'): boolean;
}


interface JQuery {
	simpleTooltip: SimpleTooltipStatic;
}
