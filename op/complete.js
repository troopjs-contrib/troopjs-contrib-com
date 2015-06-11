define([
  "troopjs-core/component/signal/finalize",
  "../config",
  "../util/unfold"
], function(finalize, config, unfold) {
  "use strict";

  var UNDEFINED;
  var LENGTH = "length";
  var COMPLETE = "complete";
  var CHILDREN = config.children;
  var COMPLETED = config.completed;
  var NODE = config.node;
  var COMPONENT = config.component;

  /**
   * Completes children and self
   * @param {*} completed
   * @return {Promise}
   * @triggers complete
   */
  function complete(completed) {
    var me = this;
    var node = me[NODE];
    var length = arguments[LENGTH];
    var trigger = length > 0;
    var args = [complete];

    while (length--) {
      args[length + 1] = _arguments[length];
    }

    // Get or create `children`
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN]
      : node[CHILDREN] = [];

    return unfold.call(me, complete)
      .tap(function() {
        return trigger
          ? me.trigger(COMPLETE, node[COMPLETED] = completed)
          : me.trigger(COMPLETE);
      })
      .tap(function() {
        return finalize.apply(me, args);
      });
  }

  return complete;
});
