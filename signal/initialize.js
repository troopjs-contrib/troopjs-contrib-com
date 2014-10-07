define([ "when" ], function (when) {
	var UNDEFINED;
	var ARRAY_PUSH = Array.prototype.push;
	var PHASE = "phase";

	return function initialize() {
		var me = this;
		var args = arguments;

		return when(me[PHASE], function (phase) {
			var _args;

			if (phase === UNDEFINED) {
				// Let `_args` be `[ "initialize" ]`
				// Let `me[PHASE]` be `"initialize"`
				_args = [ me[PHASE] = "initialize" ];

				// Push `args` on `_args`
				ARRAY_PUSH.apply(_args, args);

				return me
					.signal.apply(me, _args)
					.then(function() {
						// Let `me[PHASE]` be `"initialized"`
						return me[PHASE] = "initialized";
					});
			}
			else {
				return phase;
			}
		});
	}
});