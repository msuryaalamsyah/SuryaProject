// SAMPLE CATEGORIES MIXIN
define(function () {
  "use strict";

  const mixin = {
    getNoResultHtml: function ({html}) {
      return "";
    },
    getHeaderHtml: function () {
      return "";
    },
    getItemHtml: function ({item, components, html}) {
      return "";
    },
  };

  return function (target) {
    return { ...target, ...mixin };
  };
});
