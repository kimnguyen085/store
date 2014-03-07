/**
 * Tab Upload Register
 **/
window.TabUploadRegister = TabContentView.extend({

	initialize : function() {

		TabContentView.prototype.initialize.apply(this, arguments);

		this.tabName = $.i18n.prop('tab.upload.register');
		this.prepareContainers();
	},
	prepareContainers : function() {
		var self = this;
		this.uploadRegisterTemplate = new GenericElementView({
			tagName : 'form',
			attributes : {
				"action" : "#"
			},
			templateName : 'partial/tab-upload-register',
			fileUploadLabel : $.i18n.prop('loadFVS.info.label.choose.file.upload'),
			btnUpload : $.i18n.prop('button.upload'),
			btnbrowse : $.i18n.prop('button.browse'),
		});
		this.subViews.push(this.uploadRegisterTemplate);
		this.setDataReady();

		this.uploadRegisterTemplate.$el.find('input[type=file]').each(function() {
			$(this).parent().removeClass('ui-corner-all');
		});

		setTimeout(function(){
			self.uploadRegister();
		}, 200)

		// this.uploadRegisterTemplate.$el.on('keyup :input', function (e) {
			// if (e.target.name == 'generalFilter') {
				// if (self.filterTimeout) {
					// clearTimeout(self.filterTimeout);
				// }
				// var filterValue = e.target.value;
				// self.filterTimeout = setTimeout(function () {
					// self.uploadRegister(filterValue.trim());
				// }, app_config.searchInitializeDelay);
			// }
		// });
	},

	disableUploadButton: function (disable) {
		if (disable) {
			this.uploadRegisterTemplate.$el.find('button[data-type=upload]').button('disable');
		} else {
			this.uploadRegisterTemplate.$el.find('button[data-type=upload]').button('enable');
		}
	},


	uploadRegister : function () {
		var self = this;
		this.disableUploadButton(true);
		this.uploadRegisterTemplate.$el.on('change', 'input[type=file]', function(e) {
			var valueFileUpload = $(e.target).val();
			var extensionFile = valueFileUpload.substr((valueFileUpload.lastIndexOf('.') + 1));
			if (valueFileUpload == '') {
				self.disableUploadButton(true);
			} else if (extensionFile != 'csv') {
				Dialog.showMessage($.i18n.prop('message.loadfvs.type.file.must.csv'));
			} else {
				self.uploadRegisterTemplate.$el.find('#tab-upload-file-name').val(valueFileUpload);
				self.disableUploadButton(false);
			}
		}).on('submit', function() {
			return false;
		});
		// prevent form submission
	}
});
