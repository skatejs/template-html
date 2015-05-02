import decide from '../util/decide';

export default {
  get: decide(
    function (data) {
      return data.node.nextSibling;
    },

    function (data) {
      return data.node.nextSibling;
    }
  )
};
