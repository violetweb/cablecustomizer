"use strict";

$(document).ready(function()
	{

		
		
		 var $body = $("body").data("idn");

					

			$("#contest").on("click",function(e){

				e.preventDefault();
					$.ajax({
						type: 'GET',
						url: 'http://kioskapp.acetronic.com/contest-report.php',
						type: 'json',
						success: function(data) {
											
							$("#report").empty();
							var table = $("<table class='table table-condensed'>");
							var thead = "<thead><tr><td>Name</td><td>Title</td><td>Email</td><td>Company</td><td>Topic</td><td>Entry Date</td><td>News Signup</td></tr></thead>";
							table.append(thead);
							for (var i = 0; i < data.length; i++) {							
								var row = $("<tr>");	
								row.append("<td>" + data[i].name + "</td>");
								row.append("<td>" + data[i].title + "</td>");
								row.append("<td>" + data[i].email + "</td>");
								row.append("<td>" + data[i].company + "</td>");
								row.append("<td>" + data[i].Discussion + "</td>");
								row.append("<td>" + data[i].entrydate + "</td>");
								row.append((data[i].news == 1) ? "<td>Y</td>" : "<td>N</td>");							
								table.append(row);
									
							}							
							
							$("#report").append(table);
								
						
						}
					});
				});
	

		 if ($body === "sprays"){
			
		
			$.ajax({
				type: 'GET',
				url: 'http://kioskapp.acetronic.com/sprays.php',
				type: 'json',
				success: function(data) {
				
					var div;				
					 for (var i = 0; i < data.length; i++) {

						 var content = $.parseHTML(data[i].post_content.substring(0,200));
						
						 div = $('<a href="#" data-class="popover-purple" data-toggle="popover" data-trigger="hover" data-placement="top" data-content="' + $(content).text() + '" data-title="' + data[i].post_title + '"></a>');
						 div.append("<div class='wrapper'>");
						 div.append("<input type='checkbox' name='cc' value='" + data[i].post_name + "'/>");
						 
						 div.append("<label><span></span></label>");
						 div.append("<img src='//acetronic.com/wp-content/uploads" + data[i].thumbnail + "'/>");
						 div.append("<h5>" + data[i].post_title + "</h5>");						
						 
						 div.append("</div>");

						 $("#sprays-carousel").append(div)
						
					}
					
					
				}
			}).done(function() {


								// Popovers and tooltips
				$('[data-toggle="popover"]').each(function(i, el)
				{
					var $this = $(el),
						placement = attrDefault($this, 'placement', 'top'),
						trigger = attrDefault($this, 'trigger', 'click'),
						popover_class = $this.get(0).className.match(/(popover-[a-z0-9]+)/i);

					$this.popover({
						placement: placement,
						trigger: trigger
					});

					if(popover_class)
					{
						$this.removeClass(popover_class[1]);

						$this.on('show.bs.popover', function(ev)
						{
							setTimeout(function()
							{
								var $popover = $this.next();
								$popover.addClass(popover_class[1]);

							}, 0);
						});
					}
				});
				$('.owl-carousel').owlCarousel({
					loop:true,					
					
					autoPlay: 1000,
					responsive:{
						0:{
							items:1
						},
						600:{
							items:2
						},
						1000:{
							items:3
					}}
				});
				
			 });


			 $("body").on("submit","form#spraysform",function(event){
				
				event.preventDefault();

				var email = $("input#email").val();
				var samples = $("input[name='cc']:checked").map(function(){
					return $(this).val();
				  }).get();

				
				
				var $opts = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": false,
					"progressBar": false,
					"positionClass": "toast-top-full-width",
					"preventDuplicates": false,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "5000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut",
					"onHidden": function(){
						window.open($('a#home-link').attr('href'), '_self');
						
	
					}
				  };
				 
				if (email!="" && samples!=""){
					
					$.ajax({
				    	type: 'POST',
				    	url: 'http://kioskapp.acetronic.com/sprays-request-sample.php',
				    	data: {
							'email': email,
							'samples': samples.toString()
						}, 						
				    	success: function(data) {
							
				    		if (data.success == "true"){								
								toastr.success("You have successfully registered to receive FREE SAMPLES*.  We will send you an email to complete your order :)", "FREE Samples Registration!", $opts);
								
												
				    		}else{
								$("input[type=text], textarea").val("");								
								toastr.error("An entry with your email address has already been used. :)", "Already registered!", $opts);
				    			
				    		
				    		}
				        	
				    	}
					}).fail(function(xhr, err) { 
						var responseTitle= $(xhr.responseText).filter('title').get(0);
						console.log(responseTitle);
						console.log(err); 
					});
				}
			 });


		 }

			
			$("body").on("submit","form#newsform",function(event){
					
				event.preventDefault();
				var email = $("input#email").val();
			

				var $opts = {
					"closeButton": true,
					"debug": false,
					"newestOnTop": false,
					"progressBar": false,
					"positionClass": "toast-top-full-width",
					"preventDuplicates": false,
					"onclick": null,
					"showDuration": "300",
					"hideDuration": "1000",
					"timeOut": "5000",
					"extendedTimeOut": "1000",
					"showEasing": "swing",
					"hideEasing": "linear",
					"showMethod": "fadeIn",
					"hideMethod": "fadeOut",
					"onHidden": function(){
						window.open($('a#home-link').attr('href'), '_self');
						
	
					}
				  };
				if (email!=""){
					$.ajax({
				    	type: 'POST',
				    	url: 'http://kioskapp.acetronic.com/constant-contact.php',
				    	data: {
							'email': email								    		
				    	}, 
				    	success: function(data) {

				    		if (data.success == "true"){								
							//	toastr.success("You have successfully registered to receive 20% off on your first purchase with Acetronic*.  Please see website for details. :)", "Successful Registration!", $opts);
								

												
				    		}else{
								$("input[type=text], textarea").val("");								
								toastr.error("An entry with your email address and company name have already registered. :)", "Already registered!", $opts);
				    			
				    		
				    		}
				        	
				    	}
					});

				}

			});
		
	
	
		/** CALLED ON THE CONTEST PAGE, CHECKS INPUTS, AND SENDS DATA TO COLLECTION IN DB. */
		$("body").on("submit","#contestform", function(event) {

      			/* stop form from submitting normally */
      			event.preventDefault();
	
				
      			var email = $("input#email").val();
      			var name = $("input#name").val();      			  
                var title = $('input#title').val();
                var company = $("input#company").val();
				var phone = $("input#phone").val();  
				var discussion = $("#discussion").val();
				var news = ($("#newsletter").prop('checked')== true) ? 1 : 0;
				  
			  if (news == 1 && email!=""){
							
					$.ajax({
				    	type: 'POST',
				    	url: 'http://kioskapp.acetronic.com/constant-contact.php',
				    	data: {
							'email': email								    		
				    	}, 
				    	success: function(data) {

				    		if (data.success == "true"){								
							//	toastr.success("You have successfully registered to receive 20% off on your first purchase with Acetronic*.  Please see website for details. :)", "Successful Registration!", $opts);
								

												
				    		}else{
								$("input[type=text], textarea").val("");								
								toastr.error("An entry with your email address and company name have already registered. :)", "Already registered!", $opts);
				    			
				    		
				    		}
				        	
				    	}
					});

				
			  }
			
      		   if (email!="" && name!="" && title !="" && company != "" && phone != ""){

				    var $opts = {
						"closeButton": true,
						"debug": false,
						"newestOnTop": false,
						"progressBar": false,
						"positionClass": "toast-top-full-width",
						"preventDuplicates": false,
						"onclick": null,
						"showDuration": "300",
						"hideDuration": "1000",
						"timeOut": "5000",
						"extendedTimeOut": "1000",
						"showEasing": "swing",
						"hideEasing": "linear",
						"showMethod": "fadeIn",
						"hideMethod": "fadeOut",
						"onHidden": function(){
							window.open($('a#home-link').attr('href'), '_self');
							
		
						}
					  };
      		   		$.ajax({
				    	type: 'POST',
				    	url: '//kioskapp.acetronic.com/contest-submit.php',
				    	data: {
				    		'email': email,
				    		'entryname': name,
							'title': title,
							'company': company,
							'phone':phone,
							'discussion': discussion,
							'news': news
				    	}, 
				    	success: function(data) {

				    		if (data.success == "true"){
								//$("input[type=text], textarea, input[type=email],input[type=tel]").val("");		
								toastr.success("You have successfully registered to receive 20% off on your first purchase with Acetronic*.  Please see website for details. :)", "Successful Registration!", $opts);
									
				    		}else{
								$("input[type=text], textarea").val("");								
								toastr.error("An entry with your email address is already on that list. :)", "Already subscribed!", $opts);
				    					
				    		}
				        	
				    	}
					});

      		   }else{
					toastr.error("Fill out all fields and try again. :)", "Check your fields for answers", $opts);
      		   }
      	});

				   });
				   


// Element Attribute Helper
function attrDefault($el, data_var, default_val)
{
	if(typeof $el.data(data_var) != 'undefined')
	{
		return $el.data(data_var);
	}

	return default_val;
}

  
