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


(isset($_POST["id"])) ? $id = $_POST["id"] : $id = '';


$database = new DatabaseCables();
$db = $database->getConnection();
$cc = new CableCustomizer($db);

echo $cc->grabPartNos($id);



?>