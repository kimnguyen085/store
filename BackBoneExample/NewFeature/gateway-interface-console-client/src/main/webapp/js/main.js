require(['jquery', 'utils', 'appRouter'], function($) {

	$(document).ready(function() {

		$('div#inital-loading-indicator').remove();
        $.mobile.showPageLoadingMsg("", app_config.initializingMessage);

		$.i18n.properties({
			name : 'mobile-messages',
			path : 'bundle/',
			mode : 'map',
			language : 'n' // set this for no further language load...
		});

		tpl.loadTemplates([

		//headers
		'partial/header-generic',
		'partial/header-generic-action',
		'partial/header-action',
		'partial/header-login',
		//footer
		'partial/footer-copyright',
		'partial/footer-login',
		'partial/footer-generic',

		// 404 page
		'partial/not-found',

		// login, logout
		'partial/form-login',
		'partial/logout',

        // change password
        'partial/form-change-password',

		// change password
		'partial/form-change-password',

		// error
		'partial/error',

		// tab message
		'partial/tab-summary-filter-rollover',
		'partial/tab-summary-filter-contribution',
		'partial/tab-rollover-messages-filter',
		'partial/tab-contribution-messages-filter',
		'partial/tab-details-filter',
        'partial/tab-send-outgoing-filter',
		//Tab load Fvs
		'partial/tab-fund-register-filter',
		'partial/tab-upload-register',

		//Set user message view
		'partial/set-user-message-view',

		// message details
		'partial/message-details',
		'partial/message-details-raw',
		'partial/document-details',
		'partial/message-details-title',
		'partial/message-contribution-details-title',

		//
		'partial/message-notification',
		'partial/configuration',
		'partial/accordion-section-title',
		'partial/table-empty',
		'partial/tab-summary-section-title',
		//icon
		'partial/icon-green-tick',
		'partial/icon-red-cross',
        'partial/icon-yellow-warning',

		// list view
		'partial/list-item-col1',
		'partial/list-item-col2',
		'partial/list-item-col3',
		'partial/list-item-col4',
		'partial/list-item-col5',
		'partial/list-item-col6'

		], function() {

			$.mobile.hidePageLoadingMsg();
			window.app = new GTabletRouter();
			Backbone.history.start({pushState: false});

			$(document).ajaxError(function (event, request, settings) {
				// console.log('Global ajax error');
				// console.log(request);
				if (request.status < 400) {
			        // probably not logged in
			        app.navigate('login');
			        //this.navigate('login', { trigger: true});
			        return;
			    }
			});
		});
	});
});
