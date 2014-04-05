//resetting the whole form
function resetForm($form) {
	$form.find('input:text, input:password').val('');
	$form.find('select').val('0');
	$('select').selectmenu('refresh');
}

//getting cookie value
function getCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
		c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0)
			return c.substring(nameEQ.length, c.length);
	}
	return null;
}

/**
 * For mat the number follow the global pattern
 * @param num
 */
function nformat(num, formatString) {
	formatString = formatString || app_config.numberPattern;
	return $.fformat.number(num, formatString);
}

/**
 * For mat the number follow the global pattern
 * @param num
 */
function dateFormat(value, formatString) {
	formatString = formatString || app_config.datePattern;
	if ( typeof value == 'string') {
		value = $.fformat.date(value, app_config.serverDatePattern);
	} else {
		value = new Date(value);
	}
	return $.fformat.date(value, formatString);
}

/***
 * Format the money
 * @param num money value
 * @param curr currency
 */
function mformat(num) {
	if (num < 0) {
		return '<span class="money">-' + app_config.currencySymbol + nformat(-num) + '</span>';
	} else {
		return '<span class="money">' + app_config.currencySymbol + nformat(num) + '</span>';
	}
}

/**
 * Format for the type text in confirmations and orders tab
 */
function typeFormat(typeText) {
	if (typeText.toLowerCase() == 'buy') {
		return '<span class="text-blue">' + typeText + '</span>';
	} else if (typeText.toLowerCase() == 'sell') {
		return '<span class="text-pink">' + typeText + '</span>';
	}
	return typeText;
}

/**
 * Get label for total value of accordion sections
 */
function totalValueLabel(total) {
	if (total > 0) {
		return "DR";
	}
	if (total < 0) {
		return "CR";
	}
	return "";
}


/**
 * Format the date
 */
function formatDate(date, strFormat) {

	day_date = date.getDate();
	month_date = date.getMonth();
	year_date = date.getFullYear();

	strFormat = strFormat || 'dd/mm/yyyy';

	if (strFormat == 'dd/mm/yyyy') {
		return day_date + "/" + (month_date + 1) + "/" + year_date;
	} else if (strFormat == 'dd/MMM/yyyy') {
		return day_date + "/" + m_names[month_date] + "/" + year_date;
	} else if (strFormat == 'ddMMMyyyy') {
		return day_date + m_names[month_date] + year_date;
	} else {
		return "format not supported: " + date;
	}
}

/**
 * Update the localized values
 * @param currValue
 */
function localUpdate(elem, currValue) {
	currencyText = currValue;
	currency = currValue.substring(0, 1);
	// update the dropdown text
	var wrap = $(elem);
	// hide the div dropdown on click
	// update the selected value to the first anchor
	wrap.parent().parent().hide().prev().html(currValue);

	$(".money").each(function() {
		that = $(this);
		that.replaceWith(mformat($.fformat.number(that.html().substring(1)), currency));
	});

	// NIN label update
	ninoLabel = wrap.data('nino-label');
	ninoInitial = wrap.data('nino');
	$(".nino-label").each(function() {
		$(this).html(ninoLabel);
	});
	$(".nino-initial").each(function() {
		$(this).html(ninoInitial);
	});
}

function escapeHtml(content) {
	if (typeof content == 'string') {
		return content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}
	return content;
}
