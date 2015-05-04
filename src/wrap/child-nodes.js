import content from '../util/content';
import query from '../util/query';

function wrapped (that) {
  return content.get(that).reduce(function (prev, curr) {
    return prev.concat(curr.isDefault ? [] : query.between(curr.startNode, curr.endNode).map(function (node) {
      return node.__wrapper;
    }));
  }, []);
}

function unwrapped (that) {
  var nodes = [];
  var chNodes = that.__node.childNodes;
  var chNodesLen = chNodes.length;

  for (let a = 0; a < chNodesLen; a++) {
    nodes.push(chNodes[a].__wrapper);
  }

  return nodes;
}

export default {
  get: function () {
    return this.__wrapped ? wrapped(this) : unwrapped(this);
  }
};
