define([
	"../widget"
], function (Widget) {
	return Widget.extend({
		"sig/ready": function () {
			var me = this;

			me.log("start wait");

			return this
				.yield()
				.then(function () {
					return me.finish();
				})
				.then(function () {
					me.log("stop wait");
				});
		}
	});
});