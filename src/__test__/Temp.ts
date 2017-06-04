
import { expect } from 'chai';
import 'mocha';
import { Compile, VM, CompileElement, CompileSubject } from '../compile';
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
<div text="{{text}}ok"> divText <span id="spanId"> spanText:{{name}}{{this.anem}} </span></div>
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
<input type="text" readonly />

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


// @VM({
//   name:'app',
//   tmpl:`before<div><span 
//  id="spanId" name="spanName" content="{{aaa+aa
//     a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
//  {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`
// })
// class TestComponet extends Componet {

//   constructor(){
//     super();
//     console.log(this['__vm__']);
//   }

// }


// @VM({
//   name:'appEx',
//   tmpl:`<div></div>`
// })
// class TestComponetEx extends Componet {

// }

// new TestComponet();


function cmpFun(Cmpx: any, Compile, componet: Componet, element: HTMLElement, subject:CompileSubject) {
  Compile.createElement('div', componet, element, subject, function (componet, element, subject) {

    Compile.setAttribute(element, 'name', 'value');

    Compile.createComponet('user', componet, element, subject, function (componet, element, subject) {

      Compile.createTextNode('aaaaaa', componet, element, subject);

      Compile.createElement('aaaaaa', componet, element, subject, function (componet, element, subject) {
        Compile.createTextNode('aaaaaa', componet, element, subject);
        Compile.createElement('aaaaaa', componet, element, subject);
      });

      Compile.forRender(function (componet, element, subject) {
        return this.list;
      }, function (item, $index, componet, element, subject) {
          Compile.createElement('div', componet, element, subject, function (componet, element, subject) { })
      }, componet, element, subject);
      //end for

      Compile.ifRender(function (componet, element, subject) {
        return this.isOk;
      }, function (componet, element, subject) {
          Compile.createElement('div', componet, element, subject);
      }, function (componet, element, subject) {
          Compile.createElement('div', componet, element, subject);
      }, componet, element, subject);
      //end if

      Compile.tmplRender('tmpl1', componet, element, subject, function (componet, element) {
          Compile.createElement('div', componet, element, subject)
      });
      //end tmpl

      Compile.includeRender('tmpl1', componet, element, subject);

    });

  });

}
