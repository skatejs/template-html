export default function (proto, parent) {
  Object.keys(parent).forEach(function (key) {
    parent[key].configurable = true;
    Object.defineProperty(proto, key, parent[key]);
  });
  return proto;
}
