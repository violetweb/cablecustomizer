<?php


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 

 
// include database and object files
include_once 'config/database-cables.php';
include_once 'class/class-cablecustomizer.php';


// instantiate database and product object

$database = new DatabaseCables();
$db = $database->getConnection();
$cc = new CableCustomizer($db);


$id = $_POST["id"];

$cc->viewRFQ($id);
?>