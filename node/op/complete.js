define([
	"./start",
	"when"
], function (start, when) {
	return function complete(completed) {
		var me = this;

		return when(start.call(me), function (phase) {
			if (phase === "started") {
				return me
					.signal("complete", completed)
					.yield(phase);
			}
			else {
				return phase;
			}
		});
	}
});