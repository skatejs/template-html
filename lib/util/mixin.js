(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "module"], factory);
  } else if (typeof exports !== "undefined" && typeof module !== "undefined") {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.unknown = mod.exports;
  }
})(this, function (exports, module) {
  "use strict";

  module.exports = function (proto, parent) {
    Object.keys(parent).forEach(function (key) {
      parent[key].configurable = true;
      Object.defineProperty(proto, key, parent[key]);
    });
    return proto;
  };
});