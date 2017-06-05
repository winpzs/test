
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
{{tmpl id="tmpl1"}}
  <span> tmpl span</span>
{{/tmpl}}
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


function cmpFun(Cmpx: any, Compile, componet: Componet, element: HTMLElement, insert:string, subject:CompileSubject) {
  Compile.createElement('div', componet, element, insert, subject, function (componet, element, insert, subject) {

    Compile.setAttribute(element, 'name', 'value');

    Compile.createComponet('user', componet, element, 'inst', subject, function (componet, element, insert, subject) {

      Compile.createTextNode('aaaaaa', componet, element, insert, subject);

      Compile.createElement('aaaaaa', componet, element, insert, subject, function (componet, element, insert, subject) {
        Compile.createTextNode('aaaaaa', componet, element, insert, subject);
        Compile.createElement('aaaaaa', componet, element, insert, subject);
      });

      Compile.forRender(function (componet, element, subject) {
        return this.list;
      }, function (item, $index, componet, element, insert, subject) {
          Compile.createElement('div', componet, element, insert, subject, function (componet, element, insert, subject) { })
      }, componet, element, subject, insert);
      //end for

      Compile.ifRender(function (componet, element, subject) {
        return this.isOk;
      }, function (componet, element, insert, subject) {
          Compile.createElement('div', componet, element, insert, subject);
      }, function (componet, element, subject) {
          Compile.createElement('div', componet, element, insert, subject);
      }, componet, element, insert, insert, subject);
      //end if

      Compile.tmplRender('tmpl1', componet, element, subject, function (componet, element, insert, subject) {
          Compile.createElement('div', componet, element, insert, subject)
      });
      //end tmpl

      Compile.includeRender('tmpl1', componet, element, insert, subject);

    });

  });

}


function anonymous(Cmpx, Compile, componet, element, insert, subject
/**/) {

  Compile.createTextNode("!", componet, element, insert, subject);

  Compile.ifRender(function (componet, element, subject) {
    return this.user.ok
  }, function (componet, element, insert, subject) {
    Compile.createTextNode(" userOk ", componet, element, insert, subject);
  }, function (componet, element, insert, subject) {
    Compile.createTextNode(" serverOk ", componet, element, insert, subject);
  }, componet, element, subject, insert);

  Compile.createTextNode(" ", componet, element, insert, subject);

  Compile.forRender(function (componet, element, subject) {
    return this.item
  }, function (item, $index, componet, element, insert, subject) {
    Compile.createTextNode(" for Text ", componet, element, insert, subject);
  }, componet, element, subject, insert);

  Compile.createTextNode(" ", componet, element, insert, subject);

  Compile.forRender(function (componet, element, subject) {
    return this.item
  }, function (item, $index, componet, element, insert, subject) {
  }, componet, element, subject, insert);

  Compile.createTextNode(" ", componet, element, insert, subject);

  Compile.createElement("div", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.setAttribute(element, "text", "\"+text+\"ok");
    Compile.createTextNode(" divText ", componet, element, insert, subject);
    Compile.createElement("span", componet, element, insert, subject, function (componet, element, insert, subject) {
      Compile.setAttribute(element, "id", "spanId");
      Compile.createTextNode(" spanText:\"+name+\"\"+this.anem+\" ", componet, element, insert, subject);
    });
  });

  Compile.createTextNode(" ", componet, element, insert, subject);
  Compile.createElement("input", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.setAttribute(element, "type", "text");
  });
  Compile.createTextNode(" ", componet, element, insert, subject);
  Compile.createElement("input", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.setAttribute(element, "type", "text");
  });
  Compile.createTextNode("aaaa", componet, element, insert, subject);
  Compile.createTextNode(" ", componet, element, insert, subject);
  Compile.createElement("input", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.setAttribute(element, "type", "text");
  });
  Compile.createTextNode(" ! a ", componet, element, insert, subject);
  Compile.createElement("textarea", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.createTextNode("\n&amp;lt;br&nbsp;/&amp;gt;&amp;lt;div&amp;gt;aa\na&amp;lt;/div&amp;gt;\n", componet, element, insert, subject);
  });
  Compile.createTextNode(" ", componet, element, insert, subject);
  Compile.createElement("script", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.createTextNode("\nasdf&amp;lt;br&nbsp;/&amp;gt;\n", componet, element, insert, subject);
  });
  Compile.createTextNode(" ", componet, element, insert, subject);
  Compile.createElement("input", componet, element, insert, subject, function (componet, element, insert, subject) {
    Compile.setAttribute(element, "type", "text");
    Compile.setAttribute(element, "readonly", "");
  });
  Compile.createTextNode(" ", componet, element, insert, subject);

  Compile.tmplRender("tmpl1", componet, element, subject, function (componet, element, insert, subject) {
    Compile.createTextNode(" ", componet, element, insert, subject);
    Compile.createElement("span", componet, element, insert, subject, function (componet, element, insert, subject) {
      Compile.createTextNode(" tmpl span", componet, element, insert, subject);
    });
    Compile.createTextNode(" ", componet, element, insert, subject);
  });

  Compile.createTextNode(" ", componet, element, insert, subject);

  Compile.includeRender("tmpl1", componet, element, insert, subject);

  Compile.createTextNode(" ", componet, element, insert, subject);
}