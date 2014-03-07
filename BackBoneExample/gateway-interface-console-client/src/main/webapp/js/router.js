window.GTabletRouter = window.CacheRouter.extend({

	routes : {

		"" : "home",
		"home" : "home",
		"login": "login",
		"loadFVS": "loadFVS",
		"change-password(/:usernameParam)": 'changePassword'
	},

	initialize: function () {
		CacheRouter.prototype.initialize.apply(this, arguments);
		this.sessionTimeoutInitialize();
	},

	sessionTimeoutInitialize: function () {
		if (window.sessionTimeOut) {
			clearTimeout(window.sessionTimeOut);
		}
		// setting up global session timeout
		window.sessionTimeOut = setTimeout(function() {
			app.reset();
		}, app_config.sessionTimeoutDuration * 1000);

		$(document)
			.off('tap', this.sessionTimeoutHandler)
			.on('tap', this.sessionTimeoutHandler);
	},

	sessionTimeoutHandler: function () {
		if (Backbone.history.fragment == 'login') {
			// shouldn't need to handle timeout on login page
			return;
		}
		if (window.sessionTimeOut) {
			clearTimeout(window.sessionTimeOut);
			window.sessionTimeOut = setTimeout(function() {
				$.jGrowl(String.format($.i18n.prop('message.session.timedout'), app_config.sessionTimeoutDuration), {
					sticky: false,
					life: (app_config.sessionTimeoutDuration / 2) * 1000, // half the duration of session timeout
					position: 'top-right'
				});
				app.reset();
			}, app_config.sessionTimeoutDuration * 1000);
		}
	},

	home: function() {
		if (window.loginDetails) {
			this.navigate("messages");
		} else {
			this.navigate("login");
		}
	},

	login: function () {
		
		this.destroyPageCache(['login', 'logout']); // exclude the login and logout page
		delete window.loginDetails;
		this.handleRouteAny('#login', 0); // need a hash for by pass routeS check
	},

	loadFVS: function () {
		if (FeaturesEnabler.shouldEnable('fundRegisterService')) {
			this.handleRouteAny('#loadFVS');
		} else {
			this.navigate("notFound");
		}
	},

    changePassword: function (usernameParam) {
    	var username = "";
    	var usernameType = "";
    	if (window.loginDetails) {
    		username = window.loginDetails.attributes.userName;
    		usernameType = "hidden";
    	} else if (usernameParam) {
    		username = usernameParam;
    		usernameType = "text";
    		var initialMessage = $.i18n.prop('message.password.firsttime');
    	} else {
    		this.navigate('notFound');
    		return;
    	}

        //Dialog.showMessage();
        $.extend($.validator.messages, {
		    pattern: $.i18n.prop('message.password.format.validation')
		});

        var templateChangePassword = _.template(tpl.get('partial/form-change-password'));

        var $form = $(templateChangePassword({
        	//tagName: 'form',
			//attributes : {
			//	'id' : 'form-change-password',
			//	'method' : 'post',
			//	'action' : gapi_config.baseApiUrl + gapi_config.changePassword
			//},
			usernameLabel: $.i18n.prop('label.form.usernameLabel'),
			usernameType: usernameType,
			username: username,
            oldPasswordLabel: $.i18n.prop('label.form.oldpasswordLabel'),
            newPasswordLabel: $.i18n.prop('label.form.newpasswordLabel'),
            newPasswordAgainLabel: $.i18n.prop('label.form.newpasswordagainLabel'),
            btnOk: $.i18n.prop('button.ok'),
            btnCancel: $.i18n.prop('button.cancel')
        }));

        $(document).simpledialog2({
            mode : 'blank',
            zindex : 1500,
            headerText: "Password update",
            width: 'auto',

            blankContent : $form,

            callbackOpen: function () {
            	$form.validate({
            		rules: {
            			username: {
            				required: true
            			},
            			old_password: {
            				required: true
            			},
            			new_password: {
            				required: true,
            				pattern: app_config.passwordRegex
            			},
            			new_password_again : {
            				equalTo: "input[name=new_password]"
            			}
            		}
            	});
				$form.find('input').parent().removeClass('ui-corner-all');
				if (initialMessage) {
					$form.find('#change_password_notification').text(initialMessage).show();
				}
				$form.find('button').click(function (e) {
					$form.submitValue = $(this).val();
				});
				$form.submit(function () { return false; }); // prevent all native form submission
            	$form.submit(function () {
            		if ($form.submitValue == 'cancel') {
            			$.mobile.sdCurrentDialog.close();
            		} else if ($form.valid()) {

            			if (!username) {
            				username = $form.find('input[name=username]').val()
            			}

            			var formData = {
            				username: username,
							oldPassword : $form.find('input[name=old_password]').val(),
							newPassword : $form.find('input[name=new_password]').val(),
							newPasswordConfirm : $form.find('input[name=new_password_again]').val()
						};
		        		var $notification = $form.find('#change_password_notification');

		        		// set flag
		        		$form.submited = true;
		        		// disable button
		        		$form.find('button').button('disable');
		        		$form.find('input[type=text]').textinput('disable');
		        		// show loading message

		        		$notification
		        			.text($.i18n.prop('message.changepwd.changing'))
		        			.show()
		        			.addClass('data-loading')
		        			.removeClass('text-red');

						gapi.changePassword(formData, function(mix, status) {
							if (status == 'success') {
								if(mix.changed){
									$notification.text(usernameParam ? $.i18n.prop('message.changepwd.success.firsttime') : $.i18n.prop('message.changepwd.success'));
									$.mobile.sdCurrentDialog.startClosingInterval();
									$form.find('button') // all button now wil close the dialog only
										.val('cancel')
										.button('enable');
									// $.jGrowl($.i18n.prop('message.changepwd.success'), {
										// sticky: false,
										// life: app_config.autoCloseJgrowl,
										// position: 'top-right',
									// })
									// $.mobile.sdCurrentDialog.close();
									// app.reset();
								} else {
									$notification.addClass('text-red').text(mix.reasonNotChanged);
									$form.find('button').button('enable');
									$form.find('input[type=text]').textinput('enable');
								}
							} else {
								$notification.addClass('text-red').text($.i18n.prop('message.login.error.server.does.not.accept'));
								$form.find('button').button('enable');
								$form.find('input[type=text]').textinput('enable');
							}
							$notification.removeClass('data-loading');
						});
	        		}
	        		return false;
            	});
	        },

	        callbackClose: function () {
	        	clearInterval($.mobile.sdCurrentDialog.closeInterval);
				clearTimeout($.mobile.sdCurrentDialog.closeTimeout);
	        	window.history.back();
	        }

    	});

    	if (!usernameParam) { // if a param is passed along, auto close will be disabled
    		$.mobile.sdCurrentDialog.closeTimeout = setTimeout(function () {
	    		$.mobile.sdCurrentDialog.startClosingInterval(true);
	    	}, app_config.autoCloseDialogSeconds * 1000);

	    	$form.on('tap keydown', function () {
	    		if ($.mobile.sdCurrentDialog.closeTimeout) {
	    			clearTimeout($.mobile.sdCurrentDialog.closeTimeout);
	    			if (!$form.submited && $.mobile.sdCurrentDialog.closeInterval) {
	    				$.mobile.sdCurrentDialog.stopClosingInterval();
	    			}
	    		}
	    		$.mobile.sdCurrentDialog.closeTimeout = setTimeout(function () {
	    			if ($.mobile.sdCurrentDialog) {
	    				$.mobile.sdCurrentDialog.startClosingInterval(true);
	    			}
		    	}, app_config.autoCloseDialogSeconds * 1000);
	    	});
    	}

    	$.mobile.sdCurrentDialog.startClosingInterval = function (showNotification, count) {
			var $closeNotification = $form.find('#change_password_closing_notification');
			var $message = $closeNotification.children('span');
			$closeNotification.occuredTime = (count !== undefined && !isNaN(count)) ? count : app_config.autoCloseDialogIntervalCount;
			$message.text(String.format($.i18n.prop('message.changepwd.closing'), $closeNotification.occuredTime, $closeNotification.occuredTime == 1 ? "" : "s"));
			if (showNotification) {
				$closeNotification.stop(true, true).fadeIn();
			}
    		$.mobile.sdCurrentDialog.closeInterval = setInterval(function () {
    			$closeNotification.occuredTime--;
				$message.text(String.format($.i18n.prop('message.changepwd.closing'), $closeNotification.occuredTime, $closeNotification.occuredTime == 1 ? "" : "s"));
				if ($closeNotification.occuredTime == 0) {
					$.mobile.sdCurrentDialog.close();
				}
			}, 1000);
    	}

    	$.mobile.sdCurrentDialog.stopClosingInterval = function () {
    		if ($.mobile.sdCurrentDialog.closeInterval) {
        		clearInterval(this.closeInterval);
        		var $closeNotification = $form.find('#change_password_closing_notification');
    			$closeNotification.hide();
        	}
    	};
    },

	reset: function () {
		CacheRouter.prototype.reset.apply(this, arguments);

        sessionStorage.clear();
        this.destroyPageCache();
        delete window.loginDetails;
        this.navigate("login");
    }
});
