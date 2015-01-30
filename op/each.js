define([
  "../config",
  "when/when"
], function (config, when) {
  var ARRAY_SLICE = Array.prototype.slice;
  var NODE = config.node;
  var CHILDREN = config.children;
  var COMPONENT = config.component;
  var COMPLETED = config.completed;

  return function each(method) {
    var me = this;
    var node = me[NODE];
    var args = ARRAY_SLICE.call(arguments, 1);
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN]
      : node[CHILDREN] = [];

    return when.map(children, function (child) {
      var component = child[COMPONENT]();

      return child.hasOwnProperty(COMPLETED)
        ? component
        : method
          .apply(component, args)
          .yield(component);
    });
  }
});