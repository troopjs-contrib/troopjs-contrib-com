define([ "./config" ], function (config) {
		var NODE = config.node;
		var PARENT = config.parent;
		var COMPONENT = config.component;

		/**
		 * Creates a new node widget
		 * @method constructor
		 * @param {Object} node Component node
		 * @param {Object} parent Component parent node
		 * @inheritdoc
		 */
		return function (node, parent) {
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
		}
});