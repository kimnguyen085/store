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
		"data-iconshadow" : "false"
	});

	var loadFVS = false;
	if (window.loginDetails && window.loginDetails.attributes.authorised) {
		listItems.push({
			"_html" : String.format("<a href='#loadFVS'><span class='ui-icon-fo ui-icon-fo-templates'></span>{0}</a>", $.i18n.prop('menu.loadfvs')),
			"data-icon" : "blue-dark-arrow-right",
			"data-iconshadow" : "false"
		});
		loadFVS = true;
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
		},
		loadFVS: loadFVS
	}, options));
}

window.DefaultAdviserMenu = function(selectIndex) {

}