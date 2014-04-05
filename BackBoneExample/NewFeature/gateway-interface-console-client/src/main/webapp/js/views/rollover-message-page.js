window.RolloverMessagesPage = BasePage.extend({

	initialize : function() {
		this.menuIndex = 1;
		this.subMenuIndex = 0;
		// only this needed to be set before calling the base
		// call supper initialize
		BasePage.prototype.initialize.apply(this, arguments);

		this.pageId = "rollover messages";
        this.prepareData();
	},

	prepareData : function() {

		this.createTabs();
	},

	createTabs : function() {
		this.tabContentViews = [];
		/**
		 * Summary Tab
		 **/
		this.tabDailySummary = new TabDailySummaryRollover({
			//model : this.model,
			messagePage : this
		});
		/**
		 * Message Tab
		 **/
		this.tabMessages = new TabRolloverMessages({
			//model : this.model,
			messagePage : this
		});
        /**
         * Send Outgoing Tab
         **/
        this.tabSendOutgoing = new TabSendOutgoing({
            //model : this.model,
            messagePage : this
        });

        // add default tab here
		this.tabContentViews.push(this.tabDailySummary);
		this.tabContentViews.push(this.tabMessages);

        console.log("load the user assigned role");
        // load the user assigned role details once login success. this will be used to evaluate whether to display sender tab
        window.userAssignedRole=[];
        new LoginDetails().fetch({
            async:false,
            success : function(data) {
                console.log("assigned role comes back!");
                window.userAssignedRole=data.toJSON().assignedFunctions;
            }
        });

        // check user assigned role before init sender tab
        if(window.userAssignedRole.indexOf('Response Message Sending Services')!==-1){
            console.log(window.userAssignedRole);
            console.log("enable sender tab");
            this.tabContentViews.push(this.tabSendOutgoing);
        }

        this.tabView = new TabsView({
            tabs : this.tabContentViews,
            useNicescroll : true // need to destroy it when page get destroyed
        })

        this.mainContents.push(this.tabView);

		// this.loadFundAndProductFilters(this.tabDailySummary);
		// this.loadFundAndProductFilters(this.tabMessages);
	},

	triggerReadyCallBack : function(tab) {
		for (var key in tab.ready) {
			if (!tab.ready[key]) {
				return;
			}
		}
		//if(tab.dailySummaryReferenced){ //only call when click onl Error and Total Link on Dailysummary Tab
		//	tab.allReadyHandler();
		//}
		if (tab.allReadyHandler) {
			tab.allReadyHandler();
		}
	},

	drawFundOrProductDropdown : function(tab, source) {
		var parts = source.split('.');

		tab.detailsDropdowns = tab.detailsDropdowns || {};
		tab.detailsDropdowns[parts[0]] = tab.detailsDropdowns[parts[0]] || {};

		if (tab.detailsDropdowns[parts[0]][parts[1]]) {
			tab.detailsDropdowns[parts[0]][parts[1]].remove().unbind();
		}

		tab.detailsDropdowns[parts[0]][parts[1]] = new BindableDropdowView({
			prefixItems : [{
				"_html" : "All",
				"value" : ""
			}], // special items that affect only the display
			dataSet : tab.participant[parts[0]][parts[1]],
			bindableAttribute : {
				"_html" : {
					attribute : parts[0] == "product" ? "productName,usi" : "fundName,abn",
					format : "{0} [{1}]"
				},
				"value" : parts[0] == "product" ? "usi" : "abn"
			},
			attributes : {
				"id" : String.format("{0}-{1}-{2}", tab.tabName, parts[1], parts[0] == "fund" ? "ABN" : "USI"),
				"name" : String.format("{0}{1}", parts[1], parts[0] == "fund" ? "ABN" : "USI"),
				"data-iconshadow" : "false",
				"data-corners" : "false",
				"data-shadow" : "false",
				"data-theme" : "d"
			}
		});

		// tab.detailsDropdowns[parts[0]][parts[1]].setElement(tab.getDropdownContainer(source));
		// tab.detailsDropdowns[parts[0]][parts[1]].render();
		var container = tab.getDropdownContainer(source);
		container.append(tab.detailsDropdowns[parts[0]][parts[1]].render().el);

		tab.detailsDropdowns[parts[0]][parts[1]].refresh();
		container.removeClass('data-loading');
		tab.ready[source] = true;

		this.triggerReadyCallBack(tab);

		// var container = tab.getDropdownContainer(source);
		// container
		// .empty()
		// .append(tab.detailsDropdowns[parts[0]][parts[1]].render().el);
		//
		// tab.detailsDropdowns[parts[0]][parts[1]].refresh();
		// container.removeClass('data-loading');
		// this.ready[source] = true;
	},

	filterProductDropdown : function(tab, selectedFund, source) {
		if (selectedFund != null) {
			tab.detailsDropdowns.product[source].filter({
				abn : selectedFund.attributes.abn
			});
		} else {
			tab.detailsDropdowns.product[source].clearFilters();
			tab.detailsDropdowns.product[source].setSelectedIndex(0);
		}
	},

	attachDropdownEvent : function(tab, source) {
		var self = this;
		tab.detailsDropdowns.fund[source].options.selectChangeHandler = function() {
			self.filterProductDropdown(tab, tab.detailsDropdowns.fund[source].getSelectedObject(), source);
		};
	},

	prepareDropdown : function(tab, source) {
		this.drawFundOrProductDropdown(tab, source);

		var parts = source.split('.');

		if (parts[0] == 'fund') {
			this.attachDropdownEvent(tab, parts[1]);
		}
	},

	loadFundAndProductFilters : function(tab) {
		console.log("call loadFundAndProductFilters");
		tab.participant = new Participant();

		var self = this;
		tab.ready = {
			'fund.source' : false,
			'fund.target' : false,
			'product.source' : false,
			'product.target' : false
		};

		var today = new Date();
		today.setHours(0, 0, 0, 0);

		if (!tab.fromDate || !tab.toDate) {
			tab.fromDate = tab.toDate = today;
		}

		var data = ( {
			fromDate : dateFormat(tab.fromDate, app_config.serverDateTimePattern),
			toDate : dateFormat(tab.toDate, app_config.serverDateTimePattern)
		})

		tab.getDropdownContainer('fund.source').empty().addClass('data-loading');
		tab.participant.fund.source.fetch({
			data : data,
			success : function() {
				self.prepareDropdown(tab, 'fund.source');
			},
			error : function() {
				tab.setDropdownError('fund.source');
				// console.log("Error Source Fund");
				// console.log(arguments);
			}
		});

		tab.getDropdownContainer('product.source').empty().addClass('data-loading');
		tab.participant.product.source.fetch({
			data : data,
			success : function() {
				self.prepareDropdown(tab, 'product.source');
			},
			error : function() {
				tab.setDropdownError('product.source');
				// console.log("Error Source Product");
				// console.log(arguments);
			}
		});

		tab.getDropdownContainer('fund.target').empty().addClass('data-loading');
		tab.participant.fund.target.fetch({
			data : data,
			success : function() {
				self.prepareDropdown(tab, 'fund.target');
			},
			error : function() {
				tab.setDropdownError('fund.target');
			}
		});

		tab.getDropdownContainer('product.target').empty().addClass('data-loading');
		tab.participant.product.target.fetch({
			data : data,
			success : function() {
				self.prepareDropdown(tab, 'product.target');
			},
			error : function() {
				tab.setDropdownError('product.target');
			}
		});
	},

    // load the ebmsmessage header attribute names according to the given message type from server
    loadEbmsMessageHeaderFilter : function(messageType,that) {
        console.log("sender dropdown value="+messageType);
        var self = this;
        var data = ({
            messageType : messageType
        });

        new EbmsMessageHeaderAttributes().fetch({
            async:false,
            data : data,
            success : function(obj) {
                console.log("ebms message header attribute names : "+JSON.stringify(obj.attributes));

                that.find('tr').hide(); // clean the table content
                that.find('input').val(''); // clear the input values
                that.find('input').removeClass('enabledInput');
                $.each(obj.attributes, function(){
                    that.find('#'+this).closest("tr").show(); // enable the tr
                    that.find('#'+this).addClass('enabledInput');
                });
                return obj.attributes;
            },
            error : function(obj) {
                  console.log("failed to fetch EbmsMessageHeader attribute names from server : "+JSON.stringify(obj));
                return;
            }
        });
    },

	pageInitHandler : function() {
		console.log("message page init handler");

		//expand the collapsible
		this.panelMenuListView.$el.children().eq(this.menuIndex).find('#collapsible-message').removeClass('ui-collapsible-collapsed')
									.find('div[aria-hidden=true]').removeClass('ui-collapsible-content-collapsed').attr('aria-hidden','false');

		this.$el.find('input[type=text]').each(function() {
			$(this).parent().removeClass('ui-corner-all').removeClass('ui-btn-corner-all');
		});
		BasePage.prototype.pageInitHandler.apply(this, arguments);
	},

	pageBeforeShowHandler : function() {
		this.tabView.enableNicescroll(true);
	},

	pageHideHandler : function() {
		this.tabView.enableNicescroll(false);
	}
});
