"use strict";
($ => {
    Guoshi.Math = {
        sum: (arr) => {
            let total = 0;
            arr.forEach(v => {
                //		const s = typeof (v);
                total += typeof v == 'string' ? parseFloat(v.trim()) : v;
            });
            return total;
        },
        avg: function (arr) {
            return arr.length > 0 ? this.sum(arr) / arr.length : 0;
        }
    };
})(jQuery);
//# sourceMappingURL=guoshi-math.js.map