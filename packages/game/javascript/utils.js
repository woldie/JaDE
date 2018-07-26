import isUndefined from "lodash.isundefined";

var Utils = {
  normalizeCoord: function(xy) {
    return Math.floor(xy / 32) * 32;
  },

  isTruthy: function(a) {
    return !isUndefined(a) && !!a;
  }
};

export default Utils;
