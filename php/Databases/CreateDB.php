<?php
    $servername = "localhost";
    $username = "root";
    $password = "root";
    
    $DBname = $_POST["DBName"];
    $Data = $_POST["Tabele"];
    
    // Create connection
    $conn = new mysqli($servername, $username, $password);
    // Check connection
    if ($conn->connect_error)
    {
        die("Connection failed: " . $conn->connect_error);
    }
    
    // Create database
    $sql = "CREATE DATABASE " . $DBname . ";";
    if ($conn->query($sql) === TRUE) 
    {
        print "Baza de date creata cu succes!";
        file_put_contents("../../json/tabele.json", json_encode($Data));
    } 
    else 
    {
        header('HTTP/1.1 500 Internal Server');
        header('Content-type: application/json');
        $response_array = "Eroare la crearea bazei de date: " . $conn->error; 
        print json_encode($response_array);
    }
    
    $conn->close();
?> 
