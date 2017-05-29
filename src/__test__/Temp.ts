import { Componet } from './../componet';
import { Compile, Config } from './../compile';

import { expect } from 'chai';
import 'mocha';

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;

var tmplCmd = `{{if user.ok}}
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
`;

describe('Compile', () => {
  it('_makeTags', () => {
    var cp = new Compile(tmplCmd);
    var tags = cp.getHtmlTagObjects();
    console.log(JSON.stringify(tags));
    //console.log((tags));

    expect(tags.length == 23).to.equal(true);
  });
});


@Config({
  selector:'app',
  tmpl:`before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`
})
class TestComponet extends Componet {

  constructor(){
    super();
    console.log(this['__config__']);
  }

}


@Config({
  selector:'appEx',
  tmpl:`<div></div>`
})
class TestComponetEx extends Componet {

}

new TestComponet();
