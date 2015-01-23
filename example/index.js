require.config({
	"baseUrl": "../bower_components",
	"packages": [{
		"name": "jquery",
		"location": "jquery/dist",
		"main": "jquery.min"
	}, {
		"name": "troopjs-contrib-com",
		"location": ".."
	}],

	"deps": [ "jquery", "require", "troopjs/main", "troopjs-widget/main" ],

	"map": {
    "troopjs-contrib-com/weave": {
      "root": "troopjs-contrib-com/example/root/widget",
      "dialog": "troopjs-contrib-com/example/dialog/widget"
    }
  },

	"callback": function (jQuery, localRequire) {
		localRequire([ "troopjs-widget/application", "troopjs-ajax/service" ], function (Application, AjaxService) {
			jQuery(function ($) {
				Application($("html"), "application", AjaxService()).start();
			});
		});
	}
});