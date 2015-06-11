define([
  "troopjs-core/component/signal/finalize",
  "../config",
  "../signal/complete",
  "../util/unfold"
], function(finalize, config, complete, unfold) {
  "use strict";

  var UNDEFINED;
  var LENGTH = "length";
  var COMPLETE = "complete";
  var CHILDREN = config.children;
  var COMPLETED = config.completed;
  var NODE = config.node;
  var COMPONENT = config.component;

  /**
   * Finishes children and self
   * @param {*} completed
   * @return {Promise}
   */
  return function(completed) {
    var me = this;
    var node = me[NODE];
    var length = arguments[LENGTH];
    var signal = length > 0;
    var args = [arguments.callee];

    while (length--) {
      args[length + 1] = arguments[length];
    }

    // Get or create `children`
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN]
      : node[CHILDREN] = [];

    return unfold.apply(me, args)
      .tap(function() {
        var result;

        if (signal) {
          args[0] = node[COMPLETED] = completed;

          result = complete.apply(me, args);
        } else {
          result = complete.call(me);
        }

        return result;
      })
      .tap(function() {
        var _length = args[LENGTH] - 1;
        var _args = new Array(length);

        while (_length--) {
          _args[_length] = args[_length - 1];
        }

        return finalize.apply(me, _args);
      });
  }
});
