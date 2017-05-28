import Cmpx from '../Cmpx';

import { expect } from 'chai';
import 'mocha';

interface htmlTagItem {
    tagName:string;
    //是否标签，如：<div>
    target:boolean;
    //是否指令，如：{{for}}
    cmd:boolean;
    find:string;
    content:string;
    attrs:Array<htmlAttrItem>;
    end:boolean;
    index:number;
    //是否为绑定
    bind?:boolean;
}

interface htmlAttrItem {
    name:string;
    value:string;
    bind:boolean;
}

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;

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
        var lastIndex = 0, list:Array<htmlTagItem> = [];
        tmpl = _makeTextTag(tmpl);
        //console.log(_backTextTag(tmpl));
        tmpl.replace(_tagRegex, function(find:string, end1:string, tagName:string,
          tagContent:string, end2:string, txtEnd1:string, txtName:string, txtContent:string, txtEnd2:string, index:number){

            if (index > lastIndex){
                list.push(_newTextContent(tmpl, lastIndex, index));
            }

            var end = !!end1 || !!end2 || !!txtEnd1 || !!txtEnd2,
                cmd = !!txtName;

            var item:htmlTagItem = {
                tagName:tagName || txtName,
                target:!cmd,
                cmd:cmd,
                find:find,
                content:tagContent || txtContent,
                attrs:!cmd ? _getAttrs(tagContent) : null,
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
        // Cmpx.each(list, function(item:htmlTagItem, index:number){
        //     console.log(JSON.stringify(item));
        //     console.log('  -----------------');
        // });
        //console.log(list.length);
        return list;
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
    _getBind = function(value:string, split:string){
        return value.replace(_textBackRegex, function(find:string, content:string, index:number){
            return [split, decodeURIComponent(content), split].join('+');
        });
    };
    //_makeTags(tmpl);
    //_getAttrs(' aaa="asdfasdf\'" bbb=\'sdfddd$($aaa$)$ddf\' ccc="acccca"');

describe('Compile', () => {
  it('_makeTags', () => {
    var tags = _makeTags(tmpl);

    expect(tags.length == 23).to.equal(true);
  });
});
