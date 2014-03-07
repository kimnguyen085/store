window.GlobalEvents = _.extend({}, Backbone.Events);

window.GenericPage = Backbone.View.extend({

	initialize : function() {
		// what a lengthy call!!!
		this.pageId = Backbone.View.prototype.getUUID.call(this, 'page');
		this.headers = [];
		this.mainContents = [];

		this.panels = [];

		this.options = _.defaults(this.options, this.defaults);
	},

	render : function() {
		var $el = this.$el;

		$el.attr('id', this.pageId).attr('data-role', 'page');

		var self = this;
		if (this.headers.length > 0) {
			_(this.headers).each(function(header) {
				$el.append(header.render().el);
			});
		}

		var $content = $('<div/>').attr('data-role', 'content');
		$el.append($content);
		this.$content = $content;

		if (this.mainContents.length > 0) {
			_(this.mainContents).each(function(mainContent) {
				$content.append(mainContent.render().el);
				//mainContent.setElement(self.$el.find('#main-content')).render();
			});
		}

		if (this.footer) {
			$el.append(this.footer());
		}

		_(this.panels).each(function(panel) {
			$el.append(panel.render().el);
		});

		return this;
	}
});

window.GenericElementView = Backbone.View.extend({

	initialize : function() {
		this.templateName = this.templateName || this.options.templateName;
		if (this.templateName) {
			this.template = _.template(tpl.get(this.templateName));
		}
		this.allowReRender = this.options.allowReRender || false;
		this.rendered = false;
	},

	render : function() {
		if (this.allowReRender || !this.rendered) {
			if (this.template) {
				this.$el.html(this.template(this.options));
			}
			this.rendered = true;
		}
		return this;
	}
});

window.RefreshableContentView = Backbone.View.extend({

	initialize : function() {
		this.id = Backbone.View.prototype.getUUID.call(this, 'refreshable');
		this.subViews = [];

		this.renderedSubviews = false;
		this.dataReady = false;
	},

	render : function() {
		var $el = this.$el;
		$el.attr('id', this.id);

		if (!this.dataReady) {
			this.$el.addClass('data-loading');
		}

		return this;
	},

	renderSubviews : function($container) {
		$container = $container || this.$el;

		_(this.subViews).each(function(view) {
			$container.append(view.render().el);
			if (view.refresh) {
				view.refresh();
			}
		});

		this.$el.trigger('create');
		// for jQM enhancement
		this.renderedSubviews = true;

		if (this.options.subviewRenderedHandler) { // render callback
			this.options.subviewRenderedHandler(this);
		}
	},

	setDataReady : function() {
		this.renderSubviews();
		this.$el.removeClass('data-loading');
		this.dataReady = true;
		this.trigger('dataready');
	},

	setDataLoading : function(clearContent) {
		if ( typeof clearContent == 'undefined') {
			clearContent = true;
		}
		if (clearContent) {
			this.clearContent();
		}
		this.$el.addClass('data-loading');
		if (this.$header) {
			this.$header.addClass('data-loading');
		}
		this.dataReady = false;
		this.trigger('dataloading');
	},

	clearContent : function() {
		_(this.subViews).each(function(view) {
			if (view) {// some might be removed manually
				if (view.useDataTable) {// if there's a tableview with datatable enhance, destroy it first
					view.destroy();
				}
				view.remove().unbind();
			}
		});
		this.$el.empty();
		this.subViews = [];
	},

	refresh : function() {
		if (this.dataReady) {
			_(this.subViews).each(function(view) {
				if (view.refresh) {
					view.refresh();
				}
			});
		}
	},

	displayMessage : function(message, isError, container) {
		var classText = "text-dark-blue";
		if (isError) {
			classText = "text-red";
		}
		this.message = new GenericElementView({
			attributes : {
				"class" : "empty-data " + classText
			}
		});

		if (typeof container != "undefined") {
			container.append(this.message.render().el);
		} else {
			this.subViews.push(this.message);
			this.setDataReady();
		}

		this.message.$el.html(message);
	}
});

window.RefreshablePage = RefreshableContentView.extend({
	initialize : function() {
		RefreshableContentView.prototype.initialize.apply(this, arguments);
		this.id = Backbone.View.prototype.getUUID.call(this, 'page');
		this.headers = [];
	},

	render : function() {
		this.$el.attr('id', this.id).attr('data-role', 'page');

		var self = this;
		if (this.headers.length > 0) {
			_(this.headers).each(function(header) {
				self.$el.append(header.render().el);
			});
		}

		var $content = $('<div/>').attr('data-role', 'content');
		this.$el.append($content);

		if (this.dataReady) {
			this.renderSubviews($content);
		} else {
			this.$el.addClass('data-loading');
		}

		return this;
	},

	setDataReady : function() {
		var $content = this.$el.find('.ui-content');
		this.renderSubviews($content);
		this.$el.removeClass('data-loading');
		this.dataReady = true;
		this.trigger('dataready');
	}
});

window.ActionHeader = Backbone.View.extend({

	defaults : {
		actionList : []
	},

	attributes : {
		'data-theme' : 'f',
		'data-position' : 'fixed'
	},

	initialize : function() {

		var self = this;

		this.mainContents = [];

		if (this.options.templateName) {
			this.templateContent = _.template(tpl.get(this.options.templateName));
		}

		if ( typeof this.options.enableActionMenu != 'undefined') {
			this.enableActionMenu = this.options.enableActionMenu;
		} else {
			this.enableActionMenu = true;
		}

		if (this.enableActionMenu) {
			this.actionLeft = [];
			this.actionRight = [];
		}
	},

	render : function() {
		this.$el.attr('data-role', 'header');

		var $el = this.$el;
		_(this.mainContents).each(function(view) {
			$el.append(view.render().el);
		});

		if (this.templateContent) {
			this.$el.append(this.templateContent(this.options));
		}

		if (this.enableActionMenu) {
			this.$el.append('<div class="ui-grid-a"><div class="ui-block-a ui-icon-nodisc actionLeftMenu"></div><div class="ui-block-b alignment-right actionRightMenu"></div></div>');

			var $leftContainer = this.$el.find('.actionLeftMenu');
			var $rightContainer = this.$el.find('.actionRightMenu');

			_(this.actionLeft).each(function(view) {
				$leftContainer.append(view.render().el);
			});
			_(this.actionRight).each(function(view) {
				$rightContainer.append(view.render().el);
			});

			this.$leftContainer = $leftContainer;
			this.$rightContainer = $rightContainer;
		}
		return this;
	}
});

window.GenericPanel = Backbone.View.extend({

	attributes : {
		"data-theme" : "c",
		"data-display" : "push",
		"data-dismissible" : "false",
		"data-swipe-close" : "false",
		"data-animate" : "false"
	},

	initialize : function() {
		// providing default values and check for override values
		this.panelId = Backbone.View.prototype.getUUID.call(this, 'panel');
		if ( typeof this.options.panelId != 'undefined') {
			this.panelId = this.options.panelId;
		}

		this.headers = [];
		this.mainContents = [];

		if (this.options.footerTemplate) {
			this.footerTemplate = _.template(tpl.get(this.options.footerTemplate));
		}
		this.isOpened = false;
	},

	render : function() {
		var $el = this.$el;

		$el.attr("id", this.panelId).attr("data-role", "panel");
		_(this.headers).each(function(header) {
			$el.append(header.render().el);
		});

		_(this.mainContents).each(function(view) {
			$el.append(view.render().el);
		});

		if (this.footerTemplate) {
			$el.append(this.footerTemplate());
		}

		return this;
	},

	open : function() {
		if (this.$el.hasClass('ui-panel')) {
			this.$el.panel('open');
		} else {
			this.$el.panel().panel('open');
		}
		this.isOpened = true;
	},

	close : function() {
		this.$el.panel('close');
		this.isOpened = false;
	}
});

window.LineBreakView = Backbone.View.extend({
	initialize : function() {
		this.count = 1;
		if (this.options.count) {
			this.count = this.options.count;
		}
	},

	render : function() {
		var $el = this.$el;
		for (var i = 0; i < this.count; i++) {
			$el.append('<br/>');
		}

		return this;
	}
});

window.ChartView = Backbone.View.extend({

	plotDefault : {
		seriesDefaults : {
			// Make this a pie chart.
			renderer : $.jqplot.DonutRenderer,
			rendererOptions : {
				// Put data labels on the pie slices.
				// By default, labels show the percentage of the slice.
				shadowOffset : 0,
				shadowAlpha : 0,
				shadowDepth : 0,
				showDataLabels : false,
				dataLabels : 'value',
				dataLabelFormatString : '%2f'
			}
		},
		legend : {
			show : true,
			rendererOptions : {
				numberColumns : 2
			},
			location : 'ne',
			placement : "outside"
		},
		grid : {
			borderColor : 'transparent',
			shadow : false,
			drawBorder : false,
			shadowColor : 'transparent',
			background : '#F3F3F3'
		}
	},

	initialize : function() {

		this.chartId = Backbone.View.prototype.getUUID.call(this, 'chart');
		this.chartData = [];

		if (this.options.chartData) {
			this.chartData = this.options.chartData;
		}

		if (this.options.chartSize) {
			this.chartSize = this.options.chartSize;
		}

		if ( typeof this.options.showTooltip != 'undefined') {
			this.showTooltip = this.options.showTooltip;
		} else {
			this.showTooltip = true;
		}

		this.tooltip = this.options.tooltip;

		this.plotted = false;
		this.readyToPlot = false;

		if (this.options.plotOptions) {
			this.plotOptions = this.options.plotOptions;
		} else {
			this.plotOptions = this.plotDefault;
			if (this.options.seriesDefaults) {
				this.plotOptions.seriesDefaults = this.options.seriesDefaults;
			}
			if (this.options.seriesColors) {
				this.plotOptions.seriesColors = this.options.seriesColors;
			}
			if (this.options.legend) {
				this.plotOptions.legend = this.options.legend;
			}
			if (this.options.legendLocation) {
				this.plotOptions.legend.location = this.options.legendLocation;
			}
			if (this.options.grid) {
				this.plotOptions.grid = this.options.grid;
			}
		}

		this.plotCallback = this.options.plotCallback;
	},

	// call this function only when the chart is visible
	plot : function() {

		if (!this.readyToPlot || this.plotted) {
			return;
		}

		var self = this;

		if (this.plotTimeout) {
			// if there's any pendding plot operation, clear it first
			clearTimeout(this.plotTimeout);
			this.plotTimeout = null;
		}
		// a hack... the chart div might not be visible at the time of plot
		this.plotTimeout = setTimeout(function() {
			// console.log('START plotting chart');
			// console.log(self.chartData);

			if (!self.$el.is(':visible')) {
				// not visible, return
				return;
			}

			$.jqplot(self.chartId, [self.chartData], self.plotOptions);

			self.$el.removeClass('data-loading');
			self.plotted = true;
			self.recalculateSize();

			self.plotCompleted();
			// console.log('END plotting chart');
		}, 1000);
	},

	getTooltip : function(ev, seriesIndex, pointIndex, data) {
		if ( typeof this.tooltip == 'string') {
			return String.prototype.format.apply(this.tooltip, data);
		}

		if ( typeof this.tooltip == 'function') {
			return this.tooltip(ev, seriesIndex, pointIndex, data);
		}

		return data[1];
	},

	plotCompleted : function() {
		if (this.showTooltip) {
			var self = this;
			this.tooltipShowing = false;
			this.$el.append(this.tooltipElem).on('jqplotDataHighlight', function(ev, seriesIndex, pointIndex, data) {
				TooltipHelper.showTooltip(ev, self.getTooltip(ev, seriesIndex, pointIndex, data));
			}).on('jqplotDataUnhighlight', function(ev, seriesIndex, pointIndex, data) {
				TooltipHelper.hideTooltip(ev);
			})
			// this is for touch screen
			.on('jqplotDataClick', function(ev, seriesIndex, pointIndex, data) {
				if (self.tooltipShowing) {
					TooltipHelper.hideTooltip(ev);
				} else {
					TooltipHelper.showTooltip(ev, self.getTooltip(ev, seriesIndex, pointIndex, data));
				}
				self.tooltipShowing = !self.tooltipShowing;
			});
		}

		if ( typeof this.plotCallback == 'function') {
			this.plotCallback(this);
		}
	},

	rePlot : function() {
		this.plotted = false;
		this.plot();
	},

	setReady : function(force) {
		this.readyToPlot = true;
		if (force) {
			this.plotted = false;
		}
		this.plot();
	},

	setPlotCallback : function(callback) {
		this.plotCallback = callback;
	},

	render : function() {
		this.$el.attr('id', this.chartId).addClass('chart-container');

		if (!this.chartSize) {
			this.chartSize = {};
			this.chartSize.width = window.innerWidth * .7;
			this.chartSize.height = window.innerHeight * .7;
			// 70% of the window size...
			if (this.chartSize.width > app_config.maxChartSize.width) {
				this.chartSize.width = app_config.maxChartSize.width;
			}
			if (this.chartSize.height > app_config.maxChartSize.height) {
				this.chartSize.height = app_config.maxChartSize.height;
			}
		}
		this.$el.width(this.chartSize.width);
		this.$el.height(this.chartSize.height);
		this.$el.addClass('data-loading');
		return this;
	},

	refresh : function() {
		this.plot();
	},

	recalculateSize : function() {
		var chartPos = this.options.legendLocation || 'ne';
		console.log('recalculating size ');
		if (chartPos.indexOf('n') > -1 || chartPos.indexOf('s') > -1) {
			// update the height for south and north
			var $legend = this.$el.find('table.jqplot-table-legend');
			var legendHeight = $legend.height() + $legend.margin().top + $legend.margin().bottom + $legend.padding().top + $legend.padding().bottom + $legend.border().top + $legend.border().bottom;

			console.log("chartHeight: " + (this.chartSize.height + legendHeight));
			this.$el.height(this.chartSize.height + legendHeight);
			console.log(this.$el);
		} else if (chartPos.indexOf('w') !== -1 || chartPos.indexOf('e') !== -1) {
			// update the width ?!
			// var $legend = this.$el.find('jqplot-table-legend');
			// var legendHeight = $legend.height() + $legend.margin().top + $legend.margin().bottom + $legend.border().top + $legend.border().bottom;
			// this.$el.height(this.$el.height() + legendHeight);
		}
	}
});

/**
 * BindableListBaseView can not be used directly
 * inheritance class must set the itemTagName value prior to any render
 */
window.BindableListBaseView = Backbone.View.extend({

	tagName : 'select',

	itemTagName : 'option',

	initialize : function() {
		this.bindableAttribute = this.options.bindableAttribute;
		this.dataSet = this.options.dataSet;
		if (this.dataSet instanceof Backbone.Collection) {
			this.filteredDataSet = this.dataSet.models;
		} else {
			this.filteredDataSet = this.dataSet;
		}
		this.prefixItems = this.options.prefixItems;
		this.suffixItems = this.options.suffixItems;
		this.itemViews = [];
	},

	/**
	 * this method return the attribute value from object
	 * if attribute is something like this: att1.att2.att3, the sub attribute's value will be return
	 * if any of the sub data is null or undefined, the same will be return;
	 */
	getValue : function(object, attribute, format) {

		if ( typeof object == 'undefined' || object == null) {
			return object;
		}

		var val;
		if (attribute.indexOf(',') > 0) {
			var parts = attribute.split(',');
			var attrValues = [];
			var attrFormat = "";
			for (var i = 0, j = parts.length; i < j; i++) {
				attrFormat += "{" + i + "}, ";
				attrValues.push(this.getValue(object, parts[i]));
			}

			if (format) {
				val = String.prototype.format.apply(format, attrValues);
			} else {
				val = String.prototype.format.apply(attrFormat.substr(0, attrFormat.length - 2), attrValues);
				// remove the ", " at the end
			}

			return val;
		}

		if (attribute.indexOf('.') > 0) {
			var parts = attribute.split('.');
			val = object[parts[0]];
			for (var i = 1, j = parts.length; i < j; i++) {
				if ( typeof val == 'undefined' || val == null) {
					break;
				}
				val = val[parts[i]];
			}
		} else {
			val = object[attribute];
		}
		return val;
	},

	parseFilterString : function(filterString) {// fitler string should be a form serialize string
		var subFilters = filterString.split('&');
		var filters = {};
		for (var i = subFilters.length - 1; i >= 0; i--) {
			var vals = subFilters[i].split('=');
			if (vals.length > 1) {
				var key = vals[0];
				var value = vals[1];
				var valueKey = "value";

				var keyVals = key.split('_');
				if (keyVals.length > 1) {
					key = keyVals[0];
					valueKey = keyVals[1];
				}
				value = unescape(value);
				value = value.replace(/\+/g, ' ');
				key = key.toLowerCase();
				//TODO: this needs more brainstorming case-insensitive filtering attributes...
				filters[key] = filters[key] || {};
				filters[key][valueKey] = value;
			}
		}

		return filters;
	},

	filter : function(criteria) {

		if (!this.dataSet instanceof Backbone.Collection) {
			return;
			// TODO: currently, only support filtering on Backbone Collection data set
		}

		this.dataFiltering = true;

		if ( typeof criteria == 'undefined') {
			this.filteredDataSet = this.dataSet.models;
		} else {
			if ( typeof criteria == 'string') {
				this.filters = this.parseFilterString(criteria);
			} else {
				this.filters = criteria;
			}
			this.filteredDataSet = this.dataSet.where(this.filters);
		}
		this.bindData();
		this.dataFiltering = false;
	},

	render : function() {
		this.bindData();
		var self = this;
		this.$el.on('change', function() {
			self.changeHandler();
		});
		return this;
	},

	bindData : function() {
		// TODO: process a key - value array for attributes to be binded
		this.dataBinding = true;
		var self = this;
		var translatedDataItems = [];

		if ( typeof this.prefixItems != 'undefined' && this.prefixItems != null) {
			translatedDataItems = translatedDataItems.concat(this.prefixItems);
		}

		var translatedObj;
		_(this.filteredDataSet).each(function(dataItem, index) {
			translatedObj = {};
			if (self.bindableAttribute) {
				for (var key in self.bindableAttribute) {
					if (self.bindableAttribute[key]) {
						// we have more information on the key
						switch (typeof self.bindableAttribute[key]) {
							case 'string':
								switch (self.bindableAttribute[key]) {
									case '_value':
										// special case when we want to get the key's value
										translatedObj[key] = self.getValue(dataItem.toJSON(), key);
										break;
									case '_index':
										// special case when we want to get the item's index
										translatedObj[key] = index;
										break;
									default:
										translatedObj[key] = self.getValue(dataItem.toJSON(), self.bindableAttribute[key]);
										break;
								}
								break;
							default:
								// bindableAttribute can be an object like this { attribute: "attr1.attr2,attrA.attrB", format: "{0} - {1}"}
								translatedObj[key] = self.getValue(dataItem.toJSON(), self.bindableAttribute[key].attribute, self.bindableAttribute[key].format);
								break;
						}
					} else {
						// we do not have more information on the key
						// just try to get the key value from dataItem
						translatedObj[key] = self.getValue(dataItem.toJSON(), key);
					}
				}
			} else {
				translatedObj = dataItem;
			}

			translatedDataItems.push(translatedObj);
		});

		if ( typeof this.suffixItems != 'undefined' && this.suffixItems != null) {
			translatedDataItems = translatedDataItems.concat(this.suffixItems);
		}

		this.translatedDataSet = translatedDataItems;
		this.renderContent();
		this.dataBinding = false;
	},

	renderItem : function(dataItem) {
		if (this.itemView) {
			return new this.itemView(item);
		}

		var $item = $(String.format('<{0}/>', this.itemTagName));
		for (var attribute in dataItem) {
			// a special key _text is used for the inner html
			if (attribute == '_html') {
				$item.html(dataItem[attribute]);
			} else {
				$item.attr(attribute, dataItem[attribute]);
			}
		}

		return $item;
	},

	renderContent : function() {
		this.$el.empty();

		var self = this;
		_(this.translatedDataSet).each(function(dataItem, index) {
			var renderResult = self.renderItem(dataItem);
			if (self.itemView) {
				self.itemViews.push(renderResult);
				self.$el.append(renderResult.render().el);
			} else {
				self.$el.append(renderResult);
			}
		});

		this.refresh();

		return this;
	},

	clearSelect : function() {
		this.setSelectedIndex(0);
	},

	setSelectedIndex : function(index) {
		if (this.el.selectedIndex != index) {
			this.el.selectedIndex = index;
			this.$el.change();
			// manually trigger change event
		}
		this.refresh();
	},

	setSelectedObjectIndex : function(index) {
		if (isNaN(index)) {
			this.clearSelect();
			return;
		}
		var object = this.dataSet.at(index);
		this.setSelectedObject(object);
	},

	setSelectedObject : function(object) {
		var index = -1;
		for (var i = 0, j = this.filteredDataSet.length; i < j; i++) {
			if (object.cid == this.filteredDataSet[i].cid) {
				index = i;
				break;
			}
		}

		if (index >= 0) {
			if (this.prefixItems) {
				index += this.prefixItems.length;
			}
			this.setSelectedIndex(index);
		}
	},

	getSelectedIndex : function() {
		return this.el.selectedIndex;
	},

	getSelectedValue : function() {
		return this.$el.val();
	},

	getSelectedObjectIndex : function() {
		var selectedObject = this.getSelectedObject();
		if (selectedObject) {
			return this.dataSet.indexOf(selectedObject);
		}
		return null;
	},

	getSelectedObject : function() {
		if (!isNaN(this.el.selectedIndex)) {
			var index = this.el.selectedIndex;
			if (this.prefixItems) {
				index -= this.prefixItems.length;
			}
			if (index >= 0 && index < this.filteredDataSet.length) {
				return this.filteredDataSet[index];
			}
		}
		return null;
	},

	refresh : function() {
		this.$el.trigger('refresh');
	},

	clearFilters : function() {
		this.filter();
	},

	addItem : function(item, index) {
		var renderResult = this.renderItem(item);
		var $content;
		if (this.itemView) {
			$content = renderResult.render().el;
			// render the content
		} else {
			$content = renderResult;
		}

		var childCount = this.itemViews.length || this.$el.children().length;

		if (!index || isNaN(index)) {
			this.$el.append($content);
			if (this.itemView) {
				this.itemViews.push(renderResult);
			}
		} else if (index >= 0 && index < childCount) {
			if (this.itemView) {
				this.itemViews.splice(index, 0, renderResult);
			}
			this.$el.children().eq(index).before($content);
		}

		this.refresh();
	},

	removeItem : function(mix) {
		var index = -1;
		if (mix === undefined || mix === null) {
			throw "Either an item object of an index must be passed";
		}

		if ( mix instanceof this.itemView) {
			for (var i = 0, j = this.itemViews.length; i < j; i++) {
				if (this.itemViews[i].cid == mix.cid) {
					index = i;
					break;
				}
			}
		} else {
			// we've got an index
			index = mix;
		}

		var childCount = this.itemViews.length || this.$el.children().length;

		if (index >= 0 && index < childCount) {
			if (this.itemView) {
				var item = this.itemViews[index];

				if (item.removalHandler) {
					item.removelHandler();
				}

				this.itemViews.splice(index, 1);
				item.remove().unbind();
			} else {
				this.$el.children().eq(index).remove();
			}
		}
	},

	changeHandler : function() {
		var index = this.getSelectedObjectIndex();
		if (index != null && this.dataSet.setSelectedIndex) {
			this.dataSet.setSelectedIndex(index);
		} else if (this.dataSet.clearSelect) {
			this.dataSet.clearSelect();
		}
	}
});

window.BindableListView = BindableListBaseView.extend({
	tagName : 'ul',

	itemTagName : 'li',

	attributes : {
		"data-role" : "listview",
		"data-theme" : "g",
		"data-dividertheme" : "g",
		"data-inset" : "false"
	},

	events : {
		'click li a' : 'clicked'
	},

	initialize : function() {
		BindableListBaseView.prototype.initialize.apply(this, arguments);

		this.selectable = this.options.selectable || false;
		this.selectOnClick = this.options.selectOnClick;
		if (this.selectOnClick === undefined) {
			this.selectOnClick = this.selectable;
		}
		this.firstSelect = this.options.firstSelect;
	},

	render : function() {
		BindableListBaseView.prototype.render.apply(this, arguments);
		if ( typeof this.firstSelect == 'number') {
			this.setSelectedIndex(this.firstSelect);
		}
		return this;
	},

	clicked : function(e) {
		if (this.selectable && this.selectOnClick) {
			//get the li
			var $elem = $($(e.currentTarget).closest('li')[0]);
			//console.log("selected index: " + $(elem).index());
			this.setSelectedIndex($elem.index());
		}
		if ( typeof this.options.anchorClickHandler == 'function') {
			return this.options.anchorClickHandler(e, this);
		}
	},

	refresh : function() {
		if (!Backbone.isInDOM(this.$el)) {
			return; // not in DOM yet, refresh will not work...
		}
		if (this.$el.closest('.ui-page').length > 0) {
			if (this.$el.hasClass("ui-listview")) {
				this.$el.listview('refresh');
			} else {
				this.$el.listview();
			}
		}
	},

	setSelectedIndex : function(index) {
		var childCount = this.itemViews.length || this.$el.children().length;
		if (this.selectable && index >= 0 && index < childCount) {
			if (this.itemView) {
				if (this.selectedIndex) {
					this.itemViews[this.selectedIndex].unselect();
				}
				this.itemViews[index].select();
			} else {
				if (this.selectedIndex) {
					this.$el.children().eq(this.selectedIndex).removeClass('selected');
				}
				this.$el.children().eq(index).addClass('selected');
			}
			this.selectedIndex = index;
		}
	},

	getSelectedIndex : function() {
		if (this.selectable) {
			return this.selectedIndex;
		}
	}
});

window.BindableListItemView = Backbone.View.extend({

});

/**
 * @obsolete
 */
window.ListView = Backbone.View.extend({

	tagName : 'ul',

	attributes : {
		"data-role" : "listview",
		"data-theme" : "g",
		"data-dividertheme" : "g",
		"data-inset" : "false"
	},

	events : {
		'click li a' : 'clicked'
	},

	initialize : function() {

		this._itemViews = [];

		var self = this;

		this.selectable = this.options.selectable || false;
		this.selectOnClick = this.options.selectOnClick || false;
		this.firstSelect = this.options.firstSelect;

		_(this.options.items).each(function(listItem) {
			self._itemViews.push(new ListItemView(listItem));
		});
	},

	render : function() {
		if (this.renderCount > 1) {
			console.log('WTF?!');
		}
		var $el = this.$el;
		if (this.options.items.length > 0) {
			_(this._itemViews).each(function(item) {
				$el.append(item.render().el);
			});
		}
		////console.log($el);
		////console.log("END rendering list");
		if ( typeof this.firstSelect == 'number') {
			this.setSelectedIndex(this.firstSelect);
		}
		return this;
	},

	clicked : function(e) {
		if (this.selectable && this.selectOnClick) {
			//get the li
			var elem = e.currentTarget;
			while (elem.tagName.toLowerCase() != 'li') {
				elem = elem.parentElement;
			}
			//console.log("selected index: " + $(elem).index());
			this.setSelectedIndex($(elem).index());
		}
		if ( typeof this.options.anchorClickHandler == 'function') {
			return this.options.anchorClickHandler(e, this);
		}
	},

	refresh : function() {
		if (!Backbone.isInDOM(this.$el)) {
			return; // not in DOM yet, refresh will not work...
		}
		if (this.$el.closest('.ui-page').length > 0) {
			if (this.$el.hasClass("ui-listview")) {
				this.$el.listview('refresh');
			} else {
				this.$el.listview();
			}
		}
	},

	setSelectedIndex : function(index) {
		if (this.selectable && index >= 0 && index < this._itemViews.length) {
			this.selectedIndex = index;
			_(this._itemViews).each(function(item) {
				item.unselect();
			});
			this._itemViews[index].select();
		}
	},

	getSelectedIndex : function() {
		if (this.selectable) {
			return this.selectedIndex;
		}
	}
});

window.ListItemView = Backbone.View.extend({

	tagName : 'li',

	defaults : {
		//listAttributes, listContent
		//actionUrl, actionAttributes
		col1Content : '',
		selected : false
	},

	initialize : function() {
		this.options = _.defaults(this.options, this.defaults);
		////console.log(this.options);
		if (this.options.col6Content !== undefined) {
			this.templateContent = _.template(tpl.get('partial/list-item-col6'));
		} else if (this.options.col5Content !== undefined) {
			this.templateContent = _.template(tpl.get('partial/list-item-col5'));
		} else if (this.options.col4Content !== undefined) {
			this.templateContent = _.template(tpl.get('partial/list-item-col4'));
		} else if (this.options.col3Content !== undefined) {
			this.templateContent = _.template(tpl.get('partial/list-item-col3'));
		} else if (this.options.col2Content !== undefined) {
			this.templateContent = _.template(tpl.get('partial/list-item-col2'));
		} else {
			this.templateContent = _.template(tpl.get('partial/list-item-col1'));
		}
	},

	render : function() {
		////console.log('rendering list item');
		var $el = this.$el;
		var $content = $el;
		////console.log(this.options);
		if (this.options.actionUrl) {
			$content = $(String.format('<a href="{0}" />', this.options.actionUrl));
			$el.append($content);
			if (this.options.actionAttributes) {
				_(this.options.actionAttributes).each(function(value, key) {
					$content.attr(key, value);
				});
			}
		}
		$content.html(this.templateContent(this.options));
		return this;
	},

	select : function() {
		if (!this.selected) {
			this.selected = true;
			this.selectChanged();
		}
	},

	unselect : function() {
		if (this.selected) {
			this.selected = false;
			this.selectChanged();
		}
	},

	selectChanged : function() {
		// update the UI
		this.selectTheme = this.$el.attr('data-theme-select') || "b";
		if (this.selected) {
			this.lastTheme = this.$el.attr('data-theme');
			this.$el.attr('data-theme', this.selectTheme);
			this.$el.removeClass('ui-btn-up-' + this.lastTheme + ' ui-btn-hover-' + this.lastTheme + ' ui-btn-down-' + this.lastTheme);
			this.$el.addClass('ui-btn-up-' + this.selectTheme);
		} else {
			this.lastTheme = this.lastTheme || 'g';
			this.$el.attr('data-theme', this.lastTheme);
			this.$el.removeClass('ui-btn-up-' + this.selectTheme + ' ui-btn-hover-' + this.selectTheme + ' ui-btn-down-' + this.selectTheme);
			this.$el.addClass('ui-btn-up-' + this.lastTheme);
		}
	}
});

window.BindableDropdowView = BindableListBaseView.extend({

	events : {
		'change' : 'selectChanged'
	},

	refresh : function() {
		if (!Backbone.isInDOM(this.$el)) {
			return; // not in DOM yet, refresh will not work...
		}
		if (this.$el.parent().parent().hasClass('ui-select')) {
			this.$el.selectmenu('refresh');
		} else {
			this.$el.selectmenu();
		}
	},

	setSelectedValue : function(value) {
		// data might not be finished binded
		if (this.dataFiltering) {
			var self = this;
			setTimeout(function() {
				self.setSelectedValue(value);
			}, 200);
			return;
		}
		var match = this.$el.children(String.format('[value="{0}"]', value));
		if (match.length > 0) {
			match = $(match[0]);
			// get the first match only
			this.setSelectedIndex(match.index());
		}
	},

	selectChanged : function(e) {
		if ( typeof this.options.selectChangeHandler == 'function') {
			this.options.selectChangeHandler(e);
		}
		this.changed = true;
	},

	disable : function(forceDisabled) {
		if ( typeof forceDisabled != 'undefined') {
			this.enabled = forceDisabled;
		}
		if (this.enabled) {
			this.$el.selectmenu('disable');
		} else {
			this.$el.selectmenu('enable');
		}
		this.enabled = !this.enabled;
	}
});

window.DropDownBoxView = BindableDropdowView.extend({//TODO: keeping it intact for now... Need to update FO and CMobile to use the new bindable Dropdown

	initialize : function() {
		this.items = _.extend({}, this.items, this.options.items);
		this.changed = false;
		this.enabled = true;
	},

	render : function() {
		var $el = this.$el;
		$el.empty();
		_(this.items).each(function(option) {
			var $opt = $('<option/>');
			$el.append($opt);
			$opt.attr('value', option.value).text(option.label);
			for (var key in option.attributes) {
				$opt.attr(key, option.attributes[key]);
			}
			for (var key in option.dataAttributes) {
				$opt.attr('data-' + key, option.dataAttributes[key]);
			}
		});
		return this;
	}
});

/* Table  */

window.TableView = Backbone.View.extend({

	tagName : 'table',

	initialize : function() {
		this.tableId = Backbone.View.prototype.getUUID.call(this, 'table');

		this.rows = [];
		if ( typeof this.options.rows != 'undefined') {
			this.rows = this.options.rows;
		}

		this.useDataTable = this.options.useDataTable || false;
		this.useJqmTable = this.options.useJqmTable || false;

		if ( typeof this.options.bindings != 'undefined') {
			this.bindings = this.options.bindings;
			this.bindData();  // bind the data for this table
		}

		this.filters = {};

		this.rendered = false;

		if (this.options.enableSmartResize && !this.useJqmTable) { // disable smart resize when jQM table is used....
			var self = this;
			this.smartResizeHandler = function(displayLength) {
				if (!self.rendered || typeof displayLength != 'number' || displayLength <= 0) {
					return;
				}
				var oSettings = self.$el.fnSettings();
				if (oSettings) {
					oSettings._iDisplayLength = displayLength;
					$.fn.dataTableExt.currentFilters = self.filters;
					$.fn.dataTableExt.currentTable = self.tableId;
					self.$el.fnDraw();
				}
			};
			GlobalEvents.on('smart:tableresize', this.smartResizeHandler);
		}
	},

	getValue : function(object, attribute) {
		var val;
		if (attribute.indexOf('.') > 0) {
			var parts = attribute.split('.');
			val = object[parts[0]];
			for (var i = 1, j = parts.length; i < j; i++) {
				if ( typeof val == 'undefined' || val == null) {
					break;
				}
				val = val[parts[i]];
			}
		} else {
			val = object[attribute];
		}
		return val;
	},

	get2DDataArray : function(dataObject) {
		var self = this;
		var dataArr = [];
		_(dataObject).each(function(rowData) {
			var arrRowData = [];
			//var arrFilters = [];
			_(self.bindings.headers).each(function(header, index) {

				var data;

				if (header.dataAttribute.indexOf(',') > 0) {
					var attributes = header.dataAttribute.split(',');
					var attrValues = [];
					var attrFormat = "";
					for (var i = 0, j = attributes.length; i < j; i++) {
						attrFormat += "{" + i + "}, ";
						attrValues.push(self.getValue(rowData, attributes[i]));
					}

					if (header.dataAttributeFormat) {
						data = String.prototype.format.apply(header.dataAttributeFormat, attrValues);
					} else {
						data = String.prototype.format.apply(attrFormat.substr(0, attrFormat.length - 2), attrValues);
						// remove the ", " at the end
					}
				} else {
					data = self.getValue(rowData, header.dataAttribute);
					if (header.dataAttributeFormat) {
						data = String.prototype.format.apply(header.dataAttributeFormat, [data]);
					}
				}

				if (self.useDataTable) {
					if ( typeof data != 'undefined' && data != null) {
						arrRowData.push(data);
					} else if ( typeof header.nullValue != 'undefined') {
						arrRowData.push(header.nullValue);
					} else if (header.type == 'numeric') {
						arrRowData.push(0);
					} else {
						arrRowData.push("");
					}
				} else {
					if ( typeof header.dataFormat == 'string') {
						//TODO: string format data
					} else if ( typeof header.dataFormat == 'function') {
						arrRowData.push(header.dataFormat(data));
					} else {
						// no format
						arrRowData.push(data);
					}
				}

				// create an array of unique values for each attribute
				if ( typeof data != 'undefined' && data != null) {
					var filter = {
						key : header.dataAttribute,
						value : data
					};

					self.filterValues[filter.key] = self.filterValues[filter.key] || {};
					self.filterValues[filter.key][filter.value] = 1;
				}
			});

			dataArr.push(arrRowData);

			if (!self.useDataTable) {
				self.rows.push(new TableRowView({
					contentViews : arrRowData,
					//filters: arrFilters,
					numCells : arrRowData.length
				}));
			}
		});

		return dataArr;
	},

	bindData : function() {
		var self = this;
		// binding data passed in, ignore rows option
		this.rows = [];

		// create the header row
		var headerRowData = [];
		var headerRowWidth = [];
		var dtColumns = [];
		var filterInformation = {};
		_(this.bindings.headers).each(function(header, index) {
			headerRowData.push(header.title);
			headerRowWidth.push(header.width);

			if (header.dataAttribute.indexOf(',') > 0) {
				var attributes = header.dataAttribute.split(',');
				for (var i = 0, j = attributes.length; i < j; i++) {
					// TODO: this needs more brainstorming... case-insensitive filtering key
					filterInformation[attributes[i].toLowerCase()] = {
						columnIndex : index,
						caseSensitive : header.caseSensitiveFilter || false,
						exactSearch : header.exactSearch || false
					};
				}
			} else {
				// TODO: this needs more brainstorming... case-insensitive filtering key
				filterInformation[header.dataAttribute.toLowerCase()] = {
					columnIndex : index,
					caseSensitive : header.caseSensitiveFilter || false,
					exactSearch : header.exactSearch || false
				};
			}

			dtColumns.push(_.extend({
				"sTitle" : header.title,
				"sWidth" : header.width,
				"sType" : header.type,
				"mRender" : header.dataFormat
			}, header.aoColumn));
		});
		this.filterInformation = filterInformation;

		if (this.useDataTable) {
			$.fn.dataTableExt.filterInformation = $.fn.dataTableExt.filterInformation || {};
			$.fn.dataTableExt.filterInformation[this.tableId] = this.filterInformation;
		}

		// for later use for datatable
		this.dtColumns = dtColumns;

		if (!this.useDataTable) {
			var numCells = headerRowData.length;
			this.headerRowView = new TableRowView({
				headerRow : true,
				contentViews : headerRowData,
				contentWidth : headerRowWidth,
				numCells : numCells
			});
		}

		this.filterValues = {};

		// need to do this, since most of the API will return some undefined data
		// DataTable doesn't like that
		this.dataSet = this.get2DDataArray(this.bindings.data);

		// convert the unique attribute values to array
		for (key in this.filterValues) {
			var values = [];
			for (valueKey in this.filterValues[key]) {
				values.push(valueKey);
			}
			this.filterValues[key] = values;
		}
	},

	rebindData : function(newData) {
		if ( typeof newData != 'undefined') {
			if (this.useDataTable) {// support for dataTable
				this.$el.fnClearTable();
				this.refrehsed = {};
				this.dataSet = this.get2DDataArray(newData);
				this.$el.fnAddData(this.dataSet);
				//this.clearFilter();
				//this.enableDataTable(this.oldDataTableOptions);
			} else {
				// TODO: custom rebinding data
			}
		}
	},

	render : function() {
		var $el = this.$el;
		$el.attr("id", this.tableId);

		if (!this.useDataTable) {
			if (this.useJqmTable) {
				$el.attr("data-role", "table");
			}
			var $thead = $('<thead/>');
			$thead.append(this.headerRowView.render().el);

			var $tbody = $('<tbody/>');

			_(this.rows).each(function(row) {
				// console.log('Rendering table row');
				// console.log(row);
				$tbody.append(row.render().el);
			});

			$el.append($thead).append($tbody);

			this.rendered = true;
		}

		return this;
	},

	enableDataTable : function(options) {
		var self = this;
		this.refreshed = {};
		if (this.useDataTable) {
			this.oldDataTableOptions = options;
			this.dataTable = this.$el.dataTable(_.extend({
				"aaData" : this.dataSet,
				"aoColumns" : this.dtColumns,
				"fnInitComplete": function (oSettings) {

				},
				"fnDrawCallback" : function (oSettings) {
					console.log('draw call back');
					if (self.useJqmTable) {
						self.reflow(oSettings);
						// var page = oSettings._iDisplayLength === -1 ? 0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength );
						// if (this.hasClass('ui-table')) {
							// if (!self.refreshed[page]) {
								// // should call refresh on each page only once
								// console.log('refresh table');
								// this.table('refresh');
								// self.refreshed[page] = true;
							// }
						// } else {
							// console.log('create table');
							// this.attr('data-role', 'table');
							// this.table();
							// self.refreshed[page] = true;
						// }
					}
				}
			}, options));
			this.$el.parent().children('.dataTables_length').find('select').selectmenu({
				theme : "d",
				shadow : false,
				iconshadow : false,
				inline : true,
				mini : true,
				corners : false
			});

			this.dataTableEnabled = true;
			// this.$el.parent().children('.dataTables_wrapper').children('.dataTables_filter').find('input').textinput({
			// theme: "d",
			// shadow: false,
			// inline: true,
			// mini: true,
			// corners: false
			// }).parent().removeClass('ui-corner-all');
			//this.dtFilter();
		}
	},

	reflow: function (oSettings) {
		//var page = oSettings._iDisplayLength === -1 ? 0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength );
		if (this.$el.hasClass('ui-table')) {
			if (this.$el.hasClass('ui-table-reflow')) {
				// since the table might be sorted, or filtered, and the displaying rows might not be reflowed yet...
				// manually reflowing the rows...
				var self = this;
				this.$el.find('td').each(function (index, tdElem) {
					var $td = $(tdElem);
					if (!$td.hasClass('dataTables_empty') && $td.children('.ui-table-cell-label').length == 0) {
						$td.prepend(String.format('<b class="ui-table-cell-label">{0}</b>', self.bindings.headers[$td.index()].title));
					}
				});
			}
		} else {
			this.$el.attr('data-role', 'table');
			this.$el.table();
			var $td = this.$el.find('td');
			if ($td.length == 1) {
				// there's only 1 cell, probably the "no data message"
				$td.children().eq(0).remove();
			}
		}
	},

	insertRow : function(row, index) {
		if ( typeof index == 'number') {
			this.cells.splice(index, 0, row);
		} else {
			this.cells.push(row);
		}
		// need to renderd the row, if render was called already
		if (this.rendered) {
			var $tbody = this.$el.find('tbody');
			if ( typeof index == 'number') {
				$tbody.children().eq(index).after(row.render().el);
			} else {
				$tbody.append(row.render().el);
			}
		}
	},

	removeRow : function(index) {
		if ( typeof index == 'number') {
			this.cells.splice(index, 1);
		} else {
			this.cells.pop();
		}

		// need to removed the renderd row
		if (this.rendered) {
			var $tbody = this.$el.find('tbody');
			if ( typeof index == 'number') {
				$tbody.children().eq(index).remove();
			} else {
				$tbody.children(':last-child').remove();
			}
		}
	},

	getFilterValues : function() {
		return this.filterValues;
	},

	parseFilterString : function(filterString) {// fitler string should be a form serialize string
		var subFilters = filterString.split('&');
		var filters = {};
		for (var i = subFilters.length - 1; i >= 0; i--) {
			var vals = subFilters[i].split('=');
			if (vals.length > 1) {
				var key = vals[0];
				var value = vals[1];
				var valueKey = "value";

				var keyVals = key.split('_');
				if (keyVals.length > 1) {
					key = keyVals[0];
					valueKey = keyVals[1];
				}
				value = unescape(value);
				value = value.replace(/\+/g, ' ');
				key = key.toLowerCase();
				//TODO: this needs more brainstorming case-insensitive filtering attributes...
				filters[key] = filters[key] || {};
				filters[key][valueKey] = value;
			}
		}

		return filters;
	},

	applyFilter : function(filters) {
		if ( typeof filters == 'string') {
			filters = this.parseFilterString(filters);
		}
		this.filters = filters;
		$.fn.dataTableExt.currentFilters = this.filters;
		$.fn.dataTableExt.currentTable = this.tableId;
		this.$el.fnDraw();
	},

	clearFilter : function() {
		this.filters = {};
		$.fn.dataTableExt.currentFilters = {};
		$.fn.dataTableExt.currentTable = this.tableId;
		this.$el.fnDraw();
	},

	destroy : function() {
		if (this.useDataTable) {
			this.$el.fnDestroy();
		}
		if (this.options.enableSmartResize) {
			GlobalEvents.off('smart:tableresize', this.smartResizeHandler);
		}
		this.remove();
		this.unbind();
	}
});

var TableRowView = Backbone.View.extend({

	tagName : 'tr',

	initialize : function() {

		this.headerRow = this.options.headerRow || false;
		this.setReady = this.options.setReady || false;

		var what = Object.prototype.toString;
		var self = this;

		this.numCells = 1;
		// check pass in the number of cells
		if ( typeof this.options.numCells == 'number') {
			if (this.options.numCells < 1) {
				throw "Number of cells in a row must be a number greater than 0";
			} else {
				this.numCells = this.options.numCells;
			}
		}

		this.cells = [];
		this.contentViews = [];
		this.filters = this.options.filters;
		this.contentWidth = this.options.contentWidth || [];

		// console.log('Row contents');

		// contentViews parameter can be an array of mixed object or array
		// convert them to an 2 dimention array
		if (what.call(this.options.contentViews) === '[object Array]') {
			if (this.options.contentViews.length > this.numCells) {
				this.numCells = this.contentViews.length;
			}
			_(this.options.contentViews).each(function(someView) {
				if (what.call(someView) === '[object Array]') {
					self.contentViews.push(someView);
				} else {
					self.contentViews.push([someView]);
				}
			});
		}
		// console.log(this.contentViews);
		var cellOptions = {};
		if (this.headerRow) {
			cellOptions = {
				tagName : 'th'
			};
		}

		for (var i = 0; i < this.numCells; i++) {
			if ( typeof this.contentWidth[i] != 'undefined') {
				cellOptions.attributes = {
					width : this.contentWidth[i]
				}
			} else {
				cellOptions.attributes = null;
			}
			if (i < this.contentViews.length) {
				this.cells.push(new TableCellView(_.extend(cellOptions, {
					contents : this.contentViews[i]
				})));
			} else {
				this.cells.push(new TableCellView(cellOptions));
			}
		};
		// console.log('Row cells - ' + this.numCells);
		// console.log(this.cells);
	},

	render : function() {
		var self = this;
		var $el = this.$el;

		// console.log('Rendering row');
		// console.log($el);

		_(this.filters).each(function(filter) {
			$el.attr("data-filter-" + filter.key.toString().toLowerCase(), filter.value);
		});

		_(this.cells).each(function(cell) {
			$el.append(cell.render().el);
		});
		return this;
	},

	getCellAt : function(index) {
		if ( typeof index == 'number') {
			return this.cells[index];
		}
		return null;
	}
});

var TableCellView = Backbone.View.extend({

	tagName : 'td',

	initialize : function() {
		this.contents = [];
		if ( typeof this.options.contents != 'undefined') {
			this.contents = this.options.contents;
		}
		this.contentRendered = false;
	},

	render : function() {
		var $el = this.$el;
		this.renderContents(false, false);
		return this;
	},

	renderContents : function(force, emptyBeforeRender) {
		// console.log('render cell row');
		if (this.contentRendered && !force) {
			// console.log('content rendered returning');
			return;
		}
		var $el = this.$el;
		if (emptyBeforeRender) {
			$el.empty();
		}
		// console.log('rendering A cell');
		// console.log(this.contents);
		_(this.contents).each(function(content) {
			if ( content instanceof Backbone.View) {
				$el.append(content.render().el);
			} else if ( typeof content != 'undefined') {
				$el.append(content);
			}

		});
		this.contentRendered = true;
	}
});

window.AccordionView = Backbone.View.extend({

	attributes : {
		"data-theme" : "h",
		"data-content-theme" : "g",
		"data-inset" : "false",
		"data-iconpos" : "right",
		"data-collapsed-icon" : "arrow-r",
		"data-expanded-icon" : "arrow-d"
	},

	initialize : function() {
		this.options = _.extend(this.options, this.defaults);
		this.sections = this.options.sections || [];
	},

	render : function() {
		////console.log('rendering accoridon view');
		var $el = this.$el;
		$el.attr("data-role", "collapsible-set");

		var self = this;

		_(this.sections).each(function(section) {
			$el.append(section.render().el);
		});
		////console.log($el);
		////console.log('finish accoridon view');
		return this;
	},

	refresh : function(section) {
		if (!Backbone.isInDOM(this.$el)) {
			return; // not in DOM yet, refresh will not work...
		}
		if (this.$el.closest('.ui-page').length > 0) {
			if (this.$el.hasClass("ui-collapsible-set")) {
				this.$el.collapsibleset('refresh');
			} else {
				this.$el.collapsibleset();
			}

			_(this.sections).each(function(section) {
				section.refresh();
			});
		}
	},

	sectionExpanded : function(section) {
		if ( typeof this.options.expandedHandler == 'function') {
			this.options.expandedHandler(this, section);
		}
	}
});

window.AccordionSection = RefreshableContentView.extend({

	initialize : function() {
		RefreshableContentView.prototype.initialize.apply(this, arguments);
		this.id = Backbone.View.prototype.getUUID.call(this, 'section');
		this.title = "";
	},

	// this function is for manually expand the section
	expand : function() {
		console.log("expand request");
		var self = this;
		if (!this.renderedSubviews) {
			setTimeout(function() {
				self.expand();
			}, 200);
			return;
		}
		setTimeout(function() {
			self.$el.trigger('expand');
		}, 200);
	},

	scrollOnExpand : function() {
		//console.log('default expand handler executed');
		if (this.options.autoScroll) {
			$.mobile.silentScroll(0);
			// scroll to top of page on section expanded
		}
	},

	renderTitle: function () {
		var titleEl = $('<h3/>');
		if (this.options.titleAttributes) {
			_(this.options.titleAttributes).each(function(value, key) {
				titleEl.attr(key, value);
			});
		}
		if (this.options.titleIcon) {
			var icon = $('<span class="ui-icon-' + this.options.titleIconClass + '">&nbsp;</span>');
			icon.addClass('ui-icon-' + this.options.titleIcon);
			titleEl.append(icon);
		}

		titleEl.append(this.title);

		this.$el.append(titleEl);
	},

	clearContent: function () {
		//RefreshableContentView.prototype.clearContent.apply(this, arguments);
		// need to override the default clear content here, just for accordion view...
		_(this.subViews).each(function(view) {
			if (view) {// some might be removed manually
				if (view.useDataTable) {// if there's a tableview with datatable enhance, destroy it first
					view.destroy();
				}
				view.remove().unbind();
			}
		});
		this.subViews = [];

		var $content = this.$el.find('.ui-collapsible-content');
		if ($content.length == 0) {
			$content = this.$el;
		}
		$content.empty();
	},

	render : function() {
		//console.log('Rendering accordion section ');
		RefreshableContentView.prototype.render.apply(this, arguments);

		this.$el.attr("data-role", "collapsible");

		this.renderTitle();

		if (!this.dataReady) {
			this.$el.addClass('data-loading');
		}

		var self = this;
		this.$el.on('expand', function() {
			self.scrollOnExpand();
		});

		return this;
	},

	renderSubviews : function() {
		var $el = this.$el;

		var $content = $el.find('.ui-collapsible-content');
		if ($content.length == 0) {
			$content = $el;
		}

		RefreshableContentView.prototype.renderSubviews.apply(this, [$content]);
	},

	displayMessage: function (message, isError, container) {
		if (container === undefined) {
			container = this.$el.find('.ui-collapsible-content');
			if (container.length == 0) {
				delete container; // no content yet
			}
		}

		RefreshableContentView.prototype.displayMessage.apply(this, arguments);
	},

	isCollapsed : function() {
		return this.$el.hasClass('ui-collapsible-collapsed');
	}
});

window.NavBarView = Backbone.View.extend({

	initialize : function() {

		this.items = this.options.items;

		this.listView = new ListView({
			attributes : {

			},

			items : this.items
		});
	},

	render : function() {
		this.$el.attr('data-role', 'navbar');
		this.$el.append(this.listView.render().el);

		return this;
	}
});

window.TabsView = Backbone.View.extend({

	events : {
		'click .tabs-header a' : 'tabHeaderClick'
	},

	initialize : function() {
		this.tabs = this.options.tabs;
		this.useNicescroll = this.options.useNicescroll || false;
	},

	createHeaderLink : function(tab) {
		var $aHeader = $('<a/>').attr("data-theme", "d").attr("data-role", "button").attr("data-shadow", "false").attr("data-corners", "false").attr("data-inline", "true").attr("href", "#" + tab.id).text(tab.tabName);
		if (tab.removable) {
			$aHeader.attr("data-icon", "delete").attr("data-iconpos", "right");
		}
		return $aHeader;
	},

	render : function() {
		var $el = this.$el;
		var self = this;

		// render the tab header, based on the tabs content view array
		var $header = $('<div/>').addClass('tabs-header');
		var $headerInner = $('<div/>').addClass('tabs-header-inner');
		$header.append($headerInner);
		_(this.tabs).each(function(tab) {
			var $aHeader = self.createHeaderLink(tab);

			$headerInner.append($aHeader);
			tab.$header = $aHeader;
			tab.parent = self;
		});

		/*$('.tabs-header').niceScroll(".tabs-header div", {
		touchbehavior: false,
		usetransition: true,
		hwacceleration: true,
		autohidemode: true
		});*/

		// render the content
		var $content = $('<div/>').addClass('tabs-container');

		_(this.tabs).each(function(tab) {
			$content.append(tab.render().el);
		});

		$el.append($header);
		$el.append($content);

		this.$header = $header;
		this.$headerInner = $headerInner;
		this.$content = $content;

		if (this.useNicescroll) {
			this.enableNicescroll(true);
		}

		// open the first tab...
		this.showTab(0);

		return this;
	},

	refresh : function() {
		this.$el.trigger('create');
	},

	tabHeaderClick : function(e) {
		var anchor = $(e.currentTarget);
		if ($(e.target).hasClass('ui-icon-delete')) {
			this.removeTab(anchor.index());
		} else {
			this.showTab(anchor.index());
		}
		return false;
	},

	showTab : function(index) {
		if (!isNaN(index) && index >= 0 && index < this.tabs.length && index != this.currentIndex) {
			if (!isNaN(this.currentIndex) && this.tabs[this.currentIndex]) {// when a tab is being removed, it will call this method, at that time the active tab was removed
				this.tabs[this.currentIndex].active = false;
				this.tabs[this.currentIndex].$el.hide().trigger('tabhide');
				this.$headerInner.children().eq(this.currentIndex).removeClass('ui-btn-active');
			}
			this.tabs[index].active = true;
			this.tabs[index].$el.show().trigger('tabshow');
			var $aHeader = this.$headerInner.children().eq(index);
			$aHeader.addClass('ui-btn-active');
			this.currentIndex = index;
			this.$header.stop(true, true).animate({
				scrollLeft : $aHeader.position().left
			}, 800);
		}
	},

	addTab : function(tab, index) {
		var $aHeader = this.createHeaderLink(tab);
		if (!index || isNaN(index)) {
			this.tabs.push(tab);
			this.$content.append(tab.render().el);
			this.$headerInner.append($aHeader);
		} else if (index >= 0 && index < this.tabs.length) {
			this.tabs.splice(index, 0, tab);
			this.$content.children().eq(index).before(tab.render().el);
			this.$headerInner.children().eq(index).before($aHeader);
		}
		tab.$header = $aHeader;
		tab.parent = this;
		// trigger jQM button create for late added header
		$aHeader.button();
		if (this.nicescroll) {
			this.nicescroll.resize();
		}
	},

	removeTab : function(mix) {
		var index = -1;
		if (isNaN(mix)) {
			// a tab
			for (var i = 0, j = this.tabs.length; i < j; i++) {
				if (this.tabs[i].id == mix.id) {
					index = i;
					break;
				}
			}
		} else {
			index = mix;
		}

		if (index >= 0 && index < this.tabs.length) {
			var tab = this.tabs[index];

			if (tab.removalHandler) {// if there's a removalHandler defined, call it first
				tab.removalHandler();
			}

			this.tabs.splice(index, 1);

			tab.$header.remove();
			tab.$el.remove();

			if (this.currentIndex > index) {// if the index being removed is less than the selected index, the selected index should be decresed by 1
				this.currentIndex--;
			}

			if (this.tabs.length > 0 && tab.active) {
				// the current index is being removed
				delete this.currentIndex;
				if (index < this.tabs.length) {
					this.showTab(index);
				} else if (index > 0) {
					this.showTab(index - 1);
				}
			}
			delete tab;

			if (this.nicescroll) {
				this.nicescroll.resize();
			}
		}
	},

	enableNicescroll : function(enable) {
		if (enable) {
			this.nicescroll = this.$header.niceScroll({
				zindex : 1000
			});
		} else {
			if (this.nicescroll) {
				this.nicescroll.remove();
				delete this.nicescroll;
			}
		}
	}
});

window.TabContentView = RefreshableContentView.extend({

	initialize : function() {
		RefreshableContentView.prototype.initialize.apply(this, arguments);

		this.id = Backbone.View.prototype.getUUID.call(this, 'tab');
		this.tabName = '';
		this.active = false;
		this.removable = this.options.removable;

		var self = this;
		this.on('dataloading', function() {
			if (self.$header) {
				self.$header.addClass('data-loading');
			}
		});
		this.on('dataready', function() {
			if (self.$header) {
				self.$header.removeClass('data-loading');
			}
		});
	},

	render : function() {
		RefreshableContentView.prototype.render.apply(this, arguments);

		if (!this.dataReady) {
			if (this.$header) {
				this.$header.addClass('data-loading');
			}
		}

		return this;
	}
});

window.PaginationView = Backbone.View.extend({

	attributes : {
		"class" : "pagination-view"
	},

	initialize : function() {
		if ( typeof this.options.pages != 'undefined') {
			this.pages = this.options.pages;
		} else {
			this.pages = [];
		}

		this.options.firstPage = this.options.firstPage || 'first';
		this.options.showPagination = typeof this.options.showPagination == 'undefined' ? true : this.options.showPagination;
		this.options.showInfo = typeof this.options.showInfo == 'undefined' ? false : this.options.showInfo;

		this.pageElements = [];
	},

	render : function() {
		var self = this;
		var $el = this.$el;

		if (this.options.showInfo) {
			this.infoMessageElem = $('<label class="text-blue" />');
			$el.append(this.infoMessageElem);
		}

		if (this.options.showPagination) {
			this.preparePaginationItems();

			if (this.options.topPagination) {
				this.paginationTop = new ListView({
					items : this.paginationItems,
					selectable : true,
					selectOnClick : true,
					firstSelect : this.firstPage,
					attributes : {
						"class" : "pagination-view-page-changer"
					},
					anchorClickHandler : function(e) {
						self.changePage($(e.currentTarget).data('page-view-index'));
						return false;
					}
				});
				$el.append(this.paginationTop.render().el);
			}
		}

		var $pageContainer = $('<div/>').addClass('pagination-view-page-container');
		_(this.pages).each(function(pageContents, index) {
			var $aPage = $('<div/>').addClass('pagination-view-page');
			_(pageContents).each(function(view) {
				$aPage.append(view.render().el);
			});
			$pageContainer.append($aPage);
			self.pageElements.push($aPage);
		});

		this.pageContainerElem = $pageContainer;
		$el.append(this.pageContainerElem);

		if (this.options.showPagination) {
			this.paginationBottom = new ListView({
				items : this.paginationItems,
				selectable : true,
				selectOnClick : true,
				firstSelect : this.firstPage,
				attributes : {
					"class" : "pagination-view-page-changer"
				},
				anchorClickHandler : function(e) {
					self.changePage($(e.currentTarget).data('page-view-index'));
					return false;
				}
			});
			$el.append(this.paginationBottom.render().el);
		}

		this.changePage(this.options.firstPage);
		//swipe change page
		$el.on('swipeleft', function(e) {
			self.changePage('next');
		}).on('swiperight', function(e) {
			self.changePage('prev');
		});
		return this;

	},

	preparePaginationItems : function() {
		if (this.paginationItems) {
			return;
		}
		var self = this;
		var $el = this.$el;
		this.paginationItems = [{
			col1Content : 'First',
			attributes : {
				"class" : "pagination-view-first"
			},
			actionUrl : "#",
			actionAttributes : {
				"data-page-view-index" : "first"
			}
		}];

		_(this.pages).each(function(pageContents, index) {
			var extendPageAttrs = {};
			if (index == 0) {
				extendPageAttrs["class"] = "pagination-view-firstpage";
			} else if (index == self.pages.length - 1) {
				extendPageAttrs["class"] = "pagination-view-lastpage";
			}
			self.paginationItems.push({
				col1Content : index + 1,
				attributes : extendPageAttrs,
				actionUrl : "#",
				actionAttributes : {
					"data-page-view-index" : index
				}
			})
		});

		this.paginationItems.push({
			col1Content : 'Last',
			attributes : {
				"class" : "pagination-view-last"
			},
			actionUrl : "#",
			actionAttributes : {
				"data-page-view-index" : "last"
			}
		});
	},

	changePage : function(index) {
		var pageIndex;
		if (index == 'next') {
			pageIndex = this.currentIndex + 1;
		} else if (index == 'prev') {
			pageIndex = this.currentIndex - 1;
		} else if (index == 'first') {
			pageIndex = 0;
		} else if (index == 'last') {
			pageIndex = this.pages.length - 1;
		} else {
			pageIndex = parseInt(index);
		}

		if (pageIndex >= this.pages.length) {
			pageIndex = this.pages.length - 1;
		}
		if (pageIndex < 0) {
			pageIndex = 0;
		}

		this.pageContainerElem.children().hide();
		this.pageContainerElem.children().eq(pageIndex).show();
		this.currentIndex = pageIndex;
		if (this.options.showPagination) {
			this.paginationBottom.setSelectedIndex(pageIndex + 1);
			if (this.paginationTop) {
				this.paginationTop.setSelectedIndex(pageIndex + 1);
			}
		}

		if (this.options.showInfo) {
			this.infoMessageElem.text(String.format($.i18n.prop('message.pagination'), pageIndex + 1, this.pages.length));
		}
	},

	refresh : function() {

	}
});

// TODO: need to think more about this
var CachableView = Backbone.View.extend({

	initialize : function() {
		this.viewList = {};
	},

	render : function() {

	}
});

