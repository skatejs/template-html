'use strict';

import decide from '../util/decide';
import query from '../util/query'

export default {
  get: decide(
    function (data) {
      return data.content.reduce(function (prev, curr) {
        return prev.concat(curr.isDefault ? [] : query.between(curr.startNode, curr.endNode).map(function (node) {
          return node.__wrapper;
        }));
      }, []);
    },

    function (opts) {
      var nodes = [];
      var chNodes = opts.node.childNodes;
      var chNodesLen = chNodes.length;

      for (let a = 0; a < chNodesLen; a++) {
        nodes.push(chNodes[a].__wrapper);
      }

      return nodes;
    }
  )
};
