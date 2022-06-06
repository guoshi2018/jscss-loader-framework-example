


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

	//globalRes: 默认包含全局必要资源的json文件 '/lib/script/json/global.json',一般不用修改

	//是否启用调试
	debug: true, //默认false

	//在此添加本入口文件需要包含的js css文件全路径,默认[]
	//页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
	//必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
	privateRes: [
		[
			'/lib/external-core/jquery-ui-1.13.1.custom/jquery-ui.css',
			'/lib/style/scss/7-use-plugin/main.css',
		], [
			'/lib/external-core/jquery-plugin/jquery.cycle.all.js',
			'/lib/external-core/jquery-plugin/jquery.cookie.js',
			'/lib/external-core/js-cookie/js.cookie.js',
			'/lib/external-core/jquery-ui-1.13.1.custom/jquery-ui.js',
		]
	],

	//业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
	main: () => {
		//to do
		//runJqueryCookie();
		//runJsCookie1();
		//runJsCookie2();
		runBook();

		/**
		 * 测试jquery.cookie插件
		 * 文档参见:https://github.com/carhartl/jquery-cookie
		 */
		function runJqueryCookie() {
			$.cookie.raw = false; //对空格等字符的编码有影响
			const rst1 = $.cookie('ck 1', 'hello+_yes');
			const rst2 = $.cookie('ck-2', 'world');
			const rst3 = $.cookie('ck 3', 'sit down', {
				expires: 8,
				path: '/',
				secure: false,
			});
			console.log('其实赋值有返回值,为各个cookie的对应字串:', rst1, rst2, rst3);
			console.log($.cookie('ck-2'));
			console.log(document.cookie);


			$.cookie('ck-88', {});

			$.cookie('ck-1', null);
			$.removeCookie('ck-2');


			console.log(
				$.cookie('ck-1'),		//未删除,只不过值为null
				$.cookie('ck-2'),		//undefined,已经删除
				$.cookie('ck-3'),		//正常存在
				$.cookie('no-such-cookie'), //undefined
				$.cookie());			//从这里也看得出,ck-1 ck-3均存在

		}

		/**
		 * 测试js-cookie库
		 * 文档参见:https://github.com/js-cookie/js-cookie
		 */
		function runJsCookie1() {
			Cookies.set('guoshi-1', 'v-1');
			Cookies.set('guoshi-2', 'v-2', {
				expires: 7,
			});
			Cookies.set('guoshi-3', 'v-3', {
				expires: 17,
				path: "",
			});

			console.log(
				Cookies.get('guoshi-1'), // 'v-1'
				Cookies.get('no-such'), //undefined
				Cookies.get(),		//all cookies

				//可以获取到 'v-3',即给定的选项被忽略
				//@ts-ignore
				Cookies.get('guoshi-3', {
					domain: 'www.guoshi.com',
				}),
			)
			console.log('用document.cookie表达的所有cookie值,是不包含选项的:', document.cookie);

			Cookies.remove('guoshi-2');	//successfully
			Cookies.remove('guoshi-3');	//fail
			Cookies.remove('guoshi-3', {  //fail
				path: '/',
			});
			Cookies.remove('guoshi-3', { //successfully 需要path和domain与创建时一致即可
				expires: 18,
				path: "",
			});

			console.log(Cookies.get());

			//@ts-ignore
			const CookieManager = Cookies.noConflict();
			CookieManager.set('gx-123', 'hello,world');
			console.log('让渡Cookies命名空间后:', CookieManager.get());
			console.log('现在查看Cookies命名空间应该是未定义:', Cookies);

			//定义cookie时,域名如果自定义,获取/删除时也应该与之匹配
			CookieManager.set('dm-1', '104', {
				domain: 'www.guoshi-hello.com',
			});
			console.log('获取未指定域名的cookie,得到undefined:',
				CookieManager.get('dm-1'),	//undefined
			);
		}

		function runJsCookie2() {
			// Cookies.set('qiumoniy-please', 'this is right', {
			// 	expires: 130,
			// 	//path: '/lib/external-core',
			// 	secure: false,
			// 	//		domain: '.guoshi.com',
			// 	//	sameSite: "Lax",
			// 	// otherOpt: {
			// 	// 	a: 1,
			// 	// 	b: 2,
			// 	// 	name: 'John Williams',
			// 	// },
			// });
			Cookies.remove('amany');
			console.log('实际通过document.cookie得到的是:', document.cookie);
			console.log('说明:document.cookie在执行追加操作时,检查到非法cookie,则忽略');
		}

		function runBook() {
			configBooks();
			const jbooks = $('ul#books');

			//demo1();
			//demo2();
			//demo3();
			//demo4();

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

				//target model, append to body tag:
				/*
						<section class="books">
							<ul id="books">
								<li>
									<div class="item">
										<img src="/lib/image/jpg/7-use-plugin/(01).jpg" />
										<div class="info">
											<div class="title">asp+sql server之动态网站</div>
											<div class="author">人民邮电</div>								
										</div>									
									</div>
								</li>
							</ul>
						</section>
				*/
				const jsecBook = $('<section class="books"/>')
					.appendTo('body');
				const jul = $('<ul id="books"/>').appendTo(jsecBook);
				books.forEach(book => {
					$(`
					<li>
						<div class="item">
							<img src="${imgBaseUrl}/${book.filename}" alt="${book.title}" title="${book.title}" />
							<div class="info">
								<div class="title">${book.title}</div>
								<div class="author">${book.author}</div>						
							</div>						
						</div>
					</li>
					`).appendTo(jul);
				});

				//暂停/恢复切换按钮
				$('<button class="test">test cycle event</button>')
					.click(function () {
						//	jbooks.cycle('pause');
						//jbooks.cycle('toggle'); //在pause和resume之间切换

						//the next transition will occur immediately.
						jbooks.cycle('toggle', true);
						//@ts-ignore
						$.cookie('cyclePaused', jbooks.get(0)?.cyclePause);
						//		console.log('paused changed:', $.cookie());
						$(this).effect('shake', {		//jquery ui
							distance: 10,
						})
					})
					//@ts-ignore
					.button({
						icons: {
							primary: '.ui-icon-video',
						}
					})
					//@ts-ignore
					.appendTo(jsecBook);

				//借助于jquery-ui,实现原生jquery的对应方法不支持的动画
				//颜色动画, 
				jul.hover(function () {
					console.log('enter');
					$(this).find('.title').animate({
						backgroundColor: "blue",
						color: "yellow",
					}, 1000);
				}, function () {
					console.log('leave');
					$(this).find('.title').animate({
						backgroundColor: 'green',
						color: 'red',
					}, 1000);
				})
					.click(function () {
						//@ts-ignore
						$('img', $(this)).toggleClass('low-vis', 8000);//原生不支持时限
						$('.title', $(this)).slideToggle(5000, 'easeInExpo');//原生不支持缓动参数
					});

				$('img', jul).resizable().draggable();
				jul.draggable();

				$('<div id="my-slider"></div>').slider({
					min: 0,
					max: $('img', jul).length - 1,
					//@ts-ignore
					slide: function (evt, ui) {
						//console.log(evt, ui);
						jbooks.cycle(ui.value?.toString());
					}
				}).appendTo(jsecBook);
			}

			demo4();

			/**
			 * 最简单的调用
			 */
			function demo1() {
				jbooks.cycle();
			}

			/**
			 * 带部分配置参数
			 */
			function demo2() {
				jbooks.cycle({
					timeout: 1500,
					speed: 3000,
					pause: true,
				});
			}

			/**
			 * 修改默认的配置参数
			 */
			function demo3() {
				//@ts-ignore
				Object.assign($.fn.cycle.defaults, {
					timeout: 3000,
					random: true,
					pause: true,

					//fade(by default)|scrollUp|scrollDown|scrollLeft|scrollRight|shuffle
					//blindX|blindY|cover|curtainX|curtainY|growX|growY|scrollHorz|scrollVert
					//slideX|slideY|turnUp|turnDown|turnRight|wipe|zoom
					//You specify the effect name by either passing a string to the 
					//cycle method or by using an options object and setting the 
					//fx property to the name of the desired effect.
					fx: 'turnRight',
					after: (...rest: any[]) => {
						//console.log('rest:', rest);
					}
				});
				jbooks.cycle();
			}

			/**
			 * 使用jquery.cookie插件,记忆上次状态,
			 */
			function demo4() {
				//@ts-ignore
				Object.assign($.fn.cycle.defaults, {
					timeout: 1000,
					pause: false,
					fx: 'zoom',
				});
				jbooks.cycle({
					before: function () {
						//@ts-ignore
						$('#my-slider').slider('value', $('li', jbooks).index(this));
					}
				});
				//console.log('last paused state:', $.cookie());
				if ($.cookie('cyclePaused') == '1') {//为 '1' 或 '0'
					jbooks.cycle('pause');
				}
			}
		}
	}
});