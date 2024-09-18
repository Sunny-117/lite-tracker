(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (factory());
}(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) return r;
  }
  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _slicedToArray(r, e) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
  }
  function _unsupportedIterableToArray(r, a) {
    if (r) {
      if ("string" == typeof r) return _arrayLikeToArray(r, a);
      var t = {}.toString.call(r).slice(8, -1);
      return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
    }
  }

  var errCatch = {
    init: function init(cb) {
      // window.addEventListener('error',fn,true)
      // promise失败了不能通过 onerror  .... 捕获promise错误
      window.onerror = function (message, source, lineno, colno, error) {
        console.dir(error);
        var info = {
          message: error.message,
          name: error.name
        };
        var stack = error.stack;
        var matchUrl = stack.match(/http:\/\/[^\n]*/)[0];
        console.log(matchUrl);
        info.filename = matchUrl.match(/http:\/\/(?:\S*)\.js/)[0];
        this.console.log(info.filename);
        var _matchUrl$match = matchUrl.match(/:(\d+):(\d+)/),
          _matchUrl$match2 = _slicedToArray(_matchUrl$match, 3),
          row = _matchUrl$match2[1],
          colume = _matchUrl$match2[2];
        info.row = row;
        info.colume = colume; // 上线的时候代码会压缩 source-map 找到对应的真实的报错
        cb(info);
      };
    }
  };

  // 1）我们要监控页面的性能 -  算时间差 Performance Api
  errCatch.init(function (data) {
    console.log(data);
  });
  // 监控用户的行为

  // 1.通过ajax   2.通过image

})));
