import CmpxLib from './cmpxLib';
import { HtmlTagDef, IHtmlAttrDef } from './htmlTagDef';
import { Componet } from './componet';


var _undef:any;
/**
 * 标签信息
 */
export interface TagInfo {
    tagName: string;
    //是否标签，如：<div>
    target: boolean;
    //是否指令，如：{{for}}
    cmd: boolean;
    find: string;
    content: string;
    attrs: Array<AttrInfo>;
    end: boolean;
    single: boolean;
    index: number;
    //是否为绑定
    bind?: boolean;
    children?: Array<TagInfo>;
    parent?: TagInfo;
    componet?:boolean;
}

/**
 * 属性信息
 */
export interface AttrInfo {
    name: string;
    value: string;
    bind: boolean;
    extend?: any;
}

    //新建一个text节点
var _newTextContent = function (tmpl: string, start: number, end: number): TagInfo {
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
    _makeTagInfos = function (tmpl: string): Array<TagInfo> {
        var lastIndex = 0, list: Array<TagInfo> = [],
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

                var item: TagInfo = {
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
        var outList: Array<TagInfo> = [];
        _makeTagInfoChildren(list, outList, list.length);
        return outList;
    },
    //获取attrInfo
    _attrInfoRegex = /\s*([^= ]+)\s*=\s*(["'])((?:.|\b|\r)*?)\2|\s*([^= /]+)\s*/gm,
    _getAttrInfos = function (content: string): Array<AttrInfo> {
        var attrs: Array<AttrInfo> = [];
        content.replace(_attrInfoRegex, function (find: string, name: string, split: string,
            value: string, name1:string, index: number) {
            var bind = _cmdDecodeAttrRegex.test(value);
            if (bind)
                value = _getBind(value, split);
            attrs.push({
                name: (name || name1).toLowerCase(),
                value: value,
                bind: bind
            });
            return find;
        });
        //console.log(attrs);
        return attrs;
    },
    //获取cmd form attrInfo
    //_forAttrRegex = /\s*([^\s]+)\s*\in\s*([^\s]+)\s*(?:\s*tmpl\s*=\s*([\'\"])(.*?)\3)*/i,
    _forAttrRegex = /\s*([^\s]+)\s*\in\s*([^\s]+)\s*/i,
    _getForAttrInfos = function (content: string): Array<AttrInfo> {
        var extend = _forAttrRegex.exec(content);
        var attrs: Array<AttrInfo> = [{
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
    _makeTagInfoChildren = function (attrs: Array<TagInfo>, outList: Array<TagInfo>,
        len: number, index: number = 0, parent: TagInfo = null): number {
        var item: TagInfo;
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

var _registerVM: { [selector: string]: {complie:Compile, componetDef:Function} } = {},
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
}

interface ISubscribeRemoveEvent extends ISubscribeEvent{
    parentElement:HTMLElement;
    element?:HTMLElement;
}

export interface ISubscribeParam{
    init?:(p:ISubscribeEvent)=>void;
    update?:(p:ISubscribeEvent)=>void;
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
                    update:(p:ISubscribeEvent)=> this.init(p),
                    remove:(p:ISubscribeRemoveEvent)=> this.init(p)
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
                let t = item.init(p);
                item.init = null;
            }
        });
    }

    update(p:ISubscribeEvent){
        if (this.isRemove) return;
        CmpxLib.each(this.datas, function(item:ISubscribeParam){
            if (item.update){
                let t = item.update && item.update(p);
            }
        });
    }

    isRemove:boolean = false;
    remove(p:ISubscribeRemoveEvent){
        if (this.isRemove) return;
        this.isRemove = true;
        this.datas = [];
        CmpxLib.each(this.datas, function(item:ISubscribeParam){
            if (item.remove){
                var t = item.remove(p);
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
       return {tmplElement:tmplElement, isInsertTemp:insertTemp};
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

    public static createElement(name:string, componet:Componet, parentElement:HTMLElement, subject:CompileSubject,
        contextFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>void):void {
            
            if (subject.isRemove)return;
            let element:HTMLElement = HtmlTagDef.getHtmlTagDef(name).createElement(name, null, parentElement);
            parentElement.appendChild(element);
            if(parentElement == componet.$parentElement) componet.$elements.push(element);
            subject.subscribe({
                remove:function(p:ISubscribeRemoveEvent) {
                    //如果父节点删除，这里就不用处理了。
                    if (p.parentElement == parentElement){
                        parentElement.removeChild(element);
                        if (!componet.$isDisposed){
                            var els = componet.$elements,
                                idx = els.indexOf(element);
                            (idx >=  0) && els.splice(idx, 1);
                        }
                    }
                }
            });
            contextFn && contextFn(componet, element, subject);
    }

    public static createTextNode(content:string, componet:Componet, parentElement:HTMLElement, subject:CompileSubject):Text{
        if (subject.isRemove)return;

        let textNode = document.createTextNode(content);
        parentElement.appendChild(textNode);
        if(parentElement == componet.$parentElement) componet.$elements.push(textNode);
        subject.subscribe({
            remove:function(p:ISubscribeRemoveEvent) {
                //如果父节点删除，这里就不用处理了。
                if (p.parentElement == parentElement){
                    parentElement.removeChild(textNode);
                    if (!componet.$isDisposed){
                        var els = componet.$elements,
                            idx = els.indexOf(textNode);
                        (idx >=  0) && els.splice(idx, 1);
                    }
                }
            }
        });
        return textNode;
    }
    
    public static setAttribute(element:HTMLElement, name:string, value:string):void {
        HtmlTagDef.getHtmlAttrDef(name).setAttribute(element, name, value);
    }

    public static forRender(
            dataFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            eachFn:(componet:Componet, element:HTMLElement, subject:CompileSubject)=>any,
            componet:Componet, parentElement:HTMLElement, insertTemp:boolean, subject:CompileSubject
        ):void {
            
            if (subject.isRemove || !dataFn || !eachFn)return;

            var { tmplElement, isInsertTemp } = _getRefElement('for', parentElement, insertTemp);

            var value:any, newSubject:CompileSubject;
            var removeFn = function(){
                if (newSubject){
                    newSubject.remove({
                        componet:componet,
                        parentElement:parentElement,
                        element:null
                    });
                }
            };
            subject.subscribe({
                update:function(p:ISubscribeEvent){
                    let datas = dataFn.call(componet, componet, parentElement, subject);
                    if (datas != value){
                        value = datas;
                        removeFn();
                        newSubject = new CompileSubject(subject);
                        newSubject.subscribe({
                            remove:function(p:ISubscribeRemoveEvent) {
                                newSubject.unLinkSubject();
                            }
                        });
                        var fragment = document.createDocumentFragment();
                        CmpxLib.each(datas, function(item, index){
                            eachFn.call(componet, item, index, componet, fragment, newSubject);
                        });
                        _insertAfter(fragment, tmplElement, parentElement);
                    }
                },
                remove:function(p:ISubscribeRemoveEvent){
                    if (isInsertTemp && p.parentElement == parentElement){
                        parentElement.removeChild(tmplElement);
                    }
                    //removeFn();
                    newSubject = null;
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
            var removeFn = function(){
                if (newSubject){
                    newSubject.remove({
                        componet:componet,
                        parentElement:parentElement,
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

                        var fragment = document.createDocumentFragment();
                        if (newValue)
                            trueFn.call(componet, componet, fragment, newSubject);
                        else
                            falseFn.call(componet, componet, fragment, newSubject);
                        _insertAfter(fragment, tmplElement, parentElement);
                    }
                },
                remove:function(p:ISubscribeRemoveEvent){
                    //removeFn();
                    if (isInsertTemp && p.parentElement == parentElement){
                        parentElement.removeChild(tmplElement);
                    }
                    newSubject = null;
                }
            });

    }

    public static tmplRender(id, componet:Componet, parentElement:HTMLElement, subject:CompileSubject, param:any,
        contextFn:(componet:Componet, element:HTMLElement, subject:CompileSubject, param:any)=>void):void {

        if (subject.isRemove)return;

        var tmpls = componet[_tmplName];
        tmpls || (tmpls = componet[_tmplName] = {});

        tmpls[id] = function(componet:Componet, element:HTMLElement, subject:CompileSubject){
            contextFn && contextFn.call(componet, componet,  element, subject)
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
    tagInfos:TagInfo[];
    tempFn:Function;
    //end 调试临时用

    constructor(tmpl: string, componetDef?:Componet|Function) {
        this.componetDef = componetDef;
        let tagInfos = this.tagInfos = _makeTagInfos(CmpxLib.trim(tmpl, true));
        var fn = this.tempFn = _buildCompileFn(tagInfos);

        this.contextFn = fn;
    }

    static renderComponet(componetDef:any,refElement:HTMLElement, parentComponet?:Componet):{newSubject:CompileSubject, refComponet: Componet}{
        var compile = componetDef.prototype[_vmName].compile as Compile;
        return compile.render(refElement, parentComponet);
    }

    render(refElement:HTMLElement, parentComponet?:Componet):{newSubject:CompileSubject, refComponet: Componet}{
        var componetDef:any = this.componetDef;

        let componet:any,
            isNewComponet:boolean = false,
            parentElement:HTMLElement = refElement.parentElement,
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
                    isNewComponet && componet.$dispose();
                } catch(e){
                    CmpxLib.trace(e);
                } finally {
                    newSubject.unLinkSubject();

                    if (isNewComponet){
                        if (!parentComponet.$isDisposed){
                            var childs = parentComponet.$children,
                                idx = childs.indexOf(componet);
                            (idx >=  0) && childs.splice(idx, 1);
                        }

                        componet.$subObject = componet.$children = componet.$elements =
                            componet.$parent = componet.$parentElement = null;
                    }
                }
            }
        });

        let fragment = document.createDocumentFragment();
        this.contextFn.call(componet, CmpxLib, Compile, componet, fragment, newSubject);
        _insertAfter(fragment, refElement, parentElement);
        return {newSubject:newSubject, refComponet:componet};
    }
}

var _buildCompileFn = function(tagInfos:Array<TagInfo>):Function{
        var outList = [];
        _buildCompileFnContent(tagInfos, outList, true);
        //console.log(outList.join('\n'));

        return new Function('CmpxLib','Compile', 'componet', 'element', 'subject', outList.join('\n'));
    },
    _escapeStringRegex = /([\"\\])/gm,
    _escapeBuildString = function(s:string):string{
        return s ? s.replace(/([\"\\])/gm, '\\$1').replace(/\n/gm, '\\n').replace(/\r/gm, '\\r') : '';
    },
    _buildAttrContent = function(attrs:Array<AttrInfo>, outList:Array<string>){
        if (!attrs)return;
        CmpxLib.each(attrs, function(attr:AttrInfo, index:number){
            outList.push('Compile.setAttribute(element, "' + attr.name + '", "'+_escapeBuildString(attr.value)+'");');
        });
    },
    _getInsertTemp = function(preInsert:boolean){
        return preInsert ? 'true' : 'false';
    },
    _buildCompileFnContent = function(tagInfos:Array<TagInfo>, outList:Array<string>, preInsert:boolean){
        if (!tagInfos) return;
        CmpxLib.each(tagInfos, function(tag:TagInfo, index:number){
            let tagName = tag.tagName;
            if (!tag.cmd){
                if (tag.target){
                    if (_registerVM[tagName]){
                        if (tag.children && tag.children.length > 0){
                           outList.push('Compile.createComponet("'+tagName+'", componet, element, subject, function (componet, element, subject) {');
                           //_buildAttrContent(tag.attrs, outList);
                           _buildCompileFnContent(tag.children, outList, preInsert);
                           outList.push('});');
                        } else {
                            outList.push('Compile.createComponet("'+tagName+'", componet, element, subject);');
                        }
                        preInsert=true;
                    } else {
                        if ((tag.attrs && tag.attrs.length > 0) || (tag.children && tag.children.length > 0)){
                           outList.push('Compile.createElement("'+tagName+'", componet, element, subject, function (componet, element, subject) {');
                           _buildAttrContent(tag.attrs, outList);
                           _buildCompileFnContent(tag.children, outList, preInsert);
                           outList.push('});');
                        } else {
                            outList.push('Compile.createElement("'+tagName+'", componet, element, subject);');
                        }
                        preInsert = false;
                    }
                } else {
                    outList.push('Compile.createTextNode("'+ _escapeBuildString(tag.content)+'", componet, element, subject);');
                    preInsert = false;
                }
            } else{
                switch(tagName){
                    case 'for':
                        var extend = tag.attrs[0].extend,
                            itemName = extend.item
                        outList.push('Compile.forRender(function (componet, element, subject) {');
                        outList.push('return ' + extend.datas);
                        outList.push('}, function ('+itemName+', $index, componet, element, subject) {');
                        var forTmpl = extend.tmpl;
                        if(forTmpl)
                            outList.push('Compile.includeRender("'+ _escapeBuildString(forTmpl) + '", componet, element, '+_getInsertTemp(preInsert)+', subject, '+itemName+');');
                        else
                            _buildCompileFnContent(tag.children, outList, preInsert);
                        outList.push('}, componet, element, subject, '+_getInsertTemp(preInsert)+');');
                        preInsert = true;
                        break;
                    case 'if':
                        var children = tag.children,
                            hasElse = children ? children[children.length-1].tagName == 'else' : false,
                            elseTag = hasElse ? children.pop() : null;
                        outList.push('Compile.ifRender(function (componet, element, subject) {');
                        outList.push('return ' + tag.content);
                        outList.push('}, function (componet, element, subject) {');
                        _buildCompileFnContent(tag.children, outList, preInsert);
                        outList.push('}, function (componet, element, subject) {');
                        elseTag && _buildCompileFnContent(elseTag.children, outList, preInsert);
                        outList.push('}, componet, element, subject, '+_getInsertTemp(preInsert)+');');
                        preInsert = true;
                        break;
                    case 'include':
                        var incAttr = CmpxLib.arrayToObject<AttrInfo>(tag.attrs, 'name'),
                            incTmpl = incAttr['tmpl'],
                            incParam = incAttr['param'] ? incAttr['param'].value : 'null';
                        outList.push('Compile.includeRender("'+ (incTmpl ? _escapeBuildString(incTmpl.value):'')+'", componet, element, '+_getInsertTemp(preInsert)+', subject, '+incParam+');');
                        preInsert = true;
                        break;
                    case 'tmpl':
                        var tmplAttr = CmpxLib.arrayToObject<AttrInfo>(tag.attrs, 'name'),
                            tmplId = tmplAttr['id'],
                            tmplLet = tmplAttr['let'];
                        outList.push('Compile.tmplRender("'+ (tmplId ? _escapeBuildString(tmplId.value):'')+'", componet, element, subject, function (componet, element, subject, param) {');
                        tmplLet && outList.push('var ' + tmplLet.value + ';');
                        _buildCompileFnContent(tag.children, outList, preInsert);
                        outList.push('});');
                        break;
                }
            }
        });
    };