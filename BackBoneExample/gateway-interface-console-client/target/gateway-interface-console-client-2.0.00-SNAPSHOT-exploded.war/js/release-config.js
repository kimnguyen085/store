requirejs.config({

	baseUrl : '',
	waitSeconds: 200, // large for slow network...
	paths : {

		jquery : 'lib/jquery-1.9.1.min',

		jqueryDataTable : 'lib/jquery-plugins/jquery-datatable/media/js/jquery.dataTables.min',
		// jQM
		jqueryMobile : 'lib/jquery.mobile-1.3.1.min',

		gapiConfig : 'gsharedjs/api-config',
		appConfig : 'js/app-config',
		jqmConfig : 'js/jqm-config'
	},

	shim : {

		'jqmConfig' : {
			deps : ['jquery']
		},

		'jqueryMobile' : {
			deps : ['jqmConfig']
		},

		'jqueryDataTable' : {
			deps : ['jquery']
		},

		'app-built': {
			deps: ['gapiConfig', 'appConfig', 'jqueryDataTable', 'jqueryMobile']
		}
	}
});

// clear all log message in release version
if (console) {
	console.log = function () {};
}

requirejs(['app-built']);
