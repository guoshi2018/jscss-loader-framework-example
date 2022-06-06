
declare namespace Guoshi {
	interface GuoshiStatic {
		/**
		 * 数学相关
		 */
		Math: {
			/**
			 * 求和
			 */
			sum: (arr: number[] | string[] | Array<number | string>) => number;
			/**
			 * 求平均值
			 */
			avg: (arr: number[] | string[] | Array<number | string>) => number;
		},
		/**
		 * html相关
		 */
		Html: {
			/**
			 * 配置点击html文档空白处,刷新文档内容
			 */
			clickBlankToRefreshDocment: () => void;
			/**
			 * 竖直滚动条是否已经到底, 兼容性可能存在问题
			 * 实测到底时满足: 滚动条位置与窗口高度之和等于文档整个高度 - 0.5
			 * @deprecated 请使用 scrollBarBottomed
			 */
			scrollBarAtBottom: () => boolean;

			/**
			 * 竖直滚动条是否已经到底
			 * 实测到底时满足: 滚动条位置与窗口高度之和等于文档整个高度 - 0.5
			 */
			scrollBarBottomed: () => boolean;

			/**
			 * 滚动条是否出现并可用, 虽然兼容性可能存在问题, 但目前表现还是精确
			 */
			isScrollBarActive: () => boolean;

			/**
			 * 滚动条是否出现并可用
			 * @deprecated 计算上有较大误差, 如果作为条件判断, 某些情况下
			 * 可能会影响其他功能的实现 所以, 强烈建议请使用isScrollBarActive
			 * 2022.05.26, 已将该方法变更为内部调用 isScrollBarActive
			 */
			scrollBarActived: () => boolean;

			/**
			 * 获取元素上鼠标相对于元素左上角的坐标的相对坐标
			 * @param ele 元素
			 * @param evt 包含鼠标位置的基础事件对象
			 * @returns 相对坐标
			 */
			relLocFrom: (ele: HTMLElement, evt: JQuery.MouseEventBase) => JQuery.Coordinates;
		},
		/**
		 * 杂项
		 */
		Misc: {
			/**
			 * 模拟多线程的sleep方法, 延迟一段时间后执行后面的语句
			 * @param delay 需要延迟的时间, 毫秒计算
			 */
			sleep: (delay: number) => Promise<string>;
		}
	}

	/**
	 * 容器, 包含多个不同的方法. 这些方法根据td内包含的数据类型的不同,得到不同的比较关键字
	 */
	interface SortKeyMethodContainer {
		[name: string]: (jele: JQuery<HTMLElement>) => string | Date | number;
	}
}



declare const Guoshi: Guoshi.GuoshiStatic;
// export = Guoshi;
// export as namespace Guoshi;


