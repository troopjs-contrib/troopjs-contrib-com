define([
  "../config",
  "../weave"
], function(config, weave) {
  "use strict";

  var PARENT = config.parent;
  var COMPONENT = config.component;
  var CHILDREN = config.children;

  /**
   * Replaces component
   * @param {Object} component
   * @returns {Promise}
   * @ignore
   */
  return function (node) {
    var me = this;
    var parent = me[PARENT]();

    // Get or create parent[CHILDREN]
    var children = parent.hasOwnProperty(CHILDREN)
      ? parent[CHILDREN]
      : parent[CHILDREN] = [];

    // Add node to children
    children.splice(children.indexOf(me), 1, node);

    // Call and return weave
    return weave.call(parent[COMPONENT](), node, parent);
  };
});
