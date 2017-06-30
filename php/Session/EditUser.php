<?php
    if ($_SERVER["REQUEST_METHOD"] == "POST")
    {
        include_once('../../php/Session/ConnectServer.php');

        $response = array();
        $response['error'] = "";
        $response['success'] = "";
        $response['password'] = "";
        
        $obj_id = test_input($_POST["id"]);
        $obj_nume = test_input($_POST["nume"]);
        $obj_prenume = test_input($_POST["prenume"]);
        $obj_username = test_input($_POST["username"]);
        $obj_password = test_input($_POST["password"]);
        $obj_confPass = test_input($_POST["confPass"]);
        $obj_permisiuni = test_input($_POST["permisiuni"]);
        $ok = 1;

        // Edit personal information
        if ($obj_nume == "" || $obj_prenume == "" || $obj_username == "")
            $response['error'] .= "Required fields are empty! ";
        else
        {
            $sql = "SELECT id, username FROM Users";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) 
            {
                while ($db_field = $result->fetch_assoc() ) 
                {
                    $_username = $db_field['username'];
                    $_id = $db_field['id'];
                    
                    if ($_username == $obj_username && $_id != $obj_id)
                    {
                        $response['error'] .= "Username already exists! ";
                        $ok = 0;
                    }
                }
            }
            
            if ($ok)
            {
                $sql = "UPDATE Users SET nume='$obj_nume', prenume='$obj_prenume', username='$obj_username', permissions='$obj_permisiuni' WHERE id=$obj_id;";
    
                if ($conn->query($sql) === TRUE) 
                        $response['success'] = "Record has been successfully updated! ";
                else $response['error'] .= "Error: " . $sql . "<br>" . $conn->error;
            }
        }
        
        // Change password
        if ($obj_password !=  "")
        {
            if ($obj_password == $obj_confPass)
            {
                $hashed_password = password_hash($obj_password, PASSWORD_BCRYPT, ['cost' => 15]);
                
                $sql = "UPDATE Users SET password='$hashed_password' WHERE id=$obj_id;";
                if ($conn->query($sql) === TRUE)
                {
                    $response['password'] = $hashed_password;
                    $response['success'] = "Password has been successfully changed! ";
                }
                else $response['error'] .= "Error: " . $sql . "<br>" . $conn->error . " ";
            }
            else $response['error'] .= "Paswords do not match! ";
        }
        
        print json_encode($response);
    }
    
    function test_input($data) 
    {
       $data = trim($data);
       $data = stripslashes($data);
       $data = htmlspecialchars($data);
       return $data;
    }  
?>