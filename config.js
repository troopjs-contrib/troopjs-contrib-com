define([
  "module",
  "mu-merge/main"
], function (module, merge) {
  "use strict";

  return merge.call({
    "type": "@type",
    "children": "@children",
    "completed": "@completed",
    "node": "node",
    "parent": "parent",
    "component": "component"
  }, module.config());
});
