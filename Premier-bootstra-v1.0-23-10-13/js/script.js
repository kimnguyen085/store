// JavaScript Document
$(document).ready(function(e) {
    $('#tabs').tab();
	
	/*Checkall*/
	$("#cb_all").click(function(){
      var checked_status = this.checked;
      $("input[name='cb']").each(function(){
        this.checked = checked_status;
      });
    });
	/**/
	
	$('#start_date_add').datepicker().on('changeDate', function() {
		$('.datepicker').hide();	
	}).fadeIn("slow");
	
	
	$('#end_date_add').datepicker().on('changeDate', function() {
		$('.datepicker').hide();	
	}).fadeIn("slow");
	
	$('#start_date_edit').datepicker().on('changeDate', function() {
		$('.datepicker').hide();	
	}).fadeIn("slow");
	
	
	$('#end_date_edit').datepicker().on('changeDate', function() {
		$('.datepicker').hide();	
	}).fadeIn("slow");
	
	/*Draggable Modal Dialog*/
	
	$("#content_add_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	
	$("#content_del_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_move_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_copy_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_view_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_edit_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_rename_manager").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_add_export").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	$("#content_edit_export").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	}); 
	
	$("#content_add_import").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	}); 
	$("#content_edit_import").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_view_lists").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_add_exclusions").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_edit_exclusions").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_import_exclusions").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_export_exclusions").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_add_timezone").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_edit_timezone").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_add_definition").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body",
		containment: "body"
	}); 
	
	$("#content_copy_definition").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	});
	
	$("#content_view_definition").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	}); 
	
	$("#content_edit_definition").draggable({
		handle: ".modal-header",
		cursor: "move",
		containment: "body"
	}); 
	/**/
		
});