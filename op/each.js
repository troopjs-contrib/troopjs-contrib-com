define([
  "../config",
  "when/when"
], function (config, when) {
  "use strict";

  var NODE = config.node;
  var CHILDREN = config.children;
  var COMPONENT = config.component;
  var COMPLETED = config.completed;

  return function (method) {
    var me = this;
    var length = arguments.length;
    var args = new Array(length);
    var node = me[NODE];
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN]
      : node[CHILDREN] = [];

    while(length--) {
      args[length] = arguments[length];
    }

    return when.map(children, function (child) {
      var component = child[COMPONENT]();

      return child.hasOwnProperty(COMPLETED)
        ? component
        : method
          .apply(component, args)
          .yield(component);
    });
  };
});
