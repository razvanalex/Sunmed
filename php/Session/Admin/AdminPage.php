<?php
    include_once('../Login.php');
    $user = "";
   
    if(isset($_SESSION['login_user']))
        $user = $_SESSION['login_user'];
        
    if ($user != "admin")
        header('Location: ../../../index.php');
?>
<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../../../css/admin.css" type="text/css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    </head>
    <body>
        <div class="bkg">
            <div class="banner">
                <img src="../../../Resources/logosunmed.png"></img>
                <span class="pageTitle">Administrator</span>
            </div>
       
            <div class="menu">
                <div id="users" class="tab tabSelected">
                    <span class="tabName">Utilizatori</span>
                </div>
                <div id="softs" class="tab">
                    <span class="tabName">Programe</span>
                </div>
            </div>

            <div class="content">
                <div id="userContent" class="contentBody">
                    <div class="button" id="AddUserBtn"><span class="text">Adauga utilizator</span></div>
                    <table id='genTable'></table>
                    
                    <div class="window" id="AddUserWnd">
                        <div class="topWindow">
                            <span class="title">Adauga utilizator</span>
                            <div class="close" id="closeAddUser"></div>
                        </div>
                        <div class="contentWindow">
                            <form id="AddForm">
                                <div class="panel" id="inAddtxt">
                                    <span class="panelTitle">Informatii personale</span>
                                    <div class="panelContent1">
                                        <input id="AddNume" class="textbox" type="text" name="nume" placeholder="Nume"/>
                                        <input id="AddPrenume" class="textbox" type="text" name="prenume" placeholder="Prenume"/>
                                        <input id="AddUsername" class="textbox" type="text" name="username" placeholder="Nume de utilizator"/>
                                        <input id="AddPassword" class="textbox" type="password" name="password" placeholder="Parola"/>
                                        <input id="AddConfPass" class="textbox" type="password" name="confirmPassword" placeholder="Confirma Parola"/>
                                    </div>
                                </div>
                                <div class="panel" id="Permstxt">
                                    <span class="panelTitle">Permisiuni</span>
                                    <div class="panelContent2">
                                    <?php
                                        $string = file_get_contents("../../../json/options.json");
                                        $programs = json_decode($string, true);
                                        
                                        for ($i = 0; $i < count($programs); $i++)
                                            foreach ($programs[$i] as $key1 => $val1)
                                                if ($key1 == "nume")
                                                {
                                                    foreach ($programs[$i][analiti] as $key2 => $val2)
                                                        foreach ($val2 as $key3 => $val3)
                                                            if ($key3 == "nume")
                                                            {
                                                                print "<div class='chkbox'>
                                                                        <input class='permissions' type='checkbox'/><span>" . $val1 . " " . $val3  . "</span>
                                                                    </div>";
                                                            }
                                                }
                                    ?>
                                    </div>
                                </div>
                                <div class="button" id="AddBtn"><span class="text">Adauga</span></div>
                                <div class="button" id="CancelBtn"><span class="text">Anulare</span></div>
                            </form>
                        </div>
                    </div>
                    
                    <div class="window" id="EditUserWnd">
                        <div class="topWindow">
                            <span class="title">Editare utilizator</span>
                            <div class="close" id="closeEditUser"></div>
                        </div>
                        <div class="contentWindow">
                            <form id="EditForm">
                                <div class="panel" id="inAddtxt">
                                    <span class="panelTitle">Informatii personale</span>
                                    <div class="panelContent1">
                                        <input class="textbox" id="nume" type="text" name="nume" placeholder="Nume"/>
                                        <input class="textbox" id="prenume" type="text" name="prenume" placeholder="Prenume"/>
                                        <input class="textbox" id="username" type="text" name="username" placeholder="Nume de utilizator"/>
                                        <div class="panel">
                                            <span class="panelTitle">Schimbare parola</span>
                                            <div class="panelContent3">
                                                <input class="textbox" id="password" name="password" type="password" name="password" placeholder="Parola"/>
                                                <input class="textbox" id="confPass" name="confirmPassword" type="password" name="confirmPassword" placeholder="Confirma Parola"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="panel" id="Permstxt">
                                    <span class="panelTitle">Permisiuni</span>
                                    <div class="panelContent2">
                                    <?php
                                        $string = file_get_contents("../../../json/options.json");
                                        $programs = json_decode($string, true);
                                        
                                        for ($i = 0; $i < count($programs); $i++)
                                            foreach ($programs[$i] as $key1 => $val1)
                                                if ($key1 == "nume")
                                                {
                                                    foreach ($programs[$i][analiti] as $key2 => $val2)
                                                        foreach ($val2 as $key3 => $val3)
                                                            if ($key3 == "nume")
                                                            {
                                                                print "<div class='chkbox'>
                                                                        <input class='permissions' type='checkbox'/><span>" . $val1 . " " . $val3  . "</span>
                                                                    </div>";
                                                            }
                                                }
                                    ?>
                                    </div>
                                </div>
                                <div class="button" id="EditBtn"><span class="text">Editare</span></div>
                                <div class="button" id="CancelEditBtn"><span class="text">Anulare</span></div>
                            </form>
                        </div>
                    </div>
                    
                     <div class="window warning" id="RemoveUserWnd">
                        <div class="topWindow">
                            <span class="title">Sterge utilizator</span>
                            <div class="close" id="closeRemoveUser"></div>
                        </div>
                        <div class="contentWindow">
                            <div class="textConfirm">
                                <span id="confirmRemove"></span>
                            </div>
                            <div class="btnConfirm">
                                <div class="button" id="CancelRemoveBtn"><span class="text">Anulare</span></div>
                                <div class="button" id="RemoveBtn"><span class="text">Sterge</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="window info" id="InfoWnd">
                        <div class="topWindow">
                            <span class="title">Info</span>
                            <div class="close" id="closeInfoUser"></div>
                        </div>
                        <div class="contentWindow">
                            <div class="textConfirm">
                                <span id="InfoText"></span>
                            </div>
                            <div class="btnConfirmInfo">
                                <div class="button" id="infoOkBtn"><span class="text">Ok</span></div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                
                <!-- Programe -->
                <div id="softsContent" class="contentBody">
                    
                </div>
            </div>
        </div>
        <script type="text/javascript" src="../../../js/admin.js"></script>
    </body>
</html>