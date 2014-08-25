define([
	"troopjs-dom/component/widget",
	"../node/weave",
	"../node/op/start"
], function (Widget, weave, start) {
	var $ELEMENT = "$element";

	return Widget.extend({
		"sig/start": function () {
			var me = this;

			return me
				.publish("ajax", {
					"url": "./data.json"
				})
				.spread(function (data) {
					return weave.call(me, data);
				})
				.tap(function (widget) {
					widget[$ELEMENT].appendTo(me[$ELEMENT]);

					return start.call(widget);
				});
		}
	});
});