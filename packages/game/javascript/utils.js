var Utils = {
  normalizeCoord: function(xy) {
    return Math.floor(xy / 32) * 32;
  }
};

export default Utils;
