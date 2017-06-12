function anonymous(CmpxLib, Compile, componet, element, subject, __p__, initViewvar
/**/) {
  var __tmplRender = Compile.tmplRender,
    __createComponet = Compile.createComponet,
    __setAttributeCP = Compile.setAttributeCP,
    __createElement = Compile.createElement,
    __setAttribute = Compile.setAttribute,
    __createTextNode = Compile.createTextNode,
    __forRender = Compile.forRender,
    __ifRender = Compile.ifRender,
    __includeRender = Compile.includeRender;
  var input1, cpList = [];
  __createElement("div", [], componet, element, subject, function (componet, element, subject) {
    __createElement("input", [{ "name": "type", "value": "text", "subName": "" }], componet, element, subject, function (componet, element, subject) {
      input1 = element;
      __setAttribute(element, "value", "", (function () {

        return {
          once: false,
          read: function () { return CmpxLib.toStr(this.num); },
          write: function (val) { this.num = val; },
          event: null
        };
      }).call(componet), componet, subject);
    }, "");
    __createTextNode((function () {

      return {
        once: false,
        read: function () { return CmpxLib.toStr(this.num); },
        write: null,
        event: null
      };
    }).call(componet), componet, element, subject);
    __createElement("input", [{ "name": "type", "value": "text", "subName": "" }], componet, element, subject, function (componet, element, subject) {
      __setAttribute(element, "value", "", (function () {

        return {
          once: false,
          read: function () {
            return CmpxLib.toStr(this.numPrint
              + '#4@#&');
          },
          write: null,
          event: null
        };
      }).call(componet), componet, subject);
      __setAttribute(element, "click", "", (function () {

        return {
          once: false,
          read: null,
          write: null,
          event: function (event) { console.log(input1.value); }
        };
      }).call(componet), componet, subject);
    }, "");
    __createTextNode((function () {
      var once0 = CmpxLib.toStr(this.text);
      return {
        once: false,
        read: function () { return " divText (" + CmpxLib.toStr(this.text) + ")" + once0 + " "; },
        write: null,
        event: null
      };
    }).call(componet), componet, element, subject);
    __createElement("span", [{ "name": "id", "value": "span1", "subName": "" }], componet, element, subject, function (componet, element, subject) {
      __setAttribute(element, "style", "color", (function () {

        return {
          once: false,
          read: function () { return CmpxLib.toStr('red'); },
          write: null,
          event: null
        };
      }).call(componet), componet, subject);
      __setAttribute(element, "click", "", (function () {

        return {
          once: false,
          read: null,
          write: null,
          event: function (event) { console.log(element.innerText);; }
        };
      }).call(componet), componet, subject);
      __createTextNode((function () {
        var once0 = CmpxLib.toStr(new Date().toString()), once1 = CmpxLib.toStr(new Date().getDay());
        return {
          once: true,
          read: function () { return " spanText " + once0 + " | " + once1 + " "; },
          write: null,
          event: null
        };
      }).call(componet), componet, element, subject);
    }, "");
    __createTextNode(" ", componet, element, subject);
    __createElement("div", [], componet, element, subject, function (componet, element, subject) {
      __createTextNode(" ", componet, element, subject);
      __createElement("button", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "click", "", (function () {

          return {
            once: false,
            read: null,
            write: null,
            event: function (event) { this.ok = !this.ok; this.$update(); }
          };
        }).call(componet), componet, subject);
        __createTextNode("ok", componet, element, subject);
      }, "");
      __createTextNode(" ", componet, element, subject);
      __createElement("button", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "click", "", (function () {

          return {
            once: false,
            read: null,
            write: null,
            event: function (event) { this.ok1 = !this.ok1; this.$update(); }
          };
        }).call(componet), componet, subject);
        __createTextNode("ok1", componet, element, subject);
      }, "");
      __createTextNode(" ", componet, element, subject);
      __createElement("button", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "click", "", (function () {

          return {
            once: false,
            read: null,
            write: null,
            event: function (event) { this.ok2 = !this.ok2; this.$update(); }
          };
        }).call(componet), componet, subject);
        __createTextNode("ok2", componet, element, subject);
      }, "");
      __createTextNode(" ", componet, element, subject);
      __ifRender(function (componet, element, subject) {
        return this.ok
      }, function (componet, element, subject) {
        __createTextNode(" ok1:true ", componet, element, subject);
      }, function (componet, element, subject) {
        __ifRender(function (componet, element, subject) {
          return this.ok1
        }, function (componet, element, subject) {
          __createTextNode(" ok:false, ok1:true ", componet, element, subject);
        }, function (componet, element, subject) {
          __ifRender(function (componet, element, subject) {
            return this.ok2
          }, function (componet, element, subject) {
            __createTextNode(" ok:false, ok1:false, ok2:true ", componet, element, subject);
          }, function (componet, element, subject) {
            __ifRender(function (componet, element, subject) {
              return true
            }, function (componet, element, subject) {
              __createTextNode(" ok:false, ok1:false, ok2:true ", componet, element, subject);
            }, function (componet, element, subject) {
            }, componet, element, false, subject);
          }, componet, element, false, subject);
        }, componet, element, false, subject);
      }, componet, element, false, subject);
      __createTextNode(" ", componet, element, subject);
    }, "");
    __createTextNode(" ", componet, element, subject);
    __createElement("div", [], componet, element, subject, function (componet, element, subject) {
      __createTextNode(" ", componet, element, subject);
      __createElement("button", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "click", "", (function () {

          return {
            once: false,
            read: null,
            write: null,
            event: function (event) { this.click(1); }
          };
        }).call(componet), componet, subject);
        __createTextNode((function () {

          return {
            once: false,
            read: function () { return "测试, 数量:" + CmpxLib.toStr(this.numPrint); },
            write: null,
            event: null
          };
        }).call(componet), componet, element, subject);
      }, "");
      __createTextNode(" ", componet, element, subject);
      __createElement("button", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "click", "", (function () {

          return {
            once: false,
            read: null,
            write: null,
            event: function (event) { this.clickItem(); }
          };
        }).call(componet), componet, subject);
        __createTextNode("测试item.id", componet, element, subject);
      }, "");
      __createTextNode(" ", componet, element, subject);
      __createElement("button", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "click", "", (function () {

          return {
            once: false,
            read: null,
            write: null,
            event: function (event) { this.clickRender(); }
          };
        }).call(componet), componet, subject);
        __createTextNode("测试render", componet, element, subject);
      }, "");
      __createTextNode((function () {

        return {
          once: false,
          read: function () { return " (" + CmpxLib.toStr(this.aaaa) + ") "; },
          write: null,
          event: null
        };
      }).call(componet), componet, element, subject);
    }, "");
    __createTextNode(" ", componet, element, subject);
    __tmplRender("tmpl1", componet, element, subject, function (componet, element, subject, param) {
      var index = param.index;
      __createTextNode(" ", componet, element, subject);
      __createElement("span", [], componet, element, subject, function (componet, element, subject) {
        __createTextNode("tmpl text", componet, element, subject);
      }, "");
      __createTextNode((function () {

        return {
          once: false,
          read: function () { return " " + CmpxLib.toStr(index) + " ("; },
          write: null,
          event: null
        };
      }).call(componet), componet, element, subject);
      __createComponet("item", componet, element, subject, function (componet, element, subject) {
        cpList.push(componet);
        __setAttributeCP(element, "param", "asdfafd", componet, subject);
        __setAttributeCP(element, "$array", "cpList", componet, subject);
        __setAttributeCP(element, "num", (function () {

          return {
            once: false,
            read: function () { return CmpxLib.toStr(this.numPrint); },
            write: null,
            event: null
          };
        }).call(componet), componet, subject);
      });
      __createTextNode(") ", componet, element, subject);
    });
    __createTextNode(" ", componet, element, subject);
    __forRender(function (componet, element, subject) {
      return this.users
    }, function (userItem, $count, $index, componet, element, subject) {
      var $last = ($count - $index == 1), userItem_last = $last, $first = ($index == 0), userItem_first = $first, $odd = ($index % 2 == 0), userItem_odd = $odd, $even = !$odd, userItem_even = $even;
      __createTextNode(" ", componet, element, subject);
      __createElement("div", [], componet, element, subject, function (componet, element, subject) {
        __createTextNode((function () {
          var once0 = CmpxLib.toStr($index);
          return {
            once: false,
            read: function () { return " " + once0 + "(" + CmpxLib.toStr($odd) + "," + CmpxLib.toStr(userItem_odd) + ") (" + CmpxLib.toStr(userItem.id) + ") for div text inc:"; },
            write: null,
            event: null
          };
        }).call(componet), componet, element, subject);
        __includeRender("tmpl1", componet, element, false, subject, { index: $index });
        __createTextNode(" inc1:", componet, element, subject);
        __includeRender(function () { return this.testRender }, componet, element, false, subject, null);
        __createTextNode(" ", componet, element, subject);
      }, "");
      __createTextNode(" ", componet, element, subject);
    }, componet, element, false, subject);
    __createTextNode(" ", componet, element, subject);
    __createElement("textarea", [{ "name": "class", "value": "red", "subName": "" }], componet, element, subject, function (componet, element, subject) {
    }, "\n    <span>aaa\n    </span>\n    ");
    __createTextNode(" ", componet, element, subject);
    __createElement("pre", [], componet, element, subject, function (componet, element, subject) {
      __createElement("span", [], componet, element, subject, function (componet, element, subject) {
        __setAttribute(element, "style", "color", (function () {

          return {
            once: false,
            read: function () { return CmpxLib.toStr('red'); },
            write: null,
            event: null
          };
        }).call(componet), componet, subject);
        __createTextNode("sd   fsfsf", componet, element, subject);
      }, "");
    }, "");
    __createTextNode(" ", componet, element, subject);
    __createElement("script", [{ "name": "type", "value": "text/html", "subName": "" }], componet, element, subject, function (componet, element, subject) {
    }, "alert('aaa');");
  }, "");
  return function () { initViewvar.call(this, [{ name: "input1", p: input1, isL: false }, { name: "cpList", p: cpList, isL: true }]); };
}