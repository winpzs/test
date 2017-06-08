import CmpxLib from './cmpxLib';
import { HtmlTagDef, IHtmlAttrDef } from './htmlTagDef';
import { Componet } from './componet';


var _undef:any;

interface IBindInfo{
    type:string;
    content:string;
}

/**
 * 标签信息
 */
export interface ITagInfo {
    tagName: string;
    //是否标签，如：<div>
    target: boolean;
    //是否指令，如：{{for}}
    cmd: boolean;
    find: string;
    content: string;
    attrs: Array<IAttrInfo>;
    end: boolean;
    single: boolean;
    index: number;
    //是否为绑定
    bind?: boolean;
    bindInfo?:IBindInfo;
    children?: Array<ITagInfo>;
    parent?: ITagInfo;
    componet?:boolean;
}


/**
 * 属性信息
 */
export interface IAttrInfo {
    name: string;
    value: string;
    bind: boolean;
    bindInfo?:IBindInfo;
    extend?: any;
}

    //新建一个text节点
var _newTextContent = function (tmpl: string, start: number, end: number): ITagInfo {
        var text = tmpl.substring(start, end),
            bind = _cmdDecodeAttrRegex.test(text),
            bindInfo:IBindInfo = bind ? _getBind(text, '"') : null;
        return {
            tagName: '',
            target: false,
            cmd: false,
            find: text,
            content: bind ? "" : text,
            attrs: null,
            end: true,
            single: true,
            index: start,
            bind: bind,
            bindInfo:bindInfo
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
    _makeTagInfos = function (tmpl: string): Array<ITagInfo> {
        var lastIndex = 0, list: Array<ITagInfo> = [],
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
                if (cmd) {
                    if ((single || !end)){
                        switch(txtName){
                            case 'for':
                                attrs = _getForAttrInfos(txtContent);
                                break;
                            case 'tmpl':
                            case 'include':
                                attrs = _getAttrInfos(txtContent);
                                break;
                        }
                    }
                } else {
                    attrs = !!tagContent ? _getAttrInfos(tagContent) : null;
                }

                var item: ITagInfo = {
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
        var outList: Array<ITagInfo> = [];
        _makeTagInfoChildren(list, outList, list.length);
        return outList;
    },
    //获取attrInfo
    _attrInfoRegex = /\s*([^= ]+)\s*=\s*(["'])((?:.|\b|\r)*?)\2|\s*([^= /]+)\s*/gm,
    _getAttrInfos = function (content: string): Array<IAttrInfo> {
        var attrs: Array<IAttrInfo> = [];
        content.replace(_attrInfoRegex, function (find: string, name: string, split: string,
            value: string, name1:string, index: number) {
            var bind = _cmdDecodeAttrRegex.test(value),
                bindInfo = bind ? _getBind(value, split) : null;
            attrs.push({
                name: (name || name1).toLowerCase(),
                value: value,
                bind: bind,
                bindInfo:bindInfo
            });
            return find;
        });
        //console.log(attrs);
        return attrs;
    },
    //获取cmd form attrInfo
    //_forAttrRegex = /\s*([^\s]+)\s*\in\s*([^\s]+)\s*(?:\s*tmpl\s*=\s*([\'\"])(.*?)\3)*/i,
    _forAttrRegex = /\s*([^\s]+)\s*\in\s*([^\s]+)\s*/i,
    _getForAttrInfos = function (content: string): Array<IAttrInfo> {
        var extend = _forAttrRegex.exec(content);
        var attrs: Array<IAttrInfo> = [{
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
    _bindTypeRegex = /^\s*([\<\>\:\@\&\!])\s*(.*)/,
    //获取内容绑定信息，如 name="aaa{{this.name}}"
    _getBind = function (value: string, split: string) :IBindInfo {
        let write:string, event:string,
            onceList = [], read:boolean = false, isOnce:boolean = false;
        let type:string = '', txt:string, reg:any, content:string = [split, value.replace(_cmdDecodeAttrRegex, function (find: string, content: string, index: number) {
            content = decodeURIComponent(content);
            reg = _bindTypeRegex.exec(content);
            if (reg){
                type = reg[1];
                txt = reg[2];
            } else{
                type = '';
                txt = content;
            }
            var readTxt = '';
            switch(type){
                case ':'://一次只读
                    onceList.push(txt);
                    isOnce = true;
                    readTxt = [split, 'once'+(onceList.length-1), split].join('+');
                    break;
                case '@'://事件
                    event = txt;
                    break;
                case '>'://只写
                    write = txt;
                    break;
                case '&'://读写
                    write = txt;
                case '<'://只读
                default:
                    read = true;
                    readTxt = [split, txt, split].join('+');
                    break;
            }
            return readTxt;
        }), split].join('');

        var once:string;
        if (write || read || isOnce || onceList.length>0){
            if (isOnce){
                let oList = [];
                CmpxLib.each(onceList, function(item:string, index:number){
                    oList.push(['once',index,' = (' , item , ')'].join(''));
                });
                once = 'var ' + oList.join(',') + ';';
            }
            write && (write = 'function(val){ '+write+' = val; }');
            event = null;
        } else if (event){
            event = 'function(event){ return '+event+'; }';
        }

        content = `(function(){
  ${once?once:''}
  return {
    once:${once?(read? 'false' : 'true') : 'false'},
    read:${read || isOnce ? 'function(){ return '+content+'; }' : 'null'},
    write:${write ? write : 'null'},
    event:${event ? event : 'null'}
  };
}).call(componet)`;

        return { type:type, content:content };
    },
    _makeTagInfoChildren = function (attrs: Array<ITagInfo>, outList: Array<ITagInfo>,
        len: number, index: number = 0, parent: ITagInfo = null): number {
        var item: ITagInfo;
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


export interface IVMConfig{
    name: string;
    tmpl?: string;
    tmplUrl?: string;
    styles?:string[];
    styleUrl?:string;
}

var _registerVM: { [selector: string]: {complie:Compile, componetDef:Function} } = {},
    _vmName = '__vm__',
    _getVmConfig = function(componetDef:any):IVMConfig{
        return componetDef.prototype[_vmName];
    },
    _getVmByComponetDef = function(componetDef:any):{complie:Compile, componetDef:Function}{
        var config = _getVmConfig(componetDef);
        return _registerVM[config.name];
    };

/**
 * 注入组件配置信息
 * @param config 
 */
export function VM(vm: IVMConfig) {
    return function (constructor: Function) {
        _registerVM[vm.name] = {
            complie:new Compile(vm.tmpl, constructor),
            componetDef:constructor
        };
        constructor.prototype.$name = vm.name;
        constructor.prototype[_vmName] = vm;
    };
}

interface ISubscribeEvent{
    componet:Componet;
    parentElement:HTMLElement;
    param?:any;
}

interface ISubscribeRemoveEvent extends ISubscribeEvent{
    element?:HTMLElement;
}

export interface ISubscribeParam{
    //视图初始化
    init?:(p:ISubscribeEvent)=>void;
    //更新视图
    update?:(p:ISubscribeEvent)=>void;
    //节点插入dom之后
    insertDoc?:(p:ISubscribeEvent)=>void;
    //视图准备好
    ready?:(p:ISubscribeEvent)=>void;
    //节点或视图删除
    remove?:(p:ISubscribeRemoveEvent)=>void;
    isRemove?:boolean;
}

export class CompileSubject {
    private datas:Array<ISubscribeParam> = [];

    constructor(subject?:CompileSubject){
        if (subject){
            if (!(this.isRemove = subject.isRemove)){
                this.linkParam = subject.subscribe({
                    init:(p:ISubscribeEvent)=> this.init(p),
                    update:(p:ISubscribeEvent)=> this.update(p),
                    insertDoc:(p:ISubscribeEvent)=> this.insertDoc(p),
                    ready:(p:ISubscribeEvent)=> this.ready(p),
                    remove:(p:ISubscribeRemoveEvent)=> this.remove(p)
                });
                this.subject = subject;
                this.isInit = subject.isInit;
                this.lastInitP = subject.lastInitP;
            }
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
    init(p:ISubscribeEvent){
        if (this.isRemove) return;
        this.isInit = true;
        this.lastInitP = p;
        CmpxLib.each(this.datas, function(item:ISubscribeParam){
            if(item.init){
                item.init(p);
                item.init = null;
            }
        });
    }

    update(p:ISubscribeEvent){
        if (this.isRemove) return;
        CmpxLib.each(this.datas, function(item:ISubscribeParam){
            if (item.update){
                item.update && item.update(p);
            }
        });
    }

    insertDoc(p:ISubscribeEvent){
        if (this.isRemove) return;
        CmpxLib.each(this.datas, function(item:ISubscribeParam){
            if (item.insertDoc){
                item.insertDoc(p);
                item.insertDoc = null;
            }
        });
    }

    ready(p:ISubscribeEvent){
        if (this.isRemove) return;
        CmpxLib.each(this.datas, function(item:ISubscribeParam){
            if (item.ready){
                item.ready(p);
                item.ready = null;
            }
        });
    }

    isRemove:boolean = false;
    remove(p:ISubscribeRemoveEvent){
        if (this.isRemove) return;
        this.isRemove = true;
        var datas = this.datas;
        this.datas = [];
        CmpxLib.each(datas, function(item:ISubscribeParam){
            if (item.remove){
                item.remove(p);
                item.remove= null;
            }
        });
    }
}


let _tmplName = '__tmpl__',
    _getComponetTmpl = function(componet:Componet, id:string):any{
        let tmpls = componet[_tmplName];
        if (!tmpls || !tmpls[id])
            return componet.$parent ?_getComponetTmpl(componet.$parent, id) : null;
        else
            return tmpls[id];
    },
    _insertAfter = function(newElement:Node, refElement:Node, parent:Node){
        var nextSibling = refElement.nextSibling;
        if (nextSibling){
            parent.insertBefore(newElement, nextSibling);
        } else
            parent.appendChild(newElement);
    },
    _getRefElement = function(content:string, parentElement:HTMLElement, insertTemp:boolean):{tmplElement:Node, isInsertTemp:boolean}{
        var tmplElement:Node;
        if (insertTemp){
            tmplElement = document.createComment(content);
            parentElement.appendChild(tmplElement);
        } else {
            tmplElement = parentElement.lastChild;
            if (!tmplElement){
                insertTemp = true;
                tmplElement = document.createComment(content);
                parentElement.appendChild(tmplElement);
            }
        }
        //注意tmplElement是Comment, 在IE里只能取到parentNode
       return {tmplElement:tmplElement, isInsertTemp:insertTemp};
    },
    _equalArrayIn = function(array1:Array<any>, array2:Array<any>){
        var ok = true;
        CmpxLib.each(array1, function(item, index){
            if (item != array2[index]){
                ok = false; return false;
            }
        });
        return ok;
    },
    _equalArray = function(array1:Array<any>, array2:Array<any>):boolean{
        if ((!array1 || !array2)) return array1 == array2;

        return array1.length == array2.length && _equalArrayIn(array1, array2);
    },
    _getParentElement = function(element:Node):any{
        return element.parentElement || element.parentNode;
    };

export class Compile {

    public static createComponet(
            name:string, componet:Componet, parentElement:HTMLElement, subject:CompileSubject,
            contextFn:(component:Componet, element:HTMLElement,subject:CompileSubject)=>void
        ):void {
            if (subject.isRemove)return;

            let cmp:any = _registerVM[name];

            let vm = _registerVM[name];
            let {newSubject, refComponet} = vm.complie.render(parentElement, componet);

            //let newSubject:CompileSubject = newComponet.$subObject;

            contextFn && contextFn(refComponet, parentElement, newSubject);
    }

    public static createElement(name:string, tag:string, componet:Componet, parentElement:HTMLElement, subject:CompileSubject,
        contextFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>void):void {
            
            if (subject.isRemove)return;

            let element:HTMLElement = HtmlTagDef.getHtmlTagDef(name).createElement(name, tag, parentElement);
            parentElement.appendChild(element);
            //if(parentElement == componet.$parentElement) componet.$elements.push(element);
            subject.subscribe({
                remove:function(p:ISubscribeRemoveEvent) {
                    //如果父节点删除，这里就不用处理了。
                    if (p.parentElement == parentElement){
                        _getParentElement(element).removeChild(element);
                        if (componet && !componet.$isDisposed){
                            var els = componet.$elements,
                                idx = els.indexOf(element);
                            (idx >=  0) && els.splice(idx, 1);
                        }
                    }
                },
                insertDoc:function(p:ISubscribeEvent){
                   (_getParentElement(element) == componet.$parentElement) && componet.$elements.push(element);
                }
            });
            contextFn && contextFn(componet, element, subject);
    }

    public static createTextNode(content:any, componet:Componet, parentElement:HTMLElement, subject:CompileSubject):Text{
        if (subject.isRemove)return;

        let isObj = !CmpxLib.isString(content),
            value:string = '',
            once:boolean = isObj ? content.once : false,
            readFn = isObj ?　content.read : null,
            textNode = document.createTextNode(isObj ? (once ? readFn.call(componet) : value) : content);
        parentElement.appendChild(textNode);
        //if(parentElement == componet.$parentElement) componet.$elements.push(textNode);
        subject.subscribe({
            remove:function(p:ISubscribeRemoveEvent) {
                //如果父节点删除，这里就不用处理了。
                if (p.parentElement == parentElement){
                    _getParentElement(textNode).removeChild(textNode);
                    if (componet && !componet.$isDisposed){
                        var els = componet.$elements,
                            idx = els.indexOf(textNode);
                        (idx >=  0) && els.splice(idx, 1);
                    }
                }
            },
            update:function(p:ISubscribeEvent){
                if (!once && readFn){
                    var newValue = readFn.call(componet);
                    if (value != newValue){
                        value = newValue;
                        textNode.textContent = newValue;
                    }
                }
            },
            insertDoc:function(p:ISubscribeEvent){
               (_getParentElement(textNode) == componet.$parentElement) && componet.$elements.push(textNode);
            }
        });
        return textNode;
    }
    
    public static setAttribute(element:HTMLElement, name:string, content:any, componet:Componet, subject:CompileSubject):void {
        let isObj = !CmpxLib.isString(content);
        if (isObj){
            let isEvent = !!content.event,
                update;
            if (isEvent){
                let isBind = false,
                    eventDef = HtmlTagDef.getHtmlEventDef(name),
                    eventFn:any = function(e){ return content.event.call(componet, event); };
                subject.subscribe({
                    update: function (p: ISubscribeEvent) {
                        if (isBind) return;
                        isBind = true;
                        eventDef.addEventListener(element, name, eventFn, false);
                    },
                    remove:function(p:ISubscribeRemoveEvent){
                        if (isBind) {
                            eventDef.removeEventListener(element, name, eventFn, false);
                        }
                    }
                });

            } else {
                let value: any = '', newValue:any,
                    isWrite:boolean = !!content.write,
                    isRead:boolean = !!content.read,
                    attrDef: IHtmlAttrDef = HtmlTagDef.getHtmlAttrDef(name),
                    writeFn = function (p: ISubscribeEvent) {
                        newValue = attrDef.getAttribute(element, name);
                        if (value != newValue) {
                            value = newValue;
                            content.write.call(componet, newValue);
                        }
                    };
                attrDef.setAttribute(element, name, value);
                subject.subscribe({
                    update: function (p: ISubscribeEvent) {
                        if (isRead){
                            newValue = content.read.call(componet);
                            if (value != newValue) {
                                value = newValue;
                                attrDef.setAttribute(element, name, newValue);
                            } else if (isWrite){
                                writeFn(p);
                            }
                        } else if (isWrite){
                            writeFn(p);
                        }
                    }
                });
            }
        } else
            HtmlTagDef.getHtmlAttrDef(name).setAttribute(element, name, content);
    }

    public static forRender(
            dataFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            eachFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            componet:Componet, parentElement:HTMLElement, insertTemp:boolean, subject:CompileSubject
        ):void {
            
            if (subject.isRemove || !dataFn || !eachFn)return;

            var { tmplElement, isInsertTemp } = _getRefElement('for', parentElement, insertTemp);

            var value:any, newSubject:CompileSubject;
            var fragment:any, removeFn = function(){
                if (newSubject){
                    newSubject.remove({
                        componet:componet,
                        parentElement:fragment,
                        element:null
                    });
                }
            };
            subject.subscribe({
                update:function(p:ISubscribeEvent){
                    let datas = dataFn.call(componet, componet, parentElement, subject);
                    if (!_equalArray(datas , value)){
                        value = datas;
                        removeFn();
                        newSubject = new CompileSubject(subject);
                        newSubject.subscribe({
                            remove:function(p:ISubscribeRemoveEvent) {
                                newSubject.unLinkSubject();
                            }
                        });
                        fragment = document.createDocumentFragment();
                        CmpxLib.each(datas, function(item, index){
                            eachFn.call(componet, item, index, componet, fragment, newSubject);
                        });
                        newSubject.update({
                            componet:componet,
                            parentElement:parentElement
                        });
                        _insertAfter(fragment, tmplElement, parentElement);
                        newSubject.insertDoc({
                            componet:componet,
                            parentElement:parentElement
                        });
                    }
                },
                remove:function(p:ISubscribeRemoveEvent){
                    if (isInsertTemp && p.parentElement == parentElement){
                        parentElement.removeChild(tmplElement);
                    }
                    //removeFn();
                    newSubject = fragment = null;
                }
            });
    }

    public static ifRender(
            ifFun:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            trueFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            falseFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            componet:Componet, parentElement:HTMLElement, insertTemp:boolean, subject:CompileSubject
        ):void {

            if (subject.isRemove)return;

            var { tmplElement, isInsertTemp } = _getRefElement('if', parentElement, insertTemp);

            var value, newSubject:CompileSubject;
            var fragment, removeFn = function(){
                if (newSubject){
                    newSubject.remove({
                        componet:componet,
                        parentElement:fragment,
                        element:null
                    });
                }
            };
            subject.subscribe({
                update:function(p:ISubscribeEvent){
                    let newValue = !!ifFun.call(componet, componet, parentElement, subject);

                    if (newValue != value){
                        value = newValue;

                        removeFn();

                        newSubject = new CompileSubject(subject);
                        newSubject.subscribe({
                            remove:function(p:ISubscribeRemoveEvent) {
                                newSubject.unLinkSubject();
                            }
                        });

                        fragment = document.createDocumentFragment();
                        if (newValue)
                            trueFn.call(componet, componet, fragment, newSubject);
                        else
                            falseFn.call(componet, componet, fragment, newSubject);
                        newSubject.update({
                            componet:componet,
                            parentElement:parentElement
                        });
                        _insertAfter(fragment, tmplElement, parentElement);
                        newSubject.insertDoc({
                            componet:componet,
                            parentElement:parentElement
                        });
                    }
                },
                remove:function(p:ISubscribeRemoveEvent){
                    //removeFn();
                    if (isInsertTemp && p.parentElement == parentElement){
                        parentElement.removeChild(tmplElement);
                    }
                    newSubject = fragment = null;
                }
            });

    }

    public static tmplRender(id, componet:Componet, parentElement:HTMLElement, subject:CompileSubject,
        contextFn:(componet:Componet, element:HTMLElement, subject:CompileSubject, param:any)=>void):void {

        if (subject.isRemove)return;

        var tmpls = componet[_tmplName];
        tmpls || (tmpls = componet[_tmplName] = {});

        tmpls[id] = function(componet:Componet, element:HTMLElement, subject:CompileSubject, param:any){
            contextFn && contextFn.call(componet, componet,  element, subject, param);
        };
    }

    public static includeRender(id:string, componet:Componet, parentElement:HTMLElement, insertTemp:boolean, subject:CompileSubject, param:any):void{
        if (subject.isRemove)return;

        var tmpl = _getComponetTmpl(componet, id);
        tmpl && tmpl.call(componet, componet,  parentElement, subject, param || {});
    }

    private contextFn:Function;
    private componetDef:any;

    //调试临时用
    tagInfos:ITagInfo[];
    tempFn:Function;
    //end 调试临时用

    constructor(tmpl: string, componetDef?:Componet|Function) {
        this.componetDef = componetDef;
        let tagInfos = this.tagInfos = _makeTagInfos(CmpxLib.trim(tmpl, true));
        var fn = this.tempFn = _buildCompileFn(tagInfos);
        // console.log(fn.toString());

        this.contextFn = fn;
    }

    static renderComponet(componetDef:any,refElement:HTMLElement, parentComponet?:Componet):{newSubject:CompileSubject, refComponet: Componet}{
        var compile = _getVmByComponetDef(componetDef).complie;
        return compile.render(refElement, parentComponet);
    }

    render(refElement:HTMLElement, parentComponet?:Componet):{newSubject:CompileSubject, refComponet: Componet}{
        var componetDef:any = this.componetDef;

        let componet:any,
            isNewComponet:boolean = false,
            parentElement:HTMLElement = _getParentElement(refElement),
            newSubject:CompileSubject = new CompileSubject(parentComponet?parentComponet.$subObject:null);

        if (componetDef){
            isNewComponet = true;
            componet = new componetDef();
            componet.$name = name;
            componet.$subObject = newSubject;
            componet.$parentElement = parentElement;

            parentComponet && parentComponet.$children.push(componet);

        } else {
            //如果没有componetDef，为临时tmpl
            //传入的parentComponet为当前的componet
            componet = parentComponet;
        }

        //如果临时tmpl没有parentComponet报错
        if (!componet){
            throw new Error('render缺少Componet参数');
        }


        newSubject.subscribe({
            remove:function(p:ISubscribeRemoveEvent) {
                try{
                    isNewComponet && componet.onDispose();
                } catch(e){
                    CmpxLib.trace(e);
                } finally {
                    newSubject.unLinkSubject();

                    if (isNewComponet){
                        if (parentComponet && !parentComponet.$isDisposed){
                            var childs = parentComponet.$children,
                                idx = childs.indexOf(componet);
                            (idx >=  0) && childs.splice(idx, 1);
                        }

                        componet.$subObject = componet.$children = componet.$elements =
                            componet.$parent = componet.$parentElement = null;
                    }
                }
            },
            update:function(p:ISubscribeEvent){
                isNewComponet && componet.onUpdate(function(){}, p.param);
            },
            ready:function(p:ISubscribeEvent){
                isNewComponet && componet.onReady(function(){}, p.param);
            }
        });

        let initFn = ()=>{
            newSubject.init({
                componet: componet,
                parentElement: parentElement
            });
            let fragment = document.createDocumentFragment();
            this.contextFn.call(componet, CmpxLib, Compile, componet, fragment, newSubject);
            newSubject.update({
                componet:componet,
                parentElement:parentElement
            });
            _insertAfter(fragment, refElement, parentElement);
            newSubject.insertDoc({
                componet:componet,
                parentElement:parentElement
            });
            newSubject.ready({
                componet:componet,
                parentElement:parentElement
            });
        };
        if (isNewComponet){
            componet.onInit(function(err){
                initFn();
            }, null);
        }
        else
            initFn();
        return {newSubject:newSubject, refComponet:componet};
    }
}

var _buildCompileFn = function(tagInfos:Array<ITagInfo>):Function{
        var outList = [], tmplOutList = [];

        tmplOutList.push(`var __tmplRender = Compile.tmplRender,
    __createComponet = Compile.createComponet,
    __createElement = Compile.createElement,
    __setAttribute = Compile.setAttribute,
    __createTextNode = Compile.createTextNode,
    __forRender = Compile.forRender,
    __ifRender = Compile.ifRender,
    __includeRender = Compile.includeRender;`);

        _buildCompileFnContent(tagInfos, outList, tmplOutList, true);
        //console.log(outList.join('\n'));

        outList = tmplOutList.concat(outList);

        return new Function('CmpxLib','Compile', 'componet', 'element', 'subject', outList.join('\n'));
    },
    _escapeStringRegex = /([\"\\])/gm,
    _escapeBuildString = function(s:string):string{
        return s ? s.replace(/([\"\\])/gm, '\\$1').replace(/\n/gm, '\\n').replace(/\r/gm, '\\r') : '';
    },
    _makeElementTag = function(tagName, attrs:Array<IAttrInfo>):{bindAttrs:Array<IAttrInfo>, tagStr:string}{
        var bindAttrs = [], sAttrs = [];
        CmpxLib.each(attrs, function(item:IAttrInfo){
            if (item.bind)
                bindAttrs.push(item);
            else
                sAttrs.push([item.name, '="', _escapeBuildString(item.value), '"'].join(''));
        });
        return {bindAttrs:bindAttrs, tagStr:['<', tagName, sAttrs.length==0 ? '' : ' ', sAttrs.join(' '), '>'].join('')};
    },
    _buildAttrContent = function(attrs:Array<IAttrInfo>, outList:Array<string>){
        if (!attrs)return;
        CmpxLib.each(attrs, function(attr:IAttrInfo, index:number){
            if (attr.bind)
                outList.push('__setAttribute(element, "' + attr.name + '", '+attr.bindInfo.content+', componet, subject);');
            else
                outList.push('__setAttribute(element, "' + attr.name + '", "'+_escapeBuildString(attr.value)+'", componet, subject);');
        });
    },
    _getInsertTemp = function(preInsert:boolean){
        return preInsert ? 'true' : 'false';
    },
    _buildCompileFnContent = function(tagInfos:Array<ITagInfo>, outList:Array<string>, tmplOutList:string[],  preInsert:boolean){
        if (!tagInfos) return;
        CmpxLib.each(tagInfos, function(tag:ITagInfo, index:number){
            let tagName = tag.tagName;
            if (!tag.cmd){
                if (tag.target){
                    if (_registerVM[tagName]){
                        if (tag.children && tag.children.length > 0){
                           outList.push('__createComponet("'+tagName+'", componet, element, subject, function (componet, element, subject) {');
                           //_buildAttrContent(tag.attrs, outList);
                           _buildCompileFnContent(tag.children, outList, tmplOutList, preInsert);
                           outList.push('});');
                        } else {
                            outList.push('__createComponet("'+tagName+'", componet, element, subject);');
                        }
                        preInsert=true;
                    } else {
                        if ((tag.attrs && tag.attrs.length > 0) || (tag.children && tag.children.length > 0)){
                            if (HtmlTagDef.isCreateElementByName){
                                outList.push('__createElement("'+tagName+'", "<'+tagName+'>", componet, element, subject, function (componet, element, subject) {');
                                _buildAttrContent(tag.attrs, outList);
                                _buildCompileFnContent(tag.children, outList, tmplOutList, preInsert);
                            } else {
                                let {bindAttrs, tagStr} = _makeElementTag(tagName, tag.attrs);
                                outList.push('__createElement("'+tagName+'", \''+tagStr+'\', componet, element, subject, function (componet, element, subject) {');
                                _buildAttrContent(bindAttrs, outList);
                                _buildCompileFnContent(tag.children, outList, tmplOutList, preInsert);
                            }
                           outList.push('});');
                        } else {
                            outList.push('__createElement("'+tagName+'", "<'+tagName+'>", componet, element, subject);');
                        }
                        preInsert = false;
                    }
                } else {
                    if (tag.bind){
                        outList.push('__createTextNode('+tag.bindInfo.content+', componet, element, subject);');
                    } else
                        outList.push('__createTextNode("'+ _escapeBuildString(tag.content)+'", componet, element, subject);');
                    preInsert = false;
                }
            } else{
                switch(tagName){
                    case 'for':
                        var extend = tag.attrs[0].extend,
                            itemName = extend.item
                        outList.push('__forRender(function (componet, element, subject) {');
                        outList.push('return ' + extend.datas);
                        outList.push('}, function ('+itemName+', $index, componet, element, subject) {');
                        var forTmpl = extend.tmpl;
                        if(forTmpl)
                            outList.push('__includeRender("'+ _escapeBuildString(forTmpl) + '", componet, element, '+_getInsertTemp(preInsert)+', subject, '+itemName+');');
                        else
                            _buildCompileFnContent(tag.children, outList, tmplOutList, preInsert);
                        outList.push('}, componet, element, '+_getInsertTemp(preInsert)+', subject);');
                        preInsert = true;
                        break;
                    case 'if':
                        var children = tag.children,
                            hasElse = children ? children[children.length-1].tagName == 'else' : false,
                            elseTag = hasElse ? children.pop() : null;
                        outList.push('__ifRender(function (componet, element, subject) {');
                        outList.push('return ' + tag.content);
                        outList.push('}, function (componet, element, subject) {');
                        _buildCompileFnContent(tag.children, outList, tmplOutList, preInsert);
                        outList.push('}, function (componet, element, subject) {');
                        elseTag && _buildCompileFnContent(elseTag.children, outList, tmplOutList, preInsert);
                        outList.push('}, componet, element, '+_getInsertTemp(preInsert)+', subject);');
                        preInsert = true;
                        break;
                    case 'include':
                        var incAttr = CmpxLib.arrayToObject<IAttrInfo>(tag.attrs, 'name'),
                            incTmpl = incAttr['tmpl'],
                            incParam = incAttr['param'] ? incAttr['param'].value : 'null';
                        outList.push('__includeRender("'+ (incTmpl ? _escapeBuildString(incTmpl.value):'')+'", componet, element, '+_getInsertTemp(preInsert)+', subject, '+incParam+');');
                        preInsert = true;
                        break;
                    case 'tmpl':
                        var tmplAttr = CmpxLib.arrayToObject<IAttrInfo>(tag.attrs, 'name'),
                            tmplId = tmplAttr['id'],
                            tmplLet = tmplAttr['let'];
                        tmplOutList.push('__tmplRender("'+ (tmplId ? _escapeBuildString(tmplId.value):'')+'", componet, element, subject, function (componet, element, subject, param) {');
                        tmplLet && tmplOutList.push('var ' + tmplLet.value + ';');
                        _buildCompileFnContent(tag.children, tmplOutList, tmplOutList, preInsert);
                        tmplOutList.push('});');
                        break;
                }
            }
        });
    };