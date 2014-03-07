/**
 * Tab Daily Summary
 **/
var dailySummaryFilters = {
	action : {
		"All" : {
			value : ""
		},
		"Initiate Rollover Request" : {
			value : "IRR"
		},
		"Initiate Rollover Error Response" : {
			value : "IRER"
		},
		"Rollover Transaction Request" : {
			value : "RTR"
		},
		"Rollover Transaction Outcome Response" : {
			value : "RTOR"
		},
        "Unknown Request" : {
            value : "UKN"
        }
	}
};
window.TabDailySummary = TabContentView.extend({

	initialize : function() {

		TabContentView.prototype.initialize.apply(this, arguments);

		this.tabName = $.i18n.prop('tab.summary');
		var self = this;
		this.ebmsMessage = new EbmsMessage();

		this.toDate = new Date();
		// get date of defaultDateRange month ago
		this.fromDate = new Date();
		this.fromDate.setMonth(this.fromDate.getMonth() - app_config.defaultDateRange);

		// only get day, month, year of toDate and fromDate
		this.toDate.setHours(0, 0, 0, 0);

		this.fromDate.setHours(0, 0, 0, 0);
		this.filters = {};
		this.filterChanges = {};
		this.firstLoad = true;
		this.ready = {};
		this.messagePage = this.options.messagePage;
		this.prepareFiltersAndContainers();
	},

	prepareFiltersAndContainers : function() {
		this.prepareFilters();
		this.prepareContainers();

		this.setDataReady();

		this.loadFundProductFilters(); //trigger first load of dropdowns

		this.$el.find('input[type=text]').each(function() {
			$(this).parent().removeClass('ui-corner-all');
		});
		this.$el.find('div[class=ui-select]').each(function() {
			$(this).addClass('ui-icon-alt');
		});
		this.populateDropDown();
		this.populateSortAndFilters();

        // set the behavior of ebmsMessageId search input box
        var that = this;
        this.$el.on('keydown', 'input', function(e) {
            if (e.target.name == "ebmsMessageId") {
                $("input[name=conversationId]").val("");    // if user type in ebmsMessageId input box, clear the conversationId input box and other fields
                that.clearData();

                return window.allowNumberOnly(e);
            }else if (e.target.name == "conversationId") {  // if user type in conversationId input box, clear the ebmsMessageId input box and other fields
                $("input[name=ebmsMessageId]").val("");
                that.clearData();
            }
        });

        $('.filter-dropdown-table').hide(); // hide the advanced options table at the start

        // set the behavior of the Advanced Search toggle link
        this.$el.on('click','a[name=advancedSearchLink]',function(e){
            $('.filter-dropdown-table').toggle("fast");
            $('a[name=advancedSearchLink]').hide();
            $('a[name=hideAdvancedSearchLink]').show();
        });

        // set the behavior of the Hide Advanced Search toggle link
        this.$el.on('click','a[name=hideAdvancedSearchLink]',function(e){
            $('.filter-dropdown-table').toggle("fast");
            $('a[name=advancedSearchLink]').show();
            $('a[name=hideAdvancedSearchLink]').hide();
        });


		var self = this;
		setTimeout(function() {// leave some time for the tab to be rendered...
			self.loadData();
		}, 200);
	},

    clearData: function(){
        var today = new Date();
        today.setMonth(today.getMonth() - app_config.defaultDateRange);
        today.setHours(0, 0, 0, 0);
        $("input[name=date_startValue]").val(dateFormat(today, app_config.datePattern)).trigger("change");
        $("input[name=date_endValue]").val(dateFormat(today, app_config.datePattern)).trigger("change");

        $("#tab-daily-summary-type-filter").val('All').selectmenu('refresh');
        $("#Summary-source-ABN").val('All').selectmenu('refresh');
        $("#Summary-source-USI").val('All').selectmenu('refresh');
        $("#Summary-target-ABN").val('All').selectmenu('refresh');
        $("#Summary-target-USI").val('All').selectmenu('refresh');
    },

	loadFundProductFilters: function (fromDate, toDate) {
		this.blockFilter(true, $.i18n.prop('message.fund.product.loading'));
		this.ready['dropdown'] = false;
		this.messagePage.loadFundAndProductFilters(this, fromDate, toDate);
	},

	loadData : function(clearFilters) {
		var data = _.extend({ // copy properties value from this.filters to variable data
			fromDate : dateFormat(this.fromDate, app_config.serverDateTimePattern),
			toDate : dateFormat(this.toDate, app_config.serverDateTimePattern)
		}, this.filters);

		for (var key in data) {
			if (key == 'date_startValue' || key == 'date_endValue'// no need these 2 filters, they were passed along by fromDate and toDate
			|| data[key] === undefined || data[key] === null || data[key].trim() == "") {// delete empty values before sending to server
				delete data[key];
			}
		}

        if(data.ebmsMessageId!==undefined || data.conversationId!==undefined){ // make sure when user search by ebmsMessageId and converstaionId, do NOT include date as criteria
            delete data['fromDate'];
            delete data['toDate'];
        }

		this.blockFilter(true, $.i18n.prop('message.tabs.summary.loading')); // display a loading dialog on top layer of the screen

		var self = this;
		this.clearContainer(this.messageSummaryContainer);

		this.ready['ebmsMessage'] = false;
		this.ebmsMessage.dailySummary.fetch({  // ebmsMessage.dailySummary contains all data required by the table row
			data : data,
			success : function() {
                self.refreshContainer(self.messageSummaryContainer, self.ebmsMessage.dailySummary);
			},

			error : function() {
				self.displayMessage($.i18n.prop('message.tabs.request.failed'), true);
			},

			complete : function() {
				self.ready['ebmsMessage'] = true;
				self.unblockTabDailySummary();
			}
		});

		this.firstLoad = false;
		// reset change state
		this.filterChanges = {};

	},

	isAllDataReady: function () {
		for (var key in this.ready) {
			if (!this.ready[key]) {
				return false;
			}
		}
		return true;
	},

	unblockTabDailySummary : function() {
		if (this.isAllDataReady()) {
			this.blockFilter(false);
		}
	},

	allReadyHandler : function() {
		this.ready['dropdown'] = true;
		this.unblockTabDailySummary();
	},

	prepareFilters : function() {
		var self = this;
		this.dailySummaryFilter = new GenericElementView({
			tagName : 'form',
			attributes : {
				"action" : "#"
			},
			templateName : 'partial/tab-summary-filter',
			fromLabel : $.i18n.prop('label.form.from'),
			toLabel : $.i18n.prop('label.form.to'),
			typeLabel : $.i18n.prop('message.info.label.message.type'),
			sourceFundLabel : $.i18n.prop('label.form.source.fund'),
			sourceProductLabel : $.i18n.prop('label.form.source.product'),
			targetFundLabel : $.i18n.prop('label.form.target.fund'),
			targetProductLabel : $.i18n.prop('label.form.target.product'),
            ebMSMessageIdLabel : $.i18n.prop('label.form.ebms.messageid'), // ebmsMessageId input box label
            conversationIdLabel : $.i18n.prop('label.form.conversationid'),// conversationId input box label
			btnFilter : $.i18n.prop('button.retrieve'),
			btnClear : $.i18n.prop('button.clear'),
			fromDateValue : dateFormat(self.fromDate, app_config.datePattern),
			toDateValue : dateFormat(self.toDate, app_config.datePattern),
            advancedSearchLabel : $.i18n.prop('label.form.advanced.search'), // advanced search link text
            hideAdvancedSearchLabel : $.i18n.prop('label.form.hide.advanced.search') // hide advanced search link text
		});
		this.subViews.push(this.dailySummaryFilter);
	},

	prepareTableContainer : function(name, title) {
		this[name + 'Title'] = new GenericElementView({
			templateName : 'partial/tab-summary-section-title',
			titleLabel : title,
			attributes : {
				"class" : "summary-section-title"
			}
		});
		this[name] = new GenericElementView({
			attributes : {
				"class" : "summary-section-container"
			}
		});

		this.subViews.push(this[name + 'Title']);
		this.subViews.push(this[name]);
		this.subViews.push(new LineBreakView({
			count : 1,
			attributes : {
				"class" : "clear"
			}
		}));
	},

	prepareContainers : function() {
		this.notificationContainer = new GenericElementView({
			attributes : {
				"class" : "daily-summary-notification"
			}
		});

		this.subViews.push(this.notificationContainer);

		this.prepareTableContainer('messageSummaryContainer', $.i18n.prop('title.label.message.summary'));
	},

	disableFilterButton : function(disable) {
		// keep changing their minds...
		// TODO: disable will not disable Filter button anymore, instead, change the text... (and theme :D)
		var $button = this.dailySummaryFilter.$el.find('button[data-type=filter]');
		var $buttoneWrapper = $($button.closest('.ui-btn')[0]);
		var selectTheme = $button.data('select-theme');
		var theme = $button.data('theme');
		if (disable) {
			//$button.button('disable');
			$button.prev().find('.ui-btn-text').text($.i18n.prop('button.refresh'));
			if (selectTheme && theme) {
				$buttoneWrapper.attr('data-theme', selectTheme);
				$buttoneWrapper.removeClass(String.format('ui-btn-up-{0} ui-btn-hover-{0} ui-btn-down-{0}', theme));
				$buttoneWrapper.addClass(String.format('ui-btn-up-{0}', selectTheme));
			}

		} else {
			//$button.button('enable');
			$button.prev().find('.ui-btn-text').text($.i18n.prop('button.retrieve'));
			if (selectTheme && theme) {
				$buttoneWrapper.attr('data-theme', theme);
				$buttoneWrapper.removeClass(String.format('ui-btn-up-{0} ui-btn-hover-{0} ui-btn-down-{0}', selectTheme));
				$buttoneWrapper.addClass(String.format('ui-btn-up-{0}', theme));
			}
		}
	},

	populateDropDown : function() {
		var self = this;
		this.dailySummaryFilter.$el.find("input[type=text]").on('change', function(e) {
			var $select = $(e.target);
			var value = $select.val();
			var name = $select.attr('name');

			var dateStart = self.fromDate;
			var dateEnd = self.toDate;

			if (name == "date_startValue") {
				dateStart = $.fformat.date(value, app_config.datePattern);
				dateStart.setHours(0, 0, 0, 0);
			} else if (name == "date_endValue") {
				dateEnd = $.fformat.date(value, app_config.datePattern);
				dateEnd.setHours(0, 0, 0, 0);
			}

			if (dateStart > dateEnd) {
				Dialog.showMessage($.i18n.prop('message.date.error1'));
				return;
			}

			if (dateStart.getTime() != self.fromDate.getTime() || dateEnd.getTime() != self.toDate.getTime()) {// without getTime, the comparison goes crazy!!!
				self.fromDate = dateStart;
				self.toDate = dateEnd;
				self.loadFundProductFilters(dateStart, dateEnd);
			}
		});
	},

	populateSortAndFilters : function() {
		var self = this;
		var actionItems = [];
		_(dailySummaryFilters.action).each(function(obj, key) {
			actionItems.push({
				label : key,
				value : obj.value
			});
		});
		this.actionFilterDropDown = new DropDownBoxView({
			items : actionItems
		});
		this.actionFilterDropDown.setElement(this.dailySummaryFilter.$el.find('#tab-daily-summary-type-filter'));
		this.actionFilterDropDown.render();
		this.actionFilterDropDown.setSelectedIndex(0);

		this.dailySummaryFilter.changeAttached = this.dailySummaryFilter.changeAttached || 0;
		this.dailySummaryFilter.changeAttached++;
		this.dailySummaryFilter.$el.on('change', function(e) {
			var $select = $(e.target);
			var value = $select.val();
			var name = $select.attr('name');
			if (self.filters[name] != value) {
				self.filterChanges[name] = true;
			} else {
				self.filterChanges[name] = false;
			}
			self.disableFilterButton(!self.filterChanged());
		}).on('submit', function() {
			return false;
		});
		// prevent form submission

		this.dailySummaryFilter.$el.find('button').on('click', function(e) {

			var type = $(e.currentTarget).data('type');
			if (type == 'filter') {

				// get fromDate value of user input
				var dateStartValue = self.dailySummaryFilter.$el.find('input[name=date_startValue]').val();
				var dateStart = $.fformat.date(dateStartValue, app_config.datePattern);
				dateStart.setHours(0, 0, 0, 0);
				// start of day

				// get toDate value of user input
				var dateEndValue = self.dailySummaryFilter.$el.find('input[name=date_endValue]').val();
				var dateEnd = $.fformat.date(dateEndValue, app_config.datePattern);
				dateEnd.setHours(0, 0, 0, 0);

				var actionFilter = self.dailySummaryFilter.$el.find('select[name="action"]').val();  // message action

				if (dateStart > dateEnd) {
					Dialog.showMessage($.i18n.prop('message.date.error1'));
					return false;
				}

                // retrieve parameter values from dom elements
				var sourceFundFilter = self.dailySummaryFilter.$el.find('select[name="sourceABN"]').val();
				var sourceProductFilter = self.dailySummaryFilter.$el.find('select[name="sourceUSI"]').val();
				var targetFundFilter = self.dailySummaryFilter.$el.find('select[name="targetABN"]').val();
				var targetProductFilter = self.dailySummaryFilter.$el.find('select[name="targetUSI"]').val();
                var ebmsMessageIdFilter = self.dailySummaryFilter.$el.find('input[name=ebmsMessageId]').val();
                var conversationIdFilter = self.dailySummaryFilter.$el.find('input[name=conversationId]').val();

				if (true) {// always reload data for now TODO: need to remove it sometime
					// executed when change text Datetime
					//self.fromDate = dateStart;
					//self.toDate = dateEnd;

                    // parameters send to server
					self.filters = {
						sourceABN : sourceFundFilter,
						sourceUSI : sourceProductFilter,
						targetABN : targetFundFilter,
						targetUSI : targetProductFilter,
						action : actionFilter,
						date_startValue : dateFormat(dateStart, app_config.datePattern), // added the 2 values here for changed determination
						date_endValue : dateFormat(dateEnd, app_config.datePattern),
                        ebmsMessageId : ebmsMessageIdFilter,
                        conversationId : conversationIdFilter
					}
					self.disableFilterButton(true);
					self.loadData();
				} else {
					self.filterTable();
				}
			} else if (type == 'reset') {
				self.dailySummaryFilter.el.reset();
				//self.tableView.clearFilter();
				self.disableFilterButton(false);
                self.clearData();
			}
			return false;
		});
	},

	filterChanged : function() {
		if (this.firstLoad) {
			return true;
			// first time loaded, return true for server queries
		}
		for (var key in this.filterChanges) {
			if (this.filterChanges[key]) {
				return true;
			}
		}
		return false;
	},

	getDropdownContainer : function(source) {
		var parts = source.split('.');
		var container = this.dailySummaryFilter.$el.find(String.format('#daily-summary-participant-{0}-{1}-container', parts[0], parts[1]));
		return container.removeClass('text-red');
	},

	setDropdownError : function(source) {
		this.getDropdownContainer(source).empty().addClass('text-red').text('Error');
	},

	clearContainer : function(container) {
		if (container.tableView) {
			container.tableView.destroy();
		}
		container.$el.empty().unbind().addClass('data-loading');
	},

    // display messages in message tab
	showTabMessages : function(dailySummaryDate, dailySummaryDirection, dailySummaryType, dailySummaryError,summaryEbmsMessageId,summaryConversationId) {
		dailySummaryDate = new Date(dailySummaryDate);
		// we have a EPOCH value here...
		var tabMessages = this.parent.tabs[1];
		var dailySummaryReferenced = true;
		var sourceFundFilter = this.dailySummaryFilter.$el.find('select[name="sourceABN"]').val();
		var sourceProductFilter = this.dailySummaryFilter.$el.find('select[name="sourceUSI"]').val();
		var targetFundFilter = this.dailySummaryFilter.$el.find('select[name="targetABN"]').val();
		var targetProductFilter = this.dailySummaryFilter.$el.find('select[name="targetUSI"]').val();
        tabMessages.applyFilter(dailySummaryDate, dailySummaryDate, {
			direction : dailySummaryDirection,
			action : dailySummaryType,
			showErrorOnly : dailySummaryError,
			sourceABN : sourceFundFilter,
			sourceUSI : sourceProductFilter,
			targetABN : targetFundFilter,
			targetUSI : targetProductFilter,
            ebmsMessageId:summaryEbmsMessageId,
            conversationId:summaryConversationId
		}, dailySummaryReferenced);

		this.parent.showTab(1);
	},

	refreshContainer : function(container, collection) {
		this.drawDailySummaryTable(container, collection);
		container.$el.removeClass('data-loading');

		var self = this;
		container.tableView.$el.on('click a', function(e) {  // when user click the link in the summary table
			var $link = $(e.target);// assemble the link for user to click and review the messages
			var dailySummaryDate = $link.data('daily-summary-date');
			var dailySummaryDirection = $link.data('daily-summary-direction');
			var dailySummaryType = $link.data('daily-summary-type');
			var dailySummaryError = $link.data('daily-summary-error');
            var summaryEbmsMessageId = $link.data('summary-ebmsmessageid');
            var summaryConversationId = $link.data('summary-conversationid');
            // open up message tab via a new request to server which uses the above variables as parameters
			if (dailySummaryDate) {
				self.showTabMessages(dailySummaryDate, dailySummaryDirection, dailySummaryType, dailySummaryError, summaryEbmsMessageId, summaryConversationId);
			}
			return false;
		});

		container.tableView.$el.find('span.tooltip-enabled').on('mouseenter', function(e) {
			TooltipHelper.showTooltip(e);
		}).on('mouseleave', function(e) {
			TooltipHelper.hideTooltip(e);
		});
		//var table = this.drawDailySummaryTable(container, collection);
		// //swipe change page
		// table.$el.on('swipeleft', function(e) {
		// table.$el.fnPageChange('next');
		// }).on('swiperight', function(e) {
		// table.$el.fnPageChange('previous');
		// });
	},

    // bind data with link parameters
	    linkToDetails : function(linkText, fullRowData, showErrorOnly) {
        var ebmsId=$("input[name=ebmsMessageId]").val();
        var convId=$("input[name=conversationId]").val();
        // 'inject' ebmsMessageId and conversationId values to the link param
        var link=String.format('<a href="#" data-daily-summary-date="{0}", data-daily-summary-direction="{1}", data-daily-summary-type="{2}", data-daily-summary-error="{3}", data-summary-ebmsMessageId="{5}", data-summary-conversationId="{6}">{4}</a>', fullRowData[0], fullRowData[1], fullRowData[2].trim(), showErrorOnly, linkText,ebmsId,convId);
        return link;
	},

    // draw the datatable which will contain the search result
	drawDailySummaryTable : function(container, collection) {
		var self = this;
		container.tableView = new TableView({
			useDataTable : true,
			enableSmartResize : true,
			attributes : {
				"class" : "table-style-1",
				"cellspacing" : "0",
				"cellpadding" : "0"
			},
			bindings : {
				headers : [{
					title : $.i18n.prop('message.info.label.date'),
					dataAttribute : 'date',
					width : '20%',
					type : 'numeric',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return dateFormat(value, app_config.datePattern);
					}
				}, {
					title : $.i18n.prop('message.info.label.direction'),
					dataAttribute : 'direction',
					width : '15%',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return $.i18n.prop(String.format('message.info.label.direction.{0}', value));
					}
				}, {
					title : $.i18n.prop('message.info.label.type'),
					dataAttribute : 'messageAction',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return String.format("<span class='tooltip-enabled' title='Rollover Transaction Request'>{0}</span>", value);
					},
					width : '15%'
				}, {
					title : $.i18n.prop('message.info.label.succeeded'),
					dataAttribute : 'totalSucceeded',
					nullValue : 0,
					width : '20%',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return nformat(value, '#,##0');
					}
				},{
					title : $.i18n.prop('message.info.label.errors'),
					dataAttribute : 'totalErrors',
					width : '10%',
					type : 'numeric',
					nullValue : 0,

					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return self.linkToDetails(nformat(value, '#,##0'), full, 'true');
					}
				}, {
					title : $.i18n.prop('message.info.label.grand.total'),
					dataAttribute : 'grandTotal',
					width : '20%',
					type : 'numeric',
					nullValue : 0,
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return self.linkToDetails(nformat(value, '#,##0'), full, 'false');
					}
				}],
				data : collection.toJSON()
			}
		});

		container.$el.append(container.tableView.render().el);

		container.tableView.enableDataTable({
			"sDom" : "lrtip",
			"sPaginationType" : "full_numbers",
			"iDisplayLength" : app_config.numberOfDataRows,
			"bAutoWidth" : false
		});
	},

	displayMessage : function(message, isError) {
		this.notificationContainer.$el.empty();
		this.notificationContainer.$el.append(message);
		if (isError) {
			this.notificationContainer.$el.addClass('text-red');
		}
	},

	blockFilter : function(block, message) {
		if ( typeof block == 'undefined') {
			block = true;
		}
		if (block && !this.blockingFilter) {
			//TODO: disable the account select $('#account-details-accountlist').selectmenu('disable');
			if (this.tableView) {
				this.tableView.$el.block();
			}
			this.dailySummaryFilter.$el.block({
				message : "<div class='data-loading'><span>" + message + "</span></div>"
			});
		} else {
			if (this.tableView) {
				this.tableView.$el.unblock();
			}
			this.dailySummaryFilter.$el.unblock();
		}
		this.blockingFilter = block;
	},

	filterTable : function() {
		var filters = this.tableView.parseFilterString(this.dailySummaryFilter.$el.serialize());
		this.tableView.applyFilter(filters);
	}
	// sortTable : function() {
	// var aasort = [[this.sortDropdown.getSelectedIndex(), this.sortDirectionDropdown.getSelectedValue()]];
	// this.tableView.$el.fnSort(aasort);
	// }
});
