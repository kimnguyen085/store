window.TooltipHelper = {

	initialize: function () {
		// TODO: generalise tooltip as a helper or class...
		if (!this.tooltipElem) {
			this.tooltipElem = $('<div class="tooltip" />');
			$('body').append(this.tooltipElem);
		}
		if (!this.tooltipMouseMove) {
			var self = this;
			this.tooltipMouseMove = function (e) {
				self.offsetTooltip(e.pageX, e.pageY);
			}
		}
	},

	showTooltip: function (e) { // should be a mouse event
		this.initialize();
		var $target = $(e.currentTarget); // currentTarget must be used here..
		this.tooltipText = $target.attr('title');
		this.tooltipElem.stop(true, true).fadeIn().html(this.tooltipText.replace('-', '<br/>'));
		this.tooltipElem.css('min-width', this.tooltipElem.width());
		this.offsetTooltip(e.pageX, e.pageY);
		$target.attr('title', '');
		$target.on('mousemove', this.tooltipMouseMove);
	},

	hideTooltip: function (e) { // should be a mouse event
		var $target = $(e.currentTarget);
		$target.attr('title', this.tooltipText);
		this.tooltipElem.stop(true, true).fadeOut();
		$target.off('mousemove', this.tooltipMouseMove);
	},

	offsetTooltip: function (mouseX, mouseY) {
		var tooltipX, tooltipY;

		if (mouseX + app_config.tooltipOffset.x + this.tooltipElem.width() >= window.innerWidth) {
			this.tooltipElem.flipX = true;
			// the offset here is for the mouse pointer's size, when we flip X, the
			tooltipX = mouseX - this.tooltipElem.width() - app_config.tooltipOffset.x * 2;
		} else {
			this.tooltipElem.flipX = false;
			tooltipX = mouseX + app_config.tooltipOffset.x;
		}
		if (mouseY + app_config.tooltipOffset.y + this.tooltipElem.height() + 40 >= window.innerHeight) { // 40 is the footter's height...
			this.tooltipElem.flipY = true;
			tooltipY = mouseY - this.tooltipElem.height() - app_config.tooltipOffset.y * 1.5;
		} else {
			this.tooltipElem.flipY = false;
			tooltipY = mouseY + app_config.tooltipOffset.y;
		}
		var radiusRemove = String.format('border-{0}-{1}-radius', this.tooltipElem.flipY ? 'bottom' : 'top', this.tooltipElem.flipX ? 'right' : 'left');

		this.tooltipElem
			.css('border-radius', '8px')
			.css(radiusRemove, '0px')
			.offset({left: tooltipX, top: tooltipY});
	},

	clearTooltip: function (elem) {

	}
}
