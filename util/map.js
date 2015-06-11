define([
  "../config",
  "when/when"
], function(config, when) {
  "use strict";

  var NODE = config.node;
  var CHILDREN = config.children;
  var COMPONENT = config.component;
  var COMPLETED = config.completed;

  return function(method) {
    var me = this;
    var length = arguments.length - 1;
    var args = new Array(length);
    var node = me[NODE];
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN].filter(function(child) {
        return !child.hasOwnProperty(COMPLETED);
      })
      : node[CHILDREN] = [];

    while (length--) {
      args[length] = arguments[length + 1];
    }

    return when.map(children, function(child) {
      return method.apply(child[COMPONENT](), args)
    });
  };
});
