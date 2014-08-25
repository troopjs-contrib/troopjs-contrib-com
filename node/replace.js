define([
	"./config",
	"./weave"
], function(config, weave) {
	var CHILDREN = config.children;

	/**
	 * Replaces component
	 * @param {Object} component
	 * @returns {Promise}
	 * @ignore
	 */
	return function replace(node) {
		var me = this;
		var parent = me.parent();

		// Get children
		var nodes = parent[CHILDREN];

		// Add node to nodes
		nodes.splice(nodes.indexOf(me), 1, node);

		// Call and return weave
		return weave.call(parent.component(), node, parent);
	}
});