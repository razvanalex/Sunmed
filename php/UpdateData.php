<?php
    include("./php/ConnectServer.php");
    
    if($_POST['action'] == "Update")
    {
        $ID = 0;
        $Clasa = $_POST['clasa'];
        $NrElevi = $_POST['nr_elevi'];
        $Ortodox = $_POST['ortodox'];
        $Catolic = $_POST['catolic'];
        $Musulman = $_POST['musulman'];
        $AlteReligii = $_POST['alte_religii'];
        
        $sql = "SELECT Clasa, Nr_elevi, Ortodox, Catolic, Musulman, Alte_religii FROM Religie";
        $result = $conn->query($sql);
        
        if ($result->num_rows > 0) 
    	{
    	    while ($db_field = $result->fetch_assoc() ) 
    		{
    		    $id = str_replace(' ', '', $db_field["Clasa"]);
    		    if($NrElevi[$ID] != $db_field["Nr_elevi"])
    		    {
    		        $NrElevi[$ID] = $db_field["Nr_elevi"];
    		    }
    		    if($Ortodox[$ID] != $db_field["Ortodox"])
    		    {
    		        $Ortodox[$ID] = $db_field["Ortodox"];
    		    }
    		    if($Catolic[$ID] != $db_field["Catolic"])
    		    {
    		        $Catolic[$ID] = $db_field["Catolic"];
    		    }
    		    if($Musulman[$ID] != $db_field["Musulman"])
    		    {
    		        $Musulman[$ID] = $db_field["Musulman"];
    		    } 
    		    if($AlteReligii[$ID] != $db_field["Alte_religii"])
    		    {
    		        $AlteReligii[$ID] = $db_field["Alte_religii"];
    		    }
    		    
    		    $json = file_get_contents("../data.json");
                $data = json_decode($json, true);
                
                $data[$id]["NRElevi"] = $NrElevi[$ID];
                $data[$id]["Ortodox"] = $Ortodox[$ID];
                $data[$id]["Catolic"] = $Catolic[$ID];
                $data[$id]["Musulman"] = $Musulman[$ID];
                $data[$id]["AlteReligii"] = $AlteReligii[$ID];
                
                file_put_contents('../data.json', json_encode($data));

    		    $ID++;
    		}
    	}
    }
    else print "Update AJAX wasn't been send!";
    
    $conn->close();
?>
