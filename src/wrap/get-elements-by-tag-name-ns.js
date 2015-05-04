export default {
  value: function (tagNameNS) {
    return this.__node.getElementsByTagNameNS(tagNameNS);
  }
};
