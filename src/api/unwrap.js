export default function (node) {
  node.__node.___wrapped = false;
  return node;
}
