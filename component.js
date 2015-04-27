define([
  "troopjs-core/component/emitter",
  "troopjs-core/config",
  "./config",
  "./executor",
  "when/when"
], function (Component, core_config, com_config, executor, when) {
  "use strict";

  /**
   * Base component for components attached to the node
   * structure.
   *
   * @class com.component
   * @extend core.component.base
   */

  var UNDEFINED;
  var NODE = com_config.node;
  var PARENT = com_config.parent;
  var COMPONENT = com_config.component;
  var TYPE = core_config.emitter.type;
  var EXECUTOR = core_config.emitter.executor;
  var LENGTH = "length";
  var TARGET = "target";

  return Component.extend(
    /**
     * Creates a new node component
     * @method constructor
     * @param {Object} node Component node
     * @param {Object} parent Component parent node
     * @inheritdoc
     */
    function (node, parent) {
      var me = this;

      // Store `parent` on node
      node[PARENT] = function () {
        return parent;
      };

      // Store `component` on node
      node[COMPONENT] = function () {
        return me;
      };

      /**
       * Data node
       * @property {Object} node
       * @readonly
       * @protected
       */
      me[NODE] = node;
    },
    {
      /**
       * Simulates jQuery.trigger, but traverses node structure
       * rather than the DOM structure.
       * @returns {Promise}
       */
      "trigger": function (type) {
        var me = this;
        var length = arguments[LENGTH];
        var args = new Array(length);
        var bubble = true;

        while (length-- > 1) {
          args[length] = arguments[length];
        }

        // Change first argument so we can use custom run logic
        var event = args[0] = {};
        event[TYPE] = type;
        event[EXECUTOR] = executor;
        event[TARGET] = me;

        return when.iterate(
          function (node) {
            return node[PARENT]();
          },
          function (node) {
            return bubble === false || node === UNDEFINED;
          },
          function (node) {
            var component = node[COMPONENT]();

            return component.emit.apply(component, args).tap(function (result) {
              bubble = result !== false;
            });
          },
          me[NODE]);
      },

      /**
       * Simulates jQuery.triggerHandler.
       * @returns {Promise}
       */
      "triggerHandler": function (type) {
        var me = this;
        var length = arguments[LENGTH];
        var args = new Array(length);

        while (length-- > 1) {
          args[length] = arguments[length];
        }

        // Change first argument so we can use custom run logic
        var event = args[0] = {};
        event[TYPE] = type;
        event[EXECUTOR] = executor;
        event[TARGET] = me;

        return me.emit.apply(me, args);
      }
    }
  );
});
