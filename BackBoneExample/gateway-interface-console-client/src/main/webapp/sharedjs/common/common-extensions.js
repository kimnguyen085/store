if (typeof String.prototype.endsWith !== 'function') {
	String.prototype.endsWith = function(suffix, caseSensitive) {
		if (caseSensitive) {
			return this.indexOf(suffix, this.length - suffix.length) !== -1;
		} else {
			return this.toLowerCase().indexOf(suffix.toLowerCase(), this.length - suffix.length) !== -1;
		}

	};
}

if (typeof String.prototype.startsWith !== 'function') {
	String.prototype.startsWith = function(prefix, caseSensitive) {
		if (caseSensitive) {
			return this.indexOf(prefix) === 0;
		} else {
			return this.toLowerCase().indexOf(prefix.toLowerCase()) === 0;
		}
	};
}

if (typeof String.prototype.format !== 'function') {
	String.format = function () {
		var args = Array.prototype.slice.call(arguments);
		var firstArg = args.shift();
		return String.prototype.format.apply(firstArg, args);
	};

	String.prototype.format = function () {
	    var output = this;
	    var i = 0;

	    for (; i < arguments.length; i ++ ) {
	        output = output.replace(new RegExp('\\{' + i + '\\}', "g"), (typeof arguments[i] == 'undefined' || arguments[i] == null) ? "" : arguments[i]);
	    }
	    return output;
	};
}

if ( typeof String.prototype.trim !== 'function') { // IE8 man!
	String.prototype.trim = function() {
		return this.replace(/^\s+|\s+$/g, '');
	}
}

if (typeof String.prototype.escape !== 'function') {
	String.prototype.escape = function() {
	    var tagsToReplace = {
	        '&': '&amp;',
	        '<': '&lt;',
	        '>': '&gt;'
	    };
	    return this.replace(/[&<>]/g, function(tag) {
	        return tagsToReplace[tag] || tag;
	    });
	};
}

window.allowNumberOnly = function (event) {
	var keyCode = ('which' in event) ? event.which : event.keyCode;
	// Allow: backspace, delete, tab, escape, and enter
    if ( keyCode == 46 || keyCode == 8 || keyCode == 9 || keyCode == 27 || keyCode == 13 ||
         // Allow: Ctrl+A
        (keyCode == 65 && event.ctrlKey === true) ||
         // Allow: home, end, left, right
        (keyCode >= 35 && keyCode <= 39)) {
             // let it happen, don't do anything
             return;
    }
    else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105)) {
            event.preventDefault();
            return;
        }
    }
}

Backbone.View.prototype.getUUID = function(prefix) {
	var timestamp = new Date().getTime();
	this.uuid = (prefix !== undefined ? prefix + '_' : '') + timestamp + '_' + Math.floor(Math.random() * timestamp + 1);
	return this.uuid;
};

Backbone.isInDOM = function (el) {
	el = $(el); // make sure we got a jQuery object
	return $.contains(document.documentElement, el[0]);
}

// override backbone ajax function
Backbone.ajax = function (options) {

	Backbone.activeAjaxQueue = Backbone.activeAjaxQueue || [];

	options = options || {};

	// retry implementation
	if (typeof options.enabledRetry == 'undefined') {
		options.enabledRetry = true; // default will retry
	}
	options.retryDelay = options.retryDelay || 200; // delay 200 ms
	options.maxRetryCounts = options.maxRetryCounts || 100; // retry 100 time
	if (options.enabledRetry) {
		var self = this;
		var complete = options.complete;
		var error = options.error;
		options.error = null; // clear error
		options.complete = function (jqXHR, textStatus) {
			//console.log("Fetch for " + self.urlRoot + " completed. - Status: " + textStatus);
			var retried = false;
			if (textStatus !== 'success' && textStatus !== 'notmodified') {
				if (jqXHR.status > 500) { // retry only when there's some server (temporarily) error code
					options.retryCount = options.retryCount || 0;
					options.retryCount++;
					console.log("Fetch failed, retry " + options.retryCount + " of " + options.maxRetryCounts);
					if (options.retryCount < options.maxRetryCounts) {
						if (complete) {
							options.complete = complete;
						}
						if (error) {
							options.error = error;
						}
						setTimeout(function() {
							Backbone.ajax(options);
						}, options.retryDelay);
						retried = true;
					}
				}

				if (error && !retried) { // call error upon not retry
					error(jqXHR, textStatus);
				}
			}
			if (complete && !retried) { // call the origin complete
				complete(jqXHR, textStatus);
			}
			if (!retried) {
				// console.log('remnoved xhr object from queue');
				var i = 0;
				while (i < Backbone.activeAjaxQueue.length) {
					if (Backbone.activeAjaxQueue[i].readyState == 4) {
						Backbone.activeAjaxQueue.splice(i, 1);
					}
					i++;
				}
				// console.log(Backbone.activeAjaxQueue);
			}
		}
	}

	var xhr = Backbone.$.ajax.apply(Backbone.$, [options]);
	Backbone.activeAjaxQueue.push(xhr);
	// console.log('pushed xhr object to queue');
	// console.log(xhr);
	// console.log(Backbone.activeAjaxQueue);
	return xhr;
}

// Custom datatable filtering function
$.fn.dataTableExt.afnFiltering.push(function(oSetting, aData, iDataIndex) {
	var colIndex, caseSensitive;
	var filters = $.fn.dataTableExt.currentFilters;
	var tableId = $.fn.dataTableExt.currentTable;

	// if (iDataIndex == 1) {
		// console.log("Filtering table: "+ tableId);
		// console.log("processing table: " + oSetting.nTable.id);
		// console.log(filters);
	// }
	if (tableId && oSetting.nTable.id != tableId) { // only filtering the table that is current active
		//console.log("Table is not the current requested fitler");
		return true;
	}

	var shouldShow = true;
	var tableFilterInfo = $.fn.dataTableExt.filterInformation[tableId];
	for (var key in filters) {
		if (!tableFilterInfo[key]) {
			continue;
		}
		// if (key == 'sourceabn') {
			// console.log(tableFilterInfo);
			// console.log(filters);
		// }
		colIndex = tableFilterInfo[key].columnIndex;
		caseSensitive = tableFilterInfo[key].caseSensitive;
		exactSearch = tableFilterInfo[key].exactSearch;
		try {
			if (filters[key].value) {// value will be most piority,
				// if value is an array
				if (typeof filters[key].value == 'string') {
					if (exactSearch) {// if exact search, check for equality
						if (caseSensitive) {
							shouldShow = shouldShow && aData[colIndex].toString() === filters[key].value;
						} else {
							shouldShow = shouldShow && aData[colIndex].toString().toLowerCase() === filters[key].value.toLowerCase();
						}
					} else {// else check for occurence
						if (caseSensitive) {
							shouldShow = shouldShow && aData[colIndex].toString().indexOf(filters[key].value) >= 0;
						} else {
							shouldShow = shouldShow && aData[colIndex].toString().toLowerCase().indexOf(filters[key].value.toLowerCase()) >= 0;
						}
					}
				} else { // array check ?!
					shouldShow = $.inArray(aData[colIndex].toString(), filters[key].value) > -1;
				}
			} else if (filters[key].startValue || filters[key].endValue) {// process range fitler
				value = aData[colIndex];
				if (filters[key].type == 'number') {
					if (filters[key].pattern) {
						startValue = filters[key].startValue ? $.fformat.number(unescape(filters[key].startValue).trim(), unescape(filters[key].pattern)) : undefined;
						endValue = filters[key].endValue ? $.fformat.number(unescape(filters[key].endValue).trim(), unescape(filters[key].pattern)) : undefined;
					} else {
						startValue = parseFloat(filters[key].startValue);
						endValue = parseFloat(filters[key].endValue);
					}
				} else if (filters[key].type == 'date') {
					startValue = filters[key].startValue ? $.fformat.date(unescape(filters[key].startValue), unescape(filters[key].pattern)).getTime() : undefined;
					endValue = filters[key].endValue ? $.fformat.date(unescape(filters[key].endValue), unescape(filters[key].pattern)).getTime() : undefined;
				}

				if (!isNaN(endValue) && !isNaN(startValue)) {// if both startValue and end Value have value, check for range
					shouldShow = shouldShow && (value > startValue && value < endValue);
				} else {// otherwise, check for greater than start value
					shouldShow = shouldShow && (isNaN(startValue) ? value < endValue : value > startValue);
				}

				//}
			}
		} catch (err) {
			shouldShow = true;
			console.log(String.format('Invalid filter value for key {0}', key));
			console.log(filters[key]);
		}

		if (!shouldShow) {// return if false
			return false;
		}
	}

	return true;
	// default display all
});

// jQuery.fn.serializeNoPlus = function() {
	// return this.serialize().replace(/\+/g, '%20');
// }
