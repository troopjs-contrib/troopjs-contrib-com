define(function () {
	return function complete() {
		return this.signal("complete");
	}
});