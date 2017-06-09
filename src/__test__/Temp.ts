
import { expect } from 'chai';
import 'mocha';
import { Compile, VM, CompileSubject, HtmlTagDef, Componet } from '../index';

import fs = require('fs');

var tmpl = `
<div>
  divText
  <span id="span1" text="{{'asdfafd'}}" style="{{'color:red'}}" > spanText{{>this.user}}{{!"this"}} </span>
  {{tmpl id="tmpl1" let="item = param.item, index = param.index"}}
    tmpl text
  {{/tmpl}}
  {{for userItem in this.users}}
    <div> for div text </div>
    {{include tmpl="tmpl1" param="{item: userItem, $index:$index}" }}
  {{/for}}
  {{tmpl id="tmpl2"}}
    {{item.name}}
  {{/tmpl}}
</div>
<textarea><span>aaa</span></textarea>
<script type="text/html">
sdf<br />
</script>
`;

describe('Compile', () => {
  it('_makeTags', () => {
    console.time('Compile');
    var cp = new Compile(tmpl);
    console.timeEnd('Compile');
    var tags = cp.tagInfos;
    console.log(JSON.stringify(tags));

    let src = __dirname + '/../output/complieContext.ts'
    fs.writeFileSync(src, cp.tempFn.toString());
    
    src = __dirname + '/../output/htmlTagObjects.json'
    fs.writeFileSync(src, JSON.stringify(tags));

    //console.log((tags));

    expect(tags.length == 23).to.equal(true);
  });
});
