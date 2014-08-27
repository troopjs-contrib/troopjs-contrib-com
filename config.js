define([
	"module",
	"troopjs-util/merge"
], function (module, merge) {
	return merge.call({
		"type": "@type",
		"children": "@children",
		"completed": "@completed",
		"node": "node",
		"parent": "parent",
		"component": "component"
	}, module.config());
});