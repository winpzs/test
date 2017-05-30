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

import Cmpx from "cmpx";

export enum HtmlTagContentType {
  RAW_TEXT,
  ESCAPABLE_RAW_TEXT,
  PARSABLE_DATA
}

export interface IHtmlTagDefConfig{
  [key: string]: HtmlTagDef
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

  /**
   * 单选标签
   */
  static singelTags:Array<string>;
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
  single: boolean = false;

  constructor(
      {single, contentType = HtmlTagContentType.PARSABLE_DATA, preFix=null, ignoreFirstLf=false}: {
        single?:boolean;
        contentType?:HtmlTagContentType;
        preFix?:string;
        ignoreFirstLf?:boolean;
      } = {}) {
    this.single = single;
    this.preFix = preFix;
    this.contentType = contentType;
    this.ignoreFirstLf = ignoreFirstLf;
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
  'p': _SINGLE_TAG,
  'thead': _SINGLE_TAG,
  'tbody': _SINGLE_TAG,
  'tfoot': _SINGLE_TAG,
  'tr': _SINGLE_TAG,
  'td': _SINGLE_TAG,
  'th': _SINGLE_TAG,
  'col': _SINGLE_TAG,
  'svg': new HtmlTagDef({preFix: 'svg'}),
  'math': new HtmlTagDef({preFix: 'math'}),
  'li': _SINGLE_TAG,
  'dt': _SINGLE_TAG,
  'dd': _SINGLE_TAG,
  'rb': _SINGLE_TAG,
  'rt': _SINGLE_TAG,
  'rtc': _SINGLE_TAG,
  'rp': _SINGLE_TAG,
  'optgroup': _SINGLE_TAG,
  'option': _SINGLE_TAG,
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