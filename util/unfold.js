define([
  "../config",
  "when/when"
], function(config, when) {
  "use strict";

  var UNDEFINED;
  var LENGTH = "length";
  var CHILDREN = config.children;
  var COMPLETED = config.completed;
  var NODE = config.node;
  var COMPONENT = config.component;

  return function(method) {
    var args = arguments;
    var me = this;
    var node = me[NODE];

    // Get or create `children`
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN]
      : node[CHILDREN] = [];

    return when.unfold(function(index) {
      var child;

      // Find next child without a `COMPLETED` property
      do {
        child = children[index++];
      } while (child !== UNDEFINED && child.hasOwnProperty(COMPLETED));

      return [child, index];
    }, function(index) {
      // Check if we're out of bounds. Note that we allow _adding_ to `children` during `unfold`
      return index >= children[LENGTH];
    }, function(child) {
      if (child !== UNDEFINED) {
        return method.apply(child[COMPONENT](), args);
      }
    }, 0);
  }
});
