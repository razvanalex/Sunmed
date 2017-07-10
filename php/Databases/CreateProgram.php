<?php
    
?>

<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../../css/windows.css" type="text/css" />
         <link rel="stylesheet" href="../../css/CreateProgram.css" type="text/css" />
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    </head>
    <body>

        <div class="window hidden" id="InitWorkspace">
            <div class="topWindow">
                <span class="title">Creare Program</span>
                <div class="close" id="closeInit"></div>
            </div>
            <div class="contentWindow">

                <div class="section" id="s1">
                    <span id="topText">Alegeti tipul programului: </span>
                    <div id="selection"></div>
                    <div id="bottomText">
                        <span id="intrTxt">Introduceti numele programului: </span>
                        <input class="textbox" id="numeSoft" type="text" name="numeWorkplace"/>
                        <div class="button" id="next"><span class="text">Urmatorul</span></div>
                    </div>
                </div>

                <div class="section" id="s2">
                    <div>
                        <span id="intrTxt">Numele bazei de date: </span>
                        <input class="textbox" id="numeDB" type="text" name="DBName"/>
                    </div>
                    <div>
                        <span id="intrTxt">Numele tabelului: </span>
                        <input class="textbox" id="numeDB" type="text" name="DBName"/>
                    </div>

                    <div class="button" id="create"><span class="text">Creeaza</span></div>
                </div>
            
            </div>
        </div>

        <div id="softContent" class="">
            <div id="topMenuBar">
                <ul id="menuBar">
                    <li id="fisierText">Fisier
                        <ul id="fisierContent">
                            <li id="newProgram">Nou</li>
                            <li id="openProgram">Deschide</li>
                            <li id="exitProgram">Iesire</li>
                        </ul>
                    </li>
                    <li>Previzualizare</li>
                </ul>
            </div>
            <div id="creationBody">
                <div id="toolbox">
                    <div class="topBar">
                        <span>Lista de unelte</span>
                    </div>
                    <ul id="contentToolbox"></ul>
                </div>
                <div id="preview">
                </div>
                <div id="properties">
                    <div style="height: 100%; position: absolute; top: 0px;width: 100%;">
                        <div class="topBar">
                            <span>Proprietati</span>
                        </div>
                        <div id="contentProperties">
                            <ul></ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <script type="text/javascript" src="../../js/jscolor.js"></script>
        <script type="text/javascript" src="../../js/createProgram.js"></script>
    </body>
</html>