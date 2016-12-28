function poly_add(l, r) {
    if (!(l instanceof Array)) {
        l = [l];
    }
    if (!(r instanceof Array)) {
        r = [r];
    }
    var len = Math.max(l.length, r.length);
    var len2 = Math.min(l.length, r.length);
    var t = [];
    var i;
    for (i = 0; i < len2; ++i) {
        t[i] = l[i] + r[i];
    }
    if (l[i]) {
        for (; i < len; ++i) {
            t[i] = l[i];
        }
    } else {
        for (; i < len; ++i) {
            t[i] = r[i];
        }
    }
    return t;
}
function poly_mul(l, r) {
    if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, [0]);
        return poly_mul.apply(this, [args.shift(), poly_mul.apply(this, args)]);
    } else {
        if (!(l instanceof Array)) {
            l = [l];
        }
        if (!(r instanceof Array)) {
            r = [r];
        }
        console.log(l, r);
        var i;
        var q = l;
        var t = [];
        for (i = 0; i < r.length; ++i) {
            t = poly_add(t, q.map(function(a) {
                return r[i] * a;
            }));
            q.unshift(0);
        }
        return t;
    }
}
function poly_toString(poly) {
    str = poly[0].toString();
    for (var i = 1; i < poly.length; ++i) {
        if (poly[i] > 0) {
            str += "+";
        }
        str += poly[i].toString();
        str += "x^" + i;
    }
    return str.replace(/\^1/, );
}
