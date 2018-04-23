(function ($) {
    function paging(el, config) {
        this.el = el;
        this.defaultConfig = {
            curPage: 1,
            totalPage: 5,
            callback: function () { }
        }
        //默认参数和配置参数合并
        this.config = $.extend(this.defaultConfig, config);
        //初始化入口函数
        this.init();
    }

    paging.prototype = {
        init: function () {
            this.render();
            this.bindEvent(this);
        },
        main: function (idx, cur) {
            return idx == cur ? '<li class="page page-item current">' + idx + '</li>' : '<li class="page page-item">' + idx + '</li>';
        },
        render: function () {
            var t = this;
            var el = t.el;
            var curPage = t.config.curPage;
            var totalPage = t.config.totalPage;
            var html = '';
            html += '<span class="page-first" data-point="first">首页</span>';
            html += '<span class="page-prev" data-point="prev">上一页</span>';
            html += '<ul class="page-list">';
            if (totalPage > 5) {
                if (curPage < 5) { //当前页数小于5
                    for (var i = 1, len = 5; i <= len; i++) {
                        html += t.main(i, curPage);
                    }
                    html += '<li class="page">...</li>';
                    html += '<li class="page page-item">' + totalPage + '</li>';
                } else {
                    if (curPage < totalPage - 3) {
                        for (var i = curPage - 2, len = curPage + 3; i < len; i++) {
                            html += t.main(i, curPage);
                        }
                        html += '<li class="page">...</li>';
                        html += '<li class="page page-item">' + totalPage + '</li>';
                    } else {
                        html += '<li class="page page-item">1</li>';
                        html += '<li class="page">...</li>';
                        for (var i = totalPage - 4, len = totalPage + 1; i < len; i++) {
                            html += t.main(i, curPage);
                        }
                    }
                }
            } else { //总页数小于5直接走渲染
                for (var i = 1, len = totalPage; i <= len; i++) {
                    html += t.main(i, curPage);
                }
            }
            html += '</ul>';
            html += '<span class="page-next" data-point="next">下一页</span>';
            html += '<span class="page-last" data-point="last">尾页</span>';
            el.html(html);
        },
        bindEvent: function (t) {
            t.el.on('click', 'span', function () {
                var point = $(this).data('point');
                var curPage = t.config.curPage;
                var totalPage = t.config.totalPage;
                switch (point) {
                    case 'first':
                        curPage = 1;
                        break;
                    case 'prev':
                        curPage == 1 ? curPage = 1 : curPage--;
                        break;
                    case 'next':
                        curPage == totalPage ? curPage = totalPage : curPage++;
                        break;
                    case 'last':
                        curPage = totalPage;
                        break;
                }
                t.config.curPage = curPage;
                t.render();
                t.config.callback && typeof t.config.callback == 'function' && t.config.callback(curPage);
            }).on('click', 'li.page-item', function () {
                var index = parseInt($(this).html());
                t.config.curPage = index;
                t.render();
                t.config.callback && typeof t.config.callback == 'function' && t.config.callback(index);
            });
        }
    }
    //扩展分页插件
    $.fn.paging = function (setting) {
        new paging($(this), setting);
    }
})(jQuery);