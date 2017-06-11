import Platform from './platform';
import { Componet } from './componet';
import { Compile, CompileSubject } from './compile';
import { HtmlDef, HtmlTagDef, HtmlTagContentType, ICreateElementAttr } from './htmlDef';
import CmpxLib from './cmpxLib';

let _getParentElement = function(element:Node):Node{
        return element.parentElement || element.parentNode;
    },
    _defaultCreateElement = function(name: string, attrs: ICreateElementAttr[], parent?: HTMLElement, innerHtml?:string): HTMLElement {
        let element:HTMLElement = document.createElement(name);
        CmpxLib.each(attrs, function(item:ICreateElementAttr){
            HtmlDef.getHtmlAttrDef(item.name).setAttribute(element, item.name, item.value, item.subName);
        });
        return element;
    };

let _defaultTag = new HtmlTagDef({}),
    _rawTag = new HtmlTagDef({
        contentType: HtmlTagContentType.RAW_TEXT,
        createElement:_defaultCreateElement
     }),
    _escRawTag = new HtmlTagDef({
        contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT,
        createElement:_defaultCreateElement
    });

/**
 * htmlDef配置后
 */
let _htmlConfig = function(){

    //扩展tag, 如果不支持的tag请在这里扩展
    HtmlDef.extendHtmlTagDef({
        //默认不支持svg, 请处理createElement
        'svg': _defaultTag,
        'math': _defaultTag,
        'style': _rawTag,
        'script': _rawTag,
        'title': _escRawTag,
        'textarea': _escRawTag
    });

};

export class Browser extends Platform {

    constructor() {
        super();
        //htmlDef配置
        _htmlConfig();
        //编译器启动，用于htmlDef配置后
        Compile.startUp();
    }

    boot(componetDef: any): Browser {

        let name = componetDef.prototype.$name,
            bootElement:HTMLElement = document.getElementsByTagName(name)[0];
        if (!bootElement)
            throw new Error(`没有${name}标签`);

        let _doc = document, parentElement = _getParentElement(bootElement);
        let preElement:any = bootElement.previousSibling;
        if (!preElement){
            preElement = _doc.createComment(name);
            parentElement.insertBefore(preElement, bootElement);
        }
        parentElement.removeChild(bootElement);
        bootElement = preElement;

        ////DOMContentLoaded 时起动
        let _readyName = 'DOMContentLoaded', _ready = function () {
            _doc.removeEventListener(_readyName, _ready, false);
            window.removeEventListener('load', _ready, false);

            console.time('start');
            //注意tmplElement是Comment, 在IE里只能取到parentNode
            let parentElement = _getParentElement(bootElement),
                {newSubject, refComponet} = Compile.renderComponet(componetDef, bootElement);
            parentElement.removeChild(bootElement);
            console.timeEnd('start');
            //console.log(refComponet);

            let _unload = function(){
                window.removeEventListener('unload', _unload);
                newSubject.remove({
                    parentElement:parentElement as HTMLElement,
                    componet:refComponet
                });
            };
            window.addEventListener('unload', _unload, false);
        };

        if (/loaded|complete|undefined/i.test(_doc.readyState))
            _ready();
        else{
            _doc.addEventListener(_readyName, _ready, false);
            window.addEventListener("load", _ready, false);

        }

        return this;
    }

}