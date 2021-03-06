define([
	"./stop",
	"when"
], function (stop, when) {
	var ARRAY_PUSH = Array.prototype.push;
	var PHASE = "phase";

	return function finalize() {
		var me = this;
		var args = arguments;

		return when(stop.apply(me, args), function (phase) {
			var _args;
			if (phase === "stopped") {
				// Let `me[PHASE]` be `"finalize"`
				// Let `_args` be `[ "finalize" ]`
				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args = [ me[PHASE] = "finalize" ], args);

				return me
					.signal.apply(me, _args)
					.then(function() {
						// Let `me[PHASE]` be `"finalized"`
						return me[PHASE] = "finalized";
					});
			}
			else {
				return phase;
			}
		});
	}
});