define([
  "troopjs-core/component/signal/start",
  "troopjs-core/config",
  "when/when"
], function(start, config, when) {
  "use strict";

  var ARRAY_PUSH = Array.prototype.push;
  var STARTED = config.phase.started;
  var SIG_COMPLETE = "sig/complete";

  return function() {
    var me = this;
    var args = arguments;

    return when(start.apply(me, args), function(phase) {
      var _args;

      if (phase === STARTED) {

        // Let `_args` be `[ SIG_COMPLETE ]`
        // Push `args` on `_args`
        ARRAY_PUSH.apply(_args = [SIG_COMPLETE], args);

        return me.emit.apply(me, _args)
          .yield(phase);
      } else {
        return phase;
      }
    });
  };
});
