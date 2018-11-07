<?php

session_start();

class DatabaseCables{
 
    // specify your own database credentials
    private $host = "localhost";
    private $db_name = "cables";
    private $username = "acetroni_cablusr";
    private $password = 'zYM8$WZTR]5B';
    //private $db_name = "CABLES";
    //private $username = "root";
    //private $password = "daroom88";


    
    
    public $conn;
 



    // get the database connection
    public function getConnection(){
 
        $this->conn = null;
 
        try{
            $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password,array(PDO::MYSQL_ATTR_FOUND_ROWS =>true));
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);                
            $this->conn->exec("set names utf8");
        }catch(PDOException $exception){
            echo "Connection error: " . $exception->getMessage();
        }
 
        return $this->conn;
    }
}

?>