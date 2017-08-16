<?php
    include_once('./php/Session/Login.php');
    $user = "";
    if(isset($_SESSION['login_user']))
        $user = $_SESSION['login_user'];
?>
<!DOCTYPE html>
<html>
	<head>
		<title>HOME</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="./css/home.css" type="text/css" />
	</head>
	<body>
		<div class="bkg"></div>
		<div class="content">
			<form method="POST" action="">
				<input class="textbox" type="text" name="username" placeholder="username">
				<input class="textbox" type="password" name="password" placeholder="password">
				
				<?php 
					echo '<span class="error">' . $error . '</span>';
				 ?>
				 
				 <!-- Convert value to text for options -->
		 		<input id="analizor_text" type = "hidden" name = "analizor_text" value = "" />
		 		<input id="analit_text" type = "hidden" name = "analit_text" value = "" />
		 		<input id="tip_tabel" type = "hidden" name = "tip_tabel" value = "" />
		 		
				<input class="btn" name="submit" type="submit" value="Log In">
				</div>
			</form>
		</div>
		 
		<!-- Scripts
		<script src="./js/options.js"></script> -->
		
	</body>
</html>
