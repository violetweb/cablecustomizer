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

(isset($_POST["orderid"])) ? $orderid = $_POST["orderid"] : $orderid = '';
(isset($_POST["partid"])) ? $partid = $_POST["partid"] : $partid = '';
(isset($_POST["id"])) ? $id = $_POST["id"] : $id = '';
(isset($_POST["partno"])) ? $partno = $_POST["partno"] : $partno = '';
(isset($_POST["qty"])) ? $qty = $_POST["qty"] : $qty = '';


$database = new DatabaseCables();
$db = $database->getConnection();
$cc = new CableCustomizer($db);

if ($partno != "" && $qty != "" && $orderid != ""){
    
    $result = $cc->savePartNos($id,$partid,$orderid,$partno,$qty);   
    if ($result!="0"){
        echo json_encode(array("result"=>$result));
    }else{
        echo json_encode(array("result"=>"fail"));
    }
    
}else{
    echo json_encode(array("result"=>"The Part No or Qty is empty; we cannot update this now."));
}

//echo json_encode(array("result"=>"fail"));

?>