function poly_add() {
    var args = Array.prototype.slice.call(arguments, [0]);
    if (arguments.length > 2) {
        return poly_add.apply(this, [args.shift(), poly_add.apply(this, args)]);
    }
    for(var i in [0,1]) {
        if(!(args[i] instanceof Array)){
            args[i] = [args[i]];
        }
        for(var j in args[i]){
            if(!(args[i][j] instanceof Fraction)) {
                args[i][j] = new Fraction(args[i][j]);
            }
        }
    }
    var l = args[0];
    var r = args[1];
    if (!(l instanceof Array)) {
        l = [l];
    }
    if (!(r instanceof Array)) {
        r = [r];
    }
    var len = Math.max(l.length, r.length);
    var len2 = Math.min(l.length, r.length);
    var t = [];
    //var i;
    for (i = 0; i < len2; ++i) {
        t[i] = l[i].add(r[i]);
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

function poly_sub() {
    var args = Array.prototype.slice.call(arguments, [0]);
    if (arguments.length > 2) {
        return poly_sub.apply(this, [args.shift(), poly_add.apply(this, args)]);
    }
    for(var i in [0,1]) {
        if(!(args[i] instanceof Array)){
            args[i] = [args[i]];
        }
        for(var j in args[i]){
            if(!(args[i][j] instanceof Fraction)) {
                args[i][j] = new Fraction(args[i][j]);
            }
        }
    }
    var l = args[0];
    var r = args[1];
    if (!(l instanceof Array)) {
        l = [l];
    }
    if (!(r instanceof Array)) {
        r = [r];
    }
    var len = Math.max(l.length, r.length);
    var len2 = Math.min(l.length, r.length);
    var t = [];
    //var i;
    for (i = 0; i < len2; ++i) {
        t[i] = l[i].sub(r[i]);
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

function poly_mul() {
    var args = Array.prototype.slice.call(arguments, [0]);
    if (arguments.length > 2) {
        return poly_mul.apply(this, [args.shift(), poly_mul.apply(this, args)]);
    } else {
        for(var i in [0,1]) {
            if(!(args[i] instanceof Array)){
                args[i] = [args[i]];
            }
            for(var j in args[i]){
                if(!(args[i][j] instanceof Fraction)) {
                    args[i][j] = new Fraction(args[i][j]);
                }
            }
        }
        var l = args[0];
        var r = args[1];
        if ((l[0].val() === 0 && l.length === 1) || (r[0].val() === 0 && r.length === 1)) {
            return [new Fraction(0)];
        }
        //console.log(l, r);
        var q = []; //JSON.parse(JSON.stringify(l));
        for (i in l){
            q[i] = new Fraction(l[i].val());
        }
        var t = [];
        for (i = 0; i < r.length; ++i) {
            t = poly_add(t, q.map(function(a) {
                return r[i].mul(a);
            }));
            q.unshift(0);
        }
        return t;
    }
}
function poly_toString(poly, order) {
    var i;
    for(i in poly){
        poly[i] = new Fraction(poly[i]);
    }
    str = poly[0].val()!==0?poly[0].toString():"";
    if (!order){
        for (i = 1; i < poly.length; ++i) {
            if (poly[i].val() === 0){
                continue;
            }
            if (poly[i] > 0) {
                str += str?"+":"";
            }
            str += poly[i]==1?"":poly[i].toString();
            str += "x^" + i;
        }
    } else {
        for (i = 1; i < poly.length; ++i) {
            if (poly[i].val() === 0){
                continue;
            }
            if (poly[i - 1] > 0) {
                str = "+" + str;
            }
            str = "x^" + i + str;
            str = (poly[i]==1?"":poly[i].toString()) + str;
        }
    }
    return str.replace(/([+\-])/g,' $1 ').replace(/\^1\ /, ' ').replace(/\^1$/, ' ').replace(/^\ \-\ /,'-').trim();
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
    var args = arguments;
    for(var i in [0,1]) {
        if(!(args[i] instanceof Array)){
            args[i] = [args[i]];
        }
        for(var j in args[i]){
            if(!(args[i][j] instanceof Fraction)) {
                args[i][j] = new Fraction(args[i][j]);
            }
        }
    }
    if(de[0] === 0 && de.length === 0){ //zero ploynomial
        throw "division by 0";
    }
    if (poly_deg(nu) < poly_deg(de)) {
        return [0, nu];
    } else {
        var degree = poly_deg(nu) - poly_deg(de);
        var res = [];
        var n = []; //JSON.parse(JSON.stringify(nu));
        for (i in nu){
            n[i] = nu[i];
        }
        for (i = 0; i <= degree; ++i) {
            res.push(0);
        }
        for (i = degree; i >= 0; --i) {
            var x = poly_deg(nu) - degree + i;
            res[i] = n[x].div(de[poly_deg(de)]);
            ////console.log('div',0,i,x, res,de, n);
            n = poly_add(nu, poly_mul(-1, res, de));
            ////console.log('div',1,i,x, res,de, n);
        }
        return [res, n];
    }
}
function poly_differentiate(poly) {
    var p = [];
    for(var i in poly){
        p[i] = new Fraction(poly[i]);
    }
    var a = p.map(function(a,b){
        return a.mul(b);
    });
    a.shift();
    return a;
}
function poly_lip(points){
    var tmp=[1];
    var result=[0];
    for(i in points){
        tmp=[1];
        for(j in points){
            if(i!=j){
                tmp=poly_mul(tmp,poly_div([-points[j][0],1],[points[i][0]-points[j][0]])[0]);
            }
        }
        result=poly_add(poly_mul(tmp,points[i][1]),result);
    }
    return result;
}
function poly_fn(poly){
    var str = poly_toString(poly);
    return f=new Function('x','return '+str.replace(/x\ /,'x^1').replace(/x$/,'x^1').replace(/x/g,'*x').replace(/x\^(\d)+/g,'Math.pow(x,$1)'));
}
var Polynomial=(function(){
    var coef=[]; // private
    function Polynomial(){ // c-tor
        //if(new.target===undefined){
        //    throw "use `new' keyword";
        //}
        for(i in arguments){
            coef[i]=arguments[i];
        }
        return this;
    }
    Polynomial.prototype.get=function(p){
        if(p!==undefined){
            return coef[p];
        }else{
            return coef;
        }
    }; // public
    return Polynomial;
})();
var Fraction=(function(){
    function Fraction(x){
        var data=[];
        if(x instanceof Fraction){
            return new Fraction(x.val());
        }
        if(typeof x=="object"){
            data[0]=x[0];
            data[1]=x[1];
            this._get=function(){
                return [data[0],data[1]];
            };
            return this;
        }
        var f=x-Math.floor(x);
        data=(function(x,N){
            var a=0;
            var b=1;
            var c=1;
            var d=1;
            var e=0.5/N;
            var f=0;
            while(b<=N&&d<=N&&f<100000){
                ++f;
                var mid=(a+c)/(b+d);
                if(Math.abs(x-mid)<e){
                    if(b+d<=N) return [a+c,b+d];
                    if(d>b) return [c,d];
                    return [a,b];
                }else{
                    if(x>mid){
                        a+=c;
                        b+=d;
                    }else{
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
        })(f,1e9);
        data[0]+=data[1]*Math.floor(x);
        this._get=function(){
            return [data[0],data[1]];
        };
        return this;
    }
    function gcd(a,b){
        a = a<0?-a:a;
        b = b<0?-b:b;
        if(a&&b){
            if(b>a){
                return gcd(a,b-a*Math.floor(b/a));
            }
            return gcd(b,a-b*Math.floor(a/b));
        }else{
            return a+b;
        }
    }
    Fraction.prototype.inv=function(){
        var data=this._get();
        return new Fraction([data[1],data[0]]);
    }
    Fraction.prototype.toString=function(){
        var data=this._get();
        return (data[0]+'/'+data[1]).replace(/\/1$/,'');
    }
    Fraction.prototype.val=function(){
        var data=this._get();
        return data[0]/data[1];
    }
    Fraction.prototype.valueOf=function(){
        var data=this._get();
        return data[0]/data[1];
    }
    Fraction.prototype.add=function(x){
        if(!(x instanceof Fraction)){
            return this.add(new Fraction(x));
        }
        //3/5+1/2 = 6/10+5/10 = 11/10
        var l=this._get();
        var r=x._get();
        var den=l[1]*r[1]/gcd(l[1],r[1]);
        l[0]*=den/l[1];
        r[0]*=den/r[1];
        var n=l[0]+r[0];
        var g=gcd(n,den);
        return new this.constructor([n/g,den/g]);
    }
    Fraction.prototype.sub=function(x){
        if(!(x instanceof Fraction)){
            return this.sub(new Fraction(x));
        }
        //3/5+1/2 = 6/10+5/10 = 11/10
        var l=this._get();
        var r=x._get();
        var den=l[1]*r[1]/gcd(l[1],r[1]);
        l[0]*=den/l[1];
        r[0]*=den/r[1];
        var n=l[0]-r[0];
        var g=gcd(n,den);
        return new this.constructor([n/g,den/g]);
    }
    Fraction.prototype.mul=function(x){
        if(!(x instanceof Fraction)){
            return this.mul(new Fraction(x));
        }
        //3/5+1/2 = 6/10+5/10 = 11/10
        var l=this._get();
        var r=x._get();
        var e=[l[0]*r[0],l[1]*r[1]];
        var g=gcd(e[0],e[1]);
        return new Fraction([e[0]/g,e[1]/g]);
    }
    Fraction.prototype.div=function(x){
        if(!(x instanceof Fraction)){
            return this.div(new Fraction(x));
        }
        //3/5+1/2 = 6/10+5/10 = 11/10
        var l=this._get();
        var r=x._get();
        var e=[l[0]*r[1],l[1]*r[0]];
        var g=gcd(e[0],e[1]);
        return new Fraction([e[0]/g,e[1]/g]);
    }
    return Fraction;
})();
