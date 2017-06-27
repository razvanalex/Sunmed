<?php
	$sql = "SELECT nr_crt, ziua, luna, xi, executat, verificat FROM diestro;";
	$result = $conn->query($sql);
    
	if ($result->num_rows > 0) 
	{
		while ($db_field = $result->fetch_assoc() ) 
		{
			$nr_crt = $db_field["nr_crt"];
			$ziua = $db_field["ziua"];
			$luna = $db_field["luna"];
			$xi = $db_field["xi"];
			$executat = $db_field["executat"];
			$verificat = $db_field["verificat"];

			print "<tr>";
			print "<td>$nr_crt</td>";	
			print "<td>$ziua</td>";
			print "<td>$luna</td>";
			print "<td>$xi</td>";
			print "<td>$executat</td>";
			print "<td>$verificat</td>";
			print "</tr>";
		}
	}
?>
