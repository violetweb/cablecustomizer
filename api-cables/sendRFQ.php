<?php


header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 

 
// include database and object files
include_once 'config/database-cables.php';
include_once 'class/class-cablecustomizer.php';
include_once 'email/PHPMailer.php';

// instantiate database and product object

$database = new DatabaseCables();
$db = $database->getConnection();
$cc = new CableCustomizer($db);


$id = $_POST["id"];
$html = $_POST["html"];
$email = $_POST["email"];


function get_include_contents($filename, $variablesToMakeLocal) {
    extract($variablesToMakeLocal);
    if (is_file($filename)) {
        ob_start();
        include $filename;
        return ob_get_clean();
    }
    return false;
}
 

if (filter_var($email,FILTER_VALIDATE_EMAIL)) {
	
			$mail = new PHPMailer;

			//From email address and name
			$mail->From = 'acemarketing@acetronic.com';
			$mail->FromName = 'AceTronic Cables RFQ';

			$email =  $email  ;//send to our sales department
			$name = "AceTronic RFQ";			
			$mail->addAddress($email, $name);
			$mail->addCC('sales@acetronic.com');
			//Send HTML or Plain Text email
			$mail->isHTML(true);

			$mail->Subject = "Request for Cable Quotation";
			$data = array("id"=>$id,"html"=>$html);
			$mail->Body = get_include_contents('email/email-template-request-received.php', $data);
			
			$mail->AltBody = "Thanks for your Request for Quote; someone will be in touch shortly.";

			if(!$mail->send()) {
    			 echo json_encode(
        			array("success" => "mail-failure")
    			);
			} else {
    			echo json_encode(
        		array("success" => "true"));
			}


} else{
    
    echo json_encode(
        array("success" => "failed")
    );
}

