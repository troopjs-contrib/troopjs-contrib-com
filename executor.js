define([
  "troopjs-core/config",
  "when/when"
], function (core_config, when) {
  "use strict";

  var UNDEFINED;
  var FALSE = false;
  var TRUE = true;
  var TYPE = core_config.emitter.type;
  var HEAD = core_config.emitter.head;
  var NEXT = core_config.emitter.next;
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

  return function (event, handlers, args) {
    var length = args.length;
    var handler;
    var _event = new COMEvent();
    var _args = new Array(length);
    var _handlers = [];
    var _handlersCount = 0;

    while (length) {
      _args[length] = args[--length];
    }

    _args[0] = _event;

    _event[TARGET] = event[TARGET];
    _event[TYPE] = event[TYPE];

    for (handler = handlers[HEAD]; handler !== UNDEFINED; handler = handler[NEXT]) {
      _handlers[_handlersCount++] = handler;
    }

    return when.reduce(_handlers, function (result, _handler) {
      if (!_event.isImmediatePropagationStopped()) {
        result = when(_handler.handle(_args), function (_result) {
          if (_result === FALSE) {
            _event.stopPropagation();
          }

          return !_event.isPropagationStopped();
        });
      }

      return result;
    }, UNDEFINED);
  };
});
