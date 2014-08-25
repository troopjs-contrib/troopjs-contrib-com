define([
	"./config",
	"./initialize",
	"./finalize",
	"require",
	"when"
], function (config, initialize, finalize, localRequire, when) {
	var TYPE = config.type;
	var CHILDREN = config.children;
	var COMPLETED = config.completed;

	function isRequireError(error) {
		return error.hasOwnProperty("requireType");
	}

	/**
	 * Recursively weaves node structure
	 * @param {Object} node
	 * @param {Object} parent
	 * @return {Promise}
	 */
	return function weave(node, parent, completed) {
		var me = this;

		// Calculate completed if needed
		completed = completed === true || node.hasOwnProperty(COMPLETED);

		return when
			.promise(function (resolve, reject) {
				// Use a local version of require to load the class. The node
				// type has to either be a fully qualified module name or a map
				// entry has to be added to the require configuration
				localRequire([ node[TYPE] ], resolve, reject);
			})
			// Create instance
			.then(function (Component) {
				return Component(node, parent);
			})
			// Signal initialize
			.tap(function (component) {
				return initialize.call(component);
			})
			// Recursively weave children
			.tap(function () {
				return when.all(when.map(node[CHILDREN] || false, function (child) {
					return weave.call(me, child, node, completed);
				}));
			})
			// If this node or any ancestor is completed we should just finalize right away
			.tap(function (component) {
				if (completed) {
					return finalize.call(component);
				}
			})
			.catch(isRequireError, function (error) {
				me.error("Unable to load module(s) %o in context %s because of %s. Related node was %o", error.requireModules, error.contextName, error.requireType, node);
			});
	}
});