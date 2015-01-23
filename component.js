define([
	"troopjs-core/component/emitter",
	"./config",
	"./runner",
	"troopjs-core/component/signal/start",
	"./signal/ready",
	"troopjs-core/component/signal/finalize",
	"when/when"
], function (Component, config, runner, start, ready, finalize, when) {

	/**
	 * Base component for widgets attached to the node
	 * structure.
	 *
	 * @class com.component
	 * @extend core.component.base
	 */

	var UNDEFINED;
	var LENGTH = "length";
	var CHILDREN = config.children;
	var COMPLETED = config.completed;
	var NODE = config.node;
	var PARENT = config.parent;
	var COMPONENT = config.component;

	return Component.extend(
		/**
		 * Creates a new node widget
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
			},

			/**
			 * Yields control to child components.
			 * Control is passed in sequence.
			 * @returns {Promise}
			 * @fires sig/ready
			 */
			"yield": function () {
				var me = this;
				var node = me[NODE];

				// Get or create `children`
				var children = node.hasOwnProperty(CHILDREN)
					? node[CHILDREN]
					: node[CHILDREN] = [];

				return when.unfold(function (index) {
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
						return ready.call(child[COMPONENT]());
					}
				}, 0);
			},

			/**
			 * Completes children and self
			 * @param {*} completed
			 * @return {Promise}
			 * @fires sig/complete
			 */
			"complete": function (completed) {
				var args = arguments;
				var callee = args.callee;
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
							return callee.call(child[COMPONENT]());
						}
					}, 0)
					.tap(function () {
						return args[LENGTH] > 0
							? finalize.call(me, node[COMPLETED] = completed)
							: finalize.call(me);
					});
			}
		}
	);
});