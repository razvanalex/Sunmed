<!DOCTYPE html>
<html>
	<head>
		<title>HOME</title>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		<link rel="stylesheet" href="../css/home.css" type="text/css" />
	</head>
	<body>
		<div class="bkg"></div>
		<div class="content">
			<form method="POST" action="...">
				<input class="textbox" type="text" name="username" placeholder="username">
				<input class="textbox" type="password" name="password" placeholder="password">
				<table class="selectBlock">
					<tr>
						<td><span class="description">Analizor: </span></td>
						<td><select class="selector" id="analizor"></select></td>
					</tr>
					<tr>
						<td><span class="description">Analit: </span></td>
						<td><select class="selector" id="analit"></select></td>
					</tr>
				</table>
				<input class="btn" type="submit" value="Log In">
				</div>
			</form>
		</div>

		<!-- Scripts -->
		<script src="./js/options.js"></script>
	</body>
</html>
