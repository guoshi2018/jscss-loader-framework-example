
($ => {
	/**
	 * 不考虑嵌套表格
	 * @returns 
	 */
	$.fn.cellsByColumn = function () {
		let jcells_group = $(); //记录多个cell各自对应的列, 所包含的多个cell组
		this.each(function () {
			//显示迭代, 获取某个cell对应的列, 该列包含的所有cell
			const jtd = $(this).closest('td,th') as JQuery<HTMLTableCellElement>;//包括自身,向上查找,直到找到td或th
			if (jtd.length) { //找到, length最多也就是1
				const colIdx = jtd[0].cellIndex + 1; //所在列的序号,nth-child使用的索引从1开始
				const jcells = jtd.closest('table')
					.find('td,th')
					.filter(`:nth-child(${colIdx})`);
				jcells_group = jcells_group.add(jcells);
			}
		});
		return this.pushStack(jcells_group);//提供链式调用, 并保持dom元素栈完整正确
	}
})(jQuery);