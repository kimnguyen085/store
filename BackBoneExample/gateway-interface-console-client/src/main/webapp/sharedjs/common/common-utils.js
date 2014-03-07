window.tpl = {

	// Hash of preloaded templates for the app
	templates : {},

	// Recursively pre-load all the templates for the app.
	// This implementation should be changed in a production environment. All the template files should be
	// concatenated in a single file.
	loadTemplates : function(names, callback) {

		var that = this;

		if (has('mergedTemplate')) {
			$.get('tpl/partial/template-merge.html', function(data) {
				$(data).each(function () {
					var templateName = this.id.replace('.', '/');
					that.templates[templateName] = this.text;
				});
				callback();
			});
			return;
		}

		var loadTemplate = function(index) {
			var name = names[index];
			console.log('Loading template: ' + name);
			$.get('tpl/' + name + '.html', function(data) {
				that.templates[name] = data;
				index++;
				if (index < names.length) {
					loadTemplate(index);
				} else {
					callback();
				}
			});
		}
		loadTemplate(0);
	},

	// Get template by name from hash of preloaded templates
	get : function(name) {
		return this.templates[name];
	}
};

window.CommonUtils = {
	processQueue: function (itemFunc) {
		this.funcQueue = this.funcQueue || [];
		this.funcQueue.push(itemFunc);
		if (this.queueRunning) {
			return;
		}

		var self = this;
		var queueRunner = function () { // process the function in the queue with 200 miliseconds delay
			self.queueRunning = true;
			console.log(self.funcQueue);
			console.log('running queue function, queue count: ', self.funcQueue.length);
			var func = self.funcQueue.shift();
			func();
			if (self.funcQueue.length > 0) {
				setTimeout(function () {
					queueRunner();
				}, 200);
			} else {
				self.queueRunning = false;
			}
		};
		queueRunner();
	}
}

window.TooltipHelper = {

	tooltipOffset: {
		x: 10,
		y: 20
	},

	initialize: function () {
		// TODO: generalise tooltip as a helper or class...
		if (app_config && app_config.tooltipOffset) {
			this.tooltipOffset = app_config.tooltipOffset;
		}
		if (!this.tooltipElem) {
			this.tooltipElem = $('<span class="tooltip" />');
			$('body').append(this.tooltipElem);
		}
		if (!this.tooltipMouseMove) {
			var self = this;
			this.tooltipMouseMove = function (e) {
				self.offsetTooltip(e.pageX, e.pageY);
			}

			this.tooltipMouseOut = function (e) {
				self.hideTooltip(e);
			}
		}
	},

	showTooltip: function (e, customMessage) { // should be a mouse event
		this.initialize();
		var $target = $(e.currentTarget); // currentTarget must be used here..
		this.tooltipText = customMessage || $target.attr('title') || "";
		this.tooltipElem.stop(true, true).fadeIn().html(this.tooltipText.replace('-', '<br/>'));
		this.tooltipElem.css('min-width', this.tooltipElem.width());
		this.offsetTooltip(e.pageX, e.pageY);
		$target.attr('title', '');
		$target.on('mousemove', this.tooltipMouseMove);
		$target.on('mouseout', this.tooltipMouseOut);
	},

	hideTooltip: function (e) { // should be a mouse event
		var $target = $(e.currentTarget);
		$target.attr('title', this.tooltipText);
		//hmm, not sure why there's time tooltipElem was not initialized when the process get to here...
		if (this.tooltipElem) {
			this.tooltipElem.stop(true, true).fadeOut();
		}
		$target.off('mousemove', this.tooltipMouseMove);
		$target.off('mouseout', this.tooltipMouseOut);
	},

	offsetTooltip: function (mouseX, mouseY) {
		var tooltipX, tooltipY;

		if (mouseX + this.tooltipOffset.x + this.tooltipElem.width() >= window.innerWidth) {
			this.tooltipElem.flipX = true;
			// the offset here is for the mouse pointer's size, when we flip X, the
			tooltipX = mouseX - this.tooltipElem.width() - this.tooltipOffset.x * 2;
		} else {
			this.tooltipElem.flipX = false;
			tooltipX = mouseX + this.tooltipOffset.x;
		}
		if (mouseY + this.tooltipOffset.y + this.tooltipElem.height() + 40 >= window.innerHeight) { // 40 is the footter's height...
			this.tooltipElem.flipY = true;
			tooltipY = mouseY - this.tooltipElem.height() - this.tooltipOffset.y * 1.5;
		} else {
			this.tooltipElem.flipY = false;
			tooltipY = mouseY + this.tooltipOffset.y;
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

