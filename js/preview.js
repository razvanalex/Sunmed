function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

function getObjectArray(file) {
    $.getJSON(file, function(ObjArray) {  
        var graphs = [];     
        for (var i = 0; i < ObjArray.length; i++) {
            if (ObjArray[i].Nume == "Grafic") {
                graphs.push(ObjArray[i]);
                appendObject(ObjArray[i], "#preview");
                applyProp(ObjArray[i], null); 
            }
            else {
                appendObject(ObjArray[i], "#preview");
                applyProp(ObjArray[i], null);
            }
        }

        var Tabels = [];
        getElementsID(ObjArray, "Tabel", Tabels);

        for (var j = 0; j < Tabels.length; j++) {
            $("#" + Tabels[j]).unbind().on('update', function(){
                for (var i = 0; i < graphs.length; i++) {
                    var chart;

                    chart = initChart(graphs[i].Proprietati);
                    applyProp(graphs[i], chart);      
                    applyDataChart(graphs[i], chart);
                    
                    var ID = graphs[i].Proprietati["ID"];
                    chart = new CanvasJS.Chart(ID, chart.options);
                    chart.render();
                }
            });
        }
    });
}

function appendObject(data, place) {
    var newID = " id='" + data.Proprietati.ID + "'>";
    $(place).append(data.Cod.replace(">", newID));
    $("#" +  data.Proprietati.ID).addClass("newItem");
}

function applyProp(data, chart) {
    var id = "#" + data.Proprietati.ID;

    for (var prop in data.Proprietati)
    {
        if ($(id).find("input").length)
           id = id + " input";
        
        if (prop == "Text") {
            $(id + " span").text(data.Proprietati[prop]);
        }
        if (prop == "Fundal") {
            $(id).css("background-color", "#" + data.Proprietati[prop]);
        }
        else if (prop == "Culoare") {
            $(id).css("color", "#" + data.Proprietati[prop]);
        }
        else if (prop == "Font") {
            $(id).css("font-family", data.Proprietati[prop]);
        }
        else if (prop == "Dimensiune") {
            $(id).css("font-size", data.Proprietati[prop] + "px");
        }
        else if (prop == "Bold") {

            if (data.Proprietati[prop] == "Da")
                $(id).css("font-weight", "bold");
            else if (data.Proprietati[prop] == "Nu")
                $(id).css("font-weight", "normal");
        }
        else if (prop == "Italic") {
            if (data.Proprietati[prop] == "Da")
                $(id).css("font-style", "italic");
            else if (data.Proprietati[prop] == "Nu")
                $(id).css("font-style", "normal");
        }
        else if (prop == "Aliniere orizontal") {
            if (data.Proprietati[prop] == "Stanga")
                $(id).css("text-align", "left");
            else if (data.Proprietati[prop] == "Dreapta")
                $(id).css("text-align", "right");
            else if (data.Proprietati[prop] == "Centrat")
                $(id).css("text-align", "center");
            else if (data.Proprietati[prop] == "Stanga-Dreapta")
                $(id).css("text-align", "justify"); 
            fixAlign(data);
        }
        else if (prop == "Aliniere vertical") {
            $(id + " span").css("display", "table-cell");
            if (data.Proprietati[prop] == "Sus")
                $(id + " span").css("vertical-align", "top");
            else if (data.Proprietati[prop] == "Mijloc")
                $(id + " span").css("vertical-align", "middle");
            else if (data.Proprietati[prop] == "Jos")
                $(id + " span").css("vertical-align", "bottom");
            fixAlign(data);
        }
        else if (prop == "Latime") {
            if (data.Proprietati[prop] == "auto")
                $(id).css("width", "auto");
            else $(id).css("width", data.Proprietati[prop] + "px");
            fixAlign(data);
        }
        else if (prop == "Inaltime"){
            if (data.Proprietati[prop] == "auto")
                $(id).css("height", "auto");
            else $(id).css("height", data.Proprietati[prop] + "px");
            fixAlign(data);
        }
        else if (prop == "Culoare Antet"){
            $(id + " thead").css("color", "#" + data.Proprietati[prop]);
        }
        else if (prop == "Culoare Text"){
            $(id + " tbody").css("color", "#" + data.Proprietati[prop]);
        }
        else if (prop == "Font Antet"){
            $(id + " thead").css("font-family", data.Proprietati[prop]);
        }
        else if (prop == "Font Text"){
            $(id + " tbody").css("font-family", data.Proprietati[prop]);
        }
        else if (prop == "Dimensiune Antet") {
            $(id + " thead").css("font-size", data.Proprietati[prop] + "px");
        }
        else if (prop == "Dimensiune Text") {
            $(id + " tbody").css("font-size", data.Proprietati[prop] + "px");
        }
        else if (prop == "Bold Antet") {
            if (data.Proprietati[prop] == "Da")
                $(id+ " thead").css("font-weight", "bold");
            else if (data.Proprietati[prop] == "Nu")
                $(id+ " thead").css("font-weight", "normal");
        }
        else if (prop == "Bold Text") {
            if (data.Proprietati[prop] == "Da")
                $(id+ " tbody").css("font-weight", "bold");
            else if (data.Proprietati[prop] == "Nu")
                $(id+ " tbody").css("font-weight", "normal");
        }
        else if (prop == "Bordura Orizontal") {
            ApplyHorizontalBorder(data, prop, id);
        }
        else if (prop == "Bordura Vertical") {
            ApplyVerticalBorder(data, prop, id);
        }
        else if (prop == "Bordura") {
            var borderColor = " #" + data.Proprietati["Culoare Bordura"];
            $(id).css("border", data.Proprietati[prop] + borderColor);
        }
        else if (prop == "Placeholder") {
            $(id).attr("placeholder", data.Proprietati[prop]);
        }
        else if (prop == "Stil") {
            ApplyStyle(data, prop, id);
        }
        else if (prop == "Pozitie") {
            id = "#" + data.Proprietati.ID;
            $(id).css("position", "absolute");
            
            $(id).css("left", data.Proprietati[prop].X + "px");
            $(id).css("top", data.Proprietati[prop].Y + "px");
        }
    }
    
    if (data.Nume == "Tabel") { 
        GenerateTable(data, data.Proprietati.ID);
    }

}

function getElementsID(ObjArray, type, result) {    
    for (var i = 0; i < ObjArray.length; i++) {
        var element = ObjArray[i];
        
        if (element.Nume == type) {
            result.push(element.Proprietati["ID"]);
        }
    }
}

function fixSpan(id) {
    if ($(id).val() == "") {
        var $span = $(id).siblings("span");
        if ($span.css("display") != "hidden")
            $span.css("display", "inline-block");
        $span.css("width", "100%");
        $span.css("height", "30px");
    }
}

function fixAlign(obj) {
    var span = $("#" + obj.Proprietati.ID).find("span");
    span.css("display", "table-cell");
    span.css("height", obj.Proprietati.Inaltime);
    span.css("width", obj.Proprietati.Latime);
}

function ApplyHorizontalBorder(data, prop, id) {
    var text = data.Proprietati[prop] + " black";
    var size = text.match(/\d+/)[0];
    var verticalSize = data.Proprietati["Bordura Vertical"] + " black";
    
    if  (size != 0) {
        $(id + "tbody table, tr, td").css("border-bottom", text);
        $(id + "tbody table, tr, td").css("border-top", text);
        $(id + " tbody, thead").css("border-bottom", text);
        $(id + " tbody, thead").css("border-top", text);
    }
    else if (size == 0) {
        $(id + " table, tr, td").css("border-bottom", text);
        $(id + " table, tr, td").css("border-top", text);
        $(id + " tbody, thead").css("border-bottom", verticalSize);
        $(id + " tbody, thead").css("border-top", verticalSize);
    }
}

function ApplyVerticalBorder(data, prop, id) {
    var text = data.Proprietati[prop] + " black";
    var size = text.match(/\d+/)[0];
    var horizontalSize = data.Proprietati["Bordura Orizontal"] + " black";
    
    if (size != 0) {
        $(id + " table, tr, td").css("border-left", text);
        $(id + " table, tr, td").css("border-right", text);
        $(id + " tbody, thead").css("border-left", text);
        $(id + " tbody, thead").css("border-right", text);
    }
    else if (size == 0) {
        $(id + " table, tr, td").css("border-left", text);
        $(id + " table, tr, td").css("border-right", text);
        $(id + " tbody, thead").css("border-left", horizontalSize);
        $(id + " tbody, thead").css("border-right", horizontalSize);
    }
}

function ApplyStyle(data, prop, id) {
    var selStil = data.Proprietati[prop];
    var color1 = "#" + data.Proprietati["Culoare 1"];
    var color2 = "#" + data.Proprietati["Culoare 2"];
    var color3 = "#" + data.Proprietati["Culoare 3"];

    if (selStil == "Stilul 1") {
        $(id + " thead").css("background-color", color1);
        $(id + " tbody tr:odd td").css("background-color", color2);
        $(id + " tbody tr:even td").css("background-color", color3);
    }
    else if (selStil == "Stilul 2") {
        $(id + " thead").css("background-color", color1);
        $(id + " tbody td:nth-child(2n+1)").css("background-color", color2);
        $(id + " tbody td:nth-child(2n)").css("background-color", color3);
    }
    else if (selStil == "Stilul 3") {
        $(id + " thead td").css("background-color", color1);
        $(id + " tbody td").css("background-color", color3);
        $(id + " tbody td:first-child").css("background-color", color2);
    }
}

function initStripLinesY(option, num) {
    var stripLines = [];
    
    for (var i = 0; i < num; i++) {
        var line = {
            value: 0,
            label: "",
            showOnTop: true,
            opacity: 0
        }
        stripLines.push(line);
    }

    if (!option.axisY)
        option.axisY = [];

    option.axisY.stripLines = stripLines;
}

function initChart(Prop) {
    var options = { 
        title: { text: Prop["Titlu"] },
        zoomEnabled: true,
        panEnabled: true,
        animationEnabled: true,
        axisY:{
            includeZero: false
        },
        data: [ 
            {
                type: "line",
                dataPoints: []
            }
        ]
    };
    initStripLinesY(options, 10);
    
    var chart = new CanvasJS.Chart(Prop["ID"], options);
    chart.render();
    
    return chart;
}

function GenerateTable(obj, ID) {
    $("#" + obj.Proprietati.ID).css("width", "auto");
    $("#" + obj.Proprietati.ID).css("heigth", "auto");
    
    var TDs = "";
    var fields = obj.Proprietati.Campuri;
    
    for (var f in fields) {
        TDs += "<td>" + fields[f] + "</td>";
    }
    
    var TR = "<tr>" + TDs + "</tr>";
    $("#" + obj.Proprietati.ID + " tbody tr").remove();
    $("#" + obj.Proprietati.ID + " thead tr").remove();
    $("#" + obj.Proprietati.ID + " thead").append(TR);
    
    var location = "#" + obj.Proprietati.ID + " tbody";
    getDataFromServer(obj, location);
}

function getDataFromServer(obj, location) {
    $.getJSON("../../json/tabele.json", function(data) {
        var campuri = obj.Proprietati["Campuri"];
        var fields = [];

        for (var i = 0; i < data.length; i++) {
            if (obj.Proprietati["Baza de date"] == data[i].numeDB) {             
                var tabele = data[i].tabele;
                for (var j = 0; j < tabele.length; j++) {
                    if (obj.Proprietati["Tabel"] == tabele[j].nume) {
                        fields = findSQLFields(campuri, tabele[j]);
                        break;
                    }
                }
            }
        }
        
        $.ajax({
            url: "../../php/Data/CP_genTable.php",
            method: 'POST',
            dataType: 'html',
            data: {
                DBName: obj.Proprietati["Baza de date"],
                tableName: obj.Proprietati["Tabel"],
                tableFields: fields,
                tableAlias: obj.Proprietati["Campuri"]
            },
            success: function(data) {
                $(location).append(data);
                $("#" + obj.Proprietati.ID).css("width", "auto");
                $("#" + obj.Proprietati.ID).css("heigth", "auto");
                ApplyStyle(obj, "Stil", "#" + obj.Proprietati.ID);
                ApplyHorizontalBorder(obj, "Bordura Orizontal", "#" + obj.Proprietati.ID);
                ApplyVerticalBorder(obj, "Bordura Vertical", "#" + obj.Proprietati.ID);

                $("#" + obj.Proprietati.ID).trigger('update');
            },
            error: function(err) {
                console.log(err);
            }
        });
    });
}

function findSQLFields(alias, tabel) {
    var fields = [];
    
    for (var i = 0; i < alias.length; i++) {
        for (var j = 0; j < tabel.alias_campuri.length; j++) {
            if (alias[i] == tabel.alias_campuri[j]) {
                fields.push(tabel.campuri[j]);
            }
        }
    }
    
    return fields;
}


function addStripLineToGraph(chart, index, value, label, color) {
    chart.axisY[0].stripLines[index].set("value", value);
    chart.axisY[0].stripLines[index].set("label", label);
    chart.axisY[0].stripLines[index].set("color", color);
    chart.axisY[0].stripLines[index].set("opacity", 1);
}

function addDataPointsToGraph(chart, data) {
    for (var i = 0; i < data.length; i++) {
        var X, Y, col = 0;

        $("#" + data[i].Table + " thead td").each(function() {
            col++;            
            if ($(this).text() == data[i].DataX) {
                var colX = "#" + data[i].Table + ' tbody td:nth-child(' + col + ')';
                X = $(colX).map(function(){
                    return $(this).text();
                }).get();
            }
            if ($(this).text() == data[i].DataY) {
                var colY = "#" + data[i].Table + ' tbody td:nth-child(' + col + ')';
                Y = $(colY).map(function(){
                    return $(this).text();
                }).get();
            }
        });

        if (X && Y) {
            X = convertDataToType(X);
            Y = convertDataToType(Y);

            if (X.length == Y.length) {
                var newSeries = {};
                var dataPoints = [];

                newSeries.type = data[i].Type;
                if (data[i].Type != "pie " && data[i].Type != "bubble" 
                        && data[i].Type !=  "stackedColumn" 
                        && data[i].Type != "stackedColumn100" 
                        && data[i].Type != "stackedArea" 
                        && data[i].Type != "stackedArea100"
                        && data[i].Type != "stackedBar" 
                        && data[i].Type !="stackedBar100"
                        && data[i].Type != "doughnut") {
                    newSeries.color = data[i].Color;
                }
                else { 
                    newSeries.colorSet = "colorset1";
                }

                for (var j = 0; j < X.length; j++) {
                    var dPoint = {x: X[j], y: Y[j]};
                    dataPoints.push(dPoint);
                }
                newSeries.dataPoints = dataPoints;
                newSeries.showInLegend = true;
                newSeries.legendText = data[i].DataY;

                chart.options.data.push(newSeries);
            }
        }
    }
    chart.render();
}

function applyDataChart(obj, chart) {
    if (!obj.Proprietati["Data"])
        return;

    var stripLines = obj.Proprietati["Data"][0];
    var dataTables = obj.Proprietati["Data"][1];

    if (dataTables) {
        addDataPointsToGraph(chart, dataTables);
    }

    if (stripLines) {
        for (var i = 0; i < stripLines.length; i++) {
            var value = stripLines[i].value;
            var label = stripLines[i].label;
            var color = stripLines[i].color;
            
            addStripLineToGraph(chart, i, value, label, color);
        }
    }
}

function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

function convertToDate(dateString)
{
    // First check for the pattern
    if(!/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateString))
        return null;

    // Parse the date parts to integers
    var parts = dateString.split("-");
    var day = parseInt(parts[2], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[0], 10);

    return new Date(year, month - 1, day);
}

function isValidNumber(n) {
    if(!/^[0-9]+$/.test(n))
        return false; 
    return true;
}

function convertDataToType(data) {
    data = data.map(function(x){
        if (isValidDate(x)) {
            return convertToDate(x);
        }
        else if(isValidNumber){
            return +x; 
        }               
    });
    return data;
}

function main() {
    var $_GET = getQueryParams(document.location.search);
    var programName = $_GET["program"];

    getObjectArray(programName);
}

$(document).ready(main());