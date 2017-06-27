<?php
    include("./php/ConnectServer.php");

    $Clasa = $_POST['clasa'];
    $NrElevi = $_POST['nr_elevi'];
    $Ortodox = $_POST['ortodox'];
    $Catolic = $_POST['catolic'];
    $Musulman = $_POST['musulman'];
    $AlteReligii = $_POST['alte_religii'];
    
    if(isset($_POST['action'])) 
    {
        if($NrElevi == $Ortodox + $Catolic + $Musulman + $AlteReligii)
        {
            $sql1 = "Update Religie SET Nr_elevi = '$NrElevi', Ortodox = '$Ortodox', Catolic = '$Catolic', Musulman = '$Musulman', Alte_religii = '$AlteReligii'  WHERE Clasa='$Clasa'";
            $conn->query($sql1);
            print "Update successfully done!";
        }
        else print "Wrong numbers!";
    }
    else print "Error Not Sent AJAX";
    
    $conn->close();
?>
