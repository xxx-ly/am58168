/*!
 * imagesLoaded PACKAGED v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */
! function(e, t) {
    "function" == typeof define && define.amd ? define("ev-emitter/ev-emitter", t) : "object" == typeof module && module.exports ? module.exports = t() : e.EvEmitter = t()
}("undefined" != typeof window ? window : this, function() {
    function e() {}
    var t = e.prototype;
    return t.on = function(e, t) {
        if (e && t) {
            var i = this._events = this._events || {},
                n = i[e] = i[e] || [];
            return n.indexOf(t) == -1 && n.push(t), this
        }
    }, t.once = function(e, t) {
        if (e && t) {
            this.on(e, t);
            var i = this._onceEvents = this._onceEvents || {},
                n = i[e] = i[e] || {};
            return n[t] = !0, this
        }
    }, t.off = function(e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            var n = i.indexOf(t);
            return n != -1 && i.splice(n, 1), this
        }
    }, t.emitEvent = function(e, t) {
        var i = this._events && this._events[e];
        if (i && i.length) {
            i = i.slice(0), t = t || [];
            for (var n = this._onceEvents && this._onceEvents[e], o = 0; o < i.length; o++) {
                var r = i[o],
                    s = n && n[r];
                s && (this.off(e, r), delete n[r]), r.apply(this, t)
            }
            return this
        }
    }, t.allOff = function() {
        delete this._events, delete this._onceEvents
    }, e
}),
function(e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define(["ev-emitter/ev-emitter"], function(i) {
        return t(e, i)
    }) : "object" == typeof module && module.exports ? module.exports = t(e, require("ev-emitter")) : e.imagesLoaded = t(e, e.EvEmitter)
}("undefined" != typeof window ? window : this, function(e, t) {
    function i(e, t) {
        for (var i in t) e[i] = t[i];
        return e
    }

    function n(e) {
        if (Array.isArray(e)) return e;
        var t = "object" == typeof e && "number" == typeof e.length;
        return t ? d.call(e) : [e]
    }

    function o(e, t, r) {
        if (!(this instanceof o)) return new o(e, t, r);
        var s = e;
        return "string" == typeof e && (s = document.querySelectorAll(e)), s ? (this.elements = n(s), this.options = i({}, this.options), "function" == typeof t ? r = t : i(this.options, t), r && this.on("always", r), this.getImages(), h && (this.jqDeferred = new h.Deferred), void setTimeout(this.check.bind(this))) : void a.error("Bad element for imagesLoaded " + (s || e))
    }

    function r(e) {
        this.img = e
    }

    function s(e, t) {
        this.url = e, this.element = t, this.img = new Image
    }
    var h = e.jQuery,
        a = e.console,
        d = Array.prototype.slice;
    o.prototype = Object.create(t.prototype), o.prototype.options = {}, o.prototype.getImages = function() {
        this.images = [], this.elements.forEach(this.addElementImages, this)
    }, o.prototype.addElementImages = function(e) {
        "IMG" == e.nodeName && this.addImage(e), this.options.background === !0 && this.addElementBackgroundImages(e);
        var t = e.nodeType;
        if (t && u[t]) {
            for (var i = e.querySelectorAll("img"), n = 0; n < i.length; n++) {
                var o = i[n];
                this.addImage(o)
            }
            if ("string" == typeof this.options.background) {
                var r = e.querySelectorAll(this.options.background);
                for (n = 0; n < r.length; n++) {
                    var s = r[n];
                    this.addElementBackgroundImages(s)
                }
            }
        }
    };
    var u = {
        1: !0,
        9: !0,
        11: !0
    };
    return o.prototype.addElementBackgroundImages = function(e) {
        var t = getComputedStyle(e);
        if (t)
            for (var i = /url\((['"])?(.*?)\1\)/gi, n = i.exec(t.backgroundImage); null !== n;) {
                var o = n && n[2];
                o && this.addBackground(o, e), n = i.exec(t.backgroundImage)
            }
    }, o.prototype.addImage = function(e) {
        var t = new r(e);
        this.images.push(t)
    }, o.prototype.addBackground = function(e, t) {
        var i = new s(e, t);
        this.images.push(i)
    }, o.prototype.check = function() {
        function e(e, i, n) {
            setTimeout(function() {
                t.progress(e, i, n)
            })
        }
        var t = this;
        return this.progressedCount = 0, this.hasAnyBroken = !1, this.images.length ? void this.images.forEach(function(t) {
            t.once("progress", e), t.check()
        }) : void this.complete()
    }, o.prototype.progress = function(e, t, i) {
        this.progressedCount++, this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded, this.emitEvent("progress", [this, e, t]), this.jqDeferred && this.jqDeferred.notify && this.jqDeferred.notify(this, e), this.progressedCount == this.images.length && this.complete(), this.options.debug && a && a.log("progress: " + i, e, t)
    }, o.prototype.complete = function() {
        var e = this.hasAnyBroken ? "fail" : "done";
        if (this.isComplete = !0, this.emitEvent(e, [this]), this.emitEvent("always", [this]), this.jqDeferred) {
            var t = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[t](this)
        }
    }, r.prototype = Object.create(t.prototype), r.prototype.check = function() {
        var e = this.getIsImageComplete();
        return e ? void this.confirm(0 !== this.img.naturalWidth, "naturalWidth") : (this.proxyImage = new Image, this.proxyImage.addEventListener("load", this), this.proxyImage.addEventListener("error", this), this.img.addEventListener("load", this), this.img.addEventListener("error", this), void(this.proxyImage.src = this.img.src))
    }, r.prototype.getIsImageComplete = function() {
        return this.img.complete && this.img.naturalWidth
    }, r.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.img, t])
    }, r.prototype.handleEvent = function(e) {
        var t = "on" + e.type;
        this[t] && this[t](e)
    }, r.prototype.onload = function() {
        this.confirm(!0, "onload"), this.unbindEvents()
    }, r.prototype.onerror = function() {
        this.confirm(!1, "onerror"), this.unbindEvents()
    }, r.prototype.unbindEvents = function() {
        this.proxyImage.removeEventListener("load", this), this.proxyImage.removeEventListener("error", this), this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype = Object.create(r.prototype), s.prototype.check = function() {
        this.img.addEventListener("load", this), this.img.addEventListener("error", this), this.img.src = this.url;
        var e = this.getIsImageComplete();
        e && (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"), this.unbindEvents())
    }, s.prototype.unbindEvents = function() {
        this.img.removeEventListener("load", this), this.img.removeEventListener("error", this)
    }, s.prototype.confirm = function(e, t) {
        this.isLoaded = e, this.emitEvent("progress", [this, this.element, t])
    }, o.makeJQueryPlugin = function(t) {
        t = t || e.jQuery, t && (h = t, h.fn.imagesLoaded = function(e, t) {
            var i = new o(this, e, t);
            return i.jqDeferred.promise(h(this))
        })
    }, o.makeJQueryPlugin(), o
});
(function($) {
    "use strict";
    $.fn.extend({
        addNavStyle: function() {
            return this.each(function() {
                var $self = $(this),
                    $nav = $self.find('li'),
                    $hasNode = $self.find('li:has(ul)');
                $hasNode.addClass('has-nav');
                $nav.each(function(n) {
                    var $this = $(this);
                    if ($this.is('.on')) $this.data('currentOn', true);
                });
            })
        },
        addNavEvent: function(opt) {
            var $win = $(window),
                options = $.extend({
                    eventStop: 768
                }, opt);
            return this.each(function() {
                var $mainNav = $(this);
                $mainNav.on('click', 'li:has(ul) > a', function(e) {
                    var c = $win.width() > options.eventStop,
                        $this = $(this);
                    if (!c) {
                        e.preventDefault();
                        $this.parent().toggleClass('on');
                    }
                })
            })
        },
        /** 統一高度用的PLUGIN */
        sameHeight: function(opt) {
            var options = $.extend({
                item: '.item',
                overWidth: 0
            }, opt);
            return this.each(function() {
                var $this = $(this),
                    $win = $(window),
                    $item = $this.find(options.item),
                    _init = $this.data('init'),
                    _tempW = 0,
                    overWidth = options.overWidth,
                    setWidth = function() {
                        var _maxH = 0,
                            _ww = $win.width();
                        if (_tempW != _ww) {
                            _tempW = _ww;
                            $item.css({
                                height: ''
                            });
                            if (_ww >= overWidth) {
                                if ($item.find('img').length) {
                                    $item.imagesLoaded(function() {
                                        $item.each(function() {
                                            var _h = $(this).outerHeight();
                                            if (_h > _maxH) _maxH = _h;
                                        }).css({
                                            height: _maxH + 'px'
                                        });
                                    })
                                } else {
                                    $item.each(function() {
                                        var _h = $(this).outerHeight();
                                        if (_h > _maxH) _maxH = _h;
                                    }).css({
                                        height: _maxH + 'px'
                                    });
                                }
                            }
                        }
                    },
                    bindEvent = function() {
                        $win.on('resize.setH', setWidth).on('load', function() {
                            $win.trigger('resize.setH');
                        })
                    };
                if (!_init) {
                    $this.data('init', true);
                    bindEvent();
                }
            })
        }
    });
    $(function() {
        if (typeof(web_root) == 'undefined') var web_root = '';
        var $win = $(window),
            $body = $('body'),
            $mainNavWrap = $('#main-nav'),
            $navBtn = $('#nav-btn'),
            $langBtn = $('#lang-btn'),
            $btnSearch = $('#btn-icon-search'),
            $header = $('#header'),
            $banner = $('.banner'),
            $mobileSide = $header.find('.mobile-side'),
            $toggleNav = $('.toggle-nav'),
            $langWrap = $header.find('.lang-nav'),
            $footerNav = $('#footer .footer-nav'),
            $closeBtn01 = $('#nav-close-btn'),
            $maskBg = $('#mask-bg'),
            $goTop = $('#go-top'),
            $dynNode = $('.dyn-node'),
            $nodePc = $('.node-pc'),
            $nodeMobile = $('.node-mobile'),
            pageWidth = 0,
            brokenWidth = 768,
            widthChange = function() {
                var _change = pageWidth != $win.width();
                if (_change) {
                    pageWidth = $win.width();
                }
                return _change;
            },
            openNav = function(p0) {
                var elem = ['#', p0].join('');
                $navBtn.removeClass('on').filter(elem).addClass('on');
                if (!$body.hasClass('lock')) {
                    $body.addClass('lock');
                    $maskBg.addClass('on');
                };
                $mobileSide.addClass('on');
                setMobileSideHeight();
            },
            closeNav = function() {
                $navBtn.removeClass('on');
                $mainNavWrap.find('li').removeClass('on').filter(function() {
                    return $(this).data('currentOn') == true;
                }).addClass('on');
                $mobileSide.removeClass('on');
                $langWrap.removeClass('on');
                $maskBg.removeClass('on');
                $body.removeClass('lock');
            },
            checknavBtn = function() {
                var _NavOn = $navBtn.filter('.on').length;
                if (pageWidth > brokenWidth && _NavOn) closeNav();
            },
            setMobileSideHeight = function() {
                var _h = $win.height() - $header.outerHeight();
                $mobileSide.css(pageWidth > 768 ? {
                    'max-height': ''
                } : {
                    'max-height': _h + 'px'
                });
            },
            // changeDynImg = function(){
            // 	$('.dyn-img').each(function(){
            // 		var $this = $(this),
            // 			_pic = pageWidth >= 640 ? $this.data('pc') : $this.data('mobile'),
            // 			_bg = ['url(', _pic, ')'].join('');
            // 		$this.css({'background-image': _bg});
            // 	})
            // },
            moveNode = function() {
                if (pageWidth > 768) {
                    $dynNode.each(function() {
                        var selfNode = $(this).data('node'),
                            _init = $(this).parent().hasClass('node-pc'),
                            $parent = $nodePc.filter(function() {
                                return $(this).data('child') == selfNode;
                            });
                        if (!_init) $(this).appendTo($parent);
                    });
                } else {
                    $dynNode.each(function() {
                        var selfNode = $(this).data('node'),
                            _init = $(this).parent().hasClass('node-mobile'),
                            $parent = $nodeMobile.filter(function() {
                                return $(this).data('child') == selfNode;
                            });
                        if (!_init) $(this).appendTo($parent);
                    });
                }
            };
        if ($mainNavWrap.length) {
            $mainNavWrap.addNavStyle();
            $mainNavWrap.addNavEvent();
        }
        /** 行動選單開合 */
        if ($navBtn.length) {
            $navBtn.on('click', function(e) {
                e.preventDefault();
                setMobileSideHeight();
                if (pageWidth <= brokenWidth) {
                    var $this = $(this),
                        isOpen = $this.hasClass('on'),
                        navName = this.id;
                    if ($langWrap.hasClass('on')) $langWrap.removeClass('on');
                    isOpen ? closeNav() : openNav(navName);
                }
            });
        }
        $maskBg.on('click', closeNav);

        /** 語系開合 */
        $langBtn.on('click', function(e) {
            e.preventDefault();
            $langWrap.toggleClass('on');
        });
        $("a[target='_blank']").on('click', function() {
            $(this).blur();
        })
        /** 搜尋表單開合 */
        $btnSearch.on('click', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('on');
        });

        /** 開合選單 */
        $toggleNav.find('.nav-title').on('click', function(e) {
            e.preventDefault();
            $(this).parent().toggleClass('on');
        })

        /** 選單關閉 */
        $closeBtn01.on('click', function(e) {
            e.preventDefault();
            closeNav();
        });

        /** 回頂端事件 */
        $goTop.on('click', function(e) {
            e.preventDefault();
            $('html, body').scrollTop(0);
            //$('html, body').stop().animate({ scrollTop: 0 }, 300);
        });

        /** GOTOP顯示 */
        $win.on('scroll', function() {
            var _scroll = $win.scrollTop(),
                _winH = $win.height(),
                _top = $header.outerHeight();
            $goTop[_scroll > _top ? 'addClass' : 'removeClass']('block');
        }).trigger('scroll');

        /** 手機次選單 */
        $win.on('resize', function() {
            if (widthChange()) {
                moveNode();
                checknavBtn();
                // changeDynImg();
            }
        }).trigger('resize');
        $win.on('load', function() {
            $(this).trigger('resize');
        }).trigger('resize');

        /** 目錄開合 */
        var $tocList = $('.nav-toc-list');
        if ($tocList.length) {
            $tocList.on('click', '.thumb', function(e) {
                e.preventDefault();
                $(this).parent().toggleClass('off');
            }).on('click', '.nav-list > li:has(ul) > a', function(e) {
                e.preventDefault();
                $(this).parent().toggleClass('on').siblings().removeClass('on');
            })
        }

        /** banner圖片預先載入 */
        // var preBg = '';
        // if($banner.find('.dyn-img').length){
        // 	preBg = $win.width() >= 640 ? $banner.find('.dyn-img:first-child').data('pc') : $banner.find('.dyn-img').data('mobile');
        // }else if($banner.find('.figure').length) {
        // 	preBg = $banner.find('.figure:first-child').css('background-image');
        // 	preBg = preBg.replace('url(','').replace(')','').replace(/\"/gi, "");
        // }
        // if(preBg!='') {
        // 	$('<img/>').attr('src', preBg).on('load', function() {
        // 		$banner.addClass('init');
        // 	});
        // };
    });
})(jQuery);