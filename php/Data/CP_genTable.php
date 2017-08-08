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
	$where = $_POST["whereClause"];

	$sql_select = "";
	$i = 0;
	for (; $i < count($fields) - 1; $i++)
	    $sql_select .= $fields[$i] . ', ';
	$sql_select .= $fields[$i];

	if ($where == null)
		$sql = "SELECT " . $sql_select . " FROM " . $table . ";";
	else $sql = "SELECT " . $sql_select . " FROM " . $table . " WHERE " . $where . ";";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) 
	{
		while ($db_field = $result->fetch_assoc() ) 
		{
			print "<tr>";
			for ($i = 0; $i < count($fields); $i++) 
			{
				if (validateDate($db_field[$fields[$i]])) 
				{
					//$d = DateTime::createFromFormat($format, $date);
					
					print "<td>" . convertDate($db_field[$fields[$i]]) . "</td>";
				}
			    else print "<td>" . $db_field[$fields[$i]] . "</td>";
			}
			print "</tr>";
		}
	}
	
	function validateDate($date, $format = 'Y-m-d')
	{
		$d = DateTime::createFromFormat($format, $date);
		return $d && $d->format($format) == $date;
	}
	
	function convertDate($date, $format = 'd/m/Y')
	{
		$d = DateTime::createFromFormat('Y-m-d', $date);
		return $d->format($format);
	}
?>
