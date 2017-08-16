<?php
    $fileName = $_POST["filename"];
    $programs = $_POST["programs"];
    
    file_put_contents($fileName, json_encode($programs));
?>
