define(function () {
	var PHASE = "phase";

	return function() {
		var me = this;

		me[PHASE] = "finalize";

		return me
			.signal("finalize")
			.tap(function() {
				me[PHASE] = "finalized";
			});
	}
});