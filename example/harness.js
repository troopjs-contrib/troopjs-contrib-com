define([
	"troopjs-dom/component/widget",
	"../node/weave",
	"../node/op/ready"
], function (Widget, weave, ready) {
	var $ELEMENT = "$element";

	return Widget.extend({
		"sig/start": function () {
			var me = this;

			return me
				.publish("ajax", {
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