function anonymous(CmpxLib, Compile, componet, element, subject
/**/) {
    Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
        Compile.createTextNode(" divText ", componet, element, subject);
        Compile.createElement("span", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "id", "span1");
            Compile.createTextNode(" spanText ", componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.tmplRender("tmpl1", componet, element, subject, function (componet, element, subject, param) {
            var item = param.item, index = param.index;
            Compile.createTextNode(" tmpl text ", componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.forRender(function (componet, element, subject) {
            return this.users
        }, function (userItem, $index, componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
                Compile.createTextNode(" for div text ", componet, element, subject);
            });
            Compile.createTextNode(" ", componet, element, subject);
            Compile.includeRender("tmpl1", componet, element, false, subject, { item: userItem, $index: $index });
            Compile.createTextNode(" ", componet, element, subject);
        }, componet, element, subject, false);
        Compile.createTextNode(" ", componet, element, subject);
        Compile.tmplRender("tmpl2", componet, element, subject, function (componet, element, subject, param) {
            Compile.createTextNode(" \"+item.name+\" ", componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
    });
}