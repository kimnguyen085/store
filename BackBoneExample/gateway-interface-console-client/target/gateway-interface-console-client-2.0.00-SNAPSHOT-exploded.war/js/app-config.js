//JS Global variables

// session and context path

var app_config = {

	// currency configuration

	initializingMessage: "Inititalizing, please wait...", // this message will come up prior to i18n plugin loads up...

	currencySymbol : '$',
	currencyText : '$AUD',
	currencySymbolCollection : ['$', '£'],
	currencyTextCollection : ['$AUD', '£GBP'],

	numberPattern : '#,##0.00',
	datePattern : 'dd/MM/yy',
	dateTimePattern : 'dd/MM/yyyy HH:mm',
	serverDatePattern : 'yyyy-M-d',
	serverDateTimePattern : 'yyyy-M-d',
	sessionTimeoutDuration: 1200, // 1200 seconds, 20 minutes
	autoCloseDialogSeconds: 10, // dialog auto close after,
	autoCloseDialogIntervalCount: 3, // dialog auto close after,
	autoCloseJgrowl: 2000, // 2 seconds,

	//serverDateTimePattern : 'yyyyMMdd HHmmss',

	tooltipOffset: {
		x: 10,
		y: 20
	},

	maxChartSize : {
		width: 300,
		height: 300
	},

	searchInitializeDelay: 500,

	maxPageCacheTime : 0, // caching forever // 120 seconds

	defaultDateRange : 0, // days

	numerOfNotePerPage: 3,

    baseWindowHeight: 768,
    estHeightPerRow: 36,
	baseNumberOfDataRows: 7,

	numberOfDataRows: 7,

	calcNumberOfRows: function () {
	    return app_config.baseNumberOfDataRows + (window.innerHeight > app_config.baseWindowHeight ? Math.floor((window.innerHeight - app_config.baseWindowHeight) / app_config.estHeightPerRow) : 0);
	},

	apiConfigEnablingCount: 7,

	passwordRegex: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/, // at lease 1 number, 1 lowercase, 1 uppercase letter, 6 characters

	functionMapping: {
		fundRegisterService: ["Fund Register View Services"],
		mshMessageService: ["MSH Message Services"],
		stackTraceService: ["Stack Trace Services"],
		uploadService: ["Fund Register Upload Services"]
	}

};

