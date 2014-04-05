var messagesType = {
		"Rollover Messages" : {
			value : "Rollover Messages"
		},
		"Contribution Messages" : {
			value : "Contribution Messages"
		}
};
window.AdministrationPage = BasePage.extend({

	initialize : function() {
		this.menuIndex = 2;
		this.subMenuIndex = 0;

		BasePage.prototype.initialize.apply(this, arguments);
		this.setUserMessageView = new GenericElementView({
			tagName: 'form',
			attributes : {
				'id' : 'admin-setUserMessageView',
				'method' : 'post',
				'action' : gapi_config.baseApiUrl + gapi_config.setUserViewUrl
			},
			templateName : 'partial/set-user-message-view',
			usernameLabel : $.i18n.prop('label.form.usernameLabel'),
			messageviewLabel : $.i18n.prop('label.setuserview.messageview'),
			btnSet : $.i18n.prop('button.setUserView')
		});
		this.pageId = "administration";
		this.mainContents.push(this.setUserMessageView);
		this.setUserMessageView.render();
        this.prepareData();
	},
	
	prepareData : function() {
		var viewTypeItems = [];
		_(messagesType).each(function(obj, key) {
			viewTypeItems.push({
				label : key,
				value : obj.value
			});
		});
		this.messageViewDropDown = new DropDownBoxView({
			items : viewTypeItems
		});
		this.messageViewDropDown.setElement(this.setUserMessageView.$el.find("#messages-view-type"));
		this.messageViewDropDown.render();
		this.messageViewDropDown.setSelectedIndex(0);
		
	},

	prepareDropdown : function(tab, source) {

		var parts = source.split('.');

		if (parts[0] == 'fund') {
		}
	},


	pageInitHandler : function() {
		console.log("administration page init handler");
		this.setUserMessageView.$el.find('input').each(function() {
			//remove the corner
			$(this).parent().removeClass('ui-corner-all');
		});
		var self = this;
		this.setUserMessageView.$el.submit(function () {
			return self.submitUserView();
		});

		//expand the collapsible
		this.panelMenuListView.$el.children().eq(this.menuIndex).find('#collapsible-admin').removeClass('ui-collapsible-collapsed')
									.find('div[aria-hidden=true]').removeClass('ui-collapsible-content-collapsed').attr('aria-hidden','false');

		BasePage.prototype.pageInitHandler.apply(this, arguments);
	},

	submitUserView : function() {
		console.log('Set User default message view');
		var self = this;
		var $form = this.setUserMessageView.$el;

		$.mobile.showPageLoadingMsg("", $.i18n.prop('message.setuserview.processing'));
		sessionStorage.clear();

		var formData = {
			username : $form.find('input[name="username"]').val(),
			messageview : $form.find('select[name="viewtype"]').val()
		};

		// call the API
		this.setUserXhr = gapi.setUserViewHandler(formData, function(errorCode, jqXHR) {

			$.mobile.hidePageLoadingMsg();

			switch (errorCode) {
				case -1:
					// request failed
					$('#error').text($.i18n.prop('message.setuserview.error.server.does.not.accept')).show();
					break;
                case 0:
					// setting success
					$('#error').text(String.format($.i18n.prop('message.setuserview.success'), $form.find('select[name="viewtype"]').val(), $form.find('input[name="username"]').val())).show();
					break;
				case 1:
					// no permission
					$('#error').text($.i18n.prop('message.setuserview.error.permission')).show();
					break;
				case 2:
					// setting failed
					$('#error').text(String.format($.i18n.prop('message.setuserview.error.nouser'), $form.find('input[name="username"]').val())).show();
					break;
			}

		});
		return false;
	}
});
