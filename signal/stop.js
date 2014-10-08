define([
	"./complete",
	"when"
], function (complete, when) {
	var ARRAY_PUSH = Array.prototype.push;
	var PHASE = "phase";

	return function stop() {
		var me = this;
		var args = arguments;

		return when(complete.apply(me, args), function (phase) {
			var _args;

			if (phase === "started") {
				// Let `me[PHASE]` be `"stop"`
				// Let `_args` be `[ "stop" ]`
				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args = [ me[PHASE] = "stop" ], args);

				return me
					.signal.apply(me, _args)
					.then(function () {
						// Let `me[PHASE]` be `"stopped"`
						return me[PHASE] = "stopped";
					});
			}
			else {
				return phase;
			}
		});
	}
});