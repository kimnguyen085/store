window.TabContributionDetails = TabContentView.extend({

	initialize : function() {

		TabContentView.prototype.initialize.apply(this, arguments);

		this.tabName = $.i18n.prop('tab.details');

		this.showFilter = this.options.showFilter;
		if ( typeof this.showFilter == 'undefined') {
			this.showFilter = true;
		}

		this.prepareContent();

	},

	prepareContent : function() {
		if (this.showFilter) {
			this.prepareFilters();
			this.subViews.push(new LineBreakView());

			this.prepareMessageContainer();

			this.setDataReady();

			var self = this;
			this.detailsFilter.$el.on('keydown', 'input', function(e) {
				if (e.target.name == "ebmsMessageId") {
					return window.allowNumberOnly(e);
				}
			}).on('keyup', 'input', function(e) {
				if (self.ebmsMessageTimeout) {
					clearTimeout(self.ebmsMessageTimeout);
				}
				var $input = e.target;
				self.ebmsMessageTimeout = setTimeout(function() {
					if ($input.name == "ebmsMessageId") {
						self.showMessageDetails(undefined, "");
					} else {
						self.showMessageDetails("", undefined);
					}
				}, app_config.searchInitializeDelay);
			});
		}
	},

	prepareFilters : function() {
		var self = this;
		this.detailsFilter = new GenericElementView({
			tagName : 'form',
			attributes : {
				"action" : "#"
			},
			templateName : 'partial/tab-details-filter',
			ebMSMessageIdLabel : $.i18n.prop('label.form.ebms.messageid'),
			conversationIdLabel : $.i18n.prop('label.form.conversationid')
		})
		this.subViews.push(this.detailsFilter);
	},

	prepareMessageContainer : function() {
		this.messageContainer = new GenericElementView();
		this.subViews.push(this.messageContainer);
	},

	loadMessageDetail : function(messageId, conversationId) {
		if (this.model && (messageId == this.model.id || conversationId == this.model.attributes.conversationId)) {
			return;
		}

		var initialData = {};

		if (messageId) {
			initialData.ebmsMessageId = messageId;
		}

		if (conversationId != "") {
			initialData.conversationId = conversationId;
		}

		this.model = new EbmsMessageDetail(initialData);
		this.loadData();
	},

	loadData : function() {

		if (this.messageFetch && this.messageFetch.readyState > 0 && this.messageFetch.readyState < 4) {
			this.messageFetch.abort();
		}

		if (this.showFilter) {
			this.clearDetails();
			this.blockContent(true, $.i18n.prop('message.details.loading'));
		} else {
			this.setDataLoading(true);
		}

		var data = {
			includeParts : "true"
		};

		var self = this;
		this.messageFetch = this.model.fetch({
			data : data,
			success : function() {
				self.renderMessageAndParts();
			},
			error : function(model, request) {
				if (request.statusText != "abort") {
					if (request.status == 404) {
						self.displayMessage($.i18n.prop('message.search.not.found'), false, self.messageContainer.$el);
					} else {
						self.displayMessage($.i18n.prop('message.search.request.failed'), true, self.messageContainer.$el);
					}
				}
			},
			complete : function() {
				if (self.showFilter) {
					self.blockContent(false);
				}
			}
		});
	},

	blockContent : function(block, message) {
		if ( typeof block == 'undefined') {
			block = true;
		}
		if (this.detailsFilter) {
			if (block) {
				this.detailsFilter.$el.block({
					message : "<div class='data-loading'><span>" + message + "</span></div>"
				});
			} else {
				this.detailsFilter.$el.unblock();
			}
		}
	},

	renderMessageAndParts : function() {
		this.drawMessageDetails();
		this.drawPartAccordion();

		if (!this.showFilter) {
			this.setDataReady();
		}
	},

	drawMessageDetails : function() {
		this.messageDetails = new GenericElementView(_.extend({
			templateName : 'partial/message-details',
			ebmsMessagesDetailLabel : $.i18n.prop('title.label.message.detail'),
			ebmsMessageIdLabel : $.i18n.prop('message.info.label.id'),
			conversationIdLabel : $.i18n.prop('message.info.label.conversation.id'),
			gatewayMessageIdLabel : $.i18n.prop('message.info.label.gateway.message.id'),
			directionLabel : $.i18n.prop('message.info.label.direction'),
			typeLabel : $.i18n.prop('message.info.label.type'),
			receivedLabel : $.i18n.prop('message.info.label.received'),
			deliverLabel : $.i18n.prop('message.info.label.deliver'),
			statusLabel : $.i18n.prop('message.info.label.status'),
			btnRawMessage : $.i18n.prop('button.showRawMessage'),
            submittedUserAccountLabel: $.i18n.prop('message.info.label.submitted.user.account')
		}, this.model.toJSON()));

		if (this.showFilter) {
			this.messageContainer.$el.append(this.messageDetails.render().el);
			this.messageDetails.$el.trigger('create');
			// for JQM enhance
		} else {
			this.subViews.push(this.messageDetails);
		}

		if (FeaturesEnabler.shouldEnable('mshMessageService')) {
			var self = this;
			this.messageDetails.$el.on('click', 'a', function(e) {
				self.showRawMessage();
				return false;
			});
		} else {
			if (this.dataReady) {
				this.messageDetails.$el.find('a').hide();
			} else {
				var self = this;
				this.on('dataready', function () {
					self.messageDetails.$el.find('a').hide();
				});
			}
		}
	},

	drawPartAccordion : function() {
		var self = this;
		this.partAccordionView = new AccordionView({
			attributes : {
				"data-theme" : "b",
				"data-content-theme" : "b",
				"data-inset" : "true",
				"data-iconpos" : "right",
				"data-iconshadow" : "false",
				"class" : "ui-icon-nodisc"
				// "class" : "ui-icon-nodisc ui-icon-alt"
			}
		});

		var self = this;
		_.each(this.model.attributes.ebmsMessageParts, function(aPart) {
			self.partAccordionView.sections.push(new PartContributionSection({
				model : new MessagePart(_.extend(aPart, {
					parent : self.model
				}))
			}));
		});

		if (this.showFilter) {
			this.messageContainer.$el.append(this.partAccordionView.render().el);
			this.partAccordionView.refresh();
		} else {
			this.subViews.push(this.partAccordionView);
		}
	},

	showMessageDetails : function(messageId, conversationId) {
		if (this.showFilter) {
			if ( typeof messageId == 'undefined') {
				messageId = this.detailsFilter.$el.find('input[name="ebmsMessageId"]').val().trim();
			} else {
				this.detailsFilter.$el.find('input[name="ebmsMessageId"]').val(messageId);
			}
			if ( typeof conversationId == 'undefined') {
				conversationId = this.detailsFilter.$el.find('input[name="conversationId"]').val().trim();
			} else {
				this.detailsFilter.$el.find('input[name="conversationId"]').val(conversationId);
			}
		}

		if (isNaN(messageId) || ( messageId = parseInt(messageId)) < 1) {
			Dialog.showMessage($.i18n.prop('message.search.error'));
			return;
		}

		if (messageId > 0 || conversationId != "") {
			this.loadMessageDetail(messageId, conversationId);
		}
	},

	clearDetails : function() {
		if (this.messageDetails) {
			this.messageDetails.remove();
			this.messageDetails.unbind();
		}
		if (this.partAccordionView) {
			this.partAccordionView.remove();
			this.partAccordionView.unbind();
		}
		if (this.messageContainer) {
			this.messageContainer.$el.empty();
		}
	},

	removalHandler : function() {
		if (this.messageFetch && this.messageFetch.readyState > 0 && this.messageFetch.readyState < 4) {
			this.messageFetch.abort();
		}
		if (this.partAccordionView) {
			// cancel all pendding fetch process
			_(this.partAccordionView.sections).each(function(section) {
				section.cancelFetch();
			});
		}
	},

	showRawMessage : function() {
		if (!this.rawModel) {
			this.rawModel = new EbmsMessageRaw({
	           	ebmsMessageId: this.model.id
	    	});

	    	var $container = this.messageDetails.$el.find('.raw-message-container');
    		$container
    			.addClass('data-loading')
    			.show();
	    	var self = this;
	    	this.rawModel.fetch({
	    		success: function () {
	    			$container
	    				.removeClass("data-loading")
	    				.html('<pre>' + self.rawModel.attributes.message.escape() + '</pre>');
	    			self.toggleRawMessage();
	    		},

	    		error: function () {
	    			$container
	    				.removeClass("data-loading")
	    				.addClass('text-red')
	    				.html($.i18n.prop('message.info.label.raw.error'));
	    		}
	    	});
		} else {
			this.toggleRawMessage();
		}
	},

	toggleRawMessage: function () {
		var $container = this.messageDetails.$el.find('.raw-message-container');
		var $pre = $container.children('pre');
		if ($pre.length > 0) {
			$pre.snippet("xml", {
				style : "peachpuff"
			});
		} else {
			$container.toggle();
		}
		var btnShowRawMessage = this.messageDetails.$el.find('a.show-raw-message');
		var showMessage = $.i18n.prop('button.showRawMessage');
		var hideMessage = $.i18n.prop('button.hideRawMessage');
		if (btnShowRawMessage.text() == showMessage) {
			btnShowRawMessage.find('.ui-btn-text').text(hideMessage);
		} else {
			btnShowRawMessage.find('.ui-btn-text').text(showMessage);
		}
	}

});

/*
 * Accordion Section
 */

window.DetailContributionSection = AccordionSection.extend({
	initialize : function() {
		AccordionSection.prototype.initialize.apply(this, arguments);

		this.parent = this.options.parent;

		this.titleTemplate = _.template(tpl.get('partial/accordion-section-title'));

		this.defaultLabel = {
			btnShowXBRL : $.i18n.prop('button.showXBRL'),
			logMessageLable : $.i18n.prop('title.label.logmessages'),
			isPartSection: true,
			sourceEntityId : this.model.attributes.sourceEntityID ? this.model.attributes.sourceEntityID : "",
			targetParticipantName :  this.model.parent.attributes.targetParticipantId ? this.model.parent.attributes.targetParticipantId.name : "",
			targetParticipantProductName : this.model.parent.attributes.targetParticipantId ? this.model.parent.attributes.targetParticipantId.productName : ""
		};
		
		this.logsContentEmpty = $.i18n.prop('document.content.logspart.empty');

		this.fetchProcess = [];

		this.errorDetails = {};
	},

	cancelFetch : function() {
		var proc;
		while (( proc = this.fetchProcess.pop()) != null) {
			if (proc && proc.readyState > 0 && proc.readyState < 4) {
				proc.abort();
			}
		}
	},

	loadData : function() {
		this.logReady = false;
		this.logError = false;
		this.documentReady = false;
		this.documentError = false;

		this.setDataLoading();

		this.drawDetailTitle();

		var self = this;
		this.fetchProcess.push(this.model.documents.fetch({
			success : function() {
				self.drawDocumentContent();
			},

			error : function(jqXHR) {
				self.handleError("document");
			}
		}));

		this.fetchProcess.push(this.model.logs.fetch({
			success : function() {
				self.drawLogTable();
			},

			error : function() {
				self.handleError("log");
			}
		}));
	},

	handleError : function(flag) {
		this[flag + "Error"] = true;
		this.subViews.push(new GenericElementView({
			templateName : 'partial/error',
			errorFlag : flag
		}));
		this.drawContent();
	},

	wait : function(flag, callback) {
		var self = this;
		if (this[flag + "Ready"] || this[flag + "Error"]) {
			callback();
		} else {
			setTimeout(function() {
				self.wait(flag, callback);
			}, 200);
		}
	},

	waitForDocument : function(callback) {
		this.wait("document", callback);
	},

	waitForLog : function(callback) {
		this.wait("log", callback);
	},

	drawDetailTitle : function() {
		this.detailTitle = new GenericElementView(_.extend({
			templateName : 'partial/message-contribution-details-title',
			sourceLabel : $.i18n.prop('message.info.label.source'),
			targetLabel : $.i18n.prop('message.info.label.target'),
		}, this.defaultLabel));

		this.subViews.push(this.detailTitle);
	},

	drawDocumentContent : function() {
		var documentContent = "Empty";
		if (this.model.documents.length > 0) {
			documentContent = this.model.documents.at(0).attributes.document;
		}

		this.documentContent = new GenericElementView({
			templateName : 'partial/document-details',
			documentDetail : documentContent.escape()
		});

		var self = this;
		this.waitForLog(function() {
			self.subViews.push(self.documentContent);
			self.documentReady = true;
			self.drawContent();
		});
	},

	linkToError : function(value, rowData) {
		if (FeaturesEnabler.shouldEnable('stackTraceService')) {
			return String.format('{0}<br/><a href="#" data-messagelogid="{1}">{2}</a>', value, rowData[1], $.i18n.prop('message.info.label.error.details'));
		}
		return value;
	},

	getErrorDetailsContent: function (messageLogId) {
		var content = "";
		if (!this.errorDetails[messageLogId].fetching) {
			_(this.errorDetails[messageLogId].attributes).each(function(errorDetails) {
				content += String.format("<pre class='error-details'>{0}</pre><br/>", errorDetails.sourceErrorDetails);
			});
		}
		if (content == "") {
			//content = "<div class='error-details-container data-loading'></div>";
			content = "<div class='data-loading'></div>";
		} else {
			content = String.format("<div class='error-details-container'>{0}</div>", content);
		}
		return content;
	},

	updateErrorDetailsDialogContent: function (messageLogId, isError) {

		if ($.mobile.sdCurrentDialog) {
			var content = "";
			if (isError) {
				content = String.format( "<div class='text-red'>{0}</div>", $.i18n.prop('message.error.details.loading') );
			} else {
				content = this.getErrorDetailsContent(messageLogId);
			}
			$newContent = $(content);
			$.mobile.sdCurrentDialog.sdIntContent.find('div.data-loading')
				.replaceWith($newContent);
			var headerHeight = $.mobile.sdCurrentDialog.sdHeader.height()
				+ $.mobile.sdCurrentDialog.sdHeader.border().top + $.mobile.sdCurrentDialog.sdHeader.border().bottom
				+ $.mobile.sdCurrentDialog.sdHeader.padding().top + $.mobile.sdCurrentDialog.sdHeader.padding().bottom
				+ $.mobile.sdCurrentDialog.sdHeader.margin().top + $.mobile.sdCurrentDialog.sdHeader.margin().bottom
				+ $newContent.padding().top + $newContent.padding().bottom
				+ $newContent.margin().top + $newContent.margin().bottom;
			$newContent.height($.mobile.sdCurrentDialog.sdIntContent.height() - headerHeight);

			$newContent.find('pre').snippet('java', {
				style : "dull"
			});
			//$.mobile.sdCurrentDialog.sdIntContent.html(content);
		}
	},

	showErrorDetailsDialog: function (messageLogId) {
		var content = this.getErrorDetailsContent(messageLogId);
		$(document).simpledialog2({
			mode: 'blank',
			zindex : 1500,
			headerText : $.i18n.prop('lable.simpledialog.error.details'),
			headerClose : true,
			fullScreen : true,
			fullScreenForce : true,
			width : 'auto',
			blankContent: content
		});
	},

	showErrorDetails : function(messageLogId) {
		if (this.errorDetails[messageLogId]) {
			this.showErrorDetailsDialog(messageLogId);
		} else {

			this.errorDetails[messageLogId] = new ErrorDetails();

			var self = this;
			//this.blockContent(true, $.i18n.prop('message.error.details.loading'));
			this.errorDetails[messageLogId].fetching = true;

			this.showErrorDetailsDialog(messageLogId);

			this.errorDetails[messageLogId].fetch({
				data : {
					messageLogId: messageLogId
				},

				success : function() {
					self.errorDetails[messageLogId].fetching = false;
					self.updateErrorDetailsDialogContent(messageLogId, false);
				},

				error : function () {
					self.updateErrorDetailsDialogContent(messageLogId, true);
				},

				complete : function () {
					self.errorDetails[messageLogId].fetching = false;
				}
			});
		}
	},

	drawLogTable : function() {
		var self = this;
		if (this.model.logs.length > 0) {
			this.logTable = new TableView({
				useDataTable : true,
				//enableSmartResize : true,
				attributes : {
					"class" : "table-style-1 border-style-1",
					"cellspacing" : "0",
					"cellpadding" : "0"
				},
				bindings : {
					headers : [{
						dataAttribute : 'errorDetailsCount',
						aoColumn: {bVisible: false}
					}, {
						dataAttribute : 'messageLogId',
						aoColumn: {bVisible: false}
					}, {
						title : $.i18n.prop('message.info.label.type'),
						dataAttribute : 'logType',
						width : '10%',
						dataFormat : function(value, type, rowData) {
							if (type == 'sort' || type == 'filter') {
								return value;
							}
							if (rowData[0] != "" || rowData[0] > 0) {
								return self.linkToError(value, rowData);
							}
							return value;
						}
					}, {
						title : $.i18n.prop('message.info.label.code'),
						dataAttribute : 'code',
						width : '10%'
					}, {
						title : $.i18n.prop('message.info.label.description'),
						dataAttribute : 'description',
						width : '30%'
					}, {
						title : $.i18n.prop('message.info.label.details'),
						dataAttribute : 'details',
						width : '50%'
					}],
					data : this.model.logs.toJSON()
				}
			});
			this.subViews.push(this.logTable);

			this.subViews.push(new LineBreakView({
				count : 2
			}));

		} else {
			var self = this;
			this.subViews.push(new GenericElementView({
				templateName : 'partial/table-empty',
				emptyLabel : self.logsContentEmpty
			}));
		}
		this.logReady = true;
		this.drawContent();
	},

	drawContent : function() {

		if ((this.logReady || this.logError) && (this.documentReady || this.documentError)) {

			this.setDataReady();

			if (this.logReady && this.model.logs.length > 0) {
				this.logTable.enableDataTable({
					"sDom" : "lrtip",
					"sPaginationType" : "full_numbers",
					"iDisplayLength" : app_config.numberOfDataRows,
					"bAutoWidth" : false
				});

				/*
				 * on click to show errorDetails
				 */
				this.logTable.$el.on('click', 'a', function(e) {
					var messageLogId = $(e.target).data('messagelogid');
					if (messageLogId != undefined) {
						self.showErrorDetails(messageLogId);
			}
					return false;
				});
			}

			if (this.documentReady) {

				if (this.logReady && this.model.logs.length > 0) {
					this.logTable.$el.siblings('.dataTables_length').appendTo(this.detailTitle.$el.find('.table-length-dropdown-placeholder'));
				}

				var self = this;
				this.detailTitle.$el.find('a').click(function() {
					var $pre = self.documentContent.$el.find('.document-container');
					var valButtonLogs = self.detailTitle.$el.find('a').text();
					var showXBRL = $.i18n.prop('button.showXBRL');
					var hideXBRL = $.i18n.prop('button.hideXBRL');
					var showXML = $.i18n.prop('button.showXML');
					var hideXML = $.i18n.prop('button.hideXML');

					var btnShowContent = self.detailTitle.$el.find('a');

					if ($pre.prop('tagName') == 'PRE') {
						$pre.snippet("xml", {
							style : "peachpuff"
						});

						if (btnShowContent.text() == showXBRL) {
							btnShowContent.find('.ui-btn-text').text(hideXBRL);
						} else if (btnShowContent.text() == hideXBRL) {
							btnShowContent.find('.ui-btn-text').text(showXBRL);
						} else if (btnShowContent.text() == showXML) {
							btnShowContent.find('.ui-btn-text').text(hideXML);
						} else {
							btnShowContent.find('.ui-btn-text').text(showXML);
						}
					}
					$pre.toggle();
					return false;
				});
			}
		}
	}
});

window.PartContributionSection = DetailContributionSection.extend({

	initialize : function() {
		DetailContributionSection.prototype.initialize.apply(this, arguments);

		this.id = "part-" + this.model.id;
		// format Datetime status updated
		var statusDatetime;
		if (this.model.attributes.statusDatetime == null) {
			statusDatetime = "";
		} else {
			statusDatetime = String.format(" ({0})", dateFormat(this.model.attributes.statusDatetime, app_config.dateTimePattern));
		}
		var receivedDateTime;
		if (this.model.attributes.receivedDatetime == null) {
			receivedDateTime = "";
		} else {
			receivedDateTime = dateFormat(this.model.attributes.receivedDatetime, app_config.datePattern);
		}

		this.title = this.titleTemplate({
			customClass : "message-part-title",
			col1 : String.format("{0}: {1}", $.i18n.prop('message.info.label.part.id'), this.model.attributes.partId),
			col2 : String.format("{0}: {1}", $.i18n.prop('message.info.label.part.received'), receivedDateTime),
			col3 : String.format("{0}: {1}{2}", $.i18n.prop('message.info.label.part.status'), this.model.attributes.status, statusDatetime),
			col4 : String.format("{0}: {1}", $.i18n.prop('message.info.label.part.transaction.count'), this.model.attributes.messageTransactionCount)
		});

		this.loadData();
	},

	loadData : function() {
		DetailContributionSection.prototype.loadData.apply(this, arguments);

		this.transactionReady = false;
		this.transactionError = false;
		var self = this;
		this.fetchProcess.push(this.model.transactions.fetch({
			success : function() {
				self.drawTransactionAccordion();
			},

			error : function() {
				self.handleError('transaction');
			}
		}));
	},

	drawTransactionAccordion : function() {
		this.transactionAccordionView = new AccordionView({
			attributes : {
				"data-theme" : "b",
				"data-content-theme" : "b",
				"data-inset" : "true",
				"data-iconpos" : "right",
				"data-iconshadow" : "false",
				"class" : "ui-icon-nodisc"
			}
		});

		var self = this;
		this.model.transactions.each(function(transaction) {
			self.transactionAccordionView.sections.push(new TransactionContributionSection({
				model : transaction
			}));
		});

		this.waitForDocument(function() {
			self.subViews.push(self.transactionAccordionView);
			self.transactionReady = true;
			self.drawContent();
		});
	},

	drawContent : function() {
		// override just for prevent draw until transaction ready
		// when transaction ready, log and details should be ready already
		// since transaction ready wait for log
		if (this.transactionReady || this.transactionError) {
			DetailContributionSection.prototype.drawContent.apply(this, arguments);
		}
	}
});

window.TransactionContributionSection = DetailContributionSection.extend({
	initialize : function() {
		DetailContributionSection.prototype.initialize.apply(this, arguments);

		this.id = "transaction-" + this.model.id;
		// format Datetime status updated
		var statusDatetime = this.model.attributes.statusDatetime;
		if (statusDatetime != null) {
			statusDatetime = String.format(" ({0})", dateFormat(statusDatetime, app_config.dateTimePattern));
		} else {
			statusDatetime = "";
		}
		this.title = this.titleTemplate({
			customClass : "transaction-title",

			col1 : String.format("{0}: {1}", $.i18n.prop('message.info.label.transaction.id'), this.model.id),
			col2 : "",
			col3 : String.format("{0}: {1}{2}", $.i18n.prop('message.info.label.transaction.status'), this.model.attributes.status, statusDatetime),
			col4 : ""
		});

		this.defaultLabel = {
			btnShowXBRL : $.i18n.prop('button.showXML'),
			logMessageLable : $.i18n.prop('title.label.logmessages'),
			isPartSection: false,
		};
		this.logsContentEmpty = $.i18n.prop('document.content.logstransaction.empty')

		this.loadData();
	}
});
