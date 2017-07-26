<?php
    $servername = "localhost";
    $Susername = "root";
    $Spassword = "root";
    $dbname = $_POST["DBName"];
   
    // Create connection
    $conn = new mysqli($servername, $Susername, $Spassword, $dbname);
    
    // Check connection
    if ($conn->connect_error) 
    {
        die("Connection failed: " . $conn->connect_error);
    }
    
    $table = $_POST["tableName"];
	$fields = $_POST["tableFields"];
	$title = $_POST["tableAlias"];
	 
	$sql_select = "";
	$i = 0;
	for (; $i < count($fields) - 1; $i++)
	    $sql_select .= $fields[$i] . ', ';
	$sql_select .= $fields[$i];

	
	$sql = "SELECT " . $sql_select . " FROM " . $table . ";";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) 
	{
		while ($db_field = $result->fetch_assoc() ) 
		{
			print "<tr>";
			for ($i = 0; $i < count($fields); $i++)
			    print "<td>" . $db_field[$fields[$i]] . "</td>";
			print "</tr>";
		}
	}
?>