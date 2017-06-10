
import { VM, Componet, Browser, viewvar } from "../index";

@VM({
    name:'app',
    tmpl:`<div><input $var="input1" type="text" value="{{this.num}}" /><input type="text" value={{this.num
       + '#4@#&'}} click="{{@console.log(input1.value)}}" />
  divText ({{this.text}}){{: this.text}}
  <span id="span1" style.color="{{'red'}}" click="{{@console.log(element.innerText);}}"> spanText {{:new Date().toString()}} | {{:new Date().getDay()}}  </Span>
  <div>
    <button click="{{@this.click(1)}}">测试, 数量:{{this.num}}</button>
    <button click="{{@this.clickItem()}}">测试item.id</button>
  </div>
  {{tmpl id="tmpl1" let="index=param.index"}}
    <span>tmpl text</span> {{index}}
  {{/tmpl}}
  
  {{for userItem in this.users}}
    <div> {{:$index}} ({{userItem.id}}) for div text
           inc:{{include tmpl="tmpl1" param="{index:$index}" }} </div>
  {{/for}}
  {{if this.ok}}
    ok:{{this.ok}}
  {{else}}
    <br />
    !ok:{{this.ok}}
  {{/if}}
</div>
    <textarea>
    <span>aaa
    </span>
    </textarea>
  <pre><span style.color="{{'red'}}">sd   fsfsf</span></pre>
`
})
class MyComponet extends Componet{
    constructor(){
        super();
        

    }

    @viewvar('textvar')
    input1:any;

    onInit(cb, p){
      console.log('onInit');
      super.onInit(cb, p);
      // super.onInit(function(){
      //   cb();
      // }, p);
    }

    onUpdateBefore(cb, p){
      console.log('onUpdateBefore');
      super.onUpdateBefore(cb, p);
    }

    onUpdate(cb, p){
      console.log('onUpdate');
      super.onUpdate(cb, p);
    }

    onInitViewvar(cb, p){
      console.log('onInitViewvar');
      super.onInitViewvar(cb, p);
    }

    onReady(cb, p){
      console.log('onReady');
      super.onReady(cb, p);
    }

    text:string = "text";
    ok:boolean = true;
    users = [{id:'id 0'}];
    makeItem(num:number){
      var list = [];
      for (var i=0;i<num;i++)
        list.push({id:'id '+i});
      this.users = list;
    }
    num:number = 0;
    click(){
      let n = 1 + Math.round(Math.random() * 500);
      this.makeItem(n);
      this.num = n ;
      console.time('update '+n);
      this.$update();
      console.timeEnd('update '+n);
    }
    clickItem(){
      this.users[0].id = new Date().toString();
      console.time('updateItem');
      this.$update();
      console.timeEnd('updateItem');
    }
}


new Browser().boot(MyComponet);

//new IE8Browser().boot(MyComponet);