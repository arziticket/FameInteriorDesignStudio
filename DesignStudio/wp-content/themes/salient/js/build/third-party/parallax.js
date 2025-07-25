! function(t, i, e, s) {
    "use strict";
    var o = "parallax",
        n = {
            relativeInput: !1,
            clipRelativeInput: !1,
            calibrationThreshold: 100,
            calibrationDelay: 500,
            supportDelay: 500,
            calibrateX: !1,
            calibrateY: !0,
            invertX: !0,
            invertY: !0,
            limitX: !1,
            limitY: !1,
            scalarX: 10,
            scalarY: 10,
            frictionX: .07,
            frictionY: .07,
            originX: .5,
            originY: .5
        };

    function a(i, e) {
        this.element = i, this.$context = t(i).data("api", this), this.$layers = this.$context.find(".layer");
        var s = {
            calibrateX: this.$context.data("calibrate-x") || null,
            calibrateY: this.$context.data("calibrate-y") || null,
            invertX: this.$context.data("invert-x") || null,
            invertY: this.$context.data("invert-y") || null,
            limitX: parseFloat(this.$context.data("limit-x")) || null,
            limitY: parseFloat(this.$context.data("limit-y")) || null,
            scalarX: parseFloat(this.$context.data("scalar-x")) || null,
            scalarY: parseFloat(this.$context.data("scalar-y")) || null,
            frictionX: parseFloat(this.$context.data("friction-x")) || null,
            frictionY: parseFloat(this.$context.data("friction-y")) || null,
            originX: parseFloat(this.$context.data("origin-x")) || null,
            originY: parseFloat(this.$context.data("origin-y")) || null
        };
        for (var o in s) null === s[o] && delete s[o];
        t.extend(this, n, e, s), this.calibrationTimer = null, this.calibrationFlag = !0, this.enabled = !1, this.depths = [], this.raf = null, this.bounds = null, this.ex = 0, this.ey = 0, this.ew = 0, this.eh = 0, this.ecx = 0, this.ecy = 0, this.erx = 0, this.ery = 0, this.cx = 0, this.cy = 0, this.ix = 0, this.iy = 0, this.mx = 0, this.my = 0, this.vx = 0, this.vy = 0, this.onMouseMove = this.onMouseMove.bind(this), this.onDeviceOrientation = this.onDeviceOrientation.bind(this), this.onOrientationTimer = this.onOrientationTimer.bind(this), this.onCalibrationTimer = this.onCalibrationTimer.bind(this), this.onAnimationFrame = this.onAnimationFrame.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.initialise()
    }
    a.prototype.transformSupport = function(t) {
        for (var s = e.createElement("div"), o = !1, n = null, a = !1, r = null, h = null, l = 0, p = this.vendors.length; l < p; l++)
            if (null !== this.vendors[l] ? (r = this.vendors[l][0] + "transform", h = this.vendors[l][1] + "Transform") : (r = "transform", h = "transform"), void 0 !== s.style[h]) {
                o = !0;
                break
            }
        switch (t) {
            case "2D":
                a = o;
                break;
            case "3D":
                if (o) {
                    var c = e.body || e.createElement("body"),
                        m = e.documentElement,
                        u = m.style.overflow;
                    e.body || (m.style.overflow = "hidden", m.appendChild(c), c.style.overflow = "hidden", c.style.background = ""), c.appendChild(s), s.style[h] = "translate3d(1px,1px,1px)", a = void 0 !== (n = i.getComputedStyle(s).getPropertyValue(r)) && n.length > 0 && "none" !== n, m.style.overflow = u, c.removeChild(s)
                }
        }
        return a
    }, a.prototype.ww = null, a.prototype.wh = null, a.prototype.wcx = null, a.prototype.wcy = null, a.prototype.wrx = null, a.prototype.wry = null, a.prototype.portrait = null, a.prototype.desktop = !navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|BB10|mobi|tablet|opera mini|nexus 7)/i), a.prototype.vendors = [null, ["-webkit-", "webkit"],
        ["-moz-", "Moz"],
        ["-o-", "O"],
        ["-ms-", "ms"]
    ], a.prototype.motionSupport = !!i.DeviceMotionEvent, a.prototype.orientationSupport = !!i.DeviceOrientationEvent, a.prototype.orientationStatus = 0, a.prototype.transform2DSupport = a.prototype.transformSupport("2D"), a.prototype.transform3DSupport = a.prototype.transformSupport("3D"), a.prototype.propertyCache = {}, a.prototype.initialise = function() {
        "static" === this.$context.css("position") && this.$context.css({
            position: "relative"
        }), this.accelerate(this.$context), this.updateLayers(), this.updateDimensions(), this.enable(), this.queueCalibration(this.calibrationDelay)
    }, a.prototype.updateLayers = function() {
        this.$layers = this.$context.find(".layer"), this.depths = [], this.$layers.css({
            position: "absolute",
            display: "block",
            left: 0,
            top: 0
        }), this.$layers.first().css({
            position: "relative"
        }), this.accelerate(this.$layers), this.$layers.each(t.proxy(function(i, e) {
            this.depths.push(t(e).data("depth") || 0)
        }, this))
    }, a.prototype.updateDimensions = function() {
        this.ww = i.innerWidth, this.wh = i.innerHeight, this.wcx = this.ww * this.originX, this.wcy = this.wh * this.originY, this.wrx = Math.max(this.wcx, this.ww - this.wcx), this.wry = Math.max(this.wcy, this.wh - this.wcy)
    }, a.prototype.updateBounds = function() {
        this.bounds = this.element.getBoundingClientRect(), this.ex = this.bounds.left, this.ey = this.bounds.top, this.ew = this.bounds.width, this.eh = this.bounds.height, this.ecx = this.ew * this.originX, this.ecy = this.eh * this.originY, this.erx = Math.max(this.ecx, this.ew - this.ecx), this.ery = Math.max(this.ecy, this.eh - this.ecy)
    }, a.prototype.queueCalibration = function(t) {
        clearTimeout(this.calibrationTimer), this.calibrationTimer = setTimeout(this.onCalibrationTimer, t)
    }, a.prototype.enable = function() {
        this.enabled || (this.enabled = !0, this.orientationSupport ? (this.portrait = null, i.addEventListener("deviceorientation", this.onDeviceOrientation), setTimeout(this.onOrientationTimer, this.supportDelay)) : (this.cx = 0, this.cy = 0, this.portrait = !1, i.addEventListener("mousemove", this.onMouseMove)), i.addEventListener("resize", this.onWindowResize), this.raf = requestAnimationFrame(this.onAnimationFrame))
    }, a.prototype.disable = function() {
        this.enabled && (this.enabled = !1, this.orientationSupport ? i.removeEventListener("deviceorientation", this.onDeviceOrientation) : i.removeEventListener("mousemove", this.onMouseMove), i.removeEventListener("resize", this.onWindowResize), cancelAnimationFrame(this.raf))
    }, a.prototype.calibrate = function(t, i) {
        this.calibrateX = void 0 === t ? this.calibrateX : t, this.calibrateY = void 0 === i ? this.calibrateY : i
    }, a.prototype.invert = function(t, i) {
        this.invertX = void 0 === t ? this.invertX : t, this.invertY = void 0 === i ? this.invertY : i
    }, a.prototype.friction = function(t, i) {
        this.frictionX = void 0 === t ? this.frictionX : t, this.frictionY = void 0 === i ? this.frictionY : i
    }, a.prototype.scalar = function(t, i) {
        this.scalarX = void 0 === t ? this.scalarX : t, this.scalarY = void 0 === i ? this.scalarY : i
    }, a.prototype.limit = function(t, i) {
        this.limitX = void 0 === t ? this.limitX : t, this.limitY = void 0 === i ? this.limitY : i
    }, a.prototype.origin = function(t, i) {
        this.originX = void 0 === t ? this.originX : t, this.originY = void 0 === i ? this.originY : i
    }, a.prototype.clamp = function(t, i, e) {
        return t = Math.max(t, i), t = Math.min(t, e)
    }, a.prototype.css = function(i, e, s) {
        var o = this.propertyCache[e];
        if (!o)
            for (var n = 0, a = this.vendors.length; n < a; n++)
                if (o = null !== this.vendors[n] ? t.camelCase(this.vendors[n][1] + "-" + e) : e, void 0 !== i.style[o]) {
                    this.propertyCache[e] = o;
                    break
                }
        i.style[o] = s
    }, a.prototype.accelerate = function(t) {
        for (var i = 0, e = t.length; i < e; i++) {
            var s = t[i];
            this.css(s, "transform", "translate3d(0,0,0)"), this.css(s, "transform-style", "preserve-3d"), this.css(s, "backface-visibility", "hidden")
        }
    }, a.prototype.setPosition = function(t, i, e) {
        i += "px", e += "px", this.transform3DSupport ? this.css(t, "transform", "translate3d(" + i + "," + e + ",0)") : this.transform2DSupport ? this.css(t, "transform", "translate(" + i + "," + e + ")") : (t.style.left = i, t.style.top = e)
    }, a.prototype.onOrientationTimer = function(t) {
        this.orientationSupport && 0 === this.orientationStatus && (this.disable(), this.orientationSupport = !1, this.enable())
    }, a.prototype.onCalibrationTimer = function(t) {
        this.calibrationFlag = !0
    }, a.prototype.onWindowResize = function(t) {
        this.updateDimensions()
    }, a.prototype.onAnimationFrame = function() {
        this.updateBounds();
        var t = this.ix - this.cx,
            i = this.iy - this.cy;
        (Math.abs(t) > this.calibrationThreshold || Math.abs(i) > this.calibrationThreshold) && this.queueCalibration(0), this.portrait ? (this.mx = this.calibrateX ? i : this.iy, this.my = this.calibrateY ? t : this.ix) : (this.mx = this.calibrateX ? t : this.ix, this.my = this.calibrateY ? i : this.iy), this.mx *= this.ew * (this.scalarX / 100), this.my *= this.eh * (this.scalarY / 100), isNaN(parseFloat(this.limitX)) || (this.mx = this.clamp(this.mx, -this.limitX, this.limitX)), isNaN(parseFloat(this.limitY)) || (this.my = this.clamp(this.my, -this.limitY, this.limitY)), this.vx += (this.mx - this.vx) * this.frictionX, this.vy += (this.my - this.vy) * this.frictionY;
        for (var e = 0, s = this.$layers.length; e < s; e++) {
            var o = this.depths[e],
                n = this.$layers[e],
                a = this.vx * o * (this.invertX ? -1 : 1),
                r = this.vy * o * (this.invertY ? -1 : 1);
            this.setPosition(n, a, r)
        }
        this.raf = requestAnimationFrame(this.onAnimationFrame)
    }, a.prototype.onDeviceOrientation = function(t) {
        if (!this.desktop && null !== t.beta && null !== t.gamma) {
            this.orientationStatus = 1;
            var e = (t.beta || 0) / 30,
                s = (t.gamma || 0) / 30,
                o = i.innerHeight > i.innerWidth;
            this.portrait !== o && (this.portrait = o, this.calibrationFlag = !0), this.calibrationFlag && (this.calibrationFlag = !1, this.cx = e, this.cy = s), this.ix = e, this.iy = s
        }
    }, a.prototype.onMouseMove = function(t) {
        var i = t.clientX,
            e = t.clientY;
        !this.orientationSupport && this.relativeInput ? (this.clipRelativeInput && (i = Math.max(i, this.ex), i = Math.min(i, this.ex + this.ew), e = Math.max(e, this.ey), e = Math.min(e, this.ey + this.eh)), this.ix = (i - this.ex - this.ecx) / this.erx, this.iy = (e - this.ey - this.ecy) / this.ery) : (this.ix = (i - this.wcx) / this.wrx, this.iy = (e - this.wcy) / this.wry)
    };
    var r = {
        enable: a.prototype.enable,
        disable: a.prototype.disable,
        updateLayers: a.prototype.updateLayers,
        calibrate: a.prototype.calibrate,
        friction: a.prototype.friction,
        invert: a.prototype.invert,
        scalar: a.prototype.scalar,
        limit: a.prototype.limit,
        origin: a.prototype.origin
    };
    t.fn[o] = function(i) {
        var e = arguments;
        return this.each(function() {
            var s = t(this),
                n = s.data(o);
            n || (n = new a(this, i), s.data(o, n)), r[i] && n[i].apply(n, Array.prototype.slice.call(e, 1))
        })
    }
}(window.jQuery || window.Zepto, window, document),
function() {
    for (var t = 0, i = ["ms", "moz", "webkit", "o"], e = 0; e < i.length && !window.requestAnimationFrame; ++e) window.requestAnimationFrame = window[i[e] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[i[e] + "CancelAnimationFrame"] || window[i[e] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function(i, e) {
        var s = (new Date).getTime(),
            o = Math.max(0, 16 - (s - t)),
            n = window.setTimeout(function() {
                i(s + o)
            }, o);
        return t = s + o, n
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
        clearTimeout(t)
    })
}();