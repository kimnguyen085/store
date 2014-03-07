var messageTypeFilters = {
    "RTR": {
        value: "Rollover Transaction Request"
    },
    "IRR": {
        value: "Initiate Rollover Request"
    },
    "IRER": {
        value: "Initiate Rollover Error Response"
    },
    "RTOR": {
        value: "Rollover Transaction Outcome Response"
    }
}

window.TabSendOutgoing = TabContentView.extend({

    initialize: function () {

        TabContentView.prototype.initialize.apply(this, arguments);

        this.tabName = $.i18n.prop('tab.send.outgoing');

        this.messagePage = this.options.messagePage;

        this.prepareContent();
    },

    prepareContent: function () {
        this.messageSenderInputsView = new GenericElementView({
            tagName: 'form',
            attributes: {
                "action": "#"
            },
            templateName: 'partial/tab-send-outgoing-filter',
            messageTypeLabel: $.i18n.prop('lable.form.message.type'),
            ebMSMessageHeadersLabel: $.i18n.prop('lable.form.ebMs.message.headers'),
            xbrlLabel: $.i18n.prop('lable.form.xbrl'),
            submitButton: $.i18n.prop('button.submit'),
            clearButton: $.i18n.prop('button.clear'),

            // init input field labels
            SourceABNLabel: $.i18n.prop('lable.form.sourceABN'),
            SourceUniqueSuperannuationIdentifierLabel: $.i18n.prop('lable.form.sourceUSI'),
            TargetABNLabel: $.i18n.prop('lable.form.targetABN'),
            TargetUniqueSuperannuationIdentifierLabel: $.i18n.prop('lable.form.targetUSI'),
            GBSTFundAdministratorIdLabel:$.i18n.prop('lable.form.GBSTFundAdministratorId'),
            GBSTSourceABNLabel: $.i18n.prop('lable.form.GBSTSourceABN'),
            GBSTSourceUniqueSuperannuationIdentifierLabel: $.i18n.prop('lable.form.GBSTSourceUSI'),
            JentrataConversationIdLabel: $.i18n.prop('lable.form.JentrataConversationId'),
            PartIdLabel: $.i18n.prop('lable.form.partId')
        });

        this.subViews.push(this.messageSenderInputsView);

        this.setDataReady();

        this.messageSenderInputsView.$el.find('input[type=text]').each(function () {
            $(this).parent().removeClass('ui-corner-all');
        });

        this.populateMessageTypeDropDown(); // create dropdown

        var messageType = this.$el.find('select').val(); // get default dropdown option value
        var tableElement = this.$el.find('#ebmsMessageHeadersTable');
        this.messagePage.loadEbmsMessageHeaderFilter(messageType, tableElement); // load the input fields for current message type dropdown option

        this.$el.find('.sender-textarea').attr('style', 'height:300px'); // override the jquery mobile style

        this.blockFilter(false);
    },

    populateMessageTypeDropDown: function () {
        var that = this;
        // create the filter list
        var messageTypeItems = [];
        _(messageTypeFilters).each(function (obj, key) {
            messageTypeItems.push({
                label: obj.value,
                value: key
            });
        });

        // create a view for dropdown
        this.messageTypeFilterDropDown = new DropDownBoxView({
            items: messageTypeItems
        });

        this.messageTypeFilterDropDown.setElement(this.messageSenderInputsView.$el.find('#tab-outgoing-sender-message-type-filter'));
        this.messageTypeFilterDropDown.render();
        this.messageTypeFilterDropDown.setSelectedIndex(0);


        this.messageSenderInputsView.$el.find('select').on('change',function (e) { // dropdown behavior
            var messageType = that.$el.find('select').val();
            var tableElement = that.$el.find('#ebmsMessageHeadersTable');
            that.messagePage.loadEbmsMessageHeaderFilter(messageType, tableElement);     // load the input fields for first message type option (rtr)
        }).on('submit', function () { // prevent form submission
                return false;
            });

        // submit button behavior
        this.messageSenderInputsView.$el.find('button[id="sender_submit_button"]').on('click', function (e) {
            that.dataReady=true; // set the flag to true

            // get request data
            var requestParamMap = {};
            that.messageSenderInputsView.$el.find('input.enabledInput').each(function () {
                // validate headers
                if ($(this).val() === null || $(this).val() === "") {
                    that.dataReady=false;
                    var labelName = $(this).closest('tr').find('label').text();
                    Dialog.showMessage(String.format($.i18n.prop('message.invalid.input'), labelName)); // pop up validation err msg
                    return false;
                } else {
                    requestParamMap[this.id] = this.value; // assign header name and values
                }
            });

            if(that.dataReady===true){
                // validate XBRL
                var xbrl=that.messageSenderInputsView.$el.find('textarea').val();
                if(xbrl===null||xbrl===''){
                    Dialog.showMessage(String.format($.i18n.prop('message.invalid.input'), 'XBRL')); // pop up validation err msg
                    that.dataReady=false;
                    return false;
                }
            }

            if(that.dataReady===true){
                // get user name
                var userName = window.loginDetails.attributes.userName;

                that.blockFilter(true, $.i18n.prop('message.send.outgoing.processing')); // display a loading dialog on top layer of the screen

                // post data
                $.ajax({
                    dataType: "json",
                    async: false,
                    url: gapi_config.baseApiUrl + gapi_config.sendOutgoingResponseUrl,
                    data: { requestParamMap: JSON.stringify(requestParamMap),
                            userName: userName,
                            action: that.messageSenderInputsView.$el.find('select').val(),
                            payload: that.messageSenderInputsView.$el.find('textarea').val() },
                    success: function (resp) {
                        that.blockFilter(false); // disable the loading dialog on top layer
                        that.messageSenderInputsView.$el.find('button[id="sender_clear_button"]').click();
                        console.log("send response = " + resp);
                    },
                    method: "post"
                });
            }

            return false;
        });

        // clear button behavior
        this.messageSenderInputsView.$el.find('button[id="sender_clear_button"]').on('click', function (e) {
            that.dataReady=false;

            $('option[value=RTR]').attr('selected', 'selected');
            $('select').selectmenu('refresh');
            $('select').change();

            that.messageSenderInputsView.$el.find('input.enabledInput').val('');
            that.messageSenderInputsView.$el.find('textarea').val('');
        }).on('submit', function () { // prevent form submission
                return false;
        });
    },

    blockFilter: function (block, message) {
        if (typeof block == 'undefined') {
            block = true;
        }
        console.log('Block filter requested, ', block);
        if (block && !this.blockingFilter) {
            this.messageSenderInputsView.$el.block({
                message: "<div class='data-loading'><span>" + message + "</span></div>"
            });
        } else {
            this.messageSenderInputsView.$el.unblock();
        }
        this.blockingFilter = block;
    }


});