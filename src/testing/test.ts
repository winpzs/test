
import { VM, Componet, Browser } from "../index";

@VM({
    name:'app',
    tmpl:`<div><input type="text" value="{{'aaaa'}}" />
  divText ({{this.text}}){{: this.text}} {{< this.text}} {{@this.text}} {{& this.click}}{{! this.clickCall(element, this.text)}}
  <span id="span1"> spanText {{new Date().toString()}} | {{new Date().getDay()}}  </Span>
  {{tmpl id="tmpl1" let="index=param.index"}}
    tmpl text {{index}}
  {{/tmpl}}
  
  {{for userItem in this.users}}
    <div> {{$index}} for div text
           inc:{{include tmpl="tmpl1" param="{index:$index}" /}} </div>
  {{/for}}
  {{if this.ok}}
    ok:{{this.ok}}
  {{else}}
    <br />
    !ok:{{this.ok}}
  {{/if}}
</div>`
})
class MyComponet extends Componet{
    constructor(){
        super();
        // for (var i=0;i<1000;i++)
        //   this.users.push({});
        //   return;
        setTimeout(()=>{
          this.addItem(5);
          this.text = 'update2000';
          console.time('update2000');
          this.$update();
          console.timeEnd('update2000');
        }, 2000);

        setTimeout(()=>{
          this.addItem(2);
          this.text = 'update5000';
          console.time('update5000');
          this.$update();
          console.timeEnd('update5000');
        }, 5000);

        setTimeout(()=>{
          this.ok = false;
          this.text = 'update8000';
          this.users = null;
          console.time('update8000');
          this.$update();
          console.timeEnd('update8000');
        }, 8000);

    }
    text:string = "text";
    ok:boolean = true;
    users = [{}];
    addItem(num:number){
      var list = [];
      for (var i=0;i<num;i++)
        list.push({});
      this.users = list;
    }
    click(){

    }
    clickCall(el:any, s:string):string{
      return 'clickCall'+s;
    }
}


new Browser().boot(MyComponet);