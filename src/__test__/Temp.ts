import { Compile } from './../compile';
import Cmpx from '../Cmpx';

import { expect } from 'chai';
import 'mocha';

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;

describe('Compile', () => {
  it('_makeTags', () => {
    var cp = new Compile(tmpl);
    var tags = cp.getHtmlTagObjects();

    expect(tags.length == 23).to.equal(true);
    console.log((tags));
  });
});
