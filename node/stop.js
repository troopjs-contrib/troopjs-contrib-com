define(function () {
	var PHASE = "phase";

	return function() {
		var me = this;

		me[PHASE] = "stopping";

		return me
			.signal("stop")
			.then(function() {
				me[PHASE] = "finalize";

				return me
					.signal("finalize")
					.then(function () {
						return me[PHASE] = "finalized";
					});
			});
	}
});