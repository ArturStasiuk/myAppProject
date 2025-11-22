<?php 
class Config {
    //  konfiguracja dla lenowo
    const DB_HOST = 'localhost';
    const DB_NAME = 'project_002';
    const DB_USER = 'phpmyadmin';
    const DB_PASS = 'artur'; 
    //bbb 35t34t 43t 

/* configuracja dla windows

    const DB_HOST = 'localhost';
    const DB_NAME = 'project_002';
    const DB_USER = 'root';
    const DB_PASS = ''; 
    */





}
try {
    $pdo = new PDO(
        'mysql:host=' . Config::DB_HOST . ';dbname=' . Config::DB_NAME,
        Config::DB_USER,
        Config::DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    die('Connection failed: ' . $e->getMessage());
}
return $pdo;

?>