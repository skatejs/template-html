import decide from '../util/decide';

export default {
  get: decide(
    function (data) {
      return data.node.previousSibling;
    },

    function (data) {
      return data.node.previousSibling;
    }
  )
};
