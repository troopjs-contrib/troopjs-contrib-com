define([ "when" ], function (when) {
	var UNDEFINED;
	var PHASE = "phase";

	return function initialize() {
		var me = this;

		return when(me[PHASE], function (phase) {
			if (phase === UNDEFINED) {
				me[PHASE] = "initializing";

				return me
					.signal("initialize")
					.then(function() {
						return me[PHASE] = "initialized";
					});
			}
			else {
				return phase;
			}
		});
	}
});