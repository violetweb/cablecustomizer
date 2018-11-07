<?php


$ds = DIRECTORY_SEPARATOR;  //1
 
$storeFolder = 'uploads';   //2

//Create a subfolder for saving to a "purchase order idn".
$poFolder = $_POST["PO"];



//CHECK THE PATH / make if necessary
$checkpath =  dirname( __FILE__ ) . $ds . $storeFolder . $ds . $poFolder;
if (!file_exists($checkpath)) {
    mkdir($checkpath, 0777, true);
    
}
 
if (file_exists($checkpath)){
    if (!empty($_FILES)) {
     
        $tempFile = $_FILES['file']['tmp_name'];          //3                   
        $targetPath = $checkpath . $ds; //4     
        $targetFile =  $targetPath. $_FILES['file']['name'];  //5 
        move_uploaded_file($tempFile,$targetFile); //6  
        echo json_encode(array("success"=>"true"));
     }else{
        echo json_encode(array("success"=>"false"));
    }
}else{
    echo json_encode(array("success"=>"false"));
}


   

header('Content-Type: application/json');



#$errors = mt_rand(0,100)%2==0; // Random response (Demo Purpose)
$errors = false;

$resp = array(
);

# Normal Response Code
if(function_exists('http_response_code'))
  http_response_code(200);

# On Error
if($errors)
{
  if(function_exists('http_response_code'))
    http_response_code(400);

  $resp['error'] = "Couldn't upload file, reason: ~";
}

//echo json_encode($resp);
