<?php
    include_once('../../php/Session/ConnectServer.php');
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
	
	print "<thead><tr>";
	for ($i = 0; $i < count($fields); $i++)
	    print "<td>" . $title[$i] . "</td>";
    print "<td>Editare</td>";
	print "</tr></thead><tbody>";
	if ($result->num_rows > 0) 
	{
		while ($db_field = $result->fetch_assoc() ) 
		{
			print "<tr>";
			for ($i = 0; $i < count($fields); $i++)
			    print "<td>" . $db_field[$fields[$i]] . "</td>";
			if ($db_field["username"] == "admin")
				print "<td><div class='edit EditUserBtn'></div></td>";
			else print "<td><div class='edit EditUserBtn'></div><div class='remove RemoveUserBtn'></div></td>";
			print "</tr>";
		}
	}
	print "</tbody>";
?>