import Cmpx from '../Cmpx';

interface htmlTagItem {
    tagName:string,
    target:boolean,
    find:string,
    content:string,
    end:boolean,
    index:number
}

var tmpl = `before<div><span {{aaa+aa
    a》&<>}}
 id="spanId" name="spanName">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}} {{/if}}</div>`;

var _tagRegex = /\<\s*(\/*)\s*([^<>\s]+)\s*([^<>]*)(\/*)\s*\>|\{\{\s*(\/*)\s*([^\s\{\}]+)\s*(.*?)\}\}/gim,
    _newTextContent = function(tmpl:string, start:number, end:number):htmlTagItem{
        var text = tmpl.substring(start, end);
        return {
            tagName:'',
            target:false,
            find:text,
            content:text,
            end:true,
            index:start
        };
    },
    _textRegex = /\{\{((?!\/|\s*if |\s*else |\s*for )(?:.|\r|\n)+?)\}\}/gm,
    _makeTextTag = function(tmpl:string):string{
        //
        return tmpl.replace(_textRegex, function(find, content){
            return ['$($', encodeURIComponent(content), '$)$'].join('');
        });
    },
    _textBackRegex = /\$\(\$(.+?)\$\)\$/gm,
    _backTextTag = function(tmpl:string):string{
        //
        return tmpl.replace(_textBackRegex, function(find, content){
            return ['{{', decodeURIComponent(content), '}}'].join('');
        });
    },
    _makeTags = function(tmpl:string){
        var lastIndex = 0, list = [];
        tmpl = _makeTextTag(tmpl);
        //console.log(_backTextTag(tmpl));
        tmpl.replace(_tagRegex, function(find:string, end1:string, tagName:string,
          tagContent:string, end2:string, txtEnd:string, txtName:string, txtContent:string, index:number){

            if (index > lastIndex){
                list.push(_newTextContent(tmpl, lastIndex, index));
            }

            var end = !!end1 || !!end2 || !!txtEnd;

            var item:htmlTagItem = {
                tagName:tagName || txtName,
                target:true,
                find:find,
                content:tagContent || txtContent,
                end:end,
                index:index
            };
            list.push(item);
            lastIndex = index+find.length;

            return find;
        });
        var index = tmpl.length-1;
        if (index > lastIndex){
            list.push(_newTextContent(tmpl, lastIndex, index));
        }
        Cmpx.each(list, function(item:htmlTagItem, index:number){
            console.log(JSON.stringify(item));
            console.log('  -----------------');
        });
        console.log(list.length);
    };
    _makeTags(tmpl);

//========Old=======================

interface tranParam {
    tmpl:string;
    length:number;
    index:number;
    strs:Array<string>;
    result:Array<string>;
    next:()=>void;
    isEnd:()=>boolean;
}

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

//_trans(tmpl);
