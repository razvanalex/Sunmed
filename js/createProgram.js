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

function buttons() {
    $("#exitProgram").on("click", function() {
        window.location.href = "../Session/Admin/AdminPage.php";
    });
    
    $("#closeInit").on("click", function() {
        $("#InitWorkspace").css("visibility", "hidden");
        $("#softContent").removeClass("foreground_window");
    });
    
    $("#create").on("click", function() {
       $("#InitWorkspace").css("visibility", "hidden");
       $("#softContent").removeClass("foreground_window");
       $("#toolbox #contentToolbox li").remove();
       InitToolbox();
    });
    
    $("#newProgram").on("click", function() {
        $("#InitWorkspace").css("visibility", "visible");
        $("#softContent").addClass("foreground_window");
        InitWizard();
    });
}

function InitWizard() {
    $("#s2").hide();
    $("#s1").show();
    
    $("#next").on("click", function() {
        $("#s1").hide();
        $("#s2").show();
    });
}


// ---------------- Program Utilities ----------------
function InitToolbox() {
    var ObjArray = new Array();
    var id = 0;
    
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
}

function CrateObject(array, data, id) {
    var object = $.extend(true, {}, data); // deep copy of object
    
    object.Cod = setText(data.Cod, data.Proprietati.Text);
    object.Proprietati.ID += id;

    appendObject(object, "#preview");

    array.push(object);
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
    
    for (var prop in data.Proprietati)
    {
        if (prop == "Fundal")
            $(id).css("bacckground-color", "#" + data.Proprietati[prop]);
        else if (prop == "Culoare")
            $(id).css("color", "#" + data.Proprietati[prop]);
        else if (prop == "Font")
            $(id).css("font-family", data.Proprietati[prop]);
        else if (prop == "Dimensiune")
            $(id).css("font-size", data.Proprietati[prop] + "px");
        else if (prop == "Bold")
            $(id).css("font-weight", data.Proprietati[prop]);
        else if (prop == "Italic")
            $(id).css("font-style", data.Proprietati[prop]);
        else if (prop == "Aliniere orizontal") {
            if (data.Proprietati[prop] == "Stanga")
                $(id).css("text-align", "left");
            else if (data.Proprietati[prop] == "Dreapta")
                $(id).css("text-align", "right");
            else if (data.Proprietati[prop] == "Centrat")
                $(id).css("text-align", "center");
            else if (data.Proprietati[prop] == "Stanga-Dreapta")
                $(id).css("text-align", "justify"); 
        }
        else if (prop == "Aliniere vertical") {
            $(id).css("display", "table-cell");
            if (data.Proprietati[prop] == "Sus")
                $(id).css("vertical-align", "top");
            else if (data.Proprietati[prop] == "Mijloc")
                $(id).css("vertical-align", "middle");
            else if (data.Proprietati[prop] == "Jos")
                $(id).css("vertical-align", "bottom");
        }
        else if (prop == "Latime") {
            if (data.Proprietati[prop] == "auto")
                $(id).css("width", "auto");
            else $(id).css("width", data.Proprietati[prop] + "px");
        }
        else if (prop == "Inaltime"){
            if (data.Proprietati[prop] == "auto")
                $(id).css("height", "auto");
            else $(id).css("height", data.Proprietati[prop] + "px");
        }
        else if (prop == "Pozitie") {
            $(id).css("position", "absolute");
            $(id).css("left", data.Proprietati[prop].X + "px");
            $(id).css("top", data.Proprietati[prop].Y + "px");
        }
    }
}

function displayProp(obj, array) {
    var bool = ["Da", "Nu"];
    var fonts = ["Arial", "Arial Black", "Arial Narrow", "Calibri", "Candara", "Century Gothic", "Franklin Gothic Medium", 
        "Helvetica", "Lucida Grande", "Optima", "Segoe UI", "Tahoma", "Trebuchet MS", "Verdana", 
        "Book Antiqua", "Calisto MT", "Cambria", "Georgia", "Lucida Bright", "Palatino", "Perpetua", "Rockwell", 
        "Times New Roman", "Baskerville", "Consolas", "Courier New", "Lucida Console", "Lucida Sans Typewriter", 
        "Copperplate", "Papyrus", "Brush Script MT" ];
    var textAlign = ["Stanga", "Dreapta", "Centrat", "Stanga-Dreapta"];
    var verticalAlign = ["Sus", "Mijloc", "Jos"];
    var DBs = [ "Nu" ];
    var Tables = [ "Nu" ];
    
    $("#contentProperties").empty();
    
    for(var prop in obj.Proprietati) {
        var val = obj.Proprietati[prop];
        var color;
        var ID = obj.Proprietati.ID + prop;
        
        if (!isObject(val)) {
            if (prop == "Text") {
                $("#contentProperties").append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span></span><input class='propInput' id='" + 
                    ID +"' value='" + val + "'/></div></li>");
            }
            
            else if (prop == "Fundal") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    `<div class='propVal'><input class="propInput jscolor" id='` + 
                    ID +"' value='" + val + "'/></div></li>");
                    
                var input = $("#contentProperties").find("#" + ID)[0];
                color = new jscolor(input);
                color.borderColor = "#FFF";
                color.backgroundColor = "#666";
            }
            
            else if (prop == "Culoare") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    `<div class='propVal'><input class="propInput jscolor" id='` + 
                    ID +"' value='" + val + "'/></div></li>");
                    
                var input = $("#contentProperties").find("#" + ID)[0];
                color = new jscolor(input);
                color.borderColor = "#FFF";
                color.backgroundColor = "#666";
            }
            
            else if (prop == "Dimensiune") {
                $("#contentProperties").append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span></span><input class='propInput' id='" + 
                ID +"' value='" + val + "'/></div></li>");
            }
            
            else if (prop == "Font") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + ID + "'></select></div></li>");
                    
                fonts.sort();
                addOptions("#" + ID, obj, obj.Proprietati.Font, fonts);
            }
            
            else if (prop == "Bold") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + ID + "'></select></div></li>");
                addOptions("#" + ID, obj, obj.Proprietati.Bold, bool);
            }
            
            else if (prop == "Italic") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + ID + "'></select></div></li>");
                addOptions("#" + ID, obj, obj.Proprietati.Italic, bool);
            }
            
            else if (prop == "Latime") {
                $("#contentProperties").append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span></span><input class='propInput' id='" + 
                    ID +"' value='" + val + "'/></div></li>");
            }
            
            else if (prop == "Inaltime") {
                $("#contentProperties").append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span></span><input class='propInput' id='" + 
                    ID +"' value='" + val + "'/></div></li>");
            }
            
            else if (prop == "Aliniere orizontal") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + obj.Proprietati.ID + "orizontal" + "'></select></div></li>");
                addOptions("#" + obj.Proprietati.ID + "orizontal", obj, obj.Proprietati[prop], textAlign);
            }
            
            else if (prop == "Aliniere vertical") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + obj.Proprietati.ID + "vertical" + "'></select></div></li>");
                addOptions("#" + obj.Proprietati.ID + "vertical", obj, obj.Proprietati[prop], verticalAlign);
            }
            
            else if (prop == "Baza de date") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + obj.Proprietati.ID + "DBs" + "'></select></div></li>");
                AddDBs(obj, prop, DBs);
            }
                        
            else if (prop == "Tabel") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><select id='" + obj.Proprietati.ID + "Tables" + "'></select></div></li>");
                AddTables(obj, prop, Tables);
            }
            
            else {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'>" + val + "</div></li>");
            }    
        }
        else {
            if (prop == "Pozitie") {
                $("#contentProperties").append("<li class='convertSpanInput toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'><span>Selecteaza</span><input class='propInput' id='" + 
                     ID + "' value='X=" + val.X + "; Y=" + val.Y + "'/></div></li>");
            }
            
            else if (prop == "Campuri") {
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal CampuriUl'><div id='" + obj.Proprietati.ID +
                    prop + "'style='width: 170px; overflow: auto;'><span></span><ul></ul></div></div></li>");
                AddFields(obj, prop);
            }
            
            else {
                var resTxt = "";
                for(var subprop in val) {
                   resTxt += subprop + "=" + val[subprop] + " ";
                }
                $("#contentProperties").append("<li class='toolItem'>" +
                    "<div class='propText'>" + prop + ": </div>" +
                    "<div class='propVal'>" + resTxt + "</div></li>");
            }
        }
        
        editData(obj, prop, color);
    }
 
    if (obj.Nume == "Tabel") {
        $("#contentProperties").append("<li class='toolItem'>" +
            "<div class='CreateDB' id='" + ID + "GenerateTable'><span>Genereaza tabel</span></div></li>");
        $("#contentProperties").append("<li class='toolItem'>" +
            "<div class='CreateDB' id='" + ID + "CreateDB'><span>Creaza baza de date noua</span></div></li>");
        
        GenerateTable(obj, ID);
    }
        
    $("#contentProperties").append("<li class='toolItem'>" +
        "<div class='remove' id='" + ID + "Remove'><span>Sterge</span></div></li>");
        
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
        $("#properties").animate({
            "right": "-300px"
        });
        $("#contentProperties").empty();
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

function editData(obj, prop, color) {
    var id = "#" + obj.Proprietati.ID + prop;
    
    if (prop == "Text") {
        $(id).keyup(function () {
            $("#" + obj.Proprietati.ID + " span").text($(this).val());
            obj.Proprietati[prop] = $(this).val();
        });
    }
    else if (prop == "Fundal") {
        color.obj = obj;
        color.onFineChange = 'editBackground(this)';
    } 
    else if (prop == "Culoare") {
        color.obj = obj;
        color.onFineChange = 'editColor(this)';
    }
    else if (prop == "Font") {
        $(id).on("change", function() {
            var selFont = $(this).find(":selected").text();
            $("#" + obj.Proprietati.ID).css("font-family", selFont);
            obj.Proprietati[prop] = selFont;
        });
    }
    else if (prop == "Dimensiune") {
        $(id).keyup(function () {
            var maxSize = 100;
            if ($(this).val() <= maxSize) {
                $("#" + obj.Proprietati.ID).css("font-size", $(this).val() + "px");
                obj.Proprietati[prop] = $(this).val();
            }
            else {
                $("#" + obj.Proprietati.ID).css("font-size", maxSize + "px");
                obj.Proprietati[prop] = maxSize;
            }
            if ($(this).val() == "") {
                $("#" + obj.Proprietati.ID).css("font-size", 12 + "px");
                obj.Proprietati[prop] = 12;
                $("#" + obj.Proprietati.ID + prop + " span").text(12);
            }
        });
    }
    else if (prop == "Bold") {
        var oldVal = $("#" + obj.Proprietati.ID).css("font-weight");

        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Da")
                $("#" + obj.Proprietati.ID).css("font-weight", "bold");
            else $("#" + obj.Proprietati.ID).css("font-weight", oldVal);
            
            obj.Proprietati[prop] = selBool;
        });
    }
    else if (prop == "Italic") {
        var oldVal = $("#" + obj.Proprietati.ID).css("font-style");

        $(id).on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Da")
                $("#" + obj.Proprietati.ID).css("font-style", "italic");
            else $("#" + obj.Proprietati.ID).css("font-style", oldVal);
            
            obj.Proprietati[prop] = selBool;
        });
    }
    else if (prop == "Latime") {
        $(id).keyup(function () {
            if ($(this).val() != "auto") 
                $("#" + obj.Proprietati.ID).css("width", $(this).val() + "px");
            else $("#" + obj.Proprietati.ID).css("width", "auto");
            
            obj.Proprietati[prop] = $(this).val();
            if ($(this).val() == "") {
                $("#" + obj.Proprietati.ID).css("width", "auto");
                obj.Proprietati[prop] = "auto";
                $("#" + obj.Proprietati.ID + prop + " span").text("auto");
            }
            fixAlign(obj);
        });
    }
    else if (prop == "Inaltime") {
        $(id).keyup(function () {
            if ($(this).val() != "auto") 
                $("#" + obj.Proprietati.ID).css("height", $(this).val() + "px");
            else $("#" + obj.Proprietati.ID).css("height", "auto");
            
            obj.Proprietati[prop] = $(this).val();
            if ($(this).val() == "") {
                $("#" + obj.Proprietati.ID).css("height", "auto");
                obj.Proprietati[prop] = "auto";
                $("#" + obj.Proprietati.ID + prop + " span").text("auto");
            }
            fixAlign(obj);
        });
    }
    else if (prop == "Aliniere orizontal") {
        var oldVal = $("#" + obj.Proprietati.ID).css("text-align");

        $("#" + obj.Proprietati.ID + "orizontal").on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Stanga")
                $("#" + obj.Proprietati.ID).css("text-align", "left");
            else if (selBool == "Dreapta")
                $("#" + obj.Proprietati.ID).css("text-align", "right");
            else if (selBool == "Centrat")
                $("#" + obj.Proprietati.ID).css("text-align", "center");
            else if (selBool == "Stanga-Dreapta")
                $("#" + obj.Proprietati.ID).css("text-align", "justify"); 
            else $("#" + obj.Proprietati.ID).css("text-align", oldVal);
            
            obj.Proprietati[prop] = selBool;
            fixAlign(obj);
        });
    }
    else if (prop == "Aliniere vertical") {
        var oldVal = $("#" + obj.Proprietati.ID).css("vertical-align");

        $("#" + obj.Proprietati.ID + "vertical").on("change", function() {
            var selBool = $(this).find(":selected").text();
            
            if (selBool == "Sus")
                $("#" + obj.Proprietati.ID).find("span").css("vertical-align", "top");
            else if (selBool == "Mijloc")
                $("#" + obj.Proprietati.ID).find("span").css("vertical-align", "middle");
            else if (selBool == "Jos")
                $("#" + obj.Proprietati.ID).find("span").css("vertical-align", "bottom");
            else $("#" + obj.Proprietati.ID).find("span").css("vertical-align", oldVal);
            
            obj.Proprietati[prop] = selBool;
            fixAlign(obj);
        });
    }
    else if (prop == "Baza de date") {
        var SelectorDB = $("#" + obj.Proprietati.ID + "DBs");
        SelectorDB.on("change", function() {
            var selectedDB = SelectorDB.find(":selected").text();
            obj.Proprietati[prop] = selectedDB;
        });
    }
    else if (prop == "Tabel") {
        var SelectorTable = $("#" + obj.Proprietati.ID + "Tables");
        SelectorTable.on("change", function() {
            var selectedTable = SelectorTable.find(":selected").text();
            obj.Proprietati[prop] = selectedTable;
        });
    }
    else if (prop == "Tabel") {
        var SelectorTable = $("#" + obj.Proprietati.ID + "Tables");
        SelectorTable.on("change", function() {
            var selectedTable = SelectorTable.find(":selected").text();
            obj.Proprietati[prop] = selectedTable;
        });
    }
    else if (prop == "Campuri") {
         var span = $("#" + obj.Proprietati.ID + prop + " span");
         if (obj.Proprietati.Campuri.length == 0)
            span.text("Selecteaza");
        else {
            span.text(obj.Proprietati.Campuri);
            span.text(span.text().replace(/,/g, ", "));
        }
    }
    else if (prop == "Pozitie") {
        $(id).keyup(function () {
            var X = $(this).val().split(';')[0];
            var Y = $(this).val().split(';')[1];
            
            X = X.split('=')[1];
            Y = Y.split('=')[1];
            
            $("#" + obj.Proprietati.ID).css("left", X + "px");
            $("#" + obj.Proprietati.ID).css("top", Y + "px");
            obj.Proprietati[prop].X = X;
            obj.Proprietati[prop].Y = Y;
        });
    }
}

function editColor(color) {
    var HEXcolor = color.toHEXString();
    var obj = color.obj;
    $("#" + obj.Proprietati.ID).css("color", HEXcolor);
    obj.Proprietati["Culoare"] = HEXcolor.substring(1, HEXcolor.length);
}

function editBackground(color) {
    var HEXcolor = color.toHEXString();
    var obj = color.obj;
    $("#" + obj.Proprietati.ID).css("background-color", HEXcolor);
    obj.Proprietati["Fundal"] = HEXcolor.substring(1, HEXcolor.length);
}

function fixAlign(obj) {
    var span = $("#" + obj.Proprietati.ID).find("span");
    span.css("display", "table-cell");
    span.css("height", obj.Proprietati.Inaltime);
    span.css("width", obj.Proprietati.Latime);
}

function addOptions(selection, obj, prop, array) {
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
            $("#contentProperties").empty();
        }
    }
}

function AddDBs(obj, prop, DBs) {
    $.getJSON("../../json/tabele.json", function(data) {
        $.each(data, function() {
            DBs.push(this.numeDB);
        });
        $("#" + obj.Proprietati.ID + "DBs").on("change", function() {
            $("#" + obj.Proprietati.ID + prop + " span").text("Selecteaza");
            $("#" + obj.Proprietati.ID + "Tables").val($("#" + obj.Proprietati.ID + "Tables option:first").val());
            obj.Proprietati.Campuri = [];
        });
        
        addOptions("#" + obj.Proprietati.ID + "DBs", obj, obj.Proprietati[prop], DBs);
    });
}

function CreateArrayTables(data, obj, prop, Tables) {
    $.each(data, function() {
        var DB = this;
        var span = $("#" + obj.Proprietati.ID + prop + " span");
        Tables.length = 0;
        Tables.push("Nu");
        
        var selectedDB = $("#" + obj.Proprietati.ID + "DBs").find(":selected").text();
        if (DB.numeDB == selectedDB) {
            $.each(DB.tabele, function() {
                Tables.push(this.nume);
            });
            $("#" + obj.Proprietati.ID + "Tables option").remove();
            addOptions("#" + obj.Proprietati.ID + "Tables", obj, obj.Proprietati[prop], Tables);
        }
        else if (selectedDB == "Nu") {
            Tables.length = 0;
            Tables.push("Nu");
            $("#" + obj.Proprietati.ID + "Tables option").remove();
            addOptions("#" + obj.Proprietati.ID + "Tables", obj, obj.Proprietati[prop], Tables);
            obj.Proprietati.Campuri = [];
            span.text("Selecteaza");
        }
    });
}

function AddTables(obj, prop, Tables) {
    $.getJSON("../../json/tabele.json", function(data) {
        $("#" + obj.Proprietati.ID + "Tables option").remove();
        addOptions("#" + obj.Proprietati.ID + "Tables", obj, obj.Proprietati[prop], Tables);
        CreateArrayTables(data, obj, prop, Tables);
        
        $("#" + obj.Proprietati.ID + "DBs").on("change", function() {
            $("#" + obj.Proprietati.ID + prop + " span").text("Selecteaza");
            obj.Proprietati.Campuri = [];
            
            CreateArrayTables(data, obj, prop, Tables);
            $("#" + obj.Proprietati.ID + "Tables").val($("#" + obj.Proprietati.ID + "Tables option:first").val());
        });
    });
}

function MultiCheckbox(selection, obj, prop, array) {
    for (var val in array) {
        $(selection).append(`<li><input type="checkbox" value="` + 
            array[val] + `"/>` + array[val] + `</li>`);
            
            if (obj.Proprietati.Campuri.indexOf(array[val]) >= 0) {
                $(selection + " input[value='" + array[val] + "']").prop('checked', true);
            }
            else $(selection + " input[value='" + array[val] + "']").prop('checked', false);
    }
    $(selection).val(prop);
}

function CreateField(obj, prop, data) {
    var numeTable = $("#" + obj.Proprietati.ID + "Tables").val();
    var numeDB = $("#" + obj.Proprietati.ID + "DBs").val();
    var Fields = [];
    var ID = "#" + obj.Proprietati.ID + prop;
    var span = $("#" + obj.Proprietati.ID + prop + " span");

    for (var DB in data) 
        if (numeDB == data[DB].numeDB)
            for (var tabel in data[DB].tabele) {
                if (numeTable == data[DB].tabele[tabel].nume)  {
                    for (var camp in data[DB].tabele[tabel].alias_campuri) {
                        Fields.push(data[DB].tabele[tabel].alias_campuri[camp]);
                    }
                }
            }
            
    if (numeTable == "Nu" || numeDB == "Nu") {
        obj.Proprietati.Campuri = [];
        span.text("Selecteaza");
    }
   
    $(ID + " li").remove();
    
    MultiCheckbox(ID + " ul", obj, obj.Proprietati[prop], Fields);
    $(ID + " ul").val($(ID + " option:first").val());
    
    $(ID + " input:checkbox").change(function() {
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
            obj.Proprietati.Campuri = [];
            span.text("Selecteaza");
        }
        obj.Proprietati.Campuri = array;
    });

}

function AddFields(obj, prop) {
    $.getJSON("../../json/tabele.json", function(data) {
        var ID = "#" + obj.Proprietati.ID + prop;
        var SelectBlock =  $(ID + " ul");
        var span = $("#" + obj.Proprietati.ID + prop + " span");
         
        SelectBlock.hide();
        $(ID + " span").on("click", function() {
            SelectBlock.toggle();
        });
        
        CreateField(obj, prop, data);
        $("#" + obj.Proprietati.ID + "Tables").on("change", function() {
            span.text("Selecteaza");
            CreateField(obj, prop, data);
        });
    });
}

function GenerateTable(obj, ID) {
    $("#" + ID + "GenerateTable").on("click", function() {
        var TDs = "";
        var fields = obj.Proprietati.Campuri;
        
        for (var f in fields) {
            TDs += "<td>" + fields[f] + "</td>";
        }
        
        var TR = "<tr>" + TDs + "</tr>";
        $("#" + obj.Proprietati.ID + " tbody tr").remove();
        $("#" + obj.Proprietati.ID + " thead tr").remove();
        $("#" + obj.Proprietati.ID + " thead").append(TR);
    });
}

/*
    KNOWN BUGS
    - "Nu" => table
    - Table format
    - create DB/Table
*/


// --------------- main --------------- 
function main() {
    /*global $*/
    /*global jscolor*/
    
    $("body").css("overflow", "hidden");
    $("#properties").css("right", "-300px");
    
    initTypesSoft();
    buttons();
}

$(document).ready(main());