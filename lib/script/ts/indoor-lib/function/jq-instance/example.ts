//添加jQuery对象方法, 就是在$.fn(或者说$.prototype)上添加方法
($ => {
	/**
	 * 这里的注释不能看到
	 * @returns 
	 */
	$.fn.exam1 = function () {
		console.log('this is jquery method - example one.')
		return this;
	};

	$.fn.exam2 = function (s: string) {
		alert(`hello,this is jquery method - example two:${s}`);
		return this;
	}

	$.fn.swapClass1 = function (c1, c2) {
		if (this.hasClass(c1)) {
			this.removeClass(c1).addClass(c2);
		} else if (this.hasClass(c2)) {
			this.removeClass(c2).addClass(c1);
		}
		return this;
	};

	$.fn.swapClass2 = function (c1, c2) {
		return this.each((idx: number, ele: HTMLElement) => {
			$(ele).swapClass1(c1, c2);	//显示迭代
		});
	}

	$.fn.shadow1 = function () {
		return this.each(function () {
			const jele = $(this);
			for (let i = 0; i < 5; i++) {
				const offs = jele.offset() || {
					left: 0,
					top: 0,
				};
				jele.clone()
					.css({
						position: 'absolute',
						left: offs.left + i,
						top: offs.top + i,
						margin: 0,
						zIndex: -1,
						opacity: 0.2,
					}).appendTo('body');
			}
		});
	};

	$.fn.shadow2 = function (options) {
		return this.each(function () {
			const jele = $(this);
			for (let i = 0; i < options.copies; i++) {
				const offs = jele.offset() || {
					left: 0,
					top: 0,
				};
				jele.clone()
					.css({
						position: 'absolute',
						left: offs.left + i,
						top: offs.top + i,
						margin: 0,
						zIndex: -1,
						opacity: options.opacity,
					}).appendTo('body');
			}
		});
	}

	$.fn.shadow3 = function (options) {
		const opt = $.extend({}, $.fn.shadow3.defaults, options);
		return this.each(function () {
			const jele = $(this);
			for (let i = 0; i < (opt.copies || 0); i++) {
				const ele_off = jele.offset() || {
					left: 0,
					top: 0,
				};
				const off = opt.copyOffset ? opt.copyOffset(i) : {
					left: i,
					top: i,
				};
				jele.clone()
					.css({
						position: 'absolute',
						left: ele_off.left + off.left,
						top: ele_off.top + off.top,
						margin: 0,
						zIndex: -1,
						opacity: opt.opacity || 0.1,
					}).appendTo('body');
			}
		});
	}
	$.fn.shadow3.defaults = {
		copies: 6,
		opacity: 0.18,
		copyOffset: index => {
			return {
				left: index,
				top: index,
			};
		},
	};
})(jQuery);
