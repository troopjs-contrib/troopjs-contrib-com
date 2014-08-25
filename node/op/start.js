define(function () {
	var PHASE = "phase";

	return function() {
		var me = this;

		me[PHASE] = "starting";

		return me
			.signal("start")
			.tap(function() {
				me[PHASE] = "started";
			});
	}
});