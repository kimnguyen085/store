	/**
 * Tab Fund Register
 **/
window.TabFundRegister = TabContentView.extend({

	initialize : function() {

		TabContentView.prototype.initialize.apply(this, arguments);

		this.tabName = $.i18n.prop('tab.fund.register');
		this.model = new FundRegisters();

		this.prepareContent();

	},

	prepareContent : function() {
		var self = this;
		this.fundRegisterFilter = new GenericElementView({
			tagName : 'form',
			attributes : {
				"action" : "#"
			},
			templateName : 'partial/tab-fund-register-filter',
			fundServiceAddressLabel : $.i18n.prop('loadFVS.info.label.fund.service.address'),
			gatewayServiceAddressLabel : $.i18n.prop('loadFVS.info.label.gateway.service.address'),
			fundNameLabel : $.i18n.prop('loadFVS.info.label.fund.name'),
			abnLabel : $.i18n.prop('loadFVS.info.label.abn'),
			productNameLabel : $.i18n.prop('loadFVS.info.label.product.name'),
			usiLabel : $.i18n.prop('loadFVS.info.label.usi'),

			btnFilter : $.i18n.prop('button.filter'),
			btnClear : $.i18n.prop('button.clear'),
		});

		this.subViews.push(this.fundRegisterFilter);

		this.tableContainer = new GenericElementView({
			attributes : {
				'class': 'table-scroll-wrapper',
			}
		});
		this.subViews.push(this.tableContainer);

		this.setDataReady();

		this.fundRegisterFilter.$el.find('input[type=text]').each(function() {
			$(this).parent().removeClass('ui-corner-all');
		});

		setTimeout(function() {
			self.loadData();
		}, 300);
		//this.tableView.applyFilter(this.fundRegisterFilter.$el.serialize());
		this.attachFilterEvent();

	},

	attachFilterEvent : function() {
		var self = this;
		this.fundRegisterFilter.$el.find('button').on('click', function(e) {

			var type = $(e.currentTarget).data('type');
			if (type == 'filter') {
				self.registerFilter();
			}
			else if (type == 'reset') {
				self.fundRegisterFilter.el.reset();
				//self.tableView.applyFilter(self.fundRegisterFilter.$el.serialize());
			}
			return false;
		});
		return;
	},

	loadData : function(clearFilters) {

		this.blockFilter(true, $.i18n.prop('message.tabs.fund.register.loading'));
		var self = this;
		this.model.fetch({
			success : function() {
				self.drawFundRegisterTable();
			},

			error : function() {
				self.displayMessage($.i18n.prop('message.loadfvs.request.failed'), true);
			},

			complete : function() {
				self.blockFilter(false);
			}
		});
	},

	drawFundRegisterTable : function() {
		this.tableView = new TableView({
			useDataTable : true,
			enableSmartResize : true,
			attributes : {
				"class" : "table-style-1 table-width-180percent medium-text",
				"cellspacing" : "0",
				"cellpadding" : "0",
			},
			bindings : {
				headers : [{
					title : $.i18n.prop('loadFVS.info.label.participant.id'),
					dataAttribute : 'superstreamParticipantId',
					width : '5%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.fund.name'),
					dataAttribute : 'name',
					width : '9%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.product.name'),
					dataAttribute : 'productName',
					width : '4%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.abn'),
					dataAttribute : 'abn',
					width : '5%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.usi'),
					dataAttribute : 'usi',
					width : '6%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.fund.administrator'),
					dataAttribute : 'fundAdministratorId',
					width : '5%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.status'),
					dataAttribute : 'status',
					width : '3%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.effective'),
					dataAttribute : 'effectiveDate',
					width : '5%',
					type : 'numeric',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return dateFormat(value, app_config.dateTimePattern);
					}
				}, {
					title : $.i18n.prop('loadFVS.info.label.end'),
					dataAttribute : 'endDate',
					width : '5%',
					type : 'numeric',
					dataFormat : function(value, type, full) {
						if (type == 'sort' || type == 'filter') {
							return value;
						}
						return dateFormat(value, app_config.dateTimePattern);
					}
				}, {
					title : $.i18n.prop('loadFVS.info.label.contact'),
					dataAttribute : 'contactPerson',
					width : '4%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.phone'),
					dataAttribute : 'contactPhoneNumber',
					width : '4%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.email'),
					dataAttribute : 'emailAddress',
					width : '6%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.client'),
					dataAttribute : 'gatewayClientFlag',
					width : '3%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.participant.type'),
					dataAttribute : 'participantType',
					width : '3%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.profile'),
					dataAttribute : 'profile',
					width : '5%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.fund.service.address'),
					dataAttribute : 'serviceAddressFund',
					width : '12%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.gateway.service.address'),
					dataAttribute : 'serviceAddressGateway',
					width : '12%'
				}, {
					title : $.i18n.prop('loadFVS.info.label.website'),
					dataAttribute : 'websiteAddress',
					width : '6%'
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
		this.tableView.$el.siblings('.dataTables_length').appendTo(this.fundRegisterFilter.$el.find('.table-length-dropdown-placeholder'));
	},

	blockFilter : function(block, message) {
		if (this.firstLoad) {
			return;
		}
		if ( typeof block == 'undefined') {
			block = true;
		}
		if (block) {
			//TODO: disable the account select $('#account-details-accountlist').selectmenu('disable');
			if (this.tableView) {
				this.tableView.$el.block();
			}
			this.fundRegisterFilter.$el.block({
				message : "<div class='data-loading'><span>" + message + "</span></div>"
			});
		} else {
			if (this.tableView) {
				this.tableView.$el.unblock();
			}
			this.fundRegisterFilter.$el.unblock();
		}
	},

	filterTable : function(filterValue) {
		console.log('Applying filter for: ' + filterValue);
		if (this.tableView) {
			this.tableView.$el.fnFilter(filterValue);
		}
	},

	registerFilter : function() {
		var filters = this.tableView.parseFilterString(this.fundRegisterFilter.$el.serialize());
		console.log("filters", filters);
		this.tableView.applyFilter(filters);
	}
});
