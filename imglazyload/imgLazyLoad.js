(function (win, doc) {
    function query(selector, element) {
        return (element || doc).querySelector(selector);
    }

    function queryAll(selector, element) {
        return (element || doc).querySelectorAll(selector);
    }

    function getAttr(element, name) {
        return element.getAttribute(name);
    }

    function setAttr(element, name, value) {
        element.setAttribute(name, value);
    }

    function removeAttr(element, name) {
        element.removeAttribute(name);
    }

    function on(element, type, handler, useCapture) {
        if (win.addEventListener) {
            element.addEventListener(type, handler, useCapture || false);
        } else if (win.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }

    function extend(target, source) {
        for (var v in source) {
            target[v] = source[v];
        }
        return target;
    }

    function throttle(methods, context, param) {
        clearTimeout(methods.t);
        methods.t = setTimeout(function () {
            methods.call(context, param);
        }, 0);
    }

    var imgLazyLoad = function (config) {
        this.defaultConfig = {
            realSrc: 'data-src',
            extendHeight: 0,
            opcityTime: .2,
            scale: .2,
            isOpcity: true,
            isScale: true
        }
        this.config = extend(this.defaultConfig, config);
        //记录加载完成的图片数量
        this.count = 0;
        this.lazyObj = queryAll('[' + this.config.realSrc + ']');
        this.init();
    }

    imgLazyLoad.prototype = {
        init: function () {
            throttle(this.lazyLoad, this, this.config);
            this.bindEvent();
        },
        isLoadImg: function (element, extendHeight) {
            var top = element.getBoundingClientRect().top;
            var client = doc.documentElement.clientHeight || doc.body.clientHeight;
            if (top < client + extendHeight) {
                return true;
            }
            return false;
        },
        lazyLoad: function (config) {
            var undone_Css;
            var done_Css = 'transition: opacity .8s, transform .8s;';
            for (var i = this.count, len = this.lazyObj.length; i < len; i++) {
                var lazyObj = this.lazyObj[i];
                if (getAttr(lazyObj, config.realSrc)) {
                    config.isOpcity && (undone_Css = 'opacity: ' + config.opcityTime + ';');
                    config.isScale && (undone_Css += 'transform: scale(' + config.scale + ');');
                    lazyObj.style.cssText = undone_Css;
                    if (this.isLoadImg(lazyObj, config.extendHeight)) {
                        config.isOpcity && (done_Css += 'opacity: 1;');
                        config.isScale && (done_Css += 'transform: scale(1);');
                        setAttr(lazyObj, 'src', getAttr(lazyObj, config.realSrc));
                        removeAttr(lazyObj, config.realSrc);
                        lazyObj.style.cssText = done_Css;
                        this.count++;
                    }
                }

            }
        },
        bindEvent: function () {
            on(win, 'scroll', function () {
                throttle(this.lazyLoad, this, this.config);
            }.bind(this));
            on(win, 'resize', function () {
                throttle(this.lazyLoad, this, this.config);
            }.bind(this));
        }
    }

    win.imgLazyLoad = imgLazyLoad;
})(window, document);