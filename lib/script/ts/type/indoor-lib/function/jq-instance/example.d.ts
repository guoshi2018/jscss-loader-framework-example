

declare namespace ShadowStatic { //namespace名称在实现文件中不可见,仅仅是智能感知
	namespace Shadow2 {
		/**
		 * 自定义阴影选项, 用于shadow2方法
		 */
		interface Options {
			/**
			 * 用来生成阴影的元素拷贝数量
			 */
			copies: number,
			/**
			 * 各阴影的不透明度
			 */
			opacity: number,
		}
	}
	namespace Shadow3 {

		/**
		 * 自定义阴影选项, 用于shadow3方法
		 */
		interface Options {
			/**
			 * 用来生成阴影的元素拷贝数量
			 */
			copies?: number,
			/**
			 * 各阴影的不透明度
			 */
			opacity?: number,

			/**
			 * 元素的各部分拷贝, 与原元素的相对偏移(坐标表示)
			 */
			copyOffset?: (index: number) => JQuery.Coordinates,
		}
	}
}


interface Shadow3 {
	/**
	 * 使用暴力js, 达到元素阴影的目的
	 */
	(options?: ShadowStatic.Shadow3.Options): JQuery;
	/**
	 * 选项的默认值
	 */
	defaults?: ShadowStatic.Shadow3.Options;
}

interface JQuery {
	/**
	 * 为jquery实例添加的测试方法1, 在控制台上打印
	 * @returns jquery对象自身
	 */
	exam1: () => JQuery;
	/**
	 * 为jquery实例添加的测试方法1, 显示对话框
	 * @param s 要回显的相关字符串
	 * @returns jquery对象自身
	 */
	exam2: (s: string) => JQuery;

	/**
	 * 为jquery对象, 交换css类, 如果c1,c2均不包含,则忽略该操作
	 * @param c1: 作为互换的第一个css类型
	 * @param c2: 作为互换的第二个css类型
	 * @return jquery对象自身
	 * @deprecated 该函数由于内部没有迭代, 故作为条件判断的元素仅仅是第一个元素,
	 * 而, removeClass addClass内部则使用了隐式迭代, 故结果错误. 正确方法为
	 * swapClass2
	 */
	swapClass1: (c1: string, c2: string) => JQuery;

	/**
	 * 作为swapClass1的更正版本: 为jquery对象, 交换css类, 如果c1,c2均不包含,则忽略该操作.
	 * @param c1: 作为互换的第一个css类型
	 * @param c2: 作为互换的第二个css类型
	 * @return jquery对象自身
	 */
	swapClass2: (c1: string, c2: string) => JQuery;

	/**
	 * 使用js模拟的阴影效果, 无参函数示范
	 */
	shadow1: () => JQuery;

	/**
	 * 使用js模拟的阴影效果, 带参函数示J
	 * @param options 控制阴影细节的选项对象
	 */
	shadow2: (options: ShadowStatic.Shadow2.Options) => JQuery;

	/**
	 * 同shadow2,但是添加偏移的值回调选项, 且加入默认选项对象
	 */
	shadow3: Shadow3; //需要在方法下定义默认选项对象属性, 所以单独定义一个接口(类型)
}


