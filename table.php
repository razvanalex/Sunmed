<?php
	$ServerPath = $_SERVER["DOCUMENT_ROOT"];
	print "<span>DIAGRAMA DE CONTROL</span><br><br>
	<div>
		<table style='border:1px solid black' class='highlight'>
			<thead>
				<tr>
					<th>Nr. crt</th>
					<th>ZIUA</th>
					<th>LUNA</th>
					<th>Xi</th>
					<th>Executat</th>
					<th>Verificat</th>
				</tr>
			</thead>
			<tbody id='tbodyID'>";
				$path = $ServerPath . "/Sunmed/php/Data/GenerateTableData.php";
				include_once($path);
	 print "</tbody> 
		</table>
	</div>
	<!-- Script -->
	<!-- <script src='../js/script.js'></script> -->";
?>