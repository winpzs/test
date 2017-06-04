import { CompileSubject } from './compile';

export class Componet{
    readonly $name:string;
    readonly $parent:Componet;
    readonly $children:Array<Componet> = [];
    readonly $subObject:CompileSubject;
    readonly $elements:Array<HTMLElement|Text> = [];
    readonly $parentElement:HTMLElement;

    $update(p:any=null){
    }

    $isDisposed:Boolean = false;
    $dispose() {
        this.$isDisposed = true;
    }

    constructor(){
    }
}
