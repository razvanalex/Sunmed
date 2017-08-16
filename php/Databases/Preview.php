<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="../../css/windows.css" type="text/css" />
        <link rel="stylesheet" href="../../css/CreateProgram.css" type="text/css" />
        <link rel="stylesheet" href="../../css/preview.css" type="text/css" />
        <link href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" rel = "stylesheet">
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU=" crossorigin="anonymous"></script>
        <script type="text/javascript" src="../../js/jquery.canvasjs.min.js"></script>
		<script type="text/javascript" src="../../js/html2canvas.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.debug.js"></script>
    </head>
    <body>
        <div id="prevContent">
            <div id="leftUserPanel">
                <img id="logo" src="../../Resources/logosunmed-2.png"/>
                <div id="usernameSpan"><span>Administrator</span></div>
                <div id="DateAndTime">
                    <span id="currentDate">dd/mm/yy hh:mm:ss</span>
                </div>
                <div id="pdPanel">
                    <span>De la:</span><input class="PickDate" id="StartDate" placeholder="Start"/>
                    <span>Pana la:</span><input class="PickDate" id="EndDate" placeholder="End"/>
                </div>
                <div class="button" id="showData"><span>Afiseaza</span></div>
                <div class="button" id="exportData"><span>Exporta ca PDF</span></div>
            </div>

            <div id="contentUserPanel">
                <div id="preview"></div>
            </div>
        </div>
        
        <!-- Create Database Window -->
        <div class="window" id="addRegister">
            <div class="topWindow">
                <span class="title">Adaugare</span>
                <div class="close" id="closeAddRegister"></div>
            </div>
            <div class="contentWindow">
                
            </div>
        </div>

        <!-- Scripts -->
        <script type="text/javascript" src="../../js/math.min.js"></script>
        <script type="text/javascript" src="../../js/preview.js"></script>
        <script type="text/javascript" src="../../js/jscolor.js"></script>
    </body>
</html>
