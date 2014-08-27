define([ "when" ], function (when) {
	var PHASE = "phase";

	return function finalize() {
		var me = this;

		return when(me[PHASE], function (phase) {
			if (phase === "stopped") {
				me[PHASE] = "finalizing";

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