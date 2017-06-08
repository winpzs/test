function anonymous(CmpxLib, Compile, componet, element, subject
/**/) {
    var __tmplRender = Compile.tmplRender,
        __createComponet = Compile.createComponet,
        __createElement = Compile.createElement,
        __setAttribute = Compile.setAttribute,
        __createTextNode = Compile.createTextNode,
        __forRender = Compile.forRender,
        __ifRender = Compile.ifRender,
        __includeRender = Compile.includeRender
    __tmplRender("tmpl1", componet, element, subject, function (componet, element, subject, param) {
        var index = param.index;
        __createTextNode(" ", componet, element, subject);
        __createElement("span", "<span>", componet, element, subject, function (componet, element, subject) {
            __createTextNode("tmpl text", componet, element, subject);
        });
        __createTextNode((function () {

            return {
                once: false,
                read: function () { return " " + index + " "; },
                write: null,
                event: null
            };
        }).call(componet), componet, element, subject);
    });
    __createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
        __createElement("input", "<input>", componet, element, subject, function (componet, element, subject) {
            __setAttribute(element, "type", "text", componet, subject);
            __setAttribute(element, "value", (function () {

                return {
                    once: false,
                    read: function () { return "" + this.num + ""; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, subject);
        });
        __createElement("input", "<input>", componet, element, subject, function (componet, element, subject) {
            __setAttribute(element, "type", "text", componet, subject);
            __setAttribute(element, "value", "#4@#&", componet, subject);
        });
        __createTextNode((function () {
            var once0 = (this.text);
            return {
                once: false,
                read: function () { return " divText (" + this.text + ")" + once0 + " "; },
                write: null,
                event: null
            };
        }).call(componet), componet, element, subject);
        __createElement("span", "<span>", componet, element, subject, function (componet, element, subject) {
            __setAttribute(element, "id", "span1", componet, subject);
            __createTextNode((function () {
                var once0 = (new Date().toString()), once1 = (new Date().getDay());
                return {
                    once: true,
                    read: function () { return " spanText " + once0 + " | " + once1 + " "; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, element, subject);
        });
        __createTextNode(" ", componet, element, subject);
        __createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
            __createTextNode(" ", componet, element, subject);
            __createElement("button", "<button>", componet, element, subject, function (componet, element, subject) {
                __setAttribute(element, "click", (function () {

                    return {
                        once: false,
                        read: null,
                        write: null,
                        event: function (event) { return this.click(1); }
                    };
                }).call(componet), componet, subject);
                __createTextNode((function () {

                    return {
                        once: false,
                        read: function () { return "测试, 数量:" + this.num + ""; },
                        write: null,
                        event: null
                    };
                }).call(componet), componet, element, subject);
            });
            __createTextNode(" ", componet, element, subject);
            __createElement("button", "<button>", componet, element, subject, function (componet, element, subject) {
                __setAttribute(element, "click", (function () {

                    return {
                        once: false,
                        read: null,
                        write: null,
                        event: function (event) { return this.clickItem(); }
                    };
                }).call(componet), componet, subject);
                __createTextNode("测试item.id", componet, element, subject);
            });
            __createTextNode(" ", componet, element, subject);
        });
        __createTextNode(" ", componet, element, subject);
        __createTextNode(" ", componet, element, subject);
        __forRender(function (componet, element, subject) {
            return this.users
        }, function (userItem, $index, componet, element, subject) {
            __createTextNode(" ", componet, element, subject);
            __createElement("div", "<div>", componet, element, subject, function (componet, element, subject) {
                __createTextNode((function () {
                    var once0 = ($index);
                    return {
                        once: false,
                        read: function () { return " " + once0 + " (" + userItem.id + ") for div text inc:"; },
                        write: null,
                        event: null
                    };
                }).call(componet), componet, element, subject);
                __includeRender("tmpl1", componet, element, false, subject, { index: $index });
                __createTextNode(" ", componet, element, subject);
            });
            __createTextNode(" ", componet, element, subject);
        }, componet, element, false, subject);
        __createTextNode(" ", componet, element, subject);
        __ifRender(function (componet, element, subject) {
            return this.ok
        }, function (componet, element, subject) {
            __createTextNode((function () {

                return {
                    once: false,
                    read: function () { return " ok:" + this.ok + " "; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, element, subject);
        }, function (componet, element, subject) {
            __createTextNode(" ", componet, element, subject);
            __createElement("br", "<br>", componet, element, subject);
            __createTextNode((function () {

                return {
                    once: false,
                    read: function () { return " !ok:" + this.ok + " "; },
                    write: null,
                    event: null
                };
            }).call(componet), componet, element, subject);
        }, componet, element, false, subject);
        __createTextNode(" ", componet, element, subject);
    });
}