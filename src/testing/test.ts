import { VM, Componet, Browser, viewvar, HtmlDef } from "../index";

@VM({
  name:'item',
  tmpl:`<span>
    {{this.name}}:{{this.param}}[{{this.num}}]
  </span>`
})
class ComponetItem extends Componet{
  name:string = "test item";
  param:string;
  num:string;

  constructor(){
    super();
    setTimeout(()=>{
      this.num += "" + new Date().valueOf();
      this.$update();
    }, 1000);
  }
  onInit(cb, p){
    super.onInit(cb, p);
    // super.onInit(function(){
    //   cb();
    // }, p);
  }

  onDispose(){
    super.onDispose();
    //console.log('ComponetItem onDispose');
  }
}

@VM({
    name:'app',
    tmpl:`<div><input $var="input1" type="text" value="{{&this.num}}" />{{this.num}}<input type="text" value={{this.numPrint
       + '#4@#&'}} click="{{@console.log(input1.value)}}" />
  divText ({{this.text}}){{: this.text}}
  <span id="span1" style.color="{{'red'}}" click="{{@console.log(element.innerText);}}"> spanText {{:new Date().toString()}} | {{:new Date().getDay()}}  </Span>
  <div>
    <button click="{{@this.click(1)}}">测试, 数量:{{this.numPrint}}</button>
    <button click="{{@this.clickItem()}}">测试item.id</button>
    <button click="{{@this.clickRender()}}">测试render</button>
    ({{this.aaaa}})
  </div>
  {{tmpl id="tmpl1" let="index=param.index"}}
    <span>tmpl text</span> {{index}}
    (<item param="asdfafd" $array="cpList" num="{{this.numPrint}}"></item>)
  {{/tmpl}}
  
  {{for userItem in this.users}}
    <div> {{:$index}}({{$odd}},{{userItem_odd}}) ({{userItem.id}}) for div text
           inc:{{include tmpl="tmpl1" param="{index:$index}" }}
           inc1:{{include render="this.testRender" }}
    </div>
  {{/for}}
  {{if this.ok}}
    ok:{{this.ok}}
  {{else}}
    <br />
    !ok:{{this.ok}}
  {{/if}}
</div>

    <textarea class="red">
    <span>aaa
    </span>
    </textarea>
  <pre><span style.color="{{'red'}}">sd   fsfsf</span></pre>
  <script type="text/html">alert('aaa');</script>
`,
  style:`.red {color:red}`
})
class MyComponet extends Componet{

    testRender:any;

    constructor(){
        super();
        
        this.testRender = this.$render(' [<item param="asdfafd" num="{{this.numPrint}}"></item> {{dddd}}]', {dddd:111});
        //this.makeItem(1000);
    }

    clickRender(){
      this.testRender = this.$render(' [<item param="asdfafd" num="{{this.numPrint}}"></item>]'+new Date().valueOf());
      this.$update();
    }

    @viewvar('input1')
    inputTest:HTMLInputElement;
    
    @viewvar()
    input1:HTMLInputElement;

    onInit(cb, p){
      //console.log('onInit');
      super.onInit(cb, p);
      // setTimeout(()=>{
      //   super.onInit(cb, p);
      // }, 1000);
    }

    onUpdateBefore(cb, p){
      //console.log('onUpdateBefore');
      super.onUpdateBefore(cb, p);
    }

    onUpdate(cb, p){
      console.log('onUpdate');
      super.onUpdate(cb, p);
    }

    onInitViewvar(cb, p){
      //console.log('onInitViewvar', this.testCp);
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
    num:number = 10;
    numPrint:string = '';

    @viewvar()
    cpList:ComponetItem[];
    click(){
      let n = 1 + Math.round(Math.random() * (~~this.num));
      this.makeItem(n);
      let t = new Date().valueOf();
      console.log('cpList b', this.cpList);
      console.time('update '+n);
      this.$update();
      console.timeEnd('update '+n);
      this.numPrint = n + ' ' + (new Date().valueOf() - t) + 'ms ';
      this.$update();
      console.log('cpList e', this.cpList);
    }
    clickItem(){
      this.users[0].id = new Date().toString();
      console.time('updateItem');
      this.$update();
      console.timeEnd('updateItem');
    }
}

console.time('start');
new Browser().boot(MyComponet);
console.timeEnd('start');

//new IE8Browser().boot(MyComponet);