"use strict";
/**
 * 加载资源文件,如果超过该时限还监听不到'load'或'error'事件,则判断为超时错误
 */
const __TIMEOUT__ = 3000;
/*
 * js,css文件加载器
 * v1.1:在v1.0的基础上，
 *      1. 使用JscssLoader封装 ,故调用与1.0版本有区别，在于需使用前缀 JscssLoader.
 *      2. 使用正则表达式检测js css 文件的格式,以便带参数
 * */
class JscssLoader {
    /**
     * 加载器的唯一实例(针对一个html页面)
     */
    static _instance = new JscssLoader();
    /**
     * 私有构造器, 以实现singleton模式
     */
    constructor() { }
    /**
     * 加载完成的文件路径列表
     */
    _loadedFilePaths = [];
    get loadedFilePaths() {
        return this._loadedFilePaths;
    }
    /**
     * 当前的入口文件路径
     */
    _currentEntry = '';
    /**
     * 获取唯一实例
     * @returns 唯一实例
     */
    static getInstance() {
        return JscssLoader._instance;
    }
    /**
     * 批量加载资源文件(仅限于css,js, 其余文件类型被忽略)
     * @param arg 描述加载的资源文件的选项对象数组或字符串数组.如果是字符串数组
     * @param debug arg为string[]时有效, 为 _LoaderOptions[]时被忽略
     * @returns 结果为加载结果的Promise对象为元素的数组
     */
    loadResources(arg, debug) {
        const results = [];
        arg.forEach(async (ar) => {
            //这样写很无聊,但是typescript就是这样,否则编译报错.这也是智能感知的代价吧
            // if (typeof ar == "string") {
            // 	results.push(this._loadResource(ar, debug));
            // } else {
            // 	results.push(this._loadResource(ar));
            // }
            //@ts-ignore 或者
            results.push(this._loadResource(ar, debug));
        });
        return results;
    }
    /**
     * 加载单一的资源文件(仅限于css,js, 其余文件类型被忽略))
     * @param arg 如果是字符串,将以此代表文件路径,创建描述加载的资源文件的选项对象
     * @param debug arg为string时有效, 为 _LoaderOptions时被忽略
     * @returns 包含加载结果的promise对象
     */
    _loadResource(arg, debug) {
        let opt = {
            filepath: '',
            debug,
        };
        if (typeof arg == 'string') {
            opt.filepath = arg;
        }
        else {
            opt = arg;
        }
        return new Promise((resolve, reject) => {
            let node;
            if (!this._loadedFilePaths.includes(opt.filepath)) {
                if (/\.js$/i.test(opt.filepath)) {
                    node = document.createElement('script');
                    if (node) {
                        node.type = 'text/javascript';
                        node.src = opt.filepath;
                        //js_node.charset = 'UTF-8';						
                    }
                }
                else if (/\.css$/i.test(opt.filepath)) { //styel节点移除后样式就失效
                    node = document.createElement('link');
                    if (node) {
                        node.type = 'text/css';
                        node.href = opt.filepath;
                        node.rel = 'stylesheet';
                        //css_node.charset = 'UTF-8';						
                    }
                }
                else {
                    reject({
                        error: 101,
                        message: "invalid file type cannot be loaded.",
                        filepath: opt.filepath,
                    }); //非法类型
                }
            }
            else {
                reject({
                    error: 102,
                    message: "the file doesnot need be loaded twice.",
                    filepath: opt.filepath,
                }); //二次加载
            }
            if (node) {
                node.addEventListener('load', function () {
                    //const curNode = evt.target as HTMLScriptElement | HTMLLinkElement;
                    //css文件不能移除
                    //!opt.debug && curNode.type == 'text/javascript' && curNode.remove();
                    !opt.debug && this.type == 'text/javascript' && this.remove();
                    resolve({
                        error: 0,
                        message: "loaded successfully",
                        filepath: opt.filepath,
                    }); //成功
                });
                node.addEventListener('error', function (evt) {
                    reject({
                        error: 103,
                        message: "An unexpected error has occurred while loading.",
                        filepath: opt.filepath,
                    }); //错误,例如文件不存在
                });
                if (opt.atLast || !document.head.hasChildNodes()) {
                    document.head.appendChild(node);
                }
                else {
                    const currLast = document.head.lastChild;
                    currLast?.before(node);
                }
                this._loadedFilePaths.push(opt.filepath);
                //如果上述'load'或'error'事件在__TIMEOUT__定义的时限内被成功监听,
                //则下面的超时丢弃将不被引发
                setTimeout(() => {
                    reject({
                        error: 104,
                        message: "sorry, load timeout",
                        filepath: opt.filepath,
                    });
                }, __TIMEOUT__); //超时
            }
            else {
                reject({
                    error: 105,
                    message: "failed to create node",
                    filepath: opt.filepath,
                }); //失败
            }
        });
    }
    /**
     * 当前页面加载完成的事件回调
     * @param debug 是否调试,默认不调试
     */
    async _onWindowLoaded_(debug) {
        //把查找范围扩大到整个html
        let ele_jss = document.getElementsByTagName('script');
        for (let i = 0; i < ele_jss.length; i++) {
            let src = ele_jss[i].src;
            let idx = src.lastIndexOf('jscss-loader.js');
            if (idx != -1) {
                this._loadedFilePaths.push(src);
                const node = ele_jss[i];
                //非调试模式下, 则删除jscss-loader.js自身的节点:
                debug || node.remove();
                //定位入口文件,并加载
                //const entrynode = node.attributes.entry;
                const entrynode = node.getAttributeNode("entry");
                if (entrynode?.value) { //找到属性值,作为start.js的全路径
                    this._currentEntry = entrynode.value;
                    await this._loadResource({
                        filepath: entrynode.value,
                        debug,
                        atLast: true, //入口文件必须位于最后
                    });
                    break;
                }
            }
        }
    }
    /**
     * 逐组加载资源文件,各个组内的资源应不存在依赖关系,
     * 但第2组可依赖于第1组,第3组可依赖于第2组,以此类推
     * @param resGroups 各个资源文件数组构成的数组
     * @param debug 是否启用调试
     */
    async _loadResGroups(resGroups, debug) {
        // forEach内部是异步执行,故为保证逐个资源组顺序加载,必须采用for循环	
        for (let i = 0; i < resGroups.length; i++) { //逐组加载
            //对于一个组内的资源文件, 不存在依赖关系, 所以可以作为一个Promise来解决
            const result = await Promise.allSettled(this.loadResources(resGroups[i], debug));
            debug && console.log('resources loaded :', result);
        }
    }
    /**
     * 运行入口方法, 由个入口文件调用, 详见示例
     * @param options ,各字段默认值定义如下:
     * 		1. globalRes: 默认为/lib/script/json/global.json
     * 		2. debug: 默认为false, 即不启用调试
     * 		3. privateRes: 默认为[], 即不需要除了上述必须资源外的任何资源
     * 		4. main: 业务逻辑函数, 默认为打印 hello,world,并提示当前的入口文件
     */
    async startEntry(options) {
        //合并各字段的默认值(如果未提供)
        const opt = Object.assign({
            globalRes: '/lib/script/json/global.json',
            debug: false,
            privateRes: [],
            main: () => {
                console.log(`hello,world.This is ${this._currentEntry}.loaded files:`, this._loadedFilePaths);
            }
        }, options);
        let resGroups;
        try {
            //获取globalRes指定的文件记载的所有js文件列表(数组的数组)
            const requ = new Request(opt.globalRes || '');
            const resp = await fetch(requ);
            resGroups = (await resp.json()).paths;
        }
        catch (e) {
            resGroups = [];
        }
        //逐组加入私有资源组
        resGroups.push(...(opt.privateRes || []));
        //按顺序加载当前入口文件需要的资源文件, 逐组加载
        await this._loadResGroups(resGroups, opt.debug);
        //执行主要逻辑
        opt.main && opt.main();
    }
    /**
     * 运行加载器
     * @param debug 加载器的运行(即加载器自身的加载), 是否启用调试模式.默认不启用
     * 控制html页面是否显示jscss-loader.js和entry标记的script文件对应的script标签
     */
    run(debug) {
        if (window.addEventListener) {
            window.addEventListener('load', this._onWindowLoaded_.bind(this, debug));
        }
        else {
            console.log('找不到window的load监听方法');
        }
    }
}
//run参数debug, 负责jscss-loader.js和入口js文件在html.head中的显隐
JscssLoader.getInstance().run(true);
//# sourceMappingURL=jscss-loader.js.map