require({
	"packages": [
		{
			"name": "jquery",
			"location": "bower_components/jquery/dist",
			"main": "jquery"
		},
		{
			"name": "poly",
			"location": "bower_components/poly",
			"main": "es5"
		},
		{
			"name": "when",
			"location": "bower_components/when",
			"main": "when"
		},
		{
			"name": "requirejs-text",
			"location": "bower_components/requirejs-text"
		},
		{
			"name": "troopjs",
			"location": "bower_components/troopjs",
			"main": "maxi"
		},
		{
			"name": "troopjs-contrib-com",
			"location": "."
		}
	],

	"map": {
		"*": {
			"json": "troopjs-requirejs/json",
			"text": "requirejs-text/text"
		},
		"node/weave": {
			"root": "example/root/widget",
			"dialog": "example/dialog/widget"
		}
	},

	"deps": [
		"require",
		"jquery",
		"troopjs"
	],

	"callback": function (localRequire, jQuery) {
		localRequire([
			"troopjs-dom/application/widget",
			"troopjs-net/ajax/service"
		], function (Application, AjaxService) {
			jQuery(function ($) {
			Application($("html"), "bootstrap", AjaxService()).start();
			});
		});
	}
});