define([
	"./initialize",
	"when"
], function (initialize, when) {
	var ARRAY_PUSH = Array.prototype.push;
	var PHASE = "phase";

	return function start() {
		var me = this;
		var args = arguments;

		return when(initialize.apply(me, args), function (phase) {
			var _args;

			if (phase === "initialized") {
				// Let `_args` be `[ "start" ]`
				// Let `me[PHASE]` be `"start"`
				_args = [ me[PHASE] = "start" ];

				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args, args);

				return me
					.signal.apply(me, _args)
					.then(function() {
						// Let `me[PHASE]` be `"started"`
						return me[PHASE] = "started";
					});
			}
			else {
				return phase;
			}
		});
	}
});