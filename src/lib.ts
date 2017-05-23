
let stringEmpty = "",
    toString = Object.prototype.toString,
    core_hasOwn = Object.prototype.hasOwnProperty,
    noop = function () { },
    slice = Array.prototype.slice;

export const lib = {
    stringEmpty: stringEmpty,
    noop: noop,
    hasOwnProp: function (obj:any, prop:string) {
        return core_hasOwn.call(obj, prop);
    },
    trace: function (e:Error) {
        console.error && console.error(e.stack || e.message || e+'');
    },
    isType: function (typename:string, value:any) {
        //typename:String, Array, Boolean, Object, RegExp, Date, Function,Number //兼容
        //typename:Null, Undefined,Arguments    //IE不兼容
        return toString.apply(value) === '[object ' + typename + ']';
    },
    isUndefined: function (obj:any) {
        ///<summary>是否定义</summary>

        return (typeof (obj) === "undefined" || obj === undefined);
    },
    isNull: function (obj:any) {
        ///<summary>是否Null</summary>

        return (obj === null || this.isUndefined(obj));
    },
    isBoolean: function (obj:any) {
        return this.isType("Boolean", obj);
    },
    isNullEmpty: function (s:any) {
        return (this.isNull(s) || s === stringEmpty);
    },
    isFunction: function (fun:any) {
        return this.isType("Function", fun);
    },
    isNumeric: function (n:any) {
        //return this.isType("Number", n) && !isNaN(n) && isFinite(n);;
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    isString: function (obj:any) {
        return this.isType("String", obj);
    },
    isObject: function (obj:any) {
        return !this.isNull(obj) && this.isType("Object", obj)
            && !this.isElement(obj) && !this.isWindow(obj);//IE8以下isElement, isWindow认为Object
    },
    isPlainObject: function (obj) {
        if (!this.isObject(obj)) {
            return false;
        }
        try {
            // Not own constructor property must be Object
            if (obj.constructor &&
                !core_hasOwn.call(obj, "constructor") &&
                !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            // IE8,9 Will throw exceptions on certain host objects #9897
            return false;
        }

        // Own properties are enumerated firstly, so to speed up,
        // if last one is own, then all properties are own.
        var key;
        for (key in obj) { }

        return key === undefined || core_hasOwn.call(obj, key);
    },
    isArray: function (value:any) {
        return Array.isArray ? Array.isArray(value) : this.isType("Array", value);
    },
    isWindow: function (obj:any) { return !!(obj && obj == obj.window); },
    isElement: function (obj:any) { var t = obj && (obj.ownerDocument || obj).documentElement; return t ? true : false; },
    trim: function (str:string) {
        return str.replace(/(^\s*)|(\s*$)|(^\u3000*)|(\u3000*$)|(^\ue4c6*)|(\ue4c6*$)/g, '');
    },
    replaceAll: function (s:string, str:string, repl:string, flags:string = "g") {
        if (this.isNullEmpty(s) || this.isNullEmpty(str)) return s;
        str = str.replace(/([^A-Za-z0-9])/g, "\\$1");
        s = s.replace(new RegExp(str, flags), repl);
        return s;
    },
    inArray:function(list:Array<any>, p: any, thisArg:any=null):number{
        var isF = this.isFunction(p),
            index = -1;
        this.each(list, (item, idx)=>{
            var ok = isF ? p.call(thisArg, item, idx) : (item == p);
            if (ok){
                index = idx;
                return false;
            }
        }, thisArg);
        return index;
    },
    each:function(list:Array<any>, fn:(item:any, idx:number)=>any, thisArg:any=null){
        var len = list.length;
        for (let i=0, len = list.length; i<len; i++){
            if (fn.call(thisArg, list[i], i) === false) break;
        }
    }
};