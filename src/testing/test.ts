
import { VM, Componet, Browser } from "../index";

var tmpl = `before<div><span 
 id="spanId" name="spanName" content="{{aaa+aa
    a》&<>}}">spanText</span>{{bbbbbb}}  divT{{ if a}}ext{{else user.isOk > newaaa }} {{ for item in list}} {{/for}}{{/if}}</div>
 {{for item in list tmpl="user.html" /}}{{tmpl}} {{include src="list.html" /}} tmplText {{/tmpl}}{{include}}`;


@VM({
    name:'app',
    tmpl:`<div>
  divText
  <span id="span1"> spanText </Span>
  {{tmpl id="tmpl1"}}
    tmpl text
  {{/tmpl}}
  {{include tmpl="tmpl1" /}}{{for userItem in this.users}}
    <div> for div text </div>
  {{/for}}
  {{tmpl id="tmpl2" forItem="item"}}
    {{item.name}}
  {{/tmpl}}
  {{for item in this.list tmpl="tmpl2" /}}
</div>`
})
class MyComponet extends Componet{
    constructor(){
        super();
    }

}


new Browser().boot(MyComponet);