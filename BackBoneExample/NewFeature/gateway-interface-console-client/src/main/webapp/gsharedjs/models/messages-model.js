window.EbmsMessage = window.GApiModel.extend({

	idAttribute : 'ebmsMessageId',

	constructor : function() {
		window.GApiModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.ebmsMessagesUrl;
	},

	initialize : function() {
		this.dailySummary = new DailySummary([], { parent : this });
	}
});

window.EbmsMessages = window.GApiCollection.extend({

	model : EbmsMessage,

	constructor : function() {
		window.GApiCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.ebmsMessagesUrl;
	}

});

window.EbmsMessageRaw = window.GApiModel.extend({

	idAttribute : 'ebmsMessageId',

	constructor : function() {
		window.GApiModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.ebmsMessageRawUrl;
	}
});

window.EbmsMessageDetail = window.GApiStandaloneModel.extend({

	idAttribute : 'ebmsMessageId',

	constructor : function() {
		window.GApiStandaloneModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.ebmsMessageSearchUrl;
	},

	fetch : function(options) {
		if (this.attributes.conversationId) {
			_.extend(options.data, { conversationId : this.attributes.conversationId });
		}

		return GApiStandaloneModel.prototype.fetch.apply(this, arguments);
	}
});

window.MessageDetailModel = window.GApiStandaloneModel.extend({
	initialize : function () {
		this.documents = new MessageDocuments([], { parent : this });
		this.logs = new MessageLogs([], { parent : this });
		this.dailySummary = new DailySummary([], { parent : this });
	}
});

window.MessageDetailCollection = window.GApiStandaloneCollection.extend({
	initialize : function () {
		var self = this;
		this.on('reset', function () {
			if (self.length > 0) {
				self.each(function (aModel) {
					aModel.parent = self.parent;
					aModel.logs = new MessageLogs([], { parent : aModel });
					aModel.documents = new MessageDocuments([], { parent : aModel });

				});
			}
		});
	}
});

window.MessagePart = window.MessageDetailModel.extend({

	idAttribute : "ebmsMessagePartId",

	constructor : function() {
		window.MessageDetailModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.ebmsMessagePartsUrl;
	},

	initialize : function () {
		MessageDetailModel.prototype.initialize.apply(this, arguments);
		this.transactions = new MessageTransactions([], { parent: this });
	}
});

window.MessageParts = window.MessageDetailCollection.extend({
	constructor : function() {
		window.MessageDetailCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.ebmsMessagePartsUrl;
	},

	initialize : function () {
		var self = this;
		this.on('reset', function () {
			if (self.length > 0) {
				self.each(function (part) {
					part.transactions = new MessageTransactions([], { parent : part });
				});
			}
		});
	}
});

window.MessageTransaction = window.MessageDetailModel.extend({

	idAttribute : "messageTransactionId",

	constructor : function() {
		window.MessageDetailModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.messageTransactionsUrl;
	}
});

window.MessageTransactions = window.MessageDetailCollection.extend({

	model: MessageTransaction,

	constructor : function() {
		window.MessageDetailCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.messageTransactionsUrl;
	}
});

window.Summary = window.GApiModel.extend({
	constructor : function() {
		window.GApiModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.dailySummarrUrl;
	}
});

window.DailySummary = window.GApiCollection.extend({
	model: Summary,

	constructor : function() {
		window.GApiCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.dailySummarrUrl;
	}
});

window.MessageDocument = window.GApiStandaloneModel.extend({
	constructor : function() {
		window.GApiStandaloneModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.messageDocumentUrl;
	}
});

window.MessageDocuments = window.GApiStandaloneCollection.extend({

	model : MessageDocument,

	constructor : function() {
		window.GApiStandaloneCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.messageDocumentUrl;
	}
});

window.MessageLog = window.GApiStandaloneModel.extend({
	constructor : function() {
		window.GApiStandaloneModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.messageLogsUrl;
	}
});

window.MessageLogs = window.GApiStandaloneCollection.extend({

	model : MessageLog,

	constructor : function() {
		window.GApiStandaloneCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.messageLogsUrl;
	}
});

window.BaseDetail = window.GApiModel.extend({
	constructor: function (options) {
		window.GApiModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = options.url;
	}
});

window.BaseDetails = window.GApiCollection.extend({

	model: BaseDetail,

	constructor: function (objArr, options) {
		window.GApiCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = options.url;
	},

	setSelectedIndex: function (index) {
		if (this.selectedIndex != index) {
			if (isNaN(index)) {
				index = parseInt(index);
			}

			if (index >= 0 && index < this.length) {
				this.selectedIndex = index;
			} else {
				delete this.selectedIndex;
			}

			this.trigger('selected');
		}
	},

	getSelectedIndex: function () {
		return this.selectedIndex;
	},

	getSelectedItem: function () {
		if (this.selectedIndex) {
			return this.at(this.selectedIndex);
		}
	},

	clearSelect: function () {
		this.setSelectedIndex(-1);
	}
});

window.Participant = window.GApiModel.extend({
	constructor: function (options) {
		window.GApiModel.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.participantUrl;
	},

	initialize: function () {
		// hacks for current services...
		this.fund = new BaseDetail({
			parent: this,
			url: gapi_config.fundUrl
		});
		this.fund.source = new BaseDetails([], {
			parent: this.fund,
			url: gapi_config.sourceUrl
		});
		this.fund.target = new BaseDetails([], {
			parent: this.fund,
			url: gapi_config.targetUrl
		});

		this.product = 	new BaseDetail({
			parent: this,
			url: gapi_config.productUrl
		});
		this.product.source = new BaseDetails([], {
			parent: this.product,
			url: gapi_config.sourceUrl
		});
		this.product.target = new BaseDetails([], {
			parent: this.product,
			url: gapi_config.targetUrl
		});
		//for contribution
		this.source = new BaseDetail({
//			parent: this,
			url: gapi_config.ebmsMessagePartsUrl
		});
		this.source.entity = new BaseDetails([], {
			parent: this.source,
			url: gapi_config.entityUrl
		});
	}
});

// EbmsMessageHeaderAttributes model contains list of header property names for each message type
window.EbmsMessageHeaderAttributes = window.GApiModel.extend({
    constructor: function (options) {
        window.GApiModel.prototype.constructor.apply(this, arguments);
        this.apiUrl = gapi_config.ebmsMessageHeaderAttributeNamesUrl;
    }
});

window.FundRegister = window.GApiModel.extend({
    constructor: function (options) {
        window.GApiModel.prototype.constructor.apply(this, arguments);
        this.apiUrl = gapi_config.fundRegisterUrl;
    }
});

window.FundRegisters = window.GApiCollection.extend({

	model : FundRegister,

	constructor : function() {
		window.GApiCollection.prototype.constructor.apply(this, arguments);
		this.apiUrl = gapi_config.fundRegisterUrl;
	}
});

window.LoginDetails = window.GApiModel.extend({
    constructor : function() {
        window.GApiModel.prototype.constructor.apply(this, arguments);
        this.apiUrl = gapi_config.loginDetailsUrl;
    }
});

window.ErrorDetails = window.GApiModel.extend({
    constructor : function() {
        window.GApiModel.prototype.constructor.apply(this, arguments);
        this.apiUrl = gapi_config.errorDetailsesUrl;
    }
});

