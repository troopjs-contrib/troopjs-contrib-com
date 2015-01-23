define([ "when/when" ], function (when) {
	var UNDEFINED;
	var FALSE = false;
	var TRUE = true;
	var ARRAY_PUSH = Array.prototype.push;
	var TYPE = "type";
	var HEAD = "head";
	var NEXT = "next";
	var CALLBACK = "callback";
	var CONTEXT = "context";
	var TARGET = "target";
	var IMMEDIATE_PROPAGATION_STOPPED = "immediatePropagationStopped";
	var PROPAGATION_STOPPED = "propagationStopped";

	function COMEvent() {
		var me = this;

		me[IMMEDIATE_PROPAGATION_STOPPED] = FALSE;
		me[PROPAGATION_STOPPED] = FALSE;
	}

	COMEvent.prototype = {
		"isImmediatePropagationStopped": function () {
			return this[IMMEDIATE_PROPAGATION_STOPPED];
		},

		"isPropagationStopped": function () {
			return this[PROPAGATION_STOPPED];
		},

		"stopImmediatePropagation": function () {
			var me = this;

			me[IMMEDIATE_PROPAGATION_STOPPED] = TRUE;

			me.stopPropagation();
		},

		"stopPropagation": function () {
			this[PROPAGATION_STOPPED] = TRUE;
		}
	};

	return function sequence(event, handlers, args) {
		var _event = new COMEvent();
		var _args = [ _event ];
		var candidates = [];
		var candidate;
		var candidatesCount = 0;

		_event[TARGET] = event[TARGET];
		_event[TYPE] = event[TYPE];

		ARRAY_PUSH.apply(_args, args);

		for (candidate = handlers[HEAD]; candidate !== UNDEFINED; candidate = candidate[NEXT]) {
			candidates[candidatesCount++] = candidate;
		}

		return when.reduce(candidates, function (result, handler) {
			if (!_event.isImmediatePropagationStopped()) {
				result = when(handler[CALLBACK].apply(handler[CONTEXT], _args), function (_result) {
					if (_result === FALSE) {
						_event.stopPropagation();
					}

					return !_event.isPropagationStopped();
				});
			}

			return result;
		}, UNDEFINED);
	}
});