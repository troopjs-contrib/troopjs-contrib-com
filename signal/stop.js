define([
	"./complete",
	"troopjs-core/config",
	"when/when"
], function (complete, config, when) {
	var ARRAY_PUSH = Array.prototype.push;
	var PHASE = "phase";
	var STARTED = config.phase.started;
	var STOP = config.phase.stop;
	var STOPPED = config.phase.stopped;
	var SIG_STOP = config.signal.stop;

	return function stop() {
		var me = this;
		var args = arguments;

		return when(complete.apply(me, args), function (phase) {
			var _args;

			if (phase === STARTED) {
				// Let `me[PHASE]` be `STOP`
				me[PHASE] = STOP;

				// Let `_args` be `[ SIG_STOP ]`
				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args = [ SIG_STOP ], args);

				return me
					.emit.apply(me, _args)
					.then(function() {
						// Let `me[PHASE]` be `STOPPED`
						return me[PHASE] = STOPPED;
					});
			}
			else {
				return phase;
			}
		});
	}
});