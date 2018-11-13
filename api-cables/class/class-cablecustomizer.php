<?php

class CableCustomizer {
 
    // database connection and table name
 
    private $db;
    
 
    function __construct($db)
    {
      $this->db = $db;
    }
 

    public function grabRFQ($id){
      


        try
            {
            $stmt = $this->db->prepare("SELECT Count(*) from Cable_Options where Order_Info_ID=:id");
            $intid = (int)$id;       
            $stmt->execute(array(':id'=>$id));                          
            if($stmt->rowCount() > 2){          
                $stmt2 = $this->db->prepare("SELECT ID, Connector_ID, End_Type,No_Zones,Gender,Type_Connector,No_Pins,Amps,Hood_Entry,Clamp_Style,Cable_Length,Connections_Map from Cable_Options WHERE Order_Info_ID=:id");          
            }else {
                $stmt2 = $this->db->prepare("SELECT ID, Connector_ID, End_Type,No_Zones,Gender,Type_Connector,No_Pins,Amps,Hood_Entry,Clamp_Style,Connections_Map from Cable_Options WHERE Order_Info_ID=:id");
            }        
           $stmt2->execute(array(':id'=>$id));    
            if ($stmt2->execute()){
                echo json_encode($stmt2->fetchAll(PDO::FETCH_ASSOC));              
            } 
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }
    public function grabCableOptions($id){

        try
            {
            
            //First get the count of how many Cable_Options for the id, then you can
            //switch up which columns are included
            $stmt = $this->db->prepare("SELECT * FROM Cable_Options WHERE Order_Info_ID=:id");
            $intid = (int)$id;       
            $stmt->execute(array(':id'=>$id));                 
            if ($stmt->execute()){
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));              
            } 
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }

    public function setSubmitted($id){
       
       
        $stmt = $this->db->prepare("UPDATE Order_Info SET `submitted`='1' WHERE ID=:id");                    
        $stmt->bindparam(":id", $id);         
        $stmt->execute();
        if($stmt->rowCount() > 0){           
            return "1";
          
        }else{
           return "0";
        }

        
    }
    
    public function grabOrderInfo($id){
 
        try
            {
            
            $stmt = $this->db->prepare("SELECT ID, Order_Date, Company, Contact, Phone, Email, Ext as ext, Details as info, Sales_Person, Length, Qty, Cable_Type, Cable_Style_Type,RFQ_Type from Order_Info WHERE Order_Info.ID=:id and submitted=0");
            $intid = (int)$id;       
            $stmt->execute(array(':id'=>$id));    
            if ($stmt->execute()){
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));              
            } 
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }

      
    public function grabPartNos($orderid){
 
        try
            {
            
    
            $stmt = $this->db->prepare("SELECT ID, Part_No, Part_Qty from Parts_Order WHERE Order_Info_ID=:orderid");
            $intid = (int)$orderid;       
            $stmt->execute(array(':orderid'=>$orderid));    
            if ($stmt->execute()){
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));              
            } 
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }


    public function grabImageUploads($id){
        try
        {
        

        $stmt = $this->db->prepare("SELECT Image_Url from ImageUploads WHERE Order_Info_ID=:id");
        $intid = (int)$id;       
        $stmt->execute(array(':id'=>$id));    
        if ($stmt->execute()){
            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));              
        } 
    }   catch(PDOException $e) {
            echo $e->getMessage();
    }    

    }
    


    //Looks up the Order_Info_id in the Cable Options table...
    public function lookupOrderID($id,$connectorid){
  
        try
            {
            
            $stmt = $this->db->prepare("SELECT Order_Info_ID, Connector_ID FROM Cable_Options WHERE Order_Info_ID=:order_info_id and Connector_ID=:connectorid");
            $stmt->execute(array(':order_info_id'=>$id,':connectorid'=>$connectorid));            
            $row=$stmt->fetch(PDO::FETCH_ASSOC);        
            if($stmt->rowCount() > 0)            {
                return true;
            }else{
                return false;
            }
      
    
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }
 
    
    public function lookupPO($po){
      


        try
            {
            
    
            $stmt = $this->db->prepare("SELECT Purchase_Order_No FROM Order_Info WHERE Purchase_Order_No=:po");
            $stmt->execute(array(':po'=>$po));
            $row=$stmt->fetch(PDO::FETCH_ASSOC);        
            if($stmt->rowCount() > 0)            {
                return true;
            }else{
                return false;
            }
    
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }

    public function lookupID($id){
      


        try
            {
            
    
            $stmt = $this->db->prepare("SELECT ID FROM Order_Info WHERE ID=:id");
            $stmt->execute(array(':id'=>$id));
            $row=$stmt->fetch(PDO::FETCH_ASSOC);        
            if($stmt->rowCount() > 0)            {
                return true;
            }else{
                return false;
            }
    
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }


    public function lookupPartID($id){
 
        try
            {              
                $stmt = $this->db->prepare("SELECT ID FROM Parts_Order WHERE ID=:id");
                $stmt->execute(array(':id'=>$id));
                $row=$stmt->fetch(PDO::FETCH_ASSOC);        
                if($stmt->rowCount() > 0)            {
                    return true;
                }else{
                    return false;
                }
    
        }   catch(PDOException $e) {
                echo $e->getMessage();
        }    
    
            
    }


   
    public function saveOrderInfo($company,$contact,$phone,$ext,$email, $notes,$sales,$orderid,$length,$qty,$cabletype,$cablestyletype,$rfqtype){        
        
        try  {
         
            if ($orderid=="" || $orderid==null) {            
         
                //If the po does not exist, create a new record... otherwise, if it exists, then update.
                $stmt = $this->db->prepare("INSERT INTO Order_Info(Company,Contact,Phone, Ext,Email,Sales_Person,Details,Length,Qty,Cable_Type,Cable_Style_Type,RFQ_Type) VALUES(:company, :contact,:phone,:ext,:email,:sales,:notes,:length,:qty,:cabletype,:cablestyletype,:rfqtype)");
         
                //$typeint = (int)$type;
                $stmt->bindparam(":company", $company);           
                $stmt->bindparam(":contact", $contact);         
                $stmt->bindparam(":phone", $phone);         
                $stmt->bindparam(":ext", $ext);  
                $stmt->bindparam(":email", $email);                                                              
                $stmt->bindparam(":sales",$sales);  
                $stmt->bindparam(":length",$length);  
                $stmt->bindparam(":qty",$qty);        
                $stmt->bindparam(":cabletype",$cabletype);        
                $stmt->bindparam(":cablestyletype",$cablestyletype); 
                $stmt->bindparam(":rfqtype",$rfqtype);        
                $stmt->bindParam(':notes', $notes, PDO::PARAM_STR,256);          
                if ($stmt->execute()) {
                    return $this->db->lastInsertId();                    
                } else {
                    return "0";            
                }
            }else{  
              if (intval($orderid)>0){
                    
                    $stmt = $this->db->prepare("UPDATE Order_Info SET `Company`=:company,`Contact`=:contact,`Phone`=:phone,`Ext`=:ext,`Email`=:email,`Details`=:notes, `Sales_Person`=:sales, `Length`=:length, `Qty`=:qty, `Cable_Type`=:cabletype, `Cable_Style_Type`=:cablestyletype WHERE `ID`=:id;");
                    
                    $idint = (int)$orderid;
                    $stmt->bindparam(":company", $company);           
                    $stmt->bindparam(":contact", $contact);         
                    $stmt->bindparam(":phone", $phone);         
                    $stmt->bindparam(":ext", $ext);     
                    $stmt->bindparam(":email", $email);          
                    $stmt->bindparam(":id", $orderid);  
                    $stmt->bindparam(":length", $length);      
                    $stmt->bindparam(":qty",$qty);      
                    $stmt->bindparam(":cabletype",$cabletype);        
                    $stmt->bindparam(":cablestyletype",$cablestyletype);                        
                    $stmt->bindparam(":notes", $notes, PDO::PARAM_STR,256);                        
                    $stmt->bindparam(":sales",$sales);                    
                    $stmt->execute();
                    if($stmt->rowCount() > 0){
                       
                            return $orderid;
                      
                    }else{
                       return "0";
                    }
                    
                }else{
                    return "0";
                }
             
                
            }
           
        }   catch(PDOException $e)       {
            echo $e->getMessage();
        }    
      
        
    }
                                    
    public function saveCableOptions($po,$endd,$cable_type, $cable_length,$amps,$gender,$hood_entry,$no_pins,$no_zones,$type_connector,$connector_id,$order_info_id,$cableid,$imageurl,$clamp_style,$connections_map){

     //If the po does not exist, create a new record... otherwise, if it exists, then update.

        //Evaluate two pieces of info to decide if its an <edit class="">
        //if there is connector_id exists...
        
        if (!$this->lookupOrderID($order_info_id,$connector_id)){
           
            $stmt = $this->db->prepare("INSERT INTO Cable_Options(`End_Type`, `No_Zones`, `Cable_Type`, `Gender`, `No_Pins`, `Amps`, `Cable_Length`, `Hood_Entry`, `Type_Connector`,`Purchase_Order_No`, `Connector_ID`, `Order_Info_ID`,`Image_Upload_Url`,`Clamp_Style`,`Connections_Map`) 
                VALUES(:endtype, :nozones, :cable_type, :gender,:nopins, :amps, :cablelength, :hoodentry,:typeconnector, :po,:connectorid,:orderinfoid,:imageurl,:clampstyle,:connectionsmap)");
     
            $stmt->bindparam(":po", $po);                       
            $stmt->bindparam(":endtype",$endd);       
            $stmt->bindparam(":cable_type",$cable_type);     
            $stmt->bindparam(":cablelength", $cable_length);         
            $stmt->bindparam(":amps", $amps);         
            $stmt->bindparam(":gender",$gender);
            $stmt->bindparam(":hoodentry", $hood_entry);         
            $stmt->bindparam(":nopins", $no_pins);         
            $stmt->bindparam(":nozones",$no_zones);      
            $stmt->bindparam(":typeconnector",$type_connector);      
            $stmt->bindparam(":connectorid",$connector_id);
            $stmt->bindparam(":orderinfoid",$order_info_id);
            $stmt->bindparam(":imageurl",$imageurl);
            $stmt->bindparam(":clampstyle",$clamp_style);
            $stmt->bindparam(":connectionsmap",$connections_map);

            if ($stmt->execute()) {
                return $this->db->lastInsertId();                    
            } else {
                return "0";            
            }

       
        }else{
            
            if ($order_info_id != "" && $connector_id !=""){
            
                
                $sql = "UPDATE Cable_Options SET `Purchase_Order_No`=:po,`End_Type`=:endtype,`Cable_Type`=:cable_type,`Cable_Length`=:cablelength,`Amps`=:amps,`Gender`=:gender,`Hood_Entry`=:hoodentry, `No_Pins`=:nopins, `No_Zones`=:nozones, `Type_Connector`=:typeconnector, `Image_Upload_Url`=:imageurl,`Clamp_Style`=:clampstyle, `Connections_Map`=:connectionsmap WHERE `Order_Info_ID`=:orderinfoid and `Connector_ID`=:connectorid";
                $stmt = $this->db->prepare($sql);      
                
                $stmt->bindparam(":po", $po);           
                $stmt->bindparam(":endtype", $endd);         
                $stmt->bindparam(":cable_type",$cable_type);        
                $stmt->bindparam(":cablelength", $cable_length);   
                $stmt->bindparam(":amps",$amps);      
                $stmt->bindparam(":gender", $gender);         
                $stmt->bindparam(":hoodentry", $hood_entry);         
                $stmt->bindparam(":nopins",$no_pins);
                $stmt->bindparam(":nozones",$no_zones);              
                $stmt->bindparam(":typeconnector",$type_connector);      
                $stmt->bindparam(":connectorid",$connector_id); 
                $stmt->bindparam(":orderinfoid",$order_info_id);  
                $stmt->bindparam(":imageurl",$imageurl);
                $stmt->bindparam(":clampstyle",$clamp_style);
                $stmt->bindparam(":connectionsmap",$connections_map);
                                
                $stmt->execute();
              
                if($stmt->rowCount() > 0){
                     //lookup the order id of this updated record please and return it.
                     try
                     {                            
              
                        $stmt = $this->db->prepare("SELECT ID FROM Cable_Options WHERE `Order_Info_ID`=:orderinfoid and `Connector_ID`=:connectorid");         
                        $stmt->execute(array(':orderinfoid'=>$order_info_id,':connectorid'=>$connector_id));
                        $userRow=$stmt->fetchColumn();        
                        if($stmt->rowCount() > 0)
                        {
                          return $userRow;
                        }else{
                          return false;
                        }
              
                         }   catch(PDOException $e)       {
                         echo $e->getMessage();
                     }    
                }else{
                   return "0";
                }
            }else{
                return "0";
            }
        }
    }

    public function saveImageUrl($id, $image_url){
        $sql = "INSERT INTO ImageUploads SET `Image_Url`=:imageurl, `Order_Info_ID`=:id";
        $stmt = $this->db->prepare($sql);              
        $stmt->bindparam(":imageurl", $image_url);           
        $stmt->bindparam(":id", $id);
        $stmt->execute();              
        if($stmt->rowCount() > 0){
            return "inserted";
         
        }else{
            return "0";
        }
    }


    
    public function saveImageUrlxxxx($cable_id,$image_url,$id){

           
                   
        $sql = "UPDATE Cable_Options SET `Image_Url`=:imageurl WHERE `ID`=:id";
        $stmt = $this->db->prepare($sql);      
        
        $stmt->bindparam(":imageurl", $image_url);           
        $stmt->bindparam(":id", $id);
        $stmt->execute();              
        if($stmt->rowCount() > 0){
            return "updated";
         
        }else{
            return "0";
        }
    }         
    

    public function savePartNos($id,$partid,$orderid,$partno,$qty){
        
        if (!$this->lookupPartID($id)){
              
               $stmt = $this->db->prepare("INSERT INTO Parts_Order(`Part_No`, `Part_Qty`,`Order_Info_ID`) VALUES (:partno, :qty, :orderid)");
        
               $stmt->bindparam(":partno", $partno);                       
               $stmt->bindparam(":qty",$qty);  
               $stmt->bindparam(":orderid",$orderid);  

               if ($stmt->execute()) {
                   return $this->db->lastInsertId();                    
               } else {
                   return "0";            
               }          
        }else{
            
            if ($id){    
                $sql = "UPDATE Parts_Order SET `Part_No`=:partno,`Part_Qty`=:qty,`Order_Info_ID`=:orderid WHERE ID=:id";
                $stmt = $this->db->prepare($sql);   
                $idint = (int)$id;                      
                $stmt->bindparam(":partno", $partno);           
                $stmt->bindparam(":qty", $qty);
                $stmt->bindparam(":orderid",$orderid);
                $stmt->bindparam(":id",$idint);
                $stmt->execute();                 
            }else{
                return "0";
            }
        }
        
        
    }

    
    



}