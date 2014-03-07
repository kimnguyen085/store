window.LoadFVSPage = BasePage.extend({

	initialize : function() {
		this.menuIndex = 3;
		// call supper initialize
		BasePage.prototype.initialize.apply(this, arguments);

		this.pageId = "loadFVS";
		this.prepareData();
	},

	prepareData : function() {

		this.createTabs();
	},

	createTabs : function() {
		this.tabContentViews = [];
		/**
		 * Tab Fund Register
		 **/
		this.tabFundRegister = new TabFundRegister({
			//model : this.model,
		});

		this.tabContentViews.push(this.tabFundRegister);

		if (FeaturesEnabler.shouldEnable('uploadService')) {
			/**
			 * Tab Upload Register
			 **/
			this.tabUploadRegister = new TabUploadRegister({
				//model : this.model,
			});

			this.tabContentViews.push(this.tabUploadRegister);
		}

		this.tabView = new TabsView({
			tabs : this.tabContentViews
		})

		this.mainContents.push(this.tabView);
	},

	pageInitHandler : function () {
		console.log("loadfvs page init handler");
		this.$el.find('input[type=text]').each(function() {
			$(this).parent().removeClass('ui-corner-all');
		});
		this.$el.find('input[type=file]').each(function() {
			$(this).parent().removeClass('ui-corner-all');
		});
		BasePage.prototype.pageInitHandler.apply(this, arguments);
	},
});