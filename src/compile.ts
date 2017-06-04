import CmpxLib from './cmpxLib';
import { HtmlTagDef, IHtmlAttrDef } from './htmlTagDef';
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
    _tagInfoRegex = /\<\s*(\/*)\s*([^<>\s]+)\s*([^<>]*?)(\/*)\s*\>|\{\{\s*(\/*)\s*([^\s\{\}]+)\s*(.*?)(\/*)\}\}/gim,
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
                    componet:cmd?false:!!_registerVM[tagName]
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
    _attrInfoRegex = /\s*([^= ]+)\s*=\s*(["'])((?:.|\b|\r)*?)\2|\s*([^= /]+)\s*/gm,
    _getAttrInfos = function (content: string): Array<attrInfo> {
        var attrs: Array<attrInfo> = [];
        content.replace(_attrInfoRegex, function (find: string, name: string, split: string,
            value: string, name1:string, index: number) {
            var bind = _cmdDecodeAttrRegex.test(value);
            if (bind)
                value = _getBind(value, split);
            attrs.push({
                name: name || name1,
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

var _registerVM: { [selector: string]: Function } = {},
    _vmName = '__vm__';

/**
 * 注入组件配置信息
 * @param config 
 */
export function VM(vm: {
    name: string;
    tmpl?: string;
    tmplUrl?: string;
}) {
    return function (constructor: Function) {
        _registerVM[vm.name] = constructor;
        constructor.prototype[_vmName] = vm;
    };
}

export interface ICompileBind {
    componet:Componet;
    isRead?:boolean;
    isWrite?:boolean;
    getContext:()=>any;
    setContext?:(value:any)=>void;
    update:()=>void;
}

export class AttrBind implements ICompileBind {
    private attrDef:IHtmlAttrDef;
    constructor(
        readonly componet:Componet,
        readonly element:HTMLElement,
        readonly name:string,
        readonly isRead:boolean,
        readonly isWrite:boolean,
        readonly getContext:()=>any,
        readonly setContext:(value:any)=>void){
            this.attrDef = HtmlTagDef.getHtmlAttrDef(name);
         }

    private value:string;
    update(){
        let isRead = false;
        if (this.isRead){
            let value = this.getContext();
            if (value != this.value){
                this.value = value;
                this.setAttribute(value);
                isRead = true;
            }
        }
        if (!isRead && this.isWrite){
            let attrValue = this.getAttribute();
            if (attrValue != this.value){
                this.value = attrValue;
                this.setContext(attrValue);
            }
        }
    }

    setAttribute(value: string):void {
        this.attrDef.setAttribute(this.element, this.name, value);
    }

    getAttribute():string {
        return this.attrDef.getAttribute(this.element, this.name);
    }
}

export class TextBind implements ICompileBind {
    constructor(
        readonly componet:Componet,
        readonly text:Text,
        readonly getContext:()=>any){}

    private value:string;
    update(){
        let value = this.getContext();
        if (this.value != value){
            this.value = value;
            this.text.textContent = value;
        }
    }

}

export class CmdBind implements ICompileBind {
    constructor(
        readonly componet:Componet,
        readonly text:Text,
        readonly getContext:()=>any,
        readonly done:()=>void){}

    private value:string;
    update(){
        let value = this.getContext();
        if (this.value != value){
            this.value = value;
            this.done();
        }
    }

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
        CmpxLib.each(attrs, (attr:attrInfo)=>{
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


interface ISubscribeParam{
    init?:(p:any)=>void;
    update?:(p:any)=>void;
    remove?:(p:any)=>void;
}

export class CompileSubject {
    private datas:Array<ISubscribeParam> = [];

    constructor(subject?:CompileSubject){
        if (subject){
            if (!(this.isRemove = subject.isRemove)){
                this.linkParam = subject.subscribe({
                    init:(p:any)=> this.init(p),
                    update:(p:any)=> this.init(p),
                    remove:(p:any)=> this.init(p)
                });
                this.subject = subject;
            }
            this.isInit = subject.isInit;
            this.lastInitP = subject.lastInitP;
        }
    }

    subscribe(p:ISubscribeParam):ISubscribeParam {
        if (!this.isRemove){
            this.datas.push(p);
            if (this.isInit)
                p.init && (p.init(this.lastInitP), p.init = null);
        }
        return p;
    }

    unSubscribe(p:ISubscribeParam):void {
        let index = this.datas.indexOf(p);
        if (index >= 0)
            this.datas.splice(index, 1);
    }

    private linkParam:ISubscribeParam;
    private subject:CompileSubject;
    unLinkSubject():CompileSubject{
        this.subject && this.subject.unSubscribe(this.linkParam);
        return this;
    }

    isInit:boolean = false;
    lastInitP:any;
    init(p:any){
        this.isInit = true;
        this.lastInitP = p;
        CmpxLib.each(this.datas, function(item:any){
            item.init && (item.init(p), item.init = null);
        });
    }

    update(p:any){
        CmpxLib.each(this.datas, function(item:any){
            item.update && item.update(p);
        });
    }

    isRemove:boolean = false;
    remove(p:any){
        this.isRemove = true;
        this.datas = [];
        CmpxLib.each(this.datas, function(item:any){
            item.remove && (item.remove(p), item.remove= null);
        });
    }
}


let _tmplName = '__tmpl__',
    _getComponetTmpl = function(componet:Componet, id:string):any{
        let tmpls = componet[_tmplName];
        if (!tmpls || !tmpls[id])
            return componet.parent ?_getComponetTmpl(componet.parent, id) : null;
        else
            return tmpls[id];
    }

export class Compile {
    public static createElement(name:string, componet:Componet, element:HTMLElement, subject:CompileSubject,
        contextFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>void):void {

        let ele:HTMLElement = HtmlTagDef.getHtmlTagDef(name).createElement(name, element);
        element && element.appendChild(ele);
        subject.subscribe({
            remove:(p:any)=> element.removeChild(ele)
        });
        contextFn && contextFn(componet, ele, subject);
        //return ele;
    }

    public static createComponet(name:string, componet:Componet, element:HTMLElement, subject:CompileSubject,
        contextFn:(component:Componet, element:HTMLElement,subject:CompileSubject)=>void):void {

        let cmp:any = _registerVM[name];
        let cmpObj:Componet = new cmp();
        let newSubject:CompileSubject = new CompileSubject(subject);
        newSubject.subscribe({
            remove:(p:any)=> {
                try{
                    cmpObj.dispose();
                } catch(e){
                    CmpxLib.trace(e);
                } finally {
                    newSubject.unLinkSubject();
                }
            }
        });
        contextFn && contextFn(cmpObj, element, newSubject);
        //return cmpObj;
    }

    public static createTextNode(content:string, componet:Componet, element:HTMLElement, subject:CompileSubject):Text{
        let textNode = document.createTextNode(content);
        element && element.appendChild(textNode);
        // subject.subscribe({
        //     remove:(p:any)=> element.removeChild(textNode)
        // });
        return textNode;
    }
    
    public static setAttribute(element:HTMLElement, name:string, value:string):void {
        HtmlTagDef.getHtmlAttrDef(name).setAttribute(element, name, value);
    }


    public static forRender(dataFn, eachFn, componet:Componet, element:HTMLElement, subject:CompileSubject):void {
        var datas = dataFn.call(componet, componet, element, subject);
        CmpxLib.each(datas, function(item, index){
            let newSubject:CompileSubject = new CompileSubject(subject);
            newSubject.subscribe({
                remove:(p:any)=> {
                    newSubject.unLinkSubject();
                }
            });
            eachFn.call(componet, item, index, componet, element, newSubject);
        });
    }

    public static ifRender(ifFun, trueFn, falseFn, componet:Componet, element:HTMLElement, subject:CompileSubject):void {

        let newSubject:CompileSubject = new CompileSubject(subject);
        newSubject.subscribe({
            remove:(p:any)=> {
                newSubject.unLinkSubject();
            }
        });

        if (ifFun.call(componet, componet, element, subject))
            trueFn.call(componet, componet, element, newSubject);
        else
            falseFn.call(componet, componet, element, newSubject);
    }

    public static tmplRender(id, componet:Componet, element:HTMLElement, subject:CompileSubject,
        contextFn:(componet:Componet, element:HTMLElement)=>void):void {

        var tmpls = componet[_tmplName];
        tmpls || (tmpls = componet[_tmplName] = {});

        tmpls[id] = function(componet:Componet, element:HTMLElement, subject:CompileSubject){
            contextFn && contextFn.call(componet, componet,  element, subject)
        };
    }

    public static includeRender(id:string, componet:Componet, element:HTMLElement, subject:CompileSubject):void{
        var tmpl = _getComponetTmpl(componet, id);
        if (tmpl){
            let newSubject:CompileSubject = new CompileSubject(subject);
            newSubject.subscribe({
                remove:(p:any)=> {
                    newSubject.unLinkSubject();
                }
            });
            tmpl.call(componet, componet,  element, newSubject);
        }
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