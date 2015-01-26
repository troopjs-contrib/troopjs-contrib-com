define([
  "../config",
  "troopjs-core/component/signal/finalize",
  "when/when"
], function (config, finalize, when) {

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
  return function complete(completed) {
    var args = arguments;
    var me = this;
    var node = me[NODE];

    // Get or create `children`
    var children = node.hasOwnProperty(CHILDREN)
      ? node[CHILDREN]
      : node[CHILDREN] = [];

    return when
      .unfold(function (index) {
        var child;

        // Find next child without a `COMPLETED` property
        do {
          child = children[ index++ ];
        }
        while (child !== UNDEFINED && child.hasOwnProperty(COMPLETED));

        return [ child, index ];
      }, function (index) {
        // Check if we're out of bounds. Note that we allow _adding_ to `children` during `unfold`
        return index >= children[LENGTH];
      }, function (child) {
        if (child !== UNDEFINED) {
          return complete.call(child[COMPONENT]());
        }
      }, 0)
      .tap(function () {
        return args[LENGTH] > 0
          ? me.trigger(COMPLETE, node[COMPLETED] = completed)
          : me.trigger(COMPLETE);
      })
      .tap(function () {
        return finalize.call(me);
      });
  }
});