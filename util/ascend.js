define([
  "../config",
  "when/when"
], function(config, when) {
  "use strict";

  var UNDEFINED;
  var FALSE = false;
  var FUNCTION_PROTOTYPE = Function.prototype;
  var NODE = config.node;
  var PARENT = config.parent;
  var COMPONENT = config.component;

  return function(method) {
    var me = this;
    var args = arguments;
    var length = args.length;
    var result = FALSE;

    return when
      .iterate(function(node) {
        return node[PARENT]();
      }, function(node) {
        var _args;
        var _length;

        if (node === UNDEFINED) {
          result = FALSE;
        } else {
          _args = [node[COMPONENT]()];
          _length = length;

          while (_length-- > 0) {
            _args[_length + 1] = args[_length];
          }

          result = method.apply(me, _args);
        }

        return result !== FALSE;
      }, FUNCTION_PROTOTYPE, me[NODE])
      .then(function() {
        return result;
      });
  }
});
