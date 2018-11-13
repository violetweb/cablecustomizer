<?php


// show error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

 
// include database and object files
include_once 'config/database-cables.php';
include_once 'class/class-cablecustomizer.php';



(isset($_POST["po"])) ? $po = $_POST["po"] : $po = '';
(isset($_POST["end"])) ? $end = $_POST["end"] : $end = '';
(isset($_POST["cable_type"])) ? $cable_type = $_POST["cable_type"] : $cable_type = '';
(isset($_POST["cable_length"])) ? $cable_length = $_POST["cable_length"] : $cable_length = '';
(isset($_POST["amps"])) ? $amps = $_POST["amps"] : $amps = '';
(isset($_POST["gender"])) ? $gender = $_POST["gender"] : $gender = '';
(isset($_POST["hood_entry"])) ? $hood_entry = $_POST["hood_entry"] : $hood_entry = '';
(isset($_POST["no_pins"])) ? $no_pins = $_POST["no_pins"] : $no_pins = '';
(isset($_POST["no_zones"])) ? $no_zones = $_POST["no_zones"] : $no_zones = '';
(isset($_POST["connector_id"])) ? $connector_id = $_POST["connector_id"] : $connector_id = '';
(isset($_POST["order_info_id"])) ? $order_info_id = $_POST["order_info_id"] : $order_info_id = '';
(isset($_POST["type_connector"])) ? $type_connector = $_POST["type_connector"] : $type_connector = '';
(isset($_POST["cable_id"])) ? $cableid = $_POST["cable_id"] : $cableid = '';
(isset($_POST["imageurl"])) ? $imageurl = $_POST["imageurl"] : $imageurl = '';
(isset($_POST["clamp_style"])) ? $clamp_style = $_POST["clamp_style"] : $clamp_style = '';
(isset($_POST["connections_map"])) ? $connections_map = $_POST["connections_map"] : $connections_map = '';

// instantiate database and product object

$database = new DatabaseCables();
$db = $database->getConnection();
$cc = new CableCustomizer($db);

if ($order_info_id!=""){

    $result = $cc->saveCableOptions($po,$end,$cable_type,$cable_length,$amps,$gender,$hood_entry,$no_pins,$no_zones,$type_connector, $connector_id,$order_info_id,$cableid,$imageurl,$clamp_style,$connections_map);
    
    if ($result!="0"){
        echo json_encode(array("result"=>$result));
    }else{
        echo json_encode(array("result"=>"fail"));
    }
    
    

}else{
    echo json_encode(array("result"=>"The Order ID is empty; we cannot update this now."));
}

//echo json_encode(array("result"=>"fail"));

?>