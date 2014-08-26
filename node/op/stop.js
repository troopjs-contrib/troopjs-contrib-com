define([ "./finalize" ], function (finalize) {
	var PHASE = "phase";

	return function stop() {
		var me = this;

		me[PHASE] = "stopping";

		return me
			.signal("stop")
			.then(function() {
				return finalize.call(me);
			});
	}
});