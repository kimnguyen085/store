window.GenericHeader = GenericElementView.extend({
	attributes : {
		"data-role" : "header",
		"data-position" : "fixed",
		"data-theme" : "e",
		"data-tap-toggle" : "false",
		"class" : "header-generic"
	},
	templateName : "partial/header-generic"
});

window.LoginPage = GenericPage.extend({

	pageId : 'login',

	attributes : {
		"data-theme" : "d"
	},
	events : {
		'pageinit' : 'pageInitHandler'
	},

	initialize : function() {
		// call supper initialize
		GenericPage.prototype.initialize.apply(this, arguments);
		this.loginHeader = new ActionHeader({
			enableActionMenu : false
		});
		this.loginHeader.mainContents.push(new GenericHeader());
		this.headers.push(this.loginHeader);
		this.footer = _.template(tpl.get('partial/footer-login'));
		this.loginForm = new GenericElementView({
			tagName: 'form',
			attributes : {
				'id' : 'form-login',
				'method' : 'post',
				'action' : gapi_config.baseApiUrl + gapi_config.loginUrl
			},
			templateName : 'partial/form-login',
			loginHeaderText : $.i18n.prop('login.header'),
			usernameLabel : $.i18n.prop('label.login.usename'),
			passwordLabel : $.i18n.prop('label.login.password'),
			btnLogin : $.i18n.prop('button.login')
		});
		this.mainContents.push(this.loginForm);
		//this.bkApiConfigEnablingCount = app_config.apiConfigEnablingCount;
	},

	pageInitHandler : function() {
		this.loginForm.$el.find('input').each(function() {
			//remove the corner
			$(this).parent().removeClass('ui-corner-all');
		});
		var self = this;
		this.loginForm.$el.submit(function () {
			return self.doLogin();
		});
	},

	doLogin : function() {
		console.log("do login");
		var self = this;
		var $form = this.loginForm.$el;

		if ($form.loggingIn || !$form.valid()) {
			return false;
		}

		$.mobile.showPageLoadingMsg("", $.i18n.prop('message.login.processing'));
		sessionStorage.clear();

		$form.loggingIn = true;

		var formData = {
			j_username : $form.find('input[name="j_username"]').val(),
			j_password : $form.find('input[name="j_password"]').val()
		};

		// call the API
		this.loginXhr = gapi.loginHandler(formData, function(errorCode, jqXHR) {

			$.mobile.hidePageLoadingMsg();
			$form.loggingIn = false;

			switch (errorCode) {
				case -1:
					// request failed
					$('#form-login-error').text($.i18n.prop('message.login.error.server.does.not.accept')).show();
					break;
                case 0:
					// login success
					$('#form-login-error').hide();
					self.getLoginDetails();
//					app.navigate('contributionMessages');
					break;
				case 1:
					// login failed
					$('#form-login-error').text($.i18n.prop('message.login.error.account.incorrect')).show();
					break;
				case 2:
					// first-time login
					$('#form-login-error').hide();
					app.navigate(String.format('change-password/{0}', formData.j_username));
					break;
				case 4:
					// login failed
					$('#form-login-error').text($.i18n.prop('message.login.single.concurrent.login.attempt')).show();
					break;
			}

		});

		return false;
	},

	getLoginDetails : function() {
		if (window.loginDetails) {
			return;
		}
		window.loginDetails = new LoginDetails();
		window.loginDetails.fetch({
			success : function() {
				//Set User Message view
				if (window.loginDetails.attributes.userConfigs.MESSAGE_VIEW.indexOf('Rollover Messages') !== -1) {
					window.app.navigate("rolloverMessages");
				} else {
					window.app.navigate("contributionMessages");
				}
			}
		});
	},
});

window.NotFoundPage = GenericPage.extend({
	initialize : function() {
		// call supper initialize
		GenericPage.prototype.initialize.apply(this, arguments);
		this.prepareContent();
	},

	prepareContent: function () {
		this.messageContent = new GenericElementView({
			templateName: 'partial/not-found',
			pageNotFoundMessage: $.i18n.prop('message.404'),
			btnHome: $.i18n.prop('message.404.goToHome'),
			btnBack: $.i18n.prop('message.404.back')
		});

		this.mainContents.push(this.messageContent);

		this.messageContent.$el.on('click :button', function(e) {
			var type = $(e.target).data('type');
			if (type == 'home') {
				app.navigate('home');
			} else if (type == 'back') {
				window.history.back();
			}
			return false;
		});
	}
});

window.LogoutPage = BasePage.extend({

	attributes : {
		"class" : "ui-responsive-panel",
		'data-theme' : 'd'
	},

	initialize : function() {
		this.menuIndex = 3;
		// call supper initialize
		BasePage.prototype.initialize.apply(this, arguments);

		this.pageId = "logout";
		this.prepareData();
	},

	prepareData : function() {
		this.logoutTempate = new GenericElementView({
			templateName : "partial/logout",
			tagName: 'form',
			attributes : {
				'id' : 'form-login',
				'method' : 'post',
				'action' : gapi_config.baseApiUrl + gapi_config.logoutUrl
			},
			logoutText : $.i18n.prop('logout.textlabel'),
			btnLogout : $.i18n.prop('logout.btnlogout'),
			btnCancel : $.i18n.prop('logout.btncancel')
		});
		this.mainContents.push(this.logoutTempate);

		this.logoutTempate.$el.on('click :button', function(e) {
			var self = this;
			var type = $(e.target).data('type');
			if (type == 'logout') {
				gapi.logoutHandler();
				app.reset();
			} else if (type == 'cancel') {
				window.history.back();
			}
			return false;
		});
	},

	updateLoginDetails: function () {
		if (window.loginDetails.attributes.authorised) {
			this.menuIndex = 4;
		}
		BasePage.prototype.updateLoginDetails.apply(this, arguments);
	}
});

window.ApiConfig = GenericPage.extend({

	pageId : 'login',

	attributes : {
		"data-theme" : "d"
	},

	events : {
		'pageinit' : 'pageInitHandler'
	},

	initialize : function() {
		// call supper initialize
		GenericPage.prototype.initialize.apply(this, arguments);
		this.loginHeader = new GenericElementView({
			templateName : 'partial/header-login',
			attributes : {
				"data-role" : "header",
				"data-position" : "fixed",
				"data-theme" : "f",
				"data-tap-toggle" : "false"
			}
		});
		this.headers = [this.loginHeader];
		this.footer = _.template(tpl.get('partial/footer-login'));

		this.configForm = new GenericElementView(_.extend({
			tagName : 'form',
			templateName : "partial/configuration"
		}, foapi_config));
		this.mainContents.push(this.configForm);
	},

	pageInitHandler : function() {
		var self = this;
		this.configForm.$el.find('button').click(function(e) {
			var type = $(e.currentTarget).data('type');
			if (type == "save") {
				self.saveConfiguration();
			}
			app.navigate('login/config', {
				trigger : true
			});
			return false;
		});
	},

	saveConfiguration : function() {
		this.configForm.$el.find('input').each(function() {
			foapi_config[this.name] = this.value;
		});
	}
});

window.Dialog = {
	showMessage : function(mContent, contentType) {
		if ( typeof contentType != "undefined") {
			mContent = String.format("<pre>{0}</pre>", mContent);
		}
		var templateMessage = _.template(tpl.get('partial/message-notification'));
		$(document).simpledialog2({
			mode : 'blank',
			zindex : 1500,
			blankContent : templateMessage({
				messageContent : mContent,
				ftnClose : $.i18n.prop('button.close')
			}),
			callbackOpen : function() {
				if ( typeof contentType != "undefined") {
					this.element.find('pre').snippet(contentType);
				}
			}
		});
	}
};