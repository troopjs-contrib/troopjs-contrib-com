define([
  "./filter",
  "../config",
  "when/when"
], function(filter, config, when) {
  "use strict";

  var UNDEFINED;
  var NODE = config.node;
  var COMPONENT = config.component;
  var COMPLETED = config.completed;

  return function(method) {
    var me = this;
    var node = me[NODE];
    var length = arguments.length - 1;
    var args = new Array(length);

    while (length--) {
      args[length] = arguments[length + 1];
    }

    return filter
      .call(me, function(child) {
        return child !== UNDEFINED && !child.hasOwnProperty(COMPLETED);
      })
      .then(function(children) {
        return when.map(children, function(child) {
          return method.apply(child[COMPONENT](), args)
        });
      });
  };
});
