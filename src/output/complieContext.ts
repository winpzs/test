function anonymous(CmpxLib, Compile, componet, element, subject
/**/) {
    Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
        Compile.createElement("input", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "type", "text", componet, subject);
            Compile.setAttribute(element, "value", (function () {

                return {
                    read: function () { return "" + 'aaaa' + ""; },
                    write: null,
                    event: null,
                    eventEval: null
                };
            }).call(componet), componet, subject);
        });
        Compile.createTextNode((function () {
            var once0 = (this.text);
            return {
                read: function () { return " divText (" + this.text + ")" + once0 + " "; },
                write: null,
                event: null,
                eventEval: null
            };
        }).call(componet), componet, element, subject);
        Compile.createElement("span", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "id", "span1", componet, subject);
            Compile.createTextNode((function () {
                var once0 = (new Date().toString()), once1 = (new Date().getDay());
                return {
                    read: function () { return " spanText " + once0 + " | " + once1 + " "; },
                    write: null,
                    event: null,
                    eventEval: null
                };
            }).call(componet), componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.tmplRender("tmpl1", componet, element, subject, function (componet, element, subject, param) {
            var index = param.index;
            Compile.createTextNode((function () {

                return {
                    read: function () { return " tmpl text " + index + " "; },
                    write: null,
                    event: null,
                    eventEval: null
                };
            }).call(componet), componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.forRender(function (componet, element, subject) {
            return this.users
        }, function (userItem, $index, componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("div", componet, element, subject, function (componet, element, subject) {
                Compile.createTextNode((function () {

                    return {
                        read: function () { return " " + $index + " for div text inc:"; },
                        write: null,
                        event: null,
                        eventEval: null
                    };
                }).call(componet), componet, element, subject);
                Compile.includeRender("tmpl1", componet, element, false, subject, { index: $index });
                Compile.createTextNode(" ", componet, element, subject);
            });
            Compile.createTextNode(" ", componet, element, subject);
        }, componet, element, false, subject);
        Compile.createTextNode(" ", componet, element, subject);
        Compile.ifRender(function (componet, element, subject) {
            return this.ok
        }, function (componet, element, subject) {
            Compile.createTextNode((function () {

                return {
                    read: function () { return " ok:" + this.ok + " "; },
                    write: null,
                    event: null,
                    eventEval: null
                };
            }).call(componet), componet, element, subject);
        }, function (componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("br", componet, element, subject);
            Compile.createTextNode((function () {

                return {
                    read: function () { return " !ok:" + this.ok + " "; },
                    write: null,
                    event: null,
                    eventEval: null
                };
            }).call(componet), componet, element, subject);
        }, componet, element, false, subject);
        Compile.createTextNode(" ", componet, element, subject);
    });
}