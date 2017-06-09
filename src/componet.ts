import { CompileSubject, CompileRender } from './compile';

export class Componet{
    readonly $name:string;
    readonly $parent:Componet;
    readonly $children:Array<Componet> = [];
    readonly $subObject:CompileSubject;
    readonly $elements:Array<HTMLElement|Text> = [];
    readonly $parentElement:HTMLElement;

    $update(p?:any){
        if(this.$isDisposed)return;
        this.$subObject.update({
            componet:this,
            parentElement:this.$parentElement,
            param:p
        })
    }

    $render(tmpl:string): CompileRender{
        return new CompileRender(tmpl);
    }

    onInit(cb:(err?:any)=>void, p?:any):void{
       cb && cb();
    }

    onReady(cb:(err?:any)=>void, p?:any):void{
        cb && cb();
    }

    onUpdate(cb:(err?:any, p?:any)=>void):void{
        cb && cb();
    }

    $isDisposed:Boolean = false;
    onDispose() {
        this.$isDisposed = true;
    }

    constructor(){
    }
}
