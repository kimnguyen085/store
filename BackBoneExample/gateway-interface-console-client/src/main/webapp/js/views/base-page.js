window.BasePage = GenericPage.extend({

	attributes : {
		'data-theme' : 'd'
	},

	events : {
		"pagebeforeshow" : "pageBeforeShow",  // set up page orientation, height, and other page attributes
		"pageshow" : "pageShow",   // doing nothing at the moment
		"pageinit" : "pageInit",   // get login details
		"pagehide" : "pageHide",   // doing nothing at the moment
		"orientationchange" : "orientationChange"
	},

	initialize : function() {
		// call supper initialize
		GenericPage.prototype.initialize.apply(this, arguments);
		//this.role = sessionStorage.getItem('role');

		this.prepareMenuAndHeader();
	},

	getLoginDetails : function() {
		if (window.loginDetails) {
			this.updateLoginDetails();
			return;
		}
		window.loginDetails = new LoginDetails();
		var self = this;
		window.loginDetails.fetch({
			success : function() {
                self.updateLoginDetails();
			}
		});
	},

	updateLoginDetails : function() {
        console.log("updateLoginDetails");
		this.actionHeader.$el.find('.username').html(window.loginDetails.attributes.userName);
		this.createPanelMenu();
	},

	createPanelMenu: function () {
		this.panelMenuListView = new DefaultMenu({
			selectIndex: this.menuIndex,
			pageId: this.pageId
		});
		var panelContent = this.leftMenuPanel.$el.find('.ui-panel-inner');
		if (panelContent.length == 0) {
			panelContent = $('<div class="ui-panel-inner"/>');
			this.leftMenuPanel.$el.append(panelContent);
		}
		panelContent.append(this.panelMenuListView.render().el);
		this.panelMenuListView.refresh();
		// need to manually attach close event for later render button...
		var self = this;
		this.panelMenuListView.$el.find('a[data-rel=close]').click(function () {
			self.leftMenuPanel.close();
			return false;
		});
	},

	prepareMenuAndHeader : function() {
		var self = this;
		if ( typeof this.menuIndex == 'undefined') {
			this.menuIndex = 1;
		}

		this.actionHeader = new ActionHeader({
			templateName : 'partial/header-action',
			attributes : {// overriding attributes need to override all params
				"data-position" : "fixed",
				"data-theme" : "f",
				"data-tap-toggle" : "false"
			},
			userNameValue : sessionStorage.getItem('api-session-id')
		});
		this.genericHeader = new GenericElementView({
			attributes : {// overriding attributes need to override all params
				"data-role" : "header",
				"data-position" : "fixed",
				"data-theme" : "e",
				"data-tap-toggle" : "false",
				"class" : "header-generic"
			},
			templateName : 'partial/header-generic-action'
		});

		// this.panelMenuListView = DefaultMenu({
			// selectIndex: this.menuIndex,
			// pageId: this.pageId
		// });

		this.actionHeader.mainContents.push(this.genericHeader);

		//this.genericHeader = new GenericHeader();

		this.leftMenuPanel = new GenericPanel({
			attributes : {
				"data-theme" : "c",
				"data-display" : "overlay"
			}
		});
		//this.leftMenuPanel.headers.push(this.genericHeader);
		//this.leftMenuPanel.mainContents.push(this.panelMenuListView);

		this.panels.push(this.leftMenuPanel);
		this.footer = _.template(tpl.get('partial/footer-generic'));
		this.headers.push(this.actionHeader);
	},

	updateContentHeight : function() {
		var $content = this.$el.find('div.ui-content');
		if (!this.headerHeight) {
			var header = this.$el.find('div.ui-header:first');
			this.headerHeight = header.height() + header.border().top + header.border().bottom + header.padding().top + header.padding().bottom;
		}

		if (!this.footerHeight) {
			var footer = this.$el.find('div.ui-footer:first');
			this.footerHeight = footer.height() + footer.border().top + footer.border().bottom + footer.padding().top + footer.padding().bottom;
		}
		// clear min-height set by jQM
		$content.css('min-height', '');
		$content.height(window.innerHeight - this.headerHeight - this.footerHeight - $content.padding().top - $content.padding().bottom);
		// clear the height set by jquery mobile, not sure why with the panel, height was calculated wrongly
		//$content.parent().height(window.innerHeight - this.headerHeight - this.footerHeight).css('min-height', '');
		//this.$el.css('min-height', '');
		this.leftMenuPanel.$el.height(window.innerHeight - this.headerHeight - this.footerHeight);

		// "smartly" setting the numer of data rows
		// since we use iPad's width of 768 to decide number 7
		// a row's size would be 36 pixel
		var newNumberOfRows = app_config.calcNumberOfRows();
		if (app_config.numberOfDataRows != newNumberOfRows) {
			app_config.numberOfDataRows = newNumberOfRows;
			GlobalEvents.trigger('smart:tableresize', app_config.numberOfDataRows);
		}
	},

	togglePanelState : function(shouldOpen) {
		// console.log("shouldOpen");
		// console.log(shouldOpen);
		if ( typeof shouldOpen == 'undefined') {
			shouldOpen = !this.leftMenuPanel.isOpened;
		}
		if (shouldOpen) {
			this.leftMenuPanel.open();
		} else {
			this.leftMenuPanel.close();
		}
	},

	attachHeaderEvents : function() {
		var self = this;
		this.genericHeader.$el.find('a').click(function(e) {
			//console.log('generic header tap');
			self.togglePanelState(true);
			return false;
		});
	},

	updatePanelAndHeaderState : function(forceClose) {
		var shouldClose;
		console.log("forceClose");
		console.log(forceClose);
		if ( typeof forceClose != 'undefined') {
			shouldClose = forceClose;
		} else {
			shouldClose = this.leftMenuPanel.isOpened;
		}
		if (shouldClose) {
			this.togglePanelState(false);
			// this.hiddenGenericHeader.$el.show();
			// this.actionHeader.$el.find('.header-action > .ui-block-a').css('padding-left', this.hiddenGenericHeader.$el.width() + 'px');
		} else {
			this.togglePanelState(true);
			// this.hiddenGenericHeader.$el.stop(true, true).fadeOut();
			// this.actionHeader.$el.find('.header-action > .ui-block-a').css('padding-left', '');
		}
	},

	pageShow : function() {
		this.pageShowHandler();
	},

	pageBeforeShow : function() {
		if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
			this.orientation = 'lanscape';
		} else {
			this.orientation = 'portrait';
		}
		this.updateContentHeight();
		this.attachHeaderEvents();
		//this.updatePanelAndHeaderState(false); // TODO: for this gtablet app only, since it's most likely running on a PC
		this.togglePanelState(false);
		this.pageBeforeShowHandler();
	},

	pageInit : function() {
		var self = this;
		$(window).resize(function(e) {
			self.updateContentHeight();
		});

		this.getLoginDetails();

		this.pageInitHandler();
	},

	pageHide : function() {
		this.pageHideHandler();
	},

	orientationChange : function(e) {
		//console.log(e);
		this.orientation = e.orientation;
		this.updatePanelAndHeaderState();
		this.updateContentHeight();
	},

	pageInitHandler : function() {

	},

	pageShowHandler : function() {

	},

	pageBeforeShowHandler : function() {

	},

	pageHideHandler : function() {
	},

	tapHandler : function() {

	}
});
