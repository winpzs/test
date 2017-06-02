import Cmpx from './cmpx';
import { HtmlTagDef } from './htmlTagDef';
import { Componet } from './componet';

/**
 * 标签信息
 */
export interface tagInfo {
    tagName: string;
    //是否标签，如：<div>
    target: boolean;
    //是否指令，如：{{for}}
    cmd: boolean;
    find: string;
    content: string;
    attrs: Array<attrInfo>;
    end: boolean;
    single: boolean;
    index: number;
    //是否为绑定
    bind?: boolean;
    children?: Array<tagInfo>;
    parent?: tagInfo;
    componet?:boolean;
}

/**
 * 属性信息
 */
export interface attrInfo {
    name: string;
    value: string;
    bind: boolean;
    extend?: any;
}

    //新建一个text节点
var _newTextContent = function (tmpl: string, start: number, end: number): tagInfo {
        var text = tmpl.substring(start, end),
            bind = _cmdDecodeAttrRegex.test(text);
        return {
            tagName: '',
            target: false,
            cmd: false,
            find: text,
            content: bind ? _getBind(text, '"') : text,
            attrs: null,
            end: true,
            single: true,
            index: start,
            bind: bind
        };
    },
    //将{{this.name}}绑定标签转成$($this.name$)$
    _cmdEncodeAttrRegex = /\{\{((?!\/|\s*(?:if|else|for|tmpl|include)[ \}])(?:.|\r|\n)+?)\}\}/gm,
    _makeTextTag = function (tmpl: string): string {
        //
        return tmpl.replace(_cmdEncodeAttrRegex, function (find, content) {
            return ['$($', encodeURIComponent(content), '$)$'].join('');
        });
    },
    //把$($this.name$)$还原
    _cmdDecodeAttrRegex = /\$\(\$(.+?)\$\)\$/gm,
    _backTextTag = function (tmpl: string): string {
        //
        return tmpl.replace(_cmdDecodeAttrRegex, function (find, content) {
            return ['{{', decodeURIComponent(content), '}}'].join('');
        });
    },
    //查找分析tag和cmd
    _tagInfoRegex = /\<\s*(\/*)\s*([^<>\s]+)\s*([^<>]*)(\/*)\s*\>|\{\{\s*(\/*)\s*([^\s\{\}]+)\s*(.*?)(\/*)\}\}/gim,
    _makeTagInfos = function (tmpl: string): Array<tagInfo> {
        var lastIndex = 0, list: Array<tagInfo> = [],
            singelTags = HtmlTagDef.singelTags;
        tmpl = _makeTextTag(tmpl);
        tmpl = HtmlTagDef.handleTagContent(tmpl);
        //console.log(_backTextTag(tmpl));
        tmpl.replace(_tagInfoRegex, function (find: string, end1: string, tagName: string,
            tagContent: string, end2: string, txtEnd1: string, txtName: string, txtContent: string, txtEnd2: string, index: number) {

            if (index > lastIndex) {
                list.push(_newTextContent(tmpl, lastIndex, index));
            }

            var single = !!end2 || !!txtEnd2 || (tagName && singelTags[tagName]),
                end = !!end1 || !!txtEnd1 || single,
                cmd = !!txtName;

            if (cmd || !(single && !!end1)) {

                var attrs = !cmd && !!tagContent ? _getAttrInfos(tagContent) : null;
                if (cmd && (single || !end) && txtName == 'for') {
                    attrs = _getForAttrInfos(txtContent);
                }

                if (!cmd)

                var item: tagInfo = {
                    tagName: (tagName || txtName).toLowerCase(),
                    target: !cmd,
                    cmd: cmd,
                    find: find,
                    content: tagContent || txtContent,
                    attrs: attrs,
                    end: end,
                    single: single,
                    index: index,
                    componet:cmd?false:!!_registerComponet[tagName]
                };
                list.push(item);
            }

            lastIndex = index + find.length;

            return find;
        });
        var index = tmpl.length;
        if (index > lastIndex) {
            list.push(_newTextContent(tmpl, lastIndex, index));
        }
        var outList: Array<tagInfo> = [];
        _makeTagInfoChildren(list, outList, list.length);
        return outList;
    },
    //获取attrInfo
    _attrInfoRegex = /\s*([^= ]+)\s*=\s*(["'])((?:.|\b|\r)*?)\2/gm,
    _getAttrInfos = function (content: string): Array<attrInfo> {
        var attrs: Array<attrInfo> = [];
        content.replace(_attrInfoRegex, function (find: string, name: string, split: string,
            value: string, index: number) {
            var bind = _cmdDecodeAttrRegex.test(value);
            if (bind)
                value = _getBind(value, split);
            attrs.push({
                name: name,
                value: value,
                bind: bind
            });
            return find;
        });
        //console.log(attrs);
        return attrs;
    },
    //获取cmd form attrInfo
    _forAttrRegex = /\s*([^\s]+)\s*\in\s*([^\s]+)\s*(?:\s*tmpl\s*=\s*([\'\"])(.*?)\3)*/i,
    _getForAttrInfos = function (content: string): Array<attrInfo> {
        var extend = _forAttrRegex.exec(content);
        var attrs: Array<attrInfo> = [{
            name: '',
            value: '',
            bind: true,
            extend: {
                item: extend[1],
                datas: extend[2],
                tmpl: extend[4]
            }
        }];
        return attrs;
    },
    //获取内容绑定信息，如 name="aaa{{this.name}}"
    _getBind = function (value: string, split: string) {
        return value.replace(_cmdDecodeAttrRegex, function (find: string, content: string, index: number) {
            return [split, decodeURIComponent(content), split].join('+');
        });
    },
    _makeTagInfoChildren = function (attrs: Array<tagInfo>, outList: Array<tagInfo>,
        len: number, index: number = 0, parent: tagInfo = null): number {
        var item: tagInfo;
        while (index < len) {
            item = attrs[index++];
            if (item.cmd || item.target) {
                if 　(item.single)
                    outList.push(item);
                else if (item.end) {
                    break;
                } else {
                    outList.push(item);
                    item.children = [];
                    index = _makeTagInfoChildren(attrs, item.children, len, index, item);
                    if (item && item.cmd && item.tagName == 'else')
                        break;
                }
            } else {
                outList.push(item);
            }
        }
        return index;
    };

var _registerComponet: { [selector: string]: Function } = {};

/**
 * 注入组件配置信息
 * @param config 
 */
export function Config(config: {
    name: string;
    tmpl?: string;
    tmplUrl?: string;
}) {
    return function (constructor: Function) {
        _registerComponet[config.name] = constructor;
        constructor.prototype['__config__'] = config;
    };
}

export class CompileElement {
    name: string;
    parent: CompileElement | HTMLElement;
    attrs: Array<attrInfo>;
    children: Array<CompileElement>;
    element: HTMLElement;
    //textNode: Text;
    constructor(name: string, attrs: Array<attrInfo> = null,
        children:Array<CompileElement> = null, parent: CompileElement | HTMLElement = null) {
        this.name = name;
        this.attrs = attrs;
        this.parent = parent && (parent  instanceof CompileElement) ? parent : null;
        this.element = document.createElement(name);
        Cmpx.each(attrs, (attr:attrInfo)=>{
            this.setAttribute(attr.name, attr.value);
        });
        var elParent:HTMLElement = this.parent ? this.parent.element : parent as HTMLElement;
        elParent && this.element.appendChild(elParent);
        //this.textNode = document.createTextNode('aaaaa');
    }

    setAttribute(name: string, value: string):void {
        HtmlTagDef.getHtmlAttrDef(name).setAttribute(this.element, name, value);
    }

    getAttribute(name: string):string {
        return HtmlTagDef.getHtmlAttrDef(name).getAttribute(this.element, name);
    }
}

let _tmplName = '__tmpl__',
    _getComponetTmpl = function(componet:Componet, id:string):Array<any>{
        let tmpls = componet[_tmplName];
        if (!tmpls || !tmpls[id])
            return componet.parent ?_getComponetTmpl(componet.parent, id) : null;
        else
            return tmpls[id];
    }

export class Compile {
    public static createElement(name: string, attrs: Array<attrInfo> = null,
        children:Array<CompileElement> = null, parent: CompileElement | HTMLElement = null): CompileElement {

        let element = new CompileElement(name, attrs, children, parent);
        return element;
    }

    public static createComponet(name:string, attrs: Array<attrInfo> = null):Componet {
        let cmp:any = _registerComponet[name];
        return new cmp(attrs);
    }

    public static createTextNode(content:string):Text{
        return document.createTextNode(content);
    }

    public static forRender(dataFn, eachFn, componet:Componet):Array<any> {
        var datas = dataFn.call(componet);
        var list = [];
        Cmpx.each(datas, function(item, index){
            list = list.concat(eachFn.apply(this, arguments));
        }, componet);
        return list;
    }

    public static ifRender(ifFun, trueFn, falseFn, componet:Componet):Array<any> {
        if (ifFun.call(componet))
            return trueFn.call(componet);
        else
            return falseFn.call(componet);
    }

    public static tmplRender(id, elements:Array<any>, componet:Componet):void {
        var tmpls = componet[_tmplName]
        tmpls || (tmpls = componet[_tmplName] = {});
        tmpls[id] = elements
    }

    public static includeRender(id:string, componet:Componet):Object{
        return _getComponetTmpl(componet, id);
    }

    private tmpl: string;
    private _htmlTags: Array<tagInfo>;
    public getHtmlTagObjects(): Array<tagInfo> {
        return this._htmlTags;
    };

    constructor(tmpl: string) {
        this.tmpl = tmpl;
        this._htmlTags = _makeTagInfos(tmpl);
    }
}