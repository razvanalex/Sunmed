<?php
    
?>

<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../../css/windows.css" type="text/css" />
        <link rel="stylesheet" href="../../css/CreateProgram.css" type="text/css" />
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
        <script type="text/javascript" src="../../js/jquery.canvasjs.min.js"></script>
    </head>
    <body>
        
        <!-- Init Workspace Window -->
        <div class="window hidden" id="InitWorkspace">
            <div class="topWindow">
                <span class="title">Creare Program</span>
                <div class="close" id="closeInit"></div>
            </div>
            <div class="contentWindow">
                <div class="section">
                    <span id="topText">Alegeti tipul programului: </span>
                    <div id="selection"></div>
                    <div class="bottomText">
                        <span id="intrTxt">Introduceti numele programului: </span>
                        <input class="textbox" id="numeSoft" type="text" name="numeWorkplace"/>
                        <div class="button" id="create"><span class="text">Creeaza</span></div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Open Workspace Window -->
        <div class="window hidden" id="OpenWindow">
            <div class="topWindow">
                <span class="title">Deschide Program</span>
                <div class="close" id="closeOpenWindow"></div>
            </div>
            <div class="contentWindow">
                <div class="section" id="openSection">
                    <div id="ItemsBox"></div>
                </div>
                <div class="button" id="openP"><span class="text">Deschide</span></div>
            </div>
        </div>
        
        <!-- Create Database Window -->
        <div class="window hidden" id="CreateDBWindow">
            <div class="topWindow">
                <span class="title">Creare Baza de Date</span>
                <div class="close" id="closeCreateDBWindow"></div>
            </div>
            <div class="contentWindow">
                <div class="section">
                    <div id="SelectDB">
                        <span id="selSpanDB">Selecteaza DB: </span>
                        <select id="DBs"></select>
                        <div class="button" id="CreateDB"><span class="text">Creeaza DB</span></div>
                        <div class="button" id="StergeDB"><span class="text">Sterge DB</span></div>
                    </div>
                    <div id="createTable">
                        <div id="topCTable">
                            <div class="topCTableItem">Nume Camp</div>
                            <div class="topCTableItem">Alias Camp</div>
                            <div class="topCTableItem">Tipul</div>
                        </div>
                        <div id="contentCTable"></div>
                    </div>
                </div>
                <div class="bottomText">
                    <span id="intrTxt2">Introduceti numele tabelului: </span>
                    <input class="textbox" id="numeTabelNou" type="text" name="numeTabelNou"/>
                    <div class="button" id="CreateTable"><span class="text">Creeaza tabel nou</span></div>
                </div>
            </div>
        </div>
        
        <!-- Insert Name DB Window -->
        <div class="window info hidden" id="NameWindow">
            <div class="topWindow">
                <span class="title">Creare Baza de Date</span>
                <div class="close" id="closeNameWindow"></div>
            </div>
            <div class="contentWindow">
                <span id="SpanNameNewDB">Numele: </span>
                <input class="textbox" id="numeDBNouInput" type="text" name="numeDBNou"/>
                <div class="button" id="CreateDBBtn"><span class="text">Creeaza</span></div>
            </div>
        </div>
        
        <!-- Info Window -->
        <div class="window info hidden" id="InfoWindow">
            <div class="topWindow">
                <span class="title">Info</span>
                <div class="close" id="closeInfoWindow"></div>
            </div>
            <div class="contentWindow">
                <span id="TextInfo">TEXT</span>
                <div class="button" id="OKbtn"><span class="text">OK</span></div>
            </div>
        </div>
        
        <!-- Add Data Window -->
        <div class="window hidden" id="AddDataGraph">
            <div class="topWindow">
                <span class="title">Adauga Data</span>
                <div class="close" id="closeAddDataGraph"></div>
            </div>
            <div class="contentWindow">
                <div class="section">
                    <div class="button" id="AddConstData"><span class="text">Adauga constanta</span>
                    </div><div class="button" id="AddTabelData"><span class="text">Adauga data tabel</span>
                    </div><div id="dataSection"></div>
                </div>
                <div class="bottomText">
                    <div class="button" id="AddDataOkBtn"><span class="text">Ok</span></div>
                </div>
            </div>
        </div>
        
        <!-- CreateProgram -->
        <div id="softContent" class="">
            <div id="topMenuBar">
                <ul id="menuBar">
                    <li id="fisierText">Fisier
                        <ul id="fisierContent">
                            <li id="newProgram">Nou</li>
                            <li id="openProgram">Deschide</li>
                            <li id="saveProgram">Salveaza</li>
                            <li id="exitProgram">Iesire</li>
                        </ul>
                    </li>
                    <li>Previzualizare</li>
                </ul>
                <div id="status"></div>
            </div>
            <div id="creationBody">
                <div id="toolbox">
                    <div class="topBar">
                        <span>Lista de unelte</span>
                    </div>
                    <ul id="contentToolbox"></ul>
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
                <div id="content">
                    <div id="preview">
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Scripts -->
        <script type="text/javascript" src="../../js/jscolor.js"></script>
        <script type="text/javascript" src="../../js/createProgram.js"></script>
    </body>
</html>