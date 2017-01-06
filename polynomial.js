function poly_add(l, r) {
    if (arguments.length > 2) {
        var args = Array.prototype.slice.call(arguments, [0]);
        return poly_add.apply(this, [args.shift(), poly_add.apply(this, args)]);
    }
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
        //console.log(l, r);
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
            if (poly[i - 1] > 0) {
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
    if(de[0] == 0 && de.length == 0){ //zero ploynomial
        throw "division by 0";
    }
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
            ////console.log('div',0,i,x, res,de, n);
            n = poly_add(nu, poly_mul(-1, res, de));
            ////console.log('div',1,i,x, res,de, n);
        }
        return [res, n];
    }
}
function poly_differentiate(poly) {
    var a = poly.map(function(a,b){
        return a*b;
    });
    a.shift();
    return a;
}
function poly_lip(points){
    var tmp=[1];
    var result=[0];
    //var points=[[0, 0], [1, 1], [-2, -8], [5, 125], [10, 1000]];
    for(i in points){
        tmp=[1];
        for(j in points){
            if(i!=j){
                console.log(i,j,tmp,[-points[j][0],1],points[i][0]-points[j][0]);
                tmp=poly_mul(tmp,poly_div([-points[j][0],1],[points[i][0]-points[j][0]])[0]);
            }
        }
        result=poly_add(poly_mul(tmp,points[i][1]),result);
    }
    return result;
}
function farey(x,N){
    var a=0;
    var b=1;
    var c=1;
    var d=1;
    while(b<=N&&d<=N){
        var mid=(a+c)/(b+d);
        if(x==mid){
            //console.log("%s == (%s+%s)/(%s+%s)",x,a,b,c,d);
            if(b+d<=N) return [a+c,b+d];
            if(d>b) return [c,d];
            return [a,b]
        }else{
            if(x>mid){
                //console.log("%s >  (%s+%s)/(%s+%s)",x,a,b,c,d);
                a+=c;
                b+=d;
            }else{
                //console.log("%s <= (%s+%s)/(%s+%s)",x,a,b,c,d); 
                c+=a;
                d+=b;
            }
        }
    }
    if(b>N){
        return [c,d];
    }else{
        return [a,b];
    }
}
