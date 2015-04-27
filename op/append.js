define([
  "../config",
  "../weave"
], function(config, weave) {
  "use strict";

  var NODE = config.node;
  var CHILDREN = config.children;

  /**
   * Appends child
   * @param {Object} child
   * @returns {Promise}
   * @ignore
   */
  return function (child) {
    var me = this;
    var node = me[NODE];

    // If node has `CHILDREN` ...
    if (node.hasOwnProperty(CHILDREN)) {
      // ... append child ...
      node[CHILDREN].push(child);
    }
    // ... otherwise ...
    else {
      // ... Let `node[CHILDREN]` be `[ child ]`
      node[CHILDREN] = [ child ];
    }

    // Call and return weave
    return weave.call(me, child, node);
  };
});
