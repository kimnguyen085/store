requirejs.config({

	baseUrl : '',
	waitSeconds: 200, // large for slow network...
	paths : {

        loadCss : 'js/loadcss',
		jquery : 'lib/jquery-1.9.1',

		//jQuery Plugins
		jqueryUIAutocomplete : 'lib/jquery-plugins/jquery-ui-1.10.3.custom.autocomplete/js/jquery-ui-1.10.3.custom.min',
		jqueryi18n : 'lib/jquery-plugins/jquery-i18n/jquery.i18n.properties-min-1.0.9',
		jqueryValidate : 'lib/jquery-plugins/jquery-validation/jquery.validate.min',
		additionalMethods : 'lib/jquery-plugins/jquery-validation/additional-methods.min',
		jqueryFormat : 'lib/jquery-plugins/jquery-format/jquery.format-1.2',
		jpjqplot : 'lib/jquery-plugins/jquery-jqplot/jquery.jqplot.min',
		jqplotDonutRenderer : 'lib/jquery-plugins/jquery-jqplot/plugins/jqplot.donutRenderer.min',
		jqplotPieRenderer : 'lib/jquery-plugins/jquery-jqplot/plugins/jqplot.pieRenderer.min',
		jqplotCategoryAxisRenderer : 'lib/jquery-plugins/jquery-jqplot/plugins/jqplot.categoryAxisRenderer.min',
		jqplotBarRenderer : 'lib/jquery-plugins/jquery-jqplot/plugins/jqplot.barRenderer.min',
		jqplotHighlighter : 'lib/jquery-plugins/jquery-jqplot/plugins/jqplot.highlighter.min',
		jqueryTagsInput : 'lib/jquery-plugins/jquery-tags-input/jquery.tagsinput',
		jquerySizes : 'lib/jquery-plugins/jquery-jsize/jquery.sizes',
		jqueryDataTable : 'lib/jquery-plugins/jquery-datatable/media/js/jquery.dataTables.min',
		jqueryBlockUI : 'lib/jquery-plugins/jquery-blockui/jquery.blockUI',
		jquerySnippet : 'lib/jquery-plugins/jquery-snippet/jquery.snippet',
		jqueryMigrate : 'lib/jquery-plugins/jquery-migrate/jquery-migrate-1.2.1.min', // only needed for Snippet for now
		jqueryJgrowl: 'lib/jquery-plugins/jquery-jgrowl/jquery.jgrowl.min',
		jqueryNicescroll: 'lib/jquery-plugins/jquery-nicescroll/jquery.nicescroll-3.4.0.min',
		// jQM
		jqueryMobile : 'lib/jquery.mobile-1.3.1',

		jqmDateboxCore : 'lib/jquery-plugins/jqm-datebox/jqm-datebox.core.min',
		jqmDateboxModeCalbox : 'lib/jquery-plugins/jqm-datebox/jqm-datebox-1.1.0.mode.calbox',
		jqmDateboxModeSlidebox : 'lib/jquery-plugins/jqm-datebox/jqm-datebox-1.1.0.mode.slidebox',
		jqmDateboxModeDatebox : 'lib/jquery-plugins/jqm-datebox/jqm-datebox-1.1.0.mode.datebox',
		jqueryMobileSimpledialog : 'lib/jquery-plugins/jqm-datebox/jquery.mobile.simpledialog.min',
		jqueryMobileSimpledialog2 : 'lib/jquery-plugins/jqm-simpledialog2/jquery.mobile.simpledialog2',

		//  Application configuration
		appConfig : 'js/app-config',
		jqmConfig : 'js/jqm-config',

		// Backbone
		underscore : 'lib/underscore-min',
		backbone : 'lib/backbone-min',

		gapiConfig: 'gsharedjs/api-config',
		gapi : 'gsharedjs/api-wrapper/gapi.wrapper',
		// Helpers
		utils : 'gsharedjs/utils',

		// Models
		commonModels : 'gsharedjs/models/common-model',
		messageModels : 'gsharedjs/models/messages-model',

		commonUtils : 'sharedjs/common/common-utils',
		commonExts : 'sharedjs/common/common-extensions',
		// Action/router
		commonActions : 'sharedjs/common/common-actions',
		// Views
		commonView : 'sharedjs/common/common-views',

		// pages
		commonPage : 'js/views/common-pages',
		basePage: 'js/views/base-page',

		//menu
		messagePage: 'js/views/message-page',
		loadFVSPage: 'js/views/load-fvs-page',

		// helpers
		helpers : 'js/views/helpers',

		//tab messagePage
		tabDailySummary: 'js/views/tab-daily-summary',
		tabMessages: 'js/views/tab-messages',
		tabDetails: 'js/views/tab-details',
        tabSendOutgoing: 'js/views/tab-send-outgoing',

		//tab administrationPage
		tabFundRegister: 'js/views/tab-fund-register',
		tabUploadRegister: 'js/views/tab-upload-register',

		appRouter: 'js/router'
	},

	shim : {
		'backbone' : {
			deps : ['underscore', 'jquery']
		},

		'jqmConfig' : {
            deps : ['jquery']
        },

        'jqueryMobile' : {
            deps : ['jqmConfig']
        },

		//jQuery Plugins
		'jqueryUIAutocomplete' : {
			deps : ['jquery']
		},
		'jquerySizes' : {
			deps : ['jquery']
		},
		'jqueryDataTable' : {
			deps : ['jquery']
		},
		'jqueryTagsInput' : {
			deps : ['jquery', 'jqueryUIAutocomplete']
		},
		'jqueryi18n' : {
			deps : ['jquery']
		},
		'jqueryValidate' : {
			deps : ['jquery']
		},
		'jqueryFormat' : {
			deps : ['jquery']
		},
		'jqueryBlockUI' : {
			deps : ['jquery']
		},

		'additionalMethods' : {
			deps : ['jqueryValidate']
		},
		'jpjqplot' : {
			deps : ['jquery']
		},
		'jqplotHighlighter' : {
			deps : ['jpjqplot']
		},
		'jqplotCategoryAxisRenderer' : {
			deps : ['jpjqplot']
		},
		'jqplotDonutRenderer' : {
			deps : ['jqplotHighlighter']
		},
		'jqplotPieRenderer' : {
			deps : ['jqplotHighlighter']
		},
		'jqplotBarRenderer' : {
			deps : ['jqplotHighlighter', 'jqplotCategoryAxisRenderer']
		},

		'jqueryMigrate' : {
			deps : ['jquery']
		},

		'jquerySnippet' : {
			deps : ['jqueryMigrate']
		},

		'jqmDateboxCore' : {
			deps : ['jqueryMobile']
		},
		'jqmDateboxModeSlidebox' : {
			deps : ['jqmDateboxCore']
		},
		'jqmDateboxModeCalbox' : {
            deps : ['jqmDateboxCore']
        },
        'jqmDateboxModeDatebox' : {
            deps : ['jqmDateboxCore']
        },
		'jqueryMobileSimpledialog' : {
			deps : ['jqueryMobile']
		},
		'jqueryMobileSimpledialog2' : {
			deps : ['jqueryMobile']
		},
		// jGgrowl
		'jqueryJgrowl' : {
			deps : ['jquery']
		},

		'jqueryNicescroll' : {
			deps : ['jquery']
		},

		'commonActions' : {
			deps : ['backbone']
		},

		'commonExts' : {
			deps : ['backbone']
		},

		'commonUtils' : {
			deps : ['jquery']
		},

		'commonView' : {
			deps : ['jqueryNicescroll', 'jqueryDataTable', 'jqplotDonutRenderer', 'jqueryMobile', 'commonUtils', 'commonExts']
		},

		'gapi': {
			deps: ['gapiConfig']
		},

		// models
		'commonModels' : {
			deps : ['gapi', 'commonExts']
		},
		'messageModels' : {
			deps : ['commonModels']
		},

		'helpers' : {
			deps : ['commonView']
		},

		//Helpers
		'utils' : {
			deps : ['commonUtils', 'jqueryFormat']
		},

		//page
		'commonPage' : {
			deps : ['basePage', 'commonView', 'jquerySnippet', 'jqueryMobileSimpledialog2', 'gapi']
		},
		'basePage' : {
			deps : ['appConfig', 'helpers', 'additionalMethods', 'jquerySizes', 'commonView']
		},

		//Menu page
		'messagePage' : {
			deps : ['basePage', 'tabDetails', 'tabDailySummary', 'tabMessages', 'tabSendOutgoing']
		},
		'loadFVSPage' : {
			deps : ['basePage', 'tabFundRegister', 'tabUploadRegister']
		},

		//Tab message
		'tabDailySummary' : {
			deps : ['commonView', 'helpers', 'jqueryBlockUI', 'messageModels', 'jqmDateboxModeCalbox', 'jqueryMobileSimpledialog2']
		},
		'tabMessages' : {
			deps : ['commonView', 'helpers', 'jqueryBlockUI', 'messageModels', 'jqmDateboxModeCalbox', 'jqueryMobileSimpledialog2']
		},
		'tabDetails' : {
			deps : ['commonView', 'helpers', 'jqueryBlockUI', 'messageModels', 'commonPage']
		},
        'tabSendOutgoing' : {
            deps : ['commonView', 'helpers', 'jqueryBlockUI', 'messageModels', 'commonPage','jqmDateboxModeCalbox', 'jqueryMobileSimpledialog2']
        },
		//Tab LoadFVS
		'tabFundRegister' : {
			deps : ['commonView', 'helpers', 'jqueryBlockUI', 'messageModels']
		},
		'tabUploadRegister' : {
			deps : ['commonView', 'jqueryBlockUI', 'messageModels']
		},

		//Router
		'appRouter' : {
			deps : ['commonActions', 'commonView', 'jqueryJgrowl', 'commonPage', 'jqueryi18n', 'messagePage', 'loadFVSPage']
		}

	}
});

requirejs(['loadCss', 'js/main']);
