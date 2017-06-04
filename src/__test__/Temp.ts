
import { expect } from 'chai';
import 'mocha';
import { Compile, VM, CompileSubject } from '../compile';
import { HtmlTagDef } from '../htmlTagDef';
import Cmpx from '../cmpx';
import { Componet } from '../componet';

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;

var tmplCmd = `!{{if this.user.ok}}
  userOk
{{else this.server.ok}}
serverOk
{{else this.role.ok}}
roleOk
{{/if}}
{{for this.item in list}}
for Text
{{/for}}
{{for this.item in list tmpl="index.html" /}}
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
{{include src="tmpl1" /}}
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


function cmpFunTemp(Cmpx: any, Compile, componet: Componet, element: HTMLElement, subject: CompileSubject) {
  Compile.createTextNode("!", componet, element, subject);
  Compile.ifRender(function (componet, element, subject) {
    return this.user.ok
  }, function (componet, element, subject) {
    Compile.createTextNode(" userOk ", componet, element, subject);
  }, function (componet, element, subject) {
    Compile.createTextNode(" serverOk ", componet, element, subject);
  }, componet, element, subject);
  Compile.createTextNode(" ", componet, element, subject);
  Compile.forRender(function (componet, element, subject) {
    return this.item
  }, function (item, $index, componet, element, subject) {
    Compile.createTextNode(" for Text ", componet, element, subject);
  }, componet, element, subject);
  Compile.createTextNode(" ", componet, element, subject);
  Compile.forRender(function (componet, element, subject) {
    return this.item
  }, function (item, $index, componet, element, subject) {
  }, componet, element, subject);
  Compile.createTextNode(" ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.setAttribute(element, "text", "\"+text+\"ok");
    Compile.createTextNode(" divText ", componet, element, subject);
    Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
      Compile.setAttribute(element, "id", "spanId");
      Compile.createTextNode(" spanText:\"+name+\"\"+this.anem+\" ", componet, element, subject);
    });
  });
  Compile.createTextNode(" ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.setAttribute(element, "type", "text");
  });
  Compile.createTextNode(" ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.setAttribute(element, "type", "text");
  });
  Compile.createTextNode("aaaa", componet, element, subject);
  Compile.createTextNode(" ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.setAttribute(element, "type", "text");
  });
  Compile.createTextNode(" ! a ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.createTextNode("\n&amp;lt;br&nbsp;/&amp;gt;&amp;lt;div&amp;gt;aa\na&amp;lt;/div&amp;gt;\n", componet, element, subject);
  });
  Compile.createTextNode(" ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.createTextNode("\nasdf&amp;lt;br&nbsp;/&amp;gt;\n", componet, element, subject);
  });
  Compile.createTextNode(" ", componet, element, subject);
  Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
    Compile.setAttribute(element, "type", "text");
    Compile.setAttribute(element, "readonly", "");
  });
  Compile.createTextNode(" ", componet, element, subject);
  Compile.includeRender("tmpl1", componet, element, subject);
  Compile.createTextNode(" ", componet, element, subject);
}