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

    /*if (!is_writable($myfile))
    {
        header('HTTP/1.1 500 Internal Server');
        header('Content-type: application/json');
        $response = "File is not writable!"; 
        print $response;
    }*/
?>