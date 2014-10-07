define([
	"./start",
	"when"
], function (start, when) {
	var ARRAY_PUSH = Array.prototype.push;

	return function complete() {
		var me = this;
		var args = arguments;

		return when(start.apply(me, args), function (phase) {
			var _args;

			if (phase === "started") {
				// Let `_args` be `[ "complete" ]`
				_args = [ "complete" ];

				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args, args);

				return me
					.signal.apply(me, _args)
					.yield(phase);
			}
			else {
				return phase;
			}
		});
	}
});