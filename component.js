define([
	"troopjs-core/component/emitter",
	"./config",
	"./runner",
	"when/when"
], function (Component, config, runner, when) {

	/**
	 * Base component for components attached to the node
	 * structure.
	 *
	 * @class com.component
	 * @extend core.component.base
	 */

	var UNDEFINED;
	var NODE = config.node;
	var PARENT = config.parent;
	var COMPONENT = config.component;

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
				var args = arguments;
				var bubble = true;

				// Change first argument so we can use custom run logic
				args[0] = {
					"type": type,
					"runner": runner,
					"target": me
				};

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
				var args = arguments;

				// Change first argument so we can use custom run logic
				args[0] = {
					"type": type,
					"runner": runner,
					"target": me
				};

				return me.emit.apply(me, args);
			}
		}
	);
});