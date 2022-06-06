


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
	//由于jquery3以上,删除了jQuery.event.props和jQuery.event.fixHooks.而jquery-mobile用到这些属性
	//所以,有必要将jquery降级使用
	globalRes: '/lib/script/json/mobile-global.json',

	//是否启用调试
	debug: true, //默认false

	//在此添加本入口文件需要包含的js css文件全路径,默认[]
	//页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
	//必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
	privateRes: [
		[
			'/lib/style/scss/7-use-plugin/main.css',
			'/lib/external-core/jquery-plugin/jquery.mobile-1.4.5/jquery.mobile-1.4.5.css',
			'/lib/external-core/jquery-plugin/jquery.mobile-1.4.5/jquery.mobile-1.4.5.js',

		]
	],

	//业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
	main: () => {
		//to do
		//configBooks();


		/**
		 * 配置
		 */
		function configBooks() {
			type BookInfo = {
				filename: string,
				title: string,
				author: string,
			};
			const imgBaseUrl = '/lib/image/jpg/7-use-plugin';
			const books: BookInfo[] = [{
				filename: '(01).jpg',
				title: 'asp+sql server之动态网站',
				author: '龙马工作室',
			}, {
				filename: '(02).jpg',
				title: '软件设计师考试疑难问题解答',
				author: '王勇,张友生',
			}, {
				filename: '(03).jpg',
				title: '21天学通C++',
				author: 'Jesse Liberty',
			}, {
				filename: '(04).jpg',
				title: '编程高手箴言',
				author: '梁肇新',
			}, {
				filename: '(05).jpg',
				title: '计算机系统结构',
				author: '郑伟民 汤志忠',
			}, {
				filename: '(06).jpg',
				title: 'ASP.NET MVC 5 高级编程(第五版)',
				author: 'Jon Galloway,Brad Wilson',
			}, {
				filename: '(07).jpg',
				title: '从零开始 SQL Server中文版基础培训教程',
				author: '老虎工作室',
			}, {
				filename: '(08).jpg',
				title: 'Red Hat Linux9 全面掌握',
				author: '易丽贵',
			}, {
				filename: '(09).jpg',
				title: 'ASP.NET 2.0 高级编程',
				author: 'Bill Evjen,Scott Hanselman Devin Rader',
			}, {
				filename: '(10).jpg',
				title: '.NET 框架程序设计(修订版)',
				author: 'Jeffrey Richter',
			}, {
				filename: '(11).jpg',
				title: '软件设计师考试历年试题分析与解答',
				author: '考试研究组',
			}, {
				filename: '(12).jpg',
				title: 'DotNetNuke4 高级编程',
				author: 'Shaun Walker,Joe Brinkman,Bruce Hopkins',
			}, {
				filename: '(13).jpg',
				title: 'Java编程一步到位',
				author: '王铁敬',
			}, {
				filename: '(14).jpg',
				title: 'Windows核心编程',
				author: 'Jeffrey Richter',
			}];

			const jdivBook = $('<div data-role="page"/>')
				.appendTo('body')
				.append('<div data-role="header"><h4>Select a book</h4></div>');
			const jul = $('<ul/>');
			books.forEach(book => {
				$(`
					<li>
						<a href="${imgBaseUrl}/${book.filename}" title="${book.author}">${book.title}</a>
					</li>
					`).appendTo(jul);
			});
			$('<div data-role="content"/>').wrapInner(jul).appendTo(jdivBook);
		}
	}
});