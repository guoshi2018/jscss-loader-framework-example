"use strict";
($ => {
    /**
     * 覆盖了jqueryui自带的tooltip部件
     */
    $.widget('guoshi.simpleTooltip', {
        version: 'guoshi-1.0.0',
        options: {
            disabled: false,
            location: {
                left: 0,
                top: 0,
            },
            content: function () {
                return $(this).data('tooltip-text');
            },
        },
        _create: function () {
            //	console.log('guoshi.tooltip wiget _create');
            //#region 
            this.element
                .addClass('guoshi-tooltip-trigger')
                .on('mouseenter.guoshi-tooltip', this._open.bind(this))
                .on('mouseleave.guoshi-tooltip', this._close.bind(this));
            const off = this.element.offset();
            this._jtip = $('<div/>')
                .addClass('guoshi-tooltip-text ui-widget ui-state-highlight ui-corner-all')
                .css({
                left: (off?.left || 0) + (this.options.location?.left || 0),
                top: (off?.top || 0) + (this.element.height() || 0)
                    + (this.options.location?.top || 0),
            })
                .text(this.options.content?.call(this.element[0])) //this.element[]才是HTMLElement
                .hide()
                .appendTo('body');
            //#endregion
        },
        _open: function () {
            if (!this.options.disabled) {
                //console.log('guoshi.tooltip wiget _open', this);
                this._jtip.show();
                this._trigger('open'); //客户端还是收不到,以后用到再说
            }
        },
        _close: function () {
            if (!this.options.disabled) {
                //console.log('guoshi.tooltip wiget _close');
                this._jtip.hide();
            }
        },
        enable: function () {
            this.options.disabled = false;
        },
        disable: function () {
            this.options.disabled = true;
        },
        destroy: function () {
            //console.log('guoshi.tooltip wiget destroy');
            this._jtip.remove();
            this.element
                .removeClass('guoshi-tooltip-trigger')
                .off('.guoshi-tooltip');
            $.Widget.prototype.destroy.apply(this, arguments);
        },
        open: function () {
            this._open();
        },
        close: function () {
            this._close();
        },
        disabled: function () {
            return this.options.disabled;
        },
        test1: function () {
            console.log('测试方法连缀:test1.这里虽然不返回jquery对象');
        },
        test2: function () {
            console.log('测试方法连缀:test2.也不返回jquery对象');
        }
    });
})(jQuery);
//# sourceMappingURL=guoshi-simpleTooltip.js.map