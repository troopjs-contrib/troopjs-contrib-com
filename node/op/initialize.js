define(function () {
	var PHASE = "phase";

	return function() {
		var me = this;

		me[PHASE] = "initializing";

		return me
			.signal("initialize")
			.tap(function() {
				me[PHASE] = "initialized";
			});
	}
});