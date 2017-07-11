<?php
    $fileName = $_POST["filename"];
    $dir = $_POST["dir"];
    
    if (file_exists($dir . "/" . $fileName . ".json"))
    {
        header('HTTP/1.1 500 Internal Server');
        header('Content-Type: application/json; charset=UTF-8');
        die("Fisierul exista!");
    }
    else 
    {
        $myfile = fopen($dir . "/" . $fileName . ".json", "w") or die("Unable to open file!");
        fwrite($myfile, "[]");
        fclose($myfile);
        print $dir . "/" . $fileName . ".json";
    }
?>
