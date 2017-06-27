<!DOCTYPE html>
<?php
	ini_set('display_errors', 1);
	error_reporting(E_ALL|E_STRICT);
    include("./php/ConnectServer.php");
?>

<html>
	<head>
		<title>Diestro</title>
		<link rel="stylesheet" href="../css/style.css" type="text/css" />
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	</head>
	<body>
		
		<span>DIAGRAMA DE CONTROL</span><br><br>
		<div>
			<table style="border:1px solid black" class="highlight">
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
				<tbody id="tbodyID">
					<?php
						include("./php/GenerateTableData.php");
					?>
				</tbody> 
			</table>
		</div>
		

		
		<!-- Script -->
		<!-- <script src="../js/script.js"></script> -->
    </body>
</html>
