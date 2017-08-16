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
        if ($(id).find("input").length) {
           	id = id + " input";
			$(id).on("focus", function() {
				$(this).blur();	
			});
        }
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
        else if (prop == "Valoare") {
            var InputText = parseText(data.Proprietati[prop]);
            $(id).attr("value", InputText);
        }
        else if (prop == "Stil") {
            ApplyStyle(data, prop, id);
        }
         else if (prop == "Title") {
        	chart.title.set("text", data.Proprietati[prop]);
        }
       		else if (prop == "Minimum") {
			if (data.Proprietati[prop] != null) {
			    var InputText = parseText(data.Proprietati[prop]);
			
				if (data.Proprietati[prop] == "null" || data.Proprietati[prop]== "") 
					chart.axisY[0].set("minimum", null);
				else chart.axisY[0].set("minimum", InputText);
			}
		}
		else if (prop == "Maximum") {
		    if (data.Proprietati[prop] != null) {
				var InputText = parseText(data.Proprietati[prop]);

				if (data.Proprietati[prop] == "null" || data.Proprietati[prop]== "") 
		        	chart.axisY[0].set("maximum", null);
				else chart.axisY[0].set("maximum", InputText);
		    }
		}
		else if (prop == "Highlight Start") {
			var InputText = parseText(data.Proprietati[prop]);
		
			if (data.Proprietati[prop] == "null" || data.Proprietati[prop] == "") 
		    	chart.axisY[0].stripLines[0].set("startValue", 0);
			else chart.axisY[0].stripLines[0].set("startValue", +InputText);
		}
		else if (prop == "Highlight End") {
			var InputText = parseText(data.Proprietati[prop]);
		
			if (data.Proprietati[prop] == "null" || data.Proprietati[prop] == "") 
		    	chart.axisY[0].stripLines[0].set("endValue", 0);
			else chart.axisY[0].stripLines[0].set("endValue", +InputText);
		}
		else if (prop == "Highlight Color") {
		    chart.axisY[0].stripLines[0].set("color", "#" + data.Proprietati[prop]);
		}
		else if (prop == "Highlight Opacity") {
			chart.axisY[0].stripLines[0].set("opacity", data.Proprietati[prop]);
		}	
        else if (prop == "Pozitie") {
            id = "#" + data.Proprietati.ID;
            $(id).css("position", "absolute");
            
            $(id).css("left", data.Proprietati[prop].X + "px");
            $(id).css("top", data.Proprietati[prop].Y + "px");
        }
    }
    
    if (data.Nume == "Tabel") { 
        PrintData(data, data.Proprietati.ID);

        $("#showData").on("click", function() {
            PrintData(data, data.Proprietati.ID);
        });
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
            showOnTop: false,
            opacity: 0, 
            thickness: 3,
            labelPlacement: "inside",
            labelBackgroundColor: "white",
    		labelFontWeight: "bold"
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
		axisX: {
			interval: 1,
			labelAngle: -70,
			valueFormatString: "DD/MM/YYYY"
		},
        data: [ 
            {
                type: "line", 
                dataPoints: []
            }
        ]
    };
    initStripLinesY(options, 15);
    
    var chart = new CanvasJS.Chart(Prop["ID"], options);
    chart.render();
    
    return chart;
}

function GenerateTable(obj, ID, whereClause) {
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
    getDataFromServer(obj, location, whereClause);
}

function getDataFromServer(obj, location, whereClause) {
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
                tableAlias: obj.Proprietati["Campuri"], 
                whereClause: whereClause
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
					newSeries.markerSize = 7;
                }
                else { 
                    newSeries.colorSet = "colorset1";
                }

                for (var j = 0; j < X.length; j++) {
                    var dPoint = {x: X[j], y: Y[j]};
                    dataPoints.push(dPoint);
                }
				var len = dataPoints.length;
				if (len > 0) {
					var interval = X[len - 1].getTime() - X[0].getTime();
					var timeDiff = Math.abs(interval);
					var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
					if (diffDays < 32) {
						chart.axisX[0].set("intervalType", "day");
						chart.axisX[0].set("interval", 1);
					}
					else if (diffDays >= 32 && diffDays < 64) {
						chart.axisX[0].set("intervalType", "day");
						chart.axisX[0].set("interval", 2);
					}
					else if (diffDays >= 64 && diffDays < 365 * 3) {
						chart.axisX[0].set("intervalType", "month");
						chart.axisX[0].set("interval", 1);
					}
					else {
						chart.axisX[0].set("intervalType", "year");
						chart.axisX[0].set("interval", 1);
					}
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

            addStripLineToGraph(chart, i + 1, value, label, color);
        }
    }
}

function isValidDate(dateString)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return false;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

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
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString))
        return null;

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[0], 10);
    var month = parseInt(parts[1], 10);
    var year = parseInt(parts[2], 10);

    return new Date(year, month - 1, day);
}

function isValidNumber(n) {
     if(!/^[0-9]+(\.[0-9]+)?$/.test(n))
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

function convertValueToType(data) {
    if (isValidDate(data)) {
        return convertToDate(data);
    }
    else if(isValidNumber(data)){
        return +data; 
    }               
}

function interpretData(variable) {
	var table;
	
	if (variable.match(/input[0-9]+/)) {
		if ($("#" + variable).length > 0) {
			variable = $("#" + variable  + " input").val();
			variable = convertValueToType(variable);
		}
	}
	else if (variable.match(/table[0-9]+/)) {
		var tableID;
		var tableData = variable.substr(variable.indexOf(":") + 1);
		
		if (variable.indexOf(":") > 0) 
			tableID = variable.substr(0, variable.indexOf(":"));
		else tableID = variable;
		
		if ($("#" + tableID).length > 0) {
			var functionData;
			
			if (tableData.match(/col\([^()]+\)/)) {
				functionData = tableData.match(/\([^()]+\)/)[0];
				functionData = functionData.substring(1, functionData.length - 1);
				var colHTML;
				var colArray = [];
				
				if (functionData == "@first") {
					colHTML = "#" + tableID + " tbody tr td:first-child";	
				}
				else if (functionData == "@last") {
					colHTML = "#" + tableID + " tbody tr td:last-child";	
				}
				else colHTML = "#" + tableID + " tbody tr td:nth-child(" + functionData + ")";	
				
				if($(colHTML).length > 0) {
					$.each($(colHTML), function() {
						colArray.push($(this)[0].innerHTML);
					});
					colArray = convertDataToType(colArray);
					variable = colArray;
				}
			}
			else if (tableData.match(/row\([^()]+\)/)) {
				functionData = tableData.match(/\([^()]+\)/)[0];
				functionData = functionData.substring(1, functionData.length - 1);
				var rowHTML;
				var rowArray = [];				
				
				if (functionData == "@first") {
					rowHTML = "#" + tableID + " tbody tr:first td";	
				}
				else if (functionData == "@last") {
					rowHTML = "#" + tableID + " tbody tr:last td";	
				}
				else rowHTML = "#" + tableID + " tbody tr:eq(" + (+functionData - 1) + ") td";

				
				if($(rowHTML).length > 0) {
					$.each($(rowHTML), function() {
						rowArray.push($(this)[0].innerHTML);
					});
					rowArray = convertDataToType(rowArray);
					variable = rowArray;
				}
				
			}
			else if (tableData.match(/data\([^()]+\)/)) {
				functionData = tableData.match(/\([^()]+\)/)[0];
				functionData = functionData.substring(1, functionData.length - 1);
				
				var colIndex = functionData.split(",")[0];
				var rowIndex = functionData.split(",")[1];
				var dataHTML;
				var dataValue;
				
				if (colIndex == "@first") {
					colIndex = "td:first-child";	
				}
				else if (colIndex == "@last") {
					colIndex = "td:last-child";		
				}
				else colIndex = "td:nth-child(" + colIndex + ")";
				
				if (rowIndex == "@first") {
					rowIndex = "tr:first-child";	
				}
				else if (rowIndex == "@last") {
					rowIndex = "tr:last-child";		
				}
				else rowIndex = "tr:eq(" + (+rowIndex - 1) + ")";
				
				dataHTML = "#" + tableID + " tbody " + rowIndex + " " + colIndex;
		
				if($(dataHTML).length > 0) {
					dataValue = $(dataHTML)[0].innerHTML;
					dataValue = convertValueToType(dataValue);
					variable = dataValue;
				}
			}
		}
	}
	
	return variable;
}

function parseText(string) {
	if (string[0] == "=") {
		var vars = string.match(/#[^#]+#/g);
				
		if (vars) {
			var numOfVars = vars.length;

			for (var i = 0; i < vars.length; i++) {
				vars[i] = vars[i].substring(1, vars[i].length - 1);
				vars[i] = interpretData(vars[i]);
			}

			for (var j = 0; j < numOfVars; j++) {
				if (vars[j].constructor === Array)
					string = string.replace(/#[^#]+#/, "[" + vars[j]+ "]");
				else string = string.replace(/#[^#]+#/, vars[j]);
			}
		}
		string = string.substring(1, string.length);
		string = math.eval(string);
	}
	
	return string;
}

function initDatePicker() {
    $(".PickDate").datepicker({ 
        dateFormat: "dd/mm/yy",
        altFormat: "dd/mm/yy",
        maxDate: '0',
        constrainInput: true,   // prevent letters in the input field
        firstDay: 1 // Start with Monday
        });

    $("#EndDate").datepicker("setDate", new Date());

    var d = new Date();
    var length = 30;

    d.setDate(d.getDate() - length);
    $("#StartDate").datepicker("setDate", d);

    $(".PickDate").on("click", function() {
        $(this).datepicker();
    });
}

function DateAndTimeShow() {
    var today = new Date();
    var D = today.getDate();
    var M = today.getMonth();
    var Y = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    M += 1;
    M = checkTime(M);
    D = checkTime(D);

    var dateAndTime = D + "/" + M + "/" + Y + "  " + h + ":" + m + ":" + s;

    $("#currentDate").text(dateAndTime);

    var t = setTimeout(DateAndTimeShow, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i; // add zero in front of numbers < 10
    }
    return i;
}
function convertToStdDate(date) {
    var D = date.getDate();
    var M = date.getMonth();
    var Y = date.getFullYear();
    M += 1;
    M = checkTime(M);
    D = checkTime(D);
    return Y + "-" + M + "-" + D;
}

function PrintData(data, ID) {
    var where = "";
    var start = $("#StartDate").datepicker('getDate');
    var end = $("#EndDate").datepicker('getDate');
   
    start = convertToStdDate(start);
    end = convertToStdDate(end);
    where = "data >='" + start + " 00:00:00' AND data <'" + end + " 00:00:00' ";
	
    GenerateTable(data, ID, where);
}

function createObjToPDF(text, size, font, bold, x, y) {
	var object = {
		"text": text,
		"font-size": size,
		"font-family": font,
		"bold": bold,
		"position": {
			"X": x,
			"Y": y
		}
	}

	return object;
}

function loadText() {
	var cod				= createObjToPDF(
								$("#Eticheta1 span").text(), 
								12, "Arial", true, 55, 20);
	var text1			= createObjToPDF(
								$("#Eticheta2 span").text(), 	
								16, "Arial", true, 20, 32);
	var analitText		= createObjToPDF(
								$("#Eticheta3 span").text(), 	
								12, "Arial", false, 20, 50);
	var analitVal		= createObjToPDF(
								$("#Eticheta4 span").text(), 	
								12, "Arial", true, 60, 50);
	var analizorText	= createObjToPDF(
								$("#Eticheta5 span").text(), 	
								12, "Arial", false, 20, 55);
	var analizorVal		= createObjToPDF(
								$("#Eticheta6 span").text(), 	
								12, "Arial", true, 60, 55);
	var antet1			= createObjToPDF(
								$("#Eticheta7 span").text(), 	
								14, "Arial", true, 50, 65);
	var serText			= createObjToPDF(
								$("#Eticheta8 span").text(), 	
								12, "Arial", false, 20, 72);
	var serVal1			= createObjToPDF(
								$("#Eticheta9 span").text(), 	
								10, "Arial", true, 70, 70);
	var serVal2			= createObjToPDF(
								$("#Eticheta10 span").text(), 	
								10, "Arial", true, 70, 75);
	var valTintaText	= createObjToPDF(
								$("#Eticheta11 span").text(), 	
								12, "Arial", false, 20, 80);
	var valTintaVal		= createObjToPDF(
								$("#input12 input").val(), 		
								12, "Arial", true, 70, 80);
	var valAdmisText	= createObjToPDF(
								$("#Eticheta13 span").text(), 	
								12, "Arial", false, 20, 85);
	var valAdmisVal		= createObjToPDF(
								$("#input14 input").val() + " - " + 
								$("#input15 input").val(), 		
								12, "Arial", true, 70, 85);
	var devStdText		= createObjToPDF(
								$("#Eticheta16 span").text(), 	
								12, "Arial", false, 20, 90);
	var devStdVal		= createObjToPDF(
								$("#input17 input").val(), 		
								12, "Arial", true, 70, 90);
	
	var sd1Text	= createObjToPDF(
						$("#Eticheta18 span").text() + ":",
						12, "Arial", false, 20, 100);
	var SD1Text	= createObjToPDF(
						$("#Eticheta20 span").text() + ":",
						12, "Arial", false, 70, 100);
	var sd2Text	= createObjToPDF(
						$("#Eticheta22 span").text() + ":",
						12, "Arial", false, 20, 105);
	var SD2Text	= createObjToPDF(
						$("#Eticheta24 span").text() + ":",
						12, "Arial", false, 70, 105);
	var sd3Text	= createObjToPDF(
						$("#Eticheta26 span").text() + ":",
						12, "Arial", false, 20, 110);
	var SD3Text	= createObjToPDF(
						$("#Eticheta28 span").text() + ":",
						12, "Arial", false, 70, 110);
	
	var sd1Val	= createObjToPDF(
						$("#input19 input").val(),
						12, "Arial", true, 40, 100);
	var SD1Val	= createObjToPDF(
						$("#input21 input").val(),
						12, "Arial", true, 90, 100);
	var sd2Val	= createObjToPDF(
						$("#input23 input").val(),
						12, "Arial", true, 40, 105);
	var SD2Val	= createObjToPDF(
						$("#input25 input").val(),
						12, "Arial", true, 90, 105);
	var sd3Val	= createObjToPDF(
						$("#input27 input").val(),
						12, "Arial", true, 40, 110);
	var SD3Val	= createObjToPDF(
						$("#input29 input").val(),
						12, "Arial", true, 90, 110);
		
	var TextToLoad = [	
		cod, text1, analitText, analitVal, analizorText, analizorVal, 
		antet1, serText, serVal1, serVal2, valTintaText, valTintaVal, 
		valAdmisText, valAdmisVal, devStdText, devStdVal,
		sd1Text, SD1Text, sd2Text, SD2Text, sd3Text, SD3Text, 
		sd1Val, SD1Val, sd2Val, SD2Val, sd3Val, SD3Val
	];
	
	return TextToLoad;
}

function getImageFromUrl(url, callback) {
	var img = new Image, data, ret={data: null, pending: true};
	
	img.onError = function() {
		throw new Error('Cannot load image: "'+url+'"');
	}
	img.onload = function() {
		var canvas = document.createElement('canvas');
		document.body.appendChild(canvas);
		canvas.width = img.width;
		canvas.height = img.height;

		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0);
		// Grab the image as a jpeg encoded in base64, but only the data
		data = canvas.toDataURL('image/PNG').slice('data:image/png;base64,'.length);
		// Convert the data to binary form
		data = atob(data)
		document.body.removeChild(canvas);

		ret['data'] = data;
		ret['pending'] = false;
		if (typeof callback === 'function') {
			callback(data);
		}
	}
	img.src = url;

	return ret;
}

function exportAsPDF() {
    $("#exportData").on("click", function() {
    	var pdf = new jsPDF("l", "mm", "a4");		
		var LogoUrl = $("#logo").attr("src");
		getImageFromUrl(LogoUrl, function(imgData) {
			pdf.addImage(imgData, 'PNG', 20, 10, 30, 14);
			
			var text = loadText();
			for (var i = 0; i < text.length; i++) {
				pdf.setFontSize(text[i]["font-size"]);
				pdf.setFont(text[i]["font-family"]);
				if (text[i]["bold"]) {
					pdf.setFontType("bold");
				}
				else {
					pdf.setFontType("normal");	
				}
				var splitText = pdf.splitTextToSize(text[i]["text"], 
								130 - text[i]["position"].X);
				pdf.text(text[i]["position"].X, 
						 text[i]["position"].Y, 
						 splitText);
			}
			
			var canvas = $("#Grafic33 .canvasjs-chart-canvas").get(0);
			var graphImage = canvas.toDataURL();
            pdf.addImage(graphImage, 'JPEG', 130, 20, 150, 90);

            pdf.fromHTML("#table32 table");

            pdf.save("test.pdf");
	    });
	});
}

function main() {
    var $_GET = getQueryParams(document.location.search);
    var programName = $_GET["program"];

    getObjectArray(programName);

    initDatePicker();
    DateAndTimeShow();
    exportAsPDF();
}

$(document).ready(main());
