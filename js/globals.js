
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

var initialleft = document.getElementById("style-selector-mainframe").getBoundingClientRect().left;  
var w = $("#style-selector-mainframe").width();
var l = $("#style-selector-mainframe").offset().left;
var r = $("#style-selector-mold").offset().left;

$("#style-selector-mainframe div.toggle").css("left",w +'px');
$("#style-selector-mold div.toggle").css("right",w +'px');
$("#contacts-frame,#upload-frame").animate({left: '-'+w+'px',width: w+'px'},800);

if ($(window).width()<767) {
    $("#style-selector-mold").animate({ left: r+w+'px', width: w+'px' }, 800);             
}

$(".latch-style span.tab a.top").addClass("selected"); // Default Style is TOP -- ON LOAD
$(".hood-entry span.tab a.single").addClass("selected");



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
            '<span></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"></span>'+
        '</div>'+
        '<div class="col">'+
            '<span></span>'+
        '</div>'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_right"></span>'+
        '</div>'+
    '</div>';

var threeDotRow = ''+
'<div class="row align-items-center align-self-center no-gutters">'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_left"></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"></span>'+
        '</div>'+
        '<div class="col">'+
            '<span class="dot"></span>'+
        '</div>'+
        '<div class="col col-md-3 text-center">'+
            '<span class="line_no_right"></span>'+
        '</div>'+
    '</div>';

if (RFQID && RFQType=="customizer"){

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
                    if (idn === "#Cable_Type") {                              
                        $("#"+val.toLowerCase()).addClass("selected");
                    }else if (idn === "#Cable_Style_Type"){
                        $(".cable-type-expand").removeClass("d-none");
                        $("#" + val).addClass("selected");
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
                        $.each(a,function(i,v){
                            var div = "div[data-cend='" + endtype + "'] .dot a[data-value='" + v + "']"; 

                            $(div).parent().addClass("set");                                   
                            $("div[data-cend='" + endtype + "'] .dot a[data-value='" + v + "']").addClass("border-rounded").css('border', "3px solid rgb(51, 51, 51)");
                        });                                
                    }
                        
                });
            });

        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });        


}else if (RFQType=="parts"){

   
    $("#Parts_Container, .navbar-nav .navbar-nav .customizer").removeClass("d-none");
    $("#branch_container, .backward").addClass("d-none");
    
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
                  var row = '<div class="row"><div class="col-8"><input type="hidden" name="partid' +ind+'" value="'+result[ind].ID+'"/><input class="part_no form-control bg-orange" id="partno'+ind+'" name="partno" placeholder="Part No." value="'+result[ind].Part_No+'" type="text"></div><div class="col-4"><input class="part_no_qty form-control bg-orange" id="partno_qty'+ind+'" name="qty" placeholder="Quantity" value="'+result[ind].Part_Qty+'" type="text"></div></div>';
                  $(".item").prepend(row);
            });
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });

   
    
}

$("#branch_container button.forward").on("click",function(event){
    //Evaluate the answer... and branch off based off of this answer.
    event.preventDefault();
    var answer = $("#branch_container input[name='answer']:checked").val();
    if (answer){
        ActiveContainer = answer;
        $(".container").addClass("d-none");
        $("#"+answer).removeClass("d-none");        
        $(".navbar-nav li").attr("data-menufor") == answer ? $(".navbar-nav li").removeClass("d-none") : '';           
                
    }else{
        toastr.error("Please make a selection to continue.");
    }
    
 });

$("#Parts_Container .backward").on("click",function(event){
    event.preventDefault();
    var goto = $(this).attr("data-step");
    if (goto){
        $(".container").addClass("d-none");
        $("#"+goto).removeClass("d-none");
        ActiveContainer = goto;
    }    
});

$("#Parts_Container button.submit").on("click",function(event){
    
    event.preventDefault();

    var id = (RFQID!="") ? RFQID : '';
     
    var deferred = $.ajax({
        type: 'post',
        url: 'api-cables/saveOrderInfo.php',
        dataType: "json",
        data: {    
            'company': $("#Parts_Container").find("#Company").val(),           
            'contact': $("#Parts_Container").find("#Contact").val(),
            'email': $("#Parts_Container").find("#Email").val(),
            'phone': $("#Parts_Container").find("#Phone").val(),
            'ext': $("#Parts_Container").find("#ext").val(),
            'notes': $("#Parts_Container").find("#info").val(),
            'rfqtype': 'parts',
            'id': id
        }, 
        success: function(result) { 
            RFQID = result.orderid;
            $(".ID").val(RFQID);
            localStorage.setItem("RFQID",RFQID); // Save the ID to the user's local storage... only clear out when the "submit!"                                
            localStorage.setItem("RFQID_Type","parts");
            return result;
            
            
        },error: function (xhr, ajaxOptions, thrownError) {
            
                console.log(xhr.status);
                console.log(thrownError);
        }  
    });
         
    var len = $("#Parts_Container").find(".part_no").length;        
    
   
    deferred.then(function(result){            
          RFQID = result.orderid;

          for (var i=0; i<len; i++){
 
                
               //Find out if the partid exists... and do something different if it does.
                var partid = $("#Parts_no").find("#partid"+(i+1)).val();
                var partno = $("#Part_No").find("#partno"+(i+1)).val();
                var partno_qty = $("#Part_No").find("#partno_qty"+(i+1)).val();

                var result = $.ajax({
                    type: 'post',
                    url: 'api-cables/savePartNos.php',
                    dataType: "json",
                    data: {    
                        'qty': partno_qty,           
                        'partno': partno,
                        'orderid': RFQID,
                        'id' : partid
                    }, 
                    success: function(result) {                 
                        console.log("Data has been saved " + result);
                        
                    },error: function (xhr, ajaxOptions, thrownError) {
                        
                            console.log(xhr.status);
                            console.log(thrownError);
                    }  
                });
            }
        }).then(function(result){            
           
            $("#Parts_Container").addClass("d-none");

           var recap = $.get("recapParts.html",function(result){
                
           }).then(function(result){

               
             

                if (RFQID!="" && RFQID>0) {                
                    $("#customizer").before(result);                         
            
                   
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
                                    $("#recapParts,.btn-send,.btn-print").show();
                                    $("#customizer,a.sendOrder, div.cable-type").hide();                                    
                                    $(".navbar-length, .navbar-qty, .navbar-contact .contact-toggle,.navbar-contact .saveOrder").css({visibility: "hidden"});
                                    $("#recap-table tbody").empty();
                                    $.each(data,function(ind, val){
                                        var tr = $("<tr>");
                                            $.each(val,function(i,v)   {
                                                var td = (v!='') ? td = "<td>" : "<td class='alert alert-danger'>";                   
                                                $(tr).append(td + v + "</td>");
                
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
                                            
                                            $("."+i).html(v);
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
                                "showDuration": "3000",        
                                "timeOut": "800",
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
    "timeOut": 13000,
    "preventDuplicates": true
    
    }




}); // END OF DOCUMENT. READY.