/**
 * 注意, 自定义选择符, 由于index始终为0, 导致该选择符创建失败. 不知何故
 * 解决方案: 采用matches数组的某个闲置元素(比如索引10)存储递增的被检测的HTMLElement元素序号
 * 缺点, 对于同一个jquery语句,即使matches数组不变, 因而删除存储的序号一直递增, 导致不能重复使用
 */
($ => {
	$.extend($.expr.pseudos, {
		/**
		 * 创建形如 :group(3) 或 :group(4) 选择符, 
		 * 指示隔3个或四个元素选择3个或四个 用法见:9-adv-selector.ts
		 * @param element 当前考虑的DOM元素
		 * @param index 当前DOM元素在在原结果集中的索引
		 * @param matches 用于解析这个选择符的正则表达式的解析结果.
		 * 		一般matches[3]唯一有用.例如 :group(bill), 则matches[3]就代表文本bill
		 * 		由于上面的index始终为0, 导致该选择符创建失败.所以, 采用matches数组的
		 * 		某个闲置元素(比如索引10) 存储递增的被检测的HTMLElement元素序号
		 * @param set 匹配到当前元素的整个DOM元素集合. 很少用
		 * @returns true:选择当前元素, false:不选择
		 * @description :group(num), 其中num为正数时, 开始(几)被选择, 然后隔(几)行选择,
		 * 		num为负数时, 则相反
		 * @deprecated 缺点, 对于同一个jquery语句, 即使matches数组不变, 
		 * 		因而删除存储的序号一直递增, 导致不能重复使用
		 */
		group: function (element: HTMLElement, index: number,
			matches: Array<any>, set: HTMLElement[]): boolean {

			matches[10] = matches[10] || 0; //存储当前被检测的HTMLElement元素序号
			const num = typeof matches[3] == 'string' ? parseInt(matches[3], 10) : matches[3];

			let ok = false;
			if (!isNaN(num) && num != 0) {
				console.log(matches[10]);
				const absNum = Math.abs(num);
				const ok1 = matches[10] % (absNum * 2) < absNum;
				const ok2 = num > 0;
				ok = (ok1 && ok2) || (!ok1 && !ok2); //没有找到javascript的同或/异或运算符
			}

			matches[10]++;	//准备下一个
			console.log(matches[10], set);
			return ok;
		},
	})
})(jQuery);