define([
	"../widget",
	"jquery"
], function (Widget, $) {
	return Widget.extend({
		"sig/ready": function () {
			var me = this;

			return me.task(function (resolve) {
				$("<button>")
					.text("click me")
					.click(resolve)
					.appendTo(me.$element);
			})
		}
	});
});