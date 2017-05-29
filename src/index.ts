import { Compile } from './compile';

export * from './Cmpx';

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;


new Compile(tmpl);