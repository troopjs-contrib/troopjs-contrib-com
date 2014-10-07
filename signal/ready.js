define([
	"./start",
	"when"
], function (start, when) {
	var ARRAY_PUSH = Array.prototype.push;

	return function ready() {
		var me = this;
		var args = arguments;

		return when(start.apply(me, args), function (phase) {
			var _args;

			if (phase === "started") {
				// Let `_args` be `[ "ready" ]`
				_args = [ "ready" ];

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