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

import CmpxLib from "./cmpxLib";

/**
 * HtmlTag内容类型
 */
export enum HtmlTagContentType {
  RAW_TEXT,
  ESCAPABLE_RAW_TEXT,
  PARSABLE_DATA
}

/**
 * HtmlTag配置
 */
export interface IHtmlTagDefConfig {
  [key: string]: HtmlTagDef
}

/**
 * 默认element创建器
 * @param name 
 * @param parent 
 */
export function DEFAULT_CREATEELEMENT(name: string, parent: HTMLElement = null): HTMLElement {
  return document.createElement(name);
}

//注释标签
let _noteTagRegex = /\<\!--(?:.|\n|\r)*?--\>/gim;

/**
 * HtmlTag定义类
 */
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
  static extendHtmlTagDef(p: IHtmlTagDefConfig): void {
    CmpxLib.extend(_htmlTagDefConfig, p);
    _makeSpecTags();
  }

  /**
   * 获取属性定义
   * @param name 
   */
  static getHtmlAttrDef(name: string): IHtmlAttrDef {
    return _htmlAttrDefConfig[name] || DEFAULT_ATTR;
  }

  /**
   * 扩展属性定义
   * @param p 
   */
  static extendHtmlAttrDef(p: IHtmlAttrDef): void {
    CmpxLib.extend(_htmlAttrDefConfig, p);
  }

  /**
   * 单行标签
   */
  static singelTags: { [name: string]: boolean };
  /**
   * 内容标签，不解释内容
   */
  static rawTags: { [name: string]: boolean };
  /**
   * 内容html编码标签，不解释内容
   */
  static escapeRawTags: { [name: string]: boolean };

  /**
   * 处理tag内容，删除多余空格，删除注释，编码某些类型内容
   * @param html 
   */
  static handleTagContent(html: string): string {
     return _removeSpace(html.replace(_noteTagRegex, ''))
                .replace(_rawContentRegex, function (find: string, name: string, content: string) {
                  return ['<', name, '>', CmpxLib.encodeHtml(content), '</', name, '>'].join('');
                });
  }

  /**
   * 前缀
   */
  preFix: string;
  /**
   * 内容类型
   */
  contentType: HtmlTagContentType;
  /**
   * 内容忽略第一个Lf
   */
  ignoreFirstLf: boolean;
  /**
   * 单行标签
   */
  single: boolean;
  /**
   * element创建器
   */
  createElement: (name: string, parent?: HTMLElement) => HTMLElement;

  constructor(
    { single = false, contentType = HtmlTagContentType.PARSABLE_DATA, preFix = null, ignoreFirstLf = false, createElement = null }: {
      single?: boolean;
      contentType?: HtmlTagContentType;
      preFix?: string;
      ignoreFirstLf?: boolean;
      createElement?: (name: string, parent: HTMLElement) => HTMLElement;
    } = {}) {
    this.single = single;
    this.preFix = preFix;
    this.contentType = contentType;
    this.ignoreFirstLf = ignoreFirstLf;
    this.createElement = createElement || DEFAULT_CREATEELEMENT
  }

}

const _SINGLE_TAG = new HtmlTagDef({ single: true }),
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
  'svg': new HtmlTagDef({ preFix: 'svg' }),
  'math': new HtmlTagDef({ preFix: 'math' }),
  'li': _DEFULE_TAG,
  'dt': _DEFULE_TAG,
  'dd': _DEFULE_TAG,
  'rb': _DEFULE_TAG,
  'rt': _DEFULE_TAG,
  'rtc': _DEFULE_TAG,
  'rp': _DEFULE_TAG,
  'optgroup': _DEFULE_TAG,
  'option': _DEFULE_TAG,
  'pre': new HtmlTagDef({ ignoreFirstLf: true }),
  'listing': new HtmlTagDef({ ignoreFirstLf: true }),
  'style': new HtmlTagDef({ contentType: HtmlTagContentType.RAW_TEXT }),
  'script': new HtmlTagDef({ contentType: HtmlTagContentType.RAW_TEXT }),
  'title': new HtmlTagDef({ contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT }),
  'textarea':
  new HtmlTagDef({ contentType: HtmlTagContentType.ESCAPABLE_RAW_TEXT, ignoreFirstLf: true }),
};

let _rawContentRegex: RegExp,
  _escContentRegex: RegExp,
  _removeCmdRegex:RegExp = /\{\{((?:.|\n|\r)*?)\}\}/gmi;

//删除多余空格
function _removeSpace(html: string): string {
  html = html.replace(_removeCmdRegex, function (find:string, content: string) {
    return  ['{{', encodeURIComponent(content),'}}'].join('');
  }).replace(_escContentRegex, function (find: string, name: string, content: string, cmdContent:string) {
    return  ['<', name, '>', encodeURIComponent(content), '</', name, '>'].join('');
  })
  .replace(/(?:\n|\r)+/gmi, ' ').replace(/\s{2,}/gmi, ' ')
  .replace(_escContentRegex, function (find: string, name: string, content: string, cmdContent:string) {
    return  ['<', name, '>', decodeURIComponent(content), '</', name, '>'].join('');
  }).replace(_removeCmdRegex, function (find:string, content: string) {
    return  ['{{', decodeURIComponent(content),'}}'].join('');
  });

  return html;
}

function _makeSpecTags() {
  let singleTags = [],
    rawTags = [],
    escapeRawTags = [];
  CmpxLib.eachProp(_htmlTagDefConfig, (item: HtmlTagDef, name: string) => {
    item.single && singleTags.push(name);
    item.contentType == HtmlTagContentType.RAW_TEXT && rawTags.push(name);
    item.contentType == HtmlTagContentType.ESCAPABLE_RAW_TEXT && escapeRawTags.push(name);
  });
  let o = HtmlTagDef.singelTags = {};
  CmpxLib.each(singleTags, (name: string) => o[name] = true);
  o = HtmlTagDef.rawTags = {};
  CmpxLib.each(rawTags, (name: string) => o[name] = true);
  o = HtmlTagDef.escapeRawTags = {};
  CmpxLib.each(escapeRawTags, (name: string) => o[name] = true);

  let rawNames = rawTags.concat(escapeRawTags).join('|');
  _rawContentRegex = new RegExp('<\\s*(' + rawNames + ')\\s*>((?:.|\\n|\\r)*?)</\\1>', 'gmi');
  rawNames = [rawNames, 'pre'].join('|');
  _escContentRegex = new RegExp('<\\s*(' + rawNames + ')\\s*>((?:.|\\n|\\r)*?)</\\1>', 'gmi');
}

_makeSpecTags();

/**
 * HtmlAttr定义
 */
export interface IHtmlAttrDef {
  setAttribute: (element: HTMLElement, name: string, value: string) => void;
  getAttribute: (element: HTMLElement, name: string) => string;
}

/**
 * 默认HtmlAttr定义
 */
export const DEFAULT_ATTR: IHtmlAttrDef = {
  setAttribute(element: HTMLElement, name: string, value: string) {
    element.setAttribute(name, value);
  },
  getAttribute(element: HTMLElement, name: string) {
    return element.getAttribute(name);
  }
};

/**
 * 默认HtmlAttr prop定义
 */
export const DEFAULT_ATTR_PROP: IHtmlAttrDef = {
  setAttribute(element: HTMLElement, name: string, value: string) {
    element[name] = value;
  },
  getAttribute(element: HTMLElement, name: string) {
    return element[name];
  }
};

/**
 * HtmlAttr配置
 */
export interface IHtmlAttrDefConfig {
  [name: string]: IHtmlAttrDef;
}

var _htmlAttrDefConfig: IHtmlAttrDefConfig = {
  'value': DEFAULT_ATTR_PROP,
  'src': DEFAULT_ATTR_PROP,
  'type': DEFAULT_ATTR_PROP,
  'selected': DEFAULT_ATTR_PROP,
  'disabled': DEFAULT_ATTR_PROP,
  'checked': DEFAULT_ATTR_PROP
};
