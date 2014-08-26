define(function () {
	var PHASE = "phase";

	return function finalize() {
		var me = this;

		me[PHASE] = "finalizing";

		return me
			.signal("finalize")
			.tap(function() {
				me[PHASE] = "finalized";
			});
	}
});