define([
	"./finalize",
	"when"
], function (finalize, when) {
	var PHASE = "phase";

	return function stop() {
		var me = this;

		return when(me[PHASE], function (phase) {
			if (phase === "started") {
				me[PHASE] = "stopping";

				return me
					.signal("stop")
					.then(function () {
						return me[PHASE] = "stopped";
					});
			}
			else {
				return phase;
			}
		})
		.then(function () {
			return finalize.call(me);
		});
	}
});