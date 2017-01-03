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
        if ((l[0] == 0 && l.length == 1) || (r[0] == 0 && r.length == 1)) {
            return [0];
        }
        console.log(l, r);
        var i;
        var q = JSON.parse(JSON.stringify(l));
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
function poly_toString(poly, order) {
    str = poly[0].toString();
    if (!order){
        for (var i = 1; i < poly.length; ++i) {
            if (poly[i] > 0) {
                str += "+";
            }
            str += poly[i].toString();
            str += "x^" + i;
        }
    } else {
        for (var i = 1; i < poly.length; ++i) {
            if (poly[i] > 0) {
                str = "+" + str;
            }
            str = "x^" + i + str;
            str = poly[i].toString() + str;
        }
    }
    return str.replace(/\^1/, '').replace(/([+\-]?)1x/,'$1x');
}
function poly_deg(p) {
    if (!(p instanceof Array)) {
        return p ? 0 : Number.NEGATIVE_INFINITY;
    }
    var i = p.length - 1;
    while (i >= 0 && !p[i])
        i--;
    return i < 0 ? Number.NEGATIVE_INFINITY : i;
}
function poly_div(nu, de) {
    if (poly_deg(nu) < poly_deg(de)) {
        return [0, nu];
    } else {
        var degree = poly_deg(nu) - poly_deg(de);
        var res = [];
        var n = JSON.parse(JSON.stringify(nu));
        for (var i = 0; i <= degree; ++i) {
            res.push(0);
        }
        for (var i = degree; i >= 0; --i) {
            var x = poly_deg(nu) - degree + i;
            res[i] = n[x] / de[poly_deg(de)];
            //console.log('div',0,i,x, res,de, n);
            n = poly_add(nu, poly_mul(-1, res, de));
            //console.log('div',1,i,x, res,de, n);
        }
        return [res, n];
    }
}
