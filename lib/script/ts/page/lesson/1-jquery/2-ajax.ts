
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
* 调试完毕，可考虑将 __DEBUG__ 设为 false，以关闭加载的调试信息
* *******************************************************************************************************/

//注意,2022.04.06股东会决议: 抛弃jQuery.ajax, 启用dom fetch方法



JscssLoader.getInstance().startEntry({

	//globalRes: 默认包含必要脚本的文件 '/lib/script/json/global.json',一般不用修改
	//null 或 空字符串 '' 或 输入路劲不存在, 则放弃公共先决资源文件的加载

	//是否启用调试
	debug: true, //默认false

	//1. 在此添加本入口文件需要包含的js css文件全路径,默认[]
	//必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
	privateRes: [
		[
			'/lib/style/css/2-jquery4/default.css',
			'/lib/style/css/2-jquery4/1-intro.css',
		]
	],
	//业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
	main: () => {
		const remote_domain = "https://localhost:7018/";

		base_demo();
		//   check_datatype_demo();
		//contentType_demo();
		//serialize_form_demo();
		//jsonp_demo();


		function base_demo() {
			$('.base_demo input[type="button"]').click(function () {
				console.log('start to ajax by get');
				let jresult = $('div.ajax-result').empty();
				let jtitle = $('<h1>').appendTo(jresult);
				let jcontent = $('<h5>').appendTo(jresult);
				let jtail = $('<addr>').appendTo(jresult);

				$.ajax({
					async: true,     //default to true
					cache: true,    //default to true
					//       context:jresult[0],    //default to self object here.
					//       timeout:              //default unknown currently

					url: remote_domain + "WeatherForecast",
					// data: {
					// 		id: 12,
					// },
					type: "GET",    //POST | GET | PUT | DELETE,defaut to GET 
					//dataType: "json", //expect back.默认由jQuery检查响应的MIME type.
				})
					// .done(function(data){
					//  //   $(".ajax-result").text(JSON.stringify(data)); //val() 也ok
					// }

					.done(data => {
						jtitle.text(data.code);
						jcontent.text(data.message);
					})
					.fail((xhr, status, error) => {
						jtitle.text(status);
						jcontent.text("info:" + error + ",xhr:" + JSON.stringify(xhr));
					})
					//         .always((xhr, status) => {
					.always(function (xhr, status) {
						jtail.text("complete.status:" + status + ",xhr:" + JSON.stringify(xhr));
						console.log('context:', xhr);
					}
					);

				console.log('look here');
			});
		}

		/**
		//  * 核实简便ajax方法,默认使用的dataType
		//  * 结论:
		//  *      contentType:请求方的数据类型,默认 "application/x-www-form-urlencoded; charset=UTF-8" ,jquery-3.4.1.js 第9045行
		//  *      dataType:希望服务器方返回的数据类型,默认为空,此时将根据服务器的MIME查询
		//  */
		// function check_datatype_demo() {

		//     $('.base_demo input[type="button"]').click(function () {

		//         // $.get(remote_domain + "1.php",{
		//         //     id:23,
		//         // })
		//         // .done(function(data){
		//         //     console.log('data:',JSON.stringify(data));
		//         //     console.log('done:',[this.contentType,this.dataType,this.dataTypes]);
		//         // })
		//         // .always(function(){
		//         //     console.log('finally:',[this.contentType,this.dataType,this.dataTypes]); //
		//         // });

		//         // $.getJSON(remote_domain + "1.php",{
		//         //     id:23,
		//         // }).done(function(data){
		//         //     console.log('data:',JSON.stringify(data));
		//         //     console.log('done:',[this.contentType,this.dataType,this.dataTypes]);
		//         // }).always(function(){
		//         //     console.log('finally:',[this.contentType,this.dataType,this.dataTypes]);
		//         // });

		//         $.getScript('../../js/jquery.com/effect.js')
		//             .done(function (data) {
		//                 console.log('done:', [this.contentType, this.dataType, this.dataTypes]);
		//                 call_by_outer_demo();
		//             })
		//             .always(function () {
		//                 console.log('finally:', [this.contentType, this.dataType, this.dataTypes]);
		//             });

		//         //load方法,暂时无法引用上述字段,下面的this,引用的是 $('.result').get(0)
		//         // $('.result').load("../../resource/tip.html",function(data){
		//         //     console.log('done:',this,[this.contentType,this.dataType,this.dataTypes]);
		//         // });



		//     });
		// }

		// /**
		//  *      application/json 的类型。这种类型是 text ， 我们 ajax 的复杂JSON数据，用 JSON.stringify序列化后，
		//  * 然后发送，在服务器端接到然后用 JSON.parse 进行还原就行了，这样就能处理复杂的对象了。
		//  */
		// function contentType_demo() {
		//     $('.base_demo input[type="button"]').click(function () {
		//         $.ajax({
		//             async: true,     //default to true
		//             cache: true,    //default to true
		//             //       context:jresult[0],    //default to self object here.
		//             //       timeout:              //default unknown currently

		//             url: remote_domain + "2.php",
		//             data: JSON.stringify({
		//                 "a": 1,
		//                 "b": 2,
		//                 "c": "guitar",
		//                 "d": true,
		//                 "d": {
		//                     "ee": [1, 2, 3, 4, 5],
		//                     "family": "yindu"
		//                 }
		//             }),
		//             type: "POST",
		//             //    contentType: "application/x-www-form-urlencoded",       //default
		//             contentType: "application/json",
		//         })
		//             .done(data => {
		//                 console.log('done:', JSON.stringify(data))
		//             })
		//             .fail((xhr, status, error) => {
		//                 console.log('error:', error, status);
		//             })
		//             //         .always((xhr, status) => {
		//             .always(function (xhr, status) {
		//                 console.log("always:", status);
		//             });
		//     });
		// }

		// /**
		//  * The .serialize() method serializes a form's data into a query string
		//  * The .serializeArray() method produces an array of objects, instead of a string.
		//  */
		// function serialize_form_demo() {
		//     $('form.serializ_demo').submit(function (evt) {
		//         evt.preventDefault();
		//         console.log($(this).serialize(), $(this).serializeArray());
		//     });
		// }

		// /**
		//  * 无法访问
		//  */
		// function jsonp_demo() {
		//     $('.base_demo input[type="button"]').click(function () {
		//         // Using YQL and JSONP
		//         $.ajax({
		//             url: "http://query.yahooapis.com/v1/public/yql",

		//             // The name of the callback parameter, as specified by the YQL service
		//             jsonp: "callback",

		//             // Tell jQuery we're expecting JSONP
		//             dataType: "jsonp",

		//             // Tell YQL what we want and that we want JSON
		//             data: {
		//                 q: "select title,abstract,url from search.news where query=\"cat\"",
		//                 format: "json"
		//             },

		//             // Work with the response
		//             success: function (response) {
		//                 console.log(response); // server response
		//             }
		//         });

		//     });
		// }

		// /**
		//  * 测试模板
		//  */
		// function simpleResult() {
		//     //方法说明:
		//     [
		//         '',
		//         (() => {

		//             return [];
		//         })(),

		//     ]
		//         .forEach((v, i) => {
		//             console.log(v);
		//         });
		// }
	}
});



