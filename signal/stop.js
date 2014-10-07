define([
	"./start",
	"when",
], function (start, when) {
	var PHASE = "phase";

	return function stop() {
		var me = this;

		return when(start.call(me), function (phase) {
			if (phase === "started") {
				me[PHASE] = "stop";

				return me
					.signal("stop")
					.then(function () {
						return me[PHASE] = "stopped";
					});
			}
			else {
				return phase;
			}
		});
	}
});