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
                                        <input class="textbox" type="text" name="nume" placeholder="Nume"/>
                                        <input class="textbox" type="text" name="prenume" placeholder="Prenume"/>
                                        <input class="textbox" type="text" name="username" placeholder="Nume de utilizator"/>
                                        <input class="textbox" type="password" name="password" placeholder="Parola"/>
                                        <input class="textbox" type="password" name="confirmPassword" placeholder="Confirma Parola"/>
                                    </div>
                                </div>
                                <div class="panel" id="Permstxt">
                                    <span class="panelTitle">Permisiuni</span>
                                    <div class="panelContent2">
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 1</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 2</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 3</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 4</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 5</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 6</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 1</span>
                                        <input class="chkbox" type="checkbox" name="" vlaue=""/><span class="chkbox" >Program 2</span>
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
                            
                        </div>
                    </div>
                    
                </div>
                <div id="softsContent" class="contentBody">
                    
                </div>
            </div>
        </div>
        <script type="text/javascript" src="../../../js/admin.js"></script>
    </body>
</html>