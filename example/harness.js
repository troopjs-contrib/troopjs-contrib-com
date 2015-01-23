define([
	"troopjs-dom/component",
	"troopjs-core/pubsub/hub",
	"../weave",
	"../signal/ready"
], function (Widget, hub, weave, ready) {
	var $ELEMENT = "$element";

	return Widget.extend({
		"sig/start": function () {
			var me = this;

			return hub
				.emit("ajax", {
					"url": "./data.json"
				})
				.spread(function (data) {
					// Weave
					return weave.call(me, data);
				})
				.tap(function (widget) {
					// Append to me
					widget[$ELEMENT].appendTo(me[$ELEMENT]);

					// Signal and return
					return ready.call(widget);
				});
		}
	});
});