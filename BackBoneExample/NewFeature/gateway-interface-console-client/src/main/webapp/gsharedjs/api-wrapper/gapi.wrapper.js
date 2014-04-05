window.gapi = {
    fetch: function (options) {
        window.jsessionCookie = window.jsessionCookie || getCookie('JSESSIONID');

        if (typeof window.jsessionCookie == 'undefined' || window.jsessionCookie == null){
            throw "Empty JSESSION ID";
        }

        options = options || {};
        options.data = options.data || {};
        _.extend(options.data, {
            "JSESSIONID": window.jsessionCookie,
            "ht": 1,
            "tb": 1
        });

        options.method = 'GET';
        options.dataType = 'json';

        return Backbone.ajax(options);
    },

    changePassword: function (postData, callback) {
    	return $.ajax({
    		url: gapi_config.baseApiUrl + gapi_config.changePassword,
    		type : 'POST',
    		data: postData,
    		//contentType: 'application/json',

    		success: function (data) {
    			if (callback) {
    				callback(data, "success");
    			}
    		},

    		error: function (jqXHR) {
    			if (callback) {
    				callback(jqXHR, "error");
    			}
    		}
    	});
    },

    setUserViewHandler : function(postData, callback) {
		return $.ajax({
			url : gapi_config.baseApiUrl + gapi_config.setUserViewUrl,
			type : 'POST',
			xhrFields: {
				withCredentials: true
			},
			data : postData,
			success : function(data) {
				var errorCode;
				if (data.indexOf('SUCCESS') >= 0) {
					errorCode = 0;
				} else if (data.indexOf('FAILED') >= 0) {
					errorCode = 1;
				} else if (data.indexOf('NO USER') >= 0) {
					errorCode = 2;
				} else {
					errorCode = 3;
				}
				if ( typeof callback == 'function') {
					callback(errorCode, data);
				}
			},

			error: function (jqXHR) {
				if (typeof callback == 'function') {
					callback(-1, jqXHR);
				}
			}
		});
	},

    loginHandler : function(postData, callback) {
		return $.ajax({
			url : gapi_config.baseApiUrl + gapi_config.loginUrl,
			type : 'POST',
			xhrFields: {
				withCredentials: true
			},
			//crossDomain: true,
			//dataType: 'json',
			//withCredentials: true,
			data : postData,
			// CANNOT USE SUCCESS, AS EMPTY DATA RETURNED, AND JQUERY CANNOT PARSE EMPTY TO JSON OBJECT, THUS TREATED THE REQUEST AS FAILED...
			success : function(data) {
				var errorCode;
				if (data.indexOf('SUCCESS') >= 0) {
					errorCode = 0;
				} else if (data.indexOf('FAILED') >= 0) {
					errorCode = 1;
				} else if (data.indexOf('CHANGE PASSWORD') >= 0) {
					errorCode = 2;
				} else if (data.indexOf('SINGLE_USER_CONCURRENT_ACCESS') >= 0) {
					errorCode = 4;
				} else {
					errorCode = 3;
				}

				if ( typeof callback == 'function') {
					callback(errorCode, data);
				}
			},

			error: function (jqXHR) {
				if (typeof callback == 'function') {
					callback(-1, jqXHR);
				}
			}
		});
	},

	logoutHandler: function (callback) {
		return $.get(gapi_config.baseApiUrl + gapi_config.logoutUrl, callback);
	}
};