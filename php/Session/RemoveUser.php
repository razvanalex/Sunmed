<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        include_once('../../php/Session/ConnectServer.php');
        $T_username = $_POST["username"];
        
        $sql = "DELETE FROM Users WHERE username = '$T_username'";
        $result = $conn->query($sql);
        
        print "Record succesfully removed! ";
        
        // reconstruct IDs
        $sql = "SELECT id FROM Users";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) 
	    {
	        $ID_ok = 0;
    		while ($db_field = $result->fetch_assoc() ) 
    		{
    		    $ID_ok++;
                $ID = $db_field["id"];
                if ($ID_ok != $ID)
                {
                    $sql = "Update Users SET id=$ID_ok WHERE id=$ID";
                    $result2 = $conn->query($sql);
                    if (!$result2)
                        print "An erros has occured while updating IDs! ";
                }
    		}
	    }
    }
?>