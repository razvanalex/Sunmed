<?php
    include_once('./Login.php');
    $user = "";
   
    if(isset($_SESSION['login_user']))
        $user = $_SESSION['login_user'];
        
    if ($user == "")
        header('Location: ../../index.php');
?>
<!DOCTYPE html>
<html>
    <head>
        
    </head>
    <body>
        <?php 
           // echo "<p>Hello " . $user . "!</p><br>";
          //  include_once('../../table.php');
            include_once('../../table.php');
        ?>
        
        
    </body>
</html>