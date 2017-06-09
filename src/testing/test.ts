
import { VM, Componet, Browser } from "../index";

@VM({
    name:'app',
    tmpl:`<div><input type="text" value="{{this.num}}" aaa={{this.num}} ccc bbb= /><input type="text" value="#4@#&" />
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

    onInit(cb){
      console.log('onInit');
      cb();
      // super.onInit(function(){
      //   cb();
      // });
    }

    onUpdate(cb, p?:any){
      console.log('onUpdate');
      cb();
    }

    onReady(cb){
      console.log('onReady');
      cb();
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