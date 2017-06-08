function anonymous(CmpxLib, Compile, componet, element, subject
/**/) {
    Compile.tmplRender("tmpl1", componet, element, subject, function (componet, element, subject, param) {
        var index = param.index;
        Compile.createTextNode(" ", componet, element, subject);
        Compile.createElement("span", "<span>", componet, element, subject, function (componet, element, subject) {
            Compile.createTextNode("tmpl text", componet, element, subject);
        });
        Compile.createTextNode((function () {

            return {
                once: false,
                read: function () { return " " + index + " "; },
                write: null,
                event: null
            };
        }).call(componet), componet, element, subject);
    });
    Compile.createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
        Compile.createElement("input", "<input>", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "type", "text", componet, subject);
            Compile.setAttribute(element, "value", (function () {

                return {
                    once: false,
                    read: function () { return "" + this.num + ""; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, subject);
        });
        Compile.createElement("input", "<input>", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "type", "text", componet, subject);
            Compile.setAttribute(element, "value", "#4@#&", componet, subject);
        });
        Compile.createTextNode((function () {
            var once0 = (this.text);
            return {
                once: false,
                read: function () { return " divText (" + this.text + ")" + once0 + " "; },
                write: null,
                event: null
            };
        }).call(componet), componet, element, subject);
        Compile.createElement("span", "<span>", componet, element, subject, function (componet, element, subject) {
            Compile.setAttribute(element, "id", "span1", componet, subject);
            Compile.createTextNode((function () {
                var once0 = (new Date().toString()), once1 = (new Date().getDay());
                return {
                    once: true,
                    read: function () { return " spanText " + once0 + " | " + once1 + " "; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("button", "<button>", componet, element, subject, function (componet, element, subject) {
                Compile.setAttribute(element, "click", (function () {

                    return {
                        once: false,
                        read: null,
                        write: null,
                        event: function (event) { return this.click(1); }
                    };
                }).call(componet), componet, subject);
                Compile.createTextNode((function () {

                    return {
                        once: false,
                        read: function () { return "测试, 数量:" + this.num + ""; },
                        write: null,
                        event: null
                    };
                }).call(componet), componet, element, subject);
            });
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("button", "<button>", componet, element, subject, function (componet, element, subject) {
                Compile.setAttribute(element, "click", (function () {

                    return {
                        once: false,
                        read: null,
                        write: null,
                        event: function (event) { return this.clickItem(); }
                    };
                }).call(componet), componet, subject);
                Compile.createTextNode("测试item.id", componet, element, subject);
            });
            Compile.createTextNode(" ", componet, element, subject);
        });
        Compile.createTextNode(" ", componet, element, subject);
        Compile.createTextNode(" ", componet, element, subject);
        Compile.forRender(function (componet, element, subject) {
            return this.users
        }, function (userItem, $index, componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
                Compile.createTextNode((function () {
                    var once0 = ($index);
                    return {
                        once: false,
                        read: function () { return " " + once0 + " (" + userItem.id + ") for div text inc:"; },
                        write: null,
                        event: null
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
                    once: false,
                    read: function () { return " ok:" + this.ok + " "; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, element, subject);
        }, function (componet, element, subject) {
            Compile.createTextNode(" ", componet, element, subject);
            Compile.createElement("br", "<br>", componet, element, subject);
            Compile.createTextNode((function () {

                return {
                    once: false,
                    read: function () { return " !ok:" + this.ok + " "; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, element, subject);
        }, componet, element, false, subject);
        Compile.createTextNode(" ", componet, element, subject);
    });
}