var contributionMessageFilters = {
	direction : {
		"All" : {
			value : ""
		},
		"Incoming" : {
			value : "In"
		},
		"Outgoing" : {
			value : "Out"
		}
	},
	action : {
		"Contribution Transaction Request" : {
			value : "CTR"
		},
		"Contribution Transaction Error Response" : {
			value : "CTER"
		},
		"Member Registration Request" : {
			value : "MRR"
		},
		"Member Registration Outcome Response" : {
			value : "MROR"
		},
//		"MbrRegAndContTrxnRequest" : {
//			value : "MRR_CTR"
//		},
//		"MbrRegAndContTrxnResponse" : {
//			value : "MROR_CTER"
//		},
        "Unknown Request" : {
            value : "UKN"
        }
	}
};

/**
 * Tab Contribution Messages
 **/
window.TabContributionMessages = TabContentView.extend({

	initialize : function() {

		TabContentView.prototype.initialize.apply(this, arguments);

		this.tabName = $.i18n.prop('tab.messages');
		var self = this;
		this.model = new EbmsMessages();

		this.today = new Date();

		this.toDate = new Date(this.today.getTime());
		// so that we have the same date value
		// get date of defaultDateRange month ago
		this.fromDate = new Date(this.today.getTime());
		this.fromDate.setDate((this.fromDate.getDate() - app_config.defaultDateRange));
		this.fromDate.setHours(0, 0, 0, 0);
		// start of day
		this.filters = {
			direction : "",
			action : "",
			sourceEntity : "",
			targetABN : "",
			targetUSI : ""
		};
		this.filterChanges = {};
		this.firstLoad = true;
		this.loadDataComplete = true; // we didn't have a call to loadData on initialize, so we need to set this flag
		this.ready = {};

		this.messagePage = this.options.messagePage;

		this.prepareContent();
	},

	prepareContent : function() {
		var self = this;
		this.messagesFilter = new GenericElementView({
			tagName : 'form',
			attributes : {
				"action" : "#"
			},
			templateName : 'partial/tab-contribution-messages-filter',
			messageTypeLabel : $.i18n.prop('message.type.contribution'),
			fromLabel : $.i18n.prop('label.form.from'),
			toLabel : $.i18n.prop('label.form.to'),
			directionLabel : $.i18n.prop('label.form.direction'),
			actionLabel : $.i18n.prop('label.form.messgae.type'),
			sourceEntityLabel : $.i18n.prop('label.form.source.entity'),
			targetFundLabel : $.i18n.prop('label.form.target.fund'),
			targetProductLabel : $.i18n.prop('label.form.target.product'),
			textCheck : $.i18n.prop('label.form.add.error.only'),

			btnFilter : $.i18n.prop('button.retrieve'),
			btnClear : $.i18n.prop('button.clear'),
			fromDateValue : dateFormat(self.fromDate, app_config.datePattern),
			toDateValue : dateFormat(self.toDate, app_config.datePattern)
		});

		this.messagesFilter.changed = true;
		// this is for the first load

		this.subViews.push(this.messagesFilter);

		this.tableContainer = new GenericElementView();

		this.subViews.push(this.tableContainer);
		this.setDataReady();

		this.loadFundProductFilters(); // trigger firstload

		this.messagesFilter.$el.find('input[type=text]').each(function() {
			$(this).parent().removeClass('ui-corner-all');
		});

		this.populateSortAndFilters();   // fill options to select elements
		this.populateDropDown();  //  define date onchange behavior
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
		var container;
		if (parts[0] == "source" && parts[1] == "entity") {
			container = this.messagesFilter.$el.find(String.format('#message-{0}-{1}-container', parts[0], parts[1]));
		} else {
			container = this.messagesFilter.$el.find(String.format('#message-participant-{0}-{1}-container', parts[0], parts[1]));
		}
		return container.removeClass('text-red');
	},

	setDropdownError : function(source) {
		this.getDropdownContainer(source).empty().addClass('text-red').text($.i18n.prop('message.error.requert.dropdown'));
	},

	disableFilterButton : function(disable) {
		// keep changing their minds...
		// TODO: disable will not disable Filter button anymore, instead, change the text... (and theme :D)
		var $button = this.messagesFilter.$el.find('button[data-type=filter]');
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
		this.messagesFilter.$el.find("input[type=text]").on('change', function(e) {
			var $select = $(e.target);
			var value = $select.val();
			var name = $select.attr('name');

			var dateStart = self.fromDate;
			var dateEnd = self.toDate;

			if (name == "receivedDatetime_startValue") {
				dateStart = $.fformat.date(value, app_config.datePattern);
				dateStart.setHours(0, 0, 0, 0);
			}
			if (name == "receivedDatetime_endValue") {
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
		// create the filter list
		//var filterValues = self.tableView.getFilterValues();
		var directionItems = [];
		var actionItems = [];
		_(contributionMessageFilters.direction).each(function(obj, key) {
			directionItems.push({
				label : key,
				value : obj.value
			});
		});
		_(contributionMessageFilters.action).each(function(obj, key) {
			actionItems.push({
				label : key,
				value : obj.value
			});
		});

		this.directionFilterDropDown = new DropDownBoxView({
			items : directionItems
		});
		this.actionFilterDropDown = new DropDownBoxView({
			items : actionItems
		});

		this.directionFilterDropDown.setElement(this.messagesFilter.$el.find('#tab-messages-direction-filter'));
		this.directionFilterDropDown.render();
		this.directionFilterDropDown.setSelectedIndex(0);

		this.actionFilterDropDown.setElement(this.messagesFilter.$el.find('#tab-messages-type-filter'));
		this.actionFilterDropDown.render();
		this.actionFilterDropDown.setSelectedIndex(0);

		this.messagesFilter.$el.on('change', function(e) {
			//if (e.target.name != "receivedDatetime_startValue" && e.target.name != "receivedDatetime_endValue") {
			var $select = $(e.target);
			var value;
			if ($select.attr('type') == 'checkbox') {
				value = $select.is(':checked') ? "true" : "false";
			} else {
				value = $select.val();
			}

			var name = $select.attr('name');
			//if (self.filters[name] != "" && self.filters[name] != value) { // this was for client filter
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

		this.messagesFilter.$el.find('button').on('click', function(e) {
			if (!self.dataReady) {
				return false;
			}

			var type = $(e.currentTarget).data('type');
			if (type == 'filter') {

				var directionFilter = self.messagesFilter.$el.find('select[name="direction"]').val();
				var actionFilter = self.messagesFilter.$el.find('select[name="action"]').val();
				var sourceEntityFilter = self.messagesFilter.$el.find('select[name="sourceentity"]').val();
				var targetFundFilter = self.messagesFilter.$el.find('select[name="targetABN"]').val();
				var targetProductFilter = self.messagesFilter.$el.find('select[name="targetUSI"]').val();
				var showErrorOnlyFilter = self.messagesFilter.$el.find('input[name=showErrorOnly]').is(':checked') ? "true" : "false";

				// get fromDate value of user input
				var dateStartValue = self.messagesFilter.$el.find('input[name=receivedDatetime_startValue]').val();
				var dateStart = $.fformat.date(dateStartValue, app_config.datePattern);

				// get toDate value of user input
				var dateEndValue = self.messagesFilter.$el.find('input[name=receivedDatetime_endValue]').val();
				var dateEnd = $.fformat.date(dateEndValue, app_config.datePattern);
				if (dateStart > dateEnd) {
					Dialog.showMessage($.i18n.prop('message.date.error1'));
					return false;
				}

				if (true) {// always reload data for now TODO: need to remove it sometime
					self.applyFilter(dateStart, dateEnd, {
						direction : directionFilter,
						action : actionFilter,
						sourceEntity : sourceEntityFilter,
						targetABN : targetFundFilter,
						targetUSI : targetProductFilter,
						showErrorOnly : showErrorOnlyFilter,
						receivedDatetime_startValue : dateFormat(dateStart, app_config.datePattern), // added the 2 values here for changed determination
						receivedDatetime_endValue : dateFormat(dateEnd, app_config.datePattern)
					});
				} else {
					self.filterTable();
				}

			} else if (type == 'reset') {
				self.messagesFilter.el.reset();
				//self.tableView.clearFilter();
				self.disableFilterButton(false);
                self.clearData();
			}
			return false;
		});
	},

    clearData: function(){
        var today = new Date();
        today.setMonth(today.getMonth() - app_config.defaultDateRange);
        today.setHours(0, 0, 0, 0);
        this.messagesFilter.$el.find("input[name=receivedDatetime_startValue]").val(dateFormat(today, app_config.datePattern)).trigger("change");
        this.messagesFilter.$el.find("input[name=receivedDatetime_endValue]").val(dateFormat(today, app_config.datePattern)).trigger("change");

        this.messagesFilter.$el.find("#tab-messages-type-filter").val('All').selectmenu('refresh');
        this.messagesFilter.$el.find("#tab-messages-direction-filter").val('All').selectmenu('refresh');
        this.messagesFilter.$el.find("#Messages-source-entity").val('All').selectmenu('refresh');
        this.messagesFilter.$el.find("#Messages-target-ABN").val('All').selectmenu('refresh');
        this.messagesFilter.$el.find("#Messages-target-USI").val('All').selectmenu('refresh');
        this.messagesFilter.$el.find("#check-error-only").prop('checked', false).checkboxradio('refresh');
    },

	loadFundProductFilters: function (fromDate, toDate) {
		this.blockFilter(true, $.i18n.prop('message.fund.product.loading'));
		this.allDropdownReady = false;
		this.messagePage.loadFundAndProductFilters(this, fromDate, toDate);
	},

	loadData : function(clearFilters) {
		var self = this;

        var data = _.extend({ // copy properties value from this.filters to variable data
            fromDate : dateFormat(this.fromDate, app_config.serverDateTimePattern),
            toDate : dateFormat(this.toDate, app_config.serverDateTimePattern)
        }, this.filters);

		var data = _.extend({
			fromDate : dateFormat(this.fromDate, app_config.serverDateTimePattern),
			toDate : dateFormat(this.toDate, app_config.serverDateTimePattern)
		}, this.filters);

		for (var key in data) {
			if (key == 'receivedDatetime_startValue' || key == 'receivedDatetime_endValue'// no need these 2 filters, they were passed along by fromDate and toDate
			|| data[key] === undefined || data[key] === null || data[key] == "") {// delete empty values before sending to server
				delete data[key];
			}
		}

		this.blockFilter(true, $.i18n.prop('message.tabs.message.loading'));
		this.loadDataComplete = false;
		self.model.fetch({
			data : data,
			success : function() {
				self.refreshContent();
			},
			error : function() {
				self.displayMessage($.i18n.prop('message.tabs.request.failed'), true);
			},
			complete : function() {
				self.loadDataComplete = true;
				self.unblockTabMessages();
			}
		});
		this.firstLoad = false;
		// clear the firstload flag
	},

	refreshContent : function() {

		// reset change state
		this.filterChanges = {};

		// draw Messages Table
		this.drawMessagesTable();

		var self = this;
		this.tableView.$el.on('click', 'a', function(e) {
			var messageId = $(e.target).data('messageid');
			if (messageId) {
				self.showDetails(messageId);
			}
			return false;
		});

		this.tableView.$el.find('span.tooltip-enabled').on('mouseenter', function(e) {
			TooltipHelper.showTooltip(e);
		}).on('mouseleave', function(e) {
			TooltipHelper.hideTooltip(e);
		});

		// disable filter button
		this.disableFilterButton(true);

		//swipe change page
		// var self = this;
		// this.tableView.$el.on('swipeleft', function(e) {
		// self.tableView.$el.fnPageChange('next');
		// }).on('swiperight', function(e) {
		// self.tableView.$el.fnPageChange('previous');
		// });

		//self.filterTable();
		// filter table
	},

	drawMessagesTable : function() {
		var self = this;
		if (this.tableView) {
			this.messagesFilter.$el.find('.table-length-dropdown-placeholder').empty();
			this.tableView.$el.fnDestroy();
			this.tableView.remove().unbind();
		}
		this.tableView = new TableView({
			useDataTable : true,
			enableSmartResize : true,
			attributes : {
				"class" : "table-style-1 medium-text",
				"cellspacing" : "0",
				"cellpadding" : "0"
			},
			bindings : {
				headers : [{
					title : $.i18n.prop('message.info.label.id'),
					dataAttribute : 'ebmsMessageId',
					width : '5%'
				}, {
					title : $.i18n.prop('message.info.label.conversation.id'),
					dataAttribute : 'conversationId',
					width : '17%',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return self.linkToDetails(value, full);
					}
				}, {
					title : $.i18n.prop('message.info.label.message.type.short'),
					dataAttribute : 'messageActionId.name,messageActionId.shortCode',
					dataAttributeFormat : "<span class='tooltip-enabled' title='{0}'>{1}</span>",
					width : '8%'
				}, {
					title : $.i18n.prop('message.info.label.direction'),
					dataAttribute : 'direction',
					width : '7%',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return $.i18n.prop(String.format('message.info.label.direction.{0}', value));
					}
				}, {
					title : $.i18n.prop('message.info.label.status'),
					dataAttribute : 'errorStatus',
					width : '7%',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return self.displayStatusIcon(value);
					},
					aoColumn : {
						sClass : "alignment-center"
					}
				}, {
                    title : $.i18n.prop('message.info.label.parts'),
                    dataAttribute : 'ebmsMessagePartCount',
                    width : '9%',
                    type : 'numeric',
                    dataFormat : function(value, type, full) {
                        if (type == 'sort' || type == 'filter') {
                            return value;
                        }
                        return nformat(value, '#,##0');;
                    }
                }, {
                    title : $.i18n.prop('message.info.label.received'),
                    dataAttribute : 'receivedDatetime',
                    width : '9%',
                    type : 'numeric',
                    dataFormat : function(value, type, full) {
                        if (type == 'sort' || type == 'filter') {
                            return value;
                        }
                        return dateFormat(value, app_config.dateTimePattern);
                    }
                },{
					title : $.i18n.prop('message.info.label.deliver'),
					dataAttribute : 'completedDatetime',
					nullValue : '',
					width : '9%',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						if (full[3] == 'In') {
							return 'N/A';
						}
						if ( typeof value != 'number') {
							return value;
						}
						return dateFormat(value, app_config.dateTimePattern);
					}
				}],
				data : this.model.toJSON()
			}
		});

		this.tableContainer.$el.empty().append(this.tableView.render().el);

		this.tableView.enableDataTable({
			"sDom" : "lrtip",
			"sPaginationType" : "full_numbers",
			"iDisplayLength" : app_config.numberOfDataRows,
			"bAutoWidth" : false
		});

		this.tableView.$el.siblings('.dataTables_length').appendTo(this.messagesFilter.$el.find('.table-length-dropdown-placeholder'));
	},

	displayStatusIcon : function(value) {
		if (value == "Ok") {//value == "Done"
			var template = _.template(tpl.get('partial/icon-green-tick'));
			return template({
				value : ""
			});
		} else if (value == "Error") {
			var template = _.template(tpl.get('partial/icon-red-cross'));
			return template({
				value : ""
			});
        } else if (value == "Warning") {
            var template = _.template(tpl.get('partial/icon-yellow-warning'));
            return template({
                value : ""
            });
        } else {
			value = "";
			return value;
		}
	},

	linkToDetails : function(value, fullRow) {
		return String.format('<a href="#" data-messageid="{0}">{1}</a>', fullRow[0], value);
	},

	showDetails : function(messageId) {
		// this.parent.showTab(2); // the details tab
		// this.parent.tabs[2].showMessageDetails(messageId);
		var tabDetails = new TabContributionDetails({
			removable : true,
			showFilter : false
		});
		tabDetails.tabName = String.format('Details [{0}]', messageId);
		// TODO: move this to properties file
		this.parent.addTab(tabDetails);
		tabDetails.showMessageDetails(messageId);
		this.parent.showTab(this.parent.tabs.length - 1);
	},

	blockFilter : function(block, message) {
		if ( typeof block == 'undefined') {
			block = true;
		}
		console.log('Block filter requested, ', block);
		if (block && !this.blockingFilter) {
			//TODO: disable the account select $('#account-details-accountlist').selectmenu('disable');
			if (this.tableView) {
				this.tableView.$el.block();
			}
			this.messagesFilter.$el.block({
				message : "<div class='data-loading'><span>" + message + "</span></div>"
			});
		} else {
			if (this.tableView) {
				this.tableView.$el.unblock();
			}
			this.messagesFilter.$el.unblock();
		}
		this.blockingFilter = block;
	},

	unblockTabMessages : function() {
		if (this.loadDataComplete && this.allDropdownReady) {
			this.blockFilter(false);
		}
	},

	filterTable : function() {
		if (this.tableView) {
			var filters = this.tableView.parseFilterString(this.messagesFilter.$el.serialize());
			this.tableView.applyFilter(filters);
		}
	},

	allReadyHandler : function() {
		this.detailsDropdowns.source.entity.setSelectedValue(this.filters.sourceABN);
		this.detailsDropdowns.fund.target.setSelectedValue(this.filters.targetABN);
		this.detailsDropdowns.product.target.setSelectedValue(this.filters.targetUSI);

		console.log('tab message allready handler');

		this.allDropdownReady = true;
		this.unblockTabMessages();
	},

	setDropdownValues : function(values) {
		this.directionFilterDropDown.setSelectedValue(values.direction);
		this.actionFilterDropDown.setSelectedValue(values.action);
	},

    // request server to fetch data
	applyFilter : function(dateStart, dateEnd, filters, dailySummaryReferenced) {
		this.fromDate = dateStart || this.fromDate;
		this.toDate = dateEnd || this.toDate;

		this.fromDate.setHours(0, 0, 0, 0);
		// start of day
		this.toDate.setHours(0, 0, 0, 0);
		// start of day

		this.filters = filters || this.filters;

		//reset from
		if (dailySummaryReferenced) {

			// reloading data for fund and product dropdown boxes
			this.loadFundProductFilters(this.fromDate, this.toDate);

			this.messagesFilter.$el.find('input[name=receivedDatetime_startValue]').val(dateFormat(dateStart, app_config.datePattern));
			this.messagesFilter.$el.find('input[name=receivedDatetime_endValue]').val(dateFormat(dateStart, app_config.datePattern));

			this.setDropdownValues(filters);

			if (this.filters.showErrorOnly == 'true') {
				this.messagesFilter.$el.find('#check-error-only').prop('checked', true);
			} else {
				this.messagesFilter.$el.find('#check-error-only').prop('checked', false);
			}
		}

		var self = this;
		setTimeout(function() {
			self.loadData();
		}, 200);
	}
	// sortTable : function() {
	// var aasort = [[this.sortDropdown.getSelectedIndex(), this.sortDirectionDropdown.getSelectedValue()]];
	// this.tableView.$el.fnSort(aasort);
	// }

});
