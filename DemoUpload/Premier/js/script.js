var definitionDialog; /*Dialog of List Definition*/
var managerDialog; /*Dialog of File Manager*/
var managerDirectoryDialog; /*Dialog of Add Scheduled Import*/
/*add definition*/
function adddisable() {
	$('#btnadd_definition').addClass('disabled');
}

function addenable() {
	$('#btnadd_definition').removeClass('disabled');
}

/*copy definition*/
function copydisable() {
	$('#btncopy_definition').addClass('disabled');	
}

function copyenable() {
	$('#btncopy_definition').removeClass('disabled');	
}

/*edit definition*/
function editdisable() {
	$('#btnedit_definition').addClass('disabled');	
}

function editenable() {
	$('#btnedit_definition').removeClass('disabled');	
}

/*view definition*/
function viewdisable() {
	$('#btnview_definition').addClass('disabled');	
}

function viewenable() {
	$('#btnview_definition').removeClass('disabled');	
}

/*move file manager*/
function movedisable_manage() {
	$('#btnmove_manager').addClass('disabled');	
}

function moveenable_manage() {
	$('#btnmove_manager').removeClass('disabled');	
}

/*copy file manager*/
function copydisable_manage() {
	$('#btncopy_manager').addClass('disabled');	
}

function copyenable_manage() {
	$('#btncopy_manager').removeClass('disabled');	
}

/*view file manager*/
function viewdisable_manage() {
	$('#btnview_manager').addClass('disabled');	
}

function viewenable_manage() {
	$('#btnview_manager').removeClass('disabled');	
}

/*edit file manager*/
function editdisable_manage() {
	$('#btnedit_manager').addClass('disabled');	
}

function editenable_manage() {
	$('#btnedit_manager').removeClass('disabled');	
}

/*rename file manager*/
function renamedisable_manage() {
	$('#btnrename_manager').addClass('disabled');	
}

function renameenable_manage() {
	$('#btnrename_manager').removeClass('disabled');	
}

/*add dir file manager*/
function adddirdisable_manage() {
	$('#btnadddir_manager').addClass('disabled');	
}

function adddirenable_manage() {
	$('#btnadddir_manager').removeClass('disabled');	
}

/*delete dir file manager*/
function deldirdisable_manage() {
	$('#btndeldir_manager').addClass('disabled');	
}

function deldirenable_manage() {
	$('#btndeldir_manager').removeClass('disabled');	
}

/*add scheduled import*/
function adddisable_scheduled() {
	$('#btnadd_import').addClass('disabled');	
}

function addenable_scheduled() {
	$('#btnadd_import').removeClass('disabled');	
}

/*edit scheduled import*/
function editdisable_scheduled() {
	$('#btnedit_import').addClass('disabled');	
}

function editenable_scheduled() {
	$('#btnedit_import').removeClass('disabled');	
}

/*add scheduled export*/
function adddisable_export() {
	$('#btnadd_export').addClass('disabled');	
}

function addenable_export() {
	$('#btnadd_export').removeClass('disabled');	
}

/*edit scheduled export*/
function editdisable_export() {
	$('#btnedit_export').addClass('disabled');	
}

function editenable_export() {
	$('#btnedit_export').removeClass('disabled');	
}

/*view lists*/
function viewdisable_lists() {
	$('#btnview_lists').addClass('disabled');	
}

function viewenable_lists() {
	$('#btnview_lists').removeClass('disabled');	
}

/*add exclusion*/
function adddisable_exclusion() {
	$('#btnadd_exclusions').addClass('disabled');	
}

function addenable_exclusion() {
	$('#btnadd_exclusions').removeClass('disabled');	
}

/*edit exclusion*/
function editdisable_exclusion() {
	$('#btnedit_exclusions').addClass('disabled');	
}

function editenable_exclusion() {
	$('#btnedit_exclusions').removeClass('disabled');	
}

/*import exclusion*/
function importdisable_exclusion() {
	$('#btnimport_exclusions').addClass('disabled');	
}

function importenable_exclusion() {
	$('#btnimport_exclusions').removeClass('disabled');	
}

/*export exclusion*/
function exportdisable_exclusion() {
	$('#btnexport_exclusions').addClass('disabled');	
}

function exportenable_exclusion() {
	$('#btnexport_exclusions').removeClass('disabled');	
}

/*add timezone*/
function adddisable_timezone() {
	$('#btnadd_timezone').addClass('disabled');	
}

function addenable_timezone() {
	$('#btnadd_timezone').removeClass('disabled');	
}

/*edit timezone*/
function editdisable_timezone() {
	$('#btnedit_timezone').addClass('disabled');	
}

function editenable_timezone() {
	$('#btnedit_timezone').removeClass('disabled');	
}

$(document).ready(function() {
	$('#tab-container').easytabs({
		animate: false	
	});

	/***List Definition***/
	definitionDialog = $( "#content" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*Add Dialog*/
	$('#btnadd_definition').click(function(e) {
		adddisable();
		$('#content').load('list_definition_content_general.html', function() {
			definitionDialog.dialog( "option", "width", 990 );
			definitionDialog.dialog("open");
			definitionDialog.dialog("option", "title", "ADD - LIST DEFINITION");
		});
	});
	
	definitionDialog.on( "dialogclose", function( event, ui ) {
		addenable();
	});
	/*****/
	
	/*Copy Dialog*/	
	$('#btncopy_definition').click(function(e) {
		copydisable();
		$('#content').load('list_definition_content_general.html', function(){
			definitionDialog.dialog( "option", "width", 990 );
			definitionDialog.dialog("open");
			definitionDialog.dialog("option", "title", "COPY - LIST DEFINITION");
		});
	});
	
	definitionDialog.on( "dialogclose", function( event, ui ) {
		copyenable();
	});
	/*****/
	
	/*Edit Dialog*/
	$('#btnedit_definition').click(function(e) {
		editdisable();
		$('#content').load('list_definition_content_general.html', function(){
			definitionDialog.dialog( "option", "width", 990 );
			definitionDialog.dialog("open");
			definitionDialog.dialog("option", "title", "EDIT - LIST DEFINITION");
		});
	});
	
	definitionDialog.on( "dialogclose", function( event, ui ) {
		editenable();
	});
	/*****/
	
	/*View Dialog*/
	$('#btnview_definition').click(function(e) {
		viewdisable();
		$('#content').load('list_definition_content_view.html', function(){
			definitionDialog.dialog( "option", "width", 990 );
			definitionDialog.dialog("open");
			definitionDialog.dialog("option", "title", "VIEW - LIST DEFINITION");
		});
	});
	
	definitionDialog.on( "dialogclose", function( event, ui ) {
		viewenable();
	});
	/*****/
	
	/***File Manager***/
	managerMoveDialog = $( "#content_move_manager" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*Move Dialog*/
	$('#btnmove_manager').click(function(e) {
		movedisable_manage();
		$('#content_move_manager').load('/html/file_manager_content_move.html', function(){
			managerMoveDialog.dialog( "option", "width", 500 );
			managerMoveDialog.dialog("open");
			managerMoveDialog.dialog("option", "title", "MOVE - FILE");
		});
	});
	
	managerMoveDialog.on( "dialogclose", function( event, ui ) {
		moveenable_manage();
	});
	/*****/
	
	managerCopyDialog = $( "#content_copy_manager" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*Copy Dialog*/
	$('#btncopy_manager').click(function(e) {
		copydisable_manage();
		$('#content_copy_manager').load('file_manager_content_copy.html', function(){
			managerCopyDialog.dialog( "option", "width", 450 );
			managerCopyDialog.dialog("open");
			managerCopyDialog.dialog("option", "title", "COPY - FILE");
		});
	});
	
	managerCopyDialog.on( "dialogclose", function( event, ui ) {
		copyenable_manage();
	});
	
	/*Rename Dialog*/
	$('#btnrename_manager').click(function(e) {
		renamedisable_manage();
		$('#content_copy_manager').load('file_manager_content_rename.html', function(){
			managerCopyDialog.dialog( "option", "width", 450 );
			managerCopyDialog.dialog("open");
			managerCopyDialog.dialog("option", "title", "RENAME");
		});
	});
	
	managerCopyDialog.on( "dialogclose", function( event, ui ) {
		renameenable_manage();
	});
	/*****/
	
	managerViewDialog = $( "#content_view_manager" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*View Dialog*/
	$('#btnview_manager').click(function(e) {
		viewdisable_manage();
		$('#content_view_manager').load('file_manager_content_view.html', function(){
			managerViewDialog.dialog( "option", "width", 500 );
			managerViewDialog.dialog("open");
			managerViewDialog.dialog("option", "title", "VIEW");
		});
	});
	
	managerViewDialog.on( "dialogclose", function( event, ui ) {
		viewenable_manage();
	});
	/*****/
	
	managerEditDialog = $( "#content_edit_manager" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*Edit Dialog*/
	$('#btnedit_manager').click(function(e) {
		editdisable_manage();
		$('#content_edit_manager').load('file_manager_content_edit.html', function(){
			managerEditDialog.dialog( "option", "width", 500 );
			managerEditDialog.dialog("open");
			managerEditDialog.dialog("option", "title", "EDIT");
		});
	});
	
	managerEditDialog.on( "dialogclose", function( event, ui ) {
		editenable_manage();
	});
	/*****/
	
	managerDirectoryDialog = $( "#content_directory_manager" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*Add Dir Dialog*/
	$('#btnadddir_manager').click(function(e) {
		adddirdisable_manage();
		$('#content_directory_manager').load('file_manager_content_add_directory.html', function(){
			managerDirectoryDialog.dialog( "option", "width", 450 );
			managerDirectoryDialog.dialog("open");
			managerDirectoryDialog.dialog("option", "title", "ADD - DIRECTORY");
		});
	});
	
	managerDirectoryDialog.on( "dialogclose", function( event, ui ) {
		adddirenable_manage();
	});
	
	/*Delete Dir Dialog*/
	$('#btndeldir_manager').click(function(e) {
		deldirdisable_manage();
		$('#content_directory_manager').load('file_manager_content_delete_directory.html', function(){
			managerDirectoryDialog.dialog( "option", "width", 450 );
			managerDirectoryDialog.dialog("open");
			managerDirectoryDialog.dialog("option", "title", "DELETE - DIRECTORY");
		});
	});
	
	managerDirectoryDialog.on( "dialogclose", function( event, ui ) {
		deldirenable_manage();
	});
	/*****/
	
	/*Check all*/
	$("#checkall").click(function(){
      var checked_status = this.checked;
      $("input[name='cb1']").each(function(){
        this.checked = checked_status;
      });
    });
	
	/*IMPORT*/
	/*Progress bar*/
		$('#progress_bar').progressbar({
			value: 73	
		});
		
		$('#progress_bar_1').progressbar({
			value: 70	
		});
		
		$('#progress_bar_2').progressbar({
			value: 73	
		});
		
		$('#progress_bar_3').progressbar({
			value: 70	
		});

	/**/
	
	/*Add Scheduled Import*/
	importDialog = $( "#content_add_shedule" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	$('#btnadd_import').click(function(e) {
		adddisable_scheduled();
		$('#content_add_shedule').load('import_content_schedule.html', function(){
			importDialog.dialog( "option", "width", 410 );
			importDialog.dialog("open");
			importDialog.dialog("option", "title", "ADD - SCHEDULED IMPORT");
		});
	});
	
	importDialog.on( "dialogclose", function( event, ui ) {
		addenable_scheduled();
	});
	/**/
	
	/*Edit Scheduled Import*/
	$('#btnedit_import').click(function(e) {
		editdisable_scheduled();
		$('#content_add_shedule').load('import_content_schedule.html', function(){
			importDialog.dialog( "option", "width", 410 );
			importDialog.dialog("open");
			importDialog.dialog("option", "title", "EDIT - SCHEDULED IMPORT");
		});
	});
	
	importDialog.on( "dialogclose", function( event, ui ) {
		editenable_scheduled();
	});
	/*****/
	
	/*EXPORT*/
	/*ADD*/
	exportDialog = $( "#content_export" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	$('#btnadd_export').click(function(e) {
		adddisable_export();
		$('#content_export').load('export_content_schedule.html', function(){
			exportDialog.dialog( "option", "width", 410 );
			exportDialog.dialog("open");
			exportDialog.dialog("option", "title", "ADD - SCHEDULED EXPORT");
		});
	});
	
	exportDialog.on( "dialogclose", function( event, ui ) {
		addenable_export();
	});
	/**/
	
	/*EDIT*/
	$('#btnedit_export').click(function(e) {
		editdisable_export();
		$('#content_export').load('export_content_schedule.html', function(){
			exportDialog.dialog( "option", "width", 410 );
			exportDialog.dialog("open");
			exportDialog.dialog("option", "title", "EDIT - SCHEDULED EXPORT");
		});
	});
	
	exportDialog.on( "dialogclose", function( event, ui ) {
		editenable_export();
	});
	/**/
	/*****/
	
	/*LISTS*/
	/*VIEW*/
	viewListDialog = $( "#content_view_lists" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	$('#btnview_lists').click(function(e) {
		viewdisable_lists();
		$('#content_view_lists').load('lists_content_view.html', function(){
			viewListDialog.dialog( "option", "width", 990 );
			viewListDialog.dialog("open");
			viewListDialog.dialog("option", "title", "VIEW - LISTS");
		});
	});
	
	viewListDialog.on( "dialogclose", function( event, ui ) {
		viewenable_lists();
	});
	/**/
	/*****/
	
	/*EXCLUSIONS*/
	/*ADD*/
	exclusionsDialog = $( "#content_exclusions" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	$('#btnadd_exclusions').click(function(e) {
		adddisable_exclusion();
		$('#content_exclusions').load('exclusion_content.html', function(){
			exclusionsDialog.dialog( "option", "width", 460);
			exclusionsDialog.dialog("open");
			exclusionsDialog.dialog("option", "title", "ADD - EXCLUSION");
			$("#calendar_1").datepicker({ /*Calendar*/
				showOn: "button",
				buttonImage: "images/calendar.png",
				buttonImageOnly: true,
				buttonText: "Calendar",
				dateFormat: "dd/mm/yy"
			});
			
			$("#calendar_2").datepicker({
				showOn: "button",
				buttonImage: "images/calendar.png",
				buttonImageOnly: true,
				buttonText: "Calendar",
				dateFormat: "dd/mm/yy"	
			});
		});
	});
	
	exclusionsDialog.on( "dialogclose", function( event, ui ) {
		addenable_exclusion();
	});
	/**/
	
	/*EDIT*/
	$('#btnedit_exclusions').click(function(e) {
		editdisable_exclusion();
		$('#content_exclusions').load('exclusion_content.html', function(){
			exclusionsDialog.dialog( "option", "width", 460);
			exclusionsDialog.dialog("open");
			exclusionsDialog.dialog("option", "title", "EDIT - EXCLUSION");
			$("#calendar_1").datepicker({ /*Calendar*/
				showOn: "button",
				buttonImage: "images/calendar.png",
				buttonImageOnly: true,
				buttonText: "Calendar",
				dateFormat: "dd/mm/yy"	
			});
			
			$("#calendar_2").datepicker({
				showOn: "button",
				buttonImage: "images/calendar.png",
				buttonImageOnly: true,
				buttonText: "Calendar",
				dateFormat: "dd/mm/yy"
			});
		});
	});
	
	exclusionsDialog.on( "dialogclose", function( event, ui ) {
		editenable_exclusion();
	});
	/**/
	
	/*IMPORT*/
	importExclusionsDialog = $( "#content_exclusions_import" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	$('#btnimport_exclusions').click(function(e) {
		importdisable_exclusion();
		$('#content_exclusions_import').load('exclusion_content_import.html', function(){
			importExclusionsDialog.dialog( "option", "width", 460);
			importExclusionsDialog.dialog("open");
			importExclusionsDialog.dialog("option", "title", "EXCLUSION - IMPORT");
		});
	});
	
	importExclusionsDialog.on( "dialogclose", function( event, ui ) {
		importenable_exclusion();
	});
	/**/
	
	/*EXPORT*/
	exportExclusionsDialog = $( "#content_exclusions_export" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	$('#btnexport_exclusions').click(function(e) {
		exportdisable_exclusion();
		$('#content_exclusions_export').load('exclusion_content_export.html', function(){
			exportExclusionsDialog.dialog( "option", "width", 460);
			exportExclusionsDialog.dialog("open");
			exportExclusionsDialog.dialog("option", "title", "EXCLUSION - EXPORT");
		});
	});
	
	exportExclusionsDialog.on( "dialogclose", function( event, ui ) {
		exportenable_exclusion();
	});
	/**/
	/*****/
	
	/*TIME ZONE*/
	timezoneDialog = $( "#content_timezone" ).dialog({ 
		autoOpen: false 
		, resizable: false
		, modal: true
	});
	
	/*ADD*/
	$('#btnadd_timezone').click(function(e) {
		adddisable_timezone();
		$('#content_timezone').load('timezone_content.html', function(){
			timezoneDialog.dialog( "option", "width", 500);
			timezoneDialog.dialog("open");
			timezoneDialog.dialog("option", "title", "ADD - TIME ZONE");
		});
	});
	
	timezoneDialog.on( "dialogclose", function( event, ui ) {
		addenable_timezone();
	});
	/**/
	
	/*EDIT*/
	$('#btnedit_timezone').click(function(e) {
		editdisable_timezone();
		$('#content_timezone').load('timezone_content.html', function(){
			timezoneDialog.dialog( "option", "width", 500);
			timezoneDialog.dialog("open");
			timezoneDialog.dialog("option", "title", "EDIT - TIME ZONE");
		});
	});
	
	timezoneDialog.on( "dialogclose", function( event, ui ) {
		editenable_timezone();
	});
	/**/
	/*****/
})

function closeTab() {
	definitionDialog.dialog("close");
	managerMoveDialog.dialog("close");
	managerCopyDialog.dialog("close");
	managerViewDialog.dialog("close");
	managerEditDialog.dialog("close");
	managerDirectoryDialog.dialog("close");
	
	importDialog.dialog("close");
	exportDialog.dialog("close");
	
	viewListDialog.dialog("close");
	
	exclusionsDialog.dialog("close");
	importExclusionsDialog.dialog("close");
	exportExclusionsDialog.dialog("close");
	
	timezoneDialog.dialog("close");
	
	addenable();
	copyenable();
	editenable();
	viewenable();
	moveenable_manage();
	copyenable_manage();
	viewenable_manage();
	editenable_manage();
	renameenable_manage();
	adddirenable_manage();
	deldirenable_manage();
	addenable_scheduled();
	editenable_scheduled();
	addenable_export();
	editenable_export();
	viewenable_lists();
	addenable_exclusion();
	editenable_exclusion();
	importenable_exclusion();
	exportenable_exclusion();
	addenable_timezone();
	editenable_timezone();
}