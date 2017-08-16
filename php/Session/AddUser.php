<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        include_once('../../php/Session/ConnectServer.php');
        $response = array();
        $response['message'] = "";
        $response['id'] = 0;
        $response['password'] = "";
        $response['error'] = "";
         
        $nume = test_input($_POST["nume"]);
    	$prenume = test_input($_POST["prenume"]);
    	$T_username = test_input($_POST["username"]);
    	$password = test_input($_POST["password"]);
    	$conf_pass = test_input($_POST["conf_pass"]);
    	$permission = test_input($_POST["permissions"]);

        if ($conf_pass != $password)
            $response['error'] = "Parola confirmata gresit! ";
        if ($nume == "" || $prenume == "" || $T_username == "" || $password == "" || $conf_pass == "")
            $response['error'] = "Campurile nu pot fi goale! ";

        $sql = "SELECT username FROM Users";
        
        $result = $conn->query($sql);
        while ($db_field = $result->fetch_assoc()) 
        {
            if($db_field["username"] == $T_username)
                $response['error'] = "Username exists! ";
        }
        
        if($response['error'] == "")
        {
            $hashed_password = password_hash($password, PASSWORD_BCRYPT, ['cost' => 15]);
            $response['password'] = $hashed_password;
            $sql = "INSERT INTO Users (nume, prenume, username, password, permissions)
            VALUES('$nume', '$prenume', '$T_username', '$hashed_password', '$permission')";
            
            if ($conn->query($sql) === TRUE) 
                $response['message'] = "New record successfully created! ";
            else $response['message'] = "Error: " . $sql . "<br>" . $conn->error;
           
            $sql = "SELECT id, username FROM Users";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) 
            {
                $ID = 0;
                while ($db_field = $result->fetch_assoc() ) 
                {
                    $ID++;
                    $username = $db_field['username'];
                    if($db_field['id'] != $ID)
                    {
                        $sql1 = "Update Users SET id = '$ID' WHERE username='$T_username'";
                        $conn->query($sql1);
                    }
                }
            }
            $response['id'] = $ID;

            $conn->close();
        }
        print json_encode($response);
    }
    else print "Error request!";
    
    
    function test_input($data) 
    {
       $data = trim($data);
       $data = stripslashes($data);
       $data = htmlspecialchars($data);
       return $data;
    }  
?>