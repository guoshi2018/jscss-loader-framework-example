


// $(document).ready(function() {
//   $('#letter-d .button').click(function() {
//     $.get('d.xml', function(data) {
//       jdict.empty();
//       $(data).find('entry[quote[@author]]').each(function() {
//         var $entry = $(this);
//         var html = '<div class="entry">';
//         html += '<h3 class="term">' + $entry.attr('term') + '</h3>';
//         html += '<div class="part">' + $entry.attr('part') + '</div>';
//         html += '<div class="definition">'
//         html += $entry.find('definition').text();
//         var $quote = $entry.find('quote');
//         if ($quote.length) {
//           html += '<div class="quote">';
//           $quote.find('line').each(function() {
//             html += '<div class="quote-line">' + $(this).text() + '</div>';
//           });
//           if ($quote.attr('author')) {
//             html += '<div class="quote-author">' + $quote.attr('author') + '</div>';
//           }
//           html += '</div>';
//         }
//         html += '</div>';
//         html += '</div>';
//         jdict.append($(html));
//       });
//     });
//   });
// });

// $(document).ready(function() {
//   $('#letter-e a').click(function() {
//     jdict.load('e.php', {'term': $(this).text()});
//     return false;
//   });
// });

// $(document).ready(function() {
//   $('#letter-f form').submit(function() {
//     $.get('f.php', $(this).find('input').serialize(), function(data) {
//       jdict.html(data);
//     });
//     return false;
//   });
// });

// $(document).ready(function() {
//   $('#loading').ajaxStart(function() {
//     $(this).show();
//   }).ajaxStop(function() {
//     $(this).hide();
//   });
// });

// $(document).ready(function() {
//   $('body').click(function(event) {
//     if ($(event.target).is('h3')) {
//       $(event.target).toggleClass('highlighted');
//     }
//   });
// });

// // $(document).ready(function() {
// //   var bindBehaviors = function() {
// //     $('h3').click(function() {
// //       $(this).toggleClass('highlighted');
// //     });
// //   }
// //
// //   bindBehaviors();
// //
// //   $('#letter-a .button').click(function() {
// //     jdict.hide().load('a.html', function() {
// //       bindBehaviors();
// //       $(this).fadeIn();
// //     });
// //   });
// // });

// // $(document).ready(function() {
// //   var bindBehaviors = function(scope) {
// //     $('h3', scope).click(function() {
// //       $(this).toggleClass('highlighted');
// //     });
// //   }
// //
// //   bindBehaviors(this);
// //
// //   $('#letter-a .button').click(function() {
// //     jdict.hide().load('a.html', function() {
// //       bindBehaviors(this);
// //       $(this).fadeIn();
// //     });
// //   });
// // });




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

  //在此添加本入口文件需要包含的js css文件全路径,默认[]
  //页面用到的js文件列表的数组,排列顺序必须保证:组内无依赖关系,后面的组可依赖于前面的组,反之则不然
  //必要时,查看global.json(或在此指定的其替代文件), 以免重复加载(虽然自动忽略)
  privateRes: [
    [
      '/lib/style/css/2-jquery4/default.css',
      '/lib/style/css/2-jquery4/6-ajax.css',
    ]
  ],

  //业务主逻辑函数,默认hello,world,并打印当前的入口文件路径
  main: () => {

    const jdict = $('#dictionary');
    //to do
    configTermClick();
    configAjaxProcess();
    configMockButtons();


    function configTermClick() {
      $('body').on('click', 'h3.term', function () {
        $(this).siblings('.definition').slideToggle();
      });
    }

    function configAjaxProcess() {
      const jloading = $('<div id="loading">Loading...</div>')
        .insertBefore(jdict);
      $(document).ajaxStart(() => {
        jdict.slideUp();
        jloading.show();
      }).ajaxStop(() => {
        jloading.hide();
        jdict.slideDown();
      });
    }
    /**
     * 配置各模拟按钮的点击响应
     */
    function configMockButtons() {
      //使用html片段a.html填充
      $('#letter-a .button').click(evt => {
        //evt.preventDefault(); //默认div无动作,故这句可取消
        jdict.load('/page/lesson/2-jquery4/6-server-side/a.html');
      });

      //使用json文件
      $('#letter-b .button').click(() => {
        jdict.empty();
        $.getJSON('/page/lesson/2-jquery4/6-server-side/b.json', data => {
          // console.log(data);
          $.each(data, function (entryIndex, entry) {
            var html = '<div class="entry">';
            html += '<h3 class="term">' + entry['term'] + '</h3>';
            html += '<div class="part">' + entry['part'] + '</div>';
            html += '<div class="definition">';
            html += entry['definition'];
            if (entry['quote']) {
              html += '<div class="quote">';
              $.each(entry['quote'], function (lineIndex, line) {
                html += '<div class="quote-line">' + line + '</div>';
              });
              if (entry['author']) {
                html += '<div class="quote-author">' + entry['author'] + '</div>';
              }
              html += '</div>';
            }
            html += '</div>';
            html += '</div>';
            jdict.append(html);
          });
        });
      });

      //使用执行脚本,但存在紧耦合
      $('#letter-c .button').click(() => {
        $.getScript('/page/lesson/2-jquery4/6-server-side/c.js');
      });

      //加载xml文档
      $('#letter-d .button').click(() => {
        jdict.empty();
        $.get('/page/lesson/2-jquery4/6-server-side/d.xml', function (data) {
          $(data).find('entry').each(function () {
            var $entry = $(this);
            var html = '<div class="entry">';
            html += '<h3 class="term">' + $entry.attr('term') + '</h3>';
            html += '<div class="part">' + $entry.attr('part') + '</div>';
            html += '<div class="definition">'
            html += $entry.find('definition').text();
            var $quote = $entry.find('quote');
            if ($quote.length) {
              html += '<div class="quote">';
              $quote.find('line').each(function () {
                html += '<div class="quote-line">' + $(this).text() + '</div>';
              });
              if ($quote.attr('author')) {
                html += '<div class="quote-author">' + $quote.attr('author') + '</div>';
              }
              html += '</div>';
            }
            html += '</div>';
            html += '</div>';
            jdict.append($(html));
          });
        });
      });

      //使用get,post请求,注意保证同域
      $('#letter-e a').click(function (evt) {
        evt.preventDefault();
        const server_page = '/page/lesson/2-jquery4/6-server-side/e.php';
        //const server_page = '/page/lesson/2-jquery4/6-server-side/ee.php'; // test server error
        const reqData = {
          term: $(this).text(),
        };

        //get: ok
        $.get(server_page, reqData, data => {
          jdict.html(data);
        }).fail(jqXHR => {
          jdict.html('An error occured: ' + jqXHR.status)
            .append(jqXHR.responseText);
        });

        //post: ok also
        // $.post(server_page, reqData, data => {
        //   jdict.html(data);
        // });

        //load: ok also
        //jdict.load(server_page, reqData);
      });

      //使用get方法, 返回适配的词条
      $('#letter-f form').submit(function (evt) {
        evt.preventDefault();
        const server_page = '/page/lesson/2-jquery4/6-server-side/f.php';

        //使用常规的term搜索: OK
        // $.get(server_page, {
        //   term: $('input[name="term"]').val(),
        // }, data => {
        //   jdict.html(data);
        //   //console.log(data);
        // });

        //使用jquery的serialize方法,即使增加表单中字段,仍可正常工作
        const formValues = $(this).serialize();
        $.get(server_page, formValues, data => {
          jdict.html(data);
        });
      });
    }
  },
});

