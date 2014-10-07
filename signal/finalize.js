define([
	"./stop",
	"when"
], function (stop, when) {
	var PHASE = "phase";

	return function finalize() {
		var me = this;

		return when(stop.call(me), function (phase) {
			if (phase === "stopped") {
				me[PHASE] = "finalize";

				return me
					.signal("finalize")
					.then(function() {
						return me[PHASE] = "finalized";
					});
			}
			else {
				return phase;
			}
		});
	}
});