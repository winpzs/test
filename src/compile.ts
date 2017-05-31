import Cmpx from "./cmpx";
import { HtmlTagDef } from './htmlTagDef';

export interface htmlTagItem {
    tagName:string;
    //是否标签，如：<div>
    target:boolean;
    //是否指令，如：{{for}}
    cmd:boolean;
    find:string;
    content:string;
    attrs:Array<htmlAttrItem>;
    end:boolean;
    single:boolean;
    index:number;
    //是否为绑定
    bind?:boolean;
    children?:Array<htmlTagItem>;
    parent?:htmlTagItem;
}

export interface htmlAttrItem {
    name:string;
    value:string;
    bind:boolean;
    extend?:any;
}

var _tagRegex = /\<\s*(\/*)\s*([^<>\s]+)\s*([^<>]*)(\/*)\s*\>|\{\{\s*(\/*)\s*([^\s\{\}]+)\s*(.*?)(\/*)\}\}/gim,
    _newTextContent = function(tmpl:string, start:number, end:number):htmlTagItem{
        var text = tmpl.substring(start, end),
            bind = _textBackRegex.test(text);
        return {
            tagName:'',
            target:false,
            cmd:false,
            find:text,
            content:bind ? _getBind(text, '"') : text,
            attrs:null,
            end:true,
            single:true,
            index:start,
            bind:bind
        };
    },
    _textRegex = /\{\{((?!\/|\s*(?:if|else|for|tmpl|include)[ \}])(?:.|\r|\n)+?)\}\}/gm,
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
    _makeTags = function(tmpl:string):Array<htmlTagItem>{
        var lastIndex = 0, list:Array<htmlTagItem> = [],
            singelTagMap = HtmlTagDef.singelTagMap;
        tmpl = _makeTextTag(tmpl);
        //console.log(_backTextTag(tmpl));
        tmpl.replace(_tagRegex, function(find:string, end1:string, tagName:string,
          tagContent:string, end2:string, txtEnd1:string, txtName:string, txtContent:string, txtEnd2:string, index:number){

            if (index > lastIndex){
                list.push(_newTextContent(tmpl, lastIndex, index));
            }

            var single = !!end2 || !!txtEnd2 || (tagName && singelTagMap[tagName]),
                end = !!end1 || !!txtEnd1 || single,
                cmd = !!txtName;

            if (cmd || !(single && !!end1)){

                var attrs = !cmd && !!tagContent ? _getAttrs(tagContent) : null;
                if (cmd && (single || !end) && txtName == 'for'){
                    attrs = _getForAttrs(txtContent);
                }

                var item:htmlTagItem = {
                    tagName:tagName || txtName,
                    target:!cmd,
                    cmd:cmd,
                    find:find,
                    content:tagContent || txtContent,
                    attrs:attrs,
                    end:end,
                    single:single,
                    index:index
                };
                list.push(item);
            }

            lastIndex = index+find.length;

            return find;
        });
        var index = tmpl.length;
        if (index > lastIndex){
            list.push(_newTextContent(tmpl, lastIndex, index));
        }
        // Cmpx.each(list, function(item:htmlTagItem, index:number){
        //     console.log(JSON.stringify(item));
        //     console.log('  -----------------');
        // });
        //console.log(list.length);
        var outList:Array<htmlTagItem> = [];
        _makeHtmlTagChildren(list, outList, list.length);
        return outList;
    },
    _attrRegex = /\s*([^= ]+)\s*=\s*(["'])((?:.|\b|\r)*?)\2/gm,
    _getAttrs = function(content:string):Array<htmlAttrItem>{
        var attrs:Array<htmlAttrItem> = [];
        content.replace(_attrRegex, function(find:string, name:string, split:string,
            value:string, index:number){
            var bind = _textBackRegex.test(value);
            if(bind)
                value = _getBind(value, split);
            attrs.push({
                name:name,
                value:value,
                bind:bind
            });
            return find;
        });
        //console.log(attrs);
        return attrs;
    },
    _forAttrRegex = /\s*([^\s]+)\s*\in\s*([^\s]+)\s*(?:\s*tmpl\s*=\s*([\'\"])(.*?)\3)*/i,
    _getForAttrs = function(content:string):Array<htmlAttrItem>{
        var extend = _forAttrRegex.exec(content);
        var attrs:Array<htmlAttrItem> = [{
            name:'',
            value:'',
            bind:true,
            extend:{
                item:extend[1],
                datas:extend[2],
                tmpl:extend[4]
            }
        }];
        return attrs;
    },
    _getBind = function(value:string, split:string){
        return value.replace(_textBackRegex, function(find:string, content:string, index:number){
            return [split, decodeURIComponent(content), split].join('+');
        });
    },
    _makeHtmlTagChildren = function(attrs:Array<htmlTagItem>, outList:Array<htmlTagItem>,
        len:number, index:number=0, parent:htmlTagItem=null): number{
        var item:htmlTagItem;
        while(index < len){
            item = attrs[index++];
            if (item.cmd || item.target){
                if　(item.single)
                    outList.push(item);
                else if (item.end){
                    break;
                } else {
                    outList.push(item);
                    item.children = [];
                    index = _makeHtmlTagChildren(attrs, item.children, len, index, item);
                    if (item && item.cmd && item.tagName == 'else')
                        break;
                }
            } else {
                outList.push(item);
            }
        }
        return index;
    };

var _registerComponet:{[selector:string]:Function} = {};

export function Config(config: {
    selector:string;
    tmpl?:string;
    tmplUrl?:string;
}) {
    return function (constructor: Function) {
        _registerComponet[config.selector] = constructor;
        constructor.prototype['__config__'] = config;
    };
}

export class CompileElement{
    name:string;
    parent:CompileElement;
    attrs:Array<htmlAttrItem>;
    children:Array<CompileElement>;
    element:HTMLElement;
    textNode:Text;
    constructor(name:string, attrs:Array<htmlAttrItem>=null, parent:CompileElement=null){
        this.name = name;
        this.attrs = attrs;
        this.parent = parent;
        this.element = document.createElement('aaaaa');
        this.textNode = document.createTextNode('aaaaa');
    }
}

export class Compile {
    public static createElement(name:string, attrs:Array<htmlAttrItem>=null, parent:CompileElement=null):CompileElement{
        let  element = new CompileElement(name, attrs, parent);
        return element;
    }


    private tmpl:string;
    private _htmlTags:Array<htmlTagItem>;
    public getHtmlTagObjects():Array<htmlTagItem>{
        return this._htmlTags;
    };

    constructor(tmpl:string){
        this.tmpl = tmpl;
        this._htmlTags = _makeTags(tmpl);
    }
}