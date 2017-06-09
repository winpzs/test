function anonymous(CmpxLib,Compile,componet,element,subject
/**/) {
var __tmplRender = Compile.tmplRender,
    __createComponet = Compile.createComponet,
    __createElement = Compile.createElement,
    __setAttribute = Compile.setAttribute,
    __createTextNode = Compile.createTextNode,
    __forRender = Compile.forRender,
    __ifRender = Compile.ifRender,
    __includeRender = Compile.includeRender;
__tmplRender("tmpl1", componet, element, subject, function (componet, element, subject, param) {
var item = param.item, index = param.index;
__createTextNode(" tmpl text ", componet, element, subject);
});
__tmplRender("tmpl2", componet, element, subject, function (componet, element, subject, param) {
__createTextNode((function(){
  
  return {
    once:false,
    read:function(){ return " "+item.name+" "; },
    write:null,
    event:null
  };
}).call(componet), componet, element, subject);
});
__createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
__createTextNode(" divText ", componet, element, subject);
__createElement("span", "<span>", componet, element, subject, function (componet, element, subject) {
__setAttribute(element, "id", "span1", componet, subject);
__setAttribute(element, "text", (function(){
  
  return {
    once:false,
    read:function(){ return 'asdfafd'; },
    write:null,
    event:null
  };
}).call(componet), componet, subject);
__createTextNode((function(){
  
  return {
    once:false,
    read:function(){ return " spanText"+"this"+" "; },
    write:function(val){ this.user = val; },
    event:null
  };
}).call(componet), componet, element, subject);
});
__createTextNode(" ", componet, element, subject);
__createTextNode(" ", componet, element, subject);
__forRender(function (componet, element, subject) {
return this.users
}, function (userItem, $index, componet, element, subject) {
__createTextNode(" ", componet, element, subject);
__createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
__createTextNode(" for div text ", componet, element, subject);
});
__createTextNode(" ", componet, element, subject);
__includeRender("tmpl1", componet, element, false, subject, {item: userItem, $index:$index});
__createTextNode(" ", componet, element, subject);
}, componet, element, false, subject);
__createTextNode(" ", componet, element, subject);
__createTextNode(" ", componet, element, subject);
});
__createTextNode(" ", componet, element, subject);
__createElement("textarea", "<textarea>", componet, element, subject, function (componet, element, subject) {
__createTextNode("&amp;lt;span&amp;gt;aaa&amp;lt;/span&amp;gt;", componet, element, subject);
});
}