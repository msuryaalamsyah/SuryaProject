// SAMPLE SUGGESTIONS MIXIN
define(function () {
  "use strict";

  const mixin = {

  };

  return function (target) {
    return { ...target, ...mixin };
  };
});
