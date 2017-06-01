
let stringEmpty = "",
    toString = Object.prototype.toString,
    core_hasOwn = Object.prototype.hasOwnProperty,
    noop = function () { },
    slice = Array.prototype.slice;

function testObject(obj:any){
    if (obj.constructor &&
        !core_hasOwn.call(obj, "constructor") &&
        !core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
        return false;
    }
}

export default class Cmpx {
    static stringEmpty = stringEmpty;

    static noop  = noop;

    static hasOwnProp(obj:any, prop:string) {
        return core_hasOwn.call(obj, prop);
    }

    static trace(e:any) {
        console.error && console.error(e.stack || e.message || e+'');
    }

    static isType(typename:string, value:any) {
        //typename:String, Array, Boolean, Object, RegExp, Date, Function,Number //兼容
        //typename:Null, Undefined,Arguments    //IE不兼容
        return toString.apply(value) === '[object ' + typename + ']';
    }

    static isUndefined(obj:any) {
        ///<summary>是否定义</summary>

        return (typeof (obj) === "undefined" || obj === undefined);
    }

    static isNull(obj:any) {
        ///<summary>是否Null</summary>

        return (obj === null || Cmpx.isUndefined(obj));
    }

    static isBoolean(obj:any) {
        return Cmpx.isType("Boolean", obj);
    }

    static isNullEmpty(s:any) {
        return (Cmpx.isNull(s) || s === stringEmpty);
    }

    static isFunction(fun:any) {
        return Cmpx.isType("Function", fun);
    }

    static isNumeric(n:any) {
        //return cmpx.isType("Number", n) && !isNaN(n) && isFinite(n);;
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    static isString(obj:any) {
        return Cmpx.isType("String", obj);
    }

    static isObject(obj:any) {
        return obj && Cmpx.isType("Object", obj)
            && !Cmpx.isElement(obj) && !Cmpx.isWindow(obj);//IE8以下isElement, isWindow认为Object
    }

    static tryCatch(tryFn:Function, catchFn:(e:any)=>any, args:Array<any>=[], thisArg:any=null):any{
        try{
            return tryFn.apply(thisArg, args);
        } catch(e){
            return catchFn.call(thisArg, e);
        }
    }

    static isPlainObject(obj:any) {
        if (!Cmpx.isObject(obj)) return false;

        try {
            if (testObject(obj) === false) return false;
        } catch (e) {
            return false;
        }

        var key;
        for (key in obj) { }

        return key === undefined || core_hasOwn.call(obj, key);
    }

    static encodeHtml(html:string):string{
        return !html ? '' : html.replace(/\</g, '&lt;').replace(/\>/g, '&gt;').
            replace(/\&/g, '&amp;').replace(/\"/g, '&quot;').replace(/ /g, "&nbsp;").replace(/\'/g, "&#39;");
    }

    static decodeHtml(html:string):string{
        return !html ? '' : html.replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&')
            .replace('&quot;', '"').replace("&nbsp;", ' ').replace("&#39;", "'");
    }

    static isArray(value:any) {
        return Array.isArray ? Array.isArray(value) : Cmpx.isType("Array", value);
    }

    static isWindow(obj:any) { return !!(obj && obj == obj.window); }

    static isElement(obj:any) { var t = obj && (obj.ownerDocument || obj).documentElement; return t ? true : false; }

    static trim(str:string) {
        return str.replace(/^(?:\s|\u3000|\ue4c6)*|(?:\s|\u3000|\ue4c6)*$/g, '');
    }

    static replaceAll(s:string, str:string, repl:string, flags:string = "g") {
        if (Cmpx.isNullEmpty(s) || Cmpx.isNullEmpty(str)) return s;
        str = str.replace(/([^A-Za-z0-9 ])/g, "\\$1");
        s = s.replace(new RegExp(str, flags), repl);
        return s;
    }

    static inArray(list:Array<any>, p: any, thisArg:any=null):number{
        var isF = Cmpx.isFunction(p),
            index = -1;
        Cmpx.each(list, (item, idx)=>{
            var ok = isF ? p.call(thisArg, item, idx) : (item == p);
            if (ok){
                index = idx;
                return false;
            }
        }, thisArg);
        return index;
    }

    static toArray(p:any, start:number = 0, count:number = Number.MAX_VALUE) : Array<any>{
        return p ? slice.apply(p, [start, count]) : p;
    }

    static each(list:Array<any>, fn:(item:any, idx:number)=>any, thisArg:any=null){
        var len = list.length;
        for (let i=0, len = list.length; i<len; i++){
            if (fn.call(thisArg, list[i], i) === false) break;
        }
    }

    static eachProp(obj: any, callback:(item:any, name:string)=>void, thisArg: any=null) {
        if (!obj) return;
        var item;
        for (var n in obj) {
            if (Cmpx.hasOwnProp(obj, n)) {
                item = obj[n];
                if (callback.call(thisArg, item, n) === false) break;
            }
        }
    }

    static extend(obj:Object, p:Object):Object{
        if (obj && p){
            Cmpx.eachProp(p, (item:string, name:string) => obj[name] = item);
        }
        return obj;
    }
}
