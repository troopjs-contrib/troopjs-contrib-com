define([
	"troopjs-core/component/signal/start",
	"troopjs-core/config",
	"when/when"
], function (start, config, when) {
	var ARRAY_PUSH = Array.prototype.push;
	var STARTED = config.phase.started;

	return function complete() {
		var me = this;
		var args = arguments;

		return when(start.apply(me, args), function (phase) {
			var _args;

			if (phase === STARTED) {
				// Let `_args` be `[ "complete" ]`
				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args = [ "sig/complete" ], args);

				return me
					.emit.apply(me, _args)
					.yield(phase);
			}
			else {
				return phase;
			}
		});
	}
});