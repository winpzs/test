import Platform from './platform';
import { Componet } from './componet';
import { Compile } from './compile';

export default class Browser extends Platform{

    constructor(){
        super();
    }

    boot(componetDef:any):Browser{
        Compile.renderComponet(componetDef, new HTMLElement());
        return this;
    }

}