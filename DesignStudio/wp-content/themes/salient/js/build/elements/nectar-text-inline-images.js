! function(i) {
    "use strict";

    function t(i) {
        this.$el = i, this.$markers = this.$el.find(".nectar-text-inline-images__marker"), this.positionImages(), this.events()
    }
    t.prototype.positionImages = function() {
        this.$markers.each(function(t) {
            var n = i(this).find("img").length > 0 ? "img" : "video";
            if ("video" == n) {
                var e = i(this).height();
                i(this).find(n).css({
                    width: 1.7 * e + "px"
                })
            }
            var s = i(this).find(n);
            if (s.length > 0) {
                var o = s[0].getBoundingClientRect();
                i(this)[0].style.width = o.width + "px"
            }
        }), this.$el.addClass("nectar-text-inline-images--calculated")
    }, t.prototype.events = function() {
        i(window).on("resize", this.positionImages.bind(this)), i(window).on("nectar-waypoints-reinit", this.waypoint.bind(this)), window.Waypoint ? this.waypoint() : i(window).on("salient-delayed-js-loaded", this.waypoint.bind(this))
    }, t.prototype.waypoint = function() {
        var t = [],
            n = this;
        this.$el.hasClass("nectar-text-inline-images--stagger-animation") ? t = new Waypoint({
            element: n.$el[0],
            handler: function() {
                n.$markers.each(function(t) {
                    var n = i(this);
                    setTimeout(function() {
                        n.addClass("animated-in")
                    }, 150 * t)
                }), t.destroy()
            },
            offset: "bottom-in-view"
        }) : this.$markers.each(function(n) {
            var e = i(this);
            t[n] = new Waypoint({
                element: i(this)[0],
                handler: function() {
                    e.addClass("animated-in"), t[n].destroy()
                },
                offset: "bottom-in-view"
            })
        })
    };
    var n = [];

    function e() {
        n = [];
        var e = void 0 !== window.vc_iframe;
        i(".nectar-text-inline-images").each(function(s) {
            var o, a, r;
            0 == e && "IntersectionObserver" in window ? (o = i(this), a = s, (r = new IntersectionObserver(function(i) {
                i.forEach(function(i) {
                    i.isIntersecting && (n[a] = new t(o), r.unobserve(i.target))
                })
            }, {
                rootMargin: "300px 0px 300px 0px",
                threshold: 0
            })).observe(o[0])) : n[s] = new t(i(this))
        })
    }
    e(), i(window).on("vc_reload", function() {
        setTimeout(e, 200)
    })
}(jQuery);