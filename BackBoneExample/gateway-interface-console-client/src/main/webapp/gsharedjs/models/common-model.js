window.GApiModel = Backbone.Model.extend({
	url: function () {
		var idPart = "";
		if (this.id) {
			idPart += "/" + this.id;
		}
		if (this.parent) {
			var parentUrl = _.result(this.parent, 'url');

			if (this.parent.id) {
				return parentUrl + "/" + this.parent.id + this.apiUrl + idPart;
			}
			return parentUrl + this.apiUrl + idPart;
		}
		return gapi_config.baseApiUrl + this.apiUrl + idPart;
	},

	constructor: function (options) {
		if (options) {
			this.parent = options.parent;
		}
		Backbone.Model.prototype.constructor.apply(this, arguments);
	}
});

window.GApiCollection = Backbone.Collection.extend({
	url: function () {
		var idPart = "";
		if (this.id) {
			idPart += "/" + this.id;
		}
		if (this.parent) {
			var parentUrl = _.result(this.parent, 'url');

			if (this.parent.id) {
				return parentUrl + "/" + this.parent.id + this.apiUrl + idPart;
			}
			return parentUrl + this.apiUrl + idPart;
		}
		return gapi_config.baseApiUrl + this.apiUrl + idPart;
	},

	constructor: function (arrVal, options) {
		if (options) {
			this.parent = options.parent;
		}
		Backbone.Collection.prototype.constructor.apply(this, arguments);
	}
});

window.GApiStandaloneModel = window.GApiModel.extend({
	url: function () {
		return gapi_config.baseApiUrl + this.apiUrl;
	},

	fetch : function (options) {
		options.data = options.data || {};
		if (this.parent) {
			options.data[this.parent.idAttribute] = this.parent.id;
		}
		if (this.id) {
			options.data[this.idAttribute] = this.id;
		}

		return GApiModel.prototype.fetch.apply(this, arguments);
	}
});

window.GApiStandaloneCollection = window.GApiCollection.extend({
	url: function () {
		return gapi_config.baseApiUrl + this.apiUrl;
	},

	fetch : function (options) {
		options.data = options.data || {};
		if (this.parent) {
			options.data[this.parent.idAttribute] = this.parent.id;
		}
		if (this.id) {
			options.data[this.idAttribute] = this.id;
		}

		return GApiCollection.prototype.fetch.apply(this, arguments);
	}
});

