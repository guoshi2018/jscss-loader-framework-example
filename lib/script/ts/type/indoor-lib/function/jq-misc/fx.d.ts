
/**
 * 补充官方定义
 */
declare namespace JQuery {

	interface Effects {
		/**
		 * 官方.d.ts中未包含的效果速度选项
		 */
		readonly speeds: {
			/**
			 * 慢速, 系统设置为600ms(用户可更改)
			 */
			slow: number;
			/**
			 * 快速, 系统设置为200ms(用户可更改)
			 */
			fast: number;
			/**
			 * 默认速度, 应用在未提供或者无需提供速度参数的方法中
			 * 系统设置为400ms(用户可更改)
			 */
			_default: number;
			/**
			 * 自定义速度
			 * @param key 自定义的名称
			 */
			[key: string]: number;
		}
	}
	/**
	 * 但由于JQuery.Duration是type,而非interface,无法合并.所以node_module中
	 * @types/jquery/misc.d.ts中的第3478行的声明:
	 * type Duration = number | 'fast' | 'slow';
	 * 已被注释.现将其统一定义于此
	 */
	type Duration = number | 'fast' | 'slow' | string;
}