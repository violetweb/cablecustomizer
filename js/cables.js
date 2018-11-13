$( document ).ready(function() {       
   
  
/******************************************************    
 *   DESCRIPTION:   Default values for the Cable Imagery
 *                  including latch style, single or double, etc.
 * 
 *   USE/FUNC:      Regardless of RFQ info, the container...
 *                  specifically, the Active 
 * 
 *                  If the RFQType is Customizer, we will
 *                  show the cable and auto fill.
 * 
 *                  If the RFQType is Parts, we will show the 
 *                  PartsNo. and autofill. 
 * 
 * ************************************************** */
var RFQID = localStorage.getItem("RFQID");
var RFQType = localStorage.getItem("RFQID_Type");

var activeMainframeHood, activeMoldHood = "top";       
var activeMainframeClamp, activeMoldClamp = "single";       
var activeMainframeGender, activeMoldGender = "";


/*** GRAB FRAME SIZES ******/
var initialleft = document.getElementById("style-selector-mainframe").getBoundingClientRect().left;  
var w = $("#style-selector-mainframe").width();
var l = $("#style-selector-mainframe").offset().left;
var r = $("#style-selector-mainframe").width() + $(".container-fluid").width();


$(".navbar-nav li[data-menufor='customizer'], .navbar-nav li[data-menufor='review'], navbar-nav li[data-menufor='reviewParts']").addClass("d-none");
$(".latch-style span.tab a.top").addClass("selected"); // Default Style is TOP -- ON LOAD
$(".hood-entry span.tab a.single").addClass("selected");



/**********  DEFAULTS FOR FRAMES ******* */
$("#style-selector-mainframe div.toggle").css("left",w +'px');
$("#style-selector-mold div.toggle").css("right",w +'px');
$("#contacts-frame,#upload-frame").animate({left: '-'+w+'px',width: w+'px'},800);
if ($(window).width()<767) {
    $("#style-selector-mold").animate({ right: '-'+w+'px', width: w+'px' }, 800);             
}

/******************************************************    
 *   DESCRIPTION:   Drag & Drop : See functions : 
 *   USE/FUNC:      $('[draggable]')
 * 
 * ************************************************** */
var lastPosX = 0;
var lastPosY = 0;



/******************************************************    
 *   DESCRIPTION:   Pin Diagram Builder Defaults
 *   USE:           
 * 
 * ************************************************** */

var count = 0;
var total_pins = 0;
var twoDotRow = ''+
'<div class="row align-items-center align-self-center no-gutters">'+            
    '<div class="col col-md-3 text-center">'+
        '<span class="line_no_left">1</span>'+
    '</div>'+
    '<div class="col drag-target">'+
        '<span class="dot"><a data-target="true" href="#"></a></span>'+
    '</div>'+
    '<div class="col"></div>'+
    '<div class="col drag-target">'+
        '<span class="dot"><a data-target="true" href="#"></a></span>'+
    '</div>'+
    '<div class="col col-md-3 text-center">'+
        '<span class="line_no_right"></span>'+
    '</div>'+
'</div>';
var twoDotOutsideRow = ''+
'<div class="row align-items-center align-self-center no-gutters">'+            
    '<div class="col col-md-3 text-center">'+
        '<span class="line_no_left">1</span>'+
    '</div>'+
    '<div class="col drag-target">'+
        '<span class="dot"><a data-target="true" href="#"></a></span>'+
    '</div>'+
    '<div class="col">&nbsp;&nbsp;</div>'+
    '<div class="col drag-target">'+
        '<span class="dot"><a data-target="true" href="#"></a></span>'+
    '</div>'+
    '<div class="col col-md-3">'+
        '<span class="line_no_right"></span>'+
    '</div>'+
'</div>';

var oneDotRow = ''+
'<div class="row align-items-center align-self-center no-gutters">'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_left"></span>'+
        '</div>'+
        '<div class="col">'+
            '<span><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col">'+
            '<span><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_right"><a data-target="true" href="#"></a></span>'+
        '</div>'+
    '</div>';

var threeDotRow = ''+
'<div class="row align-items-center align-self-center no-gutters">'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_left"><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"><a data-target="true" href="#"></a></span>'+
        '</div>'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_right"><a data-target="true" href="#"></a></span>'+
        '</div>'+
    '</div>';

if (RFQID && RFQType=="customizer"){

    //Get sizes again.

    var initialleft = document.getElementById("style-selector-mainframe").getBoundingClientRect().left;  
    var w = $("#style-selector-mainframe").width();
    var l = $("#style-selector-mainframe").offset().left;
    var r = $("#style-selector-mold").offset().left;
        
    $("#style-selector-mainframe div.toggle").css("left",w +'px');
    $("#style-selector-mold div.toggle").css("right",w +'px');
    $("#contacts-frame,#upload-frame").animate({left: '-'+w+'px',width: w+'px'},800);
    
    if ($(window).width()<767) {
        $("#style-selector-mold").animate({ right: '-'+w+'px', width: w+'px' }, 800);             
    }

    $("#Parts_Container,#branch_container").addClass("d-none");
    $("#customizer").removeClass("d-none");
    $(".navbar-nav li[data-menufor='review'], .navbar-nav li[data-menufor='reviewParts']").addClass("d-none");
    $(".navbar-nav li[data-menufor='customizer']").removeClass("d-none");
    $(".cable-type span.tab a").removeClass("selected");
   
    var orderInfo =  $.ajax({
        type: 'post',
        url: 'api-cables/grabOrderInfo.php',
        dataType: "json",
        data: {                                   
            'id': RFQID

        }, 
        success: function(result) { 
            var orderinfo = result[0];         
            $.each(orderinfo,function(ind,val){
                    var idn = "#" + ind;                        
                    $(idn).val(val);    // autofills the company info
                    $(idn+"1").val(val) // autofills the company1 info                     
                    if (idn === "#Cable_Type") {                                                                    
                        $("#"+val.toLowerCase()).addClass("selected");
                        $("#cable-type").text(val.toLowerCase());
                    }else if (idn === "#Cable_Style_Type"){                      
                        $(".cable-type-expand").removeClass("d-none"); 
                        $("#cable-style-type").text(val);                     
                        $("#" + val.toUpperCase()).addClass("selected");
                    }
            });
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
        });
    
    var CableOptions =  $.ajax({
    
        type: 'post',
        url: 'api-cables/grabCableOptions.php',
        dataType: "json",
        data: {                                   
            'id': RFQID

        }, 
        success: function(result) { 
                
            $.each(result,function(ind,val){
            
                var endtype = val.End_Type;
                
                $.each(val,function(i,v){
                    
                        
                    var connectorid = result[ind].Connector_ID;


                    if (i === "No_Zones") {
                        if (v==1 ||v==2 ||v==5||v==8||v==12){
                            var selector = "div [data-connectorid='"+connectorid+"'] .zones .zone a[data-value='"+v+"']";
                            //$(selector).addClass("selected");
                            $(selector).trigger("click");
                        }else{
                            //Use the "OtherVal"
                            var selector = "div [data-connectorid='"+connectorid+"'] .zones .zonesOtherVal";
                            $(selector).val(v).addClass("selected");

                        }
                    }

                    if (i === "Gender") {
                        var selector = "div [data-connectorid='"+connectorid+"'] .cable-gender .tab a[data-value='"+v.toLowerCase()+"']";
                        //$(selector).addClass("active");
                        $(selector).trigger("click");
                    }
                    if (i === "No_Pins") {
                var selector = "div [data-connectorid='"+connectorid+"'] .set-pins .tab > a[data-value='"+v+"']";
                    //   $(selector).addClass("selected");
                        //activate the Pins! and Connections Map
                        $(selector).trigger("click");
                    }

                    if (i === "Type_Connector") { 
                        var selector = "div [data-connectorid='"+connectorid+"'] .connector-type .tab > a[data-value='"+v.toUpperCase()+"']";
                        //$(selector).addClass("selected");
                        $(selector).trigger("click");
                    }
                    if (i === "Amps") {
                        var trimv = v.substring(0,v.indexOf(" AMP"));                               
                        var selector = "div [data-connectorid='"+connectorid+"'] .amps-selection  .tab > a[data-value='"+trimv+"']";
                        $(selector).trigger("click");
                    // $(selector).addClass("selected");
                    }
                
                    //inserts
                    if (i === "Cable_Length") {
                        
                        var insert = "div [data-connectorid='"+connectorid+"'] input[name='cablelength']";    
                        var upper = "div [data-connectorid='"+connectorid+"'] td.cable-length";                                                       
                        $(upper).text(v);
                        $(insert).val(v).addClass("selected");
                    
                    }

                    if (i === "Hood_Entry") {
                        if (v=="top"){
                            if (endtype == "mainframe"){
                                $(".mainframe-topentry-button").trigger("click");                                       
                            }else{
                                $("mold-topentry-button").trigger("click");
                            }
                            $("div [data-connectorid='"+connectorid+"'] .hood-entry span a.top").addClass("selected");  
                        }else if (v=="side"){
                            if (endtype == "mainframe"){
                                $(".mainframe-sideentry-button").trigger("click");
                            }else{
                                $(".mold-sideentry-button").trigger("click");
                            }
                            $("div [data-connectorid='"+connectorid+"'] .hood-entry span a.side").addClass("selected");
                        }
                    }

                    if (i === "Clamp_Style") {
                    
                        if (v=="single"){
                            if (endtype=="mainframe"){
                                $(".mainframe-singlelatch-button").trigger("click");
                                $("div [data-connectorid='"+connectorid+"'] .latch-style span a.single").addClass("selected");
                            }else{
                                $(".mold-singlelatch-button").trigger("click");
                                $("div [data-connectorid='"+connectorid+"'] .latch-style span a.single").addClass("selected");
                            }
                        }else if (v=="double"){
                            if (endtype == "mainframe"){
                                $(".mainframe-doublelatch-button").trigger("click");
                                $("div [data-connectorid='"+connectorid+"'] .latch-style span a.double").addClass("selected");
                            }else{
                                $(".mold-doublelatch-button").trigger("click");
                                $("div [data-connectorid='"+connectorid+"'] .latch-style span a.double").addClass("selected");
                            }
                        }
                    }
                    if (i==="Connections_Map"){
                        var a = v.split(",");  
                        var count = 0;                             
                        $.each(a,function(i,v){
                            count++; 
                            var div = "div[data-cend='" + endtype + "'] .dot a[data-value='" + v + "']";  
                            
                            //Grab the existing cable type.
                            var cabletype = $(".cable-type .tab a.selected").attr("data-value");                        
                            $(div).parent().addClass("set");                                   
                            if (count == 3){
                                //insert polarity.
                                $(div).parent().prepend("<span class='polarity polarity-pos'></span>");
                            }else if (count == 4) {
                                $(div).parent().prepend("<span class='polarity polarity-neg'></span>");
                            }else{
                                $("div[data-cend='" + endtype + "'] .dot a[data-value='" + v + "']").addClass("border-rounded").css('border', "3px solid rgb(51, 51, 51)");
                            }
                               
                        });                                
                    }
                        
                });
            });

        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });        


} else if (RFQID && RFQType=="parts"){
   
    //get the html.
    $("div#recapParts").remove(); 

    var parts = $.get("parts-container.html",function(result){              
      
        $("#customizer").before(result);
        $("#Parts_Container button.backward").remove();
        //Remove the back button
        
    });   
    $("#branch_container, #customizer, .backward").addClass("d-none");
    $(".navbar-nav li[data-menufor='customizer'], .navabar-nav li[data-menufor='review']").addClass("d-none");
    //Clear any existing rows
    //$("#Parts_Container .partslist div.item div.row").remove();


    var orderInfo =  $.ajax({
        type: 'post',
        url: 'api-cables/grabOrderInfo.php',
        dataType: "json",
        data: {                                   
            'id': RFQID
        }, 
        success: function(result) { 
            var orderinfo = result[0];
           
            $.each(orderinfo,function(ind,val){
                    var idn = "#" + ind;                        
                    $(idn).val(val);      
                    
                    //IS THIS WHERE I SHOULD TURN OFF THE WIZARD???
            });
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });
   
    $.ajax({
        type: 'post',
        url: 'api-cables/grabPartNos.php',
        dataType: "json",
        data: {                                   
            'id': RFQID
        }, 
        success: function(result) { 
            
            
            $.each(result,function(ind,val){                
                  var row = '<div class="row"><div class="col-8"><input type="hidden" id="partid' + ind+ '" name="partid' +ind+'" value="'+result[ind].ID+'"/><input class="part_no form-control bg-orange" id="partno'+ind+'" name="partno" placeholder="Part No." value="'+result[ind].Part_No+'" type="text"></div><div class="col-4"><input class="part_no_qty form-control bg-orange" id="partno_qty'+ind+'" name="qty" placeholder="Quantity" value="'+result[ind].Part_Qty+'" type="text"></div></div>';
                  $(".item").prepend(row);
            });
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });

   
    
}else if (!RFQID && !RFQType){

    
    $("#Parts_Container,#customizer").addClass("d-none");
    $("#branch_container, .backward").removeClass("d-none");
    //get/set the initial widths.
 

}

//Set up a color array for use with multiple panels.... color by number!

var bgc = ['bg-primary','bg-secondary','bg-success','bg-danger','bg-info','bg-dark'];

$("a.add-mainframe").on("click",function(event){
  
    event.preventDefault();        
    var $selector = $("div.active-mainframe").clone(true);
  
    //after cloning remove any set items for the selector?
    $selector.find('.selected').removeClass('selected');
    $selector.find('.active').removeClass('active');

    //measurement needs to be # of tabs * height...  
    //RULES.... CLONES DO NOT HAVE HEIGHT OFFSETS...              
    var $cid = $(".mainframe-selector").length;              
    var $h = $('.mainframe-selector .toggle').height();
    var top = ((Number($cid))*$h);  
    
    $(".mainframe-selector").css("left",'-'+w+'px');
    $selector.removeClass("active-mainframe").addClass("inactive-mainframe");   
    $selector.css("width", w).css("left",'-'+w+'px');     
    $selector.find(".style-toggle span").html(Number($cid)+1);
    $selector.attr("data-connectorid",Number($cid+1));  
    $selector.find(".panel > .panel-heading, div.toggle .style-toggle").addClass(bgc[$cid]);
   // $selector.find(".toggle a.upload-toggle, .toggle a.saveOrder, .toggle a.add-mainframe").remove();    
    $selector.find('.toggle').css("top",top+'px');    
     //data connector #1 is reserved... there's always a #1, and a #2.
     //#1 : Mainframe connector, #2 : Mold End Connector.
    $('[data-connectorid="1"] .common').css("top",top+"px");
   

    //Move the upload/ 
    $(".mainframe-selector").find(".upload-toggle").css("top",top+"px");
    $(".mainframe-selector").find(".saveOrder").css("top",top+"px");
    $(".mainframe-selector").find(".add-mainframe").css("top",top+"px");

 
  
    $selector.appendTo("#style-selector-mainframe");
    


    /**** ADD ANOTHER CABLE CONNECTOR OF THE MAINFRAME TYPE **** */        
    var cabley = $("#cable-image div:nth-child(2)").clone(true);   
    /*** ONLY WANT TO CLONE IF THIS END. AND THIS CONNECTOR ID HASN'T ALREADY BEEN CREATED...
     *   IF ITS BEEN CREATED, THEN WE WANT TO FLAG ON THE SIDE **/                
    
    cabley.find("a.cover").attr("data-cid",$cid+1).attr("data-end","mainframe");
    cabley.attr("data-end","mainframe");
    cabley.find("#cable").addClass("d-none");
    cabley.find("#cabley").removeClass("d-none");
    cabley.appendTo("#cable-image");


    //Auto-activate the newly added frame.
    $selector.find('.style-toggle').trigger("click");
});

$("a.add-mold").on("click",function(event){

event.preventDefault();        
var $selector = $("div.active-mold").clone(true);

//after cloning remove any set items for the selector?
$selector.find('.selected').removeClass('selected');
$selector.find('.active').removeClass('active');

//measurement needs to be # of tabs * height...  
//RULES.... CLONES DO NOT HAVE HEIGHT OFFSETS...              
var $cid = $(".mold-selector").length;              
var $h = $('.mold-selector .toggle').height();
var top = ((Number($cid))*$h);                

$selector.removeClass("active-mold").addClass("inactive-mold");   
$selector.css("width", w).css("left","0");     
$selector.find(".style-toggle span").html(Number($cid)+1);
$selector.attr("data-connectorid",Number($cid)+1);  //plus 2 reserved 4 main and mold
$selector.find(".panel > .panel-heading, div.toggle .style-toggle").addClass(bgc[$cid]);
$selector.find(".toggle a.upload-toggle, .toggle a.saveOrder, .toggle a.add-mold").remove();    
$selector.find('.toggle').css("top",top+'px');    
 //data connector #1 is reserved... there's always a #1, and a #2.
 //#1 : Mainframe connector, #2 : Mold End Connector.
$('[data-connectorid="1"] .common').css("top",top+"px");


$selector.appendTo("#style-selector-mold");


/**** ADD ANOTHER CABLE CONNECTOR OF THE MAINFRAME TYPE **** */        
var cabley = $("#cable-image div:nth-child(2)").clone(true);   
/*** ONLY WANT TO CLONE IF THIS END. AND THIS CONNECTOR ID HASN'T ALREADY BEEN CREATED...
 *   IF ITS BEEN CREATED, THEN WE WANT TO FLAG ON THE SIDE **/                

cabley.find("a.cover").attr("data-cid",$cid+2).attr("data-end","mold");
cabley.attr("data-end","mold");
cabley.find("#cable").addClass("d-none");
cabley.find("#cabley").removeClass("d-none");
cabley.appendTo("#cable-image");


});


$("#branch_container button.forward").on("click",function(event){
    //Evaluate the answer... and branch off based off of this answer.
    event.preventDefault();
    var answer = $("#branch_container input[name='answer']:checked").val();
    
    if (answer){
       
        ActiveContainer = answer;
       
        $(".container").addClass("d-none");
        $("#"+answer).removeClass("d-none");        
        if ($(".navbar-nav li").attr("data-menufor") == answer){
            $(".navbar-nav li[data-menufor='"+answer+"']").removeClass("d-none");
        } 
        if (answer == "customizer"){
                        
            /********  DEFAULTS ON LOAD  
             *          - CABLE-TYPE : POWER
             *          - CABLE-GENDER: MALE
             *  
             * ***********************************/
            $(".cable-type span.tab a[data-value='power'],.cable-gender span.tab a[data-value='male']").trigger("click");
            var initialleft = document.getElementById("style-selector-mainframe").getBoundingClientRect().left;  
            var w = $("#style-selector-mainframe").width();
            var l = $("#style-selector-mainframe").offset().left;
            var r = $("#style-selector-mold").offset().left;   
            $("#style-selector-mainframe div.toggle").css("left",w +'px');
            $("#style-selector-mold div.toggle").css("right",w +'px');
            $("#contacts-frame,#upload-frame").animate({left: '-'+w+'px',width: w+'px'},800);
            if ($(window).width()<767) {
                $("#style-selector-mold").animate({ right: '-'+w+'px', width: w+'px' }, 800);             
            }      
        }else if (answer == "Parts_Container"){
            
            var parts = $.get("parts-container.html",function(result){           
                $("#customizer").before(result);
                
            });  
        }
    }else{
        toastr.error("Please make a selection to continue.");
    }
    
 });

 $("#request_call button.backward").on("click",function(event){
    event.preventDefault();
    $(".navbar-nav li[data-menufor='customizer'], .navabar-nav li[data-menufor='review'],#request_call").addClass("d-none");
    $("#branch_container").removeClass("d-none");


});
$(document).on("click",".pin-connectors .reset",function(event){
    event.preventDefault();
    $(this).parent().find('.dot').removeClass('set'); //per side reference
    $(this).parent().find('.dot a').css("border","none").removeClass("border-rounded");
    $(this).parent().find(".polarity").remove();
    $(this).parent().next().empty();
    pointa_left, pointa_top, pointb_left, pointb_top = "";
    click_count = 0; 

});

$(document).on("click","#recapParts button.backward",function(event){
    event.preventDefault();
    $("div#recapParts, div#Parts_Container").remove();
    //Now - readd the items...
    var parts = $.get("parts-container.html",function(result){           
        $("#customizer").before(result);
        $("#Parts_Container button.backward").remove();
        
    });   
    $("#branch_container, #customizer, .backward").addClass("d-none");
    $(".navbar-nav li[data-menufor='customizer'], .navbar-nav li[data-menufor='review'], .navbar-nav li[data-menufor='reviewParts']").addClass("d-none");
    //Clear any existing rows
    //$("#Parts_Container .partslist div.item div.row").remove();


    var orderInfo =  $.ajax({
        type: 'post',
        url: 'api-cables/grabOrderInfo.php',
        dataType: "json",
        data: {                                   
            'id': RFQID
        }, 
        success: function(result) { 
            var orderinfo = result[0];
           
            $.each(orderinfo,function(ind,val){
                    var idn = "#" + ind;                        
                    $(idn).val(val);      
                    
                    //IS THIS WHERE I SHOULD TURN OFF THE WIZARD???
            });
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });
   
    $.ajax({
        type: 'post',
        url: 'api-cables/grabPartNos.php',
        dataType: "json",
        data: {                                   
            'id': RFQID
        }, 
        success: function(result) { 
            
            
            $.each(result,function(ind,val){                
                  var row = '<div class="row"><div class="col-8"><input type="hidden" id="partid' + ind+ '" name="partid' +ind+'" value="'+result[ind].ID+'"/><input class="part_no form-control bg-orange" id="partno'+ind+'" name="partno" placeholder="Part No." value="'+result[ind].Part_No+'" type="text"></div><div class="col-4"><input class="part_no_qty form-control bg-orange" id="partno_qty'+ind+'" name="qty" placeholder="Quantity" value="'+result[ind].Part_Qty+'" type="text"></div></div>';
                  $(".item").prepend(row);
            });
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });

    $(".navbar-nav li[data-menufor='customizer'], .navabar-nav li[data-menufor='reviewParts'],#recapParts").addClass("d-none");
    


});

$("#cable-image button.backward").on("click",function(event){
    event.preventDefault();
    $(".navbar-nav li[data-menufor='customizer'], .navbar-nav li[data-menufor='review'], .navbar-nav li[data-menufor='reviewParts'], #customizer").addClass("d-none");
    $("#branch_container").removeClass("d-none");

});

/**** THINK ABOUT HOW TO "REDO THIS..." */
$(document).on("click","#Parts_Container button.backward",function(event){
   
   event.preventDefault();
    
   $("#Parts_Container").remove();
   $(".navbar-nav li[data-menufor='customizer'], .navabar-nav li[data-menufor='review'],#Parts_Container").addClass("d-none");
   $("#branch_container").removeClass("d-none");
  


});
$("#request_call button.submit").on("click",function(event){
    event.preventDefault();
    var $company,$contact,$email,$phone,$ext,$notes;
    $company = $("#Company").val();
    $contact = $("#Contact").val();
    $email = $("#Email").val();
    $phone = $("#Phone").val();
    $ext = $("#Ext").val();
    $notes = $("#Notes").val();

    if ($company!=null && $contact!=null && $email!=null && $phone != null){
        
        $.ajax({
            type: 'post',
            url: 'api-cables/saveOrderInfo.php',
            dataType: "json",                
            data: {
                'company': $company,
                'contact': $contact,
                'phone': $phone,
                'ext': $ext,
                'email': $email,
                'id': $id,
                'notes': $notes,               
                'rfqtype': 'call'
            }, 
            success: function(result) { 
                toastr.success("Your request has been received. A sales person will contact you within the next 24 hours.");     
            },error: function (xhr, ajaxOptions, thrownError) {

                
                    console.log(xhr.status);
                    console.log(thrownError);
            }       
        });
    }
});


$(document).on("click","#Parts_Container button.submit", function(event){
    
    event.preventDefault();
    $(".navbar-nav li[data-menufor='customizer'], .navabar-nav li[data-menufor='review']").addClass("d-none");
    $(".navbar-nav li[data-menufor='reviewParts']").removeClass("d-none");

    var id = (RFQID!="") ? RFQID : '';
    
    var company,contact,email,phone,ext,notes;
    company = $("#Parts_Container").find("#Company").val() != '' ? $("#Parts_Container").find("#Company").val() : '';
    contact = $("#Parts_Container").find("#Contact").val() != '' ? $("#Parts_Container").find("#Contact").val() : '';
    email = $("#Parts_Container").find("#Email").val() != '' ? $("#Parts_Container").find("#Email").val() : '';
    phone = $("#Parts_Container").find("#Phone").val() != '' ? $("#Parts_Container").find("#Phone").val() : '';
    ext = $("#Parts_Container").find("#ext").val() != '' ? $("#Parts_Container").find("#ext").val() : '';
    notes = $("#Parts_Container").find("#info").val() != '' ? $("#Parts_Container").find("#info").val() : '';
    $("#contactformA").validate();
    if ($("#contactFormA").valid() && $("#Parts_Container").find(".part_no").length > 0) {

    var deferred = $.ajax({
        type: 'post',
        url: 'api-cables/saveOrderInfo.php',
        dataType: "json",
        data: {    
            'company': company,           
            'contact': contact,
            'email': email,
            'phone': phone,
            'ext': ext,
            'notes': notes,
            'rfqtype': 'parts',
            'id': id
        }, 
        success: function(result) { 
            RFQID = result.orderid;
            $(".ID").text(RFQID);
            localStorage.setItem("RFQID",RFQID); // Save the ID to the user's local storage... only clear out when the "submit!"                                
            localStorage.setItem("RFQID_Type","parts");
            return result;
            
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });
         
   
    
   
    var deferred2 = deferred.then(function(result){            
          RFQID = result.orderid;          

          var len = $("#Parts_Container").find(".part_no").length;        

          for (var i=0; i<len; i++){
                
               //Find out if the partid exists... and do something different if it does.
                var id = $("#Part_No").find("#partid"+i).val()!= null ? $("#Part_No").find("#partid"+i).val() : '';
                var partno = $("#Part_No").find("#partno"+i).val();
                var partno_qty = $("#Part_No").find("#partno_qty"+i).val();
            
                var result = $.ajax({
                    type: 'post',
                    url: 'api-cables/savePartNos.php',
                    dataType: "json",
                    data: {    
                        'qty': partno_qty,           
                        'partno': partno,
                        'orderid': RFQID,
                        'id' : id
                    }, 
                    success: function(result) {                 
                        console.log("Data has been saved " + result);
                        
                    },error: function (xhr, ajaxOptions, thrownError) {
                        
                            console.log(xhr.status);
                            console.log(thrownError);
                    }  
                });
            }
        })
        
        deferred2.then(function(result){            
           
         
            $("#Parts_Container").remove();

           var recap = $.get("recapParts.html",function(result){
                $("#customizer").before(result);       
           });
           recap.then(function(result){

                 if (RFQID!="" && RFQID>0) {                
                                        
                        var result = $.ajax({
                            type: 'post',
                            url: 'api-cables/grabPartNos.php',
                            dataType: "json",                
                            data: {       
                                'id': RFQID
                            }, 
                            success: function(data) { 
                                    //Traverse through this and fill it up; get rid of all these panels.
                                    $(".navbar-nav").removeClass("d-none");                                                                     
                                    $(".navbar-length, .navbar-qty, .navbar-contact .contact-toggle,.navbar-contact .saveOrder").css({visibility: "hidden"});
                                    $("#recap-table tbody").empty();
                    
                                    $.each(data,function(ind, val){
                                        var tr = $("<tr>");
                                        
                                            $.each(val,function(i,v)   {
                                                
                                                //style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="http://cables.acetronic.com" target="_blank" style="display: inline-block; color: #ffffff; background-color: #d57717; border: solid 1px #d57717; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #d57717;">
                                                var td = (v!='') ? td = "<td style='font-family: sans-serif; font-size:14px; vertical-align:middle;'>" : "<td style='font-family: sans-serif; font-size:14px; vertical-align:middle;' class='alert alert-danger'>";                   
                                                $(tr).append(td + v.toUpperCase() + "</td>");
                
                                            });
                                        $("#recap-table").append(tr);
                                    });
                                
                                
                            },error: function (xhr, ajaxOptions, thrownError) {
                                    console.log(xhr.status);
                                    console.log(thrownError);
                            }       
                        });

                    if (result) {
                            result.then = $.ajax({
                                type: 'post',
                                url: 'api-cables/grabOrderInfo.php',
                                dataType: "json",                
                                data: {
                                    'id': RFQID                    
                                }, 
                                success: function(result) { 
                                    $("#ID").val(RFQID);
                                    $.each(result,function(ind, val){
                                        $.each(val,function(i,v){
                                            
                                            $("."+i).html(v.toUpperCase());
                                        });
                                    });
                            
                                    
                                },error: function (xhr, ajaxOptions, thrownError) {
                    
                                    
                                        console.log(xhr.status);
                                        console.log(thrownError);
                                }       
                            });
                        }else{
                            toastr.options = {
                                "closeButton": true,
                                "debug": false,
                                "newestOnTop": false,
                                "progressBar": false,
                                "positionClass": "toast-top-full-width",
                                "preventDuplicates": true,
                                "onclick": null,
                                "showDuration": "800",        
                                "timeOut": "800",
                                "fadeOut": "800",
                                "extendedTimeOut": "30",
                                "showEasing": "swing",
                                "hideEasing": "linear",
                                "showMethod": "fadeIn",
                                "hideMethod": "fadeOut"
                            }
                            toastr.error("Please fill out all fields and save your RFQ to continue.");
                        } //end of result if statement
                    } // end of result orderid if statement
            }); // end of "done"
            
       }); // end of done outer
    
    }else{
        toastr.error("Please fill out all required fields and provide parts nos. to continue.");
    }
});



/******************************************************    
 *   DESCRIPTION:   Local Storage RFQ 
 *                  If the local Storage RFQ ID exists
 *                  Grab the appropriate order info,
 *                  And then the appropriate saved parts 
 *                  OR customizer options and display the
 *                  defaults.  Bypass the "Wizard"!!!!
 * 
 *   USE:           
 * 
 * ************************************************** */




/***    DESCRIPTION:        TOASTR ALERTS
 *      USE:                DEFAULT OPTIONS 
 *                          / SETTINGS / GLOBAL
 *************************************************/
    toastr.options = {
    "debug": false,
    "positionClass": "toast-top-full-width",
    "onclick": null,
    "fadeIn": 300,
    "fadeOut": 1000,
    "timeOut": 1300,
    "preventDuplicates": true
    
    }




      var closestPin = function(ev){
            //Find the closest pin to snap to.
            var l =  event.offset().left;
            var t = event.offset().top;
            
           
      };

      var elementAt = function(left,top){
           console.log(left + " : " + top);
           return $(document.body)
                       .find("span.dot")
                       .filter(function() {
                          return $(this).offset().top == top 
                             && $(this).offset().left == left;
                    });
        
      }
     
      var findClosest = function(array,elem){      
            var minDelta = null;
            var minIndex = null;
            for (var i = 0 ; i<array.length; i++){
                var obj = array[i];
                deltaX = Math.abs(obj.top-elem);
               // deltaY = Math.abs(obj.left-elem);
               
                //var delta = Math.abs(array[i]-elem);
                if (minDelta == null || deltaX < minDelta){
                    minDelta = deltaX;
                    minIndex = i;
                }
                //if it is a tie return an array of both values
                else if (deltaX == minDelta) {
                    return [array[minIndex],array[i].top];
                }//if it has already found the closest value
                else {
                    return array[i-1];
                }
        
            }
           
           return array[minIndex];
           
        }
        
      
        
      var lastPosX = 0;
      var lastPosY = 0;

     $('[draggable]').hammer({domEvents:true, direction: Hammer.DIRECTION_ALL, touchAction : 'pan-x' }).bind("swipeup swipedown panstart panleft panright panup pandown panend",function(event){   
        
        
        var target = event.target; 
        
        

        if (event.type == "panleft" || event.type == "panright" || event.type == "panup" || event.type == "pandown"){
            
            $(target).css({
                //'transform': 'translate(' + event.gesture.deltaX + 'px,' + event.gesture.deltaY + 'px)'
                'left': event.gesture.deltaX + lastPosX +'px', 'top': event.gesture.deltaY + lastPosY + 'px'
            });
          
       
        }else if (event.type == "panend"){
           
            var dropEl = document.elementFromPoint(event.gesture.center.x, event.gesture.center.y); // javascript method to get an element at a particular point in the window.                        
            var classname = dropEl.className;   

                        
            //When the "end happens", set the start of the 
            lastPosX = event.gesture.deltaX;
            lastPosY = event.gesture.deltaY;

          
            var elemsLeft = [];
            var i = 0;

        }else if (event.type == "panstart"){
            
             lastPosX = target.offsetLeft;
             lastPosY = target.offsetTop;      
                      
        }else if (event.type == "swipeup" || event.type == "swipedown"){
            event.preventDefault();
            
        }
     });

        $(document.body).on('mouseup', '[draggable]', function(event){
        
       // console.log('mouseup', event);
        event.preventDefault();
      });

    

 
      



       $(".mainframe-sideentry-hood, .mold-sideentry-hood, .mainframe-sideentry-singlelatch, .mold-sideentry-singlelatch, .mainframe-topentry-button, .mainframe-sideentry-doublelatch, .mold-sideentry-doublelatch, .mainframe-topentry-doublelatch, .mold-topentry-doublelatch, .mainframeStyle5Pin").hide();
      
       //default is single.??
     
       
      $(".mainframe-singlelatch-button, .mainframe-doublelatch-button").click(function(event){
            event.preventDefault();
            var idn = $(this).data("idn");   
            
            //double        
            if (idn == "single"){
                //do this
                if (activeMainframeHood=="top"){
                    $(".mainframe-topentry-singlelatch").show();
                    $(".mainframe-topentry-doublelatch").hide();

                }else if (activeMainframeHood="side") {
                    $(".mainframe-sideentry-singlelatch").show();
                    $(".mainframe-sideentry-doublelatch").hide();
                }

                $(".mainframe-singlelatch-button").hide();
                $(".mainframe-doublelatch-button").show();
            
                activeMainframeClamp = "single";

            }else if (idn == "double"){
                //do that
                //do this
                if (activeMainframeHood=="top"){
                    $(".mainframe-topentry-doublelatch").show();
                    $(".mainframe-topentry-singlelatch").hide();
                }else if (activeMainframeHood == "side") {
                    $(".mainframe-sideentry-doublelatch").show();
                    $(".mainframe-sideentry-singlelatch").hide();
                }
                $(".mainframe-doublelatch-button").hide();
                $(".mainframe-singlelatch-button").show();
              
            
                activeMainframeClamp = "double";
            }
           
            $(".active-mainframe .clamp_style").html(activeMainframeClamp);
      });
  

        $(".mold-singlelatch-button, .mold-doublelatch-button").click(function(event){
            event.preventDefault();
            var idn = $(this).data("idn");   
            
            //double        
            if (idn == "single"){
                //do this
                if (activeMoldHood=="top"){

                    $(".mold-topentry-singlelatch").show();
                    $(".mold-topentry-doublelatch").hide();

                }else if (activeMoldHood="side") {
                    
                    $(".mold-sideentry-singlelatch").show();
                    $(".mold-sideentry-doublelatch").hide();
                }

                $(".mold-singlelatch-button").hide();
                $(".mold-doublelatch-button").show();
            
            activeMoldClamp = "single";

            }else if (idn == "double"){
                //do that
                //do this
                if (activeMoldHood=="top"){
                    $(".mold-topentry-doublelatch").show();
                    $(".mold-topentry-singlelatch").hide();
                }else if (activeMoldHood == "side") {
                    $(".mold-sideentry-doublelatch").show();
                    $(".mold-sideentry-singlelatch").hide();
                }
                $(".mold-doublelatch-button").hide();
                $(".mold-singlelatch-button").show();
            
                activeMoldClamp = "double";
            }
           
            $(".active-mold .clamp_style").html(activeMoldClamp);
      });


      //class files :   active-mold, active-mainframe.
      //                these files are required to identify which is the "active" item so that
      //                when we fire an item from the middle side latch / top latch area... we assign to the correct
      //                active item.

      //Anytime the top and side is switched, the latches need to follow accordingly.
      $(".mainframe-topentry-button, .mainframe-sideentry-button").click(function(event){

            event.preventDefault();
            var idn = $(this).data("idn");
       
        
            if (idn == "top"){
               
                $(".mainframe-topentry-hood").show();
                $(".mainframe-sideentry-button").show();
                $(".mainframe-sideentry-hood").hide();
                $(".mainframe-topentry-button").hide();
                $(".mainframe-sideentry-singlelatch, .mainframe-sideentry-doublelatch").hide();

               if (activeMainframeClamp == "single"){
                    $(".mainframe-topentry-singlelatch").show();
                    $(".mainframe-topentry-doublelatch").hide();
                           
               }else if (activeMainframeClamp == "double"){

                    $(".mainframe-topentry-singlelatch").hide();
                    $(".mainframe-topentry-doublelatch").show();
               }               
                activeMainframeHood = "top";

            }else if (idn == "side"){

                $(".mainframe-topentry-hood").hide();
                $(".mainframe-sideentry-button").hide();
                $(".mainframe-sideentry-hood").show();
                $(".mainframe-topentry-button").show();
                $(".mainframe-topentry-singlelatch, .mainframe-topentry-doublelatch").hide();

                if (activeMainframeClamp == "single"){
                    $(".mainframe-sideentry-singlelatch").show();
                    $(".mainframe-sideentry-doublelatch").hide();
                    
                   
                } else if (activeMainframeClamp == "double"){

                     $(".mainframe-sideentry-singlelatch").hide();
                    $(".mainframe-sideentry-doublelatch").show();
                    

                }
                
               
                activeMainframeHood = "side";
               
            }
            $(".active-mainframe .hood_entry").html(activeMainframeHood);
      });

        //Anytime the top and side is switched, the latches need to follow accordingly.
        $(".mold-topentry-button, .mold-sideentry-button").click(function(event){

            event.preventDefault();
            var idn = $(this).data("idn");


            if (idn == "top"){
            
                $(".mold-topentry-hood").show();
                $(".mold-sideentry-button").show();
                $(".mold-sideentry-hood").hide();
                $(".mold-topentry-button").hide();
                $(".mold-sideentry-singlelatch, .mold-sideentry-doublelatch").hide();

            if (activeMoldClamp == "single"){
                    $(".mold-topentry-singlelatch").show();
                    $(".mold-topentry-doublelatch").hide();
                        
            }else if (activeMoldClamp == "double"){

                    $(".mold-topentry-singlelatch").hide();
                    $(".mold-topentry-doublelatch").show();
            }               
                activeMoldHood = "top";

            }else if (idn == "side"){

                $(".mold-topentry-hood").hide();
                $(".mold-sideentry-button").hide();
                $(".mold-sideentry-hood").show();
                $(".mold-topentry-button").show();
                $(".mold-topentry-singlelatch, .mold-topentry-doublelatch").hide();

                if (activeMoldClamp == "single"){
                    $(".mold-sideentry-singlelatch").show();
                    $(".mold-sideentry-doublelatch").hide();
                
                } else if (activeMoldClamp == "double"){

                    $(".mold-sideentry-singlelatch").hide();
                    $(".mold-sideentry-doublelatch").show();
                    

                }
                
            
                activeMoldHood = "side";
            }
            $(".active-mold .hood_entry").html(activeMoldHood);
        });

     
    /*** CABLE TYPE :  POWER OR THERMOCOUPLES? */

      $(".cable-type span a").on("click",function(event){
          
            event.preventDefault();

          

            $(this).parent().parent().parent().find('span a').removeClass("selected");
            
            var selectedCableType = $(this).data("value");
            var selectedGender = $("#mainframe-selector .cable-gender span a.active").attr("data-value");

            $("#cable-type").text(selectedCableType);
            $("#Cable_Type").val(selectedCableType);


            if (selectedCableType == "power" && selectedGender!="male"){
                $(".cable-type-expand").addClass("d-none");
                //alert the user that it should probably be "male"?
                //do they want to change? yes or no?
                //If NO -- its a "signal"??
                $('#modal-2').modal('show', { 
                    backdrop: true,
                    focus: true
                    
                });
            
            } else if (selectedCableType == "thermocouple" || selectedCableType == "power_thermocouple"){
                $(".cable-type-expand, #hammertime").removeClass("d-none");
                $('.dot').removeClass('set'); //per side reference
                $('.dot a').css("border","none").removeClass("border-rounded");
                $(".polarity").remove();
                $(".drawing").empty();

            } 
            
            if (selectedCableType == "power"){
                //Remove all pin settings.    
                //TODO : POLARITY FOR THIS SIDE!!!                
                $(".polarity").remove();               
            } 

            $(this).addClass("selected");         
            $("#mainframe-cable-type").html(selectedCableType.toUpperCase());
            
      });

      $(".cable-type-expand span a").on("click",function(event){

            event.preventDefault();
            $(".cable-type-expand span a").removeClass("selected"); // first remove from all.
            var selectedType = $(this).attr("data-value");
            $("#Cable_Style_Type").val(selectedType);
            $(this).addClass("selected"); // set the new active.
            $("#mainframe-cable-style-type").html(selectedType.toUpperCase());
           
      });

      $("#btn-power-setgender").on("click",function(event){
            event.preventDefault();
            $(".mainframe-selector div.cable-gender a").removeClass("active")
            $(".mainframe-selector div.cable-gender a.male").addClass('active');
            $("#modal-2").modal('hide');
            $(".pin .row .dot").addClass("male").removeClass("female");
      });
    
      /*** CONNECTOR TYPE :  HBE, HD, HWHATEVER */
      $(".connector-type span a").on("click",function(event){
          event.preventDefault();
          $(this).parent().parent().find('span a').removeClass("selected");
          if ($(this).data("value")=="HA"){
            
              $(this).closest('.selections').find(".amps-selection a[data-value='10']").trigger("click");
          }
          $(this).closest('.selections').find('.type_connector').html($(this).data("value"));
          $(this).addClass("selected");

      });
           
      /*** AMPS : 15, 30, 10, WHATEVER */

      $(".amps-selection span a").on("click",function(event){
          
          event.preventDefault();
          $(this).parent().parent().find('span a').removeClass("selected");
          

          var selectedAmp = $(this).data("value");                   
          $(this).closest('.selections').find('.amps').html(selectedAmp + " AMP");
          $(this).addClass("selected");
          
      });

      $(".set-pins span a").on("click",function(event){
         
          event.preventDefault();

          //Clear out any existing pin selector / line drawings.
          pointa_left, pointa_top, pointb_left, pointb_top = "";
          click_count = 0; 

          var end = $(this).closest(".selections").attr("data-connectorend");
          var cid = $(this).closest(".selections").attr("data-connectorid");
        
          //Clear out any existing drawing
          $(this).closest(".selections").find(".drawing").remove();


          $(this).parent().parent().find("span a").removeClass("selected");
          
          var selectedPin = $(this).data("value");
          $(this).addClass("selected");
          $(this).closest('.selections').find('.no_pins').html(selectedPin);
          
          
          var drawing = $("<div id='drawing"+cid+"' class='drawing'></div>");

          if (end == "mainframe"){
        
            var $this = $(".mainframePinStyle");
         //   var $this2 = $(".mainframePinStyle:nth-child(2)");
          //  $this2.empty();
          
            $(".mainframePinStyle div.pin, .mainframePinStyle div.alert").remove();
            var $side = $(".mainframe-selector .pin-connectors");
            $side.empty();
            var gender = $(".mainframe-selector .cable-gender span a.active").attr("data-value");


          // $('#cable-image,.mainframePinStyle').animate({left:'297px'},800);
           
          }else if (end == "mold"){
              
            var $this = $("div.moldPinStyle");
          //  var $this2 = $("div.moldPinStyle");
          //  $this2.empty();
          //  $this.empty();
             $(".moldPinStyle div.pin, .moldPinStyle div.alert").remove();
             var $side = $(".mold-selector .pin-connectors");
             $side.empty();
             var gender = $(".mainframe-selector .cable-gender span a.active").attr("data-value");
            //   $('#cable-image, .moldPinStyle').animate({left:'0px'},800);
           
          

          }
          $side.parent().append(drawing);
        
          //animate - push the content over to reveal the pins.
       
          //REWRITE THESE TO SUPPORT INDIVIDUAL ITEMS / NUMBER SYSTEMS.
          //CURRENTLY LOOKS AT ALL PINS...

          if (selectedPin == 5 ){
            var zone1 = $("<div class='zone border-rounded align-middle pin'>").html(oneDotRow+twoDotRow+twoDotRow);
            //Clear out the PinStyle... then start.
         
            //$this.append(zone1);
           $side.append(zone1);
           //Add a "drawing" div.
          

            //numbering... 1 - 4, 2 - 3            
            last_no = Number($(".zone").children('.row').last().find('span.line_no_left').html());                        
    
            $('.zone span.line_no_left').each(function(ind,x){
                if (ind!=0){ // skip first row
                    $(this).html(last_no+(ind-1));
                }
            });
            $('.zone span.line_no_right').each(function(ind,x){
                if (ind!=0){ // again skip the first row
                    total_pins = (ind+1)+(count+1);
                    $(this).html((ind+1)+(count+1));
                }                
            });
           
          } else if (selectedPin == 6) {
              
            var html = twoDotRow.repeat(3); // Make a 6 pin connector
            var pin = $("<div data-cid='" + cid + "' data-cend='"+end+"' class='pin border-rounded'>").html(html);
            //$this.append(pin);        
            $side.append(pin);
           
            
            last_no = Number(pin.children('.row').last().find('span.line_no_left').html());                                        
            $side.find('.pin span.line_no_left').each(function(ind,x){                    
                $(this).html(last_no+(ind));
                //assign the data value to the anchor data as a "data-value".
                $(this).next('span a').attr("data-value",last_no+(ind));
                $(this).parent().next().find("span a").attr("data-value",last_no+(ind));
                   
            });
            $side.find('.pin span.line_no_right').each(function(ind,x){                   
                total_pins = Number($('span.line_no_left').last().html())+1;
                $(this).html(total_pins+ind);
                $(this).parent().prev().find("span a").attr("data-value",total_pins+ind);
                                  
            });                      
            
       
          }else if (selectedPin == 10 || selectedPin == 16){
                var html = selectedPin == 10 ? twoDotRow.repeat(5) : twoDotRow.repeat(8); // either or.                
                var pin = $("<div data-cid='" + cid + "' data-cend='"+end+"' class='pin border-rounded'>").html(html);
                //$this.append(pin);
                $side.append(pin);

                last_no = Number(pin.children('.row').last().find('span.line_no_left').html());                                        
                
                $side.find('span.line_no_left').each(function(ind,x){                    
                        $(this).html(last_no+(ind));
                        $(this).parent().next().find("span a").attr("data-value",last_no+(ind));
                });
                $side.find('span.line_no_right').each(function(ind,x){                   
                        total_pins = Number($('span.line_no_left').last().html())+1;
                        $(this).html(total_pins+ind);
                        $(this).parent().prev().find("span a").attr("data-value",total_pins+ind);                                  
                });                       
                       
               
              
          }else if (selectedPin == 24){
              var html = twoDotRow.repeat(12);
              var pin = $("<div data-cid='" + cid + "' data-cend='"+end+"' class='pin border-rounded'>").html(html);
              $side.append(pin);

              last_no = Number(pin.children('.row').last().find('span.line_no_left').html());                                        
              $side.find('span.line_no_left').each(function(ind,x){
                    
                        $(this).html(last_no+(ind));
                   
                });
               $side.find('span.line_no_right').each(function(ind,x){
                   
                        total_pins = Number($('span.line_no_left').last().html())+1;
                        $(this).html(total_pins+ind);
                                  
                });                       
                        
            
              
          }else if (selectedPin == 25){
            
            var html = twoDotOutsideRow + threeDotRow + threeDotRow + threeDotRow + threeDotRow + threeDotRow + threeDotRow + threeDotRow + twoDotOutsideRow;
            var pin = $("<div data-cid='" + cid + "' data-cend='"+end+"' class='pin border-rounded'>").html(html);
            $side.append(pin);

            last_no = Number(pin.children('.row').last().find('span.line_no_left').text());                                        
            $side.find('span.line_no_left').each(function(ind,x){
                
                    $(this).html(last_no+(ind));
                
            });
            last_no = Number(pin.children('.row').last().find('span.line_no_left').text());                                        
        
            $side.find('span.line_no_right').each(function(ind,x){
                
                $(this).html(last_no+(ind)+1);
                                
            });                       
                        
              
          }

          //Prepend a Message to the user, to prompt them to make a selection

         
          var msg = "<div class='alert alert-success'>Click each pin that corresponds to the connection mapping.</div>";
          var btn = "<button class='btn-close reset btn-small btn'>Reset</button>";

        //  $this.prepend(msg);
          $side.prepend(btn);
        //  $this.animate({ top: '0px', height: 'auto', opacity:'100' }, 800);
          $side.parent().find('.alert').remove();
          //$side.parent().prepend(msg);
         
          $side.animate({ top: '0px', height: 'auto', opacity:'100' }, 800);
          $side.find(".dot a").addClass(gender);
          //$().addClass(gender);
         
         
         
          var opts = {
            timeOut: 0,
            extendedTimeOut: 0,
            closeButton: true,
            positionClass: "toast-top-full-width",
            showEasing: false,

        };
        
         // toastr.warning("Set the Pin Connections (dbl-click each dot on diagram)","DON'T FORGET TO...",opts);
      });


      $(".cable-gender span a").on("click",function(event){            
            
            event.preventDefault();          
         
            var $thisparent = $(this).closest(".cable-gender"); //gives me parent of these two gender items.
            $thisparent.find('span a').removeClass("active");            
            
           
            var selectedCableGender = $(this).data("value"); 
            $(this).addClass("active");       
            $(this).closest('.selections').find('.cable-gender-result').html(selectedCableGender.toUpperCase());
            
            console.log(selectedCableGender);
            //TODO :  FIGURE OUT A WAY TO MAKE THIS WORK FOR MULTIPLES....
            selectedCableGender == "female" ? $thisparent.closest(".panel-body").find(".pin-connectors .dot a").addClass("female").removeClass("male") : $thisparent.closest(".panel-body").find(".pin-connectors .dot a").addClass("male").removeClass("female");
            //activeMainframeGender = selectedCableGender;

      });

      
      $(".latch-style span a").on("click",function(event){            
            
            event.preventDefault();          
            
        
            var $thisparent = $(this).closest(".latch-style"); //gives me parent of these two gender items.
            $thisparent.find('span a').removeClass("selected");            
            
            $end = $(this).closest(".selections").attr("data-connectorend");
            var selectedLatch = $(this).data("value");   
            if ($end == "mainframe"){         
                (selectedLatch == "single") ? $(".mainframe-singlelatch-button").trigger("click") : $(".mainframe-doublelatch-button").trigger("click");            
            }else if ($end == "mold"){
                (selectedLatch == "single") ? $(".mold-singlelatch-button").trigger("click") : $(".mold-doublelatch-button").trigger("click");    
            }
            $(this).addClass("selected");       
            
            
        });

        $(".hood-entry span a").on("click",function(event){            
            
            event.preventDefault();          
            
            var $thisparent = $(this).closest(".hood-entry"); 
            $thisparent.find('span a').removeClass("selected");            
            
            var selectedVal = $(this).data("value");  
            $end = $(this).closest(".selections").attr("data-connectorend");
            if ($end=="mainframe"){
                (selectedVal == "top") ? $(".mainframe-topentry-button").trigger("click") : $(".mainframe-sideentry-button").trigger("click");              
            }else if ($end == "mold"){
                (selectedVal == "top") ? $(".mold-topentry-button").trigger("click") : $(".mold-sideentry-button").trigger("click");     
            }
            $(this).addClass("selected");       
            //$(this).closest('.selections').find('.hood_entry').html(selectedVal.toUpperCase());        
        
        });


    //** -- ZONES / ZONES OTHER  **/
    
    $(".zones .zonesOtherVal").on("change",function(){
  
          $(this).closest('.selections').find('.no-zones').html($(this).val());
          $(this).addClass("selected");
          $(this).closest('.selections').find('.zones .zone a').removeClass("selected");        
         
      });

    $(".zones span a").on("click",function(event){
        
        
        event.preventDefault();
        $(this).parent().parent().find('span a').removeClass("selected");        
        var selectedZone = $(this).attr("data-value");      
        $(this).addClass("selected");
        $(this).closest('.selections').find(".no-zones").html(selectedZone.toString());       
        $(this).closest('.zones').find('.zonesOtherVal').val("").removeClass('selected');
        
    });

      
    if ($("table td").attr("animate") == "on") {
        $this = $(this);
        $this.addClass('animated bounceInDown');   
        window.setTimeout( function(){
                $this.removeClass('animated bounceInDown');
            }, 2000);         

    }
       
      
  
  
    $("a.contact-toggle").on("click", function (event) {        

        event.preventDefault();
       
        if (document.getElementById("contacts-frame").getBoundingClientRect().left < 0 ) {
            
            $("#style-selector-mainframe,#upload-frame").animate({ left: '-'+w +'px', width: w+'px' }, 800);                
            $("#contacts-frame").animate({left: '0px',width: w+'px'},800);            
        }else{
            $("#contacts-frame").animate({left: '-'+w+'px',width: w+'px'},800);       
            $("#style-selector-mainframe").animate({ left: '0px', width: w+'px' }, 800);         
        }
        
    });


$(".upload-toggle").on("click", function () {        
    
    if ($("#ID").val()!=""){

        var style_left = document.getElementById("style-selector-mainframe").getBoundingClientRect().left;

        if (document.getElementById("upload-frame").getBoundingClientRect().left < 0) {
            //show it.
          
            $("#upload-frame").animate({ left: '0px', width: w +'px'}, 500);
            $("#style-selector-mainframe,#contacts-frame").animate({left: '-'+w+'px', width: w+'px'},800);
              
        } else {
            $("#style-selector-mainframe").animate({ left: '0px', width: w+'px' }, 800);                
            $("#upload-frame, #contacts-frame").animate({left: '-'+w+'px',width: w+'px'},800);
        
        }
    }else{
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "800",        
            "timeOut": "800",
            "extendedTimeOut": "0",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
            }
        toastr.error("Please save your entries before uploading images. Start by entering your Company information.");
        $("#contacts-frame").animate({left: '0',width: w+'px'},800);
        $("#style-selector-mainframe").animate({left: '-'+w+'px', width: w+'px'},800);

    }
    
});

     

      $("#style-selector-mold .toggle").on("click", function (event) {
          
            event.preventDefault();

            if ($("#style-selector-mold").position().left >= $(".container-fluid").width()) {
                           
                $("#style-selector-mold").animate({ right: '0px', width: w+'px' }, 800);
                $("#style-selector-mold .style-toggle").removeClass("arrow-left").addClass("arrow-right"); 
                  
            } else {
            
                $("#style-selector-mold").animate({ right: '-'+w+'px', width: w+'px' }, 800);       
                $("#style-selector-mold .style-toggle").addClass("arrow-left").removeClass("arrow-right");          
            }
    });


   
 
   
    $("#style-selector-mainframe .style-toggle").on("click", function (event) {
               
        event.preventDefault();       
        
        //This is what was just clicked... must become active regardless of where it's at.
        var $this = $(this);               
        var getpos = $this.closest(".selections").offset().left; // This would be active...               
        var cid = $this.closest(".selections").attr("data-connectorid");
        
        if (getpos >= 0){
            //its already open, so toggle it closed.         
            $this.closest(".selections").animate({left: '-'+w+'px',width: w+'px'},800);        
            $this.closest(".selections").find("a.arrow-left").addClass("arrow-right").removeClass("arrow-left");
        }else{
            //its closed, open it.
            $this.closest(".selections").animate({left: '0px',width: w+'px'},800);
            $this.closest(".selections").find("a.arrow-right").removeClass("arrow-right").addClass("arrow-left");
        }

               
    });


   


//****  PIN / CONNECTORS ****/
var pointa = "";
var pointb = "";
var ele1 = "";
var ele2 = "";

var pointa_left = "";
var pointa_top = "";

var pointb_left = "";
var pointb_top = "";
var click_count = 0;


$(document).on("click",'.pin .dot a', function(event){
   
    click_count++
    event.preventDefault();
    var $this = $(this).data("value");    
   
    //Assess the cable type.
    var cableType = $("#cable-type").text();
   
 
    if (cableType == "power"){
    // console.log($(this).parent().parent().closest(".pin").parent().parent().siblings('.drawing'));
     
    
    
       // var drawing = String($(this).parent().parent().closest(".pin").siblings('.drawing').attr("id"));
    
        //var drawing = String($(this).parent().parent().closest(".pin").parent().parent().siblings('.drawing').attr("id"));  

        var drawing = String($(this).parent().parent().closest(".pin-connectors").siblings(".drawing").attr("id"));
        var drawingdiv = "#" + drawing;

        if (click_count==1){
        
            $(this).closest('.pin').find('.dot').removeClass('set'); //per side reference
            $(this).closest('.pin').find('.dot a').css("border","none").removeClass("border-rounded");
            $(this).closest('.pin').find(".polarity").remove();

            pointa = $this;    
            var ele1 = $(this).parent();                  
            pointa_left = Math.round(ele1.offset().left);
            pointa_top = Math.round(ele1.offset().top);
        
        
            $(this).css("border", "3px solid #333").addClass('border-rounded');
            $(this).parent().addClass("set");
        
        }else if (click_count==2){

            pointb = $this;
            var ele2 = $(this).parent();            
            pointb_left = Math.round(ele2.offset().left);
            pointb_top = Math.round(ele2.offset().top);
     
            //TOP TO BOTTOM (VERTICCAL)
            if (pointa_left === pointb_left){
                    
                    $(drawingdiv).empty();          

                    var draw = SVG(drawing).size(35, 35);                
            
                    var line = draw.line(0, 0, 0, 45).animate().move(7.5,7.5);
                    line.stroke({ color: '#333', width: 10, linecap: 'round' });
                    
                    //reset click_count to zero.          
                    $(drawingdiv).offset({ top: pointa_top, left: pointa_left}); 
                    $(this).css("border", "3px solid #333").addClass('border-rounded');                     
                    $(this).parent().addClass("set");           
            
                  
            } else {
              //LEFT TO RIGHT HORIZONTAL  
                
                    $(drawingdiv).empty();
                
                    var distance = (pointb_left - pointa_left)+10;      
                    
                    var draw = SVG(drawing.toString()).size(distance,25);
                
                    var line = draw.line(0,0,distance,0).animate().move(7.5,7.5);        
                    line.stroke({color: '#333', width:10, linecap: 'round'});
                    $(drawingdiv).offset({top: pointb_top, left: pointa_left});
                
                    $(this).css("border", "3px solid #333").addClass('border-rounded');                     
                    $(this).parent().addClass("set");    

                    pointa_left, pointa_top, pointb_left, pointb_top = "";
                    click_count = 0; 
               
                            
            }
            //Clear out the points.
          //  $(this).css("border", "3px solid #333").removeClass("border-rounded");
         //   $(this).parent().removeClass("set");
            pointa_left, pointa_top, pointb_left, pointb_top = "";
            click_count = 0; 
        
        
        
        }
      
    }else if (cableType == "thermocouple"){
        
        if (click_count==1){
            $("#drawing1").empty();
            $(this).closest('.pin').find('.dot').removeClass('set'); //per side reference
            $(this).closest('.pin').find('.dot a').css("border","none").removeClass("border-rounded");
            $(this).closest('.pin').find(".polarity").remove();

            $(this).parent().addClass("set");
            $(this).parent().prepend("<span class='polarity polarity-pos'></span>");

        }else if (click_count==2){
            $(this).parent().addClass("set");
            $(this).parent().prepend("<span class='polarity polarity-neg'></span>");
            click_count = 0;
        }else{
            $(this).closest('.pin').find('.dot').removeClass('set'); //per side reference
            $(this).closest('.pin').find(".polarity").remove();
            click_count = 0;
        }
       
    }else if (cableType == "power_thermocouple"){
        
        //ALLOW FOR 4 CLICKS!!!!! FOR BOTH TO BE SET.        
        var drawing = String($(this).parent().parent().closest(".pin-connectors").siblings(".drawing").attr("id"));
        var drawingdiv = "#" + drawing;

        //click 1 /2 is POWER 
        if (click_count==1){
        
            $(this).closest('.pin').find('.dot').removeClass('set'); //per side reference
            $(this).closest('.pin').find('.dot a').css("border","none").removeClass("border-rounded");
            $(this).closest(".pin").find(".polarity").remove();

            pointa = $this;    
            var ele1 = $(this).parent();                  
            pointa_left = Math.round(ele1.offset().left);
            pointa_top = Math.round(ele1.offset().top);
        
        
            $(this).css("border", "3px solid #333").addClass('border-rounded');
            $(this).parent().addClass("set");
        
        }else if (click_count==2){

            pointb = $this;
            var ele2 = $(this).parent();            
            pointb_left = Math.round(ele2.offset().left);
            pointb_top = Math.round(ele2.offset().top);
           
            if (pointa_left === pointb_left){
           
                $(drawingdiv).empty();          

                var draw = SVG(drawing).size(35, 35);
                var line = draw.line(0, 0, 0, 45).animate().move(7.5,7.5);
                line.stroke({ color: '#333', width: 10, linecap: 'round' });
                //reset click_count to zero.          
                $(drawingdiv).offset({ top: pointa_top, left: pointa_left});
                $(this).css("border", "3px solid #333").addClass('border-rounded'); 
           
                $(this).parent().addClass("set");
                
            }else{
             
                    $(drawingdiv).empty();                
                    var distance = (pointb_left - pointa_left)+10;                
                    var draw = SVG(drawing.toString()).size(distance,35);
                    var line = draw.line(0,0,distance,0).animate().move(7.5,7.5);                
                    line.stroke({color: '#333', width:10, linecap: 'round'});
                    $(drawingdiv).offset({top: pointb_top, left: pointa_left});                
                    $(this).css("border", "3px solid #333").addClass('border-rounded');
                 
                    $(this).parent().addClass("set");
                    pointa_left, pointa_top, pointb_left, pointb_top = "";                
                    
            }
        } else if (click_count == 3){                               
                $(this).parent().addClass("set");
                $(this).parent().prepend("<span class='polarity polarity-pos'></span>");

        }else if (click_count == 4){
            $(this).parent().addClass("set");
            $(this).parent().prepend("<span class='polarity polarity-neg'></span>");
            click_count = 0;        
        }
    }else{    
        $(this).css("border", "3px solid #333").addClass("border-rounded");
        pointa_left, pointa_top, pointb_left, pointb_top = "";
        click_count = 0; 
  }
});

/*** MULTIPLE DROP ZONE AREAS:  TESTING. */

var i = 1,				
$dropzone_filetable = $(".dropzone-filetable"),
dropzone = $(".advancedDropzone").dropzone({
	
    url: 'upload-file.php',

    addedfile: function(file)			{
		
        if(i == 1)	{
		    $dropzone_filetable.find('tbody').html('');
		}
		var size = parseInt(file.size/1024, 10);
		size = size < 1024 ? (size + " KB") : (parseInt(size/1024, 10) + " MB");

		var $entry = $('<tr>\
		    <td class="text-center">'+(i++)+'</td>\
		    <td>'+file.name+'</td>\
		    <td><div class="progress progress-striped"><div class="progress-bar progress-bar-warning"></div></div></td>\
		    <td>'+size+'</td>\		    \
		    <td class="filename"><a data-filename='+file.name+' class=""><i class="fas fa-close"></i></a>\
		</tr>');
			
        $dropzone_filetable.find('tbody').append($entry);
		file.fileEntryTd = $entry;
		file.progressBar = $entry.find('.progress-bar');
	},
	uploadprogress: function(file, progress, bytesSent)	{			
        file.progressBar.width(progress + '%');
	},
	success: function(file) {
		
        file.fileEntryTd.find('td:nth-last-child(3)').html('<span class="text-success">Uploaded</span>');
		file.progressBar.removeClass('progress-bar-warning').addClass('progress-bar-success');	
      
        
        var cableid = $(".saveOrder").attr("data-cableid");
        var id = $("#ID").val();
        
        if (id!=""){

            saveImageUpload(file.name,id);
        }else{
            console.log(id + " You cant do this till you save the appropriate connecter info.");
            //empty the files from here cause otherwise we're messed up.

        }
      


	},
	error: function(file)	{
			//file.fileEntryTd.find('td:last').html('<span class="text-danger">Failed</span>');
		file.fileEntryTd.find('td:nth-last-child(3)');
		file.progressBar.removeClass('progress-bar-warning').addClass('progress-bar-red');
	},
    sending: function(file,xhr,formData){        
        formData.append('PO', $("#ID").val());

        
    }
});


/*
var i = 1,				
$dropzone_filetable = $("#dropzone-filetable"),
dropzone = $("#advancedDropzone").dropzone({
	
    url: 'upload-file.php',

    addedfile: function(file)			{
		
        if(i == 1)	{
		    $dropzone_filetable.find('tbody').html('');
		}
		var size = parseInt(file.size/1024, 10);
		size = size < 1024 ? (size + " KB") : (parseInt(size/1024, 10) + " MB");

		var $entry = $('<tr>\
		    <td class="text-center">'+(i++)+'</td>\
		    <td>'+file.name+'</td>\
		    <td><div class="progress progress-striped"><div class="progress-bar progress-bar-warning"></div></div></td>\
		    <td>'+size+'</td>\		    \
		    <td class="filename"><a data-filename='+file.name+' class=""><i class="fas fa-close"></i></a>\
		</tr>');
			
        $dropzone_filetable.find('tbody').append($entry);
		file.fileEntryTd = $entry;
		file.progressBar = $entry.find('.progress-bar');
	},
	uploadprogress: function(file, progress, bytesSent)	{			
        file.progressBar.width(progress + '%');
	},
	success: function(file) {
		
        file.fileEntryTd.find('td:nth-last-child(3)').html('<span class="text-success">Uploaded</span>');
		file.progressBar.removeClass('progress-bar-warning').addClass('progress-bar-success');
		$("#send-files-to-admin, #note-to-admin").removeClass('disabled');
        var po = $("#PO").val();
        var cableid = $(".saveOrder").attr("data-cableid");
        if (po!="" & cableid!=""){
            saveImageUrl(file,cableid,po)
        }else{
            console.log(po + " : " + cableid + " You cant do this till you save the appropriate connecter info.");
        }
      


	},
	error: function(file)	{
			//file.fileEntryTd.find('td:last').html('<span class="text-danger">Failed</span>');
		file.fileEntryTd.find('td:nth-last-child(3)');
		file.progressBar.removeClass('progress-bar-warning').addClass('progress-bar-red');
	},
    sending: function(file,xhr,formData){        
        formData.append('PO', $("#PO").val());

        
    }
});
*/


$("a.back").on("click",function(event){
    
    event.preventDefault();    
    $("#recap").remove();    
    $("#customizer, .navbar-nav [data-menufor='customizer']").removeClass("d-none");
    $(".navbar-nav [data-menufor='review']").addClass("d-none");
});

$(".advancedDropzone").css({minHeight: 50, textAlign : 'center'});



$("a.sendOrder").on("click",function(event){

    
    event.preventDefault();

    
    $("a.saveOrder").trigger("click");

    $(".navbar-nav [data-menufor='reviewParts'], button.backward").addClass("d-none");

    var $id = $("#ID").val();
  
    if ($id){

        var item = $("#cable-image").get()[0].innerHTML;    
       
        var recap = $.get("recap.html",function(result){           
            $("#customizer").before(result);
            $("#cable-result").html(item);
        });
          
        var result = $.ajax({
            type: 'post',
            url: 'api-cables/grabRFQ.php',
            dataType: "json",                
            data: {       
                'id': $id
            }, 
            success: function(data) { 
                    //Traverse through this and fill it up; get rid of all these panels.
                   // $("#recap").show();
                  //  $(".navbar-nav li[data-menufor='review']").removeClass("d-none");
                    $("#customizer, .navbar-nav li[data-menufor='customizer']").addClass("d-none");   
                    $(".navbar-nav li[data-menufor='review']").removeClass("d-none");               
                    $("#recap-table tbody").empty();
                    var thead;
                    var columnsIn = data[0]; 
                    for(var key in columnsIn){
                       thead = thead + "<th>" + key + "</th>";
                    } 
                    $("#recap-table thead").empty().append("<tr>"+thead+"</tr>");
                   

                    $.each(data,function(ind, val){
                       
                        var tr = $("<tr>");
                            $.each(val,function(i,v)   {
                                var td = (v!='') ? td = "<td style='padding: 5px 8px;border-color: #eee; border-bottom: 1px solid #eee;'>" : "<td class='alert alert-danger'>";                   
                                $(tr).append(td + v.toUpperCase() + "</td>");

                            });
                            $("#recap-table").append(tr);
                    });
                  
                
            },error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
            }       
        });
       if (result)
       result.then = $.ajax({
            type: 'post',
            url: 'api-cables/grabOrderInfo.php',
            dataType: "json",                
            data: {
                'id': $id

            }, 
            success: function(result) { 
                
                $.each(result,function(ind, val){
                    $.each(val,function(i,v){
                       
                        $("."+i).html(v.toUpperCase());
                    });
                });
        
                
            },error: function (xhr, ajaxOptions, thrownError) {

                
                    console.log(xhr.status);
                    console.log(thrownError);
            }       
        });
        
        $.ajax({
            type: 'post',
            url: 'api-cables/grabImageUploads.php',
            dataType: 'json',
            data: {
                'id': $id,
            },
            success: function(result){
                $("#image-uploads").empty();
                if (result.length>0){
                    $.each(result,function(ind, val){
                    
                        $.each(val,function(i,v){
                            $img = "<li><img src='http://cables.acetronic.com/" + v + "' alt='" + v + "' width='80' class='img-thumbnail'></li>";
                        //Make and insert images accordingly.
                            $("#image-uploads").append($img);
                        });
                    });
                }else{
                    $img = "<li class='alert alert-danger'>NO IMAGES HAVE BEEN UPLOADED</li>";
                    $("#image-uploads").append($img);
                }
            },
            error: function(xhr,ajaxOptions,thrownError){
                console.log(xhr.status + thrownError);
            }
        });
  
    }else{
        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-full-width",
            "preventDuplicates": true,
            "onclick": null,
            "showDuration": "3000",        
            "timeOut": "800",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
          }
        toastr.error("Please fill out all fields and save your RFQ to continue.");
    }

});
$("a.addMainframe").on("click",function(event){
    //alert("TBD:  add another CONNECTOR");
});

$(".btn-send").on("click",function(event){
  
    event.preventDefault();
    var htmlid = $(this).attr("data-id");
    
    $("#modal-1 #btn-submit").attr("data-id",htmlid);
    $('#modal-1').modal('show', { 
        backdrop: true,
        focus: true        
    });

});

$(document).on("click","#btn-submit,#btn-submit-parts", function(event){

    event.preventDefault();  

    var ID = $(".ID").text();
    var cloneme = $(this).attr("data-id");      
    var $clone = $("#"+cloneme).clone();
   
    $clone.find("#bottom-wizard").remove();
    $clone.find(".d-print-none,.backward").remove();
    $clone.find("#cable-result").remove();

    $html = $clone.html();
    $email = $(".Email").text().toLowerCase();
    
    
    if (ID!=null && $html !=null && $email !=null){

        var send = $.ajax({
            type: 'POST',
            url: 'api-cables/sendRFQ.php',
            dataType: 'json',
            data: {
                'id': ID,
                'html': $html,
                'email': $email
            },
            success: function(result){
                
            },
            error: function(xhr,ajaxOptions,thrownError){
                console.log(xhr.status + thrownError);
            }
        });
        send.then(function(result){
            
            if (result.success === "true"){
                    //If sent okay, then go ahead and set submitted.
                //TODO WRITE THIS PART...
                localStorage.removeItem("RFQID");
                localStorage.removeItem("RFQID_Type");
            
                $.ajax({
                    type: 'post',
                    url: 'api-cables/setSubmitted.php',
                    dataType: 'json',
                    data: {
                        'id': ID,
                    },
                    success: function(data){
                       
                        if (data.orderid=="1"){
                            $("#ID").val('');
                            //Clear all values.
                            $("input[type=text] , textarea").val('');
                            $("#modal-1").modal('hide');
                            $("#finishModal").modal('show');
                           
                        }
                    },
                    error: function(xhr,ajaxOptions,thrownError){
                        console.log(xhr.status + thrownError);
                    }
                });
            }else{
                toastr.error("Something went wrong.");
            }

        });
    }else{
        toastr.error("Something went wrong.");
    }
   
});


$('#finishModal').on('hidden.bs.modal', function (e) {
    //when user closes it, you can reload
    window.location.reload(false); 
});
$("a.btn-print").on("click",function(event){

    event.preventDefault();
    window.print();
    return false;


});

//Turned this off for now; using regular print method.
//User will have to select "Print to PDF from the properties window"
$("a.btn-printxxx").on("click",function(event){

    event.preventDefault();
    // open the PDF in a new window   
    var ID = $(".ID").text();
    var OrderDate = $('.Order_Date').text();
    var Qty = $(".Qty").text();
    var Length = $(".Length").text();
    var Email = $(".Email").text();
    var Company = $(".Company").text();
    var Contact = $(".Contact").text()
    var Phone = $(".Phone").text();
    var Ext = $(".Ext").text();

    var tableDef =  $("#recap-table tr").toArray();
    var headers = jQuery('#recap-table th').map(function(i,e) { return e.innerHTML;}).get();
    
    var tableData = ['ID', 'CID', 'Connector End', 'Type', 'No Zones', 'Gender', 'Connector', 'No Pins', 'Amps', 'Hood Entry', 'Clamp Style', 'Cable Length', 'Map'];    
    var datas = [];
    $.each(jQuery('#recap-table tr:gt(0)'), function(i,e ) {
        datas.push(jQuery('td', e).map(function(i,e) {
                                            return e.innerHTML; 
                                        }).get()
                    );
    });
    
    datas.unshift(tableData);

var dd = {


    header: {
     columns: [
       { text: 'ACETRONIC CABLE RFQ', style: 'documentHeaderLeft' },
       { text: '', style: 'documentHeaderCenter' },
       { text: 'PAGE 1', style: 'documentHeaderRight' }
     ]
   },
   footer: {
     columns: [
       { text: 'acetronic.com |sales@acetronic.com', style: 'documentFooterLeft' },
       { text: '1.800.803.8871', style: 'documentFooterCenter' },
       { text: '7015 ORDAN DRIVE, MISSISSAUGA, ON', style: 'documentFooterRight' }
     ]
   },
     content: [
         // Header
         {
             columns: [
                 {
                    image:  'data:image/png;base64,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',
                    width: 150
                 },
                     
                 [
                     {
                         text: 'RFQ - CABLES', 
                         style: 'invoiceTitle',
                         width: '*'
                     },
                     {
                       stack: [
                            {
                                columns: [
                                     {
                                         text:'RFQ #:', 
                                         style:'invoiceSubTitle',
                                         width: '*'
                                         
                                     }, 
                                     {
                                         text: ID,
                                         style:'invoiceSubValue',
                                         width: 100
                                         
                                     }
                                     ]
                            },
                            {
                                columns: [
                                    {
                                        text:'Date Issued',
                                        style:'invoiceSubTitle',
                                        width: '*'
                                    }, 
                                    {
                                        text: OrderDate,
                                        style:'invoiceSubValue',
                                        width: 100
                                    }
                                    ]
                            },
                           
                        ]
                     }
                 ],
             ],
         },
         // Billing Headers
         {
             columns: [
                 {
                     text: 'Company Name',
                     style:'invoiceBillingTitle',
                     
                 },
                 {
                     text: 'Email / Phone',
                     style:'invoiceBillingTitle',
                     
                 },
             ]
         },
         // Billing Details
         {
             columns: [
                 {
                     text: Company,
                     style: 'invoiceBillingDetails'
                 },
                 {
                     text: Phone + " " + Ext + Email,
                     style: 'invoiceBillingDetails'
                 },
             ]
         },
         // Billing Address Title
         {
             columns: [
                 {
                     text: 'Contact',
                     style: 'invoiceBillingAddressTitle'
                 },
                
             ]
         },
         // Billing Address
         {
             columns: [
                 {
                     text: Contact,
                     style: 'invoiceBillingAddress'
                 },
              
             ]
         },
         // Line breaks
         '\n\n',
         // Items
         {
           table: {
             // headers are automatically repeated if the table spans over multiple pages
             // you can declare how many rows should be treated as headers
             headerRows: 1,
             widths: [20,15,40,40,30,35,30,30,30,30,30,30,30],
     
             body: datas,
            
           }, // table
         //  layout: 'lightHorizontalLines'
            style: 'table'
         },
      // TOTAL
         {
           table: {
             // headers are automatically repeated if the table spans over multiple pages
             // you can declare how many rows should be treated as headers
             headerRows: 0,
             widths: [ '*', 80 ],
     
             body: [
               // Total
               [ 
                   {
                       text:'Quantity',
                       style:'itemsFooterSubTitle'
                   }, 
                   { 
                       text:Qty,
                       style:'itemsFooterSubValue'
                   }
               ],
               [ 
                   {
                       text:'Total Length',
                       style:'itemsFooterSubTitle'
                   },
                   {
                       text: Length,
                       style:'itemsFooterSubValue'
                   }
               ],
               
             ]
           }, // table
           layout: 'lightHorizontalLines'
         },
        
         { 
             text: 'NOTES',
             style:'notesTitle'
         },
         { 
             text: 'Please keep a copy of this RFQ for your records.  An Acetronic salesperson will contact you via phone or email if there are any questions.  If you do not receive your Quote within 48 hours, please email sales@acetronic.com',
             style:'notesText'
         }
     ],
     styles: {
         // Document Header
         documentHeaderLeft: {
             fontSize: 10,
             margin: [5,5,5,5],
             alignment:'left'
         },
         documentHeaderCenter: {
             fontSize: 10,
             margin: [5,5,5,5],
             alignment:'center'
         },
         documentHeaderRight: {
             fontSize: 10,
             margin: [5,5,5,5],
             alignment:'right'
         },
         // Document Footer
         documentFooterLeft: {
             fontSize: 10,
             margin: [5,5,5,5],
             alignment:'left'
         },
         documentFooterCenter: {
             fontSize: 10,
             margin: [5,5,5,5],
             alignment:'center'
         },
         documentFooterRight: {
             fontSize: 10,
             margin: [5,5,5,5],
             alignment:'right'
         },
         // Invoice Title
         invoiceTitle: {
             fontSize: 22,
             bold: true,
             alignment:'right',
             margin:[20,0,0,15]
         },
         // Invoice Details
         invoiceSubTitle: {
             fontSize: 12,
             alignment:'right'
         },
         invoiceSubValue: {
             fontSize: 12,
             alignment:'right'
         },
         // Billing Headers
         invoiceBillingTitle: {
             fontSize: 14,
             bold: true,
             alignment:'left',
             margin:[0,20,0,5],
         },
         // Billing Details
         invoiceBillingDetails: {
             alignment:'left'
 
         },
         invoiceBillingAddressTitle: {
             margin: [0,7,0,3],
             bold: true
         },
         invoiceBillingAddress: {
             
         },
         // Items Header
         itemsHeader: {
             margin: [0,5,0,5],
             bold: true
         },
         // Item Title
         itemTitle: {
             bold: true,
         },
         itemSubTitle: {
             italics: true,
             fontSize: 11
         },
         itemNumber: {
             margin: [0,5,0,5],
             alignment: 'center',
         },
         itemTotal: {
             margin: [0,5,0,5],
             bold: true,
             alignment: 'center',
         },
 
         // Items Footer (Subtotal, Total, Tax, etc)
         itemsFooterSubTitle: {
             margin: [20,5,0,5],
             bold: true,
             alignment:'right',
         },
         itemsFooterSubValue: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'center',
         },
         itemsFooterTotalTitle: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'right',
         },
         itemsFooterTotalValue: {
             margin: [0,5,0,5],
             bold: true,
             alignment:'center',
         },
         signaturePlaceholder: {
             margin: [0,70,0,0],   
         },
         signatureName: {
             bold: true,
             alignment:'center',
         },
         signatureJobTitle: {
             italics: true,
             fontSize: 10,
             alignment:'center',
         },
         notesTitle: {
           fontSize: 10,
           bold: true,  
           margin: [0,50,0,3],
         },
         notesText: {
           fontSize: 10
         },
         center: {
             alignment:'center',
         },
         table: {
             fontSize: 8,
             alignment: 'center',
             width: '100%'
         }
     },
     defaultStyle: {
         columnGap: 20,
     }
 }

    pdfMake.createPdf(dd).print();

});



$("a.saveOrder").on("click",function(event) {
    
  
    event.preventDefault();
    

   
    if ($("#contactForm").valid() && Number($("#Qty").val())>0 && Number($("#Length").val()>0)) { 
    
    
    var $company,$contact,$phone,$ext,$email,$po,$notes,$sales,$end,
    $cable_type,$cable_length,$amps,$gender,$hood_entry,
    $no_pins,$no_zones,$type_connector,$id, $cable_style_type, $cable_type;

    $saveBtn = $(this); // variable to identify this anchor tag (the clicked tag);
    $end = $(".selections"); //identify which end, mold or mainframe // how many are there... for each one, do the entire thing.

 
   // $.each($end,function(ind,item){
        
      
        
        var $orderid = $saveBtn.attr("data-orderid"); // if these values are set, likely a "update..."   
        var $cableid = $saveBtn.attr("data-cableid"); // if this exists, then its a resave. 
        //Using ID's cause there will only be ONE>>>>> PO / com info    
        $("#Company1").val() != "" ? $company= $("#Company1").val() : $company = "";
        $("#Contact1").val() != "" ? $contact= $("#Contact1").val() : $contact = "";
        $("#Phone1").val() != "" ? $phone= $("#Phone1").val() : $phone = "";
        $("#Email1").val() != "" ? $email= $("#Email1").val() : $email = "";
        $("#ext1").val() != "" ? $ext= $("#ext1").val() : $ext = "";
        $("#ID").val() != "" ? $id= $("#ID").val() : $id = "";        
        $(".notes").val() != "" ? $notes= $(".notes").val() : $notes = "";        
        $("#Length").val() !="" ? $length = $("#Length").val() : $length = "";
        $("#Qty").val() !="" ? $qty = $("#Qty").val() : $qty = "";
       // $("#cable-style-type").text() != "" ? $cable_style_type = $("#cable-style-type").text() : $cable_style_type = '';
       // $("#cable-type").text() !="" ? $cable_type = $("#cable-type").text() : $cable_type = "";
        $("#Cable_Type").val()!="" ? $cable_type = $("#Cable_Type").val() : $cable_type = '';
        $("#Cable_Style_Type").val()!="" ? $cable_style_type = $("#Cable_Style_Type").val() : $cable_style_type = '';
       
        if ($company!="" && $phone !="" && $end !="" && $email!="") {
        
         var deferred = $.ajax({
                type: 'post',
                url: 'api-cables/saveOrderInfo.php',
                dataType: "json",                
                data: {
                    'company': $company,
                    'contact': $contact,
                    'phone': $phone,
                    'ext': $ext,
                    'email': $email,
                    'id': $id,
                    'notes': $notes,
                    'sales': $sales,
                    'orderid': $orderid,
                    'length': $length,
                    'qty': $qty,
                    'cablestyletype': $cable_style_type,
                    'cabletype': $cable_type,
                    'rfqtype': 'customizer'
                }, 
                success: function(result) { 
                  

               
                        $.each(result,function(ind,elem){
                        
                                if (ind=="orderid"){
                                var $orderid = elem;                      
                                    //Apply the order id to the saveOrder Anchor    
                                    $saveBtn.attr("data-orderid",elem);                          
                                    //After a save, show an alert : with details of the order.     
                                    $("#ID").val($orderid).addClass("bg-green"); // why is this NOT getting set. 
                                    localStorage.setItem("RFQID",$orderid); // Save the ID to the user's local storage... only clear out when the "submit!" 
                                    localStorage.setItem("RFQID_Type","customizer");   
                                    var opts = {
                                        closeButton: false,
                                        debug: false,
                                        newestOnTop: true,
                                        progressBar: false,
                                        positionClass: "toast-top-full-width",
                                        preventDuplicates: true
                                      }       
                                    toastr.success("The information has been stored for Purchase Order No.<br/>Please make note of your RFQ No for future reference : " +$orderid,opts); 
                                     
                                }
                        });
                    
                },error: function (xhr, ajaxOptions, thrownError) {

                    
                        console.log(xhr.status);
                        console.log(thrownError);
                }       
            });
            
 
            deferred.then(function(result){

                $.each($end,function(ind,item){
 
                var $endtype = $(this).attr("data-connectorend");    
                var $connectorid = $(this).attr("data-connectorid"); // each panel created will have a connector id auto assigned... the first one is already set.                
                var orderid = $saveBtn.attr("data-orderid");
                
                var $this = item;
               
                        //for every single connector, grab closest results.. and save to db.
                        if (orderid!="0"){
                        
                       //  $.each(obj, function(ind,elem){
                        
                        //  var $this = ind;
                        //echo json_encode(array("po"=>$po,"end"=>$end,"cable"=>$cable_type,"cable_length"=>$cable_length,"amps"=>$amps,"gender"=>$gender,"hood_entry"=>$hood_entry,"no_pins"=>$no_pins,"connector"=>$connector_id,"type_connector"=>$type_connector));
                            
                         
                            $no_zones = $($this).find('.no-zones').text().toString() != "" ? $($this).find('.no-zones').text().toString() : $($this).find('.zonesOtherVal').val(); // 1, 2, 5, 8, 12 , other _                            
                            $no_pins = $($this).find('.no_pins').text().toString(); /// 5,6,10,16,24,25 other _
                            $hood_entry = $($this).find('.hood_entry').text().toString(); //side , top  
                            $cable_type = $($this).find(".cable_type").text().toString();
                            $amps = $($this).find('.amps').text().toString(); // 10, 15, 30
                            $gender = $($this).find('.cable-gender-result').text().toString(); // female, male               
                            $cable_length = $($this).find('.cable-length').text().toString(); // length of cable.
                            $type_connector = $($this).find('.type_connector').text().toString(); //HBE, HD, ETC.
                            $clamp_style = $($this).find('.clamp_style').text().toString(); // single latch / double latch.

                               $imageurl = $(".filename > a").attr("data-filename");
                                  
                                  //TODO : CONNECTIONS MAP... WE NEED A SOLUTION THAT WORKS FOR MULTIPLES...
                                  // THINK ITS GONNA HAVE TO BE, A SET ITEM UNDER THE .SELECTIONS SIDE WHEN ITS INITIALLY SET.
                                var $connections_map = [];  
                                
                            $(".dot.set a").each(function(){  
                                var $thisend = $(this).closest(".pin").attr("data-cend");     
                                                          
                                if ($endtype == $thisend){
                                    $connections_map.push($(this).attr("data-value"))
                                }
                            });
                                  
                           
                                

                                //if cable_id exists then this record gets updated... 

                                    $.ajax({
                                        type: 'post',
                                        url: 'api-cables/saveCableOptions.php',
                                        dataType: "json",
                                        data: {     
                                            'po':$po, 
                                            'end': $endtype,                                                       
                                            'no_zones': $no_zones,
                                            'cable_length': $cable_length,
                                            'amps': $amps,
                                            'gender': $gender,
                                            'hood_entry': $hood_entry,
                                            'no_pins': $no_pins,                            
                                            'connector_id': $connectorid,                      
                                            'order_info_id': orderid,
                                            'type_connector': $type_connector,
                                            'cable_id': $cableid,
                                            'imageurl': $imageurl,
                                            'clamp_style': $clamp_style,
                                            'connections_map': $connections_map.toString()
                                            

                                        }, 
                                        success: function(result) {
                                        
                                            $.each(result,function(ind,elem){
                                                
                                            
                                        
                                                if (ind=="result"){
                                                    var cableid = elem; // returns the cable idn (ui)
                                                    $("a.saveOrder").attr("data-cableid",cableid);    
                                                    $("a.saveOrder").attr("data-orderid",orderid);    
                                                
                                                }
                                                
                                            });
                                            
                                            
                                        },error: function (xhr, ajaxOptions, thrownError) {
                                                
                                                console.log(xhr.status);
                                                console.log(thrownError);
                                        }       
                                    });
                                    
                            //   });
                        }
                });
            });
            
        }else{
            var opts = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": false,
                "positionClass": "toast-top-full-width",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "3000",        
                "timeOut": "800",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
              }
             if (document.getElementById("contacts-frame").getBoundingClientRect().left < 0 ) {
                $("#style-selector-mainframe,#upload-frame").animate({ left: '-'+w+'px', width: w+'px' }, 800);                
                $("#contacts-frame").animate({left: '0px',width:'297px'},800);
            }
            toastr.error("You must enter the Quantity, Company, Telephone & Email, Cable Type to save your RFQ.",opts);          
        
        }
        //}); // End of both data-connectorend values... for every single frame... this will be performed.
    }else{
      
      
        if ($("#contactForm").valid() && (Number($("#Qty").val())<=0)){
            $("#Qty").val("").focus();
            toastr.error("You must enter the Quantity to save your RFQ.",opts);  
        } else if ($("#contactForm").valid() && (Number($("#Length").val())<=0)){   
            toastr.error("You must enter the length to save your RFQ.",opts);
            $("#Length").focus();
        }else{
            toastr.error("You must enter the Company, Telephone & Email & Length to save your RFQ.",opts);     
            if (document.getElementById("contacts-frame").getBoundingClientRect().left < 0 ) {
                $("#upload-frame,#style-selector-mainframe").animate({ left: '-'+w+'px', width: w+'px' }, 800);   
                $("#contacts-frame").animate({left: '0px',width: w+'px'},800);
            }
        }
        
    }
});




$(document).on("blur",".part_no",function(event){
    if ($(this).val()!=""){
        $(this).addClass("bg-orange");
        $(this).find('.part_no_qty').first().focus();
    }
});
$(document).on("keypress",".part_no",function(event){
    if (event.which === 13 && $(this).val()!=""){   
        $(this).addClass("bg-orange");
        $(this).find('.part_no_qty').first().focus();
    }
});
$(document).on("blur",'.part_no_qty',function(event){
    $(this).addClass("bg-orange");     
    
});
$(document).on("keypress",'.part_no_qty',function(event){
      if (event.which === 13 && $(this).val()!=""){
          $(this).addClass("bg-orange");           
     }
});

var formcontrolid = $('.partslist .item .part_no').length;  

$(document).on("click","a.add-partno", function(event){
    event.preventDefault();  
    //Get the number of controls existing, if they exist.
    formcontrolid = $('.partslist .item .part_no').length;        
    var html = "<div class='row'><div class='col-8'><input class='part_no form-control' id='partno"+formcontrolid+"' placeholder='Part No.' type='text'/></div><div class='col-4'><input id='partno_qty" + formcontrolid + "' class='part_no_qty form-control' name='qty' placeholder='Qty' type='text'/></div></div>";
    $("#Part_No .partslist .item").prepend(html);
    
});

$(".cablelength").on("change",function(event){        
    $(this).closest('.selections').find(".cable-length").html($(this).val());    
});


// Form Validation
if($.isFunction($.fn.validate))
{
    $("form.validate").each(function(i, el)
    {
        var $this = $(el),
            opts = {               
                rules: {},
                messages: {},
                errorElement: 'span',
                errorClass: 'validate-has-error',
                onSubmit: false,
                highlight: function (element) {
                    $(element).closest('.form-group').addClass('validate-has-error');
                },
                unhighlight: function (element) {
                    $(element).closest('.form-group').removeClass('validate-has-error');
                },
                errorPlacement: function (error, element)
                {
                    if(element.closest('.has-switch').length)
                    {
                        error.insertAfter(element.closest('.has-switch'));
                    }
                    else
                    if(element.parent('.checkbox, .radio').length || element.parent('.input-group').length)
                    {
                        error.insertAfter(element.parent());
                    }
                    else
                    {
                        error.insertAfter(element);
                    }
                }
            },
            $fields = $this.find('[data-validate]');


        $fields.each(function(j, el2)
        {
            var $field = $(el2),
                name = $field.attr('name'),
                validate = attrDefault($field, 'validate', '').toString(),
                _validate = validate.split(',');

            for(var k in _validate)
            {
                var rule = _validate[k],
                    params,
                    message;

                if(typeof opts['rules'][name] == 'undefined')
                {
                    opts['rules'][name] = {};
                    opts['messages'][name] = {};
                }

                if($.inArray(rule, ['required', 'url', 'email', 'number', 'date', 'creditcard']) != -1)
                {
                    opts['rules'][name][rule] = true;
                   
                    message = $field.data('message-' + rule);

                    if(message)
                    {
                        opts['messages'][name][rule] = message;
                    }
                }
                else if($.inArray(rule, ['require_from_group'])!= -1){
                  
                  //  groupname = $field.data('group'); //rfg                
                  //  opts['rules'][name][rule] =  [1, groupname];
                 
                }
                // Parameter Value (#1 parameter)
                else
                if(params = rule.match(/(\w+)\[(.*?)\]/i))
                {
                    if($.inArray(params[1], ['min', 'max', 'minlength', 'maxlength', 'equalTo']) != -1)
                    {
                        opts['rules'][name][params[1]] = params[2];


                        message = $field.data('message-' + params[1]);

                        if(message)
                        {
                            opts['messages'][name][params[1]] = message;
                        }
                    }
                }
            }
        });

        $this.validate(opts);
      
        
    });
}


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


function animationHover(element, animation){
    element = $(element);
    element.hover(
        function() {
            element.addClass('animated ' + animation);        
        },
        function(){
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);         
        });
}
function animationClick(element, animation){
    element = $(element);
    element.click(
        function() {
            element.addClass('animated ' + animation);        
            //wait for animation to finish before removing classes
            window.setTimeout( function(){
                element.removeClass('animated ' + animation);
            }, 2000);         
  
        });
}

function saveImageUpload(filename,id){
    
    if (filename && id){
        $.ajax({
                type: 'post',
                url: 'api-cables/saveImageUrl.php',
                dataType: "json",
                data: {               
                    'filename': filename,
                    'id': id

                }, 
                success: function(result) { 
                    console.log(result);
                    
                },error: function (xhr, ajaxOptions, thrownError) {
                    
                        console.log(xhr.status);
                        console.log(thrownError);
                }  
        });   
    }  else{
        console.log("Something went wrong.");
    }
}

function makePDF() {

    var pdf = document.getElementById('recap');

    html2canvas(pdf, {
        onrendered: function(canvas) {

        //! MAKE YOUR PDF
        var pdf = new jsPDF('p', 'pt', 'letter');

        for (var i = 0; i <= pdf.clientHeight/980; i++) {
            //! This is all just html2canvas stuff
            var srcImg  = canvas;
            var sX      = 0;
            var sY      = 980*i; // start 980 pixels down for every new page
            var sWidth  = 900;
            var sHeight = 980;
            var dX      = 0;
            var dY      = 0;
            var dWidth  = 900;
            var dHeight = 980;

            window.onePageCanvas = document.createElement("canvas");
            onePageCanvas.setAttribute('width', 900);
            onePageCanvas.setAttribute('height', 980);
            var ctx = onePageCanvas.getContext('2d');
            // details on this usage of this function: 
            // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
            ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

            // document.body.appendChild(canvas);
            var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

            var width         = onePageCanvas.width;
            var height        = onePageCanvas.clientHeight;

            //! If we're on anything other than the first page,
            // add another page
            if (i > 0) {
                pdf.addPage(612, 791); //8.5" x 11" in pts (in*72)
            }
            //! now we declare that we're working on that page
            pdf.setPage(i+1);
            //! now we add content to that page!
            pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width*.62), (height*.62));

        }
        //! after the for loop is finished running, we save the pdf.
        pdf.save('test.pdf');
    }
  });
}


/*

document.addEventListener("DOMContentLoaded", function(event) {

    var myElements = document.querySelector('.hammer');
    var mc = new Hammer.Manager(myElements,{domEvents:true});    

    mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }) );    
    mc.add( new Hammer.Tap({ event: 'singletap' }) );    
    
    mc.get('doubletap').recognizeWith('singletap');
    mc.get('singletap').requireFailure('doubletap');

    mc.on("singletap", function(ev) {
        console.log("single");
    });

    mc.on("doubletap", function(ev) {
        //Set the Polarity
        console.log("double");
    });


});
*/
