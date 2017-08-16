<?php
    $servername = "localhost";
    $username = "root";
    $password = "root";
    
    $DBname = $_POST["DBName"];
    $Alias = $_POST["aliasName"];
    $TableName = $_POST["Tabel"];
    $sql = $_POST["mySqlStatement"];
    $Data = $_POST["data"];
    
    // Create connection
    $conn = new mysqli($servername, $username, $password, $DBname);
    // Check connection
    if ($conn->connect_error)
    {
        die("Connection failed: " . $conn->connect_error);
    }
   
    if ($conn->query($sql) === TRUE) 
    {
        print "Tabelul a fost creat cu succes!";
        file_put_contents("../../json/tabele.json", json_encode($Data));
    } 
    else 
    {
        header('HTTP/1.1 500 Internal Server');
        header('Content-type: application/json');
        $response_array = "Eroare la stergerea bazei de date: " . $conn->error;
        print json_encode($response_array);
    }
    
    $conn->close();
?> 
