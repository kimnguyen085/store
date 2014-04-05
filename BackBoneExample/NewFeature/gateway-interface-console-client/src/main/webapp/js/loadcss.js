function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}

this.loadCss('css/themes/gmobile/gmobile.min.css');

//structure CSS must be placed after the theme...
this.loadCss('css/themes/gmobile/jquery.mobile.structure-1.3.0.min.css');

//and our override here
this.loadCss('css/themes/gmobile/gmobile.override.css');

//jQuery Plugins
this.loadCss('lib/jquery-plugins/jquery-ui-1.10.3.custom.autocomplete/css/no-theme/jquery-ui-1.10.3.custom.min.css'); //jQuery UI
this.loadCss('lib/jquery-plugins/jquery-tags-input/jquery.tagsinput.css');
this.loadCss('lib/jquery-plugins/jquery-jqplot/jquery.jqplot.min.css');
this.loadCss('lib/jquery-plugins/jquery-datatable/media/css/jquery.dataTables.css');
this.loadCss('lib/jquery-plugins/jquery-snippet/jquery.snippet.min.css');
this.loadCss('lib/jquery-plugins/jquery-jgrowl/jquery.jgrowl.min.css');

//jQuery Mobile Plugins
this.loadCss('lib/jquery-plugins/jqm-datebox/jqm-datebox-1.1.0.min.css');
this.loadCss('lib/jquery-plugins/jqm-datebox/jquery.mobile.simpledialog.min.css');
this.loadCss('lib/jquery-plugins/jqm-simpledialog2/jquery.mobile.simpledialog.min.css');

// shared css
this.loadCss('sharedcss/common.css');

//Main app style
this.loadCss('css/table-styling.css');
this.loadCss('css/global.css');
