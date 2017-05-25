import Cmpx from '../Cmpx';


interface tranParam {
    tmpl:string;
    length:number;
    index:number;
    result:Array<string>;
}

var tmpl = 'before<div><span id="spanId">spanText</span>  divText</div>';

var _trans = function(tmpl:string){
    if (!tmpl) return '';
    var p = {tmpl:tmpl, length:tmpl.length, index:0, result:[]}
    _transText(p);
    console.log(p);
},
_transEach = function(p:tranParam, fn:any){
    var tmpl = p.tmpl, len = p.length,
        index = p.index,result = p.result;
    var strs = [], s;
    while(index < len){
        s = tmpl[index];
        index++;
        if (fn(s, index, strs, result, p) === false){
            result.push(strs.join(''));
            p.index = index;
            break;
        }
    }
    return index;
},
_transText = function(p:tranParam){
    _transEach(p, function(item:string, index:number, strs:Array<string>, result:Array<any>, p:tranParam){
        if (item == '<'){
            _transTargetName(p);
            return false;
        } else {
            strs.push(item);
        }
    });
},
_transTargetName = function(p:tranParam){
    var start = false;
    _transEach(p, function(item:string, index:number, strs:Array<string>, result:Array<any>, p:tranParam){
        if (item == ' '){
            if (start){
                _transAttrName(p);
                return false;
            }
        } else {
            strs.push(item);
            if (!start) start = true;
        }
    });
},
_transAttrName = function(p:tranParam){
    var start = false;
    _transEach(p, function(item:string, index:number, strs:Array<string>, result:Array<any>, p:tranParam){
        if (item == ' '){
            if (start){
                _transAttrContent(p);
                return false;
            }
        } else {
            strs.push(item);
            if (!start) start = true;
        }
    });
},
_transAttrContent = function(p:tranParam){
    var start = false, overStart = false, overText = '';
    _transEach(p, function(item:string, index:number, strs:Array<string>, result:Array<any>, p:tranParam){
        if (item == ' '){
            if (start){
                if (item == overText || item == ' ' || item  == '>' || item  == '<')
                    return false;
                else
                    strs.push(item);
            }
        } else {
            if (!start){
                start = true;
                if (item == "'" || item == '"')
                    overText = item;
                else if (item == '>' || item == '<'){
                    return false;
                } else {
                    strs.push(item);
                }
            } else
                strs.push(item);
        }
    });
};

_trans(tmpl);
