// SAMPLE ADDITIONAL SECTION MIXIN
define(function () {
  "use strict";

  const mixin = {
    getNoResultHtml: function ({html}) {
      return "";
    },

    getHeaderHtml: function ({section}) {
      return "";
    },

    getItemHtml: function ({item, components, html, section}) {
      return "";

    },

    getFooterHtml: function () {
      return "";
    }
  };

  return function (target) {
    return { ...target, ...mixin };
  };
});
