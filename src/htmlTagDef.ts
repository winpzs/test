// <script type="text/javascript"><![CDATA[
//     function parseSVG(s) {
//         var div= document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
//         div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+s+'</svg>';
//         var frag= document.createDocumentFragment();
//         while (div.firstChild.firstChild)
//             frag.appendChild(div.firstChild.firstChild);
//         return frag;
//     }

//     document.getElementById('s').appendChild(parseSVG(
//         '<circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red" onmousedown="alert(\'hello\');"/>'
//     ));
// ]]></script>

// $(document).ready(function(){
//     var obj = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//     obj.setAttributeNS(null, "cx", 100);
//     obj.setAttributeNS(null, "cy", 50);
//     obj.setAttributeNS(null, "r",  40);
//     obj.setAttributeNS(null, "stroke", "black");
//     obj.setAttributeNS(null, "stroke-width", 2);
//     obj.setAttributeNS(null, "fill", "red");
//     $("svg")[0].appendChild(obj);
// });

import Cmpx from "./cmpx";

export enum HtmlTagContentType {
  RAW_TEXT,
  ESCAPABLE_RAW_TEXT,
  PARSABLE_DATA
}

export interface IHtmlTagDefConfig{
  [key: string]: HtmlTagDef
}

export function DEFAULT_CREATEELEMENT(name:string, parent:HTMLElement=null):HTMLElement{
  return document.createElement(name);
}

export class HtmlTagDef {

  /**
   * 获取标签定义
   * @param tagName 标签名称
   */
  static getHtmlTagDef(tagName: string): HtmlTagDef {
    return _htmlTagDefConfig[tagName.toLowerCase()] || _DEFULE_TAG;
  }

  /**
   * 扩展标签定义
   * @param p 标签配置
   */
  static extendHtmlTagDef(p:IHtmlTagDefConfig):void{
    Cmpx.extend(_htmlTagDefConfig, p);
    _makeSpecTags();
  }

  static getHtmlAttrDef(name:string):IHtmlAttrDef{
    return _htmlAttrDefConfig[name] || DEFAULT_ATTR;
  }

  static extendHtmlAttrDef(p:IHtmlAttrDef):void{
    Cmpx.extend(_htmlAttrDefConfig, p);
  }

  /**
   * 单行标签
   */
  static singelTags:Array<string>;
  /**
   * 单行标签Map
   */
  static singelTagMap:{[name:string]:boolean};
  /**
   * 内容标签，不解释内容
   */
  static rawTags:Array<string>;
  /**
   * 内容html编码标签，不解释内容
   */
  static escapeRawTags:Array<string>;

  preFix: string;
  contentType: HtmlTagContentType;
  ignoreFirstLf: boolean;
  single: boolean;

  createElement:(name:string, parent?:HTMLElement)=>HTMLElement;

  constructor(
      {single = false, contentType = HtmlTagContentType.PARSABLE_DATA, preFix=null, ignoreFirstLf=false, createElement=null}: {
        single?:boolean;
        contentType?:HtmlTagContentType;
        preFix?:string;
        ignoreFirstLf?:boolean;
        createElement?:(name:string, parent:HTMLElement)=>HTMLElement;
      } = {}) {
    this.single = single;
    this.preFix = preFix;
    this.contentType = contentType;
    this.ignoreFirstLf = ignoreFirstLf;
    this.createElement = createElement || DEFAULT_CREATEELEMENT
  }

}

const _SINGLE_TAG = new HtmlTagDef({single: true}),
      _DEFULE_TAG = new HtmlTagDef();

var _htmlTagDefConfig: IHtmlTagDefConfig = {
  'base': _SINGLE_TAG,
  'meta': _SINGLE_TAG,
  'area': _SINGLE_TAG,
  'embed': _SINGLE_TAG,
  'link': _SINGLE_TAG,
  'img': _SINGLE_TAG,
  'input': _SINGLE_TAG,
  'param': _SINGLE_TAG,
  'hr': _SINGLE_TAG,
  'br': _SINGLE_TAG,
  'source': _SINGLE_TAG,
  'track': _SINGLE_TAG,
  'wbr': _SINGLE_TAG,
  'p': _DEFULE_TAG,
  'thead': _DEFULE_TAG,
  'tbody': _DEFULE_TAG,
  'tfoot': _DEFULE_TAG,
  'tr': _DEFULE_TAG,
  'td': _DEFULE_TAG,
  'th': _DEFULE_TAG,
  'col': _SINGLE_TAG,
  'svg': new HtmlTagDef({preFix: 'svg'}),
  'math': new HtmlTagDef({preFix: 'math'}),
  'li': _DEFULE_TAG,
  'dt': _DEFULE_TAG,
  'dd': _DEFULE_TAG,
  'rb': _DEFULE_TAG,
  'rt': _DEFULE_TAG,
  'rtc': _DEFULE_TAG,
  'rp': _DEFULE_TAG,
  'optgroup': _DEFULE_TAG,
  'option': _DEFULE_TAG,
  'pre': new HtmlTagDef({ignoreFirstLf: true}),
  'listing': new HtmlTagDef({ignoreFirstLf: true}),
  'style': new HtmlTagDef({contentType: HtmlTagContentType.RAW_TEXT}),
  'script': new HtmlTagDef({contentType: HtmlTagContentType.RAW_TEXT}),
  'title': new HtmlTagDef({contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT}),
  'textarea':
      new HtmlTagDef({contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true}),
};

function _makeSpecTags(){
  var singleTags = [],
      rawTags = [],
      escapeRawTags = [];
  Cmpx.eachProp(_htmlTagDefConfig, (item:HtmlTagDef,  name:string)=>{
    item.single && singleTags.push(name);
    item.contentType == HtmlTagContentType.RAW_TEXT && rawTags.push(name);
    item.contentType == HtmlTagContentType.ESCAPABLE_RAW_TEXT && escapeRawTags.push(name);
  });
  var o = HtmlTagDef.singelTagMap = {};
  Cmpx.each(singleTags, (name:string)=>o[name]=true);
  HtmlTagDef.singelTags = singleTags;
  HtmlTagDef.rawTags = rawTags;
  HtmlTagDef.escapeRawTags = escapeRawTags;
}

_makeSpecTags();


export interface IHtmlAttrDef {
  setAttribute:(element:HTMLElement, name:string, value:string)=>void;
  getAttribute:(element:HTMLElement, name:string)=>string;
}

export const DEFAULT_ATTR:IHtmlAttrDef = {
  setAttribute(element:HTMLElement, name:string, value:string){
    element.setAttribute(name, value);
  },
  getAttribute(element:HTMLElement, name:string){
    return element.getAttribute(name);
  }
};

export const DEFAULT_ATTR_PROP:IHtmlAttrDef = {
  setAttribute(element:HTMLElement, name:string, value:string){
    element[name] = value;
  },
  getAttribute(element:HTMLElement, name:string){
    return element[name];
  }
};

export interface IHtmlAttrDefConfig {
  [name:string]:IHtmlAttrDef;
}

var _htmlAttrDefConfig: IHtmlAttrDefConfig = {
  'value':DEFAULT_ATTR_PROP,
  'selected':DEFAULT_ATTR_PROP,
  'disabled':DEFAULT_ATTR_PROP,
  'checked':DEFAULT_ATTR_PROP
};
