define([
	"./initialize",
	"when"
], function (initialize, when) {
	var PHASE = "phase";

	return function start() {
		var me = this;

		return when(initialize.call(me), function (phase) {
			if (phase === "initialized") {
				me[PHASE] = "starting";

				return me
					.signal("start")
					.then(function() {
						return me[PHASE] = "started";
					});
			}
			else {
				return phase;
			}
		});
	}
});