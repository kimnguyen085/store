({
	baseUrl: "",
	mainConfigFile: 'js/requirejs-config.js',
    has : {
    	mergedTemplate: false
    },
	name: "js/main",
	out: "app-built.js",
	include: ['loadCss', 'utils'],
	exclude: ['jquery', 'jqueryMobile', 'jqueryDataTable', 'jqmConfig', 'appConfig', 'gapiConfig'] //jqueryDataTable does not play well with requireJS
})