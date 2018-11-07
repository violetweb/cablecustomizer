/*************************************************************************************
******    Written by:     Valerie Trotter 
*         Date:           04/20/2018
*         Title:          Cable Customization
*                         ============================
*         Description:    Interface for allowing the dynamic building of a Cable.
*                           Allows customers to build a cable online on the website, 
*                        
*         ============================================================
*/


;(function($, window, document, undefined) {

    var cable = {

        init : function(options) {

            //MUST HAVE A div on the page entitled, div#wrapper in order for this plugin to work 
             this.defaults = $.extend(true,$.fn.cableBuilder.defaults, options);     
                  //this.opts = $.extend(true, {}, defaults, options); 
                  $this = $(this);   
                  if($this.is("div#wrapper")) {
                      cableBuild($this, this.defaults);                      
                      
                  }
            

        },
       
        setContacts: function(layerdata){
           // $.fn.cableBuilder.defaults.layerlist.push(layerdata.layerlist);    
           // cableBuild($(this), $.fn.bannerBuilder.defaults);           
        },
        setAmperage: function(layerindex){
            
        },
        setType: function(display){
            
        },
        setHood: function(){
            
        },
        setPins: function(){
            var pins = $("#pins .owl-item.active span").text();
            alert(pins);
        },
        setClamp: function(){
            //code here.
        },
        resetAll: function(){
            $.fn.cableBuilder.defaults.itemlist = [
              {
                  no_contacts: "2",
                  amperage: "10A",
                  type: "male",
                  hood: "top",
                  clamp: "single",
                  no_zones: "1",
                  cable: "thermocouple",
                  length: "1"
                  
              }

            ];
            cableBuild($(this), $.fn.cableBuilder.defaults);
        }
    };

    //Build the cable
      $.fn.cableBuilder = function(methodOrOptions) {

        if (cable[methodOrOptions]) {
            return cable[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return cable.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.cableBuilder!' );
        }        

    };
   
      $.fn.cableBuilder.defaults = {
            no_contacts: "2",
            amperage: "10A",
            type: "male",
            hood: "top",
            clamp: "single",
            no_zones: "1",
            cable: "thermocouple",
            length: "1"            
        
      };

   
  

    
    function buildCaption(node,animation,easing,datax,datay,speed,start,content,classname,color,fontstyle){
         $(node).find("li").append("<div class='tp-caption "+animation+" start "+classname+"' data-x='"+datax+"' data-y='"+datay+"' data-speed='"+speed+"' data-start='"+start+"' data-easing='"+easing+"'><div style='color:"+color+"!important;' class='"+fontstyle+"'><div>"+content+"</div></div></div>");                                                             
    }

  //captions are two dimensional array (will be...)
   function cableBuild(node,opts){        
        //do something in here
        // Set the 
        node.append("this is a test");
        
   }
      
   
   
  
    

})(jQuery);

    


function makeMultiArray(first, second) {
    var myarray = new Array(first)
    for (i = 0; i < first; i++) {
        myarray[i] = new Array(second)
    }
    return myarray;
}

function fillDefaults(callback){

  
   

    var contacts = ["5PIN-HA","6PIN-HBE","10PIN-HA","10PIN-HBE","16PIN-HA","16PIN-HBE","24PIN-HBE","25PIN-HD","OTHER"];
    var amperage = ["10A","15A","16A","35A"];
    var type = ["male","female"];
    var hood = ["entry-type-top","entry-type-side"];
   // var size = ["HA","HBE", "HBS"];
   // var pins = ["4","6","10","25","40","48","64","72"];
    var clamp = ["single-lever","double-lever"];
    //var termination_type = ["screw","cage clamp"];
    var wire_gauge = ["0"]; //on the excel spreadsheet 
    var cable_type = ["thermocouple","power"];
    var cable_zones = ["1","3","5","8","12","32"];
    var cable_length = 0; // excel says ["25","30", "33","50"] default to zero but must be filled in.?? Question


    var $contacts = $("#contacts");
    var $amps = $("#amps");
    var $hood = $("#hoods");
    var $type = $("#type");
    //var $size = $("#size");
    //var $pins = $("#pins");
    var $clamp = $("#clamp");
    //var $term_type = $("#termination_type");
    var $gauge = $("#gauge");
    var $cable_type = $("#cable_type");
    var $cable_zones = $("#cable_zones");
    var $cable_length = $("#cable_length");
    
   
    type.forEach(function(item,index){$type.append("<div class='itemx text-center'><span class='value'>"+item.toUpperCase()+"</span><img class='d-inline zoooom img-thumbnail' src='/cable-images/" +item+".png'/></div>");});
    hood.forEach(function(item,index){$hood.append("<div class='itemx'><span class='value'>"+item.toUpperCase()+"</span><img class='d-inline zoooom img-thumbnail' src='/cable-images/" +item+".jpg'/></div>"); });
    contacts.forEach(function(item,index){$contacts.append("<div class='itemx'><span class='value'>"+item+"</span><img class='d-inline zoooom img-thumbnail' src='/cable-images/" +item+".png'/><img class='d-inline img-thumbnail' src='/cable-images/"+item+"-IMG.png' /></div>"); });
    //size.forEach(function(item,index){$size.append("<div class='item'><span class='value'>"+item+"</span></div>"); });
   // pins.forEach(function(item,index){$pins.append("<span class='item'>"+item+"</span>"); });
    clamp.forEach(function(item,index){$clamp.append("<div class='itemx text-center'><span class='value'>"+item.toUpperCase()+"</span><img class='d-inline img-thumbnail' src='/cable-images/" +item+".jpg'/></div>"); });
    //termination_type.forEach(function(item,index){$term_type.append("<span class='itemx'>"+item+"</span>"); });
    wire_gauge.forEach(function(item,index){$gauge.append("<div class='span'>"+item.toUpperCase()+"</span>"); });
    cable_type.forEach(function(item,index){$cable_type.append("<div class='span'>"+item.toUpperCase()+"</span>"); });
    cable_zones.forEach(function(item,index){$cable_zones.append("<div class='span'>"+item.toUpperCase()+"</span>"); });
   // cable_length.forEach(function(item,index){$cable_length.append("<div class='item'>"+item+"</div>"); });

    if (typeof(callback) == 'function') {
        callback(second);
    }


}         

function second(){
   
   
 


}