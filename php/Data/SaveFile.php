<?php
    $fileName = $_POST["filename"];
    $object = $_POST["object"];
    
    if (!file_exists($fileName)) 
    {
        $myfile = fopen($fileName, "w") or die("Unable to open file!");
        fclose($myfile);
    }
    
    if ($object == null)
        file_put_contents($fileName, "[]");
    else file_put_contents($fileName, json_encode($object));
?>