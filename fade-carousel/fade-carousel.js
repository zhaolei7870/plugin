(function (win, doc) {
    function query(selector, element) {
        return (element || document).querySelector(selector);
    }

    function queryAll(selector, element) {
        return (element || document).querySelectorAll(selector);
    }

    function setAttr(element, name, value) {
        element.setAttribute(name, value);
    }

    function getAttr(element, name) {
        return element.getAttribute(name);
    }

    function removeAttr(element, name) {
        element.removeAttribute(name);
    }

    function extend(destination, source) {
        for (var property in source) {
            destination[property] = source[property]
        }
        return destination;
    }

    function isBoolean(v) {
        return typeof v == 'boolean';
    }

    function isNumber(v) {
        return typeof v == 'number';
    }

    var Carousel = function (el, config) {
        this.el = el;
        this.fade = queryAll('li', this.el);
        this.parentNode = this.el.parentNode;
        this.pagination = query('#pagination', this.parentNode);
        this.carousel_left = query('.carousel-left', this.parentNode);
        this.carousel_right = query('.carousel-right', this.parentNode);
        this.fade_num = this.fade.length;
        this.index = 0;
        this.auto = null;
        this.defaultConfig = {
            arrows: true,
            pagination: true,
            autoPlay: true
        }
        this.config = extend(this.defaultConfig, config || {});
        this.init();
    }

    Carousel.prototype = {
        init: function () {
            this.showFade(0);
            this.renderDot();
            this.autoPlay(this);
            this.bindEvent(this);
        },
        showFade: function (index) {
            var t = this;
            var fade = t.fade;
            var fade_img = query('img', fade[index]);
            var active = queryAll('a', this.pagination);
            var opacity0_css = 'z-index: 0;opacity: 0;filter: alpha(opacity=0);transition: opacity 0.5s ease-out;';
            var opacity1_css = 'z-index: 1;opacity: 1;filter: alpha(opacity=100);transition: opacity 0.5s ease-out;';
            for (var i = 0, len = fade.length; i < len; i++) {
                fade[i].style.cssText = opacity0_css;
                active[i] && (active[i].className = '');
            }
            if (getAttr(fade_img, 'data-src')) {
                setAttr(fade_img, 'src', getAttr(fade_img, 'data-src'));
                removeAttr(fade_img, 'data-src');
            }
            fade[index].style.cssText = opacity1_css;
            active[index] && (active[index].className = 'active');
        },
        renderDot: function () {
            var config = this.config;
            var pagination = config.pagination;
            var fade_num = this.fade_num;
            var html = '';
            if (!pagination) return;
            for (var i = 0; i < fade_num; i++) {
                html += i == 0 ? '<a class="active"></a>' : '<a></a>';
            }
            this.pagination.innerHTML = html;
        },
        toggleBtn: function (l, r, toggle) {
            if (this.config.arrows) {
                l.style.display = toggle;
                r.style.display = toggle;
            }
        },
        prev: function () {
            this.index == 0 ? this.index = this.fade_num - 1 : this.index--;
            this.showFade(this.index);
        },
        next: function () {
            this.index == this.fade_num - 1 ? this.index = 0 : this.index++;
            this.showFade(this.index);
        },
        autoPlay: function (t) {
            if (!this.config.autoPlay) return;
            t.auto && clearInterval(t.auto);
            if (isBoolean(this.config.autoPlay) || isNumber(this.config.autoPlay)) {
                if (isBoolean(this.config.autoPlay) && this.config.autoPlay === true) {
                    this.auto = setInterval(function () {
                        t.next();
                    }, 3000);
                } else {
                    this.auto = setInterval(function () {
                        t.next();
                    }, this.config.autoPlay);
                }
            }
        },
        bindEvent: function (t) {
            t.carousel_left.onclick = function () {
                t.prev();
            }
            t.carousel_right.onclick = function () {
                t.next();
            }
            t.parentNode.onmouseover = function () {
                t.toggleBtn(t.carousel_left, t.carousel_right, 'block');
                clearInterval(t.auto);
            }
            t.parentNode.onmouseout = function () {
                t.toggleBtn(t.carousel_left, t.carousel_right, 'none');
                t.autoPlay(t);
            }
            var active = queryAll('a', t.pagination);
            if (!active.length) return;
            for (var i = 0; i < t.fade_num; i++) {
                (function (i) {
                    var timer = null;
                    active[i].onmouseover = function () {
                        timer = setTimeout(function () {
                            t.index = i;
                            t.showFade(t.index);
                        }, 200);
                    }
                    active[i].onmouseout = function () {
                        clearTimeout(timer);
                    }
                })(i);
            }
        }
    }

    win.Carousel = Carousel;
})(window, document);