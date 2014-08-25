define([
	"module",
	"troopjs-util/merge"
], function (module, merge) {
	return merge.call({
		"type": "@type",
		"components": "@children",
		"completed": "@completed"
	}, module.config());
});