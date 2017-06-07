import Platform from './platform';
import { Componet } from './componet';
import { Compile, CompileSubject } from './compile';

export class Browser extends Platform {

    constructor() {
        super();
    }

    boot(componetDef: any): Browser {

        let name = componetDef.prototype.$name,
            bootElement:HTMLElement = document.getElementsByTagName(name)[0];
        if (!bootElement)
            throw new Error(`没有${name}标签`);

        let _doc = document, parentElement =bootElement.parentElement;
        let preElement:any = bootElement.previousSibling;
        if (!preElement){
            preElement = _doc.createComment(name);
            parentElement.insertBefore(preElement, bootElement);
        }
        parentElement.removeChild(bootElement);
        bootElement = preElement;

        ////DOMContentLoaded 时起动
        let _readyName = 'DOMContentLoaded', _ready = function () {
            _doc.removeEventListener(_readyName, _ready, false);
            window.removeEventListener('load', _ready, false);

            let parentElement =bootElement.parentElement,
                {newSubject, refComponet} = Compile.renderComponet(componetDef, bootElement);
            parentElement.removeChild(bootElement);

            let _unload = function(){
                window.removeEventListener('unload', _unload);
                newSubject.remove({
                    parentElement:parentElement,
                    componet:refComponet
                });
            };
            window.addEventListener('unload', _unload, false);
        };

        if (/loaded|complete|undefined/i.test(_doc.readyState))
            _ready();
        else{
            _doc.addEventListener(_readyName, _ready, false);
            window.addEventListener("load", _ready, false);

        }

        return this;
    }

}