
const Util = class {

    static debug() {
        if (__DEBUG__) {
            console.log(...arguments);
        }
    }


    /**
     * 定义一个sleep函数,ms为毫秒数
     * */
    static async sleep(ms) {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, ms);
        });
        return ms;
    }

    /**
     * 打印对象的自身非继承的可枚举属性
     * @param {any} obj
     */
    static props(obj) {
        //----console.log(obj, 'properties is :');
        for (var p in obj) {
            //----console.log(p, obj[p]);
        }
        //----console.log('-------end.');
    }

    /**
     * 将img元素,转换为多个图片构成的横向轮播图,
     * 如果其src属性是由两个以上文件路径组成的,中间以逗号相隔的字符串
     * @param {any} imgHtml
     * 注意: 该函数已废弃, 建议使用调用jmeshcarousel部件的
     *      jquery扩展方法imgs_to_carousel(位于jquery.extensions.js中)
     */
    static imagesToCarousel(imgHtml) {
        let srcs = imgHtml.src.split(',');
        if (srcs && srcs.length > 1) {
            let containerCss = {
                position: 'relative',
                overflow: 'hidden',
                //           width: ,              //由父级自动分配
                //           height: ,             //由子级撑开
                'background-color': 'black',
                //           border:'1px solid blue',      //for debugging only
            };
            let listCss = {
                width: '10000em',       //设置为width/height，可实现横向/竖向滑动
                position: 'relative',
            };
            let w = $(imgHtml).width(), h = $(imgHtml).height();//当下的宽度和高度,由样式表确定
            let itemCss = {
                float: 'left',
                width: w + 'px',
                height: h + 'px',
                object_fit: 'cover',
            };
            let jcar = $('<div/>').css(containerCss);
            let jlist = $('<div/>').appendTo(jcar).css(listCss);
            srcs.forEach(v => {
                $(`<img src='${v}' />`).appendTo(jlist).css(itemCss);
            });
            $(imgHtml).replaceWith(jcar);

            jcar
                .on('jcarousel:create jcarousel:reload', function (evt) {
                    let jcontainer = $(this),
                        _w = jcontainer.innerWidth();
                    jcontainer.jcarousel('items').css('width', _w + 'px');  //宽度自适应
                })
                .jcarousel({
                    wrap: 'circular',
                    animation: {
                        duration: 1000,
                        easing: 'bounce-ease-out'
                    },
                }).jcarouselAutoscroll()
                .on('dragstart.jcar', () => { return false; })
                .on('mouseenter.jcar', () => {
                    jcar.jcarouselAutoscroll('stop');
                })
                .on('mouseleave.jcar', () => {
                    jcar.jcarouselAutoscroll('start');
                });
        }
    }

    /**
     * 获取给定尺寸字符串(px rem em %),当用于给定dom元素的jquery对象,作为尺寸时,代表的px数量
     * @param {string} strSize 给定尺寸字符串
     * @param {object} jparent 代表的px数量
     */
    static getSizeDigitInPixel(strSize, jself) {
        let jtemp = $(`<div style='width:${strSize};display:block;'/>`).insertAfter(jself);
        let v = jtemp.width();
        jtemp.remove();
        return v;
    }

    /**
     * 判断两个数组包含元素是否相同,数组的重复项,以一项计
     * @param {any} arr1
     * @param {any} arr2
     */
    static includeSameElement(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
            return false;
        }
        for (let ele of arr1) {
            if (!arr2.includes(ele))
                return false;
        }
        for (let ele of arr2) {
            if (!arr1.includes(ele))
                return false;
        }
        return true;
    }

    /**
     * 根据两点位置,确定新的方向.原则是以向两个坐标轴的四个方向归并,
     * @param {point Object} pointBegin 开始位置 {x,y}
     * @param {point Object} pointEnd   停止位置 {x,y}
     * @param {number} minDistance 最小的临界距离,即x y 差值的平方和之平方根小于此值,将被忽略
     * @return {array} [,] :
     *          成功,返回包含两元素的数组:[true | false, true | false];
     *              第一个元素代表, 是否是水平防线
     *              第二个元素代表, 是否是正方向
     *          失败, 则返回null
     */
    static calcNextTrend(pointBegin, pointEnd, minDistance) {
        let result = null;
        if (pointBegin && pointEnd) {
            let deltaX = pointEnd.x - pointBegin.x;
            let deltaY = pointEnd.y - pointBegin.y;
            let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
            //----console.log('distance is ', dist);
            if (dist > minDistance) {
                //               let ishor, ispos;
                if (deltaX == 0 && deltaY != 0) {      //deltaX = 0时，斜率无穷大，所以需要单独考虑
                    /*                    ishor = false;
                                        ispos = deltaY > 0;*/
                    result = [false, deltaY > 0];
                }
                else if (deltaX != 0) {
                    let angle = Math.atan(deltaY / deltaX);  //弧度，介于 -PI/2 与 PI/2之间  
                    if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) {
                        /*                        ishor = true;
                                                ispos = deltaX > 0;*/
                        result = [true, deltaX > 0];
                    } else {
                        /*                        ishor = false;
                                                ispos = deltaY > 0;*/
                        result = [false, deltaY > 0];
                    }
                    //                   result = [ishor, ispos];
                }
            }

        }
        return result;
    }





}
