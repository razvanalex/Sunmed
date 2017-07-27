function initTypesSoft() {
    $.getJSON("../../json/predefSofts.json", function(softs) {
        $.each(softs, function() {
            var object = `<div class="itemSoft">
                <div class="imageField"><img src="` + this.imagine + `"/></div>
                <div class="nameField"><span>` + this.nume + `</span></div>
                <div class="descriptionField">`+ this.descriere +`</div>
            </div>`;
            
            $("#selection").append(object);
        });
        
        $(".itemSoft").on("click", function() {
            $.each($(".itemSoft"), function() {
                $(this).removeClass("selected");
            });
            
            $(this).addClass("selected");
        });
    });
}

function buttons(sessionOpened) {
    $("#exitProgram").on("click", function() {
        window.location.href = "../Session/Admin/AdminPage.php";
    });
    
    $("#newProgram").on("click", function() {
        $("#InitWorkspace").css("visibility", "visible");
        $("#softContent").addClass("foreground_window");
        
        // Reset
        $("#numeSoft").val("");
        $.each($(".itemSoft"), function() {
            $(this).removeClass("selected");
        });
    });
    
    $("#openProgram").on("click", function() {
        OpenSoftWindow();
        $("#OpenWindow").css("visibility", "visible");
        $("#softContent").addClass("foreground_window");
    });
    
    $("#closeInit").on("click", function() {
        $("#InitWorkspace").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
    });
    
    $("#closeOpenWindow").on("click", function() {
        $("#OpenWindow").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
    });
    
    $("#closeCreateDBWindow").on("click", function() {
        $("#CreateDBWindow").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
    });
    
    $("#closeInfoWindow").on("click", function() {
        $("#InfoWindow").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
    });  
    
    $("#closeAddDataGraph").on("click", function() {
        $("#AddDataGraph").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
    }); 

    $("#create").on("click", function() {
        var itemSel = $("#selection").find(".selected");
        var ProgramName = $("#numeSoft").val();
        
        if (itemSel.length == 1 && ProgramName != "") {
            CreateProgram(ProgramName, sessionOpened);
        }
    });
}

function CreateProgram(name, sessionOpened) {
    var ObjArray = new Array();
    $("#status").hide();
    
    var path = "../../programe";
    $.ajax({
        url: '../Data/CreateFile.php',
        method: 'POST',
        dataType: 'html',
        data: {
            filename: name,
            dir: path
        },
        success: function(data) {
            sessionOpened = data;
            
            addProgramToJSON(name + ".json", path + "/");
            
            $("#InitWorkspace").css("visibility", "hidden");
            $("#softContent").removeClass("foreground_window");
            $("#toolbox #contentToolbox li").remove();
            $("#preview *").remove();
            
            InitToolbox(sessionOpened, ObjArray);
            
            $("#status").text("Fisier nou creat!");
            $("#status").show();
            $("#status").fadeOut(3000);
        },
        error: function(err) {
            $("#InitWorkspace").css("visibility", "hidden");
            $("#softContent").removeClass("foreground_window");
            $("#toolbox #contentToolbox li").remove();
            $("#preview *").remove();

            if (err.responseText == "Fisierul exista!")
                $("#status").text("Fisierul exista deja!");
            else $("#status").text("A aparut o eroare in timpul crearii!");
            
            $("#status").show();
            $("#status").fadeOut(10000);
            console.log(err);
        }
    });
}

function SaveProgram(name, obj) {
    $("#status").hide();
    
    $.ajax({
        url: '../Data/SaveFile.php',
        method: 'POST',
        dataType: 'html',
        data: {
            filename: name,
            object: obj
        },
        success: function(data) {
            $("#status").text("Salvat!");
            $("#status").show();
            $("#status").fadeOut(3000);
        },
        error: function(err) {
            $("#status").text("A aparut o eroare in timpul salvarii!");
            $("#status").show();
            $("#status").fadeOut(10000);
            console.log(err.responseText);
        }
    });
}

function addProgramToJSON(nume, dir) {
    var newSoft = {
        name: nume,
        path: dir
    };
    
    $.getJSON("../../json/programe.json", function(programe) {
        var exist = false;
        
         for (var i = 0; i < programe.length; i++) {
             if (programe[i].name == nume) {
                 exist = true;
             }
         }
         
         if (!exist) 
            programe.push(newSoft);

        $.ajax({
            url: '../Data/AddProgramToJSON.php',
            method: 'POST',
            dataType: 'html',
            data: {
                filename: "../../json/programe.json",
                programs: programe
            },
            success: function(data) {
                console.log("JSON has been successfuly updated!");
            },
            error: function(err) {
                console.log("ERROR JSON CREATION!");
                console.log(err);
            }
        });
    });
}

function OpenSoftWindow() {
   $.getJSON("../../json/programe.json", function(softs) {
        $(".itemOpen").remove();
        
        $.each(softs, function() {
            var object = `<div class="itemOpen">
                <div class="imageSoft"><img src="../../Resources/logosunmed.png"/></div>
                <div class="nameSoft"><span>` + this.name + `</span></div>
            </div>`;
            
            $("#ItemsBox").append(object);
        });
          
        var $span = $('.nameSoft span');
        $span.text(function (index, text) {
            return text.replace(/\W*\s(\S)*$/, '...');
        });
            
        $(".itemOpen").on("click", function() {
            $.each($(".itemOpen"), function() {
                $(this).removeClass("selected");
            });
            
            $(this).addClass("selected");
        });
        
        $("#openP").unbind().on("click", function() {
            var selected = $("#ItemsBox").find(".selected");
            if (selected) {
                $("#preview *").remove();
                $("#contentToolbox li").remove();
                $("#OpenWindow").css("visibility", "hidden");
                $("#softContent").removeClass("foreground_window");
                
                var name = selected.text().replace(/\s/g,'');
                var obj = softs.filter(function( obj ) {
                    return obj.name == name;
                });
                if (obj) {
                    getObjectArray(obj[0].path + name);
                }
                else console.log("Error finding path!");
            }
        });
    });
}

function getObjectArray(file) {
    $.getJSON(file, function(ObjArray) {
        InitToolbox(file, ObjArray);
        
        for (var i=0; i < ObjArray.length; i++)
            appendObject(ObjArray[i], "#preview");
    });
}

// ---------------- Program Utilities ----------------
function InitToolbox(name, ObjArray) {
    var id = 0;
    
    if (ObjArray.length > 0) {
        var lastObj = ObjArray[ObjArray.length - 1].Proprietati["ID"];
        id = +lastObj.replace( /^\D+/g, '');
    }
    
    $.getJSON("../../json/toolbox.json", function(tools) {
        $.each(tools, function() {
           $("#contentToolbox").append("<li class='toolItem'>" + this.Nume + "</li>");
        });

        $(".toolItem").on("click", function() {
            var index = $("#toolbox li").index(this);
            ObjArray = CrateObject(ObjArray, tools[index], ++id);
            selectObject("#preview", ObjArray[ObjArray.length - 1], ObjArray);
        });
    });
   
   selectOnClick("#preview", ObjArray);
   
    $("#saveProgram").unbind().on("click", function() {
        SaveProgram(name, ObjArray);
    });
      
    $("#viewPreview").on("click", function() {  
        window.location.href = './Preview.php?program=' + name;
    });
}

function CrateObject(array, data, id) {
    var object = $.extend(true, {}, data); // deep copy of object
    
    object.Cod = setText(data.Cod, data.Proprietati.Text);

    if (object.Proprietati.ID == "Formular") {
        if ($('*[id*=Formular]').length == 0) {
            object.Proprietati.ID += id;
            appendObject(object, "#preview");
            array.push(object);
        }
    }
    else {
        object.Proprietati.ID += id;
        appendObject(object, "#preview");
        array.push(object);
    }

    return array;
}

function setText(string, text) {
    return string.replace("#TEXT#", text);
}

function appendObject(data, place) {
    var newID = " id='" + data.Proprietati.ID + "'>";
    $(place).append(data.Cod.replace(">", newID));
    $("#" +  data.Proprietati.ID).addClass("newItem");
    
    applyProp(data, place);
}

function applyProp(data, place) {
    var id = "#" + data.Proprietati.ID;

    if (data.Nume == "Grafic") {
        var chart = initChart(data.Proprietati.ID);
    }

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
    
    if (data.Nume == "Grafic") {
        chart.render();
    }
}

function displayProp(obj, array) {
    var bool = ["Da", "Nu"];
    var fonts = ["Arial", "Arial Black", "Arial Narrow", "Calibri", "Candara", 
        "Century Gothic", "Franklin Gothic Medium", "Helvetica", "Lucida Grande", 
        "Optima", "Segoe UI", "Tahoma", "Trebuchet MS", "Verdana", "Book Antiqua",
        "Calisto MT", "Cambria", "Georgia", "Lucida Bright", "Palatino", "Perpetua", 
        "Rockwell", "Times New Roman", "Baskerville", "Consolas", "Courier New", 
        "Lucida Console", "Lucida Sans Typewriter", "Copperplate", "Papyrus", 
        "Brush Script MT" ];
    var textAlign = ["Stanga", "Dreapta", "Centrat", "Stanga-Dreapta"];
    var verticalAlign = ["Sus", "Mijloc", "Jos"];
    var DBs = [ "Nu" ];
    var Tables = [ "Nu" ];
    var Style = [ "Stilul 1", "Stilul 2", "Stilul 3"];
    var propertiesTab = $("#contentProperties ul");
    var Etichete = [ "Fara" ];
    var chartTypes = [ "area", "bar", "bubble", "doughnut", "scatter", "spline", 
        "pie", "line"];
    var chart;

    propertiesTab.empty();
    getElementsID(array, "Eticheta", Etichete);

    if (obj.Nume == "Grafic") {
        var chart = initChart(obj.Proprietati.ID);
        applyDataChart(obj, chart);
    }
     
    for(var prop in obj.Proprietati) {
        var val = obj.Proprietati[prop];
        var color;
        var ID = obj.Proprietati.ID + prop.replace(/\s/g,'');
        
        if (!isObject(val)) {
            if (prop == "Text" || prop == "Latime" || prop == "Inaltime"
                    || prop == "Dimensiune" || prop == "Dimensiune Antet" 
                    || prop == "Dimensiune Text" || prop == "Bordura Orizontal" 
                    || prop == "Bordura Vertical" || prop == "Bordura"
                    || prop == "Placeholder" || prop == "Valoare") {
                propertiesTab.append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span></span><input class='propInput' id='" + 
                    ID +"' value='" + val + "'/></div></li>");
            }
            
            else if (prop == "Fundal" || prop == "Culoare" || prop == "Culoare 1" 
                    || prop == "Culoare 2" || prop == "Culoare 3"
                    || prop == "Culoare Bordura" || prop == "Culoare Text"
                    || prop == "Culoare Antet" || prop == "Culoare Bordura") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    `<div class='propVal'><input class="propInput jscolor" id='` + 
                    ID +"' value='" + val + "'/></div></li>");
                    
                var input = propertiesTab.find("#" + ID)[0];
                color = new jscolor(input);
                color.borderColor = "#FFF";
                color.backgroundColor = "#666";
            }
            
            else if (prop == "Font" || prop == "Font Antet" 
                    || prop == "Font Text") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                fonts.sort();
                addOptions("#" + ID, obj.Proprietati[prop], fonts);
            }
            
            else if (prop == "Bold" || prop == "Bold Antet" 
                    || prop == "Bold Text") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                addOptions("#" + ID, obj.Proprietati[prop], bool);
            }
            
            else if (prop == "Italic") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" +
                    ID + "'></select></div></li>");
                    
                addOptions("#" + ID, obj.Proprietati[prop], bool);
            }
            
            else if (prop == "Aliniere orizontal") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                addOptions("#" + ID, obj.Proprietati[prop], textAlign);
            }
            
            else if (prop == "Aliniere vertical") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                addOptions("#" + ID, obj.Proprietati[prop], verticalAlign);
            }
            
            else if (prop == "Baza de date") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                AddDBs(obj, prop, DBs);
            }
                        
            else if (prop == "Tabel") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                AddTables(obj, prop, Tables);
            }
            
            else if (prop == "Stil") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                Style.sort();
                addOptions("#" + ID, obj.Proprietati[prop], Style);
            }
            
            else if (prop == "Eticheta") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + 
                    ID + "'></select></div></li>");
                    
                addOptions("#" + ID, obj.Proprietati[prop], Etichete);
            }
                        
            else if (prop == "Titlu") {
                propertiesTab.append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span></span><input class='propInput' id='" + 
                    ID +"' value='" + val + "'/></div></li>");
                
                chart.title.set("text", obj.Proprietati[prop]);
	            chart.render();
            }
            
            else {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'>" + val + "</div></li>");
            }    
        }
        else {
            if (prop == "Pozitie") {
                propertiesTab.append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span>Selecteaza</span><input class='propInput' id='" + 
                     ID + "' value='X=" + val.X + "; Y=" + val.Y + "'/></div></li>");
            }
            
            else if (prop == "Campuri") {
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal CampuriUl'><div id='" + ID + 
                    "'><span></span><ul style='height: 150px;'></ul></div></div></li>");
                AddFields(obj, prop);
            }
            
            else if (prop == "Data") { 
                continue;
            }
            
            else {
                var resTxt = "";
                for(var subprop in val) {
                   resTxt += subprop + "=" + val[subprop] + " ";
                }
                propertiesTab.append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'>" + resTxt + "</div></li>");
            }
        }
        
        editData(obj, prop, color, chart);
    }
 
    if (obj.Nume == "Tabel") {
        propertiesTab.append("<li class='toolItem'>" +
            "<div class='propBtn' id='" + 
            ID + "GenerateTable'><span>Genereaza tabel</span></div></li>");
        propertiesTab.append("<li class='toolItem'>" +
            "<div class='propBtn' id='" + 
            ID + "CreateDB'><span>Creeaza baza de date noua</span></div></li>");
        
        GenerateTable(obj, ID);
        
        $("#" + ID + "CreateDB").on("click", function() {
            $("#CreateDBWindow").css("visibility", "visible");
            $("#softContent").addClass("foreground_window");
            CreateTableAddDBs("#DBs");
        });
    }
    else if (obj.Nume == "Grafic") {
        propertiesTab.append("<li class='toolItem'>" +
            "<div class='propBtn' id='" + 
            ID + "AddData'><span>Adauga Data</span></div></li>");
            
        $("#" + ID + "AddData").on("click", function() {
            $("#AddDataGraph").css("visibility", "visible");
            $("#softContent").addClass("foreground_window");
            AddDataToChart(array, obj, chart);
        }); 
    }
        
    propertiesTab.append("<li class='toolItem'>" +
        "<div class='remove' id='" + 
        ID + "Remove'><span>Sterge</span></div></li>");
        
    switchSpanInput();
    
    $(".remove").on("click", function() {
        removeObject(obj, array);
    });
    
    $("#properties").animate({
        "right": "0px"
    });
}

function selectObject(place, data, array) {
    $(place).find(".ItemSelected").each(function() {
        $(this).draggable({
            disabled: true
        });
    });
    $(place).find(".ItemSelected").removeClass("ItemSelected");
    
    $(".move").remove();
    if ($("#" + data.Proprietati.ID).hasClass("INPUT1")) {
        var $input = $("#" + data.Proprietati.ID + " input");
        var width = $input.css("width").replace(/px/g, "");
        var height = $input.css("height").replace(/px/g, "");
        
        var pos_x = +width + 5;
        var pos_y = +height + 5;
            
        if ($("#" + data.Proprietati.ID).find(".move").length == 0)
            $("#" + data.Proprietati.ID).append("<div class='move'></div>");
            
        $(".move").css("top", pos_y + "px");
        $(".move").css("left", pos_x + "px");
    }
    
    $("#" + data.Proprietati.ID).addClass("ItemSelected");
    $("#" + data.Proprietati.ID).draggable({
        disabled: false,
        containment: place,
        drag: function() {
            var x = $(this).position().left;
            var y = $(this).position().top;
            
            data.Proprietati.Pozitie.X = x;
            data.Proprietati.Pozitie.Y = y;
            
            var id = "#" + data.Proprietati.ID + "Pozitie";
            var spanTxt = $(id).parent().find("span");
            
            $("#" + data.Proprietati.ID).css("height", data.Proprietati.Inaltime);
            $("#" + data.Proprietati.ID).css("width", data.Proprietati.Latime);

            $(spanTxt).text("X=" + x + "; Y=" + y + " ");
        }
    });
    displayProp(data, array);
}

function disableSelection(place) {
    $(place).bind().on("click", function() {
        $(".move").remove();
        $("#properties").animate({
            "right": "-300px"
        });
        $("#contentProperties ul").empty();
        var element = $(place).find(".ItemSelected");
        element.removeClass("ItemSelected");
        element.draggable({
            disabled: true
        });
    });
}

function selectOnClick(place, array) {
    $(place).bind().on("click", ".newItem", function(event) {
        var idItem = $(this).attr("id");
        for (var item in array) {
            if (array[item].Proprietati.ID == idItem) {
                selectObject(place, array[item], array);
            }
        }
      
        event.stopPropagation();
    });
    disableSelection(place);
}

function isObject(val) {
    if (val === null) { return false;}
    return ( (typeof val === 'function') || (typeof val === 'object') );
}

function switchSpanInput()
{
    var $inputSwitches = $("#contentProperties .convertSpanInput"),
    $inputs = $inputSwitches.find("input"),
    $spans = $inputSwitches.find("span");
     
    $spans.on("click", function() {
        var $this = $(this);
        $this.hide().siblings("input").show().focus().select();
    }).each(function() {
        var $this = $(this);
        $this.text($this.siblings("input").val());
    });
    
    $inputs.on("blur", function() {
        var $this = $(this);
        $this.hide().siblings("span").text($this.val()).show();
        $this.hide().siblings("span").css("display", "inline-block");
        $this.hide().siblings("span").css("width", "100%");
        $this.hide().siblings("span").css("height", "30px");
        
    }).on('keydown', function(e) {
        if (e.which == 9) {
            e.preventDefault();
            if (e.shiftKey) {
                $(this).blur().parent().prevAll($inputSwitches).first().find($spans).click();
            } else {
                $(this).blur().parent().nextAll($inputSwitches).first().find($spans).click();
            }
        }
    }).hide();
}

function editData(obj, prop, color, chart) {
    var id = "#" + obj.Proprietati.ID + prop.replace(/\s/g,'');
    var objID = "#" + obj.Proprietati.ID;

    if ($(objID).find("input").length)
        objID = objID + " input";
    
    if (prop == "Text") {
        fixSpan(id);
        $(id).keyup(function () {
            $(objID + " span").text($(this).val());
            obj.Proprietati[prop] = $(this).val();
        });
    }
    else if (prop == "Fundal") {
        color.idObj = objID;
        color.obj = obj;
        color.attribute = "background-color";
        color.prop = prop;
        color.onFineChange = 'editColor(this)';
    } 
    else if (prop == "Culoare") {
        color.idObj = objID;
        color.obj = obj;
        color.attribute = "color";
        color.prop = prop;
        color.onFineChange = 'editColor(this)';
    }
    else if (prop == "Font") {
        $(id).on("change", function() {
            var selFont = $(this).find(":selected").text();
            
            $(objID).css("font-family", selFont);
            obj.Proprietati[prop] = selFont;
        });
    }
    else if (prop == "Dimensiune") {
        fixSpan(id);
        $(id).keyup(function () {
            var maxSize = 100;
                
            if ($(this).val() <= maxSize) {
                $(objID).css("font-size", $(this).val() + "px");
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $(objID).css("font-size", maxSize + "px");
                obj.Proprietati[prop] = maxSize;
            }
            if ($(this).val() == "") {
                $(objID).css("font-size", 12 + "px");
                obj.Proprietati[prop] = 12;
                $(objID + prop + " span").text(12);
            }
        });
    }
    else if (prop == "Bold") {
        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Da")
                $(objID).css("font-weight", "bold");
            else if (selBool == "Nu")
                $(objID).css("font-weight", "normal");
            
            obj.Proprietati[prop] = selBool;
        });
    }
    else if (prop == "Italic") {
        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Da")
                $(objID).css("font-style", "italic");
            else if (selBool == "Nu")
                $(objID).css("font-style", "normal");
            
            obj.Proprietati[prop] = selBool;
        });
    }
    else if (prop == "Latime") {
        fixSpan(id);
        $(id).keyup(function () {
            if ($(this).val() != "auto") 
                $(objID).css("width", $(this).val() + "px");
            else $(objID).css("width", "auto");
            
            obj.Proprietati[prop] = $(this).val();
            if ($(this).val() == "") {
                $(objID).css("width", "auto");
                obj.Proprietati[prop] = "auto";
                $(objID + prop + " span").text("auto");
            }
            fixAlign(obj);
            if (obj.Nume == "Grafic") {
                chart.render();
            }
        });
    }
    else if (prop == "Inaltime") {
        fixSpan(id);
        $(id).keyup(function () {
            if ($(this).val() != "auto") 
                $(objID).css("height", $(this).val() + "px");
            else $(objID).css("height", "auto");
            
            obj.Proprietati[prop] = $(this).val();
            if ($(this).val() == "") {
                $(objID).css("height", "auto");
                obj.Proprietati[prop] = "auto";
                $(objID + prop + " span").text("auto");
            }
            fixAlign(obj);
            if (obj.Nume == "Grafic") {
                chart.render();
            }
        });
    }
    else if (prop == "Aliniere orizontal") {
        var oldVal = $(objID).css("text-align");

        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Stanga")
                $(objID).css("text-align", "left");
            else if (selBool == "Dreapta")
                $(objID).css("text-align", "right");
            else if (selBool == "Centrat")
                $(objID).css("text-align", "center");
            else if (selBool == "Stanga-Dreapta")
                $(objID).css("text-align", "justify"); 
            else $(objID).css("text-align", oldVal);
            
            obj.Proprietati[prop] = selBool;
            fixAlign(obj);
        });
    }
    else if (prop == "Aliniere vertical") {
        var oldVal = $(objID).css("vertical-align");

        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Sus")
                $(objID).find("span").css("vertical-align", "top");
            else if (selBool == "Mijloc")
                $(objID).find("span").css("vertical-align", "middle");
            else if (selBool == "Jos")
                $(objID).find("span").css("vertical-align", "bottom");
            else $(objID).find("span").css("vertical-align", oldVal);
            
            obj.Proprietati[prop] = selBool;
            fixAlign(obj);
        });
    }
    else if (prop == "Baza de date") {
        var SelectorDB = $(id);
        SelectorDB.on("change", function() {
            var selectedDB = SelectorDB.find(":selected").text();
            obj.Proprietati[prop] = selectedDB;
        });
    }
    else if (prop == "Tabel") {
        var SelectorTable = $(id);
        SelectorTable.on("change", function() {
            var selectedTable = SelectorTable.find(":selected").text();
            obj.Proprietati[prop] = selectedTable;
        });
    }
    else if (prop == "Campuri") {
         var span = $(id + " span");
         if (obj.Proprietati.Campuri.length == 0)
            span.text("Selecteaza");
        else {
            span.text(obj.Proprietati.Campuri);
            span.text(span.text().replace(/,/g, ", "));
        }

        var numeTable = $(id).val();
        var numeDB = $(id).val();    
        
        if (numeTable == "Nu" || numeDB == "Nu") {
            obj.Proprietati.Campuri = [];
            span.text("Selecteaza");
        }
    }
    else if (prop == "Culoare Antet") {
        color.idObj = objID + " thead";
        color.obj = obj;
        color.attribute = "color";
        color.prop = prop;
        color.onFineChange = 'editColor(this)';
    }
    else if (prop == "Culoare Text") {
        color.idObj = objID + " tbody";
        color.obj = obj;
        color.attribute = "color";
        color.prop = prop;
        color.onFineChange = 'editColor(this)';
    }
    else if (prop == "Font Antet") {
        $(id).on("change", function() {
            var selFont = $(this).find(":selected").text();
            $(objID + " thead").css("font-family", selFont);
            obj.Proprietati[prop] = selFont;
        });
    }
    else if (prop == "Font Text") {
        $(id).on("change", function() {
            var selFont = $(this).find(":selected").text();
            $(objID + " tbody").css("font-family", selFont);
            obj.Proprietati[prop] = selFont;
        });
    }
    else if (prop == "Dimensiune Antet") {
        fixSpan(id);
        $(id).keyup(function () {
            var maxSize = 100;
            if ($(this).val() <= maxSize) {
                $(objID + " thead").css("font-size", $(this).val() + "px");
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $(objID + " thead").css("font-size", maxSize + "px");
                obj.Proprietati[prop] = maxSize;
            }
            if ($(this).val() == "") {
                $(objID + " thead").css("font-size", 12 + "px");
                obj.Proprietati[prop] = 12;
                $(objID + prop + " span").text(12);
            }
        });
    }
    else if (prop == "Dimensiune Text") {
        fixSpan(id);
        $(id).keyup(function () {
            var maxSize = 100;
            if ($(this).val() <= maxSize) {
                $(objID + " tbody").css("font-size", $(this).val() + "px");
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $(objID + " tbody").css("font-size", maxSize + "px");
                obj.Proprietati[prop] = maxSize;
            }
            if ($(this).val() == "") {
                $(objID + " tbody").css("font-size", 12 + "px");
                obj.Proprietati[prop] = 12;
                $(objID + prop + " span").text(12);
            }
        });
    }
    else if (prop == "Bold Antet") {
        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Da")
                $(objID + " thead").css("font-weight", "bold");
            else $(objID + " thead").css("font-weight", "normal");
            
            obj.Proprietati[prop] = selBool;
        });
    }
    else if (prop == "Bold Text") {
        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
           
            if (selBool == "Da")
                $(objID + " tbody").css("font-weight", "bold");
            else $(objID + " tbody").css("font-weight", "normal");

            obj.Proprietati[prop] = selBool;
        });
    }
    else if (prop == "Bordura Orizontal") {
        fixSpan(id);
        $(id).keyup(function () {
            var maxSize = 10;
            var text = $(this).val() + " black";
            var size = text.match(/\d+/)[0];
            var verticalSize = obj.Proprietati["Bordura Vertical"] + " black";
            
            if  (size <= maxSize && size != 0) {
                $(objID + "tbody table, tr, td").css("border-bottom", text);
                $(objID + "tbody table, tr, td").css("border-top", text);
                $(objID + " tbody, thead").css("border-bottom", text);
                $(objID + " tbody, thead").css("border-top", text);
                obj.Proprietati[prop] = $(this).val();
            }
            else if (size == 0) {
                $(objID + " table, tr, td").css("border-bottom", text);
                $(objID + " table, tr, td").css("border-top", text);
                $(objID + " tbody, thead").css("border-bottom", verticalSize);
                $(objID + " tbody, thead").css("border-top", verticalSize);
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $(objID + "tbody table, tr, td").css("border-bottom", maxSize + "px solid black");
                $(objID + "tbody table, tr, td").css("border-top", maxSize + "px solid black");
                obj.Proprietati[prop] = maxSize + "px solid";
            }
            if ($(this).val() == "") {
                $(objID + "tbody table, tr, td").css("border-bottom", "1px solid black");
                $(objID + "tbody table, tr, td").css("border-top","1px solid black");
                obj.Proprietati[prop] = "1px solid";
            }
        });
    }
    else if (prop == "Bordura Vertical") {
        fixSpan(id);
        $(id).keyup(function () {
            var maxSize = 10;
            var text = $(this).val() + " black";
            var size = text.match(/\d+/)[0];
            var horizontalSize = obj.Proprietati["Bordura Orizontal"] + " black";
            
            if (size <= maxSize && size != 0) {
                $(objID + " table, tr, td").css("border-left", text);
                $(objID + " table, tr, td").css("border-right", text);
                $(objID + " tbody, thead").css("border-left", text);
                $(objID + " tbody, thead").css("border-right", text);
                obj.Proprietati[prop] = $(this).val();
            }
            else if (size == 0) {
                $(objID + " table, tr, td").css("border-left", text);
                $(objID + " table, tr, td").css("border-right", text);
                $(objID + " tbody, thead").css("border-left", horizontalSize);
                $(objID + " tbody, thead").css("border-right", horizontalSize);
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $(objID + " table, tr, td").css("border-left", maxSize + "px solid black");
                $(objID + " table, tr, td").css("border-right", maxSize + "px solid black");
                obj.Proprietati[prop] = maxSize + "px solid";
            }

            
            if ($(this).val() == "") {
                $(objID + "table, tr, td").css("border-left", "1px solid black");
                $(objID + "table, tr, td").css("border-right","1px solid black");
                obj.Proprietati[prop] = "1px solid";
            }
        });
    }
    else if (prop == "Stil") {
        $(id).on("change", function() {
            var selStil = $(this).find(":selected").text();
            var color1 = "#" + $("#" + obj.Proprietati.ID + "Culoare1").val();
            var color2 = "#" + $("#" + obj.Proprietati.ID + "Culoare2").val();
            var color3 = "#" + $("#" + obj.Proprietati.ID + "Culoare3").val();

            if (selStil == "Stilul 1") {
                $(objID + " thead").css("background-color", color1);
                $(objID + " tbody tr:odd td").css("background-color", color2);
                $(objID + " tbody tr:even td").css("background-color", color3);
            }
            else if (selStil == "Stilul 2") {
                $(objID + " thead").css("background-color", color1);
                $(objID + " tbody td:nth-child(2n+1)").css("background-color", color2);
                $(objID + " tbody td:nth-child(2n)").css("background-color", color3);
            }
            else if (selStil == "Stilul 3") {
                $(objID + " thead").css("background-color", color1);
                $(objID + " tbody td").css("background-color", color3);
                $(objID + " tbody td:first-child").css("background-color", color2);
            }
            obj.Proprietati[prop] = selStil;
        });
    }
    else if (prop == "Culoare 1") {
        color.idObj = objID + " thead";
        color.obj = obj;
        color.attribute = "background-color";
        color.prop = prop;
        color.onFineChange = 'editColor(this)';
    }
    else if (prop == "Culoare 2") {
        var color2Box = "#" + obj.Proprietati.ID + "Culoare2";
        $(color2Box).on("click", function() {
            if (obj.Proprietati["Stil"] == "Stilul 1") {
                color.idObj = objID + " tbody tr:odd td";
            }
            else if (obj.Proprietati["Stil"] == "Stilul 2") {
                color.idObj = objID + " tbody td:nth-child(2n+1)";
            }
            else if (obj.Proprietati["Stil"] == "Stilul 3") {
                color.idObj = objID + " tbody td:first-child";
            }
    
            color.obj = obj;
            color.attribute = "background-color";
            color.prop = prop;
            color.onFineChange = 'editColor(this)';
        });
    }
    else if (prop == "Culoare 3") {
        var color3Box = "#" + obj.Proprietati.ID + "Culoare3";
        $(color3Box).on("click", function() {
            if (obj.Proprietati["Stil"] == "Stilul 1") {
                color.idObj = objID + " tbody tr:even td";
            }
            else if (obj.Proprietati["Stil"] == "Stilul 2") {
                color.idObj = objID + " tbody td:nth-child(2n)";
            }
            else if (obj.Proprietati["Stil"] == "Stilul 3") {
                color.idObj = objID + " tbody td";
            }
            
            color.obj = obj;
            color.attribute = "background-color";
            color.prop = prop;
            color.onFineChange = 'editColor(this)';
            
            if (obj.Proprietati["Stil"] == "Stilul 3") {
                var color3 = $("#" + obj.Proprietati.ID + "Culoare3");
                color3.on("change", function() {
                    var color2 = $("#" + obj.Proprietati.ID + "Culoare2");
                    $(objID + " tbody td:first-child").css("background-color", "#" + color2.val());
                });
            }
            
        });
    }
    else if (prop == "Bordura") {
        fixSpan(id);
        $(id).keyup(function () {
            var maxSize = 10;
            var text = $(this).val();
            var size = text.match(/\d+/)[0];
            var color = "#" + obj.Proprietati["Culoare Bordura"];
            
            if (size <= maxSize) {
                $(objID).css("border", size + "px solid" + color);
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $(objID).css("border", maxSize + "px solid" + color);
                obj.Proprietati[prop] = maxSize + "px solid";
            }

            if ($(this).val() == "") {
                $(objID).css("border", "1px solid" + color);
                obj.Proprietati[prop] = "1px solid";
            }
            
        });
    }
    else if (prop == "Culoare Bordura") {
        color.idObj = objID;
        color.obj = obj;
        color.attribute = "border-color";
        color.prop = prop;
        color.onFineChange = 'editColor(this)';
    }
    else if (prop == "Placeholder") {
        fixSpan(id);
        $(id).keyup(function () {
            $(objID).attr("placeholder", $(this).val());
            obj.Proprietati[prop] = $(this).val();
        });
    }
    else if (prop == "Eticheta") {
        $(id).on("change", function() {
            var selFont = $(this).find(":selected").text();
            obj.Proprietati[prop] = selFont;
        });
    }
    else if (prop == "Valoare") {
        fixSpan(id);
        $(id).keyup(function () {
            $(objID).attr("placeholder", $(this).val());
            obj.Proprietati[prop] = $(this).val();
        });
    }
    else if (prop == "Titlu") {
        fixSpan(id);
        $(id).keyup(function () {
            chart.title.set("text", $(this).val());
            obj.Proprietati[prop] = $(this).val();
            chart.render();
        });
    }
    else if (prop == "Pozitie") {
        objID = "#" + obj.Proprietati.ID;
        $("ItemSelected").css("width", "auto");
        $("ItemSelected").css("heigth", "auto");
        
        fixSpan(id);
        $(id).keyup(function () {
            var X = $(this).val().split(';')[0];
            var Y = $(this).val().split(';')[1];
            
            X = X.split('=')[1];
            Y = Y.split('=')[1];
            
            $(objID).css("left", X + "px");
            $(objID).css("top", Y + "px");
            obj.Proprietati[prop].X = X;
            obj.Proprietati[prop].Y = Y;
        });
    }
}

function editColor(color) {
    var HEXcolor = color.toHEXString();
    var obj = color.obj;
    var id = color.idObj;
    var attr = color.attribute;
    var prop = color.prop;
    
    $(id).css(attr, HEXcolor);
    obj.Proprietati[prop] = HEXcolor.substring(1, HEXcolor.length);
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

function getElementsID(ObjArray, type, result) {    
    for (var i = 0; i < ObjArray.length; i++) {
        var element = ObjArray[i];
        
        if (element.Nume == type) {
            result.push(element.Proprietati["ID"]);
        }
    }
}

function addOptions(selection, prop, array) {
    for (var val in array) {
        $(selection).append($('<option>', {
            value: array[val], 
            text: array[val]
        }));
    }
    
    $(selection).val(prop);
}

function removeObject(object, array) {
    for (var i=0; i < array.length; i++) {
        if (array[i].Proprietati.ID == object.Proprietati.ID) {
            $("#" + array[i].Proprietati.ID).remove();
            array.splice(i, 1);
            $("#contentProperties ul").empty();
        }
    }
}

function AddDBs(obj, prop, DBs) {
    $.getJSON("../../json/tabele.json", function(data) {
        var idProp = "#" + obj.Proprietati.ID + prop.replace(/\s/g,'');
        var idDbs = "#" + obj.Proprietati.ID + "Bazadedate";
        var idTabels = "#" + obj.Proprietati.ID + "Tabel";
        
        $.each(data, function() {
            DBs.push(this.numeDB);
        });
        $(idDbs).on("change", function() {
            $(idProp + " span").text("Selecteaza");
            
            var firstOption = $(idTabels + " option:first");
            $(idTabels).val(firstOption.val());
            
            obj.Proprietati.Campuri = [];
        });
        addOptions(idDbs, obj.Proprietati[prop], DBs);
    });
}

function CreateArrayTables(data, obj, prop, Tables) {
    $.each(data, function() {
        var DB = this;
        var idDbs = "#" + obj.Proprietati.ID + "Bazadedate";
        var idTabels = "#" + obj.Proprietati.ID + "Tabel";
        
        Tables.length = 0;
        Tables.push("Nu");
        
        var selectedDB = $(idDbs).find(":selected").text();
        if (DB.numeDB == selectedDB) {
            $.each(DB.tabele, function() {
                Tables.push(this.nume);
            });
            $(idTabels + " option").remove();
            addOptions(idTabels, obj.Proprietati[prop], Tables);
        }
        else if (selectedDB == "Nu") {
            Tables.length = 0;
            Tables.push("Nu");
            
            $(idTabels + " option").remove();
            addOptions(idTabels, obj.Proprietati[prop], Tables);
        }
    });
}

function AddTables(obj, prop, Tables) {
    $.getJSON("../../json/tabele.json", function(data) {
        var idTabels = "#" + obj.Proprietati.ID + "Tabel";
        var idDbs = "#" + obj.Proprietati.ID + "Bazadedate";
         
        $(idTabels + " option").remove();
        addOptions(idTabels, obj.Proprietati[prop], Tables);
        CreateArrayTables(data, obj, prop, Tables);
        
        $(idDbs).bind().on("change", function() {
            resetFields(obj, prop);
            CreateArrayTables(data, obj, prop, Tables);
            
            var firstOption = $(idTabels + " option:first");
            $(idTabels).val(firstOption.val());
        });
    });
}

function MultiCheckbox(selection, obj, prop, array) {
    for (var val in array) {
        $(selection).append(`<li><input type="checkbox" value="` + 
                        array[val] + `"/>` + array[val] + `</li>`);
        var input = selection + " input[value='" + array[val] + "']";
        
        if (obj.Proprietati.Campuri.indexOf(array[val]) >= 0) {
            $(input).prop('checked', true);
        }
        else $(input).prop('checked', false);
    }
    $(selection).val(prop);
}

function CreateField(obj, prop, data) {
    var idProp = "#" + obj.Proprietati.ID + prop.replace(/\s/g,'');
    var idDbs = "#" + obj.Proprietati.ID + "Bazadedate";
    var idTabels = "#" + obj.Proprietati.ID + "Tabel";
    
    var numeTable = $(idTabels).val();
    var numeDB = $(idDbs).val();
    var Fields = [];
    var span = $(idProp + " span");

    for (var DB in data) 
        if (numeDB == data[DB].numeDB)
            for (var tabel in data[DB].tabele) {
                if (numeTable == data[DB].tabele[tabel].nume)  {
                    for (var camp in data[DB].tabele[tabel].alias_campuri) {
                        Fields.push(data[DB].tabele[tabel].alias_campuri[camp]);
                    }
                }
            }
            
    $(idProp + " li").remove();
    
    MultiCheckbox(idProp + " ul", obj, obj.Proprietati[prop], Fields);
    $(idProp + " ul").val($(idProp + " option:first").val());
    
    $(idProp + " input:checkbox").change(function() {
        var textChk = $(this).val();
        var array = obj.Proprietati.Campuri;
        
        if (this.checked) {
            array.push(textChk);
        }
        else {
            var index = array.indexOf(textChk);
            array.splice(index, 1);
        }
        
        if (array.length != 0) {
            span.text(array);
            span.text(span.text().replace(/,/g, ", "));
        }
        else {
            resetFields(obj, prop);
        }
        obj.Proprietati.Campuri = array;

    });

}

function AddFields(obj, prop) {
    $.getJSON("../../json/tabele.json", function(data) {
        var idProp = "#" + obj.Proprietati.ID + prop.replace(/\s/g,'');
        var idTabels = "#" + obj.Proprietati.ID + "Tabel";
        var SelectBlock =  $(idProp + " ul");
         
        SelectBlock.hide();
        $(idProp + " span").on("click", function() {
            SelectBlock.toggle();
        });
        
        CreateField(obj, prop, data);
        $(idTabels).on("change", function() {
            resetFields(obj, prop);
            CreateField(obj, prop, data);
        });
    });
}

function resetFields(obj, prop) {
    var span = $("#" + obj.Proprietati.ID + "Campuri span");
    var options = $("#" + obj.Proprietati.ID + "Campuri ul li");
    
    options.remove();
    obj.Proprietati.Campuri = [];
    span.text("Selecteaza");
}

function GenerateTable(obj, ID) {
    $("#" + ID + "GenerateTable").on("click", function() {
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
    });
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
            },
            error: function(err) {
                console.log(err);
                $(location).append("<td style='color:darkred;'>An error has occured while generating the table!</td>");
            }
        });
    });
}


function CreateTableAddDBs(selection) {
    $.getJSON("../../json/tabele.json", function(data) {
        var DBs = [ "Selecteaza" ];
        $.each(data, function() {
            DBs.push(this.numeDB);
        });

        $(selection).css("max-height", "200px");
        $(selection + " option").remove();
        addOptions(selection, DBs[0], DBs);
        
        $("#StergeDB").unbind().on("click", function() {
            var index = $(selection).prop('selectedIndex');
            var selected = $(selection).find(":selected").val();
            
            for (var i = 0; i < data.length; i++) {
                if (data[i].numeDB == selected) {
                    data.splice(i, 1);
                }
            }
            
            sendAjaxDropDB(selected, index, selection, data);
        });
        
        $("#CreateDB").on("click", function() {
            $("#numeDBNouInput").val("");
            $("#NameWindow").css("visibility", "visible");
            $("#NameWindow").css("z-index", "50");
            $("#NameWindow").css("top", "150px");
            
            $("#closeNameWindow").on("click", function() {
                $("#NameWindow").css("visibility", "hidden");
                $("#CreateDBWindow").removeClass("foreground_window");
            }); 
            
            $("#CreateDBBtn").unbind().on("click", function() {
                $("#NameWindow").css("visibility", "hidden");
                $("#CreateDBWindow").removeClass("foreground_window");
                
                var nameDB = $("#numeDBNouInput").val();
                var newDB = new Object();
                
                newDB.numeDB = nameDB;
                newDB.tabele = [];
                data.push(newDB);
                
                sendAjaxCreateDB(nameDB, selection, data);
            }); 
        });
    });
    
    $("#numeTabelNou").val("");
    addTableRow();
    
    $("#CreateTable").on("click", function() {
        createNewTableBtn();
    });
    
}

function sendAjaxCreateDB(name, selection, DBs) {
    $.ajax({
        url: "../../php/Databases/CreateDB.php",
        method: "POST",
        dataType: "html",
        data: {
            DBName: name,
            Tabele: DBs
        },
        success: function(data) {
            $("#InfoWindow").css("height", "150px");
            $("#InfoWindow").css("top", "150px");
            $("#InfoWindow").css("visibility", "visible");
            $("#TextInfo").text(data);

            $(selection).append($('<option>', {
                value: name, 
                text: name
            }));
            
            $("").append($('<option>', {
                value: name, 
                text: name
            }));
            
            $("#OKbtn").on("click", function() {
                $("#InfoWindow").css("visibility", "hidden");
            });
        },
        error: function(err) {
            $("#InfoWindow").css("visibility", "visible");
            $("#InfoWindow").css("height", "250px");
            
            $("#TextInfo").text(err.responseText);
            console.log(err.responseText);
            
            $("#OKbtn").on("click", function() {
                $("#InfoWindow").css("visibility", "hidden");
            });
        }
    });
}

function sendAjaxDropDB(name, index, selection, DBs) {
    $.ajax({
        url: "../../php/Databases/RemoveDB.php",
        method: "POST",
        dataType: "html",
        data: {
            DBName: name,
            Tabele: DBs
        },
        success: function(data) {
            $("#InfoWindow").css("height", "150px");
            $("#InfoWindow").css("visibility", "visible");
            $("#TextInfo").text(data);
            $(selection + " option").eq(index).remove();
            
            $("#OKbtn").on("click", function() {
                $("#InfoWindow").css("visibility", "hidden");
            });
        },
        error: function(err) {
            $("#InfoWindow").css("visibility", "visible");
            $("#InfoWindow").css("height", "250px");
            
            $("#TextInfo").text(err.responseText);
            console.log(err.responseText);
            
            $("#OKbtn").on("click", function() {
                $("#InfoWindow").css("visibility", "hidden");
            });
        }
    });
}

function addTableRow() {
    $("#contentCTable div").remove();
    var index = 0;
    var numDivs = 0;
    createRow(index);
    
    $('#contentCTable').unbind().on("focusin", "div", function() {
        var $inputs = $(this).find("input");
        var $div = $(this);
        
        $('#contentCTable div').removeClass("selectedRow");
        if ($div.index() == numDivs) {
            $(".lastItemInRow").removeClass("lastItemInRow");
            $(this).addClass("selectedRow");
            createRow(++index);
            numDivs++;
        }
        else {
            $(this).addClass("selectedRow");
        }
        
        $(this).on("focusout", "input", function() {
            if (numDivs > 1 
                    && $inputs[0].value == "" 
                    && $inputs[1].value == ""
                    && $inputs[2].value == "") {
                numDivs--;
                index++;
                $div.remove();
            }
        });

    });
}

function createRow(id) {
    $("#contentCTable").append(`<div class="RawItemTable lastItemInRow">
        <input class="firstInput" type="text" id="first` + id + `" value="">
        <input class="secondInput" type="text" id="second` + id + `" value="">
        <input class="thirdInput" type="text" id="third` + id + `" value="">
    </div>`);
}

function createNewTableBtn() {
    var fields = $("#contentCTable").find(".RawItemTable");
    var DBName = $("#DBs").find(":selected").val();
    var TableName = $("#numeTabelNou").val();
    var mySQLStatement = "CREATE TABLE " + TableName + " (";
    var AliasName = [];
    var Campuri = [];
    
    for (var i = 0; i < fields.length; i++) {
        var $input1 = $(fields[i]).find("input")[0].value;
        var $input2 = $(fields[i]).find("input")[1].value;
        var $input3 = $(fields[i]).find("input")[2].value;
        
        if ($input1 != "" && $input2 != "" && $input3 != "") {
            if (i < fields.length - 2) {
                mySQLStatement += $input1 + " " + $input3 + ", ";
            }
            else {
                mySQLStatement += $input1 + " " + $input3 + ")";
            }
            AliasName.push($input2);
            Campuri.push($input1);
        }
    }
    
    sendAjaxCreateTable(DBName, mySQLStatement, AliasName, Campuri, TableName);
}

function sendAjaxCreateTable(DBName, mySQLStatement, AliasName, Campuri, NumeTabel) {
    $.getJSON("../../json/tabele.json", function(data) {
        var newTable = {};
        
        newTable.nume = NumeTabel;
        newTable.campuri = Campuri;
        newTable.alias_campuri = AliasName;
        
        for (var i = 0; i < data.length; i++) {
            if (data[i].numeDB == DBName) {
                if (!data[i].tabele)
                    data[i].tabele = [];
                data[i].tabele.push(newTable);
                break;
            }
        }
        
        $.ajax({
            url: "../../php/Databases/CreateTable.php",
            method: "POST",
            dataType: "html",
            data: {
                DBName: DBName,
                mySqlStatement: mySQLStatement,
                aliasName: AliasName, 
                Tabel: NumeTabel,
                data: data
            },
            success: function(data) {
                $("#InfoWindow").css("height", "150px");
                $("#InfoWindow").css("visibility", "visible");
                $("#TextInfo").text(data);
                
                $("#OKbtn").on("click", function() {
                    $("#InfoWindow").css("visibility", "hidden");
                });
            },
            error: function(err) {
                $("#InfoWindow").css("visibility", "visible");
                $("#InfoWindow").css("height", "250px");
                
                $("#TextInfo").text(err.responseText);
                console.log(err.responseText);
                
                $("#OKbtn").on("click", function() {
                    $("#InfoWindow").css("visibility", "hidden");
                });
            }
        });
    });
}

function AddDataToChart(array, obj, chart) {
    $("#dataSection .dataGraphRow").remove();

    $("#AddConstData").unbind().on("click", function() {
        appendConstData(array, "const");
    });

    $("#AddTabelData").unbind().on("click", function() {
        appendConstData(array, "XYData");
    });

    $("#AddDataOkBtn").unbind().on("click", function() {
        convertDataGraph(obj, 10);
        applyDataChart(obj, chart);

        $("#AddDataGraph").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
        $("#dataSection .dataGraphRow").remove();
    });
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

function convertDataGraph(obj, max) {
    var index = 0;
    var data = [];
    var stripLines = [];

    $(".dataGraphRow").each(function() {
        var type = $(this).find(".dataGraphCell")[0].innerHTML;
        if (type == "Const.") {
            var iValue = $(this).find("select")[0].value;
            var iColor = $(this).find("input")[0];
            var iText = $(this).find("input")[1].value;
            iColor = $(iColor).css("background-color");

            if ($("#" + iValue).find("input")[0]) {
                iValue = $("#" + iValue).find("input")[0].value;
            }

            var stripLine = {
                value: iValue,
                label: iText,
                color: iColor
            }

            stripLines.push(stripLine);
        }
        else if (type = "Tab.") {
            var iTable = $(this).find("select")[0].value;
            var iDataX = $(this).find("select")[1].value;
            var iDataY = $(this).find("select")[2].value;
            var iType = $(this).find("select")[3].value;
            var iColor = $(this).find("input")[0];
            iColor = $(iColor).css("background-color");
             
            var dataTable = {
                Table: iTable,
                DataX: iDataX,
                DataY: iDataY,
                Type: iType,
                Color: iColor
            };
            data.push(dataTable);
        }
    });

    obj.Proprietati["Data"] = [];
    obj.Proprietati["Data"][0] = stripLines;
    obj.Proprietati["Data"][1] = data;
}

function appendConstData(array, dataType) {
    var num_ct = $("#dataSection").find(".const").length;
    var num_xy = $("#dataSection").find(".XYData").length;
    var num_ct_input = $("#dataSection .const").find("input").length;
    var num_xy_input = $("#dataSection .XYData").find("input").length;
    var num_xy_select = $("#dataSection .XYData").find("select").length;

    if (dataType == "const") {
        var inputs = [ "Selecteaza" ];

        getElementsID(array, "Camp de inserare", inputs);          

        $("#dataSection").append(`<div class="dataGraphRow const">
            <div class="dataGraphCell">Const.</div>
            <div class="dataGraphCell"><select id="InsertFieldSel` + num_ct + `"></select></div>
            <div class="dataGraphCell">Culoare: 
                <input class="InsertFieldColor jscolor" id="InsertFieldI` + num_ct_input + `"/>
            </div>
            <div class="dataGraphCell">Text: 
                <input class="" id="InsertField` + (num_ct_input + 1) + `"/>
            </div>
        </div>`);

        addOptions("#InsertFieldSel" + num_ct, inputs[0], inputs);

        var colorInput = $("#InsertFieldI" + num_ct_input);
        var color = new jscolor(colorInput[0]);

        color.borderColor = "#FFF";
        color.backgroundColor = "#666";
        color.valueElement = null;

        colorInput.val("");
        colorInput.on("focus", function() {
            $(this).blur();
        });
    }
    else if (dataType == "XYData") {
        var inputsTab = [ "Selecteaza" ];
        var inputsX = [ "Selecteaza" ];
        var inputsY = [ "Selecteaza" ];
        var inputsTip = [ "line", "bar", "area", "column", "pie", 
            "bubble", "scatter", "spline", "splineArea", "stepLine", "stepArea", 
            "stackedColumn", "stackedColumn100", "stackedArea", "stackedArea100", 
            "stackedBar", "stackedBar100", "doughnut" ];
        
        inputsTip.sort();
        inputsTip.unshift("Selecteaza");

        getElementsID(array, "Tabel", inputsTab);

        $("#dataSection").append(`<div class="dataGraphRow XYData">
            <div class="dataGraphCell">Tab.</div>
            <div class="dataGraphCell"><select id="InsertFieldSelT` + num_xy_select + `"></select></div>
            <div class="dataGraphCell">X:<select id="InsertFieldSelT` + (num_xy_select + 1) + `"></select></div>
            <div class="dataGraphCell">Y:<select id="InsertFieldSelT` + (num_xy_select + 2) + `"></select></div>
            <div class="dataGraphCell">Tip:
                <select id="InsertFieldSelT` + (num_xy_select + 3) + `"></select>
            </div>
            <div class="dataGraphCell">Culoare:
                <input class="InsertFieldColor jscolor" id="InsertFieldT` + num_xy_input + `"/>
            </div>
        </div>`);

        addOptions("#InsertFieldSelT" + num_xy_select, inputsTab[0], inputsTab);
        addOptions("#InsertFieldSelT" + (num_xy_select + 1), inputsX[0], inputsX);
        addOptions("#InsertFieldSelT" + (num_xy_select + 2), inputsY[0], inputsY);
        addOptions("#InsertFieldSelT" + (num_xy_select + 3), inputsTip[0], inputsTip);

        var colorInput = $("#InsertFieldT" + num_xy_input);
        var color = new jscolor(colorInput[0]);

        color.borderColor = "#FFF";
        color.backgroundColor = "#666";
        color.valueElement = null;

        colorInput.val("");
        colorInput.on("focus", function() {
            $(this).blur();
        });

        selectDataXY("#InsertFieldSelT" + num_xy_select,
                     "#InsertFieldSelT" + (num_xy_select + 1), 
                     "#InsertFieldSelT" + (num_xy_select + 2),
                     array);
    }

    $(".dataGraphCell select").css("width", "80px");
}

function selectDataXY(table, inputX, inputY, array) {
    $(table).on("change", function() {
        $(inputX + " option").remove();
        $(inputY + " option").remove();

        var selTab = $(table).find(":selected")[0].innerHTML;
        
        for (var i = 0; i < array.length; i++) {
            if (array[i].Proprietati["ID"] == selTab) {
                var filedAliasName = ["Selecteaza"]; 
                var campuri = array[i].Proprietati["Campuri"];

                filedAliasName = filedAliasName.concat(campuri);

                addOptions(inputX, filedAliasName[0], filedAliasName);
                addOptions(inputY, filedAliasName[0], filedAliasName);

                break;
            }    
        }
    });   
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

function initChart(ID) {
    var options = { 
        title: { text: "Titlu" },
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
    
    var chart = new CanvasJS.Chart(ID, options);
    chart.render();
    
    return chart;
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
};

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
};

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

/*
    TODO:
    - camp inserare                         --partial
    - creaza baza de date/tabel nou(a)      --done
    - formular de adaugare
    - previzualizare

    BONUS:
    - eticheta border
*/

// --------------- main --------------- 
function main() {
    /*global $*/
    /*global jscolor*/
    /*global CanvasJS*/
    
    $("body").css("overflow", "hidden");
    $("#properties").css("right", "-300px");
    
    var sessionOpened = "";
    initTypesSoft();
    buttons(sessionOpened);
}

$(document).ready(main());