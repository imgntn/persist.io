var Desires = {
	getDesires: function() {
		console.log('getting desires...')
		var _t=this;
		var fetchDesires = $.get("api/desires").done(function(data) {
			//console.log('data is:', data)
			_t.initialDesires=data;
			initPlanes();
		}).fail(function(e) {
			console.log("error getting data from api", e);
		})



	}
}

