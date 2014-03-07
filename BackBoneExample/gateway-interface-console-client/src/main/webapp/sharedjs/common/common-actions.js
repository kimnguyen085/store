window.CacheRouter = Backbone.Router.extend({

	initialize : function() {
		this.firstPage = true;
		this.navigating = false;
		this.currentPage = "";
		this.pageCache = {};
		this.autoRouteFromRoutes();
	},

	navigate: function (route, options) {
		options = options || {}; // make sure that we have options object
		_.defaults(options, { trigger: true }); // default always trigger
		Backbone.Router.prototype.navigate.apply(this, [route, options]);
	},

	autoRouteFromRoutes: function () {
		// a catch all route to process implicit page
		this.route('*any', 'handleRouteAny', this['handleRouteAny']);
		// make sure
		if (this.routes) {
			for (var key in this.routes) {
				this.route(key, this.routes[key], this[this.routes[key]]);
			}
		}
	},

	handleRouteAny: function (route, duration) {
		console.log('handling route: ');
		console.log(route);
		if ((!this.routes || !this.routes[route])) {
			if (route.startsWith('#')) {
				route = route.slice(1);
			}

			var routeParts = [];
			var routeClass = route;
			if (route.indexOf('/') > 0) {
				routeParts = route.split('/');
				routeClass = routeParts[0];
			}

			if (this.getPage(routeClass) === undefined) {
				console.log('creating page');

				// no route defined yet, use the "smart" navigation
				console.log('Class name: ', this.getPageClassName(routeClass));
				if (typeof window[this.getPageClassName(routeClass)] == 'function') {
					this.cachePage(routeClass, new window[this.getPageClassName(routeClass)]({
						params: routeParts
					}), duration);
				} else {
					this.cachePage(routeClass, new NotFoundPage(), 0); // cache forever
				}
			}

			// !!! IMPORTANT !!! we need to change the hash only, and not trigger the handler again, and since we have made trigger value to true by default, need to call navigate without trigger here
			this.navigate(route, { trigger: false, replace: true } );

			this.changePage(routeClass);
			return true;
		}
		return false;
	},

	getPageClassName : function (route) {
		// 'login' will become 'LoginPage'
		// 'message' will become 'MessagePage'
		var className = route;
		if (route.indexOf('/') > 0) {
			className = route.slice(0, route.indexOf('/')); // will consider only the first path
		}
		return className.charAt(0).toUpperCase() + className.slice(1) + 'Page';
	},

	changePage : function(page) {
		console.log('Before changing page to: ' + page);

		// due to custom caching implementation, active page might be removed from DOM when process goes here
		// if indeed active page was removed, set the active page to the first child empty mobile page
		// to prevent jQuery Mobile from failing to change the page
		if (!$.contains(document.documentElement, $.mobile.activePage[0])) {
			this.emptyPage = this.emptyPage || $('body div:first-child');
			$.mobile.activePage = this.emptyPage;
		}

		//*** TRANSITION WILL CAUSE FLICKERING OF THE FROM AND TO PAGE... ***//
		var transition = $.mobile.defaultPageTransition;
		// We don't want to slide the first page
		if (this.firstPage) {
			transition = 'none';
			this.firstPage = false;
		}

		$.mobile.changePage('#' + page, {
			//reverse: !this.firstPage,
			changeHash : false,
			transition : transition
		});
		this.firstPage = false;
		this.currentPage = page;
	},

	getPage : function(key) {
		if (this.pageCache[key]) {
			if (this.pageCache[key].duration != 0 && (new Date().getTime() - this.pageCache[key].cachedTime > this.pageCache[key].duration)) {
				this.clearPage(key);
			} else {
				return this.pageCache[key].page;
			}
		}
		return undefined;
	},

	clearPage: function (key, keepCache) {
		if (!keepCache) {
			if (this.pageCache[key]) {
				if (this.pageCache[key].page.cachExpireHandler) {
					this.pageCache[key].page.cachExpireHandler(this);
				}
				delete this.pageCache[key];
			}
		}
		console.log('clearing page: ', key);
		$('#' + key).empty().remove();
	},

	// cache page
	cachePage : function(key, page, duration) {
		console.log("cachePage: " + key);
		this.pageCache[key] = this.pageCache[key] || {};
		this.pageCache[key].page = page;
		this.pageCache[key].cachedTime = new Date().getTime();

		duration = duration || 0; // default cache forever
		if (app_config && typeof app_config.maxPageCacheTime == 'number') {
			duration = app_config.maxPageCacheTime; // if there's an app_config for maxPageCacheTime
		} else {
			duration = 30 * 60 * 1000; // 30 minutes
		}

		this.pageCache[key].duration = duration;

		page.pageId = key;
		$('#' + key).empty().remove();
		$('body').append(page.render().el);
	},

	destroyPageCache: function (exclude) {
		exclude = exclude || [];
		for (key in this.pageCache) {
			if ($.inArray(key, exclude) > -1) {
				continue;
			}
			this.clearPage(key);
		}
		this.firstPage = true;
		this.navigating = false;
		this.currentPage = "";
		this.pageCache = {};
	},

	reset: function () {
		if (Backbone.activeAjaxQueue.length > 0) {
			for (var i = 0, j = Backbone.activeAjaxQueue.length; i < j; i++) {
				if (Backbone.activeAjaxQueue[i].readyState > 0 && Backbone.activeAjaxQueue[i].readyState < 4) {
					Backbone.activeAjaxQueue[i].abort();
				}
			}
			Backbone.activeAjaxQueue = [];
		}
	}
});
