define([
  "../signal/ready",
  "troopjs-contrib-com/util/unfold"
], function(ready, unfold) {
  "use strict";

  return function() {
    var length = arguments.length;
    var args = [ready];

    while (length--) {
      args[length + 1] = arguments[length];
    }

    return unfold.apply(this, args);
  }
});
