$(document).on("mobileinit", function() {
	console.log('mobileinit');
	$.mobile.ajaxEnabled = false;
	$.mobile.linkBindingEnabled = false;
	$.mobile.hashListeningEnabled = false;
	$.mobile.pushStateEnabled = false;
	$.mobile.ignoreContentEnabled = true;

	// swipe event configurations
	// $.event.special.swipe.durationThreshold = 1200; // 1.2 sec
	// $.event.special.swipe.horizontalDistanceThreshold = 15; // 15 px

	$.mobile.isJQMGhostClick = function(event) {
		$.mobile.curclickpoint = event.clientX + 'x' + event.clientY;

		if ($.mobile.lastclickpoint === $.mobile.curclickpoint) {
			$.mobile.lastclickpoint = '';
			return true;
		} else {
			//alert(lastclickpoint);
			$.mobile.lastclickpoint = $.mobile.curclickpoint;
			return false;
		}
	};
});