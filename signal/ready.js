define([
	"./start",
	"when"
], function (start, when) {
	return function ready() {
		var me = this;

		return when(start.call(me), function (phase) {
				if (phase === "started") {
					return me
						.signal("ready")
						.yield(phase);
				}
				else {
					return phase;
				}
			});
	}
});