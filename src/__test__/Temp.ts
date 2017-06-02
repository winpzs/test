
import { expect } from 'chai';
import 'mocha';
import { Compile, Config, CompileElement } from '../compile';
import { HtmlTagDef } from '../htmlTagDef';
import Cmpx from '../cmpx';
import { Componet } from '../componet';

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;

var tmplCmd = `!{{if user.ok}}
  userOk
{{else server.ok}}
serverOk
{{else role.ok}}
roleOk
{{/if}}
{{for item in list}}
for Text
{{/for}}
{{for item in list tmpl="index.html" /}}
<div text="{{text}}ok"> divText <span id="spanId"> spanText:{{name}} </span></div>
<input type="text">
<input type="text">aaaa</input>
<input type="text" />
!
a
<textarea>
<br /><div>aa
a</div>
</textarea>
<script>
asdf<br />
</script>
`;

describe('Compile', () => {
  it('_makeTags', () => {
    console.time('Compile');
    var cp = new Compile(tmplCmd);
    console.timeEnd('Compile');
    var tags = cp.getHtmlTagObjects();
    console.log(JSON.stringify(tags));
    //console.log((tags));

    expect(tags.length == 23).to.equal(true);
  });
});


// @Config({
//   name:'app',
//   tmpl:`before<div><span 
//  id="spanId" name="spanName" content="{{aaa+aa
//     a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
//  {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`
// })
// class TestComponet extends Componet {

//   constructor(){
//     super();
//     console.log(this['__config__']);
//   }

// }


// @Config({
//   name:'appEx',
//   tmpl:`<div></div>`
// })
// class TestComponetEx extends Componet {

// }

// new TestComponet();


function cmpFun(Cmpx:any, Compile, componet:Componet, parent:HTMLElement){
  var element;

  Compile.createElement('div', [], [
    Compile.createComponet('user', [], [
      Compile.createTextNode('aaaaaa'),
      Compile.createElement('aaaaaa', [])
    ]),
    Compile.createTextNode('aaaaaa'),
    Compile.createElement('div', [
      Compile.createComponet('role', [], []),
      Compile.createTextNode('bbbb'),
      Compile.createElement('div', [])
    ]),
    Compile.createElement('div', []),
    Compile.forRender(function(){ return this.list; }, function(item, $index){
      return [
        Compile.createElement('div', [])
      ]; 
    }, componet),
    Compile.ifRender(function(){ return this.isOk; }, function(){
      return [
        Compile.createElement('div', [])
      ]; 
    }, function(){
      return [
        Compile.createElement('div', [])
      ]; 
    }, componet),
    Compile.tmplRender('tmpl1', [], componet),
    Compile.includeRender('tmpl1', componet)
  ], parent);

}
