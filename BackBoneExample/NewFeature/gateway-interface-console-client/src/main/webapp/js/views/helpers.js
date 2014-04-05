window.FeaturesEnabler = {
	shouldEnable: function (featureName) {
		var functionsMap = app_config.functionMapping[featureName];
		var assignedFunctions = window.loginDetails !== undefined ? window.loginDetails.attributes.assignedFunctions : undefined;
		if (functionsMap && functionsMap.length > 0 && assignedFunctions) {
			for (var i = 0, j = functionsMap.length; i < j; i++) {
				if ($.inArray(functionsMap[i], assignedFunctions) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

window.DefaultMenu = function(options) {

	if (isNaN(options)) {
		selectIndex = options.selectIndex || 1;
		pageId = options.pageId;
	} else {
		selectIndex = options || 1;
	}

	pageId = pageId || 'home';

	var listItems = [];

    listItems.push({
        "_html" : String.format('<a data-rel="close" href="#{0}"><center>{1}</center></a>', pageId, $.i18n.prop('menu.close')),
        "data-icon" : "delete",
        "data-iconshadow" : "false"
    });

	listItems.push({
		"_html" : String.format("<a href='#messages'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.message')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false"
	});

	listItems.push({
		"_html" : String.format("<a href='#administration'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.administration')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false",
	});

	if (FeaturesEnabler.shouldEnable('fundRegisterService')) {
		listItems.push({
			"_html" : String.format("<a href='#loadFVS'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.loadfvs')),
			"data-icon" : "blue-dark-arrow-right",
			"data-iconshadow" : "false"
		});
	}

	listItems.push({
		"_html" : String.format("<a href='#logout'><span class='ui-icon-fo ui-icon-fo-logout'></span>{0}</a>", $.i18n.prop('menu.logout')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false"
	});

	return new BindableListView(_.extend({
		dataSet : listItems,
		selectable : true,
		selectOnClick: false,
		firstSelect : selectIndex,
		attributes : {
			"data-role" : "listview",
			"data-theme" : "d",
			"class" : "left-nav ui-icon-nodisc"
		}
	}, options));
};

window.AdvancedMenu = function(options) {

	if (isNaN(options)) {
		selectIndex = options.selectIndex || 1;
		pageId = options.pageId;
	} else {
		selectIndex = options || 1;
	}

	pageId = pageId || 'home';

	var listItems = [];
	var subListMessageItems = [];
	var subListAdminItems = [];

	this.menuCollapsibleMessage = new MenuCollapsible({
		title : "Message",
		attributes : {
			"id" : "collapsible-message",
		}
	});

	this.menuCollapsibleAdmin = new MenuCollapsible({
		title : "Administration",
		attributes : {
			"id" : "collapsible-admin",
		}
	});
	
	subListMessageItems.push({
		"_html" : String.format("<a href='#rolloverMessages'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.message.rollover')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false",
	});
	subListMessageItems.push({
		"_html" : String.format("<a href='#contributionMessages'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.message.contribution')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false",
	});

	subListAdminItems.push({
		"_html" : String.format("<a href='#administration'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.administration.setuserView')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false",
	});
	
	this.menuCollapsibleMessage.listView = new BindableListView({
		dataSet : subListMessageItems,
		selectable : true,
		selectOnClick: false,
//		firstSelect : 1,
		attributes : {
			"data-role" : "listview",
			"data-theme" : "d",
			"class" : "left-nav ui-icon-nodisc"
		}
	});

	this.menuCollapsibleAdmin.listView = new BindableListView({
		dataSet : subListAdminItems,
		selectable : true,
		selectOnClick: false,
		attributes : {
			"data-role" : "listview",
			"data-theme" : "d",
			"class" : "left-nav ui-icon-nodisc"
		}
	});
	
	
    listItems.push({
        "_html" : String.format('<a data-rel="close" href="#{0}"><center>{1}</center></a>', pageId, $.i18n.prop('menu.close')),
        "data-icon" : "delete",
        "data-iconshadow" : "false",
    });

    listItems.push({
        "_html" : this.menuCollapsibleMessage.render().el
    });
    
    listItems.push({
    	"_html" : this.menuCollapsibleAdmin.render().el
    });

	if (FeaturesEnabler.shouldEnable('fundRegisterService')) {
		listItems.push({
			"_html" : String.format("<a href='#loadFVS'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.loadfvs')),
			"data-icon" : "blue-dark-arrow-right",
			"data-iconshadow" : "false"
		});
	}

	listItems.push({
		"_html" : String.format("<a href='#logout'><span class='ui-icon-fo ui-icon-fo-logout'></span>{0}</a>", $.i18n.prop('menu.logout')),
		"data-icon" : "blue-dark-arrow-right",
		"data-iconshadow" : "false"
	});

	return new BindableListView(_.extend({
		dataSet : listItems,
		selectable : true,
		selectOnClick: false,
		firstSelect : selectIndex,
		subMenuSelect : options.subIndex,
		attributes : {
			"data-role" : "listview",
			"data-theme" : "d",
			"class" : "left-nav ui-icon-nodisc"
		}
	}, options));
}
