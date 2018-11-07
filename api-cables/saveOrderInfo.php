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



(isset($_POST["company"])) ? $company = $_POST["company"] : $company = '';
(isset($_POST["contact"])) ? $contact = $_POST["contact"] : $contact = '';
(isset($_POST["phone"])) ? $phone = $_POST["phone"] : $phone = '';
(isset($_POST["ext"])) ? $ext = $_POST["ext"] : $ext = '';
(isset($_POST["email"])) ? $email = $_POST["email"] : $email = '';
(isset($_POST["notes"])) ? $notes = $_POST["notes"] : $notes = '';
(isset($_POST["sales"])) ? $sales = $_POST["sales"] : $sales = '';
(isset($_POST["id"])) ? $id = $_POST["id"] : $id = '';
(isset($_POST["length"])) ? $length = $_POST["length"] : $length = '';
(isset($_POST["qty"])) ? $qty = $_POST["qty"] : $qty = '';
(isset($_POST["cabletype"])) ? $cabletype = $_POST["cabletype"] : $cabletype = '';
(isset($_POST["cablestyletype"])) ? $cablestyletype = $_POST["cablestyletype"] : $cablestyletype = '';
(isset($_POST["rfqtype"])) ? $rfqtype = $_POST["rfqtype"] : $rfqtype = '';

// instantiate database and product object

$database = new DatabaseCables();
$db = $database->getConnection();
$cc = new CableCustomizer($db);

$result = $cc->saveOrderInfo($company,$contact,$phone,$ext,$email, $notes,$sales,$id,$length,$qty,$cabletype,$cablestyletype,$rfqtype);


if ($result!="0"){
    echo json_encode(array("orderid"=>$result)); // method returns a number, or zero.
}else{
    echo json_encode(array("orderid"=>"fail"));
}

//echo json_encode(array("whatever"=>"whatever"));
?>