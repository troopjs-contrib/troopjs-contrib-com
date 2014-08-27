define([
	"troopjs-core/component/base",
	"../config",
	"./runner/sequence",
	"./signal/start",
	"./signal/stop",
	"./signal/ready",
	"./signal/complete",
	"when"
], function (Component, config, runner, start, stop, ready, complete, when) {

	/**
	 * Base component for widgets attached to the node
	 * structure.
	 *
	 * @class com.component.gadget
	 * @extend dom.component.widget
	 */

	var UNDEFINED;
	var LENGTH = "length";
	var CHILDREN = config.children;
	var COMPLETED = config.completed;
	var NODE = config.node;
	var PARENT = config.parent;
	var COMPONENT = config.component;

	/**
	 * Creates a new node widget
	 * @method constructor
	 * @param {Object} node Node containing data for this widget
	 * @param {Object} parent Parent node for node
	 * @inheritdoc
	 */
	return Component.extend(function (node, parent) {
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
	}, {
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
		 * Yields control to child component widgets.
		 * Control is passed in sequence.
		 * @returns {Promise}
		 * @fires sig/ready
		 */
		"yield": function () {
			var me = this;
			var node = me[NODE];
			var children = node[CHILDREN] || (node[CHILDREN] = []);

			return when.unfold(function (index) {
				var child;

				do {
					child = children[ index++ ];
				}
				while (child !== UNDEFINED && child.hasOwnProperty(COMPLETED));

				return [ child, index ];
			}, function (index) {
				return index >= children[LENGTH];
			}, function (child) {
				if (child !== UNDEFINED) {
					return ready.call(child[COMPONENT]());
				}
			}, 0);
		},

		"finish": function (completed) {
			var me = this;
			var node = me[NODE];
			var children = node[CHILDREN] || (node[CHILDREN] = []);

			return when
				.unfold(function (index) {
					var child;

					do {
						child = children[ index++ ];
					}
					while (child !== UNDEFINED && child.hasOwnProperty(COMPLETED));

					return [ child, index ];
				}, function (index) {
					return index >= children[LENGTH];
				}, function (child) {
					if (child !== UNDEFINED) {
						return child[COMPONENT]().finish();
					}
				}, 0)
				.tap(function () {
					if (completed && !node.hasOwnProperty(COMPLETED)) {
						return complete.call(me, node[COMPLETED] = completed);
					}
				})
				.tap(function () {
					return stop.call(me);
				});
		},

		"sig/complete": function (completed) {
			return this.trigger("complete", completed);
		},

		/**
		 * @handler
		 * @inheritdoc
		 */
		"sig/initialize": function () {
			return this.trigger("initialize");
		},

		/**
		 * @handler
		 * @inheritdoc
		 */
		"sig/finalize": function () {
			return this.trigger("finalize");
		}
	});
});