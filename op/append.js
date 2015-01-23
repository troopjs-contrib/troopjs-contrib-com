define([
	"../config",
	"../weave"
], function(config, weave) {
	var NODE = config.node;
	var CHILDREN = config.children;

	/**
	 * Appends child
	 * @param {Object} child
	 * @returns {Promise}
	 * @ignore
	 */
	return function append(child) {
		var me = this;
		var node = me[NODE];

		// If node has `CHILDREN` ...
		if (CHILDREN in node) {
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
	}
});