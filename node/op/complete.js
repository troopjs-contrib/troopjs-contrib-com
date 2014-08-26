define(function () {
	return function complete(completed) {
		return this.signal("complete", completed);
	}
});