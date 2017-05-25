import Cmpx from '../Cmpx';


interface tranParam {
    tmpl:string;
    length:number;
    index:number;
    strs:Array<string>;
    result:Array<string>;
    next:()=>void;
    isEnd:()=>boolean;
}

var tmpl = 'before<div><span id="spanId">spanText</span>  divText</div>';

var _trans = function(tmpl:string){
    if (!tmpl) return '';
    var p = {tmpl:tmpl, length:tmpl.length, index:0, strs:[], result:[], next:function(){
            this.result.push(this.strs.join(''));
            this.index += (this.strs.length+1);
            this.strs = [];
        },
        isEnd:function(){
            return this.index >= this.length;
        }
    };
    _transText(p);
    console.log(p);
},
_takeContent = function(p:tranParam, start:RegExp, end:RegExp, startPass:RegExp = null, fn:any=null){
    var isStart =  !!startPass && !!start;
    _transEach(p, function(item:string, index:number, strs:Array<string>, result:Array<any>, p:tranParam){
        if (isStart){
            if (end.test(item)){
                p.next();
                fn && fn(p);
                return false;
            } else
                strs.push(item);
        } else{
            if (!startPass || !startPass.test(item)){
                if (!start)
                    isStart = true;
                else
                    isStart = start.test(item);
                if (isStart)
                    strs.push(item);
            }
        }
    });
    
},
_transEach = function(p:tranParam, fn:any){
    var tmpl = p.tmpl, len = p.length,
        index = p.index,result = p.result;
    var strs = p.strs, s;
    while(index < len){
        s = tmpl[index];
        index++;
        if (fn(s, index, strs, result, p) === false){
            break;
        }
    }
    return index;
},
_transText = function(p:tranParam){
    _takeContent(p, null, /[<>]/, null, function(p:tranParam){
        _transTargetName(p);
    });
    if (!p.isEnd())
        _transText(p);
},
_transTargetName = function(p:tranParam){
    _takeContent(p, /[\S]/, /[ <>]/, / /, function(p:tranParam){
        _transAttrName(p);
    });
},
_transAttrName = function(p:tranParam){
    var start = false;
    _takeContent(p, /[\S]/, /[ =><]/, /[> ]/, function(p:tranParam){
        _transAttrContent(p);
    });
},
_transAttrContent = function(p:tranParam){
     _takeContent(p, /[\S]/, /["' >]/, /[= "']/);
};

_trans(tmpl);
