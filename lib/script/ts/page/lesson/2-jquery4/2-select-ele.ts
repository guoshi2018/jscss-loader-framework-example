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

	//是否启用调试
	debug: true, //默认false

	//在此添加本入口文件需要包含的js css文件全路径,默认[]
	//页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
	//必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
	privateRes: [
		[
			'/lib/style/css/2-jquery4/default.css',
			'/lib/style/css/2-jquery4/2-select-ele.css',
		]

	],
	//业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
	main: () => {
		//2. to do
		//2、to do
		//顶级列表项排列方向切换
		$('#hor-list').click(() => {
			//$('#selected-plays > li').addClass('horizontal');
			$('#selected-plays > li').toggleClass('horizontal');
		})

		//非水平方向排列的列表项背景色切换
		$('#bk-list').click(() => {
			$('#selected-plays li:not(.horizontal)').toggleClass('sub-level');
		});

		//<input "为不同链接添加合适的样式" />
		$('#link-style').click(() => {
			$('a[href^="mailto:"]').toggleClass('mailto');
			$('a[href$=".pdf"]').toggleClass('pdflink');
			$('a[href^="http"][href*="henry"]').toggleClass('henrylink');
		});

		//<input "使用eq(1)选择全局范围下的第二个li元素"/>
		$('#eq-firstli-bold').click(() => {
			$('li:eq(1)').toggleClass('bold italic ');
		});

		//<input "使用nth-child(2)选择所有作为其父元素的第二个子元素的li"/>
		$('#nth-firstli-bold').click(() => {
			$('li:nth-child(2)').toggleClass('bold italic');
		});

		//<input value="为整体范围内的奇数行添加背景(不包含表头)"/>
		$('#odd-tr-alt-global').click(() => {
			$('tbody > tr:even').toggleClass('odd'); //:eq :odd :even均为0索引,所以标称偶数为实际的奇数
		})

		//<input value="为各自表格的奇数行添加背景(不包括表头)"/>
		$('#odd-tr-alt-local').click(() => {
			$('tbody > tr:nth-child(odd)').toggleClass('odd');//nth-child为1索引
		});

		//<input type="button" id="henry-highlight" value="选择提到Henry的表格"/>
		$('#henry-highlight').click(() => {
			$('tbody > tr > td:contains(Henry)').toggleClass('highlight');
		});

		//<input type="button" id="filter-link" value="使用filter选择外链"/>
		$('#filter-link').click(() => {
			const jqExternal_links = $('a').filter(function (idx: number, ele: HTMLElement) {
				const anchor = ele as HTMLAnchorElement;
				console.log(idx, anchor.href, anchor.host, anchor.hostname, location.hostname);
				return anchor.hostname != location.hostname;
			});
			console.log('result is :', jqExternal_links.length);
			jqExternal_links.toggleClass('external');
		});

		//<input "选择包含henry或tragedy的表格的下一单元格和上一单元格"/>
		$('#henry-next').click(() => {
			const t = $('td:contains(Henry),td:contains(Tragedy)');
			//注意:next()和prev()均只找平级且同一父元素下的兄弟元素,即使选择符选择范围为全局
			t.next().toggleClass('highlight');
			t.prev().toggleClass('highlight');
			//nextAll prevAll addBack 用法略
		});

		//<input type="button" id="get-anchor-dom" value="获取链接dom元素"/>
		$('#get-anchor-dom').click(() => {
			const anc2 = $('a').get(2);
			const anc3 = $('a')[3];
			console.log(anc2, anc3);
		});
	}
});





/*
// Add a class to top-level list items.
$(document).ready(function() {
	$('#selected-plays > li').addClass('horizontal');
	$('#selected-plays li:not(.horizontal)').addClass('sub-level');
});

// Add a class to all mailto and pdf links on the page.
$(document).ready(function() {
	$('a[@href^="mailto:"]').addClass('mailto');
	$('a[@href$=".pdf"]').addClass('pdflink');
	$('a[@href*="mysite.com"]').addClass('mysite');
});

// Give classes to even and odd table rows for zebra striping.
$(document).ready(function() {
	$('th').parent().addClass('table-heading');
	$('tr:not([th]):even').addClass('even');
	$('tr:not([th]):odd').addClass('odd');
	$('td:contains("Henry")').siblings().addClass('highlight');
});
*/