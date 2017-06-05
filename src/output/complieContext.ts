function anonymous(Cmpx, Compile, componet, element, subject
/**/) {
    Compile.createTextNode(" ", componet, element, subject);
    Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
        Compile.createTextNode(" divText ", componet, element, subject);
        Compile.createElement("span", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "id", "span1");
            Compile.createTextNode(" spanText ", componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.tmplRender("tmpl1", componet, element, subject, function (componet, element, subject) {
            Compile.createTextNode(" tmpl text ", componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.includeRender("tmpl1", componet, element, false, subject);
        Compile.forRender(function (componet, element, subject) {
            return this.users
        }, function (userItem, $index, componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
                Compile.createTextNode(" for div text ", componet, element, subject);
            });
            Compile.createTextNode(" ", componet, element, subject);
        }, componet, element, subject, true);
        Compile.createTextNode(" ", componet, element, subject);
    });
    Compile.createTextNode(" ", componet, element, subject);
}