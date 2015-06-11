define([
  "../config",
  "when/when"
], function(config, when) {
  "use strict";

  var NODE = config.node;
  var CHILDREN = config.children;

  return function(method) {
    var me = this;
    var node = me[NODE];

    return when.filter(node.hasOwnProperty(CHILDREN) ? node[CHILDREN] : node[CHILDREN] = [], method);
  };
});
