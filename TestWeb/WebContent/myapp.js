
//$(document).ready(function() {
//		$("#qbuttonid").click(function(){
//			$Name = document.getElementById("qid").value;
//			$.post("GetName", {Name:$Name}, function(data) {
//				alert(data);
//				$("#Report").html(data);
//			});
//		});
//	});

$(document).ready(function() {
 
    //Stops the submit request
    $("#myform").submit(function(e){
           e.preventDefault();
    });
    
    //checks for the button click event
    $("#qbuttonid").click(function(e){
           
            //get the form data and then serialize that
            dataString = $("#myform").serialize();
            
            //get the form data using another method
            var countryCode = $("input#qid").val();
            dataString = "countryCode=" + countryCode;
            
            //make the AJAX request, dataType is set to json
            //meaning we are expecting JSON data in response from the server
            $.ajax({
                type: "POST",
                url: "CountryInformation",
                data: dataString,
                dataType: "json",
                
                //if received a response from the server
                success: function( data, textStatus, jqXHR) {
                    //our country code was correct so we have some information to display
                     if(data.success){
                         $("#Report").html("");
                         $("#Report").append("<b>Country Code:</b> " + data.countryInfo.code + "");
                         $("#Report").append("<b>Country Name:</b> " + data.countryInfo.name + "");
                         $("#Report").append("<b>Continent:</b> " + data.countryInfo.continent + "");
                         $("#Report").append("<b>Region:</b> " + data.countryInfo.region + "");
                         $("#Report").append("<b>Life Expectancy:</b> " + data.countryInfo.lifeExpectancy + "");
                         $("#Report").append("<b>GNP:</b> " + data.countryInfo.gnp + "");
                     }
                     //display error message
                     else {
                         $("#Report").html("<div><b>Country code in Invalid!</b></div>");
                     }
                },
                
                //If there was no resonse from the server
                error: function(jqXHR, textStatus, errorThrown){
                     console.log("Something really bad happened " + textStatus);
                      $("#Report").html(jqXHR.responseText);
                },
                
                //capture the request before it was sent to server
                beforeSend: function(jqXHR, settings){
                    //adding some Dummy data to the request
                    settings.data += "&dummyData=whatever";
                    //disable the button until we get the response
                    $('#myButton').attr("disabled", true);
                },
                
                //this is called after the response or error functions are finsihed
                //so that we can take some action
                complete: function(jqXHR, textStatus){
                    //enable the button
                    $('#myButton').attr("disabled", false);
                }
      
            });       
    });
 
});
